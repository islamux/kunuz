interface FooterProps {
  onOpenAbout: () => void;
}

export function Footer({ onOpenAbout }: FooterProps) {
  return (
    <footer className="mt-12 bg-white border-t border-[#e8e2d5] py-8 text-center text-xs text-[#6b7280]">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#047857] text-white flex items-center justify-center font-bold text-xs">
            💎
          </div>
          <span className="font-bold text-[#065f46] text-sm">
            كنوز من السنة النبوية
          </span>
        </div>

        <p className="text-xs text-[#78716c]">
          نسأل الله أن يجزي فضيلة الشيخ محمود المصري خير الجزاء وأن ينفع به المسلمين.
        </p>

        <button
          onClick={onOpenAbout}
          className="text-xs text-[#047857] hover:underline font-semibold cursor-pointer"
        >
          عن التطبيق والمنهجية
        </button>
      </div>
    </footer>
  );
}