import { describe, expect, it } from 'vitest';
import { formatTreasureForShare } from './share';
import { Treasure } from '../types';

const treasure: Treasure = {
  id: 7,
  title: 'فضل الذكر',
  chapterId: 'daily-dhikr',
  hadith: 'أفضل الكلام بعد القرآن',
  narrator: 'أبو هريرة',
  source: 'متفق عليه',
  grade: 'صحيح',
  explanation: 'بيان فضل الذكر',
  action: 'أكثر من الذكر في يومك',
  tags: ['ذكر'],
};

describe('formatTreasureForShare', () => {
  const output = formatTreasureForShare(treasure);

  it('includes the title', () => {
    expect(output).toContain(treasure.title);
  });

  it('includes the hadith', () => {
    expect(output).toContain(treasure.hadith);
  });

  it('includes the narrator', () => {
    expect(output).toContain(treasure.narrator);
  });

  it('includes the source', () => {
    expect(output).toContain(treasure.source);
  });

  it('includes the grade', () => {
    expect(output).toContain(treasure.grade);
  });

  it('includes the explanation', () => {
    expect(output).toContain(treasure.explanation);
  });

  it('includes the action', () => {
    expect(output).toContain(treasure.action);
  });
});