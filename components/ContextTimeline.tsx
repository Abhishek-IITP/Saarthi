"use client";

import { Memory } from "@/types/memory";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CheckCircle2, Clock } from "lucide-react";

export function ContextTimeline({ memories }: { memories: Memory[] }) {
  const sorted = [...memories].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const displayItems = sorted.slice(-6);

  return (
    <div className="rounded-xl border border-[#E5E3DC] bg-[#FFFFFF] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-serif text-xl font-normal text-[#1F1E1D] flex items-center gap-2">
            <Clock className="size-4 text-[#D96B27]" />
            <span>Your Journey</span>
          </h3>
          <p className="text-xs text-[#706E68] mt-0.5">
            How your context has built up chronologically over time.
          </p>
        </div>
        <span className="font-mono text-xs text-[#706E68] bg-[#F3F1EC] px-2.5 py-1 rounded-md border border-[#E5E3DC]">
          {memories.length} milestones
        </span>
      </div>

      <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-[#E5E3DC]">
        {displayItems.map((m, idx) => {
          const isLatest = idx === displayItems.length - 1;
          const dateStr = new Date(m.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
          const isCompleted = m.status === "completed";

          return (
            <div key={m._id || m.id || idx} className="relative group">
              {/* Dot */}
              <div
                className={`absolute -left-[1.85rem] top-1 size-3 rounded-full border-2 border-[#FFFFFF] transition-transform group-hover:scale-125 ${
                  isLatest
                    ? "bg-[#D96B27] ring-2 ring-[#D96B27]/20"
                    : isCompleted
                    ? "bg-emerald-600"
                    : "bg-[#8C8980]"
                }`}
              />

              <div className="rounded-lg border border-[#E5E3DC] bg-[#FAF9F5] p-3.5 hover:border-[#D1CEBE] transition-colors">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#706E68] mb-1">
                  <span className="font-semibold text-[#D96B27] uppercase tracking-wider">
                    {isLatest ? "RECENT" : dateStr}
                  </span>
                  <span className="capitalize">{m.category}</span>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="grid size-5 place-items-center rounded bg-[#F3F1EC] text-[#D96B27] border border-[#E5E3DC] shrink-0 mt-0.5">
                    <CategoryIcon category={m.category} className="size-3" />
                  </span>
                  <div className="text-xs font-medium text-[#1F1E1D] leading-relaxed">
                    {m.content}
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 ml-2 font-mono bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                        <CheckCircle2 className="size-2.5" /> Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
