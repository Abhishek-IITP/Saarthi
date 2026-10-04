import { BookOpen, Briefcase, Target, CheckSquare, Calendar, Sliders, User, Bookmark, AlertTriangle, LucideIcon } from "lucide-react";
import { MemoryCategory } from "@/types/memory";

const ICONS: Record<MemoryCategory, LucideIcon> = {
  goal: Target,
  weakness: AlertTriangle,
  event: Calendar,
  preference: Sliders,
  task: CheckSquare,
  personal: User,
  study: BookOpen,
  other: Bookmark,
};

export function CategoryIcon({ category, className = "size-4" }: { category: MemoryCategory; className?: string }) {
  const Icon = ICONS[category] || Bookmark;
  return <Icon className={className} />;
}
