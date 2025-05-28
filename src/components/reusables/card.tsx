import React from "react";
import Image from "next/image";
import { GeneralCardProps } from "@/utils/types/types";

export default function GeneralCard(props: GeneralCardProps) {
  const formatComment = (comment: string) => {
    const parts = comment?.split(/(rejeses)/i);
    return parts?.map((part, index) =>
      /rejeses/i.test(part) ? (
        <span key={index} className="font-bold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div
      className={`rounded-md px-6 py-4 w-full flex flex-col gap-6 ${
        props.person ? "flex justify-center items-center" : ""
      }`}
      key={props.id}
    >
      {props.pin && (
        <div
          className={`${
            props.person
              ? "bg-[#89C13E] rounded-full flex justify-center items-center h-[80px] w-[80px]"
              : "w-[40px]"
          }`}
        >
          <Image
            src={props.pin}
            alt="pin"
            width={100}
            height={100}
            className={`${props.person ? "w-full h-full rounded-full" : ""}`}
          />
        </div>
      )}

      <div className="w-full flex flex-col gap-4 py-4">
        {props.title && (
          <h1 className="text-lg font-bold font-bricolage_grotesque">
            {props.title}
          </h1>
        )}
        <p className="text-[#5B5B5B]">{formatComment(props.comment)}</p>
      </div>

      {props.person && (
        <div className="w-full">
          <p className="text-[#89C13E]">{props.person.name}</p>
          <p className="text-[#5B5B5B]">{props.person.job_title}</p>
        </div>
      )}
    </div>
  );
}
