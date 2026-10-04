import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Memory } from "@/models/Memory";

export async function DELETE(
  _request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    await connectDB();

    const deleted = await Memory.findOneAndDelete({
      _id: id,
      userId: "demo-user",
    });

    if (!deleted) {
      return NextResponse.json({ error: "Memory not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error("DELETE /api/memories/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete memory", details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    await connectDB();
    const body = await request.json();

    const updateData: any = {};
    if (body.content !== undefined) updateData.content = body.content.trim();
    if (body.category !== undefined) updateData.category = body.category;
    if (body.importance !== undefined) updateData.importance = body.importance;

    const updated = await Memory.findOneAndUpdate(
      { _id: id, userId: "demo-user" },
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Memory not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("PATCH /api/memories/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update memory", details: error.message },
      { status: 500 }
    );
  }
}
