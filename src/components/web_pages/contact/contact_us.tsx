"use client";
import Image from "next/image";
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  contact_us_values,
  ContactUsErrors,
  TouchedFields,
} from "@/utils/types/types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "@/app/feed/loading";
import { useNavigation } from "@/utils/context/payment";

export default function ContactUs() {
  const [formValues, setFormValues] = useState<contact_us_values>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<ContactUsErrors>({});
  const [touchedFields, setTouchedFields] = useState<TouchedFields>({
    name: false,
    email: false,
    message: false,
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

  const { isMobile } = useNavigation();

  const emailRegex = useMemo(
    () => /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/,
    []
  );

  const validate = useCallback(() => {
    const validationErrors: ContactUsErrors = {};

    if (!formValues.name.trim()) {
      validationErrors.name = "Name is required.";
    }
    if (!formValues.email.trim()) {
      validationErrors.email = "Email is required.";
    } else if (!emailRegex.test(formValues.email)) {
      validationErrors.email = "Invalid email address.";
    }
    if (!formValues.message.trim()) {
      validationErrors.message = "Message is required.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [formValues, emailRegex]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));

    // Mark field as touched
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
  };

  useEffect(() => {
    validate();
    setIsButtonDisabled(!validate());
  }, [formValues, validate]);

  const onSuccessAction = () => {
    setFormValues((prev) => ({ ...prev, email: "", name: "", message: "" }));
    setIsSubmitted(true);
  };

  const notify = () =>
    toast.error("Failed to send message", {
      autoClose: 3000,
      hideProgressBar: true,
      theme: "colored",
    });

  const sendMessage = async () => {
    const response = await axios.post("/api/messaging", { ...formValues });
    return response;
  };

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: () => sendMessage(),
    onSuccess: () => onSuccessAction(),
    onError: () => notify(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mark all fields as touched on submit
    setTouchedFields({
      name: true,
      email: true,
      message: true,
    });

    if (validate()) {
      mutate();
    }
  };

  const router = useRouter();
  const route_back = () => {
    router.back();
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
          {isMobile && (
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-bricolage_grotesque">
              Get in touch
            </h2>
          )}
          <motion.div
            className="relative h-64 overflow-hidden rounded-lg sm:h-80 lg:min-h-full"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="/contact_image.jpg"
              alt="Contact Us"
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 hover:scale-105"
            />
          </motion.div>

          <motion.div
            className="lg:pl-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="md:mx-4 mx-auto max-w-lg lg:mx-0">
              {!isMobile && (
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-bricolage_grotesque">
                  Get in touch
                </h2>
              )}
              <p className="mt-4 text-lg text-gray-500">
                We&apos;d love to hear from you! Whether you have a question
                about our courses, need career advice, or want to make an
                enquiry, we&apos;re here for you.
              </p>
              {isSubmitted && isSuccess ? (
                <motion.div
                  className="mt-8 p-4 rounded-lg lg:text-3xl text-gray-500 text-2xl font-bold text-center font-bricolage_grotesque italic"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Thank you for your message! We&apos;ll get back to you soon.
                  <div className="my-6">
                    <motion.button
                      type="submit"
                      className="inline-flex w-full bg-[#89C13E] justify-center rounded-md border 
                      border-transparent bg-primary-green px-4 py-3 text-base font-medium text-white shadow-xs hover:bg-[#89C13E]/90 
                      focus:outline-hidden focus:ring-2 focus:ring-[#89C13E] focus:ring-offset-2 sm:text-sm transition ease-in-out duration-500"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={route_back}
                    >
                      Go Back
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formValues.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="mt-1 block w-full rounded-md py-3 px-2 border-gray-300 shadow-md border-none outline-hidden 
    focus:ring-2 focus:ring-[#89C13E] transition ease-in-out duration-500"
                    />
                    {touchedFields.name && errors.name && (
                      <p className="text-[#89C13E] text-sm mt-1">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formValues.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="mt-1 block w-full rounded-md py-3 px-2 border-gray-300 shadow-md border-none outline-hidden 
    focus:ring-2 focus:ring-[#89C13E] transition ease-in-out duration-500"
                    />
                    {touchedFields.email && errors.email && (
                      <p className="text-[#89C13E] text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formValues.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="mt-1 block w-full rounded-md py-3 px-2 border-gray-300 shadow-md border-none outline-hidden 
    focus:ring-2 focus:ring-[#89C13E] transition ease-in-out duration-500"
                    ></textarea>
                    {touchedFields.message && errors.message && (
                      <p className="text-[#89C13E] text-sm mt-1">
                        {errors.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <motion.button
                      type="submit"
                      disabled={isButtonDisabled}
                      className="inline-flex w-full bg-[#89C13E] justify-center items-center rounded-md border 
                      border-transparent bg-primary-green px-4 py-3 text-base font-medium text-white shadow-xs hover:bg-[#89C13E]/90 
                      focus:outline-hidden focus:ring-2 focus:ring-[#89C13E] focus:ring-offset-2 sm:text-sm transition ease-in-out duration-500"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Send Message
                      {isPending && (
                        <span className="mx-6">
                          <Loading />
                        </span>
                      )}
                    </motion.button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
