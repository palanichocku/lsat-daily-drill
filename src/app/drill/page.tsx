import { getLatestQuestion } from "@/data/questions";
import DrillQuiz from "@/components/DrillQuiz";

export default function DrillPage() {
  const question = getLatestQuestion();

  return <DrillQuiz question={question} />;
}