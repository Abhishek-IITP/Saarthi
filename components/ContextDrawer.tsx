"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Memory } from "@/types/memory";
import { Target, AlertTriangle, Calendar, Sliders } from "lucide-react";

export type DrawerType = "goals" | "weaknesses" | "events" | "preferences" | "whyThis" | null;

export function ContextDrawer({
  type,
  onClose,
  memories,
  whyThisData,
}: {
  type: DrawerType;
  onClose: () => void;
  memories: Memory[];
  whyThisData?: {
    title: string;
    points: string[];
    memoriesReferenced: string[];
  };
}) {
  if (!type) return null;

  const goals = memories.filter((m) => m.category === "goal");
  const weaknesses = memories.filter((m) => m.category === "weakness");
  const events = memories.filter((m) => m.category === "event");
  const preferences = memories.filter((m) => m.category === "preference");

  return (
    <Dialog open={!!type} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="rounded-xl border border-[#E5E3DC] bg-[#FFFFFF] text-[#1F1E1D] sm:max-w-md p-6 shadow-lg">
        {/* Goals Drawer */}
        {type === "goals" && (
          <div>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-serif text-xl font-normal text-[#1F1E1D]">
                <Target className="size-4 text-[#D96B27]" />
                <span>Active Goals ({goals.length})</span>
              </DialogTitle>
            </DialogHeader>

            <div className="mt-4 space-y-2.5">
              {goals.length === 0 ? (
                <p className="text-xs text-[#706E68]">No active goals stored yet.</p>
              ) : (
                goals.map((g, i) => (
                  <div key={g._id || i} className="rounded-lg border border-[#E5E3DC] bg-[#FAF9F5] p-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#1F1E1D]">{g.content}</span>
                      <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        Active
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-[#706E68]">
                      <span>Confidence</span>
                      <span className="text-[#D96B27] font-mono tracking-widest">●●●●○</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Weaknesses Drawer */}
        {type === "weaknesses" && (
          <div>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-serif text-xl font-normal text-[#1F1E1D]">
                <AlertTriangle className="size-4 text-[#C2410C]" />
                <span>Identified Weaknesses ({weaknesses.length})</span>
              </DialogTitle>
            </DialogHeader>

            <div className="mt-4 space-y-2.5">
              {weaknesses.length === 0 ? (
                <p className="text-xs text-[#706E68]">No weak areas detected yet.</p>
              ) : (
                weaknesses.map((w, i) => (
                  <div key={w._id || i} className="rounded-lg border border-[#E5E3DC] bg-[#FAF9F5] p-3 text-xs">
                    <div className="flex items-start justify-between">
                      <span className="font-semibold text-[#1F1E1D]">{w.content}</span>
                      <span className="text-[10px] font-mono text-[#706E68] bg-[#F3F1EC] border border-[#E5E3DC] px-1.5 py-0.5 rounded">
                        {w.source === "inferred" ? "Inferred" : "Mentioned"}
                      </span>
                    </div>
                    <p className="mt-2 text-[11px] text-[#706E68] leading-relaxed">
                      Saarthi factors this in to recommend extra revision before exams.
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Upcoming Drawer */}
        {type === "events" && (
          <div>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-serif text-xl font-normal text-[#1F1E1D]">
                <Calendar className="size-4 text-[#D96B27]" />
                <span>Upcoming Deadlines &amp; Events ({events.length})</span>
              </DialogTitle>
            </DialogHeader>

            <div className="mt-4 space-y-2.5">
              {events.length === 0 ? (
                <p className="text-xs text-[#706E68]">Nothing urgent scheduled right now.</p>
              ) : (
                events.map((e, i) => {
                  const isCompleted = e.status === "completed";
                  return (
                    <div key={e._id || i} className="rounded-lg border border-[#E5E3DC] bg-[#FAF9F5] p-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${isCompleted ? "line-through text-[#8C8980]" : "text-[#1F1E1D]"}`}>
                          {e.content}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          isCompleted
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}>
                          {isCompleted ? "Completed" : "Upcoming"}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Preferences Drawer */}
        {type === "preferences" && (
          <div>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-serif text-xl font-normal text-[#1F1E1D]">
                <Sliders className="size-4 text-[#706E68]" />
                <span>Preferences &amp; Habits ({preferences.length})</span>
              </DialogTitle>
            </DialogHeader>

            <div className="mt-4 space-y-2.5">
              {preferences.length === 0 ? (
                <p className="text-xs text-[#706E68]">No personal preferences logged yet.</p>
              ) : (
                preferences.map((p, i) => (
                  <div key={p._id || i} className="rounded-lg border border-[#E5E3DC] bg-[#FAF9F5] p-3 text-xs">
                    <span className="font-medium text-[#1F1E1D]">{p.content}</span>
                    <span className="block mt-1 text-[10px] font-mono text-[#706E68]">
                      Used to shape daily scheduling and focus blocks.
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Why This Drawer */}
        {type === "whyThis" && (
          <div>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base font-bold text-[#1F1E1D]">
                <span className="text-[#D96B27]">✦</span>
                <span>Why I Recommended This</span>
              </DialogTitle>
            </DialogHeader>

            <div className="mt-4 space-y-3 text-xs">
              <p className="text-[#706E68]">
                Saarthi connected your stored memories to Gemma 3&apos;s reasoning engine:
              </p>

              <div className="rounded-lg border border-[#E5E3DC] bg-[#FAF9F5] p-3.5 space-y-2">
                {(whyThisData?.points || [
                  "DBMS exam is scheduled for this Friday (closest deadline).",
                  "You noted DBMS Normalization is confusing for you (weakness).",
                  "You focus best at night, so keeping the evening for deep study.",
                ]).map((pt, i) => (
                  <div key={i} className="flex items-start gap-2 text-[#1F1E1D]">
                    <span className="text-[#D96B27] font-bold">•</span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-md bg-[#F3F1EC] border border-[#E5E3DC] p-3 text-[11px] text-[#57534E] font-mono">
                Pipeline: Memory Store → Gemma 3 Priority Engine → Daily Take
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
