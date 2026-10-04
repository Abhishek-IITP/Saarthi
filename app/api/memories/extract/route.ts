import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Memory } from "@/models/Memory";
import { generateJsonWithGemma } from "@/lib/ollama";
import { createMemoryExtractionPrompt } from "@/lib/prompts";
import { ExtractedMemory } from "@/types/memory";

export async function POST(request: Request) {
  try {
    const { input } = await request.json();

    if (!input || typeof input !== "string" || !input.trim()) {
      return NextResponse.json({ error: "Input text is required" }, { status: 400 });
    }

    const trimmedInput = input.trim();

    // 1. Fetch existing memories to allow change/update detection
    let existingContext = "";
    let existingMemories: any[] = [];
    try {
      await connectDB();
      existingMemories = await Memory.find({ userId: "demo-user", status: { $ne: "archived" } }).lean();
      existingContext = existingMemories
        .map((m) => `[ID: ${m._id}] [${m.category.toUpperCase()}] ${m.content} (status: ${m.status})`)
        .join("\n");
    } catch (e) {
      console.warn("DB check in extract:", e);
    }

    // 2. Call Gemma for extraction
    const prompt = createMemoryExtractionPrompt(trimmedInput, existingContext);

    try {
      const result = await generateJsonWithGemma<{
        memories: ExtractedMemory[];
        reason: string;
      }>(prompt);

      const candidateMemories = Array.isArray(result?.memories) ? result.memories : [];

      // Link matched existing memories for updates or completions
      let enriched = candidateMemories.map((m) => {
        // Look for existing memory matching keywords
        const lower = m.content.toLowerCase();
        const matched = existingMemories.find((ex) => {
          const exLower = ex.content.toLowerCase();
          return (
            (lower.includes("dbms") && exLower.includes("dbms")) ||
            (lower.includes("project") && exLower.includes("project")) ||
            (lower.includes("placement") && exLower.includes("placement")) ||
            (lower.includes("dsa") && exLower.includes("dsa"))
          );
        });

        if (matched) {
          if (/done|completed|finished|submitted/i.test(trimmedInput)) {
            return {
              ...m,
              action: "complete" as const,
              targetMemoryId: String(matched._id),
              previousValue: matched.content,
            };
          }
          if (m.action === "update" || /postponed|moved|rescheduled|changed/i.test(trimmedInput)) {
            return {
              ...m,
              action: "update" as const,
              targetMemoryId: String(matched._id),
              previousValue: matched.content,
            };
          }
        }

        return m;
      });

      // If Gemma returned 0 memories, run heuristic fallback so user always gets actionable suggestions
      if (enriched.length === 0) {
        enriched = getHeuristicMemories(trimmedInput);
      }

      return NextResponse.json({
        memories: enriched,
        reason: result?.reason || (enriched.length > 0 ? "Saarthi identified useful context worth remembering." : "Extracted key details."),
        source: candidateMemories.length > 0 ? "gemma" : "local-rule",
      });
    } catch (ollamaErr: any) {
      console.warn("Ollama extraction fallback:", ollamaErr.message);

      const fallbackList = getHeuristicMemories(trimmedInput);

      return NextResponse.json({
        memories: fallbackList,
        reason: "Context extracted from natural language.",
        source: "local-rule",
        offlineNotice: true,
      });
    }
  } catch (error: any) {
    console.error("Extraction error:", error);
    return NextResponse.json({ error: "Failed to extract memory", details: error.message }, { status: 500 });
  }
}

function getHeuristicMemories(text: string): ExtractedMemory[] {
  const fallbackList: ExtractedMemory[] = [];
  const lower = text.toLowerCase();

  if (lower.includes("exam") || lower.includes("friday") || lower.includes("deadline")) {
    fallbackList.push({
      content: text,
      category: "event",
      importance: 5,
      confidence: 0.95,
      source: "explicit",
      action: "create",
    });
  }

  if (lower.includes("confusing") || lower.includes("struggl") || lower.includes("difficult") || lower.includes("weak")) {
    fallbackList.push({
      content: `Struggles with ${text.replace(/^i am |i'm |i struggle with /i, "")}`,
      category: "weakness",
      importance: 4,
      confidence: 0.88,
      source: "explicit",
      action: "create",
    });
  }

  if (lower.includes("want to") || lower.includes("goal") || lower.includes("preparing")) {
    fallbackList.push({
      content: text,
      category: "goal",
      importance: 4,
      confidence: 0.92,
      source: "explicit",
      action: "create",
    });
  }

  if (lower.includes("prefer") || lower.includes("usually") || lower.includes("like")) {
    fallbackList.push({
      content: text,
      category: "preference",
      importance: 3,
      confidence: 0.85,
      source: "explicit",
      action: "create",
    });
  }

  if (fallbackList.length === 0) {
    fallbackList.push({
      content: text,
      category: "other",
      importance: 3,
      confidence: 0.8,
      source: "explicit",
      action: "create",
    });
  }

  return fallbackList;
}

