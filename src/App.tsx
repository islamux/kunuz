import { useState, useMemo } from 'react';
import {
  ALL_TREASURES,
  getDailyTreasure
} from './data';
import { Treasure, ChapterId, TabId, FontSize } from './types';
import { Navbar } from './components/Navbar';
import { ChapterFilter } from './components/ChapterFilter';
import { HeroBanner } from './components/HeroBanner';
import { ChaptersGridSection } from './components/ChaptersGridSection';
import { ActiveFiltersBar } from './components/ActiveFiltersBar';
import { FavoritesHeader } from './components/FavoritesHeader';
import { TreasureGrid } from './components/TreasureGrid';
import { AppModals } from './components/AppModals';
import { Footer } from './components/Footer';
import { useFavorites } from './hooks/useFavorites';
import { filterTreasures } from './utils/filters';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('all');
  const [selectedChapter, setSelectedChapter] = useState<ChapterId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Customization settings
  const [fontSize, setFontSize] = useState<FontSize>('normal');
  const [showTashkeel, setShowTashkeel] = useState<boolean>(true);

  // Favorites stored in localStorage
  const { favorites, toggleFavorite, clearFavorites } = useFavorites();

  // Modal states
  const [dailyModalOpen, setDailyModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [checklistModalOpen, setChecklistModalOpen] = useState(false);
  const [shareTreasure, setShareTreasure] = useState<Treasure | null>(null);
  const [tasbeehTreasure, setTasbeehTreasure] = useState<Treasure | null>(null);

  // Today's special treasure
  const dailyTreasure = useMemo(() => getDailyTreasure(), []);

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
  const filteredTreasures = useMemo(
    () => filterTreasures(ALL_TREASURES, { activeTab, favorites, selectedChapter, selectedTag, searchQuery }),
    [activeTab, favorites, selectedChapter, selectedTag, searchQuery]
  );

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
        onOpenRandom={() => setDailyModalOpen(true)}
        onOpenDaily={() => setDailyModalOpen(true)}
        onOpenAbout={() => setAboutModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Banner Introduction (shown on 'all' tab when no search query) */}
        {activeTab === 'all' && !searchQuery && selectedChapter === 'all' && !selectedTag && (
          <HeroBanner
            onOpenDaily={() => setDailyModalOpen(true)}
            onOpenChecklist={() => setChecklistModalOpen(true)}
          />
        )}

        {/* Chapters Grid View Tab */}
        {activeTab === 'chapters' && (
          <ChaptersGridSection
            selectedChapter={selectedChapter}
            onSelectChapter={(id) => {
              setSelectedChapter(id);
              setActiveTab('all');
            }}
          />
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
          <ActiveFiltersBar
            selectedChapter={selectedChapter}
            searchQuery={searchQuery}
            selectedTag={selectedTag}
            resultCount={filteredTreasures.length}
            onClearChapter={() => setSelectedChapter('all')}
            onClearSearch={() => setSearchQuery('')}
            onClearTag={() => setSelectedTag(null)}
            onClearAll={clearFilters}
          />
        )}

        {/* Favorites Header if on Favorites Tab */}
        {activeTab === 'favorites' && (
          <FavoritesHeader
            shownCount={filteredTreasures.length}
            totalFavorites={favorites.length}
            onClearAll={clearFavorites}
          />
        )}

        {/* Cards Grid */}
        <TreasureGrid
          treasures={filteredTreasures}
          favorites={favorites}
          fontSize={fontSize}
          showTashkeel={showTashkeel}
          onToggleFavorite={toggleFavorite}
          onOpenShareModal={(t) => setShareTreasure(t)}
          onOpenTasbeehModal={(t) => setTasbeehTreasure(t)}
          onSelectTag={handleSelectTag}
          onClearFilters={clearFilters}
        />

      </main>

      {/* Footer */}
      <Footer onOpenAbout={() => setAboutModalOpen(true)} />

      {/* Modals */}
      <AppModals
        dailyTreasure={dailyTreasure}
        dailyModalOpen={dailyModalOpen}
        onCloseDaily={() => setDailyModalOpen(false)}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        shareTreasure={shareTreasure}
        onCloseShare={() => setShareTreasure(null)}
        onOpenShare={(t) => setShareTreasure(t)}
        tasbeehTreasure={tasbeehTreasure}
        onCloseTasbeeh={() => setTasbeehTreasure(null)}
        checklistModalOpen={checklistModalOpen}
        onCloseChecklist={() => setChecklistModalOpen(false)}
        aboutModalOpen={aboutModalOpen}
        onCloseAbout={() => setAboutModalOpen(false)}
        showTashkeel={showTashkeel}
      />

    </div>
  );
}