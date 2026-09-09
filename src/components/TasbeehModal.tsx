import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Volume2, VolumeX, CheckCircle, Sparkles } from 'lucide-react';
import { Treasure } from '../types';
import confetti from 'canvas-confetti';

interface TasbeehModalProps {
  treasure: Treasure | null;
  onClose: () => void;
}

export const TasbeehModal: React.FC<TasbeehModalProps> = ({ treasure, onClose }) => {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState<number>(treasure?.repeatCount || 33);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    if (treasure?.repeatCount) {
      setTarget(treasure.repeatCount);
    }
    setCount(0);
  }, [treasure]);

  const playClickSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch {
      // AudioContext not allowed or supported
    }
  };

  const handleIncrement = () => {
    playClickSound();
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(25);
      } catch {
        // ignore
      }
    }

    const nextCount = count + 1;
    setCount(nextCount);

    if (nextCount === target) {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleReset = () => {
    setCount(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#e8e2d5] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#047857] to-[#065f46] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#fef08a]" />
            <h3 className="font-bold text-base sm:text-lg font-tajawal">
              المسبحة والعداد التفاعلي
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

        {/* Modal Content */}
        <div className="p-6 flex flex-col items-center">
          
          {/* Treasure Summary / Dhikr text */}
          {treasure ? (
            <div className="w-full text-center mb-5 p-3.5 rounded-2xl bg-[#faf7f0] border border-[#e8e2d5]">
              <p className="text-xs font-bold text-[#047857] mb-1">
                الكنز #{treasure.id}: {treasure.title}
              </p>
              <p className="font-amiri text-base sm:text-lg text-[#1f2937] font-semibold leading-relaxed line-clamp-3">
                «{treasure.hadith}»
              </p>
            </div>
          ) : (
            <p className="text-sm font-medium text-[#4b5563] mb-4">
              سبحان الله وبحمده، أستغفر الله وأتوب إليه
            </p>
          )}

          {/* Target Selector */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs font-semibold text-[#4b5563]">الهدف:</span>
            {[10, 33, 100, 1000].map(val => (
              <button
                key={val}
                onClick={() => setTarget(val)}
                className={`px-3 py-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                  target === val 
                    ? 'bg-[#047857] text-white shadow-2xs' 
                    : 'bg-[#f4f1ea] text-[#4b5563] hover:bg-[#e6e0d2]'
                }`}
              >
                {val}
              </button>
            ))}
          </div>

          {/* Big Circular Counter Bead */}
          <div 
            onClick={handleIncrement}
            className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-[#065f46] via-[#047857] to-[#059669] text-white shadow-xl shadow-[#047857]/30 flex flex-col items-center justify-center cursor-pointer select-none active:scale-95 transition-transform border-4 border-[#d1fae5]/40"
          >
            <span className="text-xs sm:text-sm font-medium text-emerald-100 tracking-wider">
              اضغط للعدّ
            </span>
            <span className="text-5xl sm:text-6xl font-extrabold font-mono tracking-tight my-1">
              {count}
            </span>
            <span className="text-xs text-emerald-200">
              من {target}
            </span>

            {/* Completion badge */}
            {count >= target && (
              <div className="absolute -top-2 -right-2 bg-[#fef08a] text-[#854d0e] p-2 rounded-full shadow-lg border border-[#fde047] animate-bounce">
                <CheckCircle className="w-6 h-6 fill-current" />
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-xs mt-6 bg-[#e5e7eb] h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-[#047857] h-full transition-all duration-300"
              style={{ width: `${Math.min(100, (count / target) * 100)}%` }}
            />
          </div>

          {/* Controls Footer */}
          <div className="w-full flex items-center justify-between mt-6 pt-4 border-t border-[#f0ece1]">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#4b5563] hover:bg-[#f3f4f6] cursor-pointer"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-[#047857]" />
                  <span>الصوت مفعّل</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-[#9ca3af]" />
                  <span>الصوت مكتوم</span>
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#dc2626] hover:bg-[#fef2f2] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة التصفير</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
