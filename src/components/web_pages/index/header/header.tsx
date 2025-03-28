import Link from "next/link";
import Image_slider from "./image_slider";
import Image from "next/image";
import Mobile_Image_slider from "./mobile_image_slider";
import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Tagline from "./tagline";
import Logo_slider from "../../../reusables/animation/logo_slider";

export default function Header() {
  const [width, setWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const pathname = usePathname();
  const router = useRouter();

  const handleEnrollClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (pathname === "/training") {
      const pricingSection = document.getElementById("upcoming-training");
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push("/training#upcoming-training");
    }
  };

  useEffect(() => {
    const updateWidth = () => {
      const newWidth = window.innerWidth;
      setWidth(newWidth);
      setIsMobile(newWidth <= 767);
    };

    window.addEventListener("resize", updateWidth);

    // Initial check
    updateWidth();

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  return (
    <header className="bg-[#F5F0FA] flex flex-col w-full gap-4 overflow-hidden">
      <div className="w-full flex flex-col justify-center items-center my-8">
        <Tagline />
        <div className="md:w-3/4 w-full flex flex-col justify-center items-center gap-3 px-4 py-8 mt-8 mb-8">
          <h1 className="lg:text-[60px] md:text-6xl text-5xl text-center font-bold lg:leading-[80px] leading-tight font-bricolage_grotesque">
            Learn and become excellent at project management
          </h1>
          <p className="lg:text-2xl text-lg text-center max-w-[90%] lg:leading-[36px] leading-[28px]">
            Everything from learning about project management to one-on-one
            mentoring and even consultation,{" "}
            <span className="font-bold font-bricolage_grotesque">Rejeses</span>{" "}
            is here to help you learn and master project management.
          </p>

          <div className="w-full flex justify-center items-center my-4">
            <span className="mx-2 bg-[#89C13E] py-3 rounded-[.3rem]">
              <Link
                href="/training#upcoming-training"
                className="bg-[#89C13E] text-white px-6 py-4 rounded-[.3rem] font-bricolage_grotesque transition_button4"
              >
                Enroll Now
              </Link>
            </span>

            <span className="mx-2 margin-sm-override">
              <Link
                href="/book-session"
                className="bg-[#FFFFFF] text-[#89C13E] px-6 py-4 border transition_button border-[#89C13E] rounded-[.3rem] font-bricolage_grotesque"
              >
                Book Session
              </Link>
            </span>
          </div>
        </div>
      </div>

      {!isMobile ? <Image_slider /> : <Mobile_Image_slider />}

      <div className="flex w-full flex-col justify-center items-center bg-[#FCFCFC] py-12 px-4 gap-6 mt-6">
        <p className="text-lg text-center font-bricolage_grotesque text-[#5B5B5B]">
          Learn directly from people who have worked at such companies as
        </p>

        <Logo_slider />
      </div>
    </header>
  );
}

// class to make logo gray:
// filter grayscale hover:grayscale-0
