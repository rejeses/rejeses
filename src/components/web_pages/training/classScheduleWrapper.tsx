import data from "@/utils/data/training_data.json";
import ClassScheduleWrapper from "@/components/web_pages/training/classScheduleWrapper";
import type { TrainingOption1 } from "@/utils/types/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const scheduleItem = data.find((item) => item.id.toString() === slug) as
    | TrainingOption1
    | undefined;

  console.log(scheduleItem);

  if (!scheduleItem) {
    return (
      <div className="flex flex-col gap-8 w-full min-h-screen justify-center items-center">
        <h2 className="lg:text-4xl md:text-3xl text-2xl font-bold font-bricolage_grotesque">
          Training not found!
        </h2>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-4 px-2">
      <ClassScheduleWrapper params={params} />
    </div>
  );
}
