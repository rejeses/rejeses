"use client";
import React, { useMemo, useEffect, useState } from "react";
import Table from "./table";
import BookSession from "./book_session";
import LastEl from "./last_el";
import tableData from "@/utils/data/table_data.json";
import { usePathname } from "next/navigation";
import Testimonial from "./testimonial";
import TestimonialData from "@/utils/data/testimonial_data.json";
import TermsOfUse from "./terms_of_use";

const Footer: React.FC = () => {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [width, setWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  const decodedPathname = useMemo(
    () => decodeURIComponent(pathname),
    [pathname]
  );

  const filteredTableData = useMemo(() => {
    const numberPattern = /\/(1[0-9]|20|[1-9])(?:\/|$)/;
    const pricingPattern = /pricing/;

    if (
      decodedPathname === "/" ||
      // decodedPathname === "/book-session" ||
      decodedPathname === "/enroll"
      // decodedPathname === "/contact-us"
    ) {
      return tableData.filter((item) => item.tag === "homepage");
    } else if (
      numberPattern.test(decodedPathname) ||
      pricingPattern.test(decodedPathname)
    ) {
      return [];
    } else {
      const tag = decodedPathname.split("/")[1];
      return tableData.filter(
        (item) => item.tag.toLowerCase() === tag.toLowerCase()
      );
    }
  }, [decodedPathname]);

  const filteredTestimonalData = useMemo(() => {
    const excludePaths = ["book-session", "enroll", "contact-us"];
    const numberPattern = /\/(1[0-9]|20|[1-9])(?:\/|$)/; // Matches numbers from 1 to 20
    const pricingPattern = /pricing/; // Matches the word "pricing"

    if (
      excludePaths.includes(decodedPathname) ||
      numberPattern.test(decodedPathname) ||
      pricingPattern.test(decodedPathname)
    ) {
      return [];
    } else if (decodedPathname === "/") {
      return TestimonialData;
    }

    const tag = decodedPathname.split("/")[1];
    return TestimonialData.filter(
      (item) => item.tag.toLowerCase() === tag.toLowerCase()
    );
  }, [decodedPathname]);

  useEffect(() => {
    const updateWidth = () => {
      const newWidth = window.innerWidth;
      setWidth(newWidth);
      setIsMobile(newWidth <= 1023);
    };

    window.addEventListener("resize", updateWidth);

    // Initial check
    updateWidth();

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  return (
    <footer className="my-4 bg-white">
      {/* Dynamic Components */}
      {filteredTestimonalData.length === 0 ? null : (
        <Testimonial data={filteredTestimonalData} />
      )}
      {filteredTableData.length === 0 ? null : (
        <Table data={filteredTableData} />
      )}
      {pathname === "/" && <BookSession />}

      {/* Updated Last Element and Terms of Use with modern styling */}
      <div className="border-t border-gray-200 mt-8">
        <LastEl />
        <TermsOfUse />
      </div>
    </footer>
  );
};

export default Footer;
