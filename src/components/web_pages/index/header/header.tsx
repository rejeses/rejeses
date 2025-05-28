"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, useInView, AnimatePresence, delay } from "framer-motion";
import Link from "next/link";
import Tagline from "./tagline";
import Image_slider from "./image_slider";
import Mobile_Image_slider from "./mobile_image_slider";
import Logo_slider from "@/components/reusables/animation/logo_slider";

const useAnimateOnScroll = (ref: React.RefObject<HTMLElement | null>) => {
  const isInView = useInView(ref, { amount: 0.3 });
  return { isInView, shouldAnimate: isInView };
};

export default function Header() {
  const [isMobile, setIsMobile] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const headingRef = useRef(null);
  const paragraphRef = useRef(null);
  const logosRef = useRef(null);
  const buttonsRef = useRef(null);
  const headerTextRef = useRef(null);

  const { shouldAnimate: headingInView } = useAnimateOnScroll(headingRef);
  const { shouldAnimate: paragraphInView } = useAnimateOnScroll(paragraphRef);
  const { shouldAnimate: headerTextInView } = useAnimateOnScroll(headerTextRef);
  const { shouldAnimate: logosInView } = useAnimateOnScroll(logosRef);
  const { shouldAnimate: buttonsInView } = useAnimateOnScroll(buttonsRef);

  useEffect(() => {
    const updateWidth = () => setIsMobile(window.innerWidth <= 767);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const headingVariants = {
    hidden: { opacity: 0, y: -100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const headerTextVariants = {
    hidden: { opacity: 0, x: 80 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 4, delay: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const paragraphVariants = {
    hidden: { opacity: 0, x: -80 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 3,
        delay: 0.3,
        ease: [0.22, 1, 0.36, 1],
        type: "spring",
        stiffness: 60,
        damping: 18,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const companyLogosVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1.2,
        staggerChildren: 0.1,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: -50, rotate: -5 },
    visible: { opacity: 1, y: 0, rotate: 0 },
  };

  const splitText = (text: string) => {
    return text.split(" ").map((word, wordIndex) => (
      <span
        key={wordIndex}
        className="inline-block mr-2"
        style={{ whiteSpace: "nowrap" }}
      >
        {word.split("").map((char, charIndex) => (
          <motion.span
            key={`${wordIndex}-${charIndex}-${
              headingInView ? "visible" : "hidden"
            }`}
            className="inline-block"
            variants={letterVariants}
            initial="hidden"
            animate={headingInView ? "visible" : "hidden"}
            transition={{
              duration: 0.5,
              delay: 0.03 * (wordIndex + charIndex),
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {char}
          </motion.span>
        ))}
      </span>
    ));
  };

  const handleEnrollClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (pathname === "/training") {
      const section = document.getElementById("upcoming-training");
      if (section) section.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/training#upcoming-training");
    }
  };

  return (
    <header className="bg-[#F5F0FA] flex flex-col w-full gap-4 overflow-hidden">
      <div className="w-full flex flex-col justify-center items-center my-8">
        <Tagline />
        <div className="md:w-3/4 w-full flex flex-col justify-center items-center gap-3 px-4 py-8 mt-8 mb-8">
          <motion.h1
            ref={headerTextRef}
            variants={headerTextVariants}
            initial="hidden"
            animate={headerTextInView ? "visible" : "hidden"}
            className="lg:text-[60px] md:text-6xl text-5xl text-center font-bold lg:leading-[80px] leading-tight font-bricolage_grotesque"
          >
            Learn and become excellent at project management
          </motion.h1>

          <motion.p
            ref={paragraphRef}
            variants={paragraphVariants}
            initial="hidden"
            animate={paragraphInView ? "visible" : "hidden"}
            className="lg:text-2xl text-lg text-center max-w-[90%] lg:leading-[36px] leading-[28px]"
          >
            Everything from learning about project management to one-on-one
            mentoring and even consultation,{" "}
            <motion.span
              className="font-bold font-bricolage_grotesque"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Rejeses
            </motion.span>{" "}
            is here to help you learn and master project management.
          </motion.p>

          <motion.div
            ref={buttonsRef}
            variants={buttonVariants}
            initial="hidden"
            animate={buttonsInView ? "visible" : "hidden"}
            className="w-full flex justify-center items-center my-4"
          >
            <motion.span
              className="mx-2 bg-[#89C13E] py-3 rounded-[.3rem]"
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 5px 15px rgba(137, 193, 62, 0.4)",
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link
                href="/training#upcoming-training"
                onClick={handleEnrollClick}
                className="bg-[#89C13E] text-white px-6 py-4 rounded-[.3rem] font-bricolage_grotesque transition_button4"
              >
                Enroll Now
              </Link>
            </motion.span>

            <motion.span
              className="mx-2"
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 5px 15px rgba(0,0,0, 0.4)",
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link
                href="/book-session"
                className="bg-[#FFFFFF] text-[#89C13E] px-6 py-4 border transition_button border-[#89C13E] rounded-[.3rem] font-bricolage_grotesque"
              >
                Book Session
              </Link>
            </motion.span>
          </motion.div>
        </div>
      </div>

      {!isMobile ? <Image_slider /> : <Mobile_Image_slider />}

      <motion.div
        ref={logosRef}
        variants={companyLogosVariants}
        initial="hidden"
        animate={logosInView ? "visible" : "hidden"}
        className="flex w-full flex-col justify-center items-center bg-[#FCFCFC] py-12 px-4 gap-6 mt-6"
      >
        <motion.p
          initial={{ opacity: 0, x: 100 }}
          animate={logosInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="text-lg text-center font-bricolage_grotesque text-[#5B5B5B]"
        >
          Learn directly from people who have worked at such companies as
        </motion.p>

        <AnimatePresence mode="wait">
          {logosInView && (
            <motion.div
              key="logos-visible"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-full"
            >
              <Logo_slider />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}
