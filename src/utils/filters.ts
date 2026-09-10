import { Treasure, TabId, ChapterId } from '../types';
import { matchesSearch } from './arabic';

export interface FilterOptions {
  activeTab: TabId;
  favorites: number[];
  selectedChapter: ChapterId | 'all';
  selectedTag: string | null;
  searchQuery: string;
}

export function filterTreasures(
  treasures: Treasure[],
  { activeTab, favorites, selectedChapter, selectedTag, searchQuery }: FilterOptions
): Treasure[] {
  return treasures.filter(treasure => {
    if (activeTab === 'favorites' && !favorites.includes(treasure.id)) {
      return false;
    }

    if (selectedChapter !== 'all' && treasure.chapterId !== selectedChapter) {
      return false;
    }

    if (selectedTag && (!treasure.tags || !treasure.tags.includes(selectedTag))) {
      return false;
    }

    if (searchQuery.trim()) {
      const fullContent = `${treasure.title} ${treasure.hadith} ${treasure.narrator} ${treasure.source} ${treasure.explanation} ${treasure.action} ${(treasure.tags || []).join(' ')}`;
      if (!matchesSearch(fullContent, searchQuery)) {
        return false;
      }
    }

    return true;
  });
}