"use client";

import { Plus, Search, Database, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { MemoryCard } from "@/components/MemoryCard";
import { AddMemoryModal } from "@/components/AddMemoryModal";
import { SmartExtractionCard } from "@/components/SmartExtractionCard";
import { ContextTimeline } from "@/components/ContextTimeline";
import { ContextGraph } from "@/components/ContextGraph";
import { type Category, type Memory, apiFetchMemories, apiDeleteMemory, apiSeedDemoMemories } from "@/lib/saarthi";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const filters: { key: "all" | Category; label: string }[] = [
  { key: "all", label: "All" },
  { key: "goal", label: "Goals" },
  { key: "weakness", label: "Weaknesses" },
  { key: "event", label: "Events" },
  { key: "preference", label: "Preferences" },
  { key: "task", label: "Tasks" },
  { key: "personal", label: "Personal" },
];

export default function Memories() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | Category>("all");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Memory | null>(null);
  const [seeding, setSeeding] = useState(false);

  const loadMemories = async () => {
    setLoading(true);
    try {
      const data = await apiFetchMemories({
        category: filter,
        q: search.trim() || undefined,
      });
      setMemories(data.memories || []);
    } catch {
      toast.error("Failed to load memories from MongoDB");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMemories();
  }, [filter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadMemories();
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (id: string) => {
    try {
      await apiDeleteMemory(id);
      setMemories((prev) => prev.filter((m) => (m._id || m.id) !== id));
      toast.success("Memory removed");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete memory");
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await apiSeedDemoMemories();
      if (res.success) {
        toast.success(`Seeded ${res.count || 12} demo memories`);
        await loadMemories();
      } else {
        toast.error(res.error || "Failed to seed demo data");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to seed demo data");
    } finally {
      setSeeding(false);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setOpen(true);
  };

  const goalsCount = memories.filter((m) => m.category === "goal").length;
  const weaknessesCount = memories.filter((m) => m.category === "weakness").length;
  const upcomingCount = memories.filter((m) => m.category === "event" && m.status === "active").length;

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1F1E1D]">
      <Navbar />

      <main className="mx-auto max-w-5xl px-5 pb-32 pt-8 space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md border border-[#E5E3DC] bg-[#FFFFFF] px-2.5 py-1 font-mono text-xs text-[#706E68]">
              <span className="size-2 rounded-full bg-emerald-600" />
              <span>Persistent Memory Store</span>
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#1F1E1D] sm:text-4xl">
              What Saarthi Knows
            </h1>
            <p className="mt-1 text-sm text-[#706E68]">
              Your personal context, built over time from everyday conversations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSeed}
              disabled={seeding}
              title="Reset with 12 standard demo memories"
              className="flex items-center gap-1.5 rounded-md border border-[#E5E3DC] bg-[#FFFFFF] px-3 py-2 text-xs font-medium text-[#706E68] hover:text-[#1F1E1D] hover:bg-[#F8F7F4] transition-colors shadow-sm"
            >
              <Database className="size-3.5 text-[#D96B27]" />
              <span>{seeding ? "Seeding..." : "Load Demo Data"}</span>
            </button>

            <button
              onClick={openAdd}
              className="flex items-center gap-1.5 rounded-md bg-[#D96B27] px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-[#C25E1F] transition-colors"
            >
              <Plus className="size-4" />
              <span>Add Memory</span>
            </button>
          </div>
        </div>

        {/* Context Summary Compact Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-lg border border-[#E5E3DC] bg-[#FFFFFF] p-4 text-center shadow-sm">
            <span className="text-2xl font-bold font-mono text-[#1F1E1D] block">
              {memories.length}
            </span>
            <span className="text-xs text-[#706E68] uppercase tracking-wider font-semibold">
              Memories
            </span>
          </div>

          <div className="rounded-lg border border-[#E5E3DC] bg-[#FFFFFF] p-4 text-center shadow-sm">
            <span className="text-2xl font-bold font-mono text-[#D96B27] block">
              {goalsCount}
            </span>
            <span className="text-xs text-[#706E68] uppercase tracking-wider font-semibold">
              Goals
            </span>
          </div>

          <div className="rounded-lg border border-[#E5E3DC] bg-[#FFFFFF] p-4 text-center shadow-sm">
            <span className="text-2xl font-bold font-mono text-[#C2410C] block">
              {weaknessesCount}
            </span>
            <span className="text-xs text-[#706E68] uppercase tracking-wider font-semibold">
              Weaknesses
            </span>
          </div>

          <div className="rounded-lg border border-[#E5E3DC] bg-[#FFFFFF] p-4 text-center shadow-sm">
            <span className="text-2xl font-bold font-mono text-emerald-700 block">
              {upcomingCount}
            </span>
            <span className="text-xs text-[#706E68] uppercase tracking-wider font-semibold">
              Upcoming
            </span>
          </div>
        </div>

        {/* Smart Extraction Bar */}
        <SmartExtractionCard onMemoriesSaved={loadMemories} />

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8C8980]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search memories (e.g. 'DBMS', 'exam', 'DP', 'workout')..."
              className="w-full rounded-lg border border-[#E5E3DC] bg-[#FFFFFF] pl-10 pr-4 py-2 text-sm text-[#1F1E1D] outline-none placeholder:text-[#8C8980] focus:border-[#D96B27] focus:ring-1 focus:ring-[#D96B27] transition-all shadow-sm"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  filter === f.key
                    ? "bg-[#D96B27] text-white shadow-sm"
                    : "border border-[#E5E3DC] bg-[#FFFFFF] text-[#706E68] hover:text-[#1F1E1D] hover:bg-[#F8F7F4]"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Memory Grid */}
        {loading ? (
          <div className="rounded-xl border border-[#E5E3DC] bg-[#FFFFFF] py-20 text-center text-xs text-[#706E68] shadow-sm">
            <Loader2 className="size-5 animate-spin mx-auto mb-2 text-[#D96B27]" />
            Loading memories from local store...
          </div>
        ) : memories.length === 0 ? (
          <div className="rounded-xl border border-[#E5E3DC] bg-[#FFFFFF] p-12 text-center shadow-sm">
            <p className="text-base font-semibold text-[#1F1E1D]">No memories found matching query.</p>
            <p className="mx-auto mt-1 max-w-sm text-xs text-[#706E68]">
              Tell Saarthi what you are working on, or load the 12 demo memories.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <button
                onClick={openAdd}
                className="rounded-md bg-[#D96B27] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#C25E1F] transition-colors"
              >
                Add Memory
              </button>
              <button
                onClick={handleSeed}
                className="rounded-md border border-[#E5E3DC] bg-[#FFFFFF] px-4 py-2 text-xs font-medium text-[#1F1E1D] hover:bg-[#F8F7F4] transition-colors"
              >
                Load Demo Memories
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {memories.map((m) => (
              <MemoryCard
                key={m._id || m.id}
                m={m}
                onEdit={(mm) => {
                  setEditing(mm);
                  setOpen(true);
                }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Context Graph */}
        <ContextGraph />

        {/* Memory Timeline ("Your journey") */}
        <ContextTimeline memories={memories} />
      </main>

      <AddMemoryModal
        open={open}
        onOpenChange={setOpen}
        editing={editing}
        onSuccess={loadMemories}
      />
    </div>
  );
}
