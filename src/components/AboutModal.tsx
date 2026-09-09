import React from 'react';
import { X, Sparkles, Heart, BookOpen, Layers, CheckCircle } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#e8e2d5] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#047857] to-[#065f46] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#fef08a]" />
            <h3 className="font-bold text-base sm:text-lg font-tajawal">
              عن تطبيق كنوز من السنة النبوية
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-[#374151] leading-relaxed">
          
          <div className="p-4 rounded-2xl bg-[#faf7f0] border border-[#e8e2d5]">
            <h4 className="font-bold text-[#065f46] text-sm sm:text-base mb-1">
              موسوعة جامعة لـ ١٤٠ كنزاً نبوياً أصيلاً
            </h4>
            <p className="text-[#4b5563]">
              هذا التطبيق ثمرة حصر وفهرسة دقيقة لأحاديث سلسلتي <strong>«كنوز من السنة»</strong> و<strong>«كنوز وأسرار»</strong> لفضيلة الشيخ الداعية <strong>محمود المصري (أبو عمار)</strong> حفظه الله ونفع بعلمه، مع التوثيق المباشر بنص الحديث، الراوي، المخرج، الدرجة، والشرح العملي الميسر.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#1f2937] mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#047857]" />
              <span>الأبواب التسعة للموسوعة:</span>
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <li className="p-2 rounded-lg bg-[#f0fdf4] border border-[#bbf7d0]">
                🌿 <strong>أذكار اليوم والليلة:</strong> تحصين الصباح والمساء واليوم.
              </li>
              <li className="p-2 rounded-lg bg-[#eff6ff] border border-[#bfdbfe]">
                🕌 <strong>الصلاة والمساجد:</strong> السنن الرواتب، الجماعة، التهجد.
              </li>
              <li className="p-2 rounded-lg bg-[#fefce8] border border-[#fef08a]">
                🕊️ <strong>مغفرة الذنوب والتوبة:</strong> الاستغفار والمكفرات الكبرى.
              </li>
              <li className="p-2 rounded-lg bg-[#fdf2f8] border border-[#fbcfe8]">
                🛡️ <strong>تفريج الكروب والرقية:</strong> أسلحة الشدائد والشفاء.
              </li>
              <li className="p-2 rounded-lg bg-[#ecfdf5] border border-[#a7f3d0]">
                📖 <strong>فضائل القرآن الكريم:</strong> السور المنجية والآيات الكوافل.
              </li>
              <li className="p-2 rounded-lg bg-[#faf5ff] border border-[#e9d5ff]">
                🤝 <strong>الأخلاق وصلة الأرحام:</strong> بر الوالدين وتفريج كرب الناس.
              </li>
              <li className="p-2 rounded-lg bg-[#fff7ed] border border-[#fed7aa]">
                💧 <strong>الصدقات والأجور الجارية:</strong> سقي الماء والسبع الجارية.
              </li>
              <li className="p-2 rounded-lg bg-[#f0fdfa] border border-[#99f6e4]">
                🌙 <strong>الصيام ومواسم الخيرات:</strong> عرفة، عاشوراء، وست شوال.
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46]">
            <h4 className="font-bold mb-1 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-[#059669]" />
              <span>نصيحة الشيخ محمود المصري في العمل بالكنوز:</span>
            </h4>
            <p className="text-xs sm:text-sm">
              «لا تشترط على نفسك أن تطبق كل الكنوز في يوم واحد فتصاب بالفتور؛ بل خذ كل أسبوع كنزاً أو كنزين واجعلهما عادة راسخة في يومك وليلتك، وتذكر قول حبيبك المصطفى ﷺ: "أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ"».
            </p>
          </div>

          <div className="text-center pt-2 text-xs text-[#6b7280]">
            نسأل الله أن يجعل هذا العمل خالصاً لوجهه الكريم، وأن يتقبل من فضيلة الشيخ محمود المصري ومن كل من ساهم في نشره وتعلمه والعمل به.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#faf8f5] border-t border-[#e8e2d5] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#047857] text-white text-xs font-bold hover:bg-[#065f46] cursor-pointer"
          >
            حفظكم الله وجزاكم خيراً
          </button>
        </div>
      </div>
    </div>
  );
};
