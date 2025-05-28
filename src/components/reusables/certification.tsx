import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import SkeletalLoader from "./animation/skeletol_loader";

export default function Certification() {
  const pathname = usePathname();
  const router = useRouter();

  const [loadingStates, setLoadingStates] = useState<{
    image1: boolean;
    image2: boolean;
    image3: boolean;
  }>({
    image1: true,
    image2: true,
    image3: true,
  });

  const handleImageLoad1 = () => {
    setLoadingStates((prev) => ({ ...prev, image1: false }));
  };
  const handleImageLoad2 = () => {
    setLoadingStates((prev) => ({ ...prev, image2: false }));
  };
  const handleImageLoad3 = () => {
    setLoadingStates((prev) => ({ ...prev, image3: false }));
  };

  const decodedPathname = useMemo(
    () => decodeURIComponent(pathname),
    [pathname]
  );

  const handleCertificationClick = (slug: string) => {
    router.push(`/${slug}`);
  };

  return (
    <section className="w-full bg-[#FEF9F6] lg:px-3 px-8 py-12 flex flex-col justify-center items-center gap-12">
      <div className="lg:max-w-[90%] max-w-[98%] flex flex-col">
        <h1 className="lg:text-[48px] md:text-3xl text-2xl font-bold my-8 font-bricolage_grotesque">
          Get prepped for your professional exams
        </h1>
        <p className="lg:max-w-[80%] lg:text-[24px] text-wrap text-[16px]">
          Our training course equips you to take and pass the following
          professional exams, and be certified by the Project Management
          Institute (PMI):
        </p>

        <div className="w-full flex md:flex-row flex-col my-8 gap-x-3">
          <motion.div
            className="md:w-1/3 w-full flex flex-col justify-center items-center border border-[#DBE1E7] text-black hover:text-white hover:cursor-pointer rounded-md px-2 py-2 bg-white my-4"
            whileHover={{
              scale: 1.08,
              borderColor: "#89C13E",
              backgroundColor: "#89C13E",
              transition: { duration: 0.3 },
            }}
            whileTap={{
              scale: 1.05,
              borderColor: "#89C13E",
              backgroundColor: "#89C13E",
              color: "#ffffff",
              transition: { duration: 0.1 },
            }}
            onClick={() => handleCertificationClick("capm-certification")}
          >
            <div
              className={`flex justify-center items-center min-h-[320px] md:min-h-0`}
            >
              <div
                className={`lg:w-[300px] md:w-[200px] w-[240px] ${
                  loadingStates.image1 ? "blur-2xl" : "blur-none"
                } transition duration-1000 ease-in-out relative`}
              >
                {loadingStates.image1 && (
                  <SkeletalLoader
                    blockWidth="w-[80%]"
                    cardHeight="h-5"
                    cardImageHeight="h-5"
                    cardColor="bg-[#FEF9F6]"
                    cardContentColor="bg-[#FEF9F6]"
                    cardImageColor="bg-[#F5F0FA]"
                  />
                )}
                <Image
                  src="/CAPM.png"
                  width={300}
                  height={200}
                  alt="CAPM certification"
                  className={`object-contain ${
                    loadingStates.image1
                      ? "w-full h-full object-top absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      : ""
                  }`}
                  placeholder="blur"
                  priority
                  blurDataURL="/CAPM.png"
                  onLoad={handleImageLoad1}
                />
              </div>
            </div>
            <p
              className={`font-bold font-bricolage_grotesque my-1 transition-all duration-300 text-center ${
                loadingStates.image1 ? "mt-4" : ""
              }`}
            >
              Certified Associate in Project Management (CAPM)
            </p>
          </motion.div>

          <motion.div
            className="md:w-1/3 w-full flex flex-col justify-center items-center border border-[#DBE1E7] text-black hover:text-white hover:cursor-pointer rounded-md px-2 py-2 bg-white my-4"
            whileHover={{
              scale: 1.08,
              borderColor: "#89C13E",
              backgroundColor: "#89C13E",
              transition: { duration: 0.3 },
            }}
            whileTap={{
              scale: 1.05,
              borderColor: "#89C13E",
              backgroundColor: "#89C13E",
              color: "#ffffff",
              transition: { duration: 0.1 },
            }}
            onClick={() => handleCertificationClick("pmp-certification")}
          >
            <div
              className={`flex justify-center items-center min-h-[320px] md:min-h-0`}
            >
              <div
                className={`lg:w-[300px] md:w-[200px] w-[240px] ${
                  loadingStates.image2 ? "blur-2xl" : "blur-none"
                } transition duration-1000 ease-in-out relative`}
              >
                {loadingStates.image2 && (
                  <SkeletalLoader
                    blockWidth="w-[80%]"
                    cardHeight="h-5"
                    cardImageHeight="h-5"
                    cardColor="bg-[#FEF9F6]"
                    cardContentColor="bg-[#FEF9F6]"
                    cardImageColor="bg-[#F5F0FA]"
                  />
                )}
                <Image
                  src="/PMP.png"
                  width={300}
                  height={200}
                  alt="PMP certification"
                  className={`object-contain ${
                    loadingStates.image2
                      ? "w-full h-full object-top absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      : ""
                  }`}
                  placeholder="blur"
                  priority
                  blurDataURL="/PMP.png"
                  onLoad={handleImageLoad2}
                />
              </div>
            </div>
            <p className="font-bold font-bricolage_grotesque my-1 transition-all duration-300 text-center">
              Project Management Professional (PMP)
            </p>
          </motion.div>

          <motion.div
            className="md:w-1/3 w-full flex flex-col justify-center items-center border border-[#DBE1E7] text-black hover:text-white hover:cursor-pointer rounded-md px-2 py-2 bg-white my-4"
            whileHover={{
              scale: 1.08,
              borderColor: "#89C13E",
              backgroundColor: "#89C13E",
              transition: { duration: 0.3 },
            }}
            whileTap={{
              scale: 1.05,
              borderColor: "#89C13E",
              backgroundColor: "#89C13E",
              color: "#ffffff",
              transition: { duration: 0.1 },
            }}
            onClick={() => handleCertificationClick("pmi-certification")}
          >
            <div
              className={`flex justify-center items-center min-h-[320px] md:min-h-0`}
            >
              <div
                className={`lg:w-[300px] md:w-[200px] w-[240px] ${
                  loadingStates.image3 ? "blur-2xl" : "blur-none"
                } transition duration-1000 ease-in-out relative`}
              >
                {loadingStates.image3 && (
                  <SkeletalLoader
                    blockWidth="w-[80%]"
                    cardHeight="h-5"
                    cardImageHeight="h-5"
                    cardColor="bg-[#FEF9F6]"
                    cardContentColor="bg-[#FEF9F6]"
                    cardImageColor="bg-[#F5F0FA]"
                  />
                )}
                <Image
                  src="/PMI-ACP.png"
                  width={300}
                  height={200}
                  alt="PMI certification"
                  className={`object-contain ${
                    loadingStates.image3
                      ? "w-full h-full object-top absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      : ""
                  }`}
                  placeholder="blur"
                  priority
                  blurDataURL="/PMI-ACP.png"
                  onLoad={handleImageLoad3}
                />
              </div>
            </div>
            <p className="font-bold font-bricolage_grotesque my-1 transition-all duration-300 text-center">
              PMI - Agile Certified Practitioner (PMI-ACP)
            </p>
          </motion.div>
        </div>
      </div>

      {decodedPathname === "/" && (
        <div className="w-full flex justify-center items-center">
          <motion.span
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 5px 15px rgba(137, 193, 62, 0.4)",
            }}
            className="mx-2 inline-flex lg:w-[12%] md:w-[25%] justify-center items-center bg-[#89C13E] py-0 rounded-[.3rem]"
          >
            <Link
              href="/training#upcoming-training"
              className="bg-[#89C13E] text-white px-6 inline-flex w-full h-full justify-center items-center py-4 rounded-[.3rem] font-bricolage_grotesque transition_button4"
            >
              ENROLL NOW
            </Link>
          </motion.span>
        </div>
      )}
    </section>
  );
}
