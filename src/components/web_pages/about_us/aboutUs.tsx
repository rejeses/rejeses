"use client";

import {
  motion,
  useScroll,
  useInView,
  useAnimation,
  useTransform,
} from "framer-motion";
import React, { useRef, useEffect } from "react";
import Link from "next/link";
import Logo_slider from "../../reusables/animation/logo_slider";
import {
  scrollSectionTypes,
  AnimatedAboutcardProps,
} from "@/utils/types/types";
import Button from "@/components/reusables/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7 } },
};

const staggeredList = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const listItem = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

const cardVariants = {
  offscreen: {
    y: 50,
    opacity: 0,
    scale: 0.95,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8,
    },
  },
};

const ScrollSection = ({
  children,
  className,
  cardStyle = false,
}: scrollSectionTypes & { cardStyle?: boolean }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3, once: false });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={fadeInUp}
      className={`${className} ${
        cardStyle ? "transform transition-all duration-300 hover:shadow-lg" : ""
      }`}
    >
      {children}
    </motion.div>
  );
};

const AnimatedCard = ({
  children,
  delay = 0,
  className = "",
}: AnimatedAboutcardProps) => {
  return (
    <motion.div
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: false, amount: 0.3 }}
      className={`bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl h-full flex flex-col ${className}`}
    >
      <motion.div
        variants={cardVariants}
        transition={{ delay }}
        className="h-full flex flex-col"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default function AboutUs() {
  const headerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.15], [0.85, 1]);
  const bgBlur = useTransform(scrollYProgress, [0, 0.15], [0, 5]);

  return (
    <section className="flex flex-col my-6 overflow-hidden">
      {/* Hero Header with Parallax Effect */}
      <motion.div
        className="relative w-full h-[300px] md:h-[350px] lg:h-[400px] overflow-hidden bg-[#4B006E]"
        initial={{ height: "0%" }}
        animate={{ height: "400px" }}
        transition={{ duration: 1.2 }}
      >
        <motion.div
          className="absolute inset-0 bg-linear-to-br from-[#4B006E] to-[#89C13E]/30 z-0"
          style={{ opacity: bgOpacity }}
        />

        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10"
          ref={headerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{ scale }}
        >
          <motion.div
            className="text-center px-4"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-bricolage_grotesque mb-4">
              About Us
            </h1>
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100px" }}
              transition={{ duration: 1, delay: 0.7 }}
              className="h-1 bg-orange-400 mx-auto rounded-full"
            />
            <motion.p
              className="text-white text-lg md:text-xl mt-4 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              We Build Skills. We Drive Success
            </motion.p>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-0 w-full h-16 bg-linear-to-t from-white to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        />
      </motion.div>

      <div className="container mx-auto px-4 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Who We Are Card */}
          <AnimatedCard
            delay={0.2}
            className="col-span-1 md:col-span-2 lg:col-span-3"
          >
            <div className="p-6 md:p-8 border-l-4 border-[#4B006E] grow">
              <motion.div
                className="text-[#535353] flex flex-col gap-y-4"
                variants={fadeInRight}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
              >
                <p className="text-lg">
                  At <strong>Rejeses PM Consulting,</strong> we are passionate
                  about empowering individuals and organizations through
                  exceptional training and mentoring in project management.
                </p>

                <p className="text-lg">
                  With a proven track record spanning over 18 years, we help
                  project professionals and teams develop the skills,
                  confidence, and knowledge they need to excel in today&apos;s
                  dynamic business environment.
                </p>

                <p className="text-lg">
                  While training and mentoring are our core focus, we also
                  provide consulting services to help businesses overcome
                  project challenges, optimize processes, and achieve their
                  strategic goals.
                </p>
              </motion.div>
            </div>
          </AnimatedCard>

          {/* Mission Card */}
          <AnimatedCard delay={0.3}>
            <div className="h-full p-6 md:p-8 bg-linear-to-br from-white to-[#4B006E]/5 border-t-4 border-[#4B006E] flex flex-col">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: false, amount: 0.3 }}
                className="mb-4 text-[#4B006E]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </motion.div>
              <h2 className="text-2xl md:text-3xl font-semibold text-[#535353] font-bricolage_grotesque mb-4">
                Our Mission
              </h2>
              <motion.p
                className="text-lg text-[#535353] grow"
                variants={fadeInRight}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
              >
                To equip individuals and organizations with the tools, skills,
                and strategies they need to deliver successful projects and
                achieve long-term growth.
              </motion.p>
            </div>
          </AnimatedCard>

          {/* Vision Card */}
          <AnimatedCard delay={0.4}>
            <div className="h-full p-6 md:p-8 bg-linear-to-br from-white to-[#4B006E]/5 border-t-4 border-[#4B006E] flex flex-col">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: false, amount: 0.3 }}
                className="mb-4 text-[#4B006E]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </motion.div>
              <h2 className="text-2xl md:text-3xl font-semibold text-[#535353] font-bricolage_grotesque mb-4">
                Our Vision
              </h2>
              <motion.p
                className="text-lg text-[#535353] grow"
                variants={fadeInRight}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
              >
                To be a leading provider of project management training,
                mentoring, and consulting, transforming how businesses and
                professionals approach project delivery worldwide.
              </motion.p>
            </div>
          </AnimatedCard>

          {/* Core Values Card */}
          <AnimatedCard delay={0.5}>
            <div className="h-full p-6 md:p-8 bg-linear-to-br from-white to-[#4B006E]/5 border-t-4 border-[#4B006E] flex flex-col">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: false, amount: 0.3 }}
                className="mb-4 text-[#4B006E]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </motion.div>
              <h2 className="text-2xl md:text-3xl font-semibold text-[#535353] font-bricolage_grotesque mb-4">
                Our Philosophy: The REJESES Framework
              </h2>
              <motion.p className="mb-4 text-lg text-[#535353]">
                R.E.J.E.S.E.S is more than our name it&apos;s our belief system:
              </motion.p>
              <motion.ul
                className="space-y-2 flex flex-col gap-y-2 text-[#535353] overflow-y-auto max-h-[400px] pr-2"
                variants={staggeredList}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
              >
                <motion.li
                  variants={listItem}
                  className="flex items-start transform-gpu"
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  <motion.span
                    className="mr-2 mt-[2px] text-lg"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1, rotate: 360 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.1,
                    }}
                    viewport={{ once: false, amount: 0.3 }}
                  >
                    ⭐
                  </motion.span>
                  <div>
                    <p className="text-lg">
                      <b>R &#45; Real Execution:</b> We drive action through
                      practical tools, tested methodologies, and focused
                      delivery.
                    </p>
                  </div>
                </motion.li>

                <motion.li
                  variants={listItem}
                  className="flex items-start transform-gpu"
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  <motion.span
                    className="mr-2 mt-[2px] text-lg"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1, rotate: 360 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.2,
                    }}
                    viewport={{ once: false, amount: 0.3 }}
                  >
                    ⭐
                  </motion.span>
                  <div>
                    <p className="text-lg">
                      <b>E &#45; Excellence:</b> Quality is non-negotiable—from our
                      training content to our client engagements.
                    </p>
                  </div>
                </motion.li>

                <motion.li
                  variants={listItem}
                  className="flex items-start transform-gpu"
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  <motion.span
                    className="mr-2 mt-[2px] text-lg"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1, rotate: 360 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.3,
                    }}
                    viewport={{ once: false, amount: 0.3 }}
                  >
                    ⭐
                  </motion.span>
                  <div>
                    <p className="text-lg">
                      <b>J &#45; Judicious Strategy:</b> We promote intelligent,
                      evidence-based project planning and execution.
                    </p>
                  </div>
                </motion.li>

                <motion.li
                  variants={listItem}
                  className="flex items-start transform-gpu"
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  <motion.span
                    className="mr-2 mt-[2px] text-lg"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1, rotate: 360 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.4,
                    }}
                    viewport={{ once: false, amount: 0.3 }}
                  >
                    ⭐
                  </motion.span>
                  <div>
                    <p className="text-lg">
                      <b>E – Empowerment:</b> We develop professionals into
                      confident, certified, and capable project leaders.
                    </p>
                  </div>
                </motion.li>

                <motion.li
                  variants={listItem}
                  className="flex items-start transform-gpu"
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  <motion.span
                    className="mr-2 mt-[2px] text-lg"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1, rotate: 360 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.5,
                    }}
                    viewport={{ once: false, amount: 0.3 }}
                  >
                    ⭐
                  </motion.span>
                  <div>
                    <p className="text-lg">
                      <b>S &#45; Success Orientation:</b> We measure ourselves by
                      the success of our clients and their projects.
                    </p>
                  </div>
                </motion.li>

                <motion.li
                  variants={listItem}
                  className="flex items-start transform-gpu"
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  <motion.span
                    className="mr-2 mt-[2px] text-lg"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1, rotate: 360 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.6,
                    }}
                    viewport={{ once: false, amount: 0.3 }}
                  >
                    ⭐
                  </motion.span>
                  <div>
                    <p className="text-lg">
                      <b>E &#45; Enterprise Agility:</b> We embed agile thinking for
                      resilience in uncertain environments.
                    </p>
                  </div>
                </motion.li>

                <motion.li
                  variants={listItem}
                  className="flex items-start transform-gpu"
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  <motion.span
                    className="mr-2 mt-[2px] text-lg"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1, rotate: 360 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.7,
                    }}
                    viewport={{ once: false, amount: 0.3 }}
                  >
                    ⭐
                  </motion.span>
                  <div>
                    <p className="text-lg">
                      <b>S &#45;Service Leadership:</b> We lead by serving—putting
                      our client&apos;s transformation first.
                    </p>
                  </div>
                </motion.li>
              </motion.ul>
            </div>
          </AnimatedCard>
          {/* Why Choose Us Card */}
          <AnimatedCard delay={0.4} className="col-span-1 md:col-span-2">
            <div className="p-6 md:p-8 bg-linear-to-br from-white to-[#4B006E]/5 border-t-4 border-[#4B006E] flex flex-col h-full">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: false, amount: 0.3 }}
                className="mb-4 text-[#4B006E]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </motion.div>
              <h2 className="text-2xl md:text-3xl font-semibold text-[#535353] font-bricolage_grotesque mb-4">
                Why Choose Us?
              </h2>
              <motion.ul
                className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#535353] grow"
                variants={staggeredList}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
              >
                <motion.li
                  variants={listItem}
                  className="flex items-start p-4 bg-white/50 rounded-lg transform-gpu hover:bg-orange-400/10 transition-all duration-300"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <motion.span
                    className="mr-2 mt-[2px] text-lg shrink-0 text-[#4B006E]"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1, rotate: 360 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.1,
                    }}
                    viewport={{ once: false, amount: 0.3 }}
                  >
                    ⭐
                  </motion.span>
                  <div>
                    <p className="text-lg">
                      <b>Comprehensive Training:</b> From foundational
                      principles to advanced methodologies, we offer customized
                      training programs tailored to your needs.
                    </p>
                  </div>
                </motion.li>

                <motion.li
                  variants={listItem}
                  className="flex items-start p-4 bg-white/50 rounded-lg transform-gpu hover:bg-orange-400/10 transition-all duration-300"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <motion.span
                    className="mr-2 mt-[2px] text-lg shrink-0 text-[#4B006E]"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1, rotate: 360 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.2,
                    }}
                    viewport={{ once: false, amount: 0.3 }}
                  >
                    ⭐
                  </motion.span>
                  <div>
                    <p className="text-lg">
                      <b>Personalized Mentorship:</b> Our one-on-one mentoring
                      helps professionals overcome challenges, build confidence,
                      and achieve their career goals.
                    </p>
                  </div>
                </motion.li>

                <motion.li
                  variants={listItem}
                  className="flex items-start p-4 bg-white/50 rounded-lg transform-gpu hover:bg-orange-400/10 transition-all duration-300"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <motion.span
                    className="mr-2 mt-[2px] text-lg shrink-0 text-[#4B006E]"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1, rotate: 360 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.3,
                    }}
                    viewport={{ once: false, amount: 0.3 }}
                  >
                    ⭐
                  </motion.span>
                  <div>
                    <p className="text-lg">
                      <b>Consulting Expertise:</b> When needed, we step in to
                      provide actionable solutions for your project management
                      challenges.
                    </p>
                  </div>
                </motion.li>

                <motion.li
                  variants={listItem}
                  className="flex items-start p-4 bg-white/50 rounded-lg transform-gpu hover:bg-orange-400/10 transition-all duration-300"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <motion.span
                    className="mr-2 mt-[2px] text-lg shrink-0 text-[#4B006E]"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1, rotate: 360 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.4,
                    }}
                    viewport={{ once: false, amount: 0.3 }}
                  >
                    ⭐
                  </motion.span>
                  <div>
                    <p className="text-lg">
                      <b>Certified Excellence:</b> Led by certified PMPs with
                      extensive global experience.
                    </p>
                  </div>
                </motion.li>
              </motion.ul>
            </div>
          </AnimatedCard>
        </div>

        {/* Clients Section */}
        <AnimatedCard delay={0.2} className="mb-12 overflow-visible">
          <div className="p-6 md:p-8 bg-white">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#535353] font-bricolage_grotesque mb-6">
              We have worked directly with such companies as
            </h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: false, amount: 0.3 }}
              className="overflow-visible"
            >
              <Logo_slider />
            </motion.div>
          </div>
        </AnimatedCard>

        {/* Let's Grow Together Section */}
        <AnimatedCard delay={0.3} className="mb-12">
          <div className="p-6 md:p-8 bg-linear-to-br from-[#4B006E]/10 to-white border-l-4 border-[#4B006E] flex flex-col h-full">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#535353] font-bricolage_grotesque mb-4">
              Let&apos;s Grow Together
            </h2>
            <motion.div
              className="text-[#535353] flex flex-col gap-y-4 grow"
              variants={fadeInRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
            >
              <p className="text-lg">
                Whether you&apos;re an aspiring project manager, a seasoned
                professional, or a business seeking project management
                expertise, <strong>Rejeses</strong> is here to support your
                journey.
              </p>

              <p className="text-lg">
                Contact us today, or follow us on our social handles at the
                bottom of this page, to learn more about our training,
                mentoring, and consulting services.
              </p>
            </motion.div>

            <motion.div
              className="flex justify-center items-center mt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: false, amount: 0.3 }}
            >
              <span className="text-white">
                <Button
                  text="Enroll Now"
                  icon={<ArrowRightIcon />}
                  bg="#89C13E"
                  url="/training"
                  transition_class="transition_button4"
                />
              </span>
            </motion.div>
          </div>
        </AnimatedCard>
      </div>
    </section>
  );
}