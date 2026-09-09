import React from 'react';
import { Chapter, ChapterId } from '../types';
import { CHAPTERS, ALL_TREASURES } from '../data';
import { ChapterIcon } from './ChapterIcon';

interface ChapterFilterProps {
  selectedChapter: ChapterId | 'all';
  onSelectChapter: (id: ChapterId | 'all') => void;
  variant?: 'chips' | 'grid';
}

export const ChapterFilter: React.FC<ChapterFilterProps> = ({
  selectedChapter,
  onSelectChapter,
  variant = 'chips'
}) => {
  const getChapterCount = (id: ChapterId) => {
    return ALL_TREASURES.filter(t => t.chapterId === id).length;
  };

  if (variant === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
        <div
          onClick={() => onSelectChapter('all')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            selectedChapter === 'all'
              ? 'bg-[#047857] text-white border-[#047857] shadow-md'
              : 'bg-white hover:bg-[#f9f7f2] border-[#e8e2d5] text-[#1f2937]'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">🌟</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              selectedChapter === 'all' ? 'bg-white/20 text-white' : 'bg-[#e5e7eb] text-[#374151]'
            }`}>
              {ALL_TREASURES.length} كنزاً
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-1">جميع الكنوز النبوية</h3>
            <p className={`text-xs ${selectedChapter === 'all' ? 'text-emerald-100' : 'text-[#6b7280]'}`}>
              استعراض شامل لجميع الأحاديث والكنوز من السلسلتين
            </p>
          </div>
        </div>

        {CHAPTERS.map(chapter => {
          const count = getChapterCount(chapter.id);
          const isSelected = selectedChapter === chapter.id;

          return (
            <div
              key={chapter.id}
              onClick={() => onSelectChapter(chapter.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#047857] text-white border-[#047857] shadow-md'
                  : 'bg-white hover:bg-[#f9f7f2] border-[#e8e2d5] text-[#1f2937]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <ChapterIcon icon={chapter.icon} className="h-6 w-6" />
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#e5e7eb] text-[#374151]'
                }`}>
                  {count} كنزاً
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">{chapter.name}</h3>
                <p className={`text-xs ${isSelected ? 'text-emerald-100' : 'text-[#6b7280]'}`}>
                  {chapter.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 my-2">
      <button
        onClick={() => onSelectChapter('all')}
        className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
          selectedChapter === 'all'
            ? 'bg-[#047857] text-white shadow-xs'
            : 'bg-white text-[#4b5563] hover:bg-[#f4f1ea] border border-[#e2dccf]'
        }`}
      >
        🌟 الكل ({ALL_TREASURES.length})
      </button>

      {CHAPTERS.map(chapter => {
        const count = getChapterCount(chapter.id);
        const isSelected = selectedChapter === chapter.id;

        return (
          <button
            key={chapter.id}
            onClick={() => onSelectChapter(chapter.id)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
              isSelected
                ? 'bg-[#047857] text-white shadow-xs'
                : 'bg-white text-[#4b5563] hover:bg-[#f4f1ea] border border-[#e2dccf]'
            }`}
          >
            <ChapterIcon icon={chapter.icon} className="h-3.5 w-3.5" />
            <span>{chapter.shortName}</span>
            <span className={`px-1.5 py-0.2 text-[11px] rounded-full font-bold ${
              isSelected ? 'bg-white/20 text-white' : 'bg-[#f3f4f6] text-[#6b7280]'
            }`}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
