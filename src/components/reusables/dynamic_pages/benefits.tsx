"use client";

import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import GeneralCard from "@/components/reusables/card";
import { UniqueComponentsProps } from "@/utils/types/types";
import { usePathname } from "next/navigation";
import { motion, useAnimation } from "framer-motion";
import { useNavigation } from "@/utils/context/payment";
import Mobile_benefits from "./mobile_benefits";

export default function Benefits(props: UniqueComponentsProps) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const { isMobile, updateWidth, width } = useNavigation();
  const controls = useAnimation();
  const [startX, setStartX] = useState<number | null>(null);

  const decodedPathname = useMemo(
    () => decodeURIComponent(pathname),
    [pathname]
  );

  const filteredData = useMemo(() => {
    if (
      decodedPathname === "/" ||
      decodedPathname === "/training" ||
      decodedPathname === "/mentorship"
    ) {
      return props.data;
    }

    const dynamicTag = decodedPathname.startsWith("/training/")
      ? "training"
      : decodedPathname.startsWith("/mentorship/")
      ? "mentorship"
      : decodedPathname.startsWith("/consultation") ||
        decodedPathname === "/consultation"
      ? "consultation"
      : "";

    return dynamicTag
      ? props.data.filter((item) => item.tag === dynamicTag)
      : [];
  }, [decodedPathname, props.data]);

  useEffect(() => {
    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, [updateWidth]);

  const startAnimation = useCallback(() => {
    controls.start({
      x: ["-100%", 0], // Reversed direction from Why_us component
      transition: {
        duration: 50,
        ease: "linear",
        repeat: Infinity,
      },
    });
  }, [controls]);

  const handleNext = () => {
    if (containerRef.current) {
      const scrollAmount = Math.min(
        300,
        containerRef.current.offsetWidth * 0.8
      );
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (containerRef.current) {
      const scrollAmount = Math.min(
        300,
        containerRef.current.offsetWidth * 0.8
      );
      containerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    startAnimation();
  }, [startAnimation]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setStartX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (startX !== null) {
      const deltaX = e.clientX - startX;

      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          handlePrev();
        } else {
          handleNext();
        }
        setStartX(null);
      }
    }
  };

  const handlePointerUp = () => {
    setStartX(null);
  };

  const buttonClasses =
    "hidden md:flex items-center justify-center lg:w-[50px] lg:h-[50px] w-[60px] h-[60px] rounded-full bg-white bg-opacity-20 backdrop-blur-xs border border-[#DBE1E7] border-opacity-50 cursor-pointer transition-all duration-300 hover:bg-opacity-50 absolute top-[60%] shadow-md";

  if (isMobile && width <= 767) {
    return <Mobile_benefits data={filteredData} />;
  }

  return (
    <section className="w-full flex flex-col lg:px-12 py-4 relative">
      <h1 className="md:text-4xl text-2xl my-8 font-bold bricolage_text lg:px-0 md:px-6">
        Benefits
      </h1>

      <div
        className="w-full overflow-hidden relative cursor-move touch-pan-y touch-pinch-zoom"
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <motion.div className="flex gap-4" animate={controls}>
          {filteredData.concat(filteredData).map((item, index) => (
            <div
              key={index}
              className="lg:w-[30%] md:w-[45%] w-full border border-[#DBE1E7] md:mx-4 md:my-2 mx-2 my-2 rounded-2xl shadow-xs shadow-[#0000001A] shrink-0"
            >
              <GeneralCard
                pin={item.pin}
                title={item.title}
                id={item.id}
                comment={item.comment}
              />
            </div>
          ))}
        </motion.div>
      </div>

      <motion.button
        whileHover={{
          scale: 1.08,
          transition: { duration: 0.3, type: "tween" },
        }}
        whileTap={{
          scale: 1.12,
          transition: { duration: 0.1, type: "tween" },
        }}
        onClick={handlePrev}
        className={`${buttonClasses} lg:left-6 left-2`}
        aria-label="Previous"
      >
        <span className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-12 border-r-[#535353]"></span>
      </motion.button>
      <motion.button
        whileHover={{
          scale: 1.08,
          transition: { duration: 0.3, type: "tween" },
        }}
        whileTap={{
          scale: 1.12,
          transition: { duration: 0.1, type: "tween" },
        }}
        onClick={handleNext}
        className={`${buttonClasses} lg:right-6 right-2`}
        aria-label="Next"
      >
        <span className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-12 border-l-[#535353]"></span>
      </motion.button>
    </section>
  );
}
