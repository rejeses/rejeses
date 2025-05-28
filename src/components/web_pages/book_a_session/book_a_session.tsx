"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "@radix-ui/react-icons";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { InlineWidget } from "react-calendly";

const BookSessionPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
  });
  const [showCalendly, setShowCalendly] = useState(false);

  const services = ["Training", "Mentoring", "Consultation"];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const notify = (message: string) =>
    toast.error(message, {
      autoClose: 3000,
      hideProgressBar: true,
      theme: "colored",
    });

  const handleScheduleNow = () => {
    const { name, email, phone, service } = formData;

    if (!name || !email || !phone || !service) {
      notify("Please fill out all fields");
      return;
    }

    if (!isValidEmail(email)) {
      notify("Please enter a valid email address.");
      return;
    }

    // Show Calendly widget
    setShowCalendly(true);
  };

  const goBack = () => {
    router.back();
  };

  const schedule_link = process.env.NEXT_PUBLIC_SCHEDULE_LINK || "";

  return (
    <section className=" flex flex-col px-4 my-6">
      <div className="flex flex-col lg:justify-center lg:items-center w-full">
        <motion.header
          className="bg-[#89C13E] text-white py-6 lg:w-3/4 font-bricolage_grotesque lg:text-4xl"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-center">
              Book a Session
            </h1>
          </div>
        </motion.header>

        <motion.div
          className="space-y-6 my-6 lg:w-3/4"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-[#535353] font-bricolage_grotesque">
            Why Book a Session?
          </h2>
          <p className="text-[#535353]">
            Our expert consultations provide personalized insights and
            strategies to help you achieve your goals. Whether you&apos;re
            looking for career advice, business coaching, or personal
            development, we&apos;re here to support you.
          </p>
          <ul className="space-y-2 text-[#535353]">
            <motion.li
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="flex items-start"
            >
              <span className="mr-2">⭐</span> One-on-one personalized attention
            </motion.li>
            <motion.li
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="flex items-start"
            >
              <span className="mr-2">⭐</span> Tailored advice for your specific
              situation
            </motion.li>
            <motion.li
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              className="flex items-start"
            >
              <span className="mr-2">⭐</span> Actionable strategies you can
              implement immediately
            </motion.li>
            <motion.li
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.7 }}
              className="flex items-start"
            >
              <span className="mr-2">⭐</span> Follow-up support to ensure your
              success
            </motion.li>
          </ul>
        </motion.div>
      </div>
      <div className="flex items-center justify-center p-4">
        {!showCalendly ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row"
          >
            <div className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-[#89C13E]">
              <motion.h1
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white text-3xl font-bold mb-4 font-bricolage_grotesque"
              >
                Book Your Session
              </motion.h1>
              <motion.p
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white mb-6"
              >
                Schedule a time that works for you, and let&apos;s create something amazing together!
              </motion.p>

              <div className="space-y-4 text-white">
                <div className="flex items-center">
                  <Icons.CalendarIcon className="mr-3 w-5 h-5" />
                  <span>Flexible Scheduling</span>
                </div>
                <div className="flex items-center">
                  <Icons.ClockIcon className="mr-3 w-5 h-5" />
                  <span>Multiple Time Zones</span>
                </div>
                <div className="flex items-center">
                  <Icons.PersonIcon className="mr-3 w-5 h-5" />
                  <span>Personalized Sessions</span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 p-8 bg-[#535353]">
              <motion.form
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-4 text-white"
              >
                <div>
                  <label className="block mb-2">Name</label>
                  <div className="flex items-center bg-white/10 rounded-lg p-2">
                    <Icons.PersonIcon className="mr-2 w-5 h-5 text-white" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your Full Name"
                      className="bg-transparent w-full text-white placeholder-white/50 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2">Email</label>
                  <div className="flex items-center bg-white/10 rounded-lg p-2">
                    <Icons.EnvelopeClosedIcon className="mr-2 w-5 h-5 text-white" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className="bg-transparent w-full text-white placeholder-white/50 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2">Phone</label>
                  <div className="flex items-center bg-white/10 rounded-lg p-2">
                    <Icons.MobileIcon className="mr-2 w-5 h-5 text-white" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(123) 456-7890"
                      className="bg-transparent w-full text-white placeholder-white/50 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2">Service</label>
                  <div className="flex items-center bg-white/10 rounded-lg p-2">
                    <Icons.ListBulletIcon className="mr-2 w-5 h-5 text-white" />
                    <select
                      title="select a service"
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="bg-transparent w-full text-white outline-hidden appearance-none"
                    >
                      <option value="" className="text-gray-800">
                        Select a Service
                      </option>
                      {services.map((service) => (
                        <option
                          key={service}
                          value={service}
                          className="text-gray-800"
                        >
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleScheduleNow}
                  className="w-full py-3 rounded-lg text-white font-bricolage_grotesque bg-[#89C13E] font-bold flex items-center justify-center"
                >
                  <Icons.RocketIcon className="mr-2 w-5 h-5" />
                  Schedule Now
                </motion.button>
              </motion.form>
            </div>
          </motion.div>
        ) : (
          <div className="w-full max-w-4xl">
            <InlineWidget
              url={schedule_link ?? ""}
              pageSettings={{
                backgroundColor: "ffffff",
                hideEventTypeDetails: false,
                hideLandingPageDetails: false,
              }}
              prefill={{
                name: formData.name,
                email: formData.email,
                customAnswers: {
                  a1: formData.service,
                  a2: formData.phone,
                },
              }}
            />
            <div className="text-center mt-4">
              <button
                onClick={goBack}
                className="px-6 py-2 bg-[#89C13E] text-white rounded-lg"
              >
                Go Back
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BookSessionPage;
