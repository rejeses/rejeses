import { PromoData } from "@/utils/types/types";
import { useEffect, useRef, useState } from "react";
import { isPromoExpired } from "@/utils/reusables/functions";
import { motion, useInView, useAnimation } from "framer-motion";

interface PromoCountdownProps {
  promoData: PromoData;
}

const PromoCountdown = ({ promoData }: PromoCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const ref = useRef(null);
  const inView = useInView(ref, { once: false, amount: 0.3 }); // re-trigger when 30% in view
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    } else {
      controls.start({ opacity: 0, y: 20 });
    }
  }, [inView, controls]);

  useEffect(() => {
    if (!promoData?.dateRange) return;

    const endDate = new Date(promoData.dateRange[1]).getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [promoData]);

  if (isPromoExpired(promoData, promoData.dateRange[1]) || !promoData?.isPromo)
    return null;

  return (
    <motion.div
      ref={ref}
      className="bg-linear-to-r from-orange-600 to-orange-400 text-white rounded-2xl p-6 shadow-lg mb-8 max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h3 className="text-xl font-semibold mb-4 font-bricolage_grotesque">
        🎉 Limited Time Offer Ends In:
      </h3>
      <div className="flex justify-center gap-4 text-center">
        {["Days", "Hours", "Minutes", "Seconds"].map((label, idx) => {
          const value = [
            timeLeft.days,
            timeLeft.hours,
            timeLeft.minutes,
            timeLeft.seconds,
          ][idx];
          return (
            <div
              key={label}
              className="bg-white text-orange-500 rounded-lg px-4 py-2 w-20 shadow-md"
            >
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-xs font-medium text-gray-600">{label}</div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default PromoCountdown;
