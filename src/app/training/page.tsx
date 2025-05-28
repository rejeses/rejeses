import Trainin_page from "@/components/web_pages/training/client_page";

export async function generateStaticParams() {
  return [{ slug: "training" }];
}

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <Trainin_page />;
}
