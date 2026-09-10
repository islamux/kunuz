import { describe, expect, it } from 'vitest';
import { ALL_TREASURES } from '../data';
import { TabId } from '../types';
import { filterTreasures } from './filters';

const baseOpts = {
  activeTab: 'all' as TabId,
  favorites: [] as number[],
  selectedChapter: 'all' as const,
  selectedTag: null as string | null,
  searchQuery: '',
};

describe('filterTreasures', () => {
  it('returns all treasures with no filters applied', () => {
    expect(filterTreasures(ALL_TREASURES, baseOpts)).toHaveLength(ALL_TREASURES.length);
  });

  it('limits to favorites on the favorites tab', () => {
    const favorites = [ALL_TREASURES[0].id, ALL_TREASURES[3].id];
    const result = filterTreasures(ALL_TREASURES, { ...baseOpts, activeTab: 'favorites', favorites });
    expect(result.map(t => t.id).sort()).toEqual([...favorites].sort());
  });

  it('filters by selected chapter', () => {
    const chapterId = ALL_TREASURES[0].chapterId;
    const result = filterTreasures(ALL_TREASURES, { ...baseOpts, selectedChapter: chapterId });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every(t => t.chapterId === chapterId)).toBe(true);
  });

  it('returns empty for an unknown tag', () => {
    const result = filterTreasures(ALL_TREASURES, { ...baseOpts, selectedTag: 'tag-does-not-exist' });
    expect(result).toEqual([]);
  });

  it('matches a search query found in a title', () => {
    const source = ALL_TREASURES[0];
    const term = source.title.split(' ')[0];
    const result = filterTreasures(ALL_TREASURES, { ...baseOpts, searchQuery: term });
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns everything for an empty query', () => {
    const result = filterTreasures(ALL_TREASURES, { ...baseOpts, searchQuery: '  ' });
    expect(result).toHaveLength(ALL_TREASURES.length);
  });
});