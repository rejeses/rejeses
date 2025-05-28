import Button from "@/components/reusables/button";
import Image from "next/image";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import SkeletalLoader from "@/components/reusables/animation/skeletol_loader";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Services() {
  const [imageLoading1, setImageLoading1] = useState<boolean>(true);
  const [imageLoading2, setImageLoading2] = useState<boolean>(true);
  const [imageLoading3, setImageLoading3] = useState<boolean>(true);

  const handleImageLoad = (setLoading: (loading: boolean) => void) => {
    setLoading(false);
  };

  return (
    <section className="w-full lg:px-3 px-8 py-12 md:pb-24 flex flex-col justify-center items-center gap-12 bg-[#FEF9F6]">
      <div className="lg:max-w-[90%] max-w-[98%] flex flex-col gap-12 justify-center items-center">
        <h1 className="lg:text-[48px] md:text-3xl text-3xl font-bold text-center md:my-12 my-8 font-bricolage_grotesque">
          Our Services
        </h1>

        <div className="flex md:flex-row flex-col w-full lg:justify-center lg:items-center gap-y-8 gap-x-12">
          <div className="lg:w-[640px] lg:h-[460px] md:h-[350px] md:w-[500px] h-[320px] w-full relative">
            {imageLoading1 && (
              <SkeletalLoader
                blockWidth="w-[80%]"
                cardColor="bg-[#FEF9F6]"
                cardContentColor="bg-[#FEF9F6]"
                cardImageColor="bg-[#F5F0FA]"
              />
            )}
            <Image
              src="/man-board.svg"
              alt="man"
              width={640}
              height={460}
              className={`w-full h-full transition-opacity duration-500 ${
                imageLoading1 ? "opacity-0" : "opacity-100"
              }`}
              onLoad={() => handleImageLoad(setImageLoading1)}
              priority
            />
          </div>

          <div className="md:w-2/4 w-full py-8 flex flex-col justify-center gap-y-8 gap-x-12">
            <h1 className="lg:text-[36px] md:text-3xl text-2xl font-bold font-bricolage_grotesque">
              Training
            </h1>
            <p className="lg:text-[24px] lg:max-w-[95%] text-wrap text-[16px]">
              Our 35-hour training program is excellently designed to help you
              master the skills needed to become a seasoned project manager. 95%
              of those who train with us pass the prestigious Project Management
              Professional (PMP) certification examination, on their first try!
            </p>

            <span className="text-white">
              <Button
                text="Learn More"
                icon={<ArrowRightIcon />}
                bg="#89C13E"
                url="/training"
                transition_class="transition_button4"
              />
            </span>
          </div>
        </div>

        <div className="flex md:flex-row flex-col-reverse w-full gap-y-8 gap-x-12 justify-center items-center">
          <div className="md:w-2/4 w-full py-8 flex flex-col justify-center gap-4">
            <h1 className="lg:text-[36px] md:text-3xl text-2xl font-bold font-bricolage_grotesque">
              Personalized Mentoring
            </h1>
            <p className="lg:max-w-[95%] text-wrap lg:text-[24px] text-[16px]">
              Our mentoring programs foster one-on-one relationships to guide
              and support your professional development. Experience personalized
              mentoring that aligns with your career aspirations.
            </p>

            <span className="text-white">
              <Button
                text="Learn More"
                icon={<ArrowRightIcon />}
                bg="#89C13E"
                url="/mentorship"
                transition_class="transition_button4"
              />
            </span>
          </div>

          <div className="lg:w-[640px] lg:h-[460px] md:h-[350px] md:w-[500px] h-[320px] w-full relative">
            {imageLoading2 && (
              <SkeletalLoader
                blockWidth="w-[80%]"
                cardColor="bg-[#FEF9F6]"
                cardContentColor="bg-[#FEF9F6]"
                cardImageColor="bg-[#F5F0FA]"
              />
            )}
            <Image
              src="/discussion.svg"
              alt="discussion"
              width={640}
              height={460}
              className={`w-full h-full transition-opacity duration-500 ${
                imageLoading2 ? "opacity-0" : "opacity-100"
              }`}
              onLoad={() => handleImageLoad(setImageLoading2)}
              priority
            />
          </div>
        </div>

        <div className="flex md:flex-row flex-col w-full gap-y-8 gap-x-12 justify-center items-center">
          <div className="lg:w-[640px] lg:h-[460px] md:h-[350px] md:w-[500px] h-[320px] w-full relative">
            {imageLoading3 && (
              <SkeletalLoader
                blockWidth="w-[80%]"
                cardColor="bg-[#FEF9F6]"
                cardContentColor="bg-[#FEF9F6]"
                cardImageColor="bg-[#F5F0FA]"
              />
            )}
            <Image
              src="/meeting.svg"
              alt="meeting"
              width={640}
              height={460}
              className={`w-full h-full transition-opacity duration-500 ${
                imageLoading3 ? "opacity-0" : "opacity-100"
              }`}
              onLoad={() => handleImageLoad(setImageLoading3)}
              priority
            />
          </div>

          <div className="md:w-2/4 w-full py-8 flex flex-col justify-center gap-4">
            <h1 className="lg:text-[36px] md:text-3xl text-2xl font-bold font-bricolage_grotesque">
              Consulting
            </h1>
            <p className="lg:max-w-[95%] text-wrap lg:text-[24px] text-[16px]">
              Our consultancy services offer guidance to overcome project
              challenges, optimize processes, and achieve your specific goals.
              Schedule a consultation to discuss your project&apos;s unique
              needs.
            </p>

            <span className="text-white">
              <Button
                text="Learn More"
                icon={<ArrowRightIcon />}
                bg="#89C13E"
                url="/consultation"
                transition_class="transition_button4"
              />
            </span>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center items-center">
        <motion.span
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 5px 15px rgba(137, 193, 62, 0.4)",
          }}
          className="mx-2 inline-flex lg:w-[12%] md:w-[25%] w-[50%] margin-sm-override"
        >
          <Link
            href="/training#upcoming-training"
            className="bg-[#FFFFFF] text-[#89C13E] px-6 py-4 w-full h-full flex justify-center items-center border transition_button border-[#89C13E] rounded-[.3rem] font-bricolage_grotesque"
          >
            ENROLL NOW
          </Link>
        </motion.span>
      </div>
    </section>
  );
}
