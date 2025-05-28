"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { PaymentInfo, TrainingType } from "../types/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Define types for Navigation Context
interface NavigationContextType {
  isNigeria: boolean;
  setIsNigeria: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
  width: number;
  updateWidth: () => void;
}

// Define types for Payment Context
interface PaymentContextType {
  paymentInfo: PaymentInfo;
  setPaymentInfo: React.Dispatch<React.SetStateAction<PaymentInfo>>;
  selectedType: TrainingType;
  setSelectedType: React.Dispatch<React.SetStateAction<TrainingType>>;
}

// Create Navigation Context
const NavigationContext = createContext<NavigationContextType>({
  isNigeria: false,
  setIsNigeria: () => {},
  isMobile: false,
  width: 0,
  updateWidth: () => {},
});

// Create Payment Context
const PaymentContext = createContext<PaymentContextType>({
  paymentInfo: {
    price: 0,
    price2: 0,
    original_price: 0,
    original_price2: 0,
    training_id: null,
    training_type: "",
    start_date: "",
    classScheduleType: "",
    is_group: false,
  },
  setPaymentInfo: () => {},
  selectedType: "training",
  setSelectedType: () => {},
});

// Custom hooks for accessing contexts
export const useNavigation = () => useContext(NavigationContext);

export const usePayment = () => useContext(PaymentContext);

// React Query Client
const queryClient = new QueryClient();

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedType, setSelectedType] = useState<
    "training" | "mentoring" | "training&mentoring"
  >("training");
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    price: 0,
    price2: 0,
    original_price: 0,
    original_price2: 0,
    training_id: null,
    training_type: "",
    start_date: "",
    classScheduleType: "",
    is_group: false,
    promoPrices: {
      dateRange: [],
      isPromo: false,
      prices: {
        naira: {
          training: 0,
          mentoring: 0,
          "training&mentoring": 0,
        },
        dollar: {
          training: 0,
          mentoring: 0,
          "training&mentoring": 0,
        },
      },
    },
  });

  const [isNigeria, setIsNigeria] = useState(false);
  const [width, setWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Update width and isMobile on resize
  const updateWidth = useCallback(() => {
    const newWidth = window.innerWidth;
    setWidth(newWidth);
    setIsMobile(newWidth <= 1023);
  }, []);

  // Check user location and update isNigeria
  useEffect(() => {
    const checkLocation = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        setIsNigeria(data.country_code === "NG");
      } catch (error) {
        console.error("Error checking location:", error);
        setIsNigeria(false);
      }
    };

    checkLocation();

    window.addEventListener("resize", updateWidth);

    // Initial call to set dimensions
    updateWidth();

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, [updateWidth]);

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContext.Provider
        value={{ isNigeria, setIsNigeria, isMobile, width, updateWidth }}
      >
        <PaymentContext.Provider
          value={{ paymentInfo, setPaymentInfo, selectedType, setSelectedType }}
        >
          {children}
        </PaymentContext.Provider>
      </NavigationContext.Provider>
    </QueryClientProvider>
  );
};
