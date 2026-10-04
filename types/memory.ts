export type MemoryCategory =
  | "goal"
  | "weakness"
  | "event"
  | "preference"
  | "task"
  | "personal"
  | "study"
  | "other";

export type MemorySource = "explicit" | "inferred";
export type MemoryStatus = "active" | "completed" | "archived";

export interface Memory {
  _id: string;
  id?: string;
  userId: string;
  content: string;
  category: MemoryCategory;
  source: MemorySource;
  confidence: number;
  importance: number;
  status: MemoryStatus;
  relatedMemoryIds?: string[];
  createdAt: string | number | Date;
  updatedAt?: string | number | Date;
}

export interface ExtractedMemory {
  content: string;
  category: MemoryCategory;
  importance: number;
  confidence: number;
  source: MemorySource;
  status?: MemoryStatus;
  action?: "create" | "update" | "complete";
  targetMemoryId?: string;
  previousValue?: string;
}

export interface PlanItem {
  time: string;
  title: string;
  duration: string;
  category?: MemoryCategory;
  note?: string;
}

export interface SaarthiTakePriority {
  rank: string;
  title: string;
  urgency: "HIGH" | "MEDIUM" | "LOW";
  importance?: "HIGH" | "MEDIUM" | "LOW";
  category: MemoryCategory;
  reason?: string;
}

export interface SaarthiTake {
  recommendation: string;
  summary: string;
  priorities: SaarthiTakePriority[];
  whyThis: {
    title: string;
    points: string[];
    memoriesReferenced: string[];
  };
  generatedAt: string;
  model: string;
  source?: string;
  offlineNotice?: boolean;
}

export interface GroupedContext {
  goals: Memory[];
  weaknesses: Memory[];
  events: Memory[];
  preferences: Memory[];
  tasks: Memory[];
  personal: Memory[];
  all: Memory[];
  stats: {
    total: number;
    goals: number;
    weaknesses: number;
    upcoming: number;
    preferences: number;
  };
}

export interface ChatMessage {
  id?: string;
  role: "user" | "ai";
  text: string;
  contextUsed?: string[];
  reasoning?: string;
  model?: string;
  timestamp?: number;
  isError?: boolean;
}
