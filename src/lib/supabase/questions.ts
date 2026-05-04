import { createClient } from "@supabase/supabase-js";

export type AnswerLetter = "A" | "B" | "C" | "D" | "E";

export type AnswerChoice = {
  letter: AnswerLetter;
  text: string;
};

export type LsatQuestion = {
  id: string;
  drillNumber: number;
  type: "Assumption" | "Strengthen" | "Weaken" | "Inference" | "Flaw";
  difficulty: "Easy" | "Medium" | "Hard";
  title: string;
  topic: string;
  prompt: string;
  stem: string;
  choices: AnswerChoice[];
  correctAnswer: AnswerLetter;
  explanation: string;
  takeaway: string;
  published: boolean;
  displayDate: string | null;
};

type DbLsatQuestion = {
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

const QUESTION_SELECT = `
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
`;

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!supabaseKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function mapDbQuestion(row: DbLsatQuestion): LsatQuestion {
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

export async function getPublishedQuestions() {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("lsat_questions")
    .select(QUESTION_SELECT)
    .eq("published", true)
    .order("drill_number", { ascending: true });

  if (error) {
    throw new Error(`Failed to load LSAT questions: ${error.message}`);
  }

  return (data ?? []).map((row) => mapDbQuestion(row as DbLsatQuestion));
}

export async function getLatestQuestion() {
  const supabase = getSupabaseClient();
  const today = getTodayIsoDate();

  const { data, error } = await supabase
    .from("lsat_questions")
    .select(QUESTION_SELECT)
    .eq("published", true)
    .lte("display_date", today)
    .order("display_date", { ascending: false })
    .order("drill_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load latest LSAT question: ${error.message}`);
  }

  return data ? mapDbQuestion(data as DbLsatQuestion) : null;
}

export async function getQuestionById(id: string) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("lsat_questions")
    .select(QUESTION_SELECT)
    .eq("id", id)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load LSAT question: ${error.message}`);
  }

  return data ? mapDbQuestion(data as DbLsatQuestion) : null;
}