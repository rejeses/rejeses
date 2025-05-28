"use client";
import Link from "next/link";
import { forwardRef } from "react";
import { PromoPricingProps } from "@/utils/types/types";
import { usePathname } from "next/navigation";
import { useNavigation } from "@/utils/context/payment";

const PromoPricing = forwardRef<HTMLElement, PromoPricingProps>(
  ({ promoData }, ref) => {
    const pathname = usePathname();
    const { isNigeria } = useNavigation();
    const currencySymbol = isNigeria ? "₦" : "$";
    const priceData = isNigeria
      ? promoData?.prices?.naira
      : promoData?.prices?.dollar;

    if (!promoData?.isPromo) return null;

    return (
      <section className="w-full my-12" ref={ref} id="pricing">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-xl border-2 border-[#89C13E] overflow-hidden">
            <div className="bg-[#89C13E] py-4 px-6">
              <h2 className="text-3xl font-bold text-white text-center font-bricolage_grotesque">
                Special Promotional Pricing
              </h2>
            </div>

            <div className="p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-all col-span-full">
                  <h3 className="text-2xl font-bold mb-2 font-bricolage_grotesque">
                    Prices
                  </h3>
                  <div className="space-y-4 mt-4">
                    {pathname.includes("training") && (
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="font-medium">Training Only</span>
                        <span className="text-xl font-bold text-[#89C13E]">
                          {currencySymbol}
                          {priceData && priceData.training.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {pathname.includes("mentorship") && (
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="font-medium">Mentoring Only</span>
                        <span className="text-xl font-bold text-[#89C13E]">
                          {currencySymbol}
                          {priceData && priceData.mentoring.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {(pathname.includes("training") ||
                      pathname.includes("mentorship")) && (
                      <div className="flex justify-between items-center">
                        <span className="font-medium">
                          Training & Mentoring
                        </span>
                        <span className="text-xl font-bold text-[#89C13E]">
                          {currencySymbol}
                          {priceData &&
                            priceData["training&mentoring"].toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Link
                  href="/promo"
                  className="inline-block px-8 py-4 bg-[#89C13E] text-white font-bold rounded-md hover:bg-[#6aa025] transition-all transform hover:scale-105 shadow-md"
                >
                  View Complete Promo Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
);

PromoPricing.displayName = "PromoPricing";
export default PromoPricing;
