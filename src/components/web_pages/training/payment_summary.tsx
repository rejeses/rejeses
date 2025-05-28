"use client";

import Image from "next/image";
import Dynamic_nav from "@/components/reusables/navigation/dynamic_nav";
import { usePayment, useNavigation } from "@/utils/context/payment";
import Button from "@/components/reusables/button";
import { useEffect, useState } from "react";
import { ClientPageProps } from "@/utils/types/types";
import { formatPrice } from "@/utils/reusables/functions";
import { useRouter } from "next/navigation";
import "../../../../public/assets/styles/select.css";
import usePromoData from "@/utils/hooks/usePromoData";

export default function TrainingPayment({ pricingItem }: ClientPageProps) {
  const { paymentInfo, setPaymentInfo, selectedType } = usePayment();
  const { promoData } = usePromoData();
  const [formattedSummary, setFormattedSummary] = useState<string>("");
  const { isNigeria } = useNavigation();
  const [isWeekday, setIsWeekday] = useState(true);

  const router = useRouter();

  const formatTrainingOption = (text: string) => {
    return text.replace(/rejeses consult/gi, "<b>rejeses consult</b>");
  };

  const formatPaymentSummary = () => {
    if (!pricingItem) return "";
    const { training_option } = paymentInfo;

    if (!training_option || training_option === "") {
      return `You are subscribing to <b>rejeses consult</b> 35 hour training plan. You will be charged ${
        isNigeria ? "NGN " : "$"
      }${
        isNigeria
          ? formatPrice(pricingItem?.payment.total2)
          : formatPrice(pricingItem?.payment.total)
      } for this.`;
    }

    return formatTrainingOption(training_option);
  };

  const renderPrice = () => {
    const { price, price2, is_group, promoPrices } = paymentInfo;

    const adjustedPrice = is_group ? price * 5 : price || 0;
    const adjustedPrice2 = is_group ? price2 * 5 : price2 || 0;

    if (adjustedPrice === 0) {
      return isNigeria ? formatPrice(450000) : formatPrice(300);
    }

    if (isNigeria && !promoData) {
      return formatPrice(adjustedPrice2);
    }

    if (!isNigeria) {
      return formatPrice(adjustedPrice);
    }

    if (promoData?.isPromo && isNigeria) {
      const nairaPrices = promoData.prices.naira;
      const selectedNairaPrice =
        nairaPrices?.[selectedType as keyof typeof nairaPrices] || 0;
      console.log(selectedNairaPrice, "render");
      const adjustedPromoNairaPrice = is_group
        ? selectedNairaPrice * 5
        : selectedNairaPrice;
      return formatPrice(adjustedPromoNairaPrice);
    }

    if (promoData?.isPromo && !isNigeria) {
      const dollarPrices = promoData?.prices.dollar;
      const selectedDollarPrice =
        dollarPrices?.[selectedType as keyof typeof dollarPrices] || 0;
      const adjustedPromoDollarPrice = is_group
        ? selectedDollarPrice * 5
        : selectedDollarPrice;
      return formatPrice(adjustedPromoDollarPrice);
    }

    return isNigeria ? adjustedPrice2 : adjustedPrice;
  };

  useEffect(() => {
    setFormattedSummary(formatPaymentSummary());
  }, [paymentInfo, pricingItem, isNigeria]);

  useEffect(() => {
    console.log(paymentInfo, "payment");
  }, []);

  useEffect(() => {
    console.log(paymentInfo, "payment2");
  }, [paymentInfo]);

  useEffect(() => {
    const isPromo = promoData?.isPromo;

    if (
      paymentInfo.price === 0 ||
      paymentInfo.price2 === 0 ||
      (isPromo && !promoData?.prices.naira[selectedType]) ||
      (isPromo && !promoData?.prices.dollar[selectedType])
    ) {
      router.push("/training");
    }
  }, [paymentInfo.price, paymentInfo.price2]);

  useEffect(() => {
    setPaymentInfo({
      ...paymentInfo,
      classScheduleType: isWeekday ? "weekday" : "weekend",
    });
  }, []);

  const handleDayTypeChange = (isWeekday: boolean) => {
    setIsWeekday(isWeekday);
    setPaymentInfo({
      ...paymentInfo,
      classScheduleType: isWeekday ? "weekday" : "weekend",
    });
  };

  return (
    <section className="w-full px-8 flex flex-col gap-12 py-12 justify-center items-center">
      <div className="w-full flex flex-col justify-start md:px-12 px-4 -mb-12">
        <h1 className="lg:text-2xl md:text-xl text-2xl font-bold font-bricolage_grotesque">
          Which schedule works best for you?
        </h1>
        <div className="fancy-selector">
          <div
            className={`selector-container ${
              isWeekday ? "weekday" : "weekend"
            }`}
            onClick={() => handleDayTypeChange(!isWeekday)}
          >
            <div className="selector-option weekday">
              <span className="selector-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                  <path
                    fillRule="evenodd"
                    d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span className="selector-text">Weekdays</span>
            </div>
            <div className="selector-option weekend">
              <span className="selector-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 00-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 00.75-.75v-1.5h1.5A.75.75 0 009 19.5V18h1.5a.75.75 0 00.53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1015.75 1.5zm0 3a.75.75 0 000 1.5A2.25 2.25 0 0118 8.25a.75.75 0 001.5 0 3.75 3.75 0 00-3.75-3.75z" />
                </svg>
              </span>
              <span className="selector-text">Weekends</span>
            </div>
            <div className="selector-highlight"></div>
          </div>
        </div>
      </div>
      <div className="md:max-w-[98%] w-full py-12 gap-6 md:px-8 flex flex-col gap-y-6 justify-center">
        <Dynamic_nav
          link1={`/training/${pricingItem?.id}`}
          link2="/training"
          link_text1="Upcoming Cohorts"
          link_text2="Project Management Training"
        />
        <section className="w-full border-2 border-[#DBE1E7] gap-4 py-8 md:px-6 px-2 rounded-lg flex flex-col m-auto">
          <div className="flex flex-col gap-4 border-b-2 border-b-[#DBE1E7] py-6">
            <h1 className="lg:text-3xl text-2xl font-bold font-bricolage_grotesque">
              Order Summary
            </h1>
            <p
              dangerouslySetInnerHTML={{
                __html: formattedSummary,
              }}
            ></p>
            <div className="w-full flex flex-col gap-4">
              <p className="text-[#89C13E]">Includes:</p>
              <p className="flex gap-x-3 items-center">
                <span>
                  <Image
                    src={pricingItem?.payment.includes[0] || ""}
                    alt="image"
                    width={20}
                    height={100}
                  />
                </span>
                {pricingItem?.payment.includes[1]}
              </p>

              <div className="flex flex-wrap items-center my-4 mb-4">
                <p className="">
                  <span className="text-xl font-bold font-bricolage_grotesque">
                    Class Schedule:
                  </span>
                  <span className="ml-2">
                    {isWeekday ? "Weekdays" : "Weekends"}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex justify-between w-full font-bricolage_grotesque">
              <span className="text-2xl font-bold">Total:</span>
              <span className="text-2xl font-bold text-[#89C13E]">
                {isNigeria ? "NGN" : "$"} {renderPrice()}
              </span>
            </div>
          </div>
          <div className="flex md:gap-x-4 gap-x-2 md:px-6 justify-center items-center py-4 w-full sm_btn-container flex-wrap">
            <Button
              url={`${paymentInfo.training_id}/checkout`}
              text="Continue"
              bg="#89C13E"
              transition_class="transition_button4"
            />
          </div>
        </section>
      </div>
    </section>
  );
}
