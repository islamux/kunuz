import React, { useState } from 'react';
import { 
  Bookmark, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  Share2, 
  Sparkles, 
  Compass, 
  ChevronDown, 
  ChevronUp, 
  BookOpen,
  Tag
} from 'lucide-react';
import { Treasure, Chapter } from '../types';
import { ChapterIcon } from './ChapterIcon';
import { stripTashkeelForDisplay, formatTreasureForShare, speakArabicText, stopArabicSpeech } from '../utils/arabicUtils';
import confetti from 'canvas-confetti';

interface TreasureCardProps {
  treasure: Treasure;
  chapter?: Chapter;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  showTashkeel: boolean;
  onOpenShareModal: (treasure: Treasure) => void;
  onOpenTasbeehModal: (treasure: Treasure) => void;
  onSelectTag?: (tag: string) => void;
}

export const TreasureCard: React.FC<TreasureCardProps> = ({
  treasure,
  chapter,
  isFavorite,
  onToggleFavorite,
  fontSize,
  showTashkeel,
  onOpenShareModal,
  onOpenTasbeehModal,
  onSelectTag
}) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [counter, setCounter] = useState(0);

  const hadithText = showTashkeel ? treasure.hadith : stripTashkeelForDisplay(treasure.hadith);

  const handleCopy = async () => {
    try {
      const shareText = formatTreasureForShare(treasure);
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      stopArabicSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const textToRead = `${treasure.title}. قال رسول الله صلى الله عليه وسلم: ${hadithText}. رواه ${treasure.narrator}.`;
      speakArabicText(
        textToRead,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        () => setIsSpeaking(false)
      );
    }
  };

  const handleIncrementCounter = () => {
    const target = treasure.repeatCount || 1;
    const nextCount = counter + 1;
    setCounter(nextCount);

    if (nextCount === target) {
      // Trigger subtle celebration
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.8 }
      });
    }
  };

  const resetCounter = () => {
    setCounter(0);
  };

  const hadithFontSizeClass = 
    fontSize === 'normal' 
      ? 'text-lg sm:text-xl leading-relaxed sm:leading-loose' 
      : fontSize === 'large' 
      ? 'text-xl sm:text-2xl leading-relaxed sm:leading-loose' 
      : 'text-2xl sm:text-3xl leading-loose';

  return (
    <article 
      id={`treasure-card-${treasure.id}`}
      className="bg-white rounded-2xl border border-[#e8e2d5] shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
    >
      {/* Header of the Card */}
      <div className="p-4 sm:p-6 pb-2">
        <div className="flex items-start justify-between gap-3 mb-3">
          
          {/* Chapter Badge & Treasure Number */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold rounded-lg bg-[#047857]/10 text-[#047857] border border-[#047857]/20">
              الكنز #{treasure.id}
            </span>

            {chapter && (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg ${chapter.colorClasses} border`}>
                <ChapterIcon icon={chapter.icon} className="h-3.5 w-3.5" />
                <span>{chapter.shortName}</span>
              </span>
            )}

            {treasure.timeContext && (
              <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-md bg-[#fef3c7] text-[#92400e] border border-[#fde68a]">
                ⏱️ {treasure.timeContext}
              </span>
            )}
          </div>

          {/* Quick Actions (Bookmark & Share) */}
          <div className="flex items-center gap-1">
            <button
              id={`fav-btn-${treasure.id}`}
              onClick={() => onToggleFavorite(treasure.id)}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isFavorite 
                  ? 'bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]' 
                  : 'text-[#9ca3af] hover:text-[#dc2626] hover:bg-[#fef2f2]'
              }`}
              title={isFavorite ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            <button
              id={`share-btn-${treasure.id}`}
              onClick={() => onOpenShareModal(treasure)}
              className="p-2 text-[#6b7280] hover:text-[#047857] hover:bg-[#ecfdf5] rounded-xl transition-all cursor-pointer"
              title="مشاركة وبطاقة الكنز"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-base sm:text-lg font-bold text-[#1f2937] leading-snug mb-3">
          {treasure.title}
        </h2>

        {/* Hadith Frame */}
        <div className="relative p-4 sm:p-5 rounded-xl bg-[#faf7f0] border border-[#ebe3d3] shadow-2xs my-3">
          <div className="text-center font-amiri text-[#111827] font-semibold tracking-wide select-text">
            <p className={hadithFontSizeClass}>
              «{hadithText}»
            </p>
          </div>

          {/* Narrator & Citation Ribbon */}
          <div className="mt-4 pt-3 border-t border-[#ded4bf]/60 flex flex-wrap items-center justify-between gap-2 text-xs text-[#4b5563]">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[#1f2937]">الراوي:</span>
              <span className="text-[#374151]">{treasure.narrator}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-medium text-[#1f2937]">المصدر:</span>
              <span className="text-[#374151]">{treasure.source}</span>
              <span className="px-1.5 py-0.5 text-[10px] rounded-md font-semibold bg-[#d1fae5] text-[#065f46] border border-[#a7f3d0]">
                {treasure.grade}
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Repeat Counter (If applicable) */}
        {treasure.repeatCount && treasure.repeatCount > 1 && (
          <div className="my-3 p-3 rounded-xl bg-gradient-to-r from-[#ecfdf5] to-[#f0fdf4] border border-[#a7f3d0] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#047857] text-white flex items-center justify-center font-bold text-xs">
                {treasure.repeatCount}x
              </div>
              <div>
                <p className="text-xs font-bold text-[#065f46]">
                  ورد التكرار النبوي: {treasure.repeatCount} مرة
                </p>
                <p className="text-[11px] text-[#047857]">
                  أنجزت: <span className="font-bold">{counter}</span> من {treasure.repeatCount}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                id={`counter-tap-${treasure.id}`}
                onClick={handleIncrementCounter}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs ${
                  counter >= treasure.repeatCount
                    ? 'bg-[#059669] text-white'
                    : 'bg-[#047857] text-white hover:bg-[#065f46] active:scale-95'
                }`}
              >
                <span>عدّ (+١)</span>
                {counter >= treasure.repeatCount && <Check className="w-3.5 h-3.5" />}
              </button>

              {counter > 0 && (
                <button
                  onClick={resetCounter}
                  className="px-2 py-1 rounded-lg text-[11px] font-medium bg-[#f3f4f6] text-[#6b7280] hover:bg-[#e5e7eb] cursor-pointer"
                  title="تصفير العداد"
                >
                  تصفير
                </button>
              )}

              <button
                id={`open-tasbeeh-${treasure.id}`}
                onClick={() => onOpenTasbeehModal(treasure)}
                className="p-1.5 rounded-lg text-[#047857] hover:bg-[#d1fae5] transition-all cursor-pointer"
                title="فتح في المسبحة الإلكترونية الكبيرة"
              >
                <Compass className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Action / How to Apply */}
        <div className="my-3 p-3.5 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0]">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#166534] mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#16a34a]" />
            <span>كيف تعمل بهذا الكنز النبوي؟</span>
          </div>
          <p className="text-xs sm:text-sm text-[#14532d] leading-relaxed">
            {treasure.action}
          </p>
        </div>

        {/* Collapsible Explanation & Virtue */}
        <div className="mt-2 border-t border-[#f3eee4] pt-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between text-xs font-semibold text-[#4b5563] hover:text-[#047857] py-1 cursor-pointer transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>شرح الكنز وفضيلته للشيخ محمود المصري</span>
            </span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {isExpanded && (
            <div className="mt-1.5 text-xs sm:text-sm text-[#4b5563] leading-relaxed bg-[#fdfcf9] p-3 rounded-lg border border-[#f3eee4]">
              {treasure.explanation}
            </div>
          )}
        </div>

        {/* Tags */}
        {treasure.tags && treasure.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3 pt-2">
            {treasure.tags.map(tag => (
              <button
                key={tag}
                onClick={() => onSelectTag && onSelectTag(tag)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] bg-[#f4f1ea] text-[#52525b] hover:bg-[#e4decb] hover:text-[#047857] transition-all cursor-pointer"
              >
                <Tag className="w-2.5 h-2.5 text-[#9ca3af]" />
                <span>{tag}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer Utility Bar */}
      <div className="px-4 sm:px-6 py-2.5 bg-[#fbf9f5] border-t border-[#e8e2d5] flex items-center justify-between">
        <button
          id={`listen-btn-${treasure.id}`}
          onClick={handleToggleSpeech}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            isSpeaking
              ? 'bg-[#fee2e2] text-[#b91c1c] border border-[#fca5a5]'
              : 'bg-white text-[#374151] hover:bg-[#f3f4f6] border border-[#e5e7eb]'
          }`}
        >
          {isSpeaking ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-[#ef4444] animate-pulse" />
              <span>إيقاف الصوت</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#047857]" />
              <span>استمع للحديث</span>
            </>
          )}
        </button>

        <button
          id={`copy-btn-${treasure.id}`}
          onClick={handleCopy}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            copied
              ? 'bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0]'
              : 'bg-white text-[#374151] hover:bg-[#f3f4f6] border border-[#e5e7eb]'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#059669]" />
              <span>تم النسخ بنجاح</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#6b7280]" />
              <span>نسخ الحديث كاملاً</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
};
