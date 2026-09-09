import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  Coins,
  Compass,
  HeartHandshake,
  Moon,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Sun
} from 'lucide-react';
import { ChapterIconName } from '../types';

const CHAPTER_ICONS: Record<ChapterIconName, LucideIcon> = {
  Sun,
  Compass,
  Sparkles,
  ShieldCheck,
  BookOpen,
  HeartHandshake,
  Coins,
  Moon,
  ScrollText
};

interface ChapterIconProps {
  icon: ChapterIconName;
  className?: string;
}

export function ChapterIcon({ icon, className }: ChapterIconProps) {
  const Icon = CHAPTER_ICONS[icon];
  return <Icon className={className} />;
}
