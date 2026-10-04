import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Memory } from "@/models/Memory";
import { DEMO_MEMORIES } from "@/lib/demoData";

export async function GET() {
  try {
    let memories: any[] = [];
    try {
      await connectDB();
      memories = await Memory.find({ userId: "demo-user", status: { $ne: "archived" } })
        .sort({ importance: -1, createdAt: -1 })
        .lean();
    } catch (dbErr: any) {
      console.warn("DB connection in context fallback to DEMO_MEMORIES:", dbErr.message);
      memories = DEMO_MEMORIES.map((m, idx) => ({
        _id: `demo-${idx + 1}`,
        userId: "demo-user",
        ...m,
        createdAt: new Date().toISOString(),
      }));
    }

    const goals = memories.filter((m) => m.category === "goal");
    const weaknesses = memories.filter((m) => m.category === "weakness");
    const events = memories.filter((m) => m.category === "event");
    const preferences = memories.filter((m) => m.category === "preference");
    const tasks = memories.filter((m) => m.category === "task");
    const personal = memories.filter((m) => m.category === "personal");

    return NextResponse.json({
      goals,
      weaknesses,
      events,
      preferences,
      tasks,
      personal,
      all: memories,
      stats: {
        total: memories.length,
        goals: goals.length,
        weaknesses: weaknesses.length,
        upcoming: events.filter((e) => e.status === "active").length,
        preferences: preferences.length,
      },
    });
  } catch (error: any) {
    console.error("GET /api/context error:", error);
    return NextResponse.json(
      { error: "Failed to fetch context", details: error.message },
      { status: 500 }
    );
  }
}
