import React from "react";
import MentorshipPaymentSummary from "@/components/web_pages/mentorship/payment_summary";

export async function generateStaticParams() {
  return [{ slug: "pricing" }];
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <MentorshipPaymentSummary />;
}
