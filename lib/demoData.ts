import { MemoryCategory, MemorySource, MemoryStatus } from "@/types/memory";

export interface DemoMemorySeed {
  content: string;
  category: MemoryCategory;
  importance: number;
  confidence: number;
  source: MemorySource;
  status: MemoryStatus;
}

export const DEMO_MEMORIES: DemoMemorySeed[] = [
  {
    content: "I have a DBMS exam on Friday.",
    category: "event",
    importance: 5,
    confidence: 0.98,
    source: "explicit",
    status: "active",
  },
  {
    content: "I am preparing for software placements.",
    category: "goal",
    importance: 5,
    confidence: 0.99,
    source: "explicit",
    status: "active",
  },
  {
    content: "Dynamic Programming is one of my weak areas.",
    category: "weakness",
    importance: 4,
    confidence: 0.92,
    source: "explicit",
    status: "active",
  },
  {
    content: "I want to solve three DSA problems every day.",
    category: "task",
    importance: 4,
    confidence: 0.95,
    source: "explicit",
    status: "active",
  },
  {
    content: "Struggles with DBMS normalization.",
    category: "weakness",
    importance: 4,
    confidence: 0.88,
    source: "inferred",
    status: "active",
  },
  {
    content: "Prefers studying at night.",
    category: "preference",
    importance: 3,
    confidence: 0.85,
    source: "inferred",
    status: "active",
  },
  {
    content: "Usually works out in the evening around 7 PM.",
    category: "preference",
    importance: 3,
    confidence: 0.92,
    source: "explicit",
    status: "active",
  },
  {
    content: "Prefers chai over coffee.",
    category: "preference",
    importance: 2,
    confidence: 0.96,
    source: "explicit",
    status: "active",
  },
  {
    content: "Project submission deadline next week.",
    category: "event",
    importance: 4,
    confidence: 0.94,
    source: "explicit",
    status: "active",
  },
  {
    content: "I want to learn system design concepts.",
    category: "goal",
    importance: 4,
    confidence: 0.90,
    source: "explicit",
    status: "active",
  },
  {
    content: "I want to improve my software engineering resume.",
    category: "task",
    importance: 3,
    confidence: 0.89,
    source: "explicit",
    status: "active",
  },
  {
    content: "I want to spend less time on social media.",
    category: "personal",
    importance: 2,
    confidence: 0.82,
    source: "explicit",
    status: "active",
  },
];
