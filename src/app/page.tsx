import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-6 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm font-medium text-amber-200">
          LSAT Daily Drill
        </div>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          One LSAT logic drill every day.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          Practice one original LSAT-style Logical Reasoning question at a time.
          Choose an answer, get instant feedback, and learn the reasoning pattern
          behind the correct answer.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/drill"
            className="rounded-xl bg-amber-300 px-6 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-amber-300/20 transition hover:bg-amber-200"
          >
            Start Today&apos;s Drill
          </Link>

          <Link
            href="/archive"
            className="rounded-xl border border-slate-700 px-6 py-3 text-base font-semibold text-slate-200 transition hover:bg-slate-900"
          >
            View Archive
          </Link>
        </div>

        <div className="mt-14 grid max-w-3xl gap-4 text-left sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <h2 className="font-semibold text-amber-200">Practice</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Answer one focused LSAT-style question at a time.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <h2 className="font-semibold text-amber-200">Review</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              See why each wrong answer fails and why the right answer works.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <h2 className="font-semibold text-amber-200">Improve</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Learn repeatable reasoning patterns for Logical Reasoning.
            </p>
          </div>
        </div>

        <p className="mt-10 text-sm text-slate-500">
          Original LSAT-style practice. Not affiliated with LSAC.
        </p>
      </section>
    </main>
  );
}