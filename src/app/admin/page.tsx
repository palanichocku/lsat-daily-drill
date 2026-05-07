import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type AdminQuestionRow = {
  id: string;
  drill_number: number;
  question_type: string;
  difficulty: string;
  title: string;
  topic: string;
  correct_answer: string;
  published: boolean;
  display_date: string | null;
  created_at: string;
};

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing ${name}`);
  }

  return value;
}

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

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function requireAdmin() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/admin");
  }
}

async function loginAction(formData: FormData) {
  "use server";

  const passcode = String(formData.get("passcode") ?? "");
  const expectedPasscode = getRequiredEnv("ADMIN_PASSCODE");
  const sessionToken = getRequiredEnv("ADMIN_SESSION_TOKEN");

  if (passcode !== expectedPasscode) {
    redirect("/admin?error=invalid");
  }

  const cookieStore = await cookies();

  cookieStore.set("ldd_admin", sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/admin");
}

async function logoutAction() {
  "use server";

  const cookieStore = await cookies();

  cookieStore.delete("ldd_admin");

  redirect("/admin");
}

async function togglePublishedAction(formData: FormData) {
  "use server";

  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const published = String(formData.get("published") ?? "") === "true";

  if (!id) {
    redirect("/admin");
  }

  const supabase = getSupabaseAdminClient();

  const { error } = await supabase
    .from("lsat_questions")
    .update({
      published: !published,
      published_at: !published ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to update publish status: ${error.message}`);
  }

  redirect("/admin");
}

async function createQuestionAction(formData: FormData) {
  "use server";

  await requireAdmin();

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

  const id = slugify(title) || `drill-${drillNumber}`;
  const now = new Date().toISOString();

  const supabase = getSupabaseAdminClient();

  const { error } = await supabase.from("lsat_questions").upsert(
    {
      id,
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
    },
    {
      onConflict: "id",
    }
  );

  if (error) {
    throw new Error(`Failed to create question: ${error.message}`);
  }

  redirect("/admin");
}

async function getAdminQuestions() {
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
      correct_answer,
      published,
      display_date,
      created_at
    `
    )
    .order("drill_number", { ascending: false });

  if (error) {
    throw new Error(`Failed to load admin questions: ${error.message}`);
  }

  return (data ?? []) as AdminQuestionRow[];
}

function LoginPanel({ error }: { error?: string }) {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6">
      <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center">
        <Link href="/" className="mb-8 text-sm font-semibold text-amber-200">
          ← LSAT Daily Drill
        </Link>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-black/30 sm:p-8">
          <h1 className="text-2xl font-bold">Admin Login</h1>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            Enter your private admin passcode to manage LSAT drills.
          </p>

          {error === "invalid" && (
            <div className="mt-5 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
              Invalid passcode. Try again.
            </div>
          )}

          <form action={loginAction} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="passcode"
                className="text-sm font-medium text-slate-200"
              >
                Admin passcode
              </label>

              <input
                id="passcode"
                name="passcode"
                type="password"
                required
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-amber-300"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-amber-300 px-5 py-3 font-semibold text-slate-950 transition hover:bg-amber-200"
            >
              Log In
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return <LoginPanel error={params?.error} />;
  }

  const questions = await getAdminQuestions();

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/" className="text-sm font-semibold text-amber-200">
              LSAT Daily Drill
            </Link>

            <h1 className="mt-3 text-3xl font-bold tracking-tight">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-slate-300">
              Add and manage LSAT daily drills.
            </p>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-900"
            >
              Log Out
            </button>
          </form>
        </header>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold">Question Bank</h2>
              <p className="mt-2 text-sm text-slate-400">
                {questions.length} total drills in Supabase.
              </p>
            </div>

            <Link
              href="/archive"
              className="text-sm font-semibold text-amber-200 hover:text-amber-100"
            >
              View public archive →
            </Link>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
            <div className="hidden grid-cols-[90px_1fr_140px_120px_120px_120px] gap-4 border-b border-slate-800 bg-slate-950/60 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
              <div>Drill</div>
              <div>Title</div>
              <div>Type</div>
              <div>Date</div>
              <div>Status</div>
              <div>Action</div>
            </div>

            <div className="divide-y divide-slate-800">
              {questions.map((question) => (
                <div
                  key={question.id}
                  className="grid gap-4 px-4 py-4 md:grid-cols-[90px_1fr_140px_120px_120px_120px] md:items-center"
                >
                  <div className="text-sm font-semibold text-amber-200">
                    #{question.drill_number}
                  </div>

                  <div>
                    <Link
                      href={`/drill/${question.id}`}
                      className="font-semibold text-white hover:text-amber-200"
                    >
                      {question.title}
                    </Link>

                    <p className="mt-1 text-xs text-slate-500">
                      {question.id}
                    </p>
                  </div>

                  <div className="text-sm text-slate-300">
                    {question.question_type}
                  </div>

                  <div className="text-sm text-slate-300">
                    {question.display_date ?? "No date"}
                  </div>

                  <div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        question.published
                          ? "bg-emerald-400/10 text-emerald-200"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {question.published ? "Published" : "Draft"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
                    <Link
                      href={`/admin/questions/${question.id}`}
                      className="rounded-xl border border-amber-300/40 px-4 py-2 text-center text-sm font-semibold text-amber-200 transition hover:bg-amber-300/10"
                    >
                      Edit
                    </Link>

                    <Link
                      href={`/admin/preview/${question.id}`}
                      className="rounded-xl border border-slate-700 px-4 py-2 text-center text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
                    >
                      Preview
                    </Link>
                    
                    <form action={togglePublishedAction}>
                      <input type="hidden" name="id" value={question.id} />
                      <input
                        type="hidden"
                        name="published"
                        value={String(question.published)}
                      />

                      <button
                        type="submit"
                        className="w-full rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
                      >
                        {question.published ? "Unpublish" : "Publish"}
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
          <h2 className="text-2xl font-bold">Add New Drill</h2>

          <p className="mt-2 text-sm text-slate-400">
            For now, paste a fully written question. Later we can add AI-assisted
            generation.
          </p>

          <form action={createQuestionAction} className="mt-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <Field label="Drill number" name="drill_number" type="number" />
              <SelectField
                label="Question type"
                name="question_type"
                options={["Assumption", "Strengthen", "Weaken", "Inference", "Flaw"]}
              />
              <SelectField
                label="Difficulty"
                name="difficulty"
                options={["Easy", "Medium", "Hard"]}
              />
              <Field label="Display date" name="display_date" type="date" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Title" name="title" />
              <Field label="Topic" name="topic" />
            </div>

            <TextArea label="Prompt / argument" name="prompt" rows={5} />
            <TextArea label="Question stem" name="stem" rows={2} />

            <div className="grid gap-4 md:grid-cols-2">
              <TextArea label="Answer A" name="answer_a" rows={3} />
              <TextArea label="Answer B" name="answer_b" rows={3} />
              <TextArea label="Answer C" name="answer_c" rows={3} />
              <TextArea label="Answer D" name="answer_d" rows={3} />
              <TextArea label="Answer E" name="answer_e" rows={3} />

              <SelectField
                label="Correct answer"
                name="correct_answer"
                options={["A", "B", "C", "D", "E"]}
              />
            </div>

            <TextArea label="Explanation" name="explanation" rows={5} />
            <TextArea label="Key takeaway" name="takeaway" rows={4} />

            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input
                type="checkbox"
                name="published"
                className="h-4 w-4 rounded border-slate-700 bg-slate-950"
              />
              Publish immediately
            </label>

            <button
              type="submit"
              className="rounded-xl bg-amber-300 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-200"
            >
              Save Drill
            </button>
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
}: {
  label: string;
  name: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      <input
        name={name}
        type={type}
        required={name !== "display_date"}
        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-amber-300"
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  rows,
}: {
  label: string;
  name: string;
  rows: number;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      <textarea
        name={name}
        rows={rows}
        required
        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-amber-300"
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      <select
        name={name}
        required
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