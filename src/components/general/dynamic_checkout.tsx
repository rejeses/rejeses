"use client";
import dynamic from "next/dynamic";
import Loading from "@/app/feed/loading";

const DynamicCheckout = dynamic(
  () => import("@/components/reusables/checkout"),
  {
    ssr: false,
    loading: () => (
      <section className="flex justify-center items-center w-full h-screen">
        <Loading />
      </section>
    ),
  }
);
export default DynamicCheckout;
