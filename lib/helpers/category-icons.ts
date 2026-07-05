import {
  UtensilsCrossed,
  Car,
  Zap,
  Clapperboard,
  HeartPulse,
  Wallet,
  Receipt,
  Briefcase,
  Gift,
  TrendingUp,
  Tag,
  type LucideIcon,
} from "lucide-react";

const categoryIcons: Record<string, LucideIcon> = {
  Food: UtensilsCrossed,
  Transport: Car,
  Utilities: Zap,
  Entertainment: Clapperboard,
  Health: HeartPulse,
  Salary: Wallet,
  Reimbursement: Receipt,
  Freelance: Briefcase,
  Gifts: Gift,
  Interest: TrendingUp,
};

const fallbackIcon = Tag;

export function categoryIcon(name: string): LucideIcon {
  return categoryIcons[name] ?? fallbackIcon;
}