"use client";
import { CheckIcon } from "@radix-ui/react-icons";
import button from "next/link";
import { PriceCardProps } from "@/utils/types/types";
import { usePayment, useNavigation } from "@/utils/context/payment";
import { usePathname, useRouter, redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function PriceCard({ data, id }: PriceCardProps) {
  const { training_only, training_with_mentorship } = data;

  const directTo = useRouter();

  const { isNigeria } = useNavigation();

  const pathname = usePathname();
  const { setPaymentInfo, paymentInfo } = usePayment();

  const registerBtnClick = (
    trainingTypeValue: string,
    item: number,
    option: string,
    item2: number
  ) => {
    const currentPath = decodeURIComponent(pathname).split("/")[1];
    if (currentPath === "training") {
      setPaymentInfo((prev) => ({
        ...prev,
        price: item,
        price2: item2,
        training_id: Number(id),
        training_option: option,
        training_type:
          trainingTypeValue === "Training only"
            ? "Project Management Training"
            : "Project Management Training & Mentoring",
      }));
      const goTo = `/training/${id}`;
      directTo.push(goTo);
    } else if (currentPath === "mentorship") {
      setPaymentInfo((prev) => ({
        ...prev,
        price: item,
        price2: item2,
        training_option: option,
        training_type:
          trainingTypeValue === "Mentoring only"
            ? "Project Management Mentoring"
            : "Project Management Training & Mentoring",
      }));
      const goTo = `/${currentPath}/pricing`;
      directTo.push(goTo);
    } else if (currentPath === "consultation") {
      // const goTo = `${currentPath}/`
    } else {
    }
  };

  const resetPriceInfo = () => {
    setPaymentInfo((prev) => ({
      ...prev,
      price: 0,
      price2: 0,
      training_id: null,
      is_group: false,
      training_type: "",
      start_date: "",
    }));
  };

  function formatPrice(price: number): string {
    if (price >= 1000) {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return price.toString();
    }
  }

  useEffect(() => {
    const val = ["Project", "pricing", "training"];
    const includesAny = val.some((substring) => pathname.includes(substring));
    if (!includesAny) resetPriceInfo();
  }, []);

  return (
    <>
      {training_only && (
        <div className="flex flex-col md:w-2/4 w-full md:h-[800px] h-auto md:mx-4 mx-0 my-2 gap-4 border border-[#DBE1E7] rounded-2xl px-8 py-6 relative shadow-sm shadow-[#DBE1E7]">
          <div className="w-full h-[90%] overflow-y-auto flex flex-col gap-4 custom-scrollbar">
            <h2 className="text-2xl font-bold font-bricolage_grotesque text-[#090909]">
              {training_only.name}
            </h2>
            <p className="text-2xl font-bold font-bricolage_grotesque text-[#000000]">
              {isNigeria ? (
                <span className="mr-2">NGN</span>
              ) : (
                <span className="mr-2">$</span>
              )}
              {isNigeria
                ? formatPrice(training_only.price2)
                : formatPrice(training_only.price)}
            </p>
            <div className="w-full mt-5 flex flex-col gap-2 my-2">
              <h1 className="text-lg font-bold text-[#090909]">
                {training_only.payment_type}
              </h1>
              <p>{training_only.payment_description}</p>
            </div>

            <div className="w-full border border-[#DBE1E7] my-6"></div>

            {/* {training_only.amount_saved && (
              <div className="absolute right-2 lg:top-6 top-16 bg-[#EFFBF2] text-[#2EAE4E] rounded-3xl w-24 text-center p-2">
                <p>Save &#36;{training_only?.amount_saved}</p>
              </div>
            )} */}

            {training_only.extra_details.map((detail, index) => (
              <p key={index} className="flex gap-x-4 items-center">
                <span className="rounded-full border border-[#89C13E] w-4 h-4 flex justify-center items-center">
                  <CheckIcon className="text-[#89C13E]" />
                </span>
                {detail}
              </p>
            ))}
          </div>

          <div className="bottom-6 md:absolute left-0 w-full px-4">
            <button
              onClick={() => {
                const adjustedPrice = paymentInfo.is_group
                  ? (isNigeria ? training_only.price2 : training_only.price) * 5
                  : isNigeria
                  ? training_only.price2
                  : training_only.price;

                registerBtnClick(
                  training_only.name,
                  training_only.price,
                  decodeURIComponent(pathname).split("/")[1] === "training"
                    ? `You are subscribing to <b>Rejeses Consult</b> 35-hour training plan. You will be charged  ${
                        isNigeria ? "NGN " : "$"
                      }${
                        isNigeria
                          ? formatPrice(adjustedPrice)
                          : formatPrice(adjustedPrice)
                      } for this.`
                    : `You are subscribing to <b>Rejeses Consult</b> 3-month mentoring plan. You will be charged ${
                        isNigeria ? "NGN " : "$"
                      }${
                        isNigeria
                          ? formatPrice(training_only.price2)
                          : formatPrice(training_only.price)
                      } for this.`,
                  training_only.price2
                );
              }}
              // href={training_only.register_link}
              className="bg-[#89C13E] text-white w-full inline-block p-4 text-center rounded-md font-bricolage_grotesque"
            >
              Enroll Now
            </button>
          </div>
        </div>
      )}

      {training_with_mentorship && (
        <div className="flex flex-col md:w-2/4 w-full md:h-[800px] h-auto gap-4 px-8 py-6 border my-2 border-[#DBE1E7] rounded-2xl relative md:mx-4 mx-0 shadow-xs shadow-[#DBE1E7]">
          <div className="h-[90%] w-full overflow-y-auto flex flex-col gap-4 custom-scrollbar">
            <h2 className="text-2xl font-bold font-bricolage_grotesque text-[#090909]">
              {training_with_mentorship.name}
            </h2>
            <p className="text-2xl font-bold font-bricolage_grotesque text-[#000000]">
              {isNigeria ? (
                <span className="mr-2">NGN</span>
              ) : (
                <span className="mr-2">$</span>
              )}
              {isNigeria
                ? formatPrice(training_with_mentorship.price2)
                : formatPrice(training_with_mentorship.price)}
            </p>
            <div className="w-full mt-5 flex flex-col gap-2 my-2">
              <h1 className="text-lg font-bold">
                {training_with_mentorship.payment_type}
              </h1>
              <p>{training_with_mentorship.payment_description}</p>
            </div>

            <div className="w-full border border-[#DBE1E7] my-6"></div>

            {/* {training_with_mentorship.amount_saved && (
              <div className="absolute right-2 lg:top-6 top-16 bg-[#EFFBF2] text-[#2EAE4E] rounded-3xl w-24 text-center p-2">
                <p>Save &#36;{training_with_mentorship?.amount_saved}</p>
              </div>
            )} */}

            {training_with_mentorship.extra_details.map((detail, index) => (
              <p key={index} className="flex gap-x-4 items-center">
                <span className="rounded-full border border-[#89C13E] w-4 h-4 flex justify-center items-center">
                  <CheckIcon className="text-[#89C13E]" />
                </span>
                {detail}
              </p>
            ))}
          </div>

          <div className="bottom-6 md:absolute left-0 w-full px-4">
            <button
              onClick={() => {
                const adjustedPrice = paymentInfo.is_group
                  ? (isNigeria
                      ? training_with_mentorship.price2
                      : training_with_mentorship.price) * 5
                  : isNigeria
                  ? training_with_mentorship.price2
                  : training_with_mentorship.price;

                registerBtnClick(
                  training_with_mentorship.name,
                  training_with_mentorship.price,
                  `You are subscribing to <b>Rejeses Consult</b> 35-hour training plus 3-month mentoring plan. You will be charged ${
                    isNigeria ? "NGN " : "$"
                  }${
                    isNigeria
                      ? formatPrice(adjustedPrice)
                      : formatPrice(adjustedPrice)
                  } for this.`,
                  training_with_mentorship.price2
                );
              }}
              // href={training_with_mentorship.register_link}
              className="bg-[#89C13E] text-white w-full font-bricolage_grotesque inline-block p-4 text-center rounded-md"
            >
              Enroll Now
            </button>
          </div>
        </div>
      )}
    </>
  );
}
