import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Tagline() {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const text = "Your Partner in Project Excellence";
  const typeSpeed = 100;
  const deleteSpeed = 50;
  const delayAfterComplete = 1000;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const type = () => {
      if (!isDeleting) {
        if (typingIndex < text.length) {
          setDisplayText((prev) => prev + text[typingIndex]);
          setTypingIndex((prev) => prev + 1);
        } else {
          setTimeout(() => setIsDeleting(true), delayAfterComplete);
        }
      } else {
        if (typingIndex > 0) {
          setDisplayText((prev) => prev.slice(0, -1));
          setTypingIndex((prev) => prev - 1);
        } else {
          setIsDeleting(false);
        }
      }
    };

    const timeout = setTimeout(type, isDeleting ? deleteSpeed : typeSpeed);
    return () => clearTimeout(timeout);
  }, [typingIndex, isDeleting]);

  const thumbsUpVariants = {
    initial: { scale: 1, rotate: 0 },
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatDelay: 2,
      },
    },
  };

  const containerVariants = {
    hidden: {
      opacity: 0,
      y: -100,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: "easeOut",
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {isReady && (
        <motion.div
          className="text-[#DF8244] bg-[#FEF9F6] border border-[#F8E2D3] mt-8 -mb-6 font-semibold rounded-lg flex items-center text-ellipsis text-nowrap px-4 py-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <div className="w-full h-10 flex justify-between items-center gap-x-4">
            <motion.div
              className="flex justify-center items-center"
              variants={thumbsUpVariants}
              initial="initial"
              animate="animate"
            >
              <Image
                src={"/thumbs_up.svg"}
                width={50}
                height={50}
                alt="thumbs-up"
                className="h-9"
                priority
              />
            </motion.div>

            <div className="flex-1 overflow-hidden min-w-64">
              <div
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontWeight: "bold",
                  fontSize: "16px",
                  whiteSpace: "nowrap",
                }}
              >
                {displayText}
                <span className="animate-pulse text-[#DF8244]">|</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
