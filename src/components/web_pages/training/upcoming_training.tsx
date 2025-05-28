"use client";
import React, { useState } from "react";
import data from "@/utils/data/training_data.json";
import Card from "./card";
import { getNextMondayDates } from "@/utils/reusables/functions";
import { motion } from "framer-motion";

export default function UpcomingCohorts() {
  const mondayDates = getNextMondayDates(15);
  const itemsReplica = data[0];

  const displayItems = new Array(15).fill(itemsReplica);

  const [visibleItems, setVisibleItems] = useState(6);

  const handleSeeMore = () => {
    if (visibleItems < displayItems.length) {
      setVisibleItems(visibleItems + 3);
    } else {
      setVisibleItems(6);
    }
  };

  return (
    <section
      className="w-screen flex flex-col lg:px-12 px-6 py-4 md:mt-16 my-8 bg-[#FEF9F6] lg:-mx-10 -mx-8 2xl:mx-0 2xl:w-full"
      id="upcoming-training"
    >
      <h1 className="md:text-4xl text-2xl my-8 font-bold font-bricolage_grotesque lg:px-6 md:px-6">
        Upcoming Trainings
      </h1>

      <div className="w-full flex flex-wrap py-2">
        {displayItems.slice(0, visibleItems).map((item, index) => (
          <motion.div
            className="lg:w-[30%] md:w-[45%] w-full border border-[#DBE1E7] md:mx-4 md:my-4 mx-2 my-2 rounded-2xl shadow-xs shadow-[#0000001A] cursor-pointer hover:border-[#89C13E] transition-all duration-300"
            style={{ transform: "translateZ(0)" }}
            key={index}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.1, type: "keyframes" },
            }}
            whileTap={{
              scale: 1.08,
              transition: { duration: 0.1, type: "keyframes" },
            }}
          >
            <Card
              id={index}
              description={""}
              date={
                (mondayDates &&
                  mondayDates[index].toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })) ||
                "no date set"
              }
              title={item.title}
              id2={item.id}
              price={item.pricing}
            />
          </motion.div>
        ))}
      </div>

      {data.length > 3 && (
        <button
          onClick={handleSeeMore}
          className="mx-auto mt-6 px-6 py-2 bg-[#89C13E] text-white rounded-lg hover:bg-[#7BAF37] transition-colors duration-300"
        >
          {visibleItems >= displayItems.length ? "See Less" : "See More"}
        </button>
      )}
    </section>
  );
}
