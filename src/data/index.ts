import { Treasure, Chapter, ChapterId } from '../types';
import { CHAPTERS } from './chapters';
import { TREASURES_PART_1 } from './treasuresPart1';
import { TREASURES_PART_2 } from './treasuresPart2';
import { TREASURES_PART_3 } from './treasuresPart3';
import { TREASURES_PART_4 } from './treasuresPart4';

export const ALL_TREASURES: Treasure[] = [
  ...TREASURES_PART_1,
  ...TREASURES_PART_2,
  ...TREASURES_PART_3,
  ...TREASURES_PART_4
];

export { CHAPTERS };

export function getChapterById(id: ChapterId): Chapter | undefined {
  return CHAPTERS.find(c => c.id === id);
}

export function getTreasuresByChapter(chapterId: ChapterId): Treasure[] {
  return ALL_TREASURES.filter(t => t.chapterId === chapterId);
}

export function getTreasureById(id: number): Treasure | undefined {
  return ALL_TREASURES.find(t => t.id === id);
}

export function getRandomTreasure(): Treasure {
  const index = Math.floor(Math.random() * ALL_TREASURES.length);
  return ALL_TREASURES[index];
}

export function getDailyTreasure(): Treasure {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
  );
  const index = Math.abs(dayOfYear) % ALL_TREASURES.length;
  return ALL_TREASURES[index];
}
