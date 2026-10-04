import { Memory, MemoryCategory, MemorySource, MemoryStatus } from "@/types/memory";

export type { Memory, MemorySource, MemoryStatus };
export type Category = MemoryCategory;

export const CATEGORY_META: Record<Category, { label: string; key: Category }> = {
  goal: { label: "Goal", key: "goal" },
  weakness: { label: "Weakness", key: "weakness" },
  event: { label: "Event", key: "event" },
  preference: { label: "Preference", key: "preference" },
  task: { label: "Task", key: "task" },
  personal: { label: "Personal", key: "personal" },
  study: { label: "Study", key: "study" },
  other: { label: "Other", key: "other" },
};

export function timeAgo(t: string | number | Date): string {
  const dateNum = typeof t === "string" ? new Date(t).getTime() : typeof t === "number" ? t : t.getTime();
  const s = Math.max(0, (Date.now() - dateNum) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  const d = Math.floor(s / 86400);
  return d === 1 ? "yesterday" : `${d}d ago`;
}

export const SUGGESTIONS = [
  "What should I focus on today?",
  "How should I spend my evening?",
  "What are my current priorities?",
  "What do you remember about me?",
  "What should I revise before my exam?",
];

export function greeting(): string {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

// Client API Methods
export async function apiFetchMemories(params?: { category?: string; q?: string }): Promise<{ memories: Memory[]; source: string; error?: string }> {
  try {
    const query = new URLSearchParams();
    if (params?.category && params.category !== "all") query.set("category", params.category);
    if (params?.q) query.set("q", params.q);

    const res = await fetch(`/api/memories?${query.toString()}`, { cache: "no-store" });
    const data = await res.json();
    return {
      memories: data.memories || [],
      source: data.source || "mongodb",
      error: data.error,
    };
  } catch (err: any) {
    return { memories: [], source: "error", error: err.message };
  }
}

export async function apiCreateMemory(data: { content: string; category: Category; importance: number; confidence?: number }): Promise<Memory> {
  const res = await fetch("/api/memories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to create memory");
  }
  return res.json();
}

export async function apiUpdateMemory(id: string, patch: Partial<Memory>): Promise<Memory> {
  const res = await fetch(`/api/memories/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update memory");
  }
  return res.json();
}

export async function apiDeleteMemory(id: string): Promise<boolean> {
  const res = await fetch(`/api/memories/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to delete memory");
  }
  return true;
}

export async function apiAskChat(question: string): Promise<{ answer?: string; error?: string; contextUsed?: string[]; reasoning?: string }> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  const data = await res.json();
  if (!res.ok) {
    return { error: data.error || "Failed to generate answer" };
  }
  return data;
}

export async function apiFetchBrief(): Promise<any> {
  const res = await fetch("/api/brief", { method: "POST" });
  return res.json();
}

export async function apiSeedDemoMemories(): Promise<{ success: boolean; count?: number; error?: string }> {
  const res = await fetch("/api/seed", { method: "POST" });
  return res.json();
}

export async function apiCheckHealth(): Promise<any> {
  try {
    const res = await fetch("/api/health", { cache: "no-store" });
    return await res.json();
  } catch (err: any) {
    return { error: err.message, ollama: { online: false }, mongodb: { connected: false } };
  }
}
