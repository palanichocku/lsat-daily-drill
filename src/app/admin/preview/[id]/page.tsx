import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import DrillQuiz from "@/components/DrillQuiz";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { AnswerLetter, LsatQuestion } from "@/lib/supabase/questions";

export const dynamic = "force-dynamic";

type AdminPreviewPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type DbAdminQuestion = {
  id: string;
  drill_number: number;
  question_type: LsatQuestion["type"];
  difficulty: LsatQuestion["difficulty"];
  title: string;
  topic: string;
  prompt: string;
  stem: string;
  answer_a: string;
  answer_b: string;
  answer_c: string;
  answer_d: string;
  answer_e: string;
  correct_answer: AnswerLetter;
  explanation: string;
  takeaway: string;
  published: boolean;
  display_date: string | null;
};

async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("ldd_admin")?.value;
  const expectedSessionToken = process.env.ADMIN_SESSION_TOKEN;

  return Boolean(
    sessionCookie &&
      expectedSessionToken &&
      sessionCookie === expectedSessionToken
  );
}

async function requireAdmin() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/admin");
  }
}

function mapDbQuestion(row: DbAdminQuestion): LsatQuestion {
  return {
    id: row.id,
    drillNumber: row.drill_number,
    type: row.question_type,
    difficulty: row.difficulty,
    title: row.title,
    topic: row.topic,
    prompt: row.prompt,
    stem: row.stem,
    choices: [
      {
        letter: "A",
        text: row.answer_a,
      },
      {
        letter: "B",
        text: row.answer_b,
      },
      {
        letter: "C",
        text: row.answer_c,
      },
      {
        letter: "D",
        text: row.answer_d,
      },
      {
        letter: "E",
        text: row.answer_e,
      },
    ],
    correctAnswer: row.correct_answer,
    explanation: row.explanation,
    takeaway: row.takeaway,
    published: row.published,
    displayDate: row.display_date,
  };
}

async function getAdminQuestionById(id: string) {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("lsat_questions")
    .select(
      `
      id,
      drill_number,
      question_type,
      difficulty,
      title,
      topic,
      prompt,
      stem,
      answer_a,
      answer_b,
      answer_c,
      answer_d,
      answer_e,
      correct_answer,
      explanation,
      takeaway,
      published,
      display_date
    `
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load preview question: ${error.message}`);
  }

  return data ? mapDbQuestion(data as DbAdminQuestion) : null;
}

export default async function AdminPreviewPage({
  params,
}: AdminPreviewPageProps) {
  await requireAdmin();

  const { id } = await params;
  const question = await getAdminQuestionById(id);

  if (!question) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="border-b border-amber-300/30 bg-amber-300/10 px-4 py-3 text-amber-100 sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">
              Admin Preview {question.published ? "· Published" : "· Draft"}
            </p>
            <p className="mt-1 text-xs text-amber-100/80">
              This preview is private and visible only after admin login.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href={`/admin/questions/${question.id}`}
              className="rounded-xl border border-amber-300/40 px-4 py-2 text-center text-sm font-semibold text-amber-100 transition hover:bg-amber-300/10"
            >
              Edit
            </Link>

            <Link
              href="/admin"
              className="rounded-xl border border-amber-300/40 px-4 py-2 text-center text-sm font-semibold text-amber-100 transition hover:bg-amber-300/10"
            >
              Back to Admin
            </Link>
          </div>
        </div>
      </div>

      <DrillQuiz question={question} />
    </div>
  );
}