import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { VOICES } from "@/lib/constants";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-6 py-16">
        <section className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="inline-block rounded-full border border-brand-500/50 bg-brand-500/10 px-3 py-1 text-xs text-brand-400">
              AI voice platform for modern teams
            </p>
            <h1 className="mt-6 text-4xl font-semibold leading-tight text-white md:text-5xl">
              Studio-grade text to speech that ships in minutes.
            </h1>
            <p className="mt-4 text-lg text-slate-300">
              Create clear, natural voiceovers for product demos, support bots, and social content
              without studio complexity.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="rounded-xl bg-brand-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-brand-400"
              >
                Start generating
              </Link>
              <Link
                href="/dashboard/generate"
                className="rounded-xl border border-white/20 px-5 py-3 text-white transition hover:bg-white/10"
              >
                View demo app
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0f1526] p-6">
            <p className="mb-4 text-sm text-slate-300">Popular voice presets</p>
            <div className="grid gap-3">
              {VOICES.slice(0, 3).map((voice) => (
                <div key={voice.id} className="rounded-xl border border-white/10 bg-[#0b1120] p-3">
                  <p className="font-medium text-white">{voice.name}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {voice.accent} • {voice.tone}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
