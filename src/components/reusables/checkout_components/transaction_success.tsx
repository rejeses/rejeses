"use client";
import { TransactionDataType, OrderDataType } from "@/utils/types/types";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, Fragment } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  formatDate,
  formatCourseSchedule,
  formatSingleDate,
  capitalizeCourseScheduleType,
} from "@/utils/reusables/functions";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Loading from "@/app/feed/loading";
import { useNavigation } from "@/utils/context/payment";
import { JSX } from "react";

type TransactionSuccessProps = Partial<
  Omit<TransactionDataType, "accessCode" | "fee" | "createdAt">
>;

type TransactionOrder = Partial<
  Omit<OrderDataType, "createdAt" | "updatedAt" | "id" | "email">
>;

export default function Transaction_success({
  data,
  order,
  close,
}: {
  data: TransactionSuccessProps;
  order: TransactionOrder;
  close: () => void;
}) {
  const receiptRef = useRef<HTMLDivElement>(null);

  function formatPrice(price: number | undefined): string | undefined {
    if (price && price >= 1000) {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      if (price) {
        return price.toString();
      }
    }
  }

  const router = useRouter();

  const returnBtnClick = () => {
    router.push("/");
  };

  const [copyingData, setCopyingData] = useState<boolean>(false);
  const downloadTransactReceipt = async () => {
    if (receiptRef.current) {
      try {
        setCopyingData(true);
        // Create clone with proper styling
        const receiptClone = receiptRef.current.cloneNode(true) as HTMLElement;
        const container = document.createElement("div");

        container.style.width = `${receiptRef.current.offsetWidth}px`;
        container.style.backgroundColor = "white";
        container.style.position = "absolute";
        container.style.left = "-9999px";
        container.style.padding = "64px 16px";

        // Copy all styles
        const originalElements = receiptRef.current.getElementsByTagName("*");
        const cloneElements = receiptClone.getElementsByTagName("*");

        for (let i = 0; i < originalElements.length; i++) {
          const originalStyle = window.getComputedStyle(originalElements[i]);
          const cloneElement = cloneElements[i] as HTMLElement;

          Array.from(originalStyle).forEach((key) => {
            cloneElement.style[key as any] =
              originalStyle.getPropertyValue(key);
          });

          if (originalStyle.display === "flex") {
            cloneElement.style.display = "flex";
            cloneElement.style.justifyContent = originalStyle.justifyContent;
            cloneElement.style.alignItems = originalStyle.alignItems;
          }
        }

        container.appendChild(receiptClone);
        document.body.appendChild(container);

        const canvas = await html2canvas(container, {
          scale: 2,
          useCORS: true,
          logging: false,
          allowTaint: true,
          backgroundColor: "#ffffff",
          windowHeight: container.scrollHeight,
          height: container.scrollHeight,
          onclone: (clonedDoc) => {
            const style = clonedDoc.createElement("style");
            style.textContent = `
              @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;700&display=swap');
              * { font-family: 'Bricolage Grotesque', sans-serif; }
            `;
            clonedDoc.head.appendChild(style);
          },
        });

        document.body.removeChild(container);

        const imgData = canvas.toDataURL("image/png", 1.0);

        // Create PDF with proper dimensions
        const pdf = new jsPDF("p", "pt", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Calculate the number of pages needed
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        // Set a fixed width that fits the page with margins
        const margin = 40;
        const availableWidth = pageWidth - 2 * margin;
        const scaleFactor = availableWidth / imgWidth;
        const scaledHeight = imgHeight * scaleFactor;

        // Split into multiple pages if needed
        let heightLeft = scaledHeight;
        let position = 0;
        let page = 1;

        // First page
        pdf.addImage(
          imgData,
          "PNG",
          margin,
          position + margin,
          availableWidth,
          scaledHeight
        );
        heightLeft -= pageHeight - 2 * margin;

        // Add new pages if content exceeds page height
        while (heightLeft > 0) {
          pdf.addPage();
          page++;
          position = -(pageHeight - 2 * margin) * (page - 1);

          pdf.addImage(
            imgData,
            "PNG",
            margin,
            position + margin,
            availableWidth,
            scaledHeight
          );

          heightLeft -= pageHeight - 2 * margin;
        }

        pdf.save(`Rejeses_payment_receipt_${data?.txid || "confirmation"}.pdf`);
        setCopyingData(false);
      } catch (error) {
        console.error("Error generating PDF:", error);
        setCopyingData(false);
      }
    }
  };

  const { isMobile, width } = useNavigation();
  const formatReceiptCourseSchedule = (
    dates: Date | string | (Date | string)[]
  ): JSX.Element => {
    // Format individual dates
    const formatDate = (date: Date | string): string => {
      const parsedDate = typeof date === "string" ? new Date(date) : date;
      const day = parsedDate.getDate();
      const dayName = parsedDate.toLocaleDateString("en-US", {
        weekday: isMobile && width <= 767 ? "short" : "long",
      });
      const monthName = parsedDate.toLocaleDateString("en-US", {
        month: isMobile && width <= 767 ? "short" : "long",
      });
      const year = parsedDate.getFullYear();

      return `${dayName}, ${monthName} ${day}, ${year}`;
    };

    // Normalize input to an array
    const dateArray = Array.isArray(dates) ? dates : [dates];

    // Format all dates
    const formattedDates = dateArray.map((date, index) => (
      <Fragment key={index}>
        {formatDate(date)}
        <br />
      </Fragment>
    ));

    return <>{formattedDates}</>;
  };

  return (
    <motion.div
      initial={{ x: "100vw" }}
      animate={{ x: 0 }}
      exit={{ x: "100vw" }}
      transition={{ duration: 0.5 }}
      className="lg:w-[45%] w-[95%] bg-white md:w-3/4 h-screen fixed gap-y-10 right-0 top-0 z-20 shadow-md shadow-[#0000000D] px-4 py-12 flex flex-col overflow-auto"
    >
      <button
        onClick={() => {
          close();
          setTimeout(() => router.push("/"), 500);
        }}
        aria-label="close"
        className="w-8 h-8 rounded-full border border-[#DBE1E7] absolute right-10 top-8 text-[#090909] flex justify-center items-center"
      >
        X
      </button>

      <div className="w-full flex flex-col justify-between">
        <div
          className="w-full flex flex-col py-16"
          ref={receiptRef}
          style={{ pageBreakInside: copyingData ? "avoid" : "inherit" }}
        >
          <div className="w-full flex flex-col justify-center items-center">
            <Image src="/success.svg" width={80} height={80} alt="Success" />
            <h1 className="font-bold lg:text-4xl text-2xl text-center my-4 lg:mb-12 font-bricolage_grotesque">
              Transaction Successful
            </h1>
          </div>

          <div className="w-full border border-[#DBE1E7] px-4 py-2 rounded-md font-bricolage_grotesque">
            <div className="lg:my-4 font-bold border-b border-[#DBE1E7] py-2">
              <li className="list-none flex justify-between items-center">
                TXID:
                <span className="mx-4 inline-flex w-2/4 justify-end">
                  {data?.txid || "N/A"}
                </span>
              </li>
            </div>

            <div className="lg:my-4 font-bold border-b border-[#DBE1E7] py-2">
              <li className="list-none flex justify-between items-center">
                NAME:
                <span className="mx-4 inline-flex w-2/4 justify-end">
                  {`${order?.firstName?.toLocaleUpperCase()} ${order.lastName?.toUpperCase()}` ||
                    "N/A"}
                </span>
              </li>
            </div>

            <div className="lg:my-4 font-bold border-b border-[#DBE1E7] py-2">
              <li className="list-none flex justify-between items-center">
                REFERENCE:
                <span className="mx-4 inline-flex w-2/4 justify-end">
                  {data?.reference || "N/A"}
                </span>
              </li>
            </div>

            <div className="lg:my-4 font-bold border-b border-[#DBE1E7] py-2">
              <li className="list-none flex justify-between items-center">
                PAYMENT ID:
                <span className="mx-4 inline-flex w-2/4 justify-end">
                  {data?.pid || "N/A"}
                </span>
              </li>
            </div>

            <div className="lg:my-4 font-bold border-b border-[#DBE1E7] py-2">
              <li className="list-none flex justify-between items-center">
                CURRENCY:
                <span className="mx-4 inline-flex w-2/4 justify-end">
                  {data.currency && data?.currency === "naira"
                    ? "NAIRA"
                    : "DOLLAR"}
                </span>
              </li>
            </div>

            <div className="lg:my-4 font-bold border-b border-[#DBE1E7] py-2">
              <li className="list-none flex justify-between items-center">
                PROGRAM:
                <span className="mx-4 inline-flex w-2/4 justify-end">
                  {order?.courseType || "N/A"}
                </span>
              </li>
            </div>

            <div className="lg:my-4 font-bold border-b border-[#DBE1E7] py-2">
              <li className="list-none flex justify-between items-center">
                PAYMENT DATE:
                <span className="mx-4 inline-flex w-2/4 justify-end">
                  {data.updatedAt
                    ? new Date(data.updatedAt).toLocaleString("en-GB")
                    : "N/A"}
                </span>
              </li>
            </div>

            <div className="lg:my-4 font-bold border-b border-[#DBE1E7] py-2">
              <li className="list-none flex justify-between items-center">
                START DATE:
                <span className="mx-4 inline-flex w-2/4 justify-end">
                  {order.courseType && order.courseType.includes("Mentoring")
                    ? "Rejeses will contact you"
                    : order.courseSchedule &&
                      order.courseScheduleType === "weekend"
                    ? formatReceiptCourseSchedule(order.courseSchedule[0])
                    : formatReceiptCourseSchedule(order.startDate || "N/A") ||
                      "N/A"}
                </span>
              </li>
            </div>

            {order.courseScheduleType &&
              !order.courseType?.includes("Mentoring") && (
                <div className="lg:my-4 font-bold border-b border-[#DBE1E7] py-2">
                  <li className="list-none flex justify-between items-center">
                    SCHEDULE TYPE:
                    <span className="mx-4 inline-flex w-2/4 justify-end">
                      {capitalizeCourseScheduleType(order.courseScheduleType)}
                    </span>
                  </li>
                </div>
              )}

            {order.courseSchedule &&
              !order.courseType?.includes("Mentoring") && (
                <div className="lg:my-4 font-bold border-b border-[#DBE1E7] py-2">
                  <li className="list-none flex justify-between items-start">
                    COURSE DAYS:
                    <span className="mx-4 inline-flex w-2/4 justify-end">
                      {formatReceiptCourseSchedule(order.courseSchedule)}
                    </span>
                  </li>
                </div>
              )}

            <div className="lg:my-4 font-bold border-b border-[#DBE1E7] py-2">
              <li className="list-none flex justify-between items-center">
                AMOUNT:
                <span className="mx-4 inline-flex w-2/4 justify-end">
                  {formatPrice(order?.amount) || "N/A"}
                </span>
              </li>
            </div>

            <div className="lg:my-4 font-bold py-2">
              <li className="list-none flex justify-between items-center">
                TRANSACTION STATUS:
                <span
                  className={`mx-4 inline-flex w-2/4 justify-end ${
                    data.status && data.status === "completed"
                      ? "text-[#1D994A]"
                      : ""
                  }`}
                >
                  {data.status && data.status === "completed"
                    ? "Successful"
                    : "N/A"}
                </span>
              </li>
            </div>
          </div>
        </div>

        <button
          className="bg-[white] flex justify-center gap-x-4 py-4 px-2 w-full my-4 text-[#89C13E] border border-[#89C13E] rounded-md font-bold cursor-pointer"
          onClick={downloadTransactReceipt}
        >
          Download Receipt {copyingData && <Loading />}
        </button>

        <button
          className="bg-[#89C13E] py-4 px-2 w-full my-4 text-white rounded-md font-bold cursor-pointer"
          onClick={returnBtnClick}
        >
          Back Home
        </button>
      </div>
    </motion.div>
  );
}
