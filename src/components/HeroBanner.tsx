import { Sparkles, Award } from 'lucide-react';

interface HeroBannerProps {
  onOpenDaily: () => void;
  onOpenChecklist: () => void;
}

export function HeroBanner({ onOpenDaily, onOpenChecklist }: HeroBannerProps) {
  return (
    <section className="mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#065f46] text-white shadow-xl shadow-[#047857]/15 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#fef08a]/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-xs border border-white/20 mb-3 text-emerald-100">
          <Sparkles className="w-3.5 h-3.5 text-[#fef08a]" />
          <span>الموسوعة الشاملة لكنوز السنة النبوية</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold font-tajawal tracking-tight leading-snug mb-3">
          ١٤٠ كنزاً نبوياً من أعظم ما علّمنا رسول الله ﷺ
        </h2>

        <p className="text-sm sm:text-base text-emerald-100 leading-relaxed mb-6 font-light">
          محققة بالنص الكامل، التخريج الدقيق، وسر الفضيلة، وكيفية التطبيق العملي اليومي؛ جمعاً لما أفاض به فضيلة الشيخ <strong>محمود المصري (أبو عمار)</strong> في سلسلتي «كنوز من السنة» و«كنوز وأسرار».
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            id="hero-daily-btn"
            onClick={onOpenDaily}
            className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#fef08a] text-[#713f12] hover:bg-[#fde047] transition-all flex items-center gap-2 shadow-md cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#d97706]" />
            <span>طالع كنز اليوم المختار</span>
          </button>

          <button
            id="hero-checklist-btn"
            onClick={onOpenChecklist}
            className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs border border-white/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Award className="w-4 h-4 text-[#a7f3d0]" />
            <span>جدول الورد اليومي</span>
          </button>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-[#fef08a]">١٤٠</p>
          <p className="text-xs text-emerald-200">حديثاً وكنزاً موثقاً</p>
        </div>
        <div>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-[#fef08a]">٩</p>
          <p className="text-xs text-emerald-200">أبواب فقهية وحياتية</p>
        </div>
        <div>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-[#fef08a]">١٠٠٪</p>
          <p className="text-xs text-emerald-200">أحاديث صحيحة وحسنة</p>
        </div>
        <div>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-[#fef08a]">مجاني</p>
          <p className="text-xs text-emerald-200">صدقة جارية لوجه الله</p>
        </div>
      </div>
    </section>
  );
}