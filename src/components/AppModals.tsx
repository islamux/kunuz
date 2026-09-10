import { Treasure } from '../types';
import { getChapterById } from '../data';
import { DailyTreasureModal } from './DailyTreasureModal';
import { TasbeehModal } from './TasbeehModal';
import { ShareCardModal } from './ShareCardModal';
import { DailyChecklistModal } from './DailyChecklistModal';
import { AboutModal } from './AboutModal';

interface AppModalsProps {
  dailyTreasure: Treasure;
  dailyModalOpen: boolean;
  onCloseDaily: () => void;
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  shareTreasure: Treasure | null;
  onCloseShare: () => void;
  onOpenShare: (treasure: Treasure) => void;
  tasbeehTreasure: Treasure | null;
  onCloseTasbeeh: () => void;
  checklistModalOpen: boolean;
  onCloseChecklist: () => void;
  aboutModalOpen: boolean;
  onCloseAbout: () => void;
  showTashkeel: boolean;
}

export function AppModals({
  dailyTreasure,
  dailyModalOpen,
  onCloseDaily,
  favorites,
  onToggleFavorite,
  shareTreasure,
  onCloseShare,
  onOpenShare,
  tasbeehTreasure,
  onCloseTasbeeh,
  checklistModalOpen,
  onCloseChecklist,
  aboutModalOpen,
  onCloseAbout,
  showTashkeel,
}: AppModalsProps) {
  return (
    <>
      {dailyModalOpen && (
        <DailyTreasureModal
          treasure={dailyTreasure}
          chapter={getChapterById(dailyTreasure.chapterId)}
          isFavorite={favorites.includes(dailyTreasure.id)}
          onToggleFavorite={onToggleFavorite}
          onClose={onCloseDaily}
          onOpenShare={onOpenShare}
          showTashkeel={showTashkeel}
        />
      )}

      {tasbeehTreasure !== null && (
        <TasbeehModal
          treasure={tasbeehTreasure}
          onClose={onCloseTasbeeh}
        />
      )}

      {shareTreasure && (
        <ShareCardModal
          treasure={shareTreasure}
          onClose={onCloseShare}
        />
      )}

      <DailyChecklistModal
        isOpen={checklistModalOpen}
        onClose={onCloseChecklist}
      />

      <AboutModal
        isOpen={aboutModalOpen}
        onClose={onCloseAbout}
      />
    </>
  );
}