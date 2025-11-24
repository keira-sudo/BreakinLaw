import React from "react";

const topics = [
  {
    id: "money",
    icon: "💸",
    title: "Money & fines",
    description:
      "Parking tickets, late fees, debt collection and other money pain translated into plain language.",
    updates: "3 new updates this week",
  },
  {
    id: "housing",
    icon: "🏠",
    title: "Housing",
    description:
      "Rent increases, deposits, evictions and repairs: what’s new and what you can actually do.",
    updates: "2 new cases explained",
  },
  {
    id: "work",
    icon: "💼",
    title: "Work",
    description:
      "Job contracts, unfair dismissal, gig work and workplace rights explained without legal jargon.",
    updates: "Fresh ruling on unfair dismissal",
  },
  {
    id: "family",
    icon: "👨‍👩‍👧",
    title: "Family",
    description:
      "Divorce, custody, maintenance and family-related rules, always focused on real-life situations.",
    updates: "New guidance for separated parents",
  },
  {
    id: "consumer",
    icon: "🧾",
    title: "Consumer rights",
    description:
      "Subscriptions, refunds, scams and broken stuff: what the law says and how to push back.",
    updates: "Trick subscription fees under the spotlight",
  },
  {
    id: "immigration",
    icon: "🛂",
    title: "Immigration",
    description:
      "Visas, residence, work permits and procedural changes that matter to people on the move.",
    updates: "Updated timelines for permits",
  },
  {
    id: "public-services",
    icon: "🏛️",
    title: "Public services",
    description:
      "Benefits, healthcare, school and admin rules explained so regular humans can understand them.",
    updates: "New benefit rules simplified",
  },
];

function News() {
  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-50 overflow-hidden">
        <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl"></div>
            <div className="pointer-events-none absolute top-40 -right-20 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl"></div>
                <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-pink-500/10 blur-[100px]"></div>

      <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
        <header className="mb-8 sm:mb-10">
          <span className="inline-flex items-center rounded-full bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-300 border border-sky-500/30">
            ⚖️ Live legal updates
          </span>

          <h1 className="mt-3 text-3xl sm:text-4xl font-bold">
            Latest legal news
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl">
            Fresh legal changes and cases, explained in clear language so
            citizens don’t need a law degree to understand what affects them.
          </p>

          <p className="mt-3 text-xs sm:text-sm text-slate-400">
            Updated daily. We pick the stories that actually change how your
            money, home or work life works.
          </p>
        </header>

        {/* Topic boxes */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {topics.map((topic) => (
            <article
              key={topic.id}
              className="flex flex-col bg-slate-900/80 border border-slate-700 rounded-2xl p-4 sm:p-5 shadow-sm hover:border-sky-500 hover:shadow-xl hover:-translate-y-1 transition-transform transition-shadow duration-150"
            >
              <div className="flex items-start gap-3 mb-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/15 text-lg">
                  <span className="leading-none">{topic.icon}</span>
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-semibold">
                    {topic.title}
                  </h2>
                  <p className="mt-1 text-[11px] sm:text-xs font-medium text-sky-300">
                    {topic.updates}
                  </p>
                </div>
              </div>

              <p className="mt-2 text-xs sm:text-sm text-slate-300 flex-1">
                {topic.description}
              </p>

              <button
                type="button"
                className="mt-4 inline-flex items-center text-xs sm:text-sm font-semibold text-sky-300 hover:text-sky-200"
              >
                See latest updates
                <span className="ml-1 text-sm">→</span>
              </button>
            </article>
          ))}
        </section>

        {/* CTA */}
        <section className="mt-10 sm:mt-12 rounded-2xl border border-sky-500/30 bg-sky-500/10 px-4 py-5 sm:px-6 sm:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-sm sm:text-base font-semibold">
              Stay ahead of legal changes
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-200 max-w-md">
              Get a short weekly summary of the most important updates for
              citizens: money, housing, work and more.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full bg-sky-500 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-sky-600 transition"
          >
            Get weekly legal briefings
          </button>
        </section>
      </div>
    </main>
  );
}

export default News;
