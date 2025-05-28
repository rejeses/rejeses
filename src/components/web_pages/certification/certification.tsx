"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Fragment, useState } from "react";
import { Certification } from "@/utils/types/types";
import SkeletalLoader from "@/components/reusables/animation/skeletol_loader";
import Button from "@/components/reusables/button";

export interface CertificationProps {
  certification: Certification;
}

function makeBold(text: string) {
  const regex = /\$\d{1,3}(?:,\d{3})*(?:\.\d+)?|(\d+-\d+%)|(\d+%)/g;

  // Match all monetary values or percentages
  const matches = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    matches.push(match);
  }

  // Split the text into parts using the matches
  let lastIndex = 0;
  const jsxParts = [];
  matches.forEach((match, index) => {
    const start = match.index;
    const end = start + match[0].length;

    // Add the plain text before the match
    if (lastIndex < start) {
      jsxParts.push(
        <Fragment key={`${index}-text`}>
          {text.slice(lastIndex, start)}
        </Fragment>
      );
    }

    // Add the bolded match
    jsxParts.push(
      <Fragment key={`${index}-bold`}>
        <b>{text.slice(start, end)}</b>
      </Fragment>
    );

    lastIndex = end;
  });

  // Add the remaining plain text after the last match
  if (lastIndex < text.length) {
    jsxParts.push(
      <Fragment key="remaining-text">{text.slice(lastIndex)}</Fragment>
    );
  }

  return jsxParts;
}

function formatTextWithBold(item: string) {
  if (item.includes(":")) {
    const [boldText, remainingText] = item.split(/:(.+)/);

    return (
      <>
        <strong>{boldText}:</strong> {remainingText}
      </>
    );
  }
  return <>{item}</>;
}

export default function Certifications({ certification }: CertificationProps) {
  const [loadingState, setLoadingState] = useState<boolean>(true);

  const handleImageLoad = () => {
    setLoadingState(false);
  };

  return (
    <section className="flex flex-col px-4 my-6">
      <div className="flex flex-col lg:justify-center lg:items-center w-full">
        <motion.header
          className="bg-[#4B006E] text-white py-6 lg:w-3/4 font-bricolage_grotesque lg:text-4xl"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-center">
              {certification.title}
            </h1>
          </div>
        </motion.header>

        <div className="flex flex-col space-y-6 my-6 lg:w-3/4 gap-y-4">
          <motion.div
            className={`flex items-center justify-center mb-6 filter `}
            style={{ transform: "none" }}
          >
            <div
              className={`lg:w-[300px] md:w-[200px] w-[240px] ${
                loadingState ? "blur-2xl" : "blur-none"
              } transition duration-1000 ease-in-out relative`}
            >
              {loadingState && (
                <SkeletalLoader
                  blockWidth="w-[80%]"
                  cardHeight="h-5"
                  cardImageHeight="h-5"
                  cardColor="bg-[#FEF9F6]"
                  cardContentColor="bg-[#FEF9F6]"
                  cardImageColor="bg-[#F5F0FA]"
                />
              )}

              <Image
                src={certification.logo}
                width={300}
                height={200}
                alt={certification.title}
                className={`object-contain ${
                  loadingState
                    ? "w-full h-full object-top absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    : ""
                }`}
                blurDataURL={certification.logo}
                priority
                placeholder="blur"
                onLoad={handleImageLoad}
              />
            </div>
          </motion.div>

          <div className="w-full flex flex-col gap-y-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#535353] font-bricolage_grotesque">
              Overview
            </h2>
            <motion.p
              className="text-[#535353]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              {certification.content.description}
            </motion.p>
          </div>

          <div className="w-full flex flex-col gap-y-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#535353] font-bricolage_grotesque">
              Qualifications
            </h2>
            <motion.p
              className="text-[#535353]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              {certification.content.qualifications.intro}
            </motion.p>

            <ul className="space-y-2 flex flex-col gap-y-2 text-[#535353]">
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="flex items-start"
              >
                <span className="mr-2 mt-[2px] text-lg">⭐</span>
                <div>
                  <b>Experience:</b>{" "}
                  {certification.content.qualifications.experience}
                </div>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="flex items-start"
              >
                <span className="mr-2 mt-[2px] text-lg">⭐</span>
                <div>
                  <b>Education:</b>{" "}
                  {certification.content.qualifications.education}
                </div>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
                className="flex items-start"
              >
                <span className="mr-2 mt-[2px] text-lg">⭐</span>
                <div>
                  <b>Exam:</b>{" "}
                  {makeBold(certification.content.qualifications.exam)}
                </div>
              </motion.li>
            </ul>
          </div>

          <div className="w-full flex flex-col gap-y-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#535353] font-bricolage_grotesque">
              Benefits
            </h2>
            <motion.p
              className="text-[#535353]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              {certification.content.benefits.intro}
            </motion.p>

            <ul className="space-y-2 flex flex-col gap-y-2 text-[#535353]">
              {certification.content.benefits.lists.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="flex items-start"
                >
                  <span className="mr-2 mt-[2px] text-lg">⭐</span>
                  <div>{formatTextWithBold(item)}</div>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="w-full flex flex-col gap-y-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#535353] font-bricolage_grotesque">
              Earning Potential
            </h2>
            <motion.p
              className="text-[#535353]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.8 }}
            >
              {makeBold(certification.content.salary)}
            </motion.p>

            {certification.content.ready ? (
              <div>
                <h4 className="text-2xl md:text-3xl font-semibold text-[#535353] font-bricolage_grotesque">
                  Ready to Elevate Your Career?
                </h4>

                <motion.p
                  className="text-[#535353]"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                >
                  {certification.content.ready}
                </motion.p>
              </div>
            ) : (
              <motion.p
                className="text-[#535353]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.8 }}
              >
                {certification.content.last}
              </motion.p>
            )}
          </div>

          <div className="w-full flex justify-center items-center my-4">
            <span className="text-white">
              <Button
                text="Enroll Now"
                bg="#89C13E"
                url="/training"
                transition_class="transition_button4"
              />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
