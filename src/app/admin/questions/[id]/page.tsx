import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type AdminQuestionRow = {
  id: string;
  drill_number: number;
  question_type: string;
  difficulty: string;
  title: string;
  topic: string;
  prompt: string;
  stem: string;
  answer_a: string;
  answer_b: string;
  answer_c: string;
  answer_d: string;
  answer_e: string;
  correct_answer: string;
  explanation: string;
  takeaway: string;
  published: boolean;
  display_date: string | null;
};

type EditQuestionPageProps = {
  params: Promise<{
    id: string;
  }>;
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

async function getQuestion(id: string) {
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
    throw new Error(`Failed to load question: ${error.message}`);
  }

  return data as AdminQuestionRow | null;
}

async function updateQuestionAction(formData: FormData) {
  "use server";

  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const drillNumber = Number(formData.get("drill_number"));
  const questionType = String(formData.get("question_type") ?? "");
  const difficulty = String(formData.get("difficulty") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const topic = String(formData.get("topic") ?? "").trim();
  const displayDate = String(formData.get("display_date") ?? "").trim();

  const prompt = String(formData.get("prompt") ?? "").trim();
  const stem = String(formData.get("stem") ?? "").trim();

  const answerA = String(formData.get("answer_a") ?? "").trim();
  const answerB = String(formData.get("answer_b") ?? "").trim();
  const answerC = String(formData.get("answer_c") ?? "").trim();
  const answerD = String(formData.get("answer_d") ?? "").trim();
  const answerE = String(formData.get("answer_e") ?? "").trim();

  const correctAnswer = String(formData.get("correct_answer") ?? "").trim();
  const explanation = String(formData.get("explanation") ?? "").trim();
  const takeaway = String(formData.get("takeaway") ?? "").trim();
  const published = String(formData.get("published") ?? "") === "on";

  if (
    !id ||
    !drillNumber ||
    !questionType ||
    !difficulty ||
    !title ||
    !topic ||
    !prompt ||
    !stem ||
    !answerA ||
    !answerB ||
    !answerC ||
    !answerD ||
    !answerE ||
    !correctAnswer ||
    !explanation ||
    !takeaway
  ) {
    throw new Error("Missing required question fields.");
  }

  const supabase = getSupabaseAdminClient();
  const now = new Date().toISOString();

  const { error } = await supabase
    .from("lsat_questions")
    .update({
      drill_number: drillNumber,
      question_type: questionType,
      difficulty,
      title,
      topic,
      prompt,
      stem,
      answer_a: answerA,
      answer_b: answerB,
      answer_c: answerC,
      answer_d: answerD,
      answer_e: answerE,
      correct_answer: correctAnswer,
      explanation,
      takeaway,
      published,
      published_at: published ? now : null,
      display_date: displayDate || null,
      updated_at: now,
    })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to update question: ${error.message}`);
  }

  redirect("/admin");
}

export default async function EditQuestionPage({
  params,
}: EditQuestionPageProps) {
  await requireAdmin();

  const { id } = await params;
  const question = await getQuestion(id);

  if (!question) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <Link href="/admin" className="text-sm font-semibold text-amber-200">
            ← Back to Admin
          </Link>

          <h1 className="mt-4 text-3xl font-bold tracking-tight">
            Edit Drill #{question.drill_number}
          </h1>

          <p className="mt-2 text-slate-300">{question.title}</p>
        </header>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
          <form action={updateQuestionAction} className="space-y-6">
            <input type="hidden" name="id" value={question.id} />

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-sm font-medium text-slate-400">Question ID</p>
              <p className="mt-1 font-mono text-sm text-slate-200">
                {question.id}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <Field
                label="Drill number"
                name="drill_number"
                type="number"
                defaultValue={String(question.drill_number)}
              />

              <SelectField
                label="Question type"
                name="question_type"
                options={["Assumption", "Strengthen", "Weaken", "Inference", "Flaw"]}
                defaultValue={question.question_type}
              />

              <SelectField
                label="Difficulty"
                name="difficulty"
                options={["Easy", "Medium", "Hard"]}
                defaultValue={question.difficulty}
              />

              <Field
                label="Display date"
                name="display_date"
                type="date"
                required={false}
                defaultValue={question.display_date ?? ""}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Title"
                name="title"
                defaultValue={question.title}
              />

              <Field
                label="Topic"
                name="topic"
                defaultValue={question.topic}
              />
            </div>

            <TextArea
              label="Prompt / argument"
              name="prompt"
              rows={5}
              defaultValue={question.prompt}
            />

            <TextArea
              label="Question stem"
              name="stem"
              rows={2}
              defaultValue={question.stem}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <TextArea
                label="Answer A"
                name="answer_a"
                rows={3}
                defaultValue={question.answer_a}
              />

              <TextArea
                label="Answer B"
                name="answer_b"
                rows={3}
                defaultValue={question.answer_b}
              />

              <TextArea
                label="Answer C"
                name="answer_c"
                rows={3}
                defaultValue={question.answer_c}
              />

              <TextArea
                label="Answer D"
                name="answer_d"
                rows={3}
                defaultValue={question.answer_d}
              />

              <TextArea
                label="Answer E"
                name="answer_e"
                rows={3}
                defaultValue={question.answer_e}
              />

              <SelectField
                label="Correct answer"
                name="correct_answer"
                options={["A", "B", "C", "D", "E"]}
                defaultValue={question.correct_answer}
              />
            </div>

            <TextArea
              label="Explanation"
              name="explanation"
              rows={5}
              defaultValue={question.explanation}
            />

            <TextArea
              label="Key takeaway"
              name="takeaway"
              rows={4}
              defaultValue={question.takeaway}
            />

            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input
                type="checkbox"
                name="published"
                defaultChecked={question.published}
                className="h-4 w-4 rounded border-slate-700 bg-slate-950"
              />
              Published
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                className="rounded-xl bg-amber-300 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-200"
              >
                Save Changes
              </button>

              <Link
                href={`/admin/preview/${question.id}`}
                className="rounded-xl border border-slate-700 px-6 py-3 text-center font-semibold text-slate-200 transition hover:bg-slate-800"
              >
                Preview Drill
              </Link>

              <Link
                href="/admin"
                className="rounded-xl border border-slate-700 px-6 py-3 text-center font-semibold text-slate-200 transition hover:bg-slate-800"
              >
                Cancel
              </Link>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required = true,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-amber-300"
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  rows,
  defaultValue,
}: {
  label: string;
  name: string;
  rows: number;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      <textarea
        name={name}
        rows={rows}
        required
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-amber-300"
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
  defaultValue,
}: {
  label: string;
  name: string;
  options: string[];
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      <select
        name={name}
        required
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-amber-300"
      >
        <option value="">Select</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}