import { Treasure, ChapterId, FontSize } from '../types';
import { getChapterById } from '../data';
import { TreasureCard } from './TreasureCard';
import { EmptyState } from './EmptyState';

interface TreasureGridProps {
  treasures: Treasure[];
  favorites: number[];
  fontSize: FontSize;
  showTashkeel: boolean;
  onToggleFavorite: (id: number) => void;
  onOpenShareModal: (treasure: Treasure) => void;
  onOpenTasbeehModal: (treasure: Treasure) => void;
  onSelectTag: (tag: string) => void;
  onClearFilters: () => void;
}

export function TreasureGrid({
  treasures,
  favorites,
  fontSize,
  showTashkeel,
  onToggleFavorite,
  onOpenShareModal,
  onOpenTasbeehModal,
  onSelectTag,
  onClearFilters,
}: TreasureGridProps) {
  if (treasures.length === 0) {
    return <EmptyState onClearFilters={onClearFilters} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
      {treasures.map(treasure => {
        const chapter = getChapterById(treasure.chapterId);
        const isFav = favorites.includes(treasure.id);

        return (
          <TreasureCard
            key={treasure.id}
            treasure={treasure}
            chapter={chapter}
            isFavorite={isFav}
            onToggleFavorite={onToggleFavorite}
            fontSize={fontSize}
            showTashkeel={showTashkeel}
            onOpenShareModal={onOpenShareModal}
            onOpenTasbeehModal={onOpenTasbeehModal}
            onSelectTag={onSelectTag}
          />
        );
      })}
    </div>
  );
}