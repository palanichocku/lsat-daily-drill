import { notFound } from "next/navigation";
import DrillQuiz from "@/components/DrillQuiz";
import { getLatestQuestion } from "@/lib/supabase/questions";

export const dynamic = "force-dynamic";

export default async function DrillPage() {
  const question = await getLatestQuestion();

  if (!question) {
    notFound();
  }

  return <DrillQuiz question={question} />;
}