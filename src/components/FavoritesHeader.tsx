import { Bookmark } from 'lucide-react';

interface FavoritesHeaderProps {
  shownCount: number;
  totalFavorites: number;
  onClearAll: () => void;
}

export function FavoritesHeader({ shownCount, totalFavorites, onClearAll }: FavoritesHeaderProps) {
  return (
    <div className="mb-6 p-4 rounded-2xl bg-[#fff1f2] border border-[#fecdd3] flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Bookmark className="w-5 h-5 text-[#e11d48] fill-current" />
        <div>
          <h3 className="font-bold text-sm sm:text-base text-[#9f1239]">
            الكنوز المحفوظة في المفضلة ({shownCount})
          </h3>
          <p className="text-xs text-[#be123c]">
            أحاديثك المختارة للرجوع إليها ومداومة العمل بها
          </p>
        </div>
      </div>
      {totalFavorites > 0 && (
        <button
          onClick={onClearAll}
          className="text-xs text-[#be123c] hover:underline cursor-pointer"
        >
          تفريغ المفضلة
        </button>
      )}
    </div>
  );
}