import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/general/navigation/navigation";
import Footer from "@/components/general/footer/footer";
import localfont from "next/font/local";
import { PaymentProvider } from "@/utils/context/payment";
import Scroll_to_top from "@/components/general/bact_to_top/scroll_to_top";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Script from "next/script";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bricolage_grotesque = localfont({
  src: [
    {
      path: "../../public/fonts/BricolageGrotesque/BricolageGrotesque-Bold.ttf",
      weight: "700",
    },
    {
      path: "../../public/fonts/BricolageGrotesque/BricolageGrotesque-Medium.ttf",
      weight: "500",
    },
    {
      path: "../../public/fonts/BricolageGrotesque/BricolageGrotesque-Light.ttf",
      weight: "200",
    },
  ],
  variable: "--font-bricolage_grotesque",
});

const aller = localfont({
  src: [
    {
      path: "../../public/fonts/aller/Aller_Std_Bd.ttf",
      weight: "700",
    },
    {
      path: "../../public/fonts/aller/Aller_Std_Bd.ttf",
      weight: "500",
    },
    {
      path: "../../public/fonts/aller/Aller_Std_Rg.ttf",
      weight: "200",
    },
  ],
  variable: "--font-aller",
});

const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://rejeses.com"
    : "http://localhost:3000";

export const metadata: Metadata = {
  title: "Rejeses PM Consulting",
  description: "Learn and become excellent at project management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" id="el">
      <head>
        <meta
          name="description"
          content="Learn and become excellent at project management"
        />

        {/* Open Graph / LinkedIn Tags */}
        <meta property="og:title" content="Rejeses PM Consulting" />
        <meta
          property="og:description"
          content="Learn and become excellent at project management"
        />
        <meta
          name="image"
          property="og:image"
          content={`${baseUrl}/logo.png`}
        />
        <meta
          property="og:image:alt"
          content="A preview image of project management learning resources"
        />
        <meta property="og:url" content={baseUrl} />
        <meta property="og:type" content="website" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Rejeses PM Consulting" />
        <meta
          name="twitter:description"
          content="Learn and become excellent at project management"
        />
        <meta name="twitter:image" content={`${baseUrl}/logo.png`} />
        <meta
          name="twitter:image:alt"
          content="A preview image of project management learning resources"
        />

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NESY97PHWD"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-NESY97PHWD');
          `}
        </Script>
      </head>
      <body
        className={`${inter.variable} ${aller.variable} ${bricolage_grotesque.variable} max-w-[1440px] m-auto`}
      >
        <ToastContainer />
        <PaymentProvider>
          <Navigation />
          {children}
          <Footer />
          <Scroll_to_top />
        </PaymentProvider>
      </body>
    </html>
  );
}
