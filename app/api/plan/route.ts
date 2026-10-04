import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Memory } from "@/models/Memory";
import { generateJsonWithGemma } from "@/lib/ollama";
import { createPlanDayPrompt } from "@/lib/prompts";
import { PlanItem } from "@/types/memory";
import { DEMO_MEMORIES } from "@/lib/demoData";

export async function GET() {
  return handleGeneratePlan();
}

export async function POST() {
  return handleGeneratePlan();
}

async function handleGeneratePlan() {
  try {
    let memories: any[] = [];
    try {
      await connectDB();
      memories = await Memory.find({ userId: "demo-user", status: "active" })
        .sort({ importance: -1, createdAt: -1 })
        .lean();
    } catch (dbErr: any) {
      console.warn("DB connection in plan fallback to DEMO_MEMORIES:", dbErr.message);
      memories = DEMO_MEMORIES.filter((m) => m.status === "active");
    }

    const goals = memories.filter((m) => m.category === "goal").map((m) => `- ${m.content}`).join("\n");
    const events = memories.filter((m) => m.category === "event").map((m) => `- ${m.content}`).join("\n");
    const weaknesses = memories.filter((m) => m.category === "weakness").map((m) => `- ${m.content}`).join("\n");
    const preferences = memories.filter((m) => m.category === "preference").map((m) => `- ${m.content}`).join("\n");
    const tasks = memories.filter((m) => m.category === "task").map((m) => `- ${m.content}`).join("\n");

    const now = new Date();
    const currentTimeStr = `${now.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}, ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;

    const prompt = createPlanDayPrompt(currentTimeStr, goals, events, weaknesses, preferences, tasks);

    try {
      const result = await generateJsonWithGemma<{
        summary: string;
        schedule: PlanItem[];
      }>(prompt);

      return NextResponse.json({
        summary: result?.summary || "Plan tailored to your upcoming deadlines and night study preference.",
        schedule: result?.schedule || [],
        source: "gemma",
      });
    } catch (ollamaErr: any) {
      console.warn("Ollama plan generation fallback:", ollamaErr.message);

      // Intelligent fallback schedule respecting the user's memories
      const fallbackSchedule: PlanItem[] = [
        {
          time: "09:30",
          title: "DBMS Revision: Normalization & Transactions",
          duration: "60 mins",
          category: "event",
          note: "High priority: Exam is approaching on Friday",
        },
        {
          time: "11:00",
          title: "Placement Preparation: System Design",
          duration: "90 mins",
          category: "goal",
          note: "Core software engineering placement goal",
        },
        {
          time: "14:30",
          title: "Afternoon Rest & Review",
          duration: "30 mins",
          category: "personal",
          note: "Quick recharge break",
        },
        {
          time: "17:00",
          title: "DSA Practice: Dynamic Programming",
          duration: "45 mins",
          category: "goal",
          note: "Target 2-3 DP problems in weaker area",
        },
        {
          time: "19:00",
          title: "Evening Workout",
          duration: "60 mins",
          category: "preference",
          note: "Habit: Usually works out in the evening",
        },
        {
          time: "21:30",
          title: "Night Study Block: Light DBMS Practice",
          duration: "45 mins",
          category: "preference",
          note: "Prefers studying at night with chai",
        },
      ];

      return NextResponse.json({
        summary: "Balanced day schedule structured around your Friday DBMS exam, DP focus, and evening workout.",
        schedule: fallbackSchedule,
        source: "fallback",
        offlineNotice: true,
      });
    }
  } catch (error: any) {
    console.error("Plan API error:", error);
    return NextResponse.json({ error: "Failed to generate plan", details: error.message }, { status: 500 });
  }
}
