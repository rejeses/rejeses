"use client";
import React, { useEffect, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import data from "@/utils/data/schedule.json";
import Image from "next/image";
import Link from "next/link";
import { DownloadIcon } from "@radix-ui/react-icons";
import { Class, ScheduleData, TrainingOption1 } from "@/utils/types/types";
import { usePayment } from "@/utils/context/payment";

const { days, times } = data as ScheduleData;

interface SchedulePropsData {
  data: Class[];
  all: TrainingOption1;
}

export default function ClassSchedule(props: SchedulePropsData) {
  const scheduleRef = useRef<HTMLDivElement>(null);
  const { paymentInfo } = usePayment();

  const downloadPdf = async () => {
    if (scheduleRef.current) {
      const canvas = await html2canvas(scheduleRef.current);
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

  const getPriceData = () => {
    const item = props.all.pricing.individuals.find(
      (item) => item.training_only?.price
    );
    return paymentInfo.price || item?.training_only?.price;
  };

  return (
    <div className="flex flex-col items-center px-6 md:max-w-[90%] gap-6 w-full my-4 mt-12">
      <div className="flex flex-col w-full gap-4">
        <h1 className="lg:text-4xl text-2xl font-bold font-bricolage_grotesque">
          Class Schedule
        </h1>
        <p>
          For students who are unable to join the live sessions due to
          conflicting schedules, the recording of any live class you miss will
          be sent to you 3-5 hours after the class ends.
        </p>
      </div>
      <div ref={scheduleRef} className="w-full overflow-x-auto">
        <table className="min-w-full border-collapse font-bricolage_grotesque">
          <thead className="bg-[#deffb3] text-[#89C13E] font-bold">
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
                <td className="border border-black md:p-6 md:w-[100px] md:h-[100px] p-2 text-xs sm:text-sm bg-[#deffb3] text-[#89C13E] font-bold">
                  {day}
                </td>
                {times.map((time) => (
                  <td
                    key={time}
                    className="border border-black md:p-6 p-2 text-center"
                  >
                    {isClassScheduled(day, time) ? (
                      <Image
                        src="/check.svg"
                        alt="check-mark"
                        width={20}
                        height={20}
                        className="mx-auto"
                      />
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
          href={``}
          className="bg-[#89C13E] text-white px-12 py-4 flex justify-center items-center rounded-md w-full sm:w-auto text-xs sm:text-sm"
        >
          Pay now ${getPriceData()}
        </Link>
        <button
          onClick={downloadPdf}
          className="text-[#89C13E] bg-white px-12 py-4 flex justify-center items-center rounded-md border border-[#DBE1E7] w-full sm:w-auto text-xs sm:text-sm"
        >
          <DownloadIcon color="#89C13E" className="mr-2" />
          Download Schedule
        </button>
      </div>
    </div>
  );
}