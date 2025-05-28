// src/app/training/[slug]/class_schedule/page.tsx
"use client";

import React from "react";
import ClassSchedule from "@/components/web_pages/training/class_schedule"; // Adjust path if needed
import data from "@/utils/data/training_data.json";
import { TrainingOption1 } from "@/utils/types/types";
import { usePayment } from "@/utils/context/payment";
import { useParams } from "next/navigation";

export default function ClassSchedulePage() {
  const { paymentInfo } = usePayment();
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";

  // Find the schedule item and handle the case when it's undefined
  const scheduleItem = data.find((item) => item.id.toString() === slug) as
    | TrainingOption1
    | undefined;

  // If schedule item is not found, show an error message
  if (!scheduleItem) {
    return (
      <div className="flex flex-col gap-8 w-full min-h-screen justify-center items-center">
        <h2 className="lg:text-4xl md:text-3xl text-2xl font-bold font-bricolage_grotesque">
          Training schedule not found!
        </h2>
      </div>
    );
  }

  // Check if class_schedule exists on scheduleItem
  if (!scheduleItem.class_schedule) {
    return (
      <div className="flex flex-col gap-8 w-full min-h-screen justify-center items-center">
        <h2 className="lg:text-4xl md:text-3xl text-2xl font-bold font-bricolage_grotesque">
          Class schedule data not available for this training!
        </h2>
      </div>
    );
  }

  return (
    <ClassSchedule
      data={scheduleItem.class_schedule}
      all={scheduleItem}
      promo={paymentInfo.promoPrices?.isPromo || false}
    />
  );
}
