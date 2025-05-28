import Link from "next/link";

export default function TermsOfUse() {
  return (
    <div className="max-w-7xl mx-auto border-t border-gray-200">
      <div className="flex flex-col sm:flex-row items-center justify-center py-6 px-6 md:px-10 space-y-4 sm:space-y-0">
        <Link
          href="/termsandconditions"
          className="text-gray-600 hover:text-gray-900 text-sm font-medium tracking-wider transition-colors duration-300 uppercase font-bricolage_grotesque"
        >
          Terms of Use
        </Link>

        <div className="hidden sm:block mx-4 h-5 border-r border-gray-300"></div>

        <Link
          href="/privacy-policy"
          className="text-gray-600 hover:text-gray-900 text-sm font-medium tracking-wider transition-colors duration-300 uppercase font-bricolage_grotesque"
        >
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}
