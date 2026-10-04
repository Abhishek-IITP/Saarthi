"use client";

import { useState } from "react";
import { Network } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface GraphNode {
  id: string;
  label: string;
  category: "center" | "category" | "item" | "subitem";
  type: string;
  confidence: string;
  whyKnows: string;
  related: string[];
}

const NODES: GraphNode[] = [
  {
    id: "you",
    label: "YOU",
    category: "center",
    type: "User Context Root",
    confidence: "100%",
    whyKnows: "Core personal context container for Abhishek.",
    related: ["Goals", "Events", "Preferences", "Weaknesses"],
  },
  {
    id: "goals",
    label: "GOALS",
    category: "category",
    type: "Category Group",
    confidence: "High",
    whyKnows: "Active aspirations and placement milestones.",
    related: ["Placements", "DSA Practice", "System Design"],
  },
  {
    id: "events",
    label: "EVENTS",
    category: "category",
    type: "Category Group",
    confidence: "High",
    whyKnows: "Time-bound exams and delivery milestones.",
    related: ["DBMS Exam (Friday)", "Project Deadline"],
  },
  {
    id: "preferences",
    label: "PREFERENCES",
    category: "category",
    type: "Category Group",
    confidence: "High",
    whyKnows: "Habits and study conditions that suit you best.",
    related: ["Night Study", "Evening Workout", "Chai over Coffee"],
  },
  {
    id: "placements",
    label: "Placements",
    category: "item",
    type: "Goal",
    confidence: "99%",
    whyKnows: "You stated you are preparing for software engineering placements.",
    related: ["DSA Practice", "Dynamic Programming", "Resume"],
  },
  {
    id: "dbms",
    label: "DBMS Exam",
    category: "item",
    type: "Event (Friday)",
    confidence: "98%",
    whyKnows: "You mentioned your DBMS exam is scheduled for this Friday.",
    related: ["Normalization", "Transactions Revision"],
  },
  {
    id: "night",
    label: "Night Study",
    category: "item",
    type: "Preference",
    confidence: "85%",
    whyKnows: "You stated you focus best during night hours.",
    related: ["Chai", "Evening Workout"],
  },
  {
    id: "dp",
    label: "DP (Weak Area)",
    category: "subitem",
    type: "Weakness",
    confidence: "92%",
    whyKnows: "You mentioned struggling with Dynamic Programming multiple times in practice.",
    related: ["Placements", "DSA Practice"],
  },
  {
    id: "normalization",
    label: "Normalization",
    category: "subitem",
    type: "Weakness",
    confidence: "88%",
    whyKnows: "Identified confusion around 2NF/3NF database decomposition.",
    related: ["DBMS Exam", "Friday Revision"],
  },
];

export function ContextGraph() {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  return (
    <div className="rounded-xl border border-[#E5E3DC] bg-[#FFFFFF] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#1F1E1D] flex items-center gap-2">
            <Network className="size-4 text-[#D96B27]" />
            <span>Your Context Graph</span>
          </h3>
          <p className="text-xs text-[#706E68] mt-0.5">
            How things Saarthi remembers connect together. Click any node to inspect context.
          </p>
        </div>
        <span className="text-[10px] font-mono text-[#706E68] bg-[#F3F1EC] px-2.5 py-1 rounded-md border border-[#E5E3DC]">
          Interactive Nodes
        </span>
      </div>

      {/* Visual Graph Canvas */}
      <div className="relative overflow-x-auto py-8 px-4 rounded-lg border border-[#E5E3DC] bg-[#FAF9F5]">
        <div className="min-w-[540px] flex flex-col items-center gap-7">
          {/* Level 1: YOU */}
          <button
            onClick={() => setSelectedNode(NODES[0])}
            className="flex items-center gap-2 rounded-full border-2 border-[#D96B27] bg-[#FFFFFF] px-6 py-2 text-sm font-semibold text-[#1F1E1D] shadow-sm hover:bg-[#FAF9F5] transition-all"
          >
            <span className="size-2 rounded-full bg-[#D96B27]" />
            <span>YOU (Abhishek)</span>
          </button>

          {/* Connector Line */}
          <div className="w-3/4 border-t border-[#E5E3DC] relative -my-3" />

          {/* Level 2: Primary Branches */}
          <div className="grid grid-cols-3 gap-5 w-full max-w-xl">
            {NODES.slice(1, 4).map((node) => (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className="rounded-lg border border-[#E5E3DC] bg-[#FFFFFF] p-3 text-center hover:border-[#D1CEBE] hover:bg-[#FBFBFA] transition-colors shadow-sm"
              >
                <p className="text-xs font-semibold text-[#D96B27]">
                  {node.label}
                </p>
                <p className="text-[10px] text-[#706E68] mt-0.5">{node.type}</p>
              </button>
            ))}
          </div>

          {/* Level 3: Context Items */}
          <div className="grid grid-cols-3 gap-5 w-full max-w-xl">
            {NODES.slice(4, 7).map((node) => (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className="rounded-lg border border-[#E5E3DC] bg-[#FFFFFF] p-2.5 text-center hover:border-[#D1CEBE] hover:bg-[#FBFBFA] transition-colors shadow-sm"
              >
                <p className="text-xs font-medium text-[#1F1E1D]">{node.label}</p>
                <span className="text-[10px] font-mono text-emerald-700 block mt-0.5">
                  {node.confidence}
                </span>
              </button>
            ))}
          </div>

          {/* Level 4: Weaknesses */}
          <div className="flex justify-center gap-5 w-full max-w-md">
            {NODES.slice(7).map((node) => (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-center hover:bg-amber-100/60 transition-colors shadow-sm"
              >
                <p className="text-xs font-semibold text-amber-900">{node.label}</p>
                <span className="text-[10px] font-mono text-amber-700 block">
                  Identified Weakness
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Node Inspection Modal */}
      <Dialog open={!!selectedNode} onOpenChange={(open) => !open && setSelectedNode(null)}>
        <DialogContent className="rounded-xl border border-[#E5E3DC] bg-[#FFFFFF] text-[#1F1E1D] sm:max-w-md p-6 shadow-lg">
          {selectedNode && (
            <div>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <span className="grid size-6 place-items-center rounded bg-[#F3F1EC] text-[#D96B27] border border-[#E5E3DC] text-xs">
                    ✦
                  </span>
                  <DialogTitle className="text-lg font-bold text-[#1F1E1D]">
                    {selectedNode.label}
                  </DialogTitle>
                </div>
              </DialogHeader>

              <div className="mt-4 space-y-3.5 text-xs text-[#706E68]">
                <div className="flex justify-between border-b border-[#E5E3DC] pb-2">
                  <span>Type</span>
                  <span className="font-medium text-[#1F1E1D]">{selectedNode.type}</span>
                </div>

                <div className="flex justify-between border-b border-[#E5E3DC] pb-2">
                  <span>Confidence Level</span>
                  <span className="font-mono font-semibold text-[#D96B27]">{selectedNode.confidence}</span>
                </div>

                <div>
                  <span className="block font-medium text-[#1F1E1D] mb-1">Why Saarthi Knows:</span>
                  <p className="rounded-md bg-[#FAF9F5] p-3 text-xs leading-relaxed text-[#44423E] border border-[#E5E3DC]">
                    {selectedNode.whyKnows}
                  </p>
                </div>

                <div>
                  <span className="block font-medium text-[#1F1E1D] mb-1.5">Related Context:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.related.map((rel) => (
                      <span
                        key={rel}
                        className="rounded-md border border-[#E5E3DC] bg-[#FAF9F5] px-2 py-1 text-[11px] text-[#1F1E1D]"
                      >
                        {rel}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
