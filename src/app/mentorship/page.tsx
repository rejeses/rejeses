"use client";
import Link from "next/link";
import Image from "next/image";
import Why_us from "@/components/reusables/why_us/why_us";
import Benefits from "@/components/reusables/dynamic_pages/benefits";
import Pricing from "@/components/reusables/pricing/pricing";
import { usePathname } from "next/navigation";

import whyUsData from "@/utils/data/why_us_data.json";
import benefit_data from "@/utils/data/benefits_data.json";
import priceData from "@/utils/data/price_data.json";
import { useEffect, useState } from "react";
import SkeletalLoader from "@/components/reusables/animation/skeletol_loader";
import PromoBanner from "../promo/banner";
import usePromoData from "@/utils/hooks/usePromoData";
import PromoPricing from "../promo/promoPricing";
import { useNavigation } from "@/utils/context/payment";

export default function Page() {
  const pathname = usePathname();
  const currentTag = pathname.slice(1);
  const { promoData } = usePromoData();
  const { isNigeria } = useNavigation();

  const filteredWhyData = whyUsData.filter((item) => item.tag === currentTag);
  const filteredBenefits = benefit_data.filter(
    (item) => item.tag === currentTag
  );

  const filteredPricing = priceData.find((item) => item.tag === currentTag);

  const [imageLoading, setImageLoading] = useState<boolean>(true);

  return (
    <section className="w-full flex flex-col justify-center items-center">
      <section className="w-full px-8 flex flex-col gap-6 py-12 md:max-w-[98%]">
        {promoData && (
          <PromoBanner isNigeria={isNigeria} promoData={promoData} />
        )}
        <div className="flex flex-col w-full gap-4 lg:px-12 md:px-6 md:mt-10">
          <h1 className="md:text-5xl text-3xl font-bold font-bricolage_grotesque">
            Personalized Mentoring
          </h1>
          <p className="text-wrap lg:max-w-[80%] lg:text-[24px] text-[16px]">
            Our personalized mentoring program is thoughtfully designed to
            accelerate growth, overcome challenges, and achieve goals for
            individuals at any stage or in any field. It offers rich and
            substantial support.
          </p>
        </div>

        <div className="lg:px-12 md:px-3 lg:max-h-[900px] h-[calc(50vw)] lg:w-full my-4 md:mb-12 mb-6 relative overflow-hidden">
          <div
            className={`filter w-full h-full ${
              imageLoading ? "blur-2xl" : "blur-none"
            } transition duration-1000 ease-in-out`}
          >
            {imageLoading && (
              <SkeletalLoader
                blockWidth="w-[80%]"
                cardColor="bg-[#FEF9F6]"
                cardContentColor="bg-[#FEF9F6]"
                cardImageColor="bg-[#F5F0FA]"
              />
            )}
            <Image
              src="/mentorship_hero.svg"
              alt="image"
              layout="fill"
              objectFit="cover"
              className={`rounded-2xl transition-all ${
                imageLoading ? "blur-2xl" : "blur-none"
              }`}
              placeholder="blur"
              blurDataURL="/mentorship_hero.svg"
              onLoad={() => setImageLoading(false)}
              priority
            />
          </div>
        </div>

        <Benefits data={filteredBenefits} />
        <Why_us data={filteredWhyData} />
        <div className="my-12">
          {filteredPricing && !promoData?.isPromo ? (
            <Pricing item={filteredPricing.pricing} />
          ) : (
            <PromoPricing promoData={promoData} />
          )}
        </div>
      </section>
    </section>
  );
}
