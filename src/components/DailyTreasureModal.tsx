import React, { useState } from 'react';
import { X, Sparkles, Flame, Bookmark, Share2, Copy, Check, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { Treasure, Chapter } from '../types';
import { ChapterIcon } from './ChapterIcon';
import { stripTashkeelForDisplay, formatTreasureForShare, speakArabicText, stopArabicSpeech } from '../utils/arabicUtils';

interface DailyTreasureModalProps {
  treasure: Treasure | null;
  chapter?: Chapter;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onClose: () => void;
  onOpenShare: (treasure: Treasure) => void;
  showTashkeel: boolean;
}

export const DailyTreasureModal: React.FC<DailyTreasureModalProps> = ({
  treasure,
  chapter,
  isFavorite,
  onToggleFavorite,
  onClose,
  onOpenShare,
  showTashkeel
}) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (!treasure) return null;

  const hadithText = showTashkeel ? treasure.hadith : stripTashkeelForDisplay(treasure.hadith);

  const handleCopy = async () => {
    const text = formatTreasureForShare(treasure);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#e8e2d5] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#d97706] to-[#b45309] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#fef08a] animate-pulse" />
            <div>
              <h3 className="font-bold text-base sm:text-lg font-tajawal">
                كنز اليوم النبوي المختار
              </h3>
              <p className="text-xs text-amber-100">
                حديث وكنز خاص متجدد يرفع همتك في طاعة الله
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#fef3c7] text-[#92400e] border border-[#fde68a]">
                الكنز #{treasure.id}
              </span>
              {chapter && (
                <span className={`px-2.5 py-1 text-xs font-medium rounded-lg ${chapter.colorClasses} border inline-flex items-center gap-1.5`}>
                  <ChapterIcon icon={chapter.icon} className="h-3.5 w-3.5" />
                  <span>{chapter.name}</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onToggleFavorite(treasure.id)}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isFavorite 
                    ? 'bg-[#fef2f2] text-[#dc2626] border-[#fecaca]' 
                    : 'text-[#9ca3af] hover:text-[#dc2626] hover:bg-[#fef2f2] border-transparent'
                }`}
                title={isFavorite ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
              >
                <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={() => onOpenShare(treasure)}
                className="p-2 text-[#6b7280] hover:text-[#047857] hover:bg-[#ecfdf5] rounded-xl transition-all cursor-pointer"
                title="مشاركة وبطاقة الكنز"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-[#1f2937]">
            {treasure.title}
          </h2>

          {/* Hadith Block */}
          <div className="p-5 rounded-2xl bg-[#faf7f0] border-2 border-[#e8dfcf] shadow-2xs text-center">
            <p className="font-amiri text-xl sm:text-2xl font-bold text-[#111827] leading-relaxed">
              «{hadithText}»
            </p>

            <div className="mt-4 pt-3 border-t border-[#ded4bf]/60 flex flex-wrap items-center justify-between gap-2 text-xs text-[#4b5563]">
              <span><strong>الراوي:</strong> {treasure.narrator}</span>
              <span><strong>المصدر:</strong> {treasure.source} ({treasure.grade})</span>
            </div>
          </div>

          {/* Practical Application */}
          <div className="p-4 rounded-2xl bg-[#ecfdf5] border border-[#a7f3d0]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#065f46] mb-1">
              <Sparkles className="w-4 h-4 text-[#059669]" />
              <span>واجبك وتطبيقك العملي لهذا اليوم:</span>
            </div>
            <p className="text-xs sm:text-sm text-[#065f46] font-medium leading-relaxed">
              {treasure.action}
            </p>
          </div>

          {/* Explanation */}
          <div className="p-4 rounded-2xl bg-[#fdfcf9] border border-[#ebe6dc]">
            <h4 className="text-xs font-bold text-[#374151] mb-1">
              شرح الكنز للشيخ محمود المصري:
            </h4>
            <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed">
              {treasure.explanation}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#faf8f5] border-t border-[#e8e2d5] flex items-center justify-between">
          <button
            onClick={handleToggleSpeech}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#e5e7eb] bg-white text-[#374151] flex items-center gap-1.5 cursor-pointer hover:bg-[#f3f4f6]"
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4 text-[#dc2626]" />
                <span>إيقاف الصوت</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-[#047857]" />
                <span>استمع للحديث</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopy}
            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#047857] text-white hover:bg-[#065f46] flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'تم النسخ' : 'نسخ الحديث كاملاً'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
