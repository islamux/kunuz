export type ChapterId =
  | 'daily-dhikr'
  | 'prayers-mosques'
  | 'expiation-repentance'
  | 'relief-ruqyah'
  | 'quran-virtues'
  | 'morals-relations'
  | 'charity-ongoing'
  | 'fasting-seasons'
  | 'manners-sunan';

export type ChapterIconName =
  | 'Sun'
  | 'Compass'
  | 'Sparkles'
  | 'ShieldCheck'
  | 'BookOpen'
  | 'HeartHandshake'
  | 'Coins'
  | 'Moon'
  | 'ScrollText';

export interface Chapter {
  id: ChapterId;
  name: string;
  shortName: string;
  icon: ChapterIconName;
  description: string;
  colorClasses: string;
}

export interface Treasure {
  id: number;
  title: string;
  chapterId: ChapterId;
  hadith: string;
  narrator: string;
  source: string;
  grade: string;
  explanation: string;
  action: string;
  repeatCount?: number;
  timeContext?: string;
  tags: string[];
  isSpecialDailyCandidate?: boolean;
}

export type TabId = 'all' | 'chapters' | 'favorites';

export type FontSize = 'normal' | 'large' | 'xlarge';
