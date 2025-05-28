"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PromoBannerProps } from "@/utils/types/types";
import { useNavigation } from "@/utils/context/payment";

const PromoBanner = ({
  promoData,
}: PromoBannerProps & { isNigeria: boolean }) => {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const { isNigeria } = useNavigation();

  useEffect(() => {
    if (promoData && promoData.isPromo) {
      setIsVisible(true);
    }
  }, [promoData]);

  if (!isVisible) return null;

  const isTraining = pathname.includes("training");
  const isMentorship = pathname.includes("mentorship");

  const naira = promoData?.prices?.naira;
  const dollar = promoData?.prices?.dollar;

  const price = isNigeria
    ? isTraining
      ? `₦${naira?.training?.toLocaleString() || "50,000"}`
      : `₦${naira?.mentoring?.toLocaleString() || "250,000"}`
    : isTraining
    ? `$${dollar?.training || 60}`
    : `$${dollar?.mentoring || 240}`;

  return (
    <section className="w-full py-6 mb-6 bg-linear-to-r from-[#89C13E] to-[#6aa025] shadow-lg rounded-lg overflow-hidden">
      <div className="relative w-full max-w-6xl mx-auto px-4">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-5 w-12 h-12 rounded-full bg-white/10"></div>
          <div className="absolute bottom-1/4 right-10 w-20 h-20 rounded-full bg-white/10"></div>
          <div className="absolute top-1/2 right-1/4 w-8 h-8 rounded-full bg-white/10"></div>
        </div>

        <div className="relative flex flex-col md:flex-row items-center justify-between z-10">
          <div className="flex-1 text-center md:text-left mb-4 md:mb-0">
            <div className="inline-block px-4 py-1 bg-yellow-400 text-black font-bold rounded-full mb-3 animate-pulse">
              Special Offer!
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Limited Time Training Promotion
            </h2>
            <p className="text-white/90 text-lg">
              Get exclusive discounts on our training programs! Prices as low as{" "}
              <span className="font-bold">{price}</span>
            </p>
          </div>

          <Link
            href="/promo"
            className="px-6 py-3 bg-white text-[#89C13E] font-bold rounded-md hover:bg-yellow-50 transition-all transform hover:scale-105 shadow-md"
          >
            View Promo Details
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
