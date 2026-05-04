import { notFound } from "next/navigation";
import DrillQuiz from "@/components/DrillQuiz";
import { getPublishedQuestions, getQuestionById } from "@/data/questions";

type DrillDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return getPublishedQuestions().map((question) => ({
    id: question.id,
  }));
}

export default async function DrillDetailPage({
  params,
}: DrillDetailPageProps) {
  const { id } = await params;
  const question = getQuestionById(id);

  if (!question || !question.published) {
    notFound();
  }

  return <DrillQuiz question={question} />;
}