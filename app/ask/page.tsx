"use client";

import { ArrowUp, User, Loader2, ArrowRight, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { useEffect, useRef, useState, Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { apiAskChat } from "@/lib/saarthi";
import { ChatMessage } from "@/types/memory";

const QUICK_ACTIONS = [
  "Plan my day",
  "What matters most right now?",
  "What should I revise?",
  "What do you remember about me?",
];

function AskContent() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [expandedContextIndex, setExpandedContextIndex] = useState<number | null>(null);
  const [expandedReasoningIndex, setExpandedReasoningIndex] = useState<number | null>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const initialSent = useRef(false);

  const sendMessage = async (text: string) => {
    const q = text.trim();
    if (!q || thinking) return;

    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setInput("");
    setThinking(true);

    try {
      const data = await apiAskChat(q);

      if (data.answer) {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            text: data.answer!,
            contextUsed: (data as any).contextUsed || [],
            reasoning: (data as any).reasoning || "",
            model: "Gemma 3 (Local)",
          },
        ]);
      } else if (data.error) {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            text: data.error!,
            isError: true,
          },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: err.message || "Failed to communicate with Saarthi.",
          isError: true,
        },
      ]);
    } finally {
      setThinking(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q && !initialSent.current) {
      initialSent.current = true;
      sendMessage(q);
    }
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  useEffect(() => {
    const ta = taRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 180) + "px";
    }
  }, [input]);

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F5] text-[#1F1E1D]">
      <Navbar />

      <div className="mx-auto w-full max-w-3xl flex-1 px-5 pb-52 pt-8">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#E5E3DC] pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1F1E1D] flex items-center gap-2">
              <span className="text-[#D96B27]">✦</span> Ask Saarthi
            </h1>
            <p className="mt-1 text-xs text-[#706E68]">
              Your personal context is loaded into local Gemma 3 reasoning.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-md border border-[#E5E3DC] bg-[#FFFFFF] px-2.5 py-1 font-mono text-xs text-[#706E68] shadow-sm">
            <span className="size-2 rounded-full bg-emerald-600" />
            <span>Gemma 3 · Local</span>
          </div>
        </div>

        {/* Empty Chat State */}
        {messages.length === 0 && !thinking ? (
          <div className="py-14 text-center animate-rise">
            <span className="text-3xl text-[#D96B27] font-bold block mb-3">✦</span>

            <h2 className="text-xl font-bold tracking-tight text-[#1F1E1D]">
              Ask Saarthi
            </h2>
            <p className="mx-auto mt-1 max-w-sm text-xs text-[#706E68]">
              What do you want to figure out today?
            </p>

            <div className="mx-auto mt-8 flex max-w-md flex-col gap-2">
              {[
                "What should I focus on today?",
                "What are my current priorities?",
                "Plan my evening",
                "What do you remember about me?",
              ].map((p) => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  className="rounded-lg border border-[#E5E3DC] bg-[#FFFFFF] px-4 py-3 text-left text-xs sm:text-sm font-medium text-[#1F1E1D] hover:border-[#D1CEBE] hover:bg-[#F8F7F4] transition-colors flex items-center justify-between group shadow-sm"
                >
                  <span>{p}</span>
                  <ArrowRight className="size-3.5 text-[#8C8980] group-hover:text-[#D96B27] transition-colors" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 pt-6">
            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="flex justify-end items-start gap-2.5 animate-rise">
                  <div className="max-w-[85%] rounded-lg bg-[#F3F1EC] border border-[#E5E3DC] text-[#1F1E1D] px-4 py-2.5 text-sm leading-relaxed shadow-sm">
                    {m.text}
                  </div>
                  <span className="grid size-7 shrink-0 place-items-center rounded-md bg-[#FAF9F5] border border-[#E5E3DC] text-xs text-[#706E68]">
                    <User className="size-3.5" />
                  </span>
                </div>
              ) : (
                <div key={i} className="flex items-start gap-3 animate-rise">
                  <span className="grid size-7 shrink-0 place-items-center rounded-md bg-[#F3F1EC] border border-[#E5E3DC] text-[#D96B27] text-xs mt-0.5">
                    ✦
                  </span>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div
                      className={`rounded-lg p-4 text-sm leading-relaxed whitespace-pre-line border ${
                        m.isError
                          ? "bg-amber-50 border-amber-200 text-amber-900"
                          : "bg-[#FFFFFF] border-[#E5E3DC] text-[#1F1E1D] shadow-sm"
                      }`}
                    >
                      {m.text}
                    </div>

                    {/* Context Used & Why This Answer */}
                    {!m.isError && (
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                        {/* Context Used Badge */}
                        <button
                          onClick={() => setExpandedContextIndex(expandedContextIndex === i ? null : i)}
                          className="inline-flex items-center gap-1.5 rounded-md border border-[#E5E3DC] bg-[#FFFFFF] px-2.5 py-1 text-[11px] font-mono text-[#D96B27] hover:border-[#D1CEBE] hover:bg-[#F8F7F4] transition-colors shadow-sm"
                        >
                          <span>✦ Based on {m.contextUsed?.length || 3} memories</span>
                          {expandedContextIndex === i ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                        </button>

                        {/* Why this answer button */}
                        {m.reasoning && (
                          <button
                            onClick={() => setExpandedReasoningIndex(expandedReasoningIndex === i ? null : i)}
                            className="inline-flex items-center gap-1.5 rounded-md border border-[#E5E3DC] bg-[#FFFFFF] px-2.5 py-1 text-[11px] font-mono text-[#706E68] hover:text-[#1F1E1D] hover:bg-[#F8F7F4] transition-colors shadow-sm"
                          >
                            <HelpCircle className="size-3 text-[#D96B27]" />
                            <span>Why this answer?</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Expanded Context List */}
                    {expandedContextIndex === i && m.contextUsed && (
                      <div className="rounded-lg border border-[#E5E3DC] bg-[#FAF9F5] p-3 text-xs space-y-1.5 animate-rise shadow-sm">
                        <span className="font-semibold text-[#D96B27] block text-[11px] uppercase tracking-wider">
                          Context Used by Gemma:
                        </span>
                        {m.contextUsed.map((ctx, idx) => (
                          <p key={idx} className="text-[#44423E] text-[11px] flex items-center gap-1.5">
                            <span className="text-[#D96B27] font-bold">•</span>
                            <span>{ctx}</span>
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Expanded Reasoning Box */}
                    {expandedReasoningIndex === i && m.reasoning && (
                      <div className="rounded-lg border border-[#E5E3DC] bg-[#FAF9F5] p-3 text-xs text-[#57534E] leading-relaxed animate-rise shadow-sm">
                        <span className="font-semibold text-[#1F1E1D] block text-[11px] uppercase tracking-wider mb-1">
                          Saarthi Reasoning Breakdown:
                        </span>
                        {m.reasoning}
                      </div>
                    )}
                  </div>
                </div>
              )
            )}

            {thinking && (
              <div className="flex items-center gap-3 text-xs text-[#706E68] pt-2">
                <span className="grid size-7 shrink-0 place-items-center rounded-md bg-[#F3F1EC] border border-[#E5E3DC] text-[#D96B27] text-xs">
                  <Loader2 className="size-3.5 animate-spin" />
                </span>
                <span>Saarthi is reasoning with Gemma 3 using your stored context...</span>
              </div>
            )}

            <div ref={endRef} />
          </div>
        )}
      </div>

      {/* Floating Query Bar + Quick Actions */}
      <div className="fixed inset-x-0 bottom-0 bg-[#FAF9F5] border-t border-[#E5E3DC] pb-5 pt-3">
        <div className="mx-auto max-w-3xl px-5 space-y-2.5">
          {/* Quick Actions */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs text-[#706E68] shrink-0 self-center mr-1">Suggested:</span>
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action}
                onClick={() => sendMessage(action)}
                className="shrink-0 rounded-md border border-[#E5E3DC] bg-[#FFFFFF] px-2.5 py-1 text-xs text-[#706E68] hover:text-[#1F1E1D] hover:bg-[#F8F7F4] transition-colors font-medium shadow-sm"
              >
                {action}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex items-end gap-2.5 rounded-lg border border-[#E5E3DC] bg-[#FFFFFF] p-2.5 pl-4 shadow-sm focus-within:border-[#D96B27] focus-within:ring-1 focus-within:ring-[#D96B27] transition-all"
          >
            <textarea
              ref={taRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder="Ask Saarthi (e.g. 'What should I focus on today?')..."
              className="flex-1 resize-none bg-transparent py-1 text-sm text-[#1F1E1D] outline-none placeholder:text-[#8C8980] max-h-36"
            />
            <button
              type="submit"
              disabled={!input.trim() || thinking}
              aria-label="Send"
              className="grid size-8 shrink-0 place-items-center rounded-md bg-[#D96B27] text-white shadow-sm hover:bg-[#C25E1F] disabled:opacity-30 transition-colors"
            >
              <ArrowUp className="size-4" />
            </button>
          </form>

          <p className="text-center text-[10px] font-mono text-[#8C8980]">
            Saarthi Context Engine · Powered locally by Gemma 3 &amp; Ollama
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Ask() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF9F5]" />}>
      <AskContent />
    </Suspense>
  );
}
