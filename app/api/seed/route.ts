import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Memory } from "@/models/Memory";
import { DEMO_MEMORIES } from "@/lib/demoData";

export async function POST() {
  try {
    await connectDB();

    // Clear existing demo-user memories
    await Memory.deleteMany({ userId: "demo-user" });

    // Insert standard demo memories
    const seeded = await Memory.insertMany(
      DEMO_MEMORIES.map((m) => ({
        ...m,
        userId: "demo-user",
      }))
    );

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${seeded.length} demo memories.`,
      count: seeded.length,
    });
  } catch (error: any) {
    console.error("POST /api/seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed demo memories", details: error.message },
      { status: 500 }
    );
  }
}
