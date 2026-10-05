"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowUp,
  HelpCircle,
  Calendar,
  Target,
  AlertTriangle,
  Sliders,
  RefreshCw,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { SmartExtractionCard } from "@/components/SmartExtractionCard";
import { ContextDrawer, DrawerType } from "@/components/ContextDrawer";
import { PlanDayModal } from "@/components/PlanDayModal";
import { greeting, SUGGESTIONS, type Memory, apiFetchMemories } from "@/lib/saarthi";
import { SaarthiTake, PlanItem } from "@/types/memory";

export default function Dashboard() {
  const router = useRouter();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loadingMemories, setLoadingMemories] = useState(true);
  const [q, setQ] = useState("");
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [take, setTake] = useState<SaarthiTake | null>(null);
  const [loadingTake, setLoadingTake] = useState(false);
  const [plan, setPlan] = useState<PlanItem[]>([]);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [planSummary, setPlanSummary] = useState("");
  const [contextUpdatedDismissed, setContextUpdatedDismissed] = useState(false);

  const loadMemories = async () => {
    setLoadingMemories(true);
    try {
      const data = await apiFetchMemories();
      setMemories(data.memories || []);
    } catch {
      // offline fallback
    } finally {
      setLoadingMemories(false);
    }
  };

  const loadTake = async () => {
    setLoadingTake(true);
    try {
      const res = await fetch("/api/brief");
      const data = await res.json();
      setTake(data);
    } catch {
      // offline fallback
    } finally {
      setLoadingTake(false);
    }
  };

  const loadPlan = async () => {
    setLoadingPlan(true);
    try {
      const res = await fetch("/api/plan");
      const data = await res.json();
      if (data.schedule) {
        setPlan(data.schedule);
        setPlanSummary(data.summary || "");
      }
    } catch {
      // offline fallback
    } finally {
      setLoadingPlan(false);
    }
  };

  useEffect(() => {
    loadMemories();
    loadTake();
    loadPlan();
  }, []);

  const handleAsk = (text: string) => {
    if (text.trim()) {
      router.push(`/ask?q=${encodeURIComponent(text.trim())}`);
    }
  };

  const goalsCount = memories.filter((m) => m.category === "goal").length;
  const weaknessesCount = memories.filter((m) => m.category === "weakness").length;
  const upcomingCount = memories.filter((m) => m.category === "event" && m.status === "active").length;
  const preferencesCount = memories.filter((m) => m.category === "preference").length;

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1F1E1D]">
      <Navbar />

      <main className="mx-auto max-w-5xl px-5 pb-28 pt-8 space-y-7">
        {/* Dynamic Greeting */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-md border border-[#E5E3DC] bg-[#FFFFFF] px-2.5 py-1 font-mono text-[11px] text-[#706E68] tracking-wider uppercase shadow-sm">
              <span className="size-2 rounded-full bg-emerald-600" />
              <span>Gemma 3 · Context Engine Active</span>
            </span>
            <h1 className="mt-2 font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#1F1E1D]">
              {greeting()}, <span className="italic font-serif text-[#D96B27]">Abhishek</span>
            </h1>
            <p className="mt-1 text-sm text-[#706E68]">
              Here is what matters right now based on your stored memory profile.
            </p>
          </div>
        </div>

        {/* Proactive AI Callout */}
        <div className="rounded-xl border border-[#E5E3DC] bg-[#FFFFFF] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="grid size-8 place-items-center rounded-md bg-[#F3F1EC] text-[#D96B27] shrink-0 text-sm mt-0.5 border border-[#E5E3DC]">
              ✦
            </span>
            <div>
              <p className="font-mono text-[11px] font-semibold text-[#D96B27] uppercase tracking-wider">
                I noticed something
              </p>
              <p className="mt-0.5 text-xs text-[#44423E] leading-relaxed">
                Your DBMS exam on Friday is your closest deadline, and Normalization is marked as a difficult topic.
              </p>
            </div>
          </div>
          <button
            onClick={() => setPlanModalOpen(true)}
            className="shrink-0 flex items-center justify-center gap-1.5 rounded-md bg-[#D96B27] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#C25E1F] transition-colors"
          >
            <Clock className="size-3.5" />
            <span>Plan my day</span>
          </button>
        </div>

        {/* Context Active Notification */}
        {!contextUpdatedDismissed && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-emerald-700 font-bold text-sm">✦</span>
              <p className="text-xs text-emerald-950 truncate">
                <strong className="font-mono text-[11px] font-semibold text-emerald-900 uppercase tracking-wider mr-1">Memory Active:</strong> {memories.length} personal context memories loaded. Saarthi calibrated your daily focus.
              </p>
            </div>
            <button
              onClick={() => setContextUpdatedDismissed(true)}
              className="text-xs text-emerald-800 hover:text-emerald-950 shrink-0 font-medium"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Top Split: Saarthi's Take & Your Context */}
        <div className="grid gap-5 md:grid-cols-[1.6fr_1fr]">
          {/* Saarthi's Take Card */}
          <section className="rounded-xl border border-[#E5E3DC] bg-[#FFFFFF] p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E3DC]">
                <p className="font-mono text-xs font-semibold tracking-wider text-[#D96B27] uppercase flex items-center gap-1.5">
                  <span>✦</span> Saarthi&apos;s Take
                </p>
                <button
                  onClick={loadTake}
                  disabled={loadingTake}
                  className="text-xs text-[#706E68] hover:text-[#1F1E1D] flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className={`size-3 ${loadingTake ? "animate-spin" : ""}`} />
                  <span>Refresh</span>
                </button>
              </div>

              <div className="mt-4">
                <p className="font-serif text-xl sm:text-2xl font-normal text-[#1F1E1D] leading-snug">
                  {take?.recommendation || "DBMS revision should be your priority today."}
                </p>
                <p className="mt-1.5 text-xs text-[#706E68] leading-relaxed">
                  {take?.summary || "You have three things competing for your attention today."}
                </p>
              </div>

              {/* Priority Engine Rankings */}
              <div className="mt-5 space-y-2">
                {(take?.priorities || [
                  { rank: "01", title: "DBMS Revision (Normalization)", urgency: "HIGH", category: "event" },
                  { rank: "02", title: "Project Work", urgency: "MEDIUM", category: "task" },
                  { rank: "03", title: "DSA Practice (Dynamic Programming)", urgency: "LOW", category: "goal" },
                ]).map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border border-[#E5E3DC] bg-[#FAF9F5] p-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-[#D96B27]">{p.rank}</span>
                      <span className="font-medium text-[#1F1E1D]">{p.title}</span>
                    </div>
                    <span
                      className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                        p.urgency === "HIGH"
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : p.urgency === "MEDIUM"
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      }`}
                    >
                      {p.urgency}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E5E3DC] flex items-center justify-between gap-3">
              <button
                onClick={() => setActiveDrawer("whyThis")}
                className="flex items-center gap-1.5 rounded-md border border-[#E5E3DC] bg-[#FAF9F5] px-3.5 py-1.5 text-xs font-medium text-[#1F1E1D] hover:bg-[#F3F1EC] transition-colors"
              >
                <HelpCircle className="size-3.5 text-[#D96B27]" />
                <span>Why this?</span>
              </button>

              <button
                onClick={() => setPlanModalOpen(true)}
                className="flex items-center gap-1.5 rounded-md bg-[#D96B27] px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#C25E1F] transition-colors"
              >
                <Clock className="size-3.5" />
                <span>Plan my day</span>
              </button>
            </div>
          </section>

          {/* Your Context Card */}
          <section className="rounded-xl border border-[#E5E3DC] bg-[#FFFFFF] p-6 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold tracking-wider text-[#706E68] uppercase pb-3 border-b border-[#E5E3DC]">
                Your Context
              </p>

              <div className="mt-4 space-y-2.5">
                {/* Goals */}
                <button
                  onClick={() => setActiveDrawer("goals")}
                  className="w-full flex items-center justify-between rounded-lg border border-[#E5E3DC] bg-[#FAF9F5] p-3 text-left hover:border-[#D1CEBE] hover:bg-[#F3F1EC] transition-colors group"
                >
                  <div className="flex items-center gap-2.5 text-xs font-medium text-[#1F1E1D]">
                    <Target className="size-4 text-[#D96B27]" />
                    <span>Goals</span>
                  </div>
                  <span className="font-mono text-xs text-[#706E68] group-hover:text-[#1F1E1D]">
                    {goalsCount} active →
                  </span>
                </button>

                {/* Weaknesses */}
                <button
                  onClick={() => setActiveDrawer("weaknesses")}
                  className="w-full flex items-center justify-between rounded-lg border border-[#E5E3DC] bg-[#FAF9F5] p-3 text-left hover:border-[#D1CEBE] hover:bg-[#F3F1EC] transition-colors group"
                >
                  <div className="flex items-center gap-2.5 text-xs font-medium text-[#1F1E1D]">
                    <AlertTriangle className="size-4 text-[#C2410C]" />
                    <span>Weaknesses</span>
                  </div>
                  <span className="font-mono text-xs text-[#706E68] group-hover:text-[#1F1E1D]">
                    {weaknessesCount} identified →
                  </span>
                </button>

                {/* Upcoming */}
                <button
                  onClick={() => setActiveDrawer("events")}
                  className="w-full flex items-center justify-between rounded-lg border border-[#E5E3DC] bg-[#FAF9F5] p-3 text-left hover:border-[#D1CEBE] hover:bg-[#F3F1EC] transition-colors group"
                >
                  <div className="flex items-center gap-2.5 text-xs font-medium text-[#1F1E1D]">
                    <Calendar className="size-4 text-[#D96B27]" />
                    <span>Upcoming</span>
                  </div>
                  <span className="font-mono text-xs text-[#706E68] group-hover:text-[#1F1E1D]">
                    {upcomingCount} events →
                  </span>
                </button>

                {/* Preferences */}
                <button
                  onClick={() => setActiveDrawer("preferences")}
                  className="w-full flex items-center justify-between rounded-lg border border-[#E5E3DC] bg-[#FAF9F5] p-3 text-left hover:border-[#D1CEBE] hover:bg-[#F3F1EC] transition-colors group"
                >
                  <div className="flex items-center gap-2.5 text-xs font-medium text-[#1F1E1D]">
                    <Sliders className="size-4 text-[#706E68]" />
                    <span>Preferences</span>
                  </div>
                  <span className="font-mono text-xs text-[#706E68] group-hover:text-[#1F1E1D]">
                    {preferencesCount} remembered →
                  </span>
                </button>
              </div>
            </div>

            <Link
              href="/memories"
              className="mt-5 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-[#D96B27] hover:text-[#C25E1F] transition-colors"
            >
              <span>Explore full context &amp; graph</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </section>
        </div>

        {/* Plan My Day Schedule Preview Card */}
        <section className="rounded-xl border border-[#E5E3DC] bg-[#FFFFFF] p-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E3DC]">
            <div>
              <h2 className="text-xs font-bold tracking-wider text-[#D96B27] uppercase flex items-center gap-2">
                <Clock className="size-3.5" />
                <span>Plan My Day</span>
              </h2>
              <p className="mt-0.5 text-xs text-[#706E68]">
                {planSummary || "Schedule designed around your exam, DSA target, and night study routine."}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={loadPlan}
                disabled={loadingPlan}
                className="flex items-center gap-1.5 rounded-md border border-[#E5E3DC] bg-[#FAF9F5] px-3 py-1.5 text-xs text-[#706E68] hover:text-[#1F1E1D] hover:bg-[#F3F1EC] transition-colors"
              >
                <RefreshCw className={`size-3 ${loadingPlan ? "animate-spin" : ""}`} />
                <span>Regenerate</span>
              </button>
              <button
                onClick={() => setPlanModalOpen(true)}
                className="rounded-md border border-[#E5E3DC] bg-[#FFFFFF] px-3 py-1.5 text-xs font-medium text-[#1F1E1D] hover:bg-[#F8F7F4] transition-colors"
              >
                View Full
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {plan.slice(0, 4).map((p, i) => (
              <div
                key={i}
                className="rounded-lg border border-[#E5E3DC] bg-[#FAF9F5] p-3.5 text-xs flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-[#D96B27] font-semibold text-[11px] block mb-1">
                    {p.time} ({p.duration})
                  </span>
                  <p className="font-semibold text-[#1F1E1D]">{p.title}</p>
                </div>
                {p.note && <p className="mt-2 text-[11px] text-[#706E68] leading-tight">{p.note}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Natural Language Memory Extraction Input */}
        <SmartExtractionCard onMemoriesSaved={loadMemories} />

        {/* Ask Saarthi Input Box */}
        <section className="rounded-xl border border-[#E5E3DC] bg-[#FFFFFF] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#706E68] flex items-center gap-1.5">
              <span className="text-[#D96B27]">✦</span> Ask Saarthi
            </h2>
            <span className="text-xs font-mono text-[#8C8980]">
              Gemma references your stored context
            </span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk(q);
            }}
            className="flex items-end gap-3 rounded-lg border border-[#E5E3DC] bg-[#FAF9F5] p-3 focus-within:border-[#D96B27] focus-within:ring-1 focus-within:ring-[#D96B27] transition-all"
          >
            <textarea
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAsk(q);
                }
              }}
              rows={2}
              placeholder="Ask anything (e.g. 'What should I focus on today?')..."
              className="flex-1 resize-none bg-transparent text-sm text-[#1F1E1D] outline-none placeholder:text-[#8C8980]"
            />
            <button
              type="submit"
              disabled={!q.trim()}
              aria-label="Send"
              className="grid size-8 place-items-center rounded-md bg-[#D96B27] text-white shadow-sm hover:bg-[#C25E1F] disabled:opacity-30 transition-colors"
            >
              <ArrowUp className="size-4" />
            </button>
          </form>

          {/* Quick Suggestions */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#706E68] mr-1">Suggested:</span>
            {SUGGESTIONS.slice(0, 3).map((s) => (
              <button
                key={s}
                onClick={() => handleAsk(s)}
                className="rounded-md border border-[#E5E3DC] bg-[#FAF9F5] px-2.5 py-1 text-xs text-[#706E68] hover:text-[#1F1E1D] hover:border-[#D1CEBE] transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        {/* Recent Context Pills */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#706E68]">
              Recent Context
            </h2>
            <Link
              href="/memories"
              className="text-xs text-[#D96B27] hover:text-[#C25E1F] transition-colors"
            >
              View all memories ({memories.length}) →
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            {memories.slice(0, 6).map((m) => (
              <span
                key={m._id || m.id}
                className="inline-flex items-center gap-1.5 rounded-md border border-[#E5E3DC] bg-[#FFFFFF] px-3 py-1.5 text-xs text-[#1F1E1D] shadow-sm"
              >
                <span className="text-[#D96B27]">✦</span>
                <span className="font-medium">{m.content}</span>
                <span className="text-[10px] font-mono text-[#8C8980]">({m.category})</span>
              </span>
            ))}
          </div>
        </section>
      </main>

      {/* Context Drawers */}
      <ContextDrawer
        type={activeDrawer}
        onClose={() => setActiveDrawer(null)}
        memories={memories}
        whyThisData={take?.whyThis}
      />

      {/* Plan My Day Full Modal */}
      <PlanDayModal
        open={planModalOpen}
        onOpenChange={setPlanModalOpen}
        initialPlan={plan}
        initialSummary={planSummary}
      />
    </div>
  );
}
