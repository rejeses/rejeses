import { useEffect, useState } from "react";
import { PromoData } from "../types/types";

const usePromoData = () => {
  const [promoData, setPromoData] = useState<PromoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPromoData = async () => {
      try {
        const response = await fetch("/promo/promo.json");
        const data = await response.json();
        setPromoData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch promo data:", error);
        setIsLoading(false);
      }
    };

    fetchPromoData();
  }, []);

  useEffect(() => {
    console.log(promoData, "data here");
  }, [promoData]);

  return { promoData, isLoading };
};

export default usePromoData;
