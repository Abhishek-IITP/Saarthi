import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Memory } from "@/models/Memory";
import { DEMO_MEMORIES } from "@/lib/demoData";

export async function GET(request: Request) {
  try {
    await connectDB();

    const count = await Memory.countDocuments({ userId: "demo-user" });

    // Auto-seed if first time opening empty database
    if (count === 0) {
      await Memory.insertMany(
        DEMO_MEMORIES.map((m) => ({
          ...m,
          userId: "demo-user",
        }))
      );
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const query = searchParams.get("q");
    const status = searchParams.get("status");

    const filter: any = { userId: "demo-user" };

    if (category && category !== "all") {
      filter.category = category;
    }

    if (status) {
      filter.status = status;
    }

    if (query) {
      filter.content = { $regex: query, $options: "i" };
    }

    const memories = await Memory.find(filter)
      .sort({
        importance: -1,
        createdAt: -1,
      })
      .lean();

    return NextResponse.json({
      memories,
      source: "mongodb",
      count: memories.length,
    });
  } catch (error: any) {
    console.warn("GET /api/memories DB fallback to DEMO_MEMORIES:", error.message);
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const query = searchParams.get("q")?.toLowerCase();

    let fallbackMemories = DEMO_MEMORIES.map((m, idx) => ({
      _id: `demo-${idx + 1}`,
      userId: "demo-user",
      ...m,
      createdAt: new Date(Date.now() - (idx * 3600000 * 4)).toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    if (category && category !== "all") {
      fallbackMemories = fallbackMemories.filter((m) => m.category === category);
    }
    if (query) {
      fallbackMemories = fallbackMemories.filter((m) => m.content.toLowerCase().includes(query));
    }

    return NextResponse.json({
      memories: fallbackMemories,
      source: "in-memory-fallback",
      count: fallbackMemories.length,
      notice: "Serving local in-memory context (MongoDB offline or SSL restricted)",
    });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    // Check if bulk insert (from "Remember all")
    if (Array.isArray(body.memories)) {
      const docs = body.memories.map((m: any) => ({
        userId: "demo-user",
        content: m.content.trim(),
        category: m.category || "other",
        importance: typeof m.importance === "number" ? Math.min(5, Math.max(1, m.importance)) : 3,
        confidence: typeof m.confidence === "number" ? m.confidence : 0.95,
        source: m.source || "explicit",
        status: m.status || "active",
      }));

      const created = await Memory.insertMany(docs);
      return NextResponse.json({ success: true, count: created.length, memories: created }, { status: 201 });
    }

    // Single insert
    const { content, category, importance, confidence, source, status } = body;

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Memory content is required" },
        { status: 400 }
      );
    }

    const memory = await Memory.create({
      userId: "demo-user",
      content: content.trim(),
      category: category || "other",
      importance: typeof importance === "number" ? Math.min(5, Math.max(1, importance)) : 3,
      confidence: typeof confidence === "number" ? confidence : 0.95,
      source: source || "explicit",
      status: status || "active",
    });

    return NextResponse.json(memory, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/memories error:", error);
    return NextResponse.json(
      {
        error: "Failed to save memory to MongoDB. Check connection.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
