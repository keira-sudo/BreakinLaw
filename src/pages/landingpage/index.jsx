import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleStart = (e) => {
    e.preventDefault();
    navigate('/register'); // or /login if you prefer
  };

  const handleBookLawyer = () => {
    navigate('/lawyers'); // adjust this route to your real lawyer booking page
  };

  return (
    <div
      className="min-h-screen flex flex-col text-white relative overflow-hidden"
      style={{
        backgroundImage:
          'radial-gradient(circle at top, #27348b 0, #050018 55%)',
      }}
    >
      {/* Public navbar */}
      <header className="w-full bg-transparent absolute top-0 left-0 z-50">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-sky-600 text-white">BreakinLaw</span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <button
              type="button"
              onClick={() => navigate('/News')}
              className="hover:text-white w-28 h-10 rounded-xl text-sm font-semibold bg-sky-500 hover:bg-sky-600 text-white whitespace-nowrap transition-colors"
            >
              
              Latest News
            </button>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-slate-100 hover:text-white"
            >
              Log in
            </button>

            <Button
              size="sm"
              className="bg-sky-500 hover:bg-sky-600 text-sm"
              onClick={() => navigate('/register')}
            >
              Get started
            </Button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden">
          {/* glow blobs */}
          <div className="pointer-events-none absolute -top-40 right-[-10%] h-72 w-72 rounded-full bg-sky-400/40 blur-3xl opacity-80" />
          <div className="pointer-events-none absolute top-1/2 left-[-15%] h-72 w-72 rounded-full bg-pink-300/50 blur-3xl opacity-70" />

          <div className="relative max-w-3xl mx-auto px-4 lg:px-6 pt-24 pb-20 flex flex-col items-center text-center">
            {/* LEFT: copy + CTA */}
            <div className="flex-1 max-w-xl">
              {/* headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-3 leading-tight text-center">
                Clear, simple legal answers
                <span className="block text-sky-300">
                  before you talk to a lawyer.
                </span>
              </h1>

             {/* cloud background */}
                  <img
                    src="clouddd.png"
                    alt="cloud"
                    className="pointer-events-none absolute right-[-60%] top-36 w-[420px] opacity-90"
                    aria-hidden="true"
                  />

                  <img
                    src="clouddd.png"
                    alt="cloud"
                    className="pointer-events-none absolute left-[-60%] top-6 w-[420px] opacity-90"
                    aria-hidden="true"
                  />




              {/* subcopy */}
              <p className="text-sm sm:text-base text-slate-200 mb-4 max-w-xl text-center">
                Understand your situation in plain language, know your rights, and walk
                into any legal consultation prepared instead of lost.
              </p>

              

              {/* CTA card like DoNotPay */}
              <form onSubmit={handleStart} className="mx-auto max-w-md w-full mt-16">
                <div className="rounded-[28px] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.25)] p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter your e-mail "
                    className="flex-1 px-4 py-3 rounded-2xl text-sm outline-none border-none text-slate-900 placeholder:text-slate-400 bg-transparent"
                  />
                  <button
                    type="submit"
                    className="px-4 sm:px-6 py-3 rounded-2xl text-sm font-semibold bg-[#ff2fb3] hover:bg-[#e0269f] text-sm text-white whitespace-nowrap transition-colors"
                  >
                    Get started free
                  </button>
                </div>
              </form>

              {/* secondary text */}
              <div className="mt-4 text-center md:text-left">
                <p className="text-xs text-slate-300 mb-1 text-center">
                  No legal jargon. Just clear steps.
                </p>
                <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-xs text-sky-300 hover:text-sky-100 font-medium"
                >
                  Already have an account? Log in
                </button>
                </div>
              </div>

              {/* trust row */}
              <div className="mt-5 flex flex-wrap justify-center md:justify-center gap-x-4 gap-y-2 text-[11px] text-slate-300 text-center">
                
                
                <span className="inline-flex items-center gap-1.5 ">
                  <Icon name="ShieldCheck" size={14} />
                  Private &amp; secure
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="Clock" size={14} />
                  Available 24/7
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="PoundSterling" size={14} />
                  Always £0 for citizens
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* rest of your sections unchanged */}
        {/* HOW IT WORKS */}
        <section className="">
          <div className="max-w-6xl mx-auto px-4 lg:px-6 py-12 ">
            <h2 className="text-xs text-sky-600 sm:text-2xl font-semibold text-slate-900 mb-2 text-white">
              How BreakinLaw works
            </h2>
            <p className="text-sm text-slate-600 mb-6 max-w-2xl text-white">
              In a few minutes, you move from confused and stressed to informed and ready
              for a conversation with a lawyer, if you even need one.
            </p>

            <div className="grid gap-6 md:grid-cols-3 ">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5 bg-white ">
                <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700 mb-3">
                  1
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">
                  Tell us your situation
                </h3>
                <p className="text-xs text-slate-600">
                  Describe what’s happening in your own words. No legal vocabulary
                  required.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5 bg-white ">
                <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700 mb-3">
                  2
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">
                  Get a clear explanation
                </h3>
                <p className="text-xs text-slate-600">
                  BreakinLaw explains your rights, risks, key deadlines, and typical
                  costs in simple language.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5 bg-white">
                <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700 mb-3">
                  3
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">
                  Decide what to do next
                </h3>
                <p className="text-xs text-slate-600">
                  Get suggested next steps, questions to ask, and the option to book a
                  suitable lawyer when needed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT YOU GET BEFORE SEEING A LAWYER */}
        <section className="bg-slate-50/80 border-t border-slate-100">
          <div className="max-w-6xl mx-auto px-4 lg:px-6 py-12">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-2">
              What you get before seeing a lawyer
            </h2>
            <p className="text-sm text-slate-600 mb-6 max-w-2xl">
              BreakinLaw is built for citizens who feel lost, overwhelmed, or scared
              around legal issues. You get clarity first, then help choosing the right
              professional.
            </p>

            <div className="grid gap-4 md:grid-cols-3 text-sm">
              <div className="rounded-2xl bg-white border border-slate-100 p-4">
                <p className="font-semibold text-slate-900 mb-1">Plain-language summary</p>
                <p className="text-xs text-slate-600">
                  Your situation explained in simple terms, without legal jargon.
                </p>
              </div>
              <div className="rounded-2xl bg-white border border-slate-100 p-4">
                <p className="font-semibold text-slate-900 mb-1">Your rights &amp; options</p>
                <p className="text-xs text-slate-600">
                  A clear list of what you can do, what to avoid, and the risks on each path.
                </p>
              </div>
              <div className="rounded-2xl bg-white border border-slate-100 p-4">
                <p className="font-semibold text-slate-900 mb-1">Questions to ask a lawyer</p>
                <p className="text-xs text-slate-600">
                  A checklist of focused questions so your consultation is efficient and useful.
                </p>
              </div>
              <div className="rounded-2xl bg-white border border-slate-100 p-4">
                <p className="font-semibold text-slate-900 mb-1">Costs &amp; timelines</p>
                <p className="text-xs text-slate-600">
                  Typical cost ranges and expected timelines, so surprises are reduced.
                </p>
              </div>
              <div className="rounded-2xl bg-white border border-slate-100 p-4">
                <p className="font-semibold text-slate-900 mb-1">When you can DIY</p>
                <p className="text-xs text-slate-600">
                  Cases where you can reasonably handle things yourself with guidance.
                </p>
              </div>
              <div className="rounded-2xl bg-white border border-slate-100 p-4">
                <p className="font-semibold text-slate-900 mb-1">When you need a lawyer</p>
                <p className="text-xs text-slate-600">
                  Situations where professional help is strongly recommended, with a path
                  to book one.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS / STORIES */}
        <section className="bg-white border-t border-slate-100">
          <div className="max-w-6xl mx-auto px-4 lg:px-6 py-12">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-2">
              Citizens feel more confident after using BreakinLaw
            </h2>
            <p className="text-sm text-slate-600 mb-6 max-w-2xl">
              Real situations, less stress. BreakinLaw was created so people stop showing
              up to legal meetings confused and unprepared.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 text-sm">
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">
                  Housing issue
                </p>
                <p className="text-slate-800 mb-3">
                  “I had no idea what my landlord was allowed to do. After 5 minutes with
                  BreakinLaw, I understood my options and went into the consultation
                  knowing exactly what to ask.”
                </p>
                <p className="text-[11px] text-slate-500">Tenant, London</p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 text-sm">
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">
                  Before the first call
                </p>
                <p className="text-slate-800 mb-3">
                  “Instead of spending the first 20 minutes explaining basic context, my
                  client arrived with a clear summary from BreakinLaw. It made our time
                  together far more productive.”
                </p>
                <p className="text-[11px] text-slate-500">Solicitor, UK</p>
              </div>
            </div>
          </div>
        </section>

        {/* LAWYER CREDIBILITY / B2B HOOK */}
        <section className="bg-sky-50 border-t border-sky-100">
          <div className="max-w-6xl mx-auto px-4 lg:px-6 py-10 flex flex-col md:flex-row gap-8 md:items-center md:justify-between">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-2">
                Built for citizens, trusted by legal professionals
              </h2>
              <p className="text-sm text-slate-700 mb-4 max-w-xl">
                BreakinLaw gives firms better-prepared clients, fewer repetitive questions,
                and a clearer record of the client’s situation from day one.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700">
                <li>• Clients arrive with a structured summary of their case.</li>
                <li>• Time in consultation is focused on strategy, not translation.</li>
                <li>• Citizens feel more confident and engaged in their own case.</li>
              </ul>
            </div>
            <div className="flex-1">
              <div className="rounded-2xl bg-white border border-slate-100 p-5 text-sm shadow-sm">
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">
                  For law firms
                </p>
                <p className="text-slate-800 mb-3">
                  “Anything that helps clients understand the basics before we speak is
                  valuable. Tools like BreakinLaw reduce confusion on both sides.”
                </p>
                <p className="text-[11px] text-slate-500">Partner, UK law firm</p>
              </div>
            </div>
          </div>
        </section>

        {/* BOOK LAWYER CTA */}
        <section className="bg-slate-900 text-white">
          <div className="max-w-6xl mx-auto px-4 lg:px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-1">
                Need a lawyer after getting clarity?
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 max-w-lg">
                When your situation requires professional help, BreakinLaw helps you move
                from understanding to action by connecting you with suitable lawyers.
              </p>
            </div>
            <Button
              size="sm"
              className="bg-sky-500 hover:bg-sky-400 text-sm"
              onClick={handleBookLawyer}
            >
              Find a lawyer through BreakinLaw
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-500 text-center sm:text-left">
            © {new Date().getFullYear()} BreakinLaw. Not a law firm. Educational guidance only.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <a href="#" className="hover:text-slate-900">
              Privacy
            </a>
            <a href="#" className="hover:text-slate-900">
              Terms
            </a>
            <a href="#" className="hover:text-slate-900">
              UK Legal Disclaimer
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
