"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PrivacyPolicy() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const childVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen text-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-3xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl font-bold mb-8 text-center text-[#89C13E] font-bricolage_grotesque"
          variants={childVariants}
        >
          Privacy Policy
        </motion.h1>

        <motion.section variants={childVariants} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#89C13E] font-bricolage_grotesque">
            1. Introduction
          </h2>
          <p className="mb-4 text-[#5B5B5B] text-xl">
            Welcome to our Privacy Policy. This page explains how we
            collect, use, and protect your personal information.
          </p>
        </motion.section>

        <motion.section variants={childVariants} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#89C13E] font-bricolage_grotesque">
            2. Information We Collect
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-[#5B5B5B] text-xl">
            <li>Personal information (e.g., name, email address)</li>
            <li>Usage data (e.g., how you interact with our service)</li>
            <li>Device information (e.g., IP address, browser type)</li>
          </ul>
        </motion.section>

        <motion.section variants={childVariants} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#89C13E] font-bricolage_grotesque">
            3. How We Use Your Information
          </h2>
          <p className="mb-4 text-[#5B5B5B] text-xl">
            We use your information to provide and improve our services,
            communicate with you, and comply with legal obligations.
          </p>
        </motion.section>

        <motion.section variants={childVariants} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#89C13E] font-bricolage_grotesque">
            4. Data Security
          </h2>
          <p className="mb-4 text-[#5B5B5B] text-xl">
            We implement appropriate technical and organizational measures to
            protect your personal information.
          </p>
        </motion.section>

        <motion.section variants={childVariants} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#89C13E] font-bricolage_grotesque">
            5. Your Rights
          </h2>
          <p className="mb-4 text-[#5B5B5B] text-xl">
            You have the right to access, correct, or delete your personal
            information. Contact us to exercise these rights.
          </p>
        </motion.section>

        <motion.section variants={childVariants} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#89C13E] font-bricolage_grotesque">
            6. Changes to This Policy
          </h2>
          <p className="mb-4 text-[#5B5B5B] text-xl">
            We may update this policy from time to time. We will notify you of
            any significant changes.
          </p>
        </motion.section>

        <motion.section variants={childVariants} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#89C13E] font-bricolage_grotesque">
            7. Contact Us
          </h2>
          <p className="mb-4 text-[#5B5B5B] text-xl">
            If you have any questions about this Privacy Policy, please contact
            us at
            <span className="ml-2">
              <Link
                href="mailto:info@rejeses.com"
                className="transition_border italic py-1 font-bold font-bricolage_grotesque"
              >
                info@rejeses.com
              </Link>
            </span>
          </p>
        </motion.section>

        <motion.div
          variants={childVariants}
          className="mt-12 p-4 bg-[#89C13E] bg-opacity-10 rounded-lg"
        >
          <p className="text-lg text-center text-[#89C13E]">
            Last updated: 11/30/2024
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
