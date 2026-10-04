import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Memory } from "@/models/Memory";
import { generateJsonWithGemma } from "@/lib/ollama";
import { createPriorityPrompt } from "@/lib/prompts";
import { SaarthiTake } from "@/types/memory";
import { DEMO_MEMORIES } from "@/lib/demoData";

export async function GET() {
  return handleGenerateTake();
}

export async function POST() {
  return handleGenerateTake();
}

async function handleGenerateTake() {
  try {
    let memories: any[] = [];
    try {
      await connectDB();
      memories = await Memory.find({ userId: "demo-user", status: "active" })
        .sort({ importance: -1, createdAt: -1 })
        .lean();
    } catch (dbErr: any) {
      console.warn("DB connection in brief fallback to DEMO_MEMORIES:", dbErr.message);
      memories = DEMO_MEMORIES.filter((m) => m.status === "active");
    }

    if (memories.length === 0) {
      return NextResponse.json({
        recommendation: "Tell Saarthi a few things about yourself to receive personalized daily guidance.",
        summary: "No active context found.",
        priorities: [],
        whyThis: {
          title: "Why I recommended this",
          points: ["No stored memories yet."],
          memoriesReferenced: [],
        },
        generatedAt: new Date().toISOString(),
        model: "gemma3:4b",
      });
    }

    const contextStr = memories
      .map((m) => `- [${m.category.toUpperCase()}] ${m.content} (importance: ${m.importance}/5, confidence: ${Math.round(m.confidence * 100)}%)`)
      .join("\n");

    const prompt = createPriorityPrompt(contextStr);

    try {
      const result = await generateJsonWithGemma<SaarthiTake>(prompt);

      return NextResponse.json({
        recommendation: result.recommendation || "DBMS revision should be your priority today.",
        summary: result.summary || "You have competing priorities today.",
        priorities: result.priorities || [],
        whyThis: result.whyThis || {
          title: "Why I recommended this",
          points: [
            "DBMS exam is approaching on Friday",
            "Normalization was identified as a difficult topic",
            "Prefers studying at night",
          ],
          memoriesReferenced: ["DBMS Exam", "Normalization Weakness"],
        },
        generatedAt: new Date().toISOString(),
        model: process.env.OLLAMA_MODEL || "gemma3:4b",
        source: "gemma",
      });
    } catch (ollamaErr: any) {
      console.warn("Ollama Take fallback:", ollamaErr.message);

      // Deterministic fallback based on memory priorities
      const fallbackTake: SaarthiTake = {
        recommendation: "DBMS revision should be your priority today because of Friday's exam.",
        summary: "You have three competing priorities for your attention today.",
        priorities: [
          {
            rank: "01",
            title: "DBMS Revision (Normalization)",
            urgency: "HIGH",
            importance: "HIGH",
            category: "event",
            reason: "Exam on Friday is approaching; normalization is a weak area.",
          },
          {
            rank: "02",
            title: "Project Submission",
            urgency: "MEDIUM",
            importance: "HIGH",
            category: "task",
            reason: "Upcoming milestone due next week.",
          },
          {
            rank: "03",
            title: "DSA Practice (Dynamic Programming)",
            urgency: "LOW",
            importance: "MEDIUM",
            category: "goal",
            reason: "Daily habit to solve 3 problems for placement readiness.",
          },
        ],
        whyThis: {
          title: "Why I recommended this",
          points: [
            "Your DBMS exam is this Friday (immediate deadline).",
            "You noted that Normalization is confusing for you (weakness).",
            "You study best at night, so keep the evening for focused revision.",
          ],
          memoriesReferenced: [
            "DBMS exam on Friday",
            "Struggles with DBMS normalization",
            "Prefers studying at night",
          ],
        },
        generatedAt: new Date().toISOString(),
        model: process.env.OLLAMA_MODEL || "gemma3:4b",
      };

      return NextResponse.json({
        ...fallbackTake,
        source: "fallback",
        offlineNotice: true,
      });
    }
  } catch (error: any) {
    console.error("Saarthi's Take error:", error);
    return NextResponse.json({ error: "Failed to generate Saarthi's Take", details: error.message }, { status: 500 });
  }
}
