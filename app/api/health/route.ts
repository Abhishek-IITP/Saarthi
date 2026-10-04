import { NextResponse } from "next/server";
import { checkDBConnection } from "@/lib/mongodb";
import { checkOllamaStatus } from "@/lib/ollama";

export async function GET() {
  const [dbStatus, aiStatus] = await Promise.all([
    checkDBConnection(),
    checkOllamaStatus(),
  ]);

  return NextResponse.json({
    mongodb: dbStatus,
    ollama: aiStatus,
    model: aiStatus.model,
    inference: "local",
    cloudAI: "not used",
    timestamp: new Date().toISOString(),
  });
}
