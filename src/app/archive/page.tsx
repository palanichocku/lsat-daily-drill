import Link from "next/link";

const drills = [
  {
    number: 1,
    title: "Smart Parking Meters",
    type: "Assumption",
    difficulty: "Medium",
    href: "/drill",
  },
];

export default function ArchivePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 flex items-center justify-between gap-4">
          <Link href="/" className="text-sm font-semibold text-amber-200">
            LSAT Daily Drill
          </Link>

          <Link href="/drill" className="text-sm text-slate-300 hover:text-white">
            Today&apos;s Drill
          </Link>
        </header>

        <section>
          <h1 className="text-3xl font-bold tracking-tight">Drill Archive</h1>
          <p className="mt-3 text-slate-300">
            Review previous LSAT-style Logical Reasoning drills.
          </p>

          <div className="mt-8 space-y-4">
            {drills.map((drill) => (
              <Link
                key={drill.number}
                href={drill.href}
                className="block rounded-3xl border border-slate-800 bg-slate-900/70 p-5 transition hover:border-amber-300/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-amber-200">
                      Drill #{drill.number}
                    </p>
                    <h2 className="mt-1 text-xl font-bold">{drill.title}</h2>
                    <p className="mt-2 text-sm text-slate-400">
                      {drill.type} · {drill.difficulty}
                    </p>
                  </div>

                  <span className="text-sm text-slate-400">Start →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}