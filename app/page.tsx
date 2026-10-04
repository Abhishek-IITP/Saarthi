"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";

export default function Landing() {
  const [demoRemembered, setDemoRemembered] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1F1E1D]">
      <Navbar />

      {/* Hero Section */}
      <section className="mx-auto grid min-h-[calc(100vh-3.5rem)] max-w-6xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-md border border-[#E5E3DC] bg-[#F3F1EC] px-3 py-1 font-mono text-xs text-[#57534E]">
            <span className="text-[#D96B27]">✦</span> GEMMA 3 · LOCAL INFERENCE · PRIVATE
          </span>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-[#1F1E1D] sm:text-6xl leading-[1.08]">
            PRIVATE AI<br />
            THAT REMEMBERS.
          </h1>

          <p className="mt-4 text-xl font-medium text-[#D96B27]">
            Meet Saarthi.
          </p>

          <p className="mt-3 max-w-md text-sm text-[#706E68] leading-relaxed">
            A personal AI companion that understands what matters to you and helps you decide what to do next. Powered by local Gemma 3 and MongoDB memory.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-md bg-[#D96B27] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#C25E1F] transition-colors inline-flex items-center gap-2"
            >
              <span>Talk to Saarthi</span>
              <ArrowRight className="size-4" />
            </Link>
            <a
              href="#how"
              className="rounded-md border border-[#E5E3DC] bg-[#FFFFFF] px-5 py-2.5 text-sm font-medium text-[#1F1E1D] hover:bg-[#F8F7F4] hover:border-[#D1CEBE] transition-colors"
            >
              How it works
            </a>
          </div>

          <div className="mt-8 flex items-center gap-2 text-xs text-[#706E68]">
            <ShieldCheck className="size-4 text-emerald-600" />
            <span>Turn off Wi-Fi and Saarthi still works. 100% offline local inference.</span>
          </div>
        </div>

        {/* Hero Interactive Demo Card */}
        <div className="relative">
          <div className="rounded-xl border border-[#E5E3DC] bg-[#FFFFFF] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between text-xs pb-3 border-b border-[#E5E3DC]">
              <span className="font-semibold text-[#1F1E1D] flex items-center gap-1.5">
                <span className="text-[#D96B27]">✦</span> Saarthi Engine
              </span>
              <span className="font-mono text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-emerald-600" />
                Local 127.0.0.1
              </span>
            </div>

            <div className="rounded-lg bg-[#FAF9F5] p-3.5 text-xs text-[#44423E] border border-[#E5E3DC] font-mono">
              &ldquo;I have an exam Friday and I&apos;m struggling with normalization.&rdquo;
            </div>

            <div className="rounded-lg border border-[#E5E3DC] bg-[#FAF9F5] p-4 space-y-3">
              <p className="text-xs font-semibold text-[#D96B27] flex items-center gap-1.5">
                <span>✦</span> I noticed something worth remembering.
              </p>

              <div className="space-y-1.5 text-xs font-mono">
                <p className="text-[#1F1E1D] flex items-center gap-1.5">
                  <span className="text-[#8C8980]">event:</span> DBMS exam → Friday
                </p>
                <p className="text-[#C2410C] flex items-center gap-1.5">
                  <span className="text-[#8C8980]">weakness:</span> DBMS Normalization
                </p>
              </div>

              {!demoRemembered ? (
                <div className="pt-1">
                  <p className="text-[11px] text-[#706E68] mb-2.5">Remember these in your structured profile?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDemoRemembered(true)}
                      className="rounded-md bg-[#D96B27] px-3.5 py-1.5 text-xs font-medium text-white hover:bg-[#C25E1F] transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Check className="size-3" />
                      <span>Remember both</span>
                    </button>
                    <button
                      onClick={() => setDemoRemembered(false)}
                      className="rounded-md border border-[#E5E3DC] bg-[#FFFFFF] px-3.5 py-1.5 text-xs text-[#706E68] hover:text-[#1F1E1D]"
                    >
                      Not now
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-md bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-800 font-mono flex items-center gap-2">
                  <Check className="size-3.5 text-emerald-600" />
                  <span>Stored in MongoDB memory profile</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="mx-auto max-w-6xl px-5 py-24 border-t border-[#E5E3DC]">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-[#1F1E1D] sm:text-3xl">
            How Saarthi Works
          </h2>
          <p className="mt-2 text-sm text-[#706E68]">
            MongoDB remembers. Gemma thinks. Saarthi helps.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-[#E5E3DC] bg-[#FFFFFF] p-7 shadow-sm">
            <span className="font-mono text-xs font-bold text-[#D96B27]">01</span>
            <h3 className="mt-4 font-bold text-sm tracking-wider uppercase text-[#1F1E1D]">
              TALK
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#706E68]">
              Tell Saarthi what is happening in your life in natural conversational language.
            </p>
          </div>

          <div className="rounded-xl border border-[#E5E3DC] bg-[#FFFFFF] p-7 shadow-sm">
            <span className="font-mono text-xs font-bold text-[#D96B27]">02</span>
            <h3 className="mt-4 font-bold text-sm tracking-wider uppercase text-[#1F1E1D]">
              REMEMBER
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#706E68]">
              Gemma identifies useful context worth remembering, and asks for your approval before saving.
            </p>
          </div>

          <div className="rounded-xl border border-[#E5E3DC] bg-[#FFFFFF] p-7 shadow-sm">
            <span className="font-mono text-xs font-bold text-[#D96B27]">03</span>
            <h3 className="mt-4 font-bold text-sm tracking-wider uppercase text-[#1F1E1D]">
              HELP
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#706E68]">
              Saarthi uses that context to prioritize your day, plan tasks, and explain its recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* Landing Privacy Section */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="rounded-xl border border-[#E5E3DC] bg-[#FFFFFF] px-8 py-16 text-center shadow-sm">
          <h2 className="text-2xl font-bold tracking-tight text-[#1F1E1D] sm:text-3xl">
            Your context belongs to you.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-[#706E68] leading-relaxed">
            Saarthi runs Gemma locally through Ollama. Your AI doesn&apos;t have to live on someone else&apos;s server.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#D96B27] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#C25E1F] transition-colors"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#E5E3DC] py-8 text-center text-xs text-[#8C8980]">
        Saarthi · Built with Next.js, MongoDB, Gemma 3, and Ollama · 100% Private
      </footer>
    </div>
  );
}
