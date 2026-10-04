import { MoreVertical, Pencil, Trash2, CheckCircle2 } from "lucide-react";
import { CATEGORY_META } from "@/lib/saarthi";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Memory } from "@/types/memory";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MemoryCard({
  m,
  compact,
  onEdit,
  onDelete,
}: {
  m: Memory;
  compact?: boolean;
  onEdit?: (m: Memory) => void;
  onDelete?: (id: string) => void;
}) {
  const id = m._id || m.id || "";
  const categoryInfo = CATEGORY_META[m.category] || { label: "Other", key: "other" };
  const confidence = m.confidence ?? 0.95;
  const confidenceLabel = confidence >= 0.9 ? "HIGH" : confidence >= 0.75 ? "MEDIUM" : "LOW";
  const confidenceDots = Math.round(confidence * 5);
  const isCompleted = m.status === "completed";

  return (
    <div className={`relative flex flex-col justify-between rounded-lg border p-4 transition-colors group ${
      isCompleted
        ? "border-emerald-200 bg-emerald-50/40 opacity-80"
        : "border-[#E5E3DC] bg-[#FFFFFF] hover:border-[#D1CEBE] shadow-sm"
    }`}>
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded bg-[#F3F1EC] text-[#D96B27] border border-[#E5E3DC]">
              <CategoryIcon category={m.category} className="size-3" />
            </span>
            <span className="text-xs font-medium text-[#706E68]">
              {categoryInfo.label}
            </span>
            {isCompleted && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                <CheckCircle2 className="size-2.5" /> Completed
              </span>
            )}
          </div>

          {!compact && (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="rounded-md p-1 text-[#8C8980] hover:text-[#1F1E1D] hover:bg-[#F3F1EC] transition-colors"
                aria-label="Memory options"
              >
                <MoreVertical className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-lg border border-[#E5E3DC] bg-[#FFFFFF] shadow-md text-[#1F1E1D]">
                {onEdit && (
                  <DropdownMenuItem
                    onClick={() => onEdit(m)}
                    className="cursor-pointer gap-2 text-xs text-[#706E68] hover:text-[#1F1E1D] hover:bg-[#F8F7F4]"
                  >
                    <Pencil className="size-3.5" /> Review / Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={() => onDelete(id)}
                    className="cursor-pointer gap-2 text-xs text-red-600 focus:text-red-700 focus:bg-red-50"
                  >
                    <Trash2 className="size-3.5" /> Remove
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <p className={`mt-3 text-sm font-medium leading-snug ${isCompleted ? "line-through text-[#8C8980]" : "text-[#1F1E1D]"}`}>
          {m.content}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-[#E5E3DC] flex items-center justify-between text-[11px] text-[#706E68]">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-[#8C8980]">
            {m.source === "inferred" ? "Inferred by Saarthi" : "User said this"}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-[#8C8980]">Confidence</span>
          <span className={`font-mono text-[10px] font-semibold ${
            confidenceLabel === "HIGH" ? "text-[#D96B27]" : "text-[#B45309]"
          }`}>
            {confidenceLabel}
          </span>
          <div className="flex items-center gap-0.5 ml-1">
            {[1, 2, 3, 4, 5].map((d) => (
              <span
                key={d}
                className={`size-1 rounded-full ${
                  d <= confidenceDots ? "bg-[#D96B27]" : "bg-[#E5E3DC]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
