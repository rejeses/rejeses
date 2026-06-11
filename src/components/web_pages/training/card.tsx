"use client";
import { CardProps } from "@/utils/types/types";
import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { usePayment, useNavigation } from "@/utils/context/payment";

export default function Card(props: CardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const goTo = useRouter();
  const { setPaymentInfo } = usePayment();
  const { isNigeria } = useNavigation();

  function formatPrice(price: number | undefined): string | undefined {
    if (price && price >= 1000) {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      if (price) {
        return price.toString();
      }
    }
  }

  const updatePrice = useCallback(() => {
    const priceArray = props.price?.individuals
      .map((item) => item.training_only?.price)
      .filter((price) => price && !isNaN(price))[0];

    const priceArray2 = props.price?.individuals
      .map((item) => item.training_only?.price2)
      .filter((price) => price && !isNaN(price))[0];

    setPaymentInfo((prev) => ({
      ...prev,
      price: Number(priceArray),
      price2: Number(priceArray2),
      training_id: props.id2,
      start_date: props.date,
      training_option: `You are subscribing to <b>Rejeses Consult</b> 35-hour training plan. You will be charged ${
        isNigeria ? "NGN " : "$"
      }${
        isNigeria ? formatPrice(priceArray2) : formatPrice(priceArray)
      } for this.`,
      is_group: false,
    }));
  }, [
    props.price?.individuals,
    isNigeria,
    props.id2,
    props.date,
    setPaymentInfo,
  ]);

  useEffect(() => {
    updatePrice();
  }, [updatePrice]);

  const handleCardClick = () => {
    updatePrice();
    goTo.push(`/training/${props.id2}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="rounded-md px-6 py-4 w-full flex flex-col gap-6 cursor-pointer"
      key={props.id}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full flex flex-col gap-4 border-b border-b-[#DBE1E7] py-4">
        <h1 className="text-lg font-bold font-bricolage_grotesque">
          {props.title}
        </h1>
        <p className="text-[#5B5B5B]">{props.description}</p>
        <p className="font-bold font-bricolage_grotesque">
          <span>Start Week:</span> {props.date}
        </p>
      </div>

      <div className="w-full flex items-center justify-between">
        <Link
          className="bg-transparent flex items-center py-2 px-2 text-[#89C13E] font-semibold font-bricolage_grotesque transition-all duration-300"
          href={`/training/${props.id2}`}
          onClick={(e) => {
            e.stopPropagation();
            updatePrice();
          }}
        >
          REGISTER
          <span
            className="mx-2 flex items-center transition-all duration-700"
            style={{
              transform: isHovered ? "translateX(4px)" : "translateX(0)",
            }}
          >
            <ArrowRightIcon />
          </span>
        </Link>
      </div>
    </div>
  );
}
