"use client";
import React, { useEffect, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import data from "@/utils/data/schedule.json";
import Image from "next/image";
import Link from "next/link";
import { DownloadIcon } from "@radix-ui/react-icons";
import {
  Class,
  ScheduleData,
  TrainingOption,
  TrainingOption1,
} from "@/utils/types/types";
import { usePayment } from "@/utils/context/payment";
import { useNavigation } from "@/utils/context/payment";
import { usePathname } from "next/navigation";
import { notify } from "@/utils/reusables/functions";
import data2 from "@/utils/data/training_data.json";

const { days, times } = data as ScheduleData;

interface SchedulePropsData {
  data: Class[];
  all: TrainingOption1;
  promo: boolean;
  promoPrices?: {
    dollarprice: number;
    nairaPrice: number;
  };
}

export default function ClassSchedule(props: SchedulePropsData) {
  const scheduleRef = useRef<HTMLDivElement>(null);
  const { paymentInfo, setPaymentInfo, selectedType } = usePayment();
  const { isNigeria } = useNavigation();
  const pathname = usePathname();

  const downloadPdf = async () => {
    if (scheduleRef.current) {
      // Store the original overflow style
      const originalOverflow = scheduleRef.current.style.overflow;
      const originalWidth = scheduleRef.current.style.width;

      // Set overflow to visible to capture the entire content
      scheduleRef.current.style.overflow = "visible";
      scheduleRef.current.style.width = "fit-content";

      const canvas = await html2canvas(scheduleRef.current, {
        scale: window.devicePixelRatio || 1,
        useCORS: true,
        logging: true,
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.scrollWidth, // Set to full content width
        windowHeight: document.documentElement.scrollHeight, // Set to full content height
      });

      // Restore the original overflow style
      scheduleRef.current.style.overflow = originalOverflow;
      scheduleRef.current.style.width = originalWidth;

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("landscape", "pt", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Rejeses (${props.all.title}) training schedule`);
    }
  };

  const isClassScheduled = (day: string, time: string): boolean => {
    return props.data.some((s) => s.day === day && s.time === time);
  };

  function formatPrice(price: number | undefined): string | undefined {
    if (price && price >= 1000) {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      if (price) {
        return price.toString();
      }
    }
  }

  const individualPrice = props.all.pricing.individuals
    .map((item) =>
      isNigeria
        ? Number(item.training_only?.price)
        : Number(item.training_only?.price2)
    )
    .filter((price) => !isNaN(price))[0];

  const individualPrice2 = props.all.pricing.individuals
    .map((item) =>
      isNigeria
        ? Number(item.training_only?.price2)
        : Number(item.training_only?.price)
    )
    .filter((price) => !isNaN(price))[0];

  // Update payment information
  const BacktoSummary = () => {
    let mentoringprice: any;
    let trainingprice: TrainingOption | undefined;
    if (props.promo) {
      mentoringprice =
        props.all.pricing.individuals[0].training_with_mentorship;

      trainingprice = props.all.pricing.individuals[1].training_only;
    }

    console.log(mentoringprice, "is ment price");
    console.log(trainingprice, "is train price");
    console.log(props.all, "all");
    console.log(props.data, "data");
    console.log(props.promo, "isPromo");

    setPaymentInfo((prev) => ({
      ...prev,
      price: props.promo
        ? props.promoPrices?.dollarprice || 0
        : individualPrice,
      price2: props.promo
        ? props.promoPrices?.nairaPrice || 0
        : individualPrice2,
      training_id: props.all.id,
      training_type:
        props.promo && selectedType === "training"
          ? "Project Management Training"
          : props.promo && selectedType === "training&mentoring"
          ? "Project Management Training & Mentoring"
          : "Project Management Training",
      start_date: props.all.start_date,
      training_option: `You are subscribing to <b>rejeses consult</b> ${
        props.promo && selectedType === "training"
          ? "35-hour training plan"
          : props.promo && selectedType === "training&mentoring"
          ? "35-hour training and mentoring plan"
          : "35-hour training plan"
      }. You will be charged ${isNigeria ? "NGN " : "$"}${formatPrice(
        props.promo && isNigeria
          ? props.promoPrices?.nairaPrice
          : props.promo && !isNigeria
          ? props.promoPrices?.dollarprice
          : individualPrice2
      )} for this.`,
      is_group: false,
    }));
  };

  const notifyuser = () => {
    if (
      props.promo &&
      (paymentInfo.start_date === "1st March, 2034" ||
        !paymentInfo.start_date ||
        paymentInfo.start_date === "")
    ) {
      notify("select a training schedule");
    }
  };

  const routetoPath = (): string => {
    if (
      props.promo &&
      (paymentInfo.start_date === "1st March, 2034" ||
        !paymentInfo.start_date ||
        paymentInfo.start_date === "")
    ) {
      return "";
    } else {
      return `/training/${paymentInfo.training_id}`;
    }
  };

  useEffect(() => {
    BacktoSummary();
  }, [isNigeria]);

  useEffect(() => {
    console.log(props.promoPrices, "class");
  }, []);

  useEffect(() => {
    console.log(props, "class scg");
    console.log(paymentInfo, "at class sched");
  }, [props, paymentInfo]);

  return (
    <div className="flex flex-col items-center px-6 md:max-w-[90%] gap-6 w-full my-4 mt-12">
      <div className="flex flex-col w-full gap-4">
        <h1 className="lg:text-5xl text-3xl font-bold font-bricolage_grotesque">
          Class Schedule
        </h1>
        <div className="lg:text-[22px] text-[16px] space-y-4 leading-relaxed">
          <p>This program is arranged according to the following schedule:</p>
          <p>
            <strong className="font-bricolage_grotesque">
              Weekday Classes
            </strong>
            : These run from{" "}
            <strong className="font-bricolage_grotesque">
              Monday to Friday, 09:00 to 16:00 (CET/WAT)
            </strong>
            , and the course is completed in
            <strong className="font-bricolage_grotesque"> five days</strong>.
          </p>
          <p>
            <strong className="font-bricolage_grotesque">
              Weekend Classes
            </strong>
            : These run for{" "}
            <strong className="font-bricolage_grotesque">
              two weekends only
            </strong>
            , and the course is completed in
            <strong className="font-bricolage_grotesque"> four days:</strong>
          </p>

          <ul className="list-disc list-inside pl-4">
            <li>
              <strong className="font-bricolage_grotesque">Saturdays</strong>:{" "}
              <strong className="font-bricolage_grotesque">
                08:00 to 17:00 (CET/WAT)
              </strong>
            </li>
            <li>
              <strong className="font-bricolage_grotesque">Sundays</strong>:{" "}
              <strong className="font-bricolage_grotesque">
                12:00 to 20:00 (CET/WAT)
              </strong>
            </li>
          </ul>
        </div>
      </div>
      <div ref={scheduleRef} className="w-full overflow-x-auto">
        <table className="min-w-full border-collapse font-bricolage_grotesque">
          <thead
            className={`${
              pathname.includes("promo")
                ? "text-[#4B006E] bg-[#5b0c7a75]"
                : "text-[#89C13E] bg-[#ECF5E0]"
            } font-bold`}
          >
            <tr>
              <th className="border border-black md:p-6 p-2 md:w-[100px] md:h-[100px] text-xs sm:text-sm">
                Day
              </th>
              {times.map((time) => (
                <th
                  key={time}
                  className="border border-black md:p-6 p-2 text-xs sm:text-sm"
                >
                  {time}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day}>
                <td
                  className={`border border-black md:p-6 md:w-[100px] md:h-[100px] p-2 text-xs sm:text-sm ${
                    pathname.includes("promo")
                      ? "text-[#4B006E] bg-[#5b0c7a75]"
                      : "text-[#89C13E] bg-[#ECF5E0]"
                  } font-bold`}
                >
                  {day}
                </td>
                {times.map((time) => (
                  <td
                    key={time}
                    className="border border-black md:p-6 p-2 text-center"
                  >
                    {isClassScheduled(day, time) ? (
                      pathname.includes("promo") ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5 text-white rounded-full bg-[#4B006E] mx-auto"
                        >
                          <path d="M20.285 6.709a1 1 0 00-1.414-1.418l-9.192 9.193-4.243-4.243a1 1 0 10-1.414 1.415l5 5a1 1 0 001.414 0l10-10z" />
                        </svg>
                      ) : (
                        <Image
                          src="/check.svg"
                          alt="check-mark"
                          width={20}
                          height={20}
                          className="mx-auto"
                        />
                      )
                    ) : (
                      ""
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center py-6 gap-4 w-full font-medium font-bricolage_grotesque">
        <Link
          onClick={notifyuser}
          href={routetoPath()}
          className={`${
            pathname.includes("promo") ? "bg-[#4B006E]" : "bg-[#89C13E]"
          } text-white px-12 py-4 flex justify-center items-center rounded-md w-full sm:w-auto text-xs sm:text-sm`}
        >
          Pay now {isNigeria ? "NGN " : "$"}
          {isNigeria
            ? formatPrice(
                props.promo && pathname.includes("/promo")
                  ? props.promoPrices?.nairaPrice
                  : individualPrice2
              ) || 0
            : formatPrice(
                props.promo && pathname.includes("/promo")
                  ? props.promoPrices?.dollarprice
                  : individualPrice
              ) || 0}
        </Link>
        <button
          onClick={downloadPdf}
          className={`${
            pathname.includes("promo") ? "text-[#4B006E]" : "text-[#89C13E]"
          } bg-white px-12 py-4 flex justify-center items-center rounded-md border border-[#DBE1E7] w-full sm:w-auto text-xs sm:text-sm cursor-pointer`}
        >
          <DownloadIcon
            color={pathname.includes("promo") ? "#4B006E" : "#89C13E"}
            className="mr-2"
          />
          Download Schedule
        </button>
      </div>
    </div>
  );
}
