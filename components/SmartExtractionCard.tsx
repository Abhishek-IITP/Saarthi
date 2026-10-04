"use client";

import { useState } from "react";
import { Check, X, Edit3, ArrowRight, Loader2 } from "lucide-react";
import { ExtractedMemory } from "@/types/memory";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CATEGORY_META } from "@/lib/saarthi";
import { toast } from "sonner";

export function SmartExtractionCard({
  onMemoriesSaved,
}: {
  onMemoriesSaved?: () => void;
}) {
  const [input, setInput] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [extracted, setExtracted] = useState<ExtractedMemory[] | null>(null);
  const [reviewingIndex, setReviewingIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const handleExtract = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || extracting) return;

    setExtracting(true);
    setExtracted(null);

    try {
      const res = await fetch("/api/memories/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: input.trim() }),
      });
      const data = await res.json();

      if (data.memories && data.memories.length > 0) {
        setExtracted(data.memories);
      } else {
        toast("No permanent context or goals detected in this statement.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to analyze context.");
    } finally {
      setExtracting(false);
    }
  };

  const handleApproveAll = async () => {
    if (!extracted || extracted.length === 0 || saving) return;
    setSaving(true);

    try {
      for (const m of extracted) {
        if (m.action === "complete" && m.targetMemoryId) {
          await fetch(`/api/memories/${m.targetMemoryId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "completed" }),
          });
        } else if (m.action === "update" && m.targetMemoryId) {
          await fetch(`/api/memories/${m.targetMemoryId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: m.content }),
          });
        } else {
          await fetch("/api/memories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(m),
          });
        }
      }

      toast.success("✦ Context saved to memory store");
      setInput("");
      setExtracted(null);
      onMemoriesSaved?.();
    } catch (err: any) {
      toast.error(err.message || "Failed to save memories");
    } finally {
      setSaving(false);
    }
  };

  const handleIgnore = () => {
    setExtracted(null);
    setInput("");
  };

  return (
    <div className="rounded-xl border border-[#E5E3DC] bg-[#FFFFFF] p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-[#706E68] flex items-center gap-1.5">
          <span className="text-[#D96B27]">✦</span> Tell Saarthi anything
        </label>
        <span className="text-[11px] font-mono text-[#8C8980]">
          Gemma 3 extracts context automatically
        </span>
      </div>

      <form onSubmit={handleExtract} className="relative flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 'I have an exam Friday and normalization is confusing me' or 'Project is done'"
          className="w-full rounded-lg border border-[#E5E3DC] bg-[#FAF9F5] pl-4 pr-24 py-2.5 text-sm text-[#1F1E1D] placeholder:text-[#8C8980] outline-none focus:border-[#D96B27] focus:ring-1 focus:ring-[#D96B27] transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || extracting}
          className="absolute right-1.5 flex items-center gap-1.5 rounded-md bg-[#D96B27] px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-[#C25E1F] disabled:opacity-40 transition-colors"
        >
          {extracting ? (
            <>
              <Loader2 className="size-3 animate-spin" /> Analyzing...
            </>
          ) : (
            <>
              <span>Extract</span>
              <ArrowRight className="size-3" />
            </>
          )}
        </button>
      </form>

      {/* Extracted Approval Card */}
      {extracted && extracted.length > 0 && (
        <div className="mt-4 rounded-lg border border-[#E5E3DC] bg-[#FAF9F5] p-4 animate-rise shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-[#D96B27] flex items-center gap-1.5">
                <span>✦</span> I noticed something worth remembering
              </p>
              <p className="mt-0.5 text-xs text-[#706E68]">
                Saarthi found {extracted.length} {extracted.length === 1 ? "piece" : "pieces"} of context:
              </p>
            </div>
            <span className="font-mono text-[10px] text-[#706E68] bg-[#F3F1EC] border border-[#E5E3DC] px-2 py-0.5 rounded">
              Ready for review
            </span>
          </div>

          <div className="mt-3 space-y-2">
            {extracted.map((m, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-md border border-[#E5E3DC] bg-[#FFFFFF] p-2.5 text-xs shadow-sm"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="grid size-6 place-items-center rounded bg-[#F3F1EC] text-[#D96B27] border border-[#E5E3DC]">
                    <CategoryIcon category={m.category} className="size-3" />
                  </span>
                  <div className="truncate">
                    <span className="font-medium text-[#1F1E1D]">{m.content}</span>
                    <span className="ml-2 font-mono text-[10px] text-[#706E68]">
                      ({CATEGORY_META[m.category]?.label || m.category} · {Math.round((m.confidence || 0.9) * 100)}% confidence)
                    </span>
                    {m.action === "complete" && (
                      <span className="ml-2 text-emerald-700 text-[10px] font-mono">
                        [Marks Completed]
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setReviewingIndex(idx)}
                  className="text-xs text-[#706E68] hover:text-[#1F1E1D] px-2 py-1"
                >
                  <Edit3 className="size-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={handleApproveAll}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-md bg-[#D96B27] px-4 py-2 text-xs font-medium text-white hover:bg-[#C25E1F] transition-colors shadow-sm"
            >
              {saving ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3.5" />}
              <span>{extracted.length > 1 ? "Remember both" : "Remember"}</span>
            </button>

            <button
              onClick={handleIgnore}
              className="flex items-center gap-1.5 rounded-md border border-[#E5E3DC] bg-[#FFFFFF] px-3 py-2 text-xs font-medium text-[#706E68] hover:text-[#1F1E1D] hover:bg-[#F8F7F4] transition-colors"
            >
              <X className="size-3.5" />
              <span>Ignore</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
