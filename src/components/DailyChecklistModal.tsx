import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, RotateCcw, Award, Flame, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SunnahTask {
  id: string;
  title: string;
  category: string;
  reward: string;
}

const DEFAULT_DAILY_TASKS: SunnahTask[] = [
  { id: 'morning-dhikr', title: 'أذكار الصباح كاملة وسيد الاستغفار', category: 'أذكار', reward: 'حفظ وكفاية ومغفرة تامة' },
  { id: 'evening-dhikr', title: 'أذكار المساء والمعوذات ثلاثاً', category: 'أذكار', reward: 'أمان من كل شر وهامة' },
  { id: 'salat-duha', title: 'صلاة ركعتي الضحى', category: 'صلاة', reward: 'صدقة عن ٣٦٠ مفصلاً في الجسد' },
  { id: 'ayat-kursi', title: 'قراءة آية الكرسي دبر كل صلاة مكتوبة', category: 'قرآن', reward: 'لا يمنعه من دخول الجنة إلا الموت' },
  { id: 'istighfar-100', title: 'الاستغفار مائة مرة (أستغفر الله وأتوب إليه)', category: 'استغفار', reward: 'طوبى وشجرة الجنة وتفريج الهم' },
  { id: 'salawat-nabi', title: 'الصلاة على النبي ﷺ عشر مرات', category: 'صلاة', reward: 'عشر صلوات ومحو عشر خطايا' },
  { id: 'daily-charity', title: 'صدقة اليوم (ولو بشق تمرة أو ماء أو ابتسامة)', category: 'صدقة', reward: 'تطفئ غضب الرب وتستظل بظلها' },
  { id: 'salat-witr', title: 'صلاة الوتر قبل النوم', category: 'صلاة', reward: 'إن الله وتر يحب الوتر' }
];

interface DailyChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyChecklistModal: React.FC<DailyChecklistModalProps> = ({ isOpen, onClose }) => {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [streak, setStreak] = useState<number>(1);

  // Load from localStorage
  useEffect(() => {
    try {
      const todayKey = `sunnah-tasks-${new Date().toISOString().slice(0, 10)}`;
      const savedTasks = localStorage.getItem(todayKey);
      if (savedTasks) {
        setCompleted(JSON.parse(savedTasks));
      }

      const savedStreak = localStorage.getItem('sunnah-streak');
      if (savedStreak) {
        setStreak(parseInt(savedStreak, 10));
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleTask = (taskId: string) => {
    const nextCompleted = {
      ...completed,
      [taskId]: !completed[taskId]
    };
    setCompleted(nextCompleted);

    try {
      const todayKey = `sunnah-tasks-${new Date().toISOString().slice(0, 10)}`;
      localStorage.setItem(todayKey, JSON.stringify(nextCompleted));
    } catch {
      // ignore
    }

    // Check if all completed
    const allDone = DEFAULT_DAILY_TASKS.every(t => nextCompleted[t.id]);
    if (allDone) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    }
  };

  const completedCount = Object.values(completed).filter(Boolean).length;
  const percentage = Math.round((completedCount / DEFAULT_DAILY_TASKS.length) * 100);

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
            <Award className="w-5 h-5 text-[#fef08a]" />
            <div>
              <h3 className="font-bold text-base sm:text-lg font-tajawal">
                الورد اليومي للسنن النبوية
              </h3>
              <p className="text-xs text-emerald-100">
                جدول تطبيقي للمحافظة على أجور الكنوز يوماً بيوم
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

        {/* Progress & Streak Bar */}
        <div className="px-6 py-4 bg-[#faf8f5] border-b border-[#e8e2d5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] flex items-center justify-center text-sm font-extrabold text-[#047857]">
              {percentage}%
            </div>
            <div>
              <p className="text-xs font-bold text-[#1f2937]">
                إنجاز اليوم: {completedCount} من {DEFAULT_DAILY_TASKS.length} سنن
              </p>
              <div className="w-36 bg-[#e5e7eb] h-2 rounded-full mt-1 overflow-hidden">
                <div 
                  className="bg-[#047857] h-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#fef3c7] border border-[#fde68a] text-xs font-bold text-[#92400e]">
            <Flame className="w-4 h-4 text-[#d97706]" />
            <span>حماسة {streak} أيام</span>
          </div>
        </div>

        {/* Checklist items */}
        <div className="p-6 overflow-y-auto space-y-3">
          {DEFAULT_DAILY_TASKS.map(task => {
            const isDone = !!completed[task.id];

            return (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                  isDone 
                    ? 'bg-[#f0fdf4] border-[#86efac] text-[#166534]' 
                    : 'bg-white hover:bg-[#faf8f5] border-[#e8e2d5] text-[#1f2937]'
                }`}
              >
                <div className="mt-0.5">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-[#16a34a] fill-current" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#9ca3af]" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-sm font-bold ${isDone ? 'line-through text-[#15803d]' : 'text-[#1f2937]'}`}>
                      {task.title}
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-[#f4f1ea] text-[#52525b]">
                      {task.category}
                    </span>
                  </div>
                  <p className="text-xs text-[#6b7280] mt-0.5">
                    ✨ الفضل: {task.reward}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#faf8f5] border-t border-[#e8e2d5] flex items-center justify-between text-xs text-[#6b7280]">
          <span>«أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ»</span>
          <button
            onClick={() => setCompleted({})}
            className="text-xs text-[#dc2626] hover:underline cursor-pointer"
          >
            تصفير اليوم
          </button>
        </div>
      </div>
    </div>
  );
};
