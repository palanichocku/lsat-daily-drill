import { notFound } from "next/navigation";
import DrillQuiz from "@/components/DrillQuiz";
import { getQuestionById } from "@/lib/supabase/questions";

export const dynamic = "force-dynamic";

type DrillDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DrillDetailPage({
  params,
}: DrillDetailPageProps) {
  const { id } = await params;
  const question = await getQuestionById(id);

  if (!question) {
    notFound();
  }

  return <DrillQuiz question={question} />;
}