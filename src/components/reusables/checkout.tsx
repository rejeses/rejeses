"use client";
import type { classSceduleType, ClientPageProps } from "@/utils/types/types";
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  useCallback,
} from "react";
import type {
  FormDataTYpe,
  OrderResponse,
  TransactionResponseType,
} from "@/utils/types/types";
import { usePayment, useNavigation } from "@/utils/context/payment";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import PaystackPop from "@paystack/inline-js";
import { useMutation } from "@tanstack/react-query";
import Loading from "@/app/feed/loading";
import type { TransactionDataType, OrderDataType } from "@/utils/types/types";
import Transaction_success from "./checkout_components/transaction_success";
import Transaction_failed from "./checkout_components/transaction_failed";
import Image from "next/image";
import Transaction_error from "./checkout_components/transaction_error";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import usePromoData from "@/utils/hooks/usePromoData";
import { notify } from "@/utils/reusables/functions";

export default function Checkout({ pricingItem }: ClientPageProps) {
  const [generalPrice, setGeneralPrice] = useState<number>(0);
  const { promoData } = usePromoData();
  const { paymentInfo, setPaymentInfo, selectedType } = usePayment();
  const [transactionResponse, setTransactionResponse] =
    useState<TransactionResponseType>({
      data: { authorization_url: "", access_code: "", reference: "" },
    });

  const [count, setCount] = useState<number>(paymentInfo.is_group ? 5 : 1);
  const [createInputs, setCreateInputs] = useState<number[]>([]);
  const [showInput, setShowInput] = useState<boolean>(false);

  const POLLING_INTERVAL = 5000;
  const MAX_POLLING_ATTEMPTS = 60;

  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [pollingAttempts, setPollingAttempts] = useState<number>(0);
  const [transactionStatus, setTransactionStatus] = useState<string>("");
  const [transactionReference, setTransactionReference] = useState<string>("");
  const [dataValue, setDataValue] = useState<TransactionDataType>({
    id: 0,
    txid: "",
    orderRef: 0,
    pid: "",
    reference: "",
    status: "",
    accessCode: "",
    currency: "",
    fee: 0,
    updatedAt: "",
    createdAt: "",
  });

  const [isPromo, setIsPromo] = useState(false);

  useEffect(() => {
    fetch("/promo/promo.json")
      .then((res) => res.json())
      .then((data) => {
        setIsPromo(data.isPromo);

        if (data.isPromo && data.prices) {
          setPaymentInfo((prev) => ({
            ...prev,
            promoPrices: {
              isPromo: true,
              dateRange: data.dateRange,
              prices: {
                naira: {
                  training: data.prices.naira.training,
                  mentoring: data.prices.naira.mentoring,
                  "training&mentoring": data.prices.naira["training&mentoring"],
                },
                dollar: {
                  training: data.prices.dollar.training,
                  mentoring: data.prices.dollar.mentoring,
                  "training&mentoring":
                    data.prices.dollar["training&mentoring"],
                },
              },
            },
          }));
        }
      })
      .catch((err) => console.error("Error fetching promo status", err));
  }, []);

  const [orderValue, setOrderValue] = useState<OrderDataType>({
    id: 0,
    firstName: "",
    lastName: "",
    courseType: "",
    courseSchedule: [],
    courseScheduleType: "weekday" as classSceduleType,
    startDate: "",
    email: "",
    amount: 0,
    status: "",
    createdAt: "",
    updatedAt: "",
    participants: [],
  });

  const [modal, setModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [price, setPrice] = useState<number>(0);
  const [fees, setFees] = useState<number>(0);

  const { isNigeria } = useNavigation();

  const pathname = usePathname();
  const decodedPathname = useMemo(
    () => decodeURIComponent(pathname),
    [pathname]
  );

  const [formData, setFormData] = useState<FormDataTYpe>({
    firstName: "",
    lastName: "",
    email: "",
    discount: undefined,
    currency: isNigeria ? "NGN" : "USD",
    participants: [],
  });

  function formatPrice(price: number | undefined): string {
    if (typeof price !== "number") return "";

    const rounded = Math.round(price);
    return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const popup = useMemo(() => new PaystackPop(), []);

  const router = useRouter();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Check if this is a participant field
    if (name.startsWith("participant")) {
      // Extract participant index and field type from name
      const matches = name.match(/participant(Name|Email)-(\d+)/);

      if (matches) {
        const fieldType = matches[1].toLowerCase(); // "name" or "email"
        const index = parseInt(matches[2]); // Participant index

        setFormData((prev) => {
          // Create a copy of the current participants array
          const updatedParticipants = [...(prev.participants || [])];

          // Make sure we have an object for this participant
          if (!updatedParticipants[index]) {
            updatedParticipants[index] = { name: "", email: "" };
          }

          // Update the specific field
          updatedParticipants[index] = {
            ...updatedParticipants[index],
            [fieldType]: value,
          };

          // Return updated form data
          return {
            ...prev,
            participants: updatedParticipants,
          };
        });
      }
    } else {
      // Handle regular form fields as before
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const closeModal = () => {
    setModal(!modal);
    setTransactionStatus("");
    setErrorMessage("");
  };

  function capitalizeWords(name: string) {
    return name
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  const createOrder = async (
    formData: FormDataTYpe
  ): Promise<OrderResponse | null> => {
    try {
      let formattedParticipants;
      if (formData.participants && formData.participants.length > 0) {
        formattedParticipants = formData.participants.map((participant) => ({
          name: capitalizeWords(participant.name),
          email: participant.email,
        }));
      }

      const orderBodyParam = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        courseType: paymentInfo.training_type,
        startDate: paymentInfo.start_date,
        courseScheduleType: paymentInfo.classScheduleType,
        email: formData.email,
        amount: getPrice(),
        currency: formData.currency,
        participants: formattedParticipants,
        // promocode: formData.discount,
      };

      const response = await axios.post<OrderResponse>(
        "/api/order",
        JSON.stringify(orderBodyParam)
      );

      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const { status, data } = err.response;
        const message = data?.message;

        if (
          status === 403 &&
          message === "Invalid or expired promo code given"
        ) {
          setErrorMessage("Invalid or expired promo code given");
          return null;
        }
      } else {
        console.error("Something went wrong creating order", err);
        setModal(true);
        setErrorMessage("Something went wrong creating your order 😓");
        return null;
      }
      return null;
    }
  };

  const createTransaction = async (formData: FormDataTYpe) => {
    try {
      const order = await createOrder(formData);

      if (!order) {
        console.error("Order creation failed, stopping transaction.");
        setModal(true);
        return;
      }

      const transactionBodyParam = {
        ref: Number(order.data),
        pid: "incoming",
        currency: formData.currency,
        _fee: Number(0),
      };

      const transactionResponse = await axios.post(
        "/api/transaction",
        JSON.stringify(transactionBodyParam)
      );

      setTransactionResponse(transactionResponse.data.data);
      return transactionResponse.data;
    } catch (err) {
      console.error("Something went wrong creating transaction", err);
      setModal(true);
      setErrorMessage("Something went wrong processing order 😓");
      throw err;
    }
  };

  const mutation = useMutation({
    mutationFn: createTransaction,
    onError: (error) => {
      console.error("Something went wrong!", error);
    },

    onSuccess: (data) => {
      setTransactionResponse(data.data);
      setIsPolling(true);
    },
  });

  const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
  const handleFormSubmit = async (
    e: FormEvent<HTMLButtonElement> | ReactKeyboardEvent
  ) => {
    e.preventDefault();
    try {
      // Basic validation for main form fields
      if (
        formData.lastName === "" ||
        formData.firstName === "" ||
        !emailRegex.test(formData.email)
      ) {
        if (!emailRegex.test(formData.email)) {
          notify("Please input a valid email address");
        } else {
          notify("Please fill in your details");
        }
        return;
      }

      if (count > 1 || (count === 1 && showInput)) {
        if (!formData.participants || formData.participants.length < count) {
          notify("Missing participant information");
          return;
        }

        for (let i = 0; i < count; i++) {
          const participant = formData.participants[i];

          if (!participant || !participant.name || !participant.email) {
            notify(`Please fill in details for Participant ${i + 1}`);
            return;
          }

          if (!participant.name.trim().includes(" ")) {
            notify(
              `Please enter full name (first and last) for Participant ${i + 1}`
            );
            return;
          }

          if (!emailRegex.test(participant.email)) {
            notify(`Please input a valid email for Participant ${i + 1}`);
            return;
          }
        }
      }

      mutation.mutate(formData);
    } catch (err) {
      console.error("Something went wrong!", err);
    }
  };

  const plus = () => {
    if (paymentInfo.is_group) {
      setCount((prev) => prev + 5);
    } else {
      setCount((prev) => prev + 1);
    }
  };

  const minus = () => {
    if (paymentInfo.is_group) {
      setCount((prev) => Math.max(prev - 5, 5));
    } else {
      setCount((prev) => Math.max(prev - 1, 1));
    }
  };

  useEffect(() => {
    const inputs = Array.from({ length: count }, (_, i) => i);
    setCreateInputs(inputs);

    // initilaize particpants inputs values
    setFormData((prev) => {
      const updatedParticipants = [...prev.participants];

      while (updatedParticipants.length < count) {
        updatedParticipants.push({ name: "", email: "" });
      }
      if (updatedParticipants.length > count) {
        updatedParticipants.length = count;
      }
      return { ...prev, participants: updatedParticipants };
    });
  }, [count]);

  const continueTransaction = async () => {
    try {
      if (
        transactionResponse.data.access_code !== "" &&
        transactionResponse.data.authorization_url !== "" &&
        transactionResponse.data.reference !== ""
      ) {
        popup.resumeTransaction(transactionResponse.data.access_code);

        clearValues();
      }
    } catch (err) {
      console.error("Something went wrong", err);
    }
  };

  const clearValues = () => {
    setFormData((prev) => ({
      ...prev,
      firstName: "",
      lastName: "",
      email: "",
      currency: "",
      discount: undefined,
      participants: [],
    }));
  };

  useEffect(() => {
    if (transactionResponse.data.reference !== "") {
      continueTransaction();
    }
  }, [transactionResponse]);

  useEffect(() => {
    if (!isPolling) return;

    setTransactionReference(transactionResponse.data.reference);

    const pollTransactionStatus = async () => {
      try {
        const response = await axios.get(
          `/api/get_status?reference=${transactionResponse.data.reference}`
        );
        const { status, data, order } = response.data;

        const bodyValues = {
          firstName: order.firstName,
          lastName: order.lastName,
          courseType: order.courseType,
          courseScheduleType: order.courseScheduleType,
          courseSchedule: order.courseSchedule,
          startDate: order.startDate,
          email: order.email,
          amount: order.amount,
          currency: data.currency,
          participants: order.participants,
        };

        if (status === 200 && data.status === "completed") {
          setDataValue(data);
          setOrderValue(order);
          setIsPolling(false);
          setTransactionStatus("completed");
          setModal(true);
          await axios.post("/api/messaging/notify_owner", bodyValues, {
            headers: {
              "Content-Type": "application/json",
            },
          });
        } else if (status === 200 && data.status === "failed") {
          setIsPolling(false);
          setTransactionStatus("failed");
          setModal(true);
        } else {
          setPollingAttempts((prev) => prev + 1);
          if (pollingAttempts >= MAX_POLLING_ATTEMPTS) {
            setIsPolling(false);
            setModal(true);
            setErrorMessage(
              "Transaction status check timed out. Please contact support."
            );
          }
        }
      } catch (error) {
        console.error("Error polling transaction status", error);
        setModal(true);
        setErrorMessage("Error getting transaction status");
        setPollingAttempts((prev) => prev + 1);
        if (pollingAttempts >= MAX_POLLING_ATTEMPTS) {
          setIsPolling(false);
          setModal(true);
          setErrorMessage(
            "Error checking transaction status. Please contact support."
          );
        }
      }
    };

    const intervalId = setInterval(pollTransactionStatus, POLLING_INTERVAL);

    return () => clearInterval(intervalId);
  }, [isPolling, transactionResponse.data.reference, pollingAttempts]);

  useEffect(() => {
    if (decodedPathname.split("/")[1] === "training") {
      if (paymentInfo.start_date === "" || paymentInfo.training_type === "") {
        router.push("/training");
      }
    } else {
      if (paymentInfo.start_date === "" || paymentInfo.training_type === "") {
        router.push("/mentorship");
      }
    }
  }, [paymentInfo]);

  useEffect(() => {
    setTransactionStatus("");

    setErrorMessage("");

    setTransactionResponse((prev) => ({
      ...prev,
      data: { access_code: "", authorization_url: "", reference: "" },
    }));

    if (pricingItem) {
      const priceArray = pricingItem.pricing.individuals.map(
        (item) => item.price
      );
      const price = priceArray.length > 0 ? priceArray[0] : 0;

      setGeneralPrice(price);
    }
  }, []);

  const VatCalculation = (priceval: number): number => {
    const P = Math.ceil(priceval);

    // VAT is 2% of the price
    const vat = 0.02 * P;

    // Total amount to be paid by customer
    const total = P + vat;

    // Set the fee (just the VAT in this case)
    setFees(Math.ceil(vat));

    return Math.ceil(total);
  };

  const getPrice = useCallback((): number => {
    let price;
    if (isNigeria && formData.currency === "NGN") {
      price = paymentInfo.is_group
        ? paymentInfo.price2 * count
        : paymentInfo.price2 * count;
    } else if (isNigeria && formData.currency === "USD") {
      price = paymentInfo.is_group
        ? paymentInfo.price * count
        : paymentInfo.price * count;
    } else if (!isNigeria && formData.currency === "NGN") {
      price = paymentInfo.is_group
        ? paymentInfo.price2 * count
        : paymentInfo.price2 * count;
    } else if (!isNigeria && formData.currency === "USD") {
      price = paymentInfo.is_group
        ? paymentInfo.price * count
        : paymentInfo.price * count;
    } else {
      price = 0;
    }

    if ((paymentInfo.is_group || !isPromo) && formData.currency === "NGN") {
      return VatCalculation(price);
    } else {
      if (!paymentInfo.is_group && formData.currency === "NGN" && isPromo) {
        if (paymentInfo.training_type === "Project Management Training") {
          const fixedPrice =
            (paymentInfo.promoPrices?.prices.naira.training || 55000) * count;
          return VatCalculation(fixedPrice);
        } else if (
          paymentInfo.training_type === "Project Management Mentoring"
        ) {
          const fixedPrice =
            (paymentInfo.promoPrices?.prices.naira.mentoring || 250000) * count;
          return VatCalculation(fixedPrice);
        } else if (
          paymentInfo.training_type ===
          "Project Management Training & Mentoring"
        ) {
          const fixedPrice =
            (paymentInfo.promoPrices?.prices.naira["training&mentoring"] ||
              300000) * count;

          console.log(fixedPrice, "chec");

          return VatCalculation(fixedPrice);
        }
      } else if (
        !paymentInfo.is_group &&
        formData.currency === "USD" &&
        isPromo
      ) {
        if (paymentInfo.training_type === "Project Management Training") {
          return (
            (paymentInfo.promoPrices?.prices.dollar.training || 60) * count
          );
        } else if (
          paymentInfo.training_type === "Project Management Mentoring"
        ) {
          return (
            (paymentInfo.promoPrices?.prices.dollar.mentoring || 240) * count
          );
        } else if (
          paymentInfo.training_type ===
          "Project Management Training & Mentoring"
        ) {
          return (
            (paymentInfo.promoPrices?.prices.dollar["training&mentoring"] ||
              300) * count
          );
        }
      } else {
        return price;
      }
    }
    return VatCalculation(price);
  }, [
    isNigeria,
    formData.currency,
    paymentInfo.price,
    paymentInfo.price2,
    count,
    paymentInfo.is_group,
    isPromo,
    paymentInfo.training_type,
    paymentInfo.promoPrices,
  ]);

  useEffect(() => {
    const calculatedPrice = getPrice();
    setPrice(calculatedPrice);
  }, [getPrice]);

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      handleFormSubmit(e);
    }
  };

  useEffect(() => {
    console.log(paymentInfo, "full info at about");
    console.log(paymentInfo.price2, "price2 at about");
    console.log(paymentInfo.price, "price at about");
  }, [paymentInfo]);

  useEffect(() => {
    console.log(formData.participants, "is participants");
    if (count === 1 && !showInput) {
      setFormData((prev) => ({
        ...prev,
        participants: [],
      }));
    } else if (count === 1 && showInput) {
      setFormData((prev) => ({
        ...prev,
        participants: [{ name: "", email: "" }],
      }));
    }
  }, [count, showInput]);

  return (
    <section
      className="flex justify-center items-center w-full min-h-screen px-8 lg:py-12 py-4"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {(transactionStatus === "completed" ||
        transactionStatus === "failed" ||
        errorMessage !== "") && (
        <div className="overlay fixed inset-0 bg-black bg-opacity-50 z-10"></div>
      )}

      {!isPolling && (
        <div className="w-full h-full flex gap-x-4 lg:flex-row flex-col md:px-8">
          <div className="lg:w-2/4 w-full flex py-6 px-4 items-center flex-col gap-4 lg:h-full lg:my-auto my-2">
            <div className="w-full flex flex-col gap-y-6">
              <h1 className="font-bold lg:text-5xl text-3xl font-bricolage_grotesque">
                Checkout
              </h1>

              <p className="lg:text-3xl text-2xl font-bricolage_grotesque">
                Personal Information & Billing
              </p>
            </div>
            <form className="w-full flex flex-col justify-center items-center">
              <div className="w-full py-4 flex items-center">
                <label htmlFor="firstName" hidden></label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  onChange={handleChange}
                  name="firstName"
                  value={formData.firstName}
                  className="lg:w-3/4 w-[98%] py-3 px-4 bg-[#F7F8F9] rounded-md border border-[#DBE1E7] outline-hidden text-[#666666]"
                />
              </div>

              <div className="w-full py-4 flex items-center">
                <label htmlFor="lastName" hidden></label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  onChange={handleChange}
                  name="lastName"
                  value={formData.lastName}
                  className="lg:w-3/4 w-[98%] py-3 px-4 bg-[#F7F8F9] rounded-md border border-[#DBE1E7] outline-hidden text-[#666666]"
                />
              </div>

              <div className="w-full py-4 flex items-center">
                <label htmlFor="mail" hidden></label>
                <input
                  id="mail"
                  type="text"
                  placeholder="Email Address"
                  onChange={handleChange}
                  name="email"
                  value={formData.email}
                  className="lg:w-3/4 w-[98%] py-3 px-4 bg-[#F7F8F9] rounded-md border border-[#DBE1E7] outline-hidden text-[#666666]"
                />
              </div>

              <div className="w-full py-4 flex items-center">
                <label htmlFor="Currency" hidden></label>
                <select
                  title="currency value"
                  id="Currency"
                  onChange={handleChange}
                  name="currency"
                  value={formData.currency}
                  className="lg:w-3/4 w-[98%] py-3 px-8 bg-[#F7F8F9] rounded-md border border-[#DBE1E7] outline-none text-[#666666]"
                >
                  <option value="NGN" className="text-lg py-5">
                    NGN
                  </option>
                  <option value="USD" className="text-lg py-5">
                    USD
                  </option>
                </select>
              </div>

              <div className="w-full py-6 flex flex-col">
                <label className="text-lg font-medium text-[#333] mb-2 font-bricolage_grotesque">
                  Number of Participants
                </label>

                <div className="lg:w-3/4 w-[98%] flex items-center justify-between border border-[#DBE1E7] rounded-md bg-[#F7F8F9] px-3 py-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={minus}
                    type="button"
                    disabled={count <= (paymentInfo.is_group ? 5 : 1)}
                    className={`w-10 h-10 rounded-full ${
                      count <= (paymentInfo.is_group ? 5 : 1)
                        ? "bg-[#CCD9BE] cursor-not-allowed"
                        : "bg-[#497016] hover:bg-[#5a8620]"
                    } text-white flex justify-center items-center text-xl transition-colors`}
                  >
                    <span className="transform -translate-y-px">-</span>
                  </motion.button>

                  <div className="flex flex-col items-center">
                    <motion.span
                      key={count}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[#333333] font-bold text-2xl"
                    >
                      {count}
                    </motion.span>
                    <span className="text-[#9CA3AF] text-sm">
                      {count === 1 ? "Participant" : "Participants"}
                    </span>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={plus}
                    type="button"
                    className="w-10 h-10 rounded-full bg-[#497016] text-white flex justify-center items-center text-xl hover:bg-[#5a8620] transition-colors"
                  >
                    <span className="transform -translate-y-px">+</span>
                  </motion.button>
                </div>

                {count > 1 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-sm text-[#9CA3AF] italic"
                  >
                    {paymentInfo.is_group
                      ? "Adding participants in groups of 5"
                      : "Information needed for each participant"}
                  </motion.p>
                )}
              </div>
              {count === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full flex justify-start"
                >
                  <button
                    type="button"
                    className="w-fit text-[#9CA3AF] text-sm border-none -mt-5 text-left"
                    onClick={() => setShowInput(!showInput)}
                  >
                    {showInput
                      ? "Registering for you, click here"
                      : "Registering for someone? Click to enter participant's name"}
                  </button>
                </motion.div>
              )}

              {(createInputs.length > 1 || showInput) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full mt-8 mb-4 border-t-2 border-[#F0F0F0] pt-6"
                >
                  <h2 className="font-bold text-xl font-bricolage_grotesque mb-4 text-[#497016]">
                    Participant Information
                  </h2>
                  <p className="text-sm text-[#666666] mb-6">
                    Please provide details for each participant
                  </p>

                  <div className="space-y-2">
                    <AnimatePresence>
                      {createInputs.map((_, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{
                            duration: 0.3,
                            delay: index * 0.1,
                            ease: "easeInOut",
                          }}
                          className="w-full rounded-lg bg-[#FAFBFC] border border-[#E8ECF0] p-4 mb-3"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-[#497016]">
                              Participant {index + 1}
                            </h3>
                            <div className="h-6 w-6 rounded-full bg-[#F0F5E8] text-[#497016] flex items-center justify-center font-bold">
                              {index + 1}
                            </div>
                          </div>

                          <div className="flex lg:flex-row flex-col gap-3 mb-3">
                            <div className="lg:w-1/2 w-full">
                              <label
                                htmlFor={`participantName-${index}`}
                                className="text-sm text-[#666666] block mb-1"
                              >
                                Full Name
                              </label>
                              <input
                                id={`participantName-${index}`}
                                type="text"
                                placeholder="Participant's Full Name"
                                onChange={handleChange}
                                name={`participantName-${index}`}
                                value={formData.participants[index]?.name || ""}
                                className="w-full py-3 px-4 bg-[#F7F8F9] rounded-md border border-[#DBE1E7] outline-hidden text-[#9CA3AF] focus:border-[#89C13E] transition-all"
                              />
                            </div>

                            <div className="lg:w-1/2 w-full">
                              <label
                                htmlFor={`participantEmail-${index}`}
                                className="text-sm text-[#9CA3AF] block mb-1"
                              >
                                Email Address
                              </label>
                              <input
                                id={`participantEmail-${index}`}
                                type="email"
                                placeholder="Participant's Email"
                                onChange={handleChange}
                                name={`participantEmail-${index}`}
                                value={
                                  formData.participants[index]?.email || ""
                                }
                                className="w-full py-3 px-4 bg-[#F7F8F9] rounded-md border border-[#DBE1E7] outline-hidden text-[#9CA3AF] focus:border-[#89C13E] transition-all"
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </form>
          </div>

          <div className="lg:w-2/4 w-full lg:h-full flex flex-col justify-center gap-5 md:px-4 py-4">
            <div className="flex justify-start">
              <h1 className="font-bold text-left text-2xl font-bricolage_grotesque">
                Your Order
              </h1>
            </div>

            <div className="w-full font-bricolage_grotesque flex justify-between text-lg py-4 border-b border-dashed border-b-[#DBE1E7]">
              <h1>Product</h1>
              <h1>Amount</h1>
            </div>

            <div className="w-full flex justify-between py-4 border-b border-dashed border-b-[#DBE1E7]">
              <div className="max-w-3/4 flex lg:h-auto md:h-20">
                <div className="w-3/4 flex md:flex-row flex-col justify-center">
                  <div className="flex justify-center items-center h-full w-48 border border-[#FFFAF5] bg-[#FFE0C2] rounded-md mx-2">
                    <Image
                      src="/trophy.svg"
                      width={60}
                      height={30}
                      alt="certification"
                    />
                  </div>
                  <div className="mx-2 flex justify-center flex-col lg:my-auto md:mt-0 mt-2">
                    <h1 className="font-bold font-bricolage_grotesque lg:text-wrap md:text-ellipsis md:text-nowrap lg:my-2 md:mb-0 mb-2">
                      {paymentInfo.training_type ||
                        "Project Management Training"}
                    </h1>
                    <p className="lg:text-wrap text-nowrap text-ellipsis bricolage_text">
                      Certificate of completion
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center">
                <div className="text-right">
                  {isPromo ? (
                    <>
                      {(() => {
                        const allowedKeys: (
                          | "training"
                          | "mentoring"
                          | "training&mentoring"
                        )[] = ["training", "mentoring", "training&mentoring"];
                        const promoKey =
                          paymentInfo.training_type &&
                          allowedKeys.includes(paymentInfo.training_type as any)
                            ? (paymentInfo.training_type as
                                | "training"
                                | "mentoring"
                                | "training&mentoring")
                            : "training";
                        return (
                          <>
                            <p className="line-through text-[#9CA3AF] text-sm">
                              {(formData.currency === "NGN" ? "NGN " : "$") +
                                formatPrice(
                                  formData.currency === "NGN"
                                    ? paymentInfo.original_price * count
                                    : paymentInfo.original_price2 * count
                                )}
                            </p>
                            <h1 className="font-bold text-[#89C13E] text-lg">
                              {(formData.currency === "NGN" ? "NGN " : "$") +
                                formatPrice(
                                  formData.currency === "NGN"
                                    ? paymentInfo.promoPrices &&
                                        paymentInfo.promoPrices.prices.naira[
                                          selectedType
                                        ] * count
                                    : paymentInfo.promoPrices &&
                                        paymentInfo.promoPrices.prices.dollar[
                                          selectedType
                                        ] * count
                                )}
                            </h1>
                          </>
                        );
                      })()}
                    </>
                  ) : (
                    <h1 className="font-bold">
                      {(formData.currency === "NGN" ? "NGN " : "$") +
                        formatPrice(
                          formData.currency === "NGN"
                            ? paymentInfo.price2 * count
                            : paymentInfo.price * count
                        )}
                    </h1>
                  )}
                </div>
              </div>
            </div>

            {/* Subtotal Section */}
            <div className="w-full flex justify-between items-center py-4 border-b border-dashed border-b-[#DBE1E7]">
              <h1 className="font-bold font-bricolage_grotesque">Subtotal</h1>
              <div className="text-right">
                {isPromo ? (
                  <>
                    <p className="line-through text-[#9CA3AF] text-sm">
                      {(formData.currency === "NGN" ? "NGN " : "$") +
                        formatPrice(
                          formData.currency === "NGN"
                            ? paymentInfo.original_price * count
                            : paymentInfo.original_price2 * count
                        )}
                    </p>
                    <h1 className="font-bold text-[#89C13E]">
                      {(formData.currency === "NGN" ? "NGN " : "$") +
                        formatPrice(
                          formData.currency === "NGN" && paymentInfo.promoPrices
                            ? paymentInfo.promoPrices.prices.naira[
                                selectedType
                              ] * count
                            : paymentInfo.promoPrices &&
                                paymentInfo.promoPrices.prices.dollar[
                                  selectedType
                                ] * count
                        )}
                    </h1>
                  </>
                ) : (
                  <h1 className="font-bold font-bricolage_grotesque">
                    {(formData.currency === "NGN" ? "NGN " : "$") +
                      formatPrice(
                        formData.currency === "NGN"
                          ? paymentInfo.price2 * count
                          : paymentInfo.price * count
                      )}
                  </h1>
                )}
              </div>
            </div>

            {formData.currency === "NGN" && (
              <div className="w-full flex justify-between items-center py-4 border-b border-dashed border-b-[#DBE1E7]">
                <h1 className="font-bold font-bricolage_grotesque">Tax:</h1>
                <h1 className="font-bold font-bricolage_grotesque">
                  NGN {formatPrice(fees)}
                </h1>
              </div>
            )}

            <div className="w-full flex justify-between items-center py-4 border-b border-b-[#DBE1E7]">
              <h1 className="font-bold font-bricolage_grotesque">TOTAL</h1>
              <h1 className="text-[#89C13E] font-bold font-bricolage_grotesque">
                {(formData.currency === "NGN" ? "NGN " : "$") +
                  formatPrice(price)}
              </h1>
            </div>

            <div className="w-full flex justify-center items-center">
              <button
                onClick={handleFormSubmit}
                className="bg-[#89C13E] py-6 px-4 text-white rounded-md flex justify-center items-center w-full cursor-pointer"
              >
                Complete Checkout
                {mutation.isPending && (
                  <span className="mx-2 flex justify-center items-center h-full">
                    <Loading />
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {isPolling && <Loading />}

      <AnimatePresence>
        {!isPolling && transactionStatus === "completed" && modal && (
          <Transaction_success
            data={dataValue}
            close={closeModal}
            order={orderValue}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isPolling && transactionStatus === "failed" && modal && (
          <Transaction_failed close={closeModal} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isPolling &&
          transactionStatus !== "failed" &&
          transactionStatus !== "completed" &&
          errorMessage !== "" &&
          modal && (
            <Transaction_error close={closeModal} error={errorMessage} />
          )}
      </AnimatePresence>
    </section>
  );
}
