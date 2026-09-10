import { getChapterById } from '../data';
import { ChapterId } from '../types';

interface ActiveFiltersBarProps {
  selectedChapter: ChapterId | 'all';
  searchQuery: string;
  selectedTag: string | null;
  resultCount: number;
  onClearChapter: () => void;
  onClearSearch: () => void;
  onClearTag: () => void;
  onClearAll: () => void;
}

export function ActiveFiltersBar({
  selectedChapter,
  searchQuery,
  selectedTag,
  resultCount,
  onClearChapter,
  onClearSearch,
  onClearTag,
  onClearAll,
}: ActiveFiltersBarProps) {
  return (
    <div className="mb-6 p-3 rounded-xl bg-white border border-[#e8e2d5] flex flex-wrap items-center justify-between gap-3 text-xs text-[#4b5563]">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-bold text-[#1f2937]">عوامل التصفية النشطة:</span>

        {selectedChapter !== 'all' && (
          <span className="px-2.5 py-1 rounded-lg bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0] flex items-center gap-1">
            <span>الباب: {getChapterById(selectedChapter)?.name}</span>
            <button onClick={onClearChapter} className="hover:text-red-500 cursor-pointer">✕</button>
          </span>
        )}

        {searchQuery && (
          <span className="px-2.5 py-1 rounded-lg bg-[#eff6ff] text-[#1e40af] border border-[#bfdbfe] flex items-center gap-1">
            <span>البحث: "{searchQuery}"</span>
            <button onClick={onClearSearch} className="hover:text-red-500 cursor-pointer">✕</button>
          </span>
        )}

        {selectedTag && (
          <span className="px-2.5 py-1 rounded-lg bg-[#fef3c7] text-[#92400e] border border-[#fde68a] flex items-center gap-1">
            <span>الوسم: #{selectedTag}</span>
            <button onClick={onClearTag} className="hover:text-red-500 cursor-pointer">✕</button>
          </span>
        )}

        <span className="text-[#6b7280]">
          (وجدنا {resultCount} كنزاً)
        </span>
      </div>

      <button
        onClick={onClearAll}
        className="px-3 py-1 text-xs rounded-lg text-[#dc2626] hover:bg-[#fef2f2] font-semibold cursor-pointer transition-colors"
      >
        إلغاء التصفية
      </button>
    </div>
  );
}