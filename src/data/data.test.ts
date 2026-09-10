import { describe, expect, it } from 'vitest';
import { ChapterId } from '../types';
import {
  ALL_TREASURES,
  CHAPTERS,
  CHAPTER_COUNTS,
  TOTAL_TREASURES,
  getDailyTreasure,
  getRandomTreasure
} from './index';

const VALID_CHAPTER_IDS: ChapterId[] = [
  'daily-dhikr',
  'prayers-mosques',
  'expiation-repentance',
  'relief-ruqyah',
  'quran-virtues',
  'morals-relations',
  'charity-ongoing',
  'fasting-seasons',
  'manners-sunan'
];

const VALID_ICON_NAMES = [
  'Sun',
  'Compass',
  'Sparkles',
  'ShieldCheck',
  'BookOpen',
  'HeartHandshake',
  'Coins',
  'Moon',
  'ScrollText'
];

const REQUIRED_FIELDS = ['title', 'hadith', 'narrator', 'source', 'grade', 'explanation', 'action'];

describe('ALL_TREASURES', () => {
  it('contains exactly 140 treasures with ids 1..140 and no duplicates', () => {
    expect(ALL_TREASURES).toHaveLength(140);
    const ids = ALL_TREASURES.map(t => t.id).slice().sort((a, b) => a - b);
    expect(ids).toEqual(Array.from({ length: 140 }, (_, i) => i + 1));
  });

  it('every treasure has all required fields non-empty', () => {
    for (const treasure of ALL_TREASURES) {
      for (const field of REQUIRED_FIELDS) {
        const value = String((treasure as unknown as Record<string, unknown>)[field]);
        expect(value.trim(), `${field} must be non-empty on treasure ${treasure.id}`).toBeTruthy();
      }
    }
  });

  it('every treasure has a valid chapterId', () => {
    for (const treasure of ALL_TREASURES) {
      expect(VALID_CHAPTER_IDS, `treasure ${treasure.id}`).toContain(treasure.chapterId);
    }
  });
});

describe('CHAPTER_COUNTS', () => {
  it('sums to TOTAL_TREASURES', () => {
    const sum = Object.values(CHAPTER_COUNTS).reduce((acc, count) => acc + count, 0);
    expect(sum).toBe(TOTAL_TREASURES);
  });

  it('has an entry for every valid chapter id', () => {
    for (const id of VALID_CHAPTER_IDS) {
      expect(CHAPTER_COUNTS[id], `missing count for ${id}`).toBeDefined();
    }
  });
});

describe('CHAPTERS', () => {
  it('each chapter has a non-empty colorClasses string', () => {
    for (const chapter of CHAPTERS) {
      expect(chapter.colorClasses.trim(), chapter.id).toBeTruthy();
    }
  });

  it('each chapter has a valid icon name', () => {
    for (const chapter of CHAPTERS) {
      expect(VALID_ICON_NAMES, chapter.id).toContain(chapter.icon);
    }
  });
});

describe('getDailyTreasure', () => {
  it('is deterministic within the same day', () => {
    expect(getDailyTreasure().id).toBe(getDailyTreasure().id);
  });

  it('returns a treasure that is a member of ALL_TREASURES', () => {
    const daily = getDailyTreasure();
    expect(ALL_TREASURES.find(t => t.id === daily.id)).toBeDefined();
  });
});

describe('getRandomTreasure', () => {
  it('returns a treasure that is a member of ALL_TREASURES', () => {
    const random = getRandomTreasure();
    expect(ALL_TREASURES.find(t => t.id === random.id)).toBeDefined();
  });

  it('does not always return the same id over 100 calls', () => {
    const ids = new Set<number>();
    for (let i = 0; i < 100; i++) {
      ids.add(getRandomTreasure().id);
    }
    expect(ids.size).toBeGreaterThan(1);
  });
});