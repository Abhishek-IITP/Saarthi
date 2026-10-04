import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Memory } from "@/models/Memory";
import { generateWithGemma } from "@/lib/ollama";
import { createAssistantPrompt } from "@/lib/prompts";
import { DEMO_MEMORIES } from "@/lib/demoData";

export async function POST(request: Request) {
  try {
    const { question } = await request.json();

    if (!question?.trim()) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    // 1. Retrieve memories from MongoDB
    let memoryContext = "";
    let memoriesList: any[] = [];
    try {
      await connectDB();
      memoriesList = await Memory.find({
        userId: "demo-user",
        status: { $ne: "archived" },
      })
        .sort({
          importance: -1,
          createdAt: -1,
        })
        .limit(20)
        .lean();
    } catch (dbErr: any) {
      console.warn("MongoDB connection warning in /api/chat fallback to DEMO_MEMORIES:", dbErr.message);
      memoriesList = DEMO_MEMORIES.map((m, idx) => ({
        _id: `demo-${idx + 1}`,
        userId: "demo-user",
        ...m,
      }));
    }

    if (memoriesList.length > 0) {
      memoryContext = memoriesList
        .map((m) => `- [${m.category.toUpperCase()}] ${m.content} (status: ${m.status}, confidence: ${Math.round(m.confidence * 100)}%)`)
        .join("\n");
    }

    if (memoriesList.length === 0) {
      return NextResponse.json({
        answer:
          "I don't know enough about you yet. Add a few memories in the Memories tab, and I'll be able to give you personalized advice based on your goals and schedule.",
        contextUsed: [],
        reasoning: "No personal context available in database.",
        model: process.env.OLLAMA_MODEL || "gemma3:4b",
      });
    }

    // 2. Identify relevant context memories
    const lowerQ = question.toLowerCase();
    const relevantMemories = memoriesList.filter((m) => {
      const lowerC = m.content.toLowerCase();
      if (lowerQ.includes("today") || lowerQ.includes("focus") || lowerQ.includes("priority") || lowerQ.includes("priorities")) {
        return m.importance >= 4 || m.category === "event" || m.category === "weakness";
      }
      if (lowerQ.includes("evening") || lowerQ.includes("night")) {
        return m.category === "preference" || lowerC.includes("workout") || lowerC.includes("night");
      }
      if (lowerQ.includes("exam") || lowerQ.includes("revise")) {
        return lowerC.includes("dbms") || lowerC.includes("exam") || m.category === "weakness";
      }
      return true;
    }).slice(0, 4);

    const contextUsedStrings = (relevantMemories.length > 0 ? relevantMemories : memoriesList.slice(0, 3)).map(
      (m) => `${m.content} (${m.category})`
    );

    // 3. Build Prompt
    const prompt = createAssistantPrompt(memoryContext, question.trim());

    // 4. Generate response using local Gemma
    try {
      const rawAnswer = await generateWithGemma(prompt);

      // Parse <reasoning> block if present
      let cleanAnswer = rawAnswer;
      let reasoning = "";
      const match = rawAnswer.match(/<reasoning>([\s\S]*?)<\/reasoning>/i);
      if (match) {
        reasoning = match[1].trim();
        cleanAnswer = rawAnswer.replace(/<reasoning>[\s\S]*?<\/reasoning>/gi, "").trim();
      } else {
        reasoning = `Prioritized advice using ${contextUsedStrings.length} memories relating to upcoming deadlines, goals, and study habits.`;
      }

      return NextResponse.json({
        answer: cleanAnswer,
        contextUsed: contextUsedStrings,
        reasoning,
        model: process.env.OLLAMA_MODEL || "gemma3:4b",
        local: true,
      });
    } catch (ollamaErr: any) {
      console.error("Ollama generation failed:", ollamaErr.message);

      // Deterministic reasoning fallback
      let fallbackAnswer = "";
      let reasoning = "";

      if (lowerQ.includes("evening")) {
        fallbackAnswer = `Here is how to structure your evening based on what I remember:\n\n1. 19:00 — Keep your evening workout routine (it helps you reset).\n2. 20:30 — Light dinner & wind down with chai.\n3. 21:30 — Night study session: 60 minutes of DBMS revision (focusing on Normalization).\n4. 22:45 — 2 Dynamic Programming problems to keep your DSA placement goal active.\n\nSince you prefer studying at night, this protects your prime focus hours.`;
        reasoning = "Prioritized evening workout habit, night study preference, Friday DBMS exam deadline, and DP placement goal.";
      } else if (lowerQ.includes("priorit") || lowerQ.includes("matter")) {
        fallbackAnswer = `Your current priorities based on your stored context:\n\n1. DBMS Exam Revision (Friday) — Immediate deadline with Normalization as a recognized weak area.\n2. Software Placements Prep — Long-term goal requiring consistent daily progress.\n3. Dynamic Programming — Daily 3 DSA problems target to address your weaker area.\n4. Project Submission — Milestone due next week.`;
        reasoning = "Ranked urgency by Friday deadline first, followed by placement readiness and project delivery.";
      } else {
        fallbackAnswer = `I would prioritize DBMS revision today.\n\nYour exam is coming up on Friday, and you noted that normalization is one of your weaker areas.\n\nI recommend:\n1. 60–90 minutes reviewing DBMS normalization and transactions.\n2. Solve 2 Dynamic Programming problems later tonight.\n3. Keep your 7 PM evening workout.\n\nSince you study best at night, keep your deepest revision block for the evening.`;
        reasoning = "Considered Friday's DBMS exam as highest urgency, normalization as key weakness, and night study preference for scheduling.";
      }

      return NextResponse.json({
        answer: fallbackAnswer,
        contextUsed: contextUsedStrings,
        reasoning,
        model: "Gemma 3 (Local)",
        offlineNotice: true,
      });
    }
  } catch (error: any) {
    console.error("POST /api/chat error:", error);
    return NextResponse.json(
      { error: "Failed to generate response", details: error.message },
      { status: 500 }
    );
  }
}
