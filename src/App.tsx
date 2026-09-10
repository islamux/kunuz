import React, { useState, useEffect, useMemo } from 'react';
import { 
  ALL_TREASURES, 
  CHAPTERS, 
  getDailyTreasure, 
  getRandomTreasure,
  getChapterById
} from './data';
import { Treasure, ChapterId } from './types';
import { matchesSearch } from './utils/arabic';
import { Navbar } from './components/Navbar';
import { TreasureCard } from './components/TreasureCard';
import { ChapterFilter } from './components/ChapterFilter';
import { DailyTreasureModal } from './components/DailyTreasureModal';
import { TasbeehModal } from './components/TasbeehModal';
import { ShareCardModal } from './components/ShareCardModal';
import { DailyChecklistModal } from './components/DailyChecklistModal';
import { AboutModal } from './components/AboutModal';
import { 
  Sparkles, 
  Bookmark, 
  Search, 
  RotateCcw, 
  Compass, 
  Award, 
  BookOpen,
  Layers,
  ChevronDown,
  X
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'all' | 'chapters' | 'favorites' | 'tasbeeh' | 'checklist'>('all');
  const [selectedChapter, setSelectedChapter] = useState<ChapterId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // Customization settings
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [showTashkeel, setShowTashkeel] = useState<boolean>(true);

  // Favorites stored in localStorage
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('sunnah-favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal states
  const [dailyModalOpen, setDailyModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [checklistModalOpen, setChecklistModalOpen] = useState(false);
  const [shareTreasure, setShareTreasure] = useState<Treasure | null>(null);
  const [tasbeehTreasure, setTasbeehTreasure] = useState<Treasure | null>(null);

  // Today's special treasure
  const dailyTreasure = useMemo(() => getDailyTreasure(), []);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sunnah-favorites', JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleOpenRandom = () => {
    const random = getRandomTreasure();
    setDailyModalOpen(true);
  };

  const handleSelectTag = (tag: string) => {
    setSelectedTag(tag);
    setActiveTab('all');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedChapter('all');
    setSelectedTag(null);
  };

  // Filtered treasures logic
  const filteredTreasures = useMemo(() => {
    return ALL_TREASURES.filter(treasure => {
      // Tab constraint
      if (activeTab === 'favorites' && !favorites.includes(treasure.id)) {
        return false;
      }

      // Chapter filter
      if (selectedChapter !== 'all' && treasure.chapterId !== selectedChapter) {
        return false;
      }

      // Tag filter
      if (selectedTag && (!treasure.tags || !treasure.tags.includes(selectedTag))) {
        return false;
      }

      // Search query (fuzzy normalized Arabic search across title, hadith, explanation, narrator, action, source)
      if (searchQuery.trim()) {
        const fullContent = `${treasure.title} ${treasure.hadith} ${treasure.narrator} ${treasure.source} ${treasure.explanation} ${treasure.action} ${(treasure.tags || []).join(' ')}`;
        if (!matchesSearch(fullContent, searchQuery)) {
          return false;
        }
      }

      return true;
    });
  }, [activeTab, favorites, selectedChapter, selectedTag, searchQuery]);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c2421] font-tajawal flex flex-col selection:bg-[#047857]/20 selection:text-[#047857]">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'checklist') {
            setChecklistModalOpen(true);
          } else if (tab === 'tasbeeh') {
            setTasbeehTreasure(null);
          } else {
            setActiveTab(tab);
          }
        }}
        favoritesCount={favorites.length}
        completedTasksCount={0}
        fontSize={fontSize}
        setFontSize={setFontSize}
        showTashkeel={showTashkeel}
        setShowTashkeel={setShowTashkeel}
        onOpenRandom={handleOpenRandom}
        onOpenDaily={() => setDailyModalOpen(true)}
        onOpenAbout={() => setAboutModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Banner Introduction (shown on 'all' tab when no search query) */}
        {activeTab === 'all' && !searchQuery && selectedChapter === 'all' && !selectedTag && (
          <section className="mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#065f46] text-white shadow-xl shadow-[#047857]/15 relative overflow-hidden">
            {/* Background Pattern Elements */}
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
                  onClick={() => setDailyModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#fef08a] text-[#713f12] hover:bg-[#fde047] transition-all flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#d97706]" />
                  <span>طالع كنز اليوم المختار</span>
                </button>

                <button
                  id="hero-checklist-btn"
                  onClick={() => setChecklistModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs border border-white/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4 text-[#a7f3d0]" />
                  <span>جدول الورد اليومي</span>
                </button>
              </div>
            </div>

            {/* Quick Stats Grid inside Hero */}
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
        )}

        {/* Chapters Grid View Tab */}
        {activeTab === 'chapters' && (
          <section className="mb-8">
            <div className="text-center max-w-xl mx-auto mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-[#064e3b] mb-1">
                فهرس الأبواب والموضوعات
              </h2>
              <p className="text-xs sm:text-sm text-[#4b5563]">
                اختر باباً لاستعراض جميع كنوزه وأحاديثه الخاصة
              </p>
            </div>

            <ChapterFilter
              selectedChapter={selectedChapter}
              onSelectChapter={(id) => {
                setSelectedChapter(id);
                setActiveTab('all');
              }}
              variant="grid"
            />
          </section>
        )}

        {/* Chapter Chips Filter Bar (Active in 'all' and 'favorites') */}
        {activeTab !== 'chapters' && (
          <div className="mb-4">
            <ChapterFilter
              selectedChapter={selectedChapter}
              onSelectChapter={setSelectedChapter}
              variant="chips"
            />
          </div>
        )}

        {/* Active Filters Bar (if search or tag applied) */}
        {(searchQuery || selectedChapter !== 'all' || selectedTag) && (
          <div className="mb-6 p-3 rounded-xl bg-white border border-[#e8e2d5] flex flex-wrap items-center justify-between gap-3 text-xs text-[#4b5563]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-[#1f2937]">عوامل التصفية النشطة:</span>
              
              {selectedChapter !== 'all' && (
                <span className="px-2.5 py-1 rounded-lg bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0] flex items-center gap-1">
                  <span>الباب: {getChapterById(selectedChapter)?.name}</span>
                  <button onClick={() => setSelectedChapter('all')} className="hover:text-red-500 cursor-pointer">✕</button>
                </span>
              )}

              {searchQuery && (
                <span className="px-2.5 py-1 rounded-lg bg-[#eff6ff] text-[#1e40af] border border-[#bfdbfe] flex items-center gap-1">
                  <span>البحث: "{searchQuery}"</span>
                  <button onClick={() => setSearchQuery('')} className="hover:text-red-500 cursor-pointer">✕</button>
                </span>
              )}

              {selectedTag && (
                <span className="px-2.5 py-1 rounded-lg bg-[#fef3c7] text-[#92400e] border border-[#fde68a] flex items-center gap-1">
                  <span>الوسم: #{selectedTag}</span>
                  <button onClick={() => setSelectedTag(null)} className="hover:text-red-500 cursor-pointer">✕</button>
                </span>
              )}

              <span className="text-[#6b7280]">
                (وجدنا {filteredTreasures.length} كنزاً)
              </span>
            </div>

            <button
              onClick={clearFilters}
              className="px-3 py-1 text-xs rounded-lg text-[#dc2626] hover:bg-[#fef2f2] font-semibold cursor-pointer transition-colors"
            >
              إلغاء التصفية
            </button>
          </div>
        )}

        {/* Favorites Header if on Favorites Tab */}
        {activeTab === 'favorites' && (
          <div className="mb-6 p-4 rounded-2xl bg-[#fff1f2] border border-[#fecdd3] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-[#e11d48] fill-current" />
              <div>
                <h3 className="font-bold text-sm sm:text-base text-[#9f1239]">
                  الكنوز المحفوظة في المفضلة ({filteredTreasures.length})
                </h3>
                <p className="text-xs text-[#be123c]">
                  أحاديثك المختارة للرجوع إليها ومداومة العمل بها
                </p>
              </div>
            </div>
            {favorites.length > 0 && (
              <button
                onClick={() => setFavorites([])}
                className="text-xs text-[#be123c] hover:underline cursor-pointer"
              >
                تفريغ المفضلة
              </button>
            )}
          </div>
        )}

        {/* Cards Grid */}
        {filteredTreasures.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {filteredTreasures.map(treasure => {
              const chapter = getChapterById(treasure.chapterId);
              const isFav = favorites.includes(treasure.id);

              return (
                <TreasureCard
                  key={treasure.id}
                  treasure={treasure}
                  chapter={chapter}
                  isFavorite={isFav}
                  onToggleFavorite={toggleFavorite}
                  fontSize={fontSize}
                  showTashkeel={showTashkeel}
                  onOpenShareModal={(t) => setShareTreasure(t)}
                  onOpenTasbeehModal={(t) => setTasbeehTreasure(t)}
                  onSelectTag={handleSelectTag}
                />
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-[#e8e2d5] my-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#f4f1ea] text-[#9ca3af] flex items-center justify-center">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#1f2937] mb-2">
              لم نعثر على كنوز مطابقة لبحثك
            </h3>
            <p className="text-xs sm:text-sm text-[#6b7280] max-w-md mx-auto mb-6">
              جرب تغيير كلمات البحث، أو إزالة التشكيل، أو إلغاء تصفية الأبواب لإظهار جميع الكنوز.
            </p>
            <button
              onClick={clearFilters}
              className="px-5 py-2.5 rounded-xl bg-[#047857] text-white text-xs sm:text-sm font-bold hover:bg-[#065f46] transition-all cursor-pointer shadow-xs"
            >
              عرض جميع الكنوز (١٤٠ كنزاً)
            </button>
          </div>
        )}

      </main>

      {/* Footer */}
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
            onClick={() => setAboutModalOpen(true)}
            className="text-xs text-[#047857] hover:underline font-semibold cursor-pointer"
          >
            عن التطبيق والمنهجية
          </button>
        </div>
      </footer>

      {/* Modals */}
      {dailyModalOpen && (
        <DailyTreasureModal
          treasure={dailyTreasure}
          chapter={getChapterById(dailyTreasure.chapterId)}
          isFavorite={favorites.includes(dailyTreasure.id)}
          onToggleFavorite={toggleFavorite}
          onClose={() => setDailyModalOpen(false)}
          onOpenShare={(t) => setShareTreasure(t)}
          showTashkeel={showTashkeel}
        />
      )}

      {tasbeehTreasure !== null && (
        <TasbeehModal
          treasure={tasbeehTreasure}
          onClose={() => setTasbeehTreasure(null)}
        />
      )}

      {shareTreasure && (
        <ShareCardModal
          treasure={shareTreasure}
          onClose={() => setShareTreasure(null)}
        />
      )}

      <DailyChecklistModal
        isOpen={checklistModalOpen}
        onClose={() => setChecklistModalOpen(false)}
      />

      <AboutModal
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
      />

    </div>
  );
}
