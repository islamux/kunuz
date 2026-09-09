import React from 'react';
import { 
  Sparkles, 
  Bookmark, 
  Compass, 
  CheckCircle2, 
  Info, 
  Type, 
  RotateCw,
  Flame,
  Search
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'all' | 'chapters' | 'favorites' | 'tasbeeh' | 'checklist';
  setActiveTab: (tab: 'all' | 'chapters' | 'favorites' | 'tasbeeh' | 'checklist') => void;
  favoritesCount: number;
  completedTasksCount: number;
  fontSize: 'normal' | 'large' | 'xlarge';
  setFontSize: React.Dispatch<React.SetStateAction<'normal' | 'large' | 'xlarge'>>;
  showTashkeel: boolean;
  setShowTashkeel: (val: boolean | ((prev: boolean) => boolean)) => void;
  onOpenRandom: () => void;
  onOpenDaily: () => void;
  onOpenAbout: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  favoritesCount,
  completedTasksCount,
  fontSize,
  setFontSize,
  showTashkeel,
  setShowTashkeel,
  onOpenRandom,
  onOpenDaily,
  onOpenAbout,
  searchQuery,
  setSearchQuery
}) => {
  const toggleFontSize = () => {
    if (fontSize === 'normal') setFontSize('large');
    else if (fontSize === 'large') setFontSize('xlarge');
    else setFontSize('normal');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#e7e1d5] shadow-xs">
      {/* Top Bar with brand & quick utility actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('all')}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#047857] to-[#065f46] text-white flex items-center justify-center shadow-md shadow-[#047857]/20 border border-[#047857]/30">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#fef08a]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-bold text-[#064e3b] font-tajawal tracking-tight">
                  كنوز من السنة المطهرة
                </h1>
                <span className="hidden md:inline-block px-2 py-0.5 text-xs font-semibold bg-[#d1fae5] text-[#065f46] rounded-full border border-[#a7f3d0]">
                  ١٤٠ كنزاً نبوياً
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#047857] font-medium truncate max-w-[200px] sm:max-w-md">
                مستخلصة ومحققة من سلاسل فضيلة الشيخ محمود المصري
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Daily Treasure Button */}
            <button
              id="daily-treasure-btn"
              onClick={onOpenDaily}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium rounded-lg bg-[#fef3c7] text-[#92400e] hover:bg-[#fde68a] border border-[#fcd34d]/60 flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
              title="كنز اليوم المميز"
            >
              <Flame className="w-4 h-4 text-[#d97706]" />
              <span className="hidden sm:inline">كنز اليوم</span>
            </button>

            {/* Random Treasure Generator */}
            <button
              id="random-treasure-btn"
              onClick={onOpenRandom}
              className="p-2 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium rounded-lg bg-[#ecfdf5] text-[#047857] hover:bg-[#d1fae5] border border-[#a7f3d0] flex items-center gap-1.5 transition-all cursor-pointer"
              title="اختر لي كنزاً عشوائياً"
            >
              <RotateCw className="w-4 h-4" />
              <span className="hidden md:inline">كنز عشوائي</span>
            </button>

            {/* Font Size Toggle */}
            <button
              id="font-size-toggle-btn"
              onClick={toggleFontSize}
              className="p-2 text-xs sm:text-sm font-medium rounded-lg bg-[#f4f1ea] text-[#374151] hover:bg-[#e9e3d6] border border-[#ded8c8] flex items-center gap-1 transition-all cursor-pointer"
              title={`حجم الخط: ${fontSize === 'normal' ? 'متوسط' : fontSize === 'large' ? 'كبير' : 'كبير جداً'}`}
            >
              <Type className="w-4 h-4" />
              <span className="text-[10px] font-bold">
                {fontSize === 'normal' ? 'A' : fontSize === 'large' ? 'A+' : 'A++'}
              </span>
            </button>

            {/* Tashkeel Toggle */}
            <button
              id="tashkeel-toggle-btn"
              onClick={() => setShowTashkeel(prev => !prev)}
              className={`p-2 text-xs sm:text-sm font-medium rounded-lg border transition-all cursor-pointer ${
                showTashkeel 
                  ? 'bg-[#047857] text-white border-[#047857]' 
                  : 'bg-[#f4f1ea] text-[#6b7280] border-[#ded8c8]'
              }`}
              title={showTashkeel ? 'التشكيل مفعل (اضغط للإخفاء)' : 'التشكيل مخفي (اضغط للتفعيل)'}
            >
              <span className="text-xs font-bold">ًَُِ</span>
            </button>

            {/* About App Modal */}
            <button
              id="about-modal-btn"
              onClick={onOpenAbout}
              className="p-2 text-[#4b5563] hover:text-[#047857] hover:bg-[#f4f1ea] rounded-lg border border-transparent hover:border-[#ded8c8] transition-all cursor-pointer"
              title="عن التطبيق والشيخ محمود المصري"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs and Mobile Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pb-3 gap-3 border-t border-[#f0ece1] pt-2.5">
          
          {/* Tabs */}
          <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              id="tab-all-treasures"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#047857] text-white shadow-xs'
                  : 'text-[#4b5563] hover:text-[#065f46] hover:bg-[#e9f5f0]'
              }`}
            >
              جميع الكنوز (١٤٠)
            </button>

            <button
              id="tab-chapters"
              onClick={() => setActiveTab('chapters')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'chapters'
                  ? 'bg-[#047857] text-white shadow-xs'
                  : 'text-[#4b5563] hover:text-[#065f46] hover:bg-[#e9f5f0]'
              }`}
            >
              الفهرس والأبواب (٩)
            </button>

            <button
              id="tab-favorites"
              onClick={() => setActiveTab('favorites')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'favorites'
                  ? 'bg-[#047857] text-white shadow-xs'
                  : 'text-[#4b5563] hover:text-[#065f46] hover:bg-[#e9f5f0]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>المفضلة</span>
              {favoritesCount > 0 && (
                <span className={`px-1.5 py-0.2 text-[11px] rounded-full font-bold ${
                  activeTab === 'favorites' ? 'bg-white text-[#047857]' : 'bg-[#e0e7ff] text-[#4338ca]'
                }`}>
                  {favoritesCount}
                </span>
              )}
            </button>

            <button
              id="tab-tasbeeh"
              onClick={() => setActiveTab('tasbeeh')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'tasbeeh'
                  ? 'bg-[#047857] text-white shadow-xs'
                  : 'text-[#4b5563] hover:text-[#065f46] hover:bg-[#e9f5f0]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>المسبحة والعداد</span>
            </button>

            <button
              id="tab-checklist"
              onClick={() => setActiveTab('checklist')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'checklist'
                  ? 'bg-[#047857] text-white shadow-xs'
                  : 'text-[#4b5563] hover:text-[#065f46] hover:bg-[#e9f5f0]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
              <span>الورد اليومي</span>
              {completedTasksCount > 0 && (
                <span className={`px-1.5 py-0.2 text-[11px] rounded-full font-bold ${
                  activeTab === 'checklist' ? 'bg-white text-[#047857]' : 'bg-[#dcfce7] text-[#15803d]'
                }`}>
                  {completedTasksCount}
                </span>
              )}
            </button>
          </nav>

          {/* Inline Instant Search Input */}
          <div className="relative min-w-[220px] sm:w-72">
            <Search className="w-4 h-4 text-[#9ca3af] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="global-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في نص الحديث، الراوي، الموضوع..."
              className="w-full pr-9 pl-8 py-1.5 text-xs sm:text-sm rounded-lg bg-white border border-[#d8d2c4] focus:outline-none focus:ring-2 focus:ring-[#047857]/40 focus:border-[#047857] placeholder-[#9ca3af] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-[#9ca3af] hover:text-[#4b5563] p-0.5 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
