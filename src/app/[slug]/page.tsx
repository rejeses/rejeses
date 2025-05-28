import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import data from "@/utils/data/certification_data.json";
import Certifications from "@/components/web_pages/certification/certification";
import {
  PageProps,
  CertificationData,
  Certification,
} from "@/utils/types/types";
import { JSX } from "react";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return Object.keys(data).map((slug) => ({
    slug: slug,
  }));
}

export default async function CertificationPage(props: PageProps): Promise<JSX.Element> {
  const params = await props.params;
  const typedData: CertificationData = data;
  const contents: Certification | undefined = typedData[params.slug];

  if (!contents) {
    return <div>Certification not found</div>;
  }

  return <Certifications certification={contents} />;
}
