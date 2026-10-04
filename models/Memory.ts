import mongoose, { Schema, models, Model } from "mongoose";
import { MemoryCategory, MemorySource, MemoryStatus } from "@/types/memory";

export interface IMemoryDocument {
  userId: string;
  content: string;
  category: MemoryCategory;
  source: MemorySource;
  confidence: number;
  importance: number;
  status: MemoryStatus;
  relatedMemoryIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MemorySchema = new Schema<IMemoryDocument>(
  {
    userId: {
      type: String,
      required: true,
      default: "demo-user",
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "goal",
        "weakness",
        "event",
        "preference",
        "task",
        "personal",
        "other",
      ],
      default: "other",
      index: true,
    },
    source: {
      type: String,
      enum: ["explicit", "inferred"],
      default: "explicit",
      index: true,
    },
    confidence: {
      type: Number,
      default: 0.95,
      min: 0,
      max: 1,
    },
    importance: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "completed", "archived"],
      default: "active",
      index: true,
    },
    relatedMemoryIds: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Memory: Model<IMemoryDocument> =
  models.Memory || mongoose.model<IMemoryDocument>("Memory", MemorySchema);
