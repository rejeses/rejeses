import Image from "next/image";
import Link from "next/link";

export default function LastEl() {
  return (
    <div className="max-w-7xl mx-auto py-10 md:py-12 px-6 md:px-10">
      <div className="flex justify-between items-center flex-wrap-reverse md:flex-wrap lg:flex-nowrap gap-6">
        {/* Copyright section */}
        <div className="w-full md:w-auto flex items-center space-x-2 text-gray-600">
          <p className="text-xl font-bricolage_grotesque">&copy;</p>
          <p className="text-base font-bricolage_grotesque">
            {new Date().getFullYear()}{" "}
            <span className="font-bold">Rejeses Consult</span>.
          </p>
          <p className="text-base font-bricolage_grotesque hidden md:block">
            All rights reserved.
          </p>
        </div>

        {/* Social media icons with hover effects */}
        <div className="w-full md:w-auto flex justify-between md:justify-end items-center space-x-3 md:space-x-4">
          {socialLinks.map((item) => (
            <Link
              key={item.alt}
              href={item.href}
              target="_blank"
              className="transition-transform hover:scale-110 duration-300"
              aria-label={item.alt}
            >
              <div className="bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors duration-300">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={24}
                  height={24}
                  className="h-6 w-6 object-contain"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// Social media links data
const socialLinks = [
  {
    src: "/instagram.png",
    alt: "Instagram",
    href: "https://www.instagram.com/rejeses_pmc/",
  },
  {
    src: "/facebook.png",
    alt: "Facebook",
    href: "https://www.facebook.com/rejesespmc/",
  },
  {
    src: "/linkedIn.svg",
    alt: "LinkedIn",
    href: "https://www.linkedin.com/company/rejeses",
  },
  {
    src: "/x-icon.svg",
    alt: "X(Formerly-twitter)",
    href: "https://twitter.com/rejeses_pmc",
  },
  {
    src: "/whatsapp-icon.svg",
    alt: "WhatsApp",
    href: "https://wa.me/+2348156738747?text=Hello,%20I%20would%20like%20to%20inquire%20about%20your%20courses.",
  },
  {
    src: "/mail.svg",
    alt: "E-mail",
    href: "mailto:info@rejeses.com",
  },
];
