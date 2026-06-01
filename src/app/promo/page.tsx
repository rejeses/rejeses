"use client"
import dynamic from "next/dynamic";

const PromoPage = dynamic(
  () => import("@/components/web_pages/promo/promo_content"),
  { ssr: false }
);

export default function Page() {
  return <PromoPage />;
}