"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CATEGORY_META, type Category, type Memory } from "@/lib/saarthi";
import { CategoryIcon } from "@/components/CategoryIcon";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const IMPORTANCE_LABELS: Record<number, string> = {
  1: "1 · Low",
  2: "2 · Normal",
  3: "3 · Important",
  4: "4 · High Priority",
  5: "5 · Critical",
};

export function AddMemoryModal({
  open,
  onOpenChange,
  editing,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  editing?: Memory | null;
  onSuccess?: () => void;
}) {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<Category>("goal");
  const [importance, setImportance] = useState(3);
  const [confidence, setConfidence] = useState(0.95);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setContent(editing?.content ?? "");
      setCategory(editing?.category ?? "goal");
      setImportance(editing?.importance ?? 3);
      setConfidence(editing?.confidence ?? 0.95);
      setSubmitting(false);
    }
  }, [open, editing]);

  const submit = async () => {
    if (!content.trim() || submitting) return;
    setSubmitting(true);

    try {
      if (editing && (editing._id || editing.id)) {
        const id = editing._id || editing.id!;
        const res = await fetch(`/api/memories/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: content.trim(),
            category,
            importance,
            confidence,
          }),
        });
        if (!res.ok) throw new Error("Failed to update memory");
        toast.success("Memory updated");
      } else {
        const res = await fetch("/api/memories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: content.trim(),
            category,
            importance,
            confidence,
            source: "explicit",
          }),
        });
        if (!res.ok) throw new Error("Failed to store memory");
        toast.success("Memory saved to store");
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.message || "Failed to save memory");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-xl border border-[#E5E3DC] bg-[#FFFFFF] text-[#1F1E1D] sm:max-w-md p-6 shadow-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl font-normal text-[#1F1E1D] flex items-center gap-2">
            <span className="text-[#D96B27] font-serif">✦</span>
            <span>{editing ? "Review / Edit Memory" : "Add Memory"}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#706E68] uppercase tracking-wider">
              What should Saarthi remember?
            </label>
            <textarea
              autoFocus
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="e.g. I have a DBMS exam next Friday..."
              rows={3}
              className="w-full resize-none rounded-lg border border-[#E5E3DC] bg-[#FAF9F5] p-3 text-sm text-[#1F1E1D] placeholder:text-[#8C8980] outline-none focus:border-[#D96B27] focus:ring-1 focus:ring-[#D96B27] transition-all"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#706E68] uppercase tracking-wider">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(CATEGORY_META) as Category[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={cn(
                    "flex items-center gap-2 rounded-md border py-2 px-2.5 text-xs transition-colors",
                    category === c
                      ? "border-[#D96B27] bg-[#D96B27] text-white font-medium shadow-sm"
                      : "border-[#E5E3DC] bg-[#FAF9F5] text-[#706E68] hover:text-[#1F1E1D] hover:bg-[#F3F1EC]"
                  )}
                >
                  <CategoryIcon category={c} className="size-3.5" />
                  <span className="truncate">{CATEGORY_META[c].label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#706E68] uppercase tracking-wider">
                Importance Level
              </label>
              <span className="text-xs text-[#D96B27] font-mono">
                {IMPORTANCE_LABELS[importance]}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`Importance ${n}`}
                  onClick={() => setImportance(n)}
                  className={cn(
                    "flex-1 py-1.5 rounded-md border text-xs font-medium transition-colors text-center font-mono",
                    n <= importance
                      ? "border-[#D96B27] bg-[#D96B27]/15 text-[#9A3412]"
                      : "border-[#E5E3DC] text-[#8C8980] hover:border-[#D1CEBE] hover:text-[#1F1E1D]"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={submit}
            disabled={!content.trim() || submitting}
            className="w-full flex items-center justify-center gap-2 rounded-md bg-[#D96B27] py-2.5 text-sm font-semibold text-white hover:bg-[#C25E1F] transition-colors disabled:opacity-40 shadow-sm"
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Saving...
              </>
            ) : editing ? (
              "Save Changes"
            ) : (
              "Remember This"
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
