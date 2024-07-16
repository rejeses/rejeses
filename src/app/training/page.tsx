import Trainin_page from "@/components/web_pages/training/client_page";

export async function generateStaticParams() {
  return { slug: "training" };
}

export default function Page({ params }: { params: { slug: string } }) {
  const decodedSlug = decodeURIComponent(params.slug);

  return <Trainin_page />;
}
