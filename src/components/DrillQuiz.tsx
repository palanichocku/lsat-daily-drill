"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { LsatQuestion } from "@/lib/supabase/questions";

type Props = {
  question: LsatQuestion;
};

export default function DrillQuiz({ question }: Props) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = useMemo(() => {
    return selectedAnswer === question.correctAnswer;
  }, [selectedAnswer, question.correctAnswer]);

  function handleSubmit() {
    if (!selectedAnswer) return;
    setSubmitted(true);
  }

  function handleReset() {
    setSelectedAnswer(null);
    setSubmitted(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 flex items-center justify-between gap-4">
          <Link href="/" className="text-sm font-semibold text-amber-200">
            LSAT Daily Drill
          </Link>

          <Link
            href="/archive"
            className="text-sm text-slate-300 hover:text-white"
          >
            Archive
          </Link>
        </header>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-black/30 sm:p-8">
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-amber-300/10 px-3 py-1 text-xs font-medium text-amber-200">
              {question.type}
            </span>

            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
              {question.difficulty}
            </span>

            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
              Drill #{question.drillNumber}
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {question.title}
          </h1>

          <div className="mt-6 space-y-4 text-base leading-7 text-slate-200">
            <p>{question.prompt}</p>
            <p className="font-semibold text-white">{question.stem}</p>
          </div>

          <div className="mt-8 space-y-3">
            {question.choices.map((choice) => {
              const isSelected = selectedAnswer === choice.letter;
              const isCorrectChoice = choice.letter === question.correctAnswer;

              let choiceClass =
                "border-slate-700 bg-slate-950/60 hover:border-amber-300/70 hover:bg-slate-900";

              if (submitted && isCorrectChoice) {
                choiceClass = "border-emerald-400 bg-emerald-400/10";
              } else if (submitted && isSelected && !isCorrectChoice) {
                choiceClass = "border-rose-400 bg-rose-400/10";
              } else if (isSelected) {
                choiceClass = "border-amber-300 bg-amber-300/10";
              }

              return (
                <button
                  key={choice.letter}
                  type="button"
                  disabled={submitted}
                  onClick={() => setSelectedAnswer(choice.letter)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${choiceClass}`}
                >
                  <div className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-amber-200">
                      {choice.letter}
                    </span>

                    <span className="text-sm leading-6 text-slate-100 sm:text-base">
                      {choice.text}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {!submitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                className="rounded-xl bg-amber-300 px-5 py-3 font-semibold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Submit Answer
              </button>
            ) : (
              <button
                type="button"
                onClick={handleReset}
                className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-200 transition hover:bg-slate-800"
              >
                Try Again
              </button>
            )}

            <Link
              href="/archive"
              className="rounded-xl border border-slate-700 px-5 py-3 text-center font-semibold text-slate-200 transition hover:bg-slate-800"
            >
              View Archive
            </Link>
          </div>
        </section>

        {submitted && (
          <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
            <div
              className={`mb-4 rounded-2xl px-4 py-3 text-sm font-semibold ${
                isCorrect
                  ? "bg-emerald-400/10 text-emerald-200"
                  : "bg-rose-400/10 text-rose-200"
              }`}
            >
              {isCorrect
                ? "Correct."
                : `Not quite. The correct answer is ${question.correctAnswer}.`}
            </div>

            <h2 className="text-xl font-bold">Explanation</h2>
            <p className="mt-3 leading-7 text-slate-300">
              {question.explanation}
            </p>

            <h2 className="mt-6 text-xl font-bold">Key LSAT Takeaway</h2>
            <p className="mt-3 leading-7 text-slate-300">
              {question.takeaway}
            </p>
          </section>
        )}
      </div>
    </main>
  );
}