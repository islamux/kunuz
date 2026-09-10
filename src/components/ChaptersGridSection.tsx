import { ChapterFilter } from './ChapterFilter';
import { ChapterId } from '../types';

interface ChaptersGridSectionProps {
  selectedChapter: ChapterId | 'all';
  onSelectChapter: (id: ChapterId) => void;
}

export function ChaptersGridSection({ selectedChapter, onSelectChapter }: ChaptersGridSectionProps) {
  return (
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
        onSelectChapter={onSelectChapter}
        variant="grid"
      />
    </section>
  );
}