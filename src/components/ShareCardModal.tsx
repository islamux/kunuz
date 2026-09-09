import React, { useState } from 'react';
import { X, Copy, Check, Share2, Sparkles, Download } from 'lucide-react';
import { Treasure } from '../types';
import { formatTreasureForShare } from '../utils/arabicUtils';

interface ShareCardModalProps {
  treasure: Treasure | null;
  onClose: () => void;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({ treasure, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!treasure) return null;

  const handleCopyText = async () => {
    const text = formatTreasureForShare(treasure);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = formatTreasureForShare(treasure);
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleTelegramShare = () => {
    const text = formatTreasureForShare(treasure);
    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#e8e2d5] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#047857] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#fef08a]" />
            <h3 className="font-bold text-base sm:text-lg font-tajawal">
              مشاركة الكنز النبوي
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Preview Card */}
        <div className="p-6 overflow-y-auto">
          {/* Visual Poster Card */}
          <div 
            id="printable-treasure-card"
            className="p-6 rounded-2xl bg-gradient-to-br from-[#faf7f0] via-[#f5efe4] to-[#ede5d5] border-2 border-[#d6c7b0] shadow-md text-right relative overflow-hidden"
          >
            {/* Islamic Floral Corner Accents */}
            <div className="flex items-center justify-between border-b border-[#cfbfa6] pb-3 mb-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#047857]">
                <Sparkles className="w-4 h-4" />
                <span>كنوز من السنة المطهرة</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#047857] text-white">
                الكنز #{treasure.id}
              </span>
            </div>

            <h4 className="text-base sm:text-lg font-bold text-[#1f2937] mb-3">
              {treasure.title}
            </h4>

            {/* Hadith Quote */}
            <div className="my-3 p-4 rounded-xl bg-white/80 border border-[#dfd4c0] shadow-2xs">
              <p className="font-amiri text-lg sm:text-xl font-bold text-[#111827] leading-relaxed text-center">
                «{treasure.hadith}»
              </p>
            </div>

            {/* Attribution */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#4b5563] pt-2 mb-3">
              <span><strong>الراوي:</strong> {treasure.narrator}</span>
              <span><strong>المصدر:</strong> {treasure.source} ({treasure.grade})</span>
            </div>

            {/* Practical Action */}
            <div className="p-3 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] text-xs text-[#065f46] leading-relaxed">
              <strong>🎯 كيف تعمل به:</strong> {treasure.action}
            </div>

            <div className="mt-4 pt-3 border-t border-[#cfbfa6] text-center text-[11px] text-[#78716c]">
              محققة من سلسلة كنوز من السنة للشيخ محمود المصري حفظه الله
            </div>
          </div>

          {/* Quick Sharing Buttons */}
          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={handleCopyText}
              className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                copied
                  ? 'bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0]'
                  : 'bg-[#047857] text-white hover:bg-[#065f46]'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'تم نسخ نص الكنز كاملاً!' : 'نسخ الرسالة كاملة للمشاركة'}</span>
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleWhatsAppShare}
                className="py-2.5 px-3 rounded-xl font-medium text-xs bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] border border-[#25D366]/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>إرسال عبر واتساب</span>
              </button>

              <button
                onClick={handleTelegramShare}
                className="py-2.5 px-3 rounded-xl font-medium text-xs bg-[#0088cc]/15 hover:bg-[#0088cc]/25 text-[#0088cc] border border-[#0088cc]/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>إرسال عبر تيليجرام</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
