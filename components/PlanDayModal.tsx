"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlanItem } from "@/types/memory";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

export function PlanDayModal({
  open,
  onOpenChange,
  initialPlan,
  initialSummary,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPlan: PlanItem[];
  initialSummary?: string;
}) {
  const [plan, setPlan] = useState<PlanItem[]>(initialPlan);
  const [summary, setSummary] = useState(initialSummary || "");
  const [regenerating, setRegenerating] = useState(false);

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const res = await fetch("/api/plan", { method: "POST" });
      const data = await res.json();
      if (data.schedule && data.schedule.length > 0) {
        setPlan(data.schedule);
        setSummary(data.summary || "");
        toast.success("✦ Daily schedule updated with Gemma 3");
      }
    } catch {
      toast.error("Failed to regenerate plan");
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-xl border border-[#E5E3DC] bg-[#FFFFFF] text-[#1F1E1D] sm:max-w-lg p-6 shadow-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-[#1F1E1D]">
              <span className="text-[#D96B27]">✦</span>
              <span>Your Plan for Today</span>
            </DialogTitle>
            <button
              onClick={handleRegenerate}
              disabled={regenerating}
              className="flex items-center gap-1.5 rounded-md border border-[#E5E3DC] bg-[#FAF9F5] px-3 py-1 text-xs text-[#706E68] hover:text-[#1F1E1D] hover:bg-[#F3F1EC] transition-colors disabled:opacity-40"
            >
              <RefreshCw className={`size-3 ${regenerating ? "animate-spin" : ""}`} />
              <span>Regenerate</span>
            </button>
          </div>
        </DialogHeader>

        {summary && (
          <p className="mt-2 text-xs text-[#57534E] bg-[#FAF9F5] p-3 rounded-lg border border-[#E5E3DC] leading-relaxed">
            {summary}
          </p>
        )}

        <div className="mt-4 space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {plan.map((item, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-[#E5E3DC] bg-[#FAF9F5] p-3.5 text-xs hover:border-[#D1CEBE] transition-colors"
            >
              <div className="flex items-center justify-between text-[#D96B27] font-mono text-[11px] mb-1">
                <span className="font-semibold">{item.time}</span>
                <span className="text-[#706E68]">{item.duration}</span>
              </div>
              <p className="font-semibold text-[#1F1E1D] text-sm">{item.title}</p>
              {item.note && (
                <p className="mt-1 text-xs text-[#706E68]">{item.note}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-[#E5E3DC] pt-3 text-[11px] text-[#8C8980] text-center">
          Gemma 3 respects your night study habit and evening workout routine.
        </div>
      </DialogContent>
    </Dialog>
  );
}
