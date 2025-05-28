"use client";

import Image from "next/image";
import Link from "next/link";
import { NavTypes } from "@/utils/types/types";
import navData from "@/utils/data/nav_data.json";
import { useEffect, useRef, useState, useMemo } from "react";
import { HamburgerMenuIcon, Cross1Icon } from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigation } from "@/utils/context/payment";

export default function Nav_desktop() {
  const { logo, links, linkButtons }: NavTypes = navData;
  const { isMobile, updateWidth } = useNavigation();
  const [openMobileNav, setOpenMobileNav] = useState<boolean>(false);
  const [isNavFixed, setIsNavFixed] = useState<boolean>(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  const decodedPathname = useMemo(
    () => decodeURIComponent(pathname),
    [pathname]
  );

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;
      const twentyPercentThreshold = viewportHeight * 0.2;

      setIsNavFixed(scrollPosition >= twentyPercentThreshold);
    };

    window.addEventListener("resize", updateWidth);
    window.addEventListener("scroll", handleScroll);

    // Initial checks
    updateWidth();
    handleScroll();

    return () => {
      window.removeEventListener("resize", updateWidth);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [updateWidth]);

  const handleHamburgerClick = () => {
    setOpenMobileNav(!openMobileNav);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMobileNav(false);
      }
    };

    const handleClickInside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "BUTTON" || target.tagName === "A") {
        setOpenMobileNav(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("click", handleClickInside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("click", handleClickInside);
    };
  }, []);

  const isActive = (linkUrl: string) => {
    const cleanLinkUrl = linkUrl.replace(/\/$/, "");
    const cleanPathname = decodedPathname.replace(/\/$/, "");

    if (cleanLinkUrl === "") {
      return cleanPathname === "";
    }

    return (
      cleanPathname === cleanLinkUrl || cleanPathname.startsWith(cleanLinkUrl)
    );
  };

  return (
    <nav
      className={`
        w-full justify-between items-center px-4 bg-white/70 
        font-bricolage_grotesque lg:px-16 md:px-8 md:py-5 py-2
        transition-all duration-300 ease-in-out z-50
        ${isNavFixed ? "fixed top-0 left-0 backdrop-blur-md shadow-md" : ""}
      `}
      ref={navRef}
      style={{
        ...(isNavFixed
          ? {
              WebkitBackdropFilter: "blur(5px)",
              backdropFilter: "blur(5px)",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
            }
          : {}),
      }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <section>
          <Link href={`/`}>
            <Image
              src={logo}
              alt="logo"
              width={100}
              height={50}
              className="md:h-16 h-12"
            />
          </Link>
        </section>

        {!isMobile && (
          <>
            <section className="flex justify-between items-center">
              <ul className="flex lg:space-x-6 space-x-4">
                {links.map((link, index) => (
                  <li
                    key={index}
                    className="list-none text-nowrap text-ellipsis font-bold"
                  >
                    <Link
                      href={link.url}
                      className={`hover:text-[#89C13E] transition_border1 py-1 ${
                        isActive(link.url) ? "text-[#89C13E]" : ""
                      }`}
                    >
                      {link.label.toUpperCase()}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section className="flex space-x-2">
              {linkButtons.map((button, index) =>
                index === 0 ? (
                  <motion.span
                    key={index}
                    className="mx-2 bg-[#89C13E] py-3 rounded-[.3rem]"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0px 5px 15px rgba(137, 193, 62, 0.4)",
                    }}
                  >
                    <Link
                      className={`${button.className} lg:py-4`}
                      href={button.url}
                    >
                      {button.label.toUpperCase()}
                    </Link>
                  </motion.span>
                ) : (
                  <motion.span
                    key={index}
                    className="flex justify-center items-center rounded-md transition_button"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.4)",
                    }}
                  >
                    <Link className={button.className} href={button.url}>
                      {button.label.toUpperCase()}
                    </Link>
                  </motion.span>
                )
              )}
            </section>
          </>
        )}

        {isMobile && (
          <div>
            <button
              onClick={handleHamburgerClick}
              className="focus:outline-hidden"
            >
              {!openMobileNav ? (
                <HamburgerMenuIcon width="30px" height="30px" color="#090909" />
              ) : (
                <Cross1Icon width="30px" height="30px" color="#090909" />
              )}
            </button>

            <AnimatePresence>
              {openMobileNav && (
                <motion.div
                  className="absolute md:top-20 top-12 left-0 w-full bg-white z-20 p-4 md:px-14 px-8"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <section className="flex flex-col space-y-4 mb-4">
                    <ul className="flex flex-col space-y-4">
                      {links.map((link, index) => (
                        <li key={index} className="list-none">
                          <Link
                            onClick={handleHamburgerClick}
                            href={link.url}
                            className={`hover:text-[#89C13E] transition_border1 py-1 ${
                              isActive(link.url) ? "text-[#89C13E]" : ""
                            }`}
                          >
                            {link.label.toUpperCase()}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="flex flex-col space-y-4">
                    {linkButtons.map((button, index) =>
                      index === 0 ? (
                        <span
                          key={index}
                          className="bg-[#89C13E] rounded-[.3rem]"
                        >
                          <Link
                            className={`${button.className} flex justify-center items-center text-center`}
                            href={button.url}
                          >
                            {button.label.toUpperCase()}
                          </Link>
                        </span>
                      ) : (
                        <Link
                          className={button.className}
                          href={button.url}
                          key={index}
                        >
                          {button.label.toUpperCase()}
                        </Link>
                      )
                    )}
                  </section>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </nav>
  );
}
