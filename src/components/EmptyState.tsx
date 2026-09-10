import { Search } from 'lucide-react';

interface EmptyStateProps {
  onClearFilters: () => void;
}

export function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
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
        onClick={onClearFilters}
        className="px-5 py-2.5 rounded-xl bg-[#047857] text-white text-xs sm:text-sm font-bold hover:bg-[#065f46] transition-all cursor-pointer shadow-xs"
      >
        عرض جميع الكنوز (١٤٠ كنزاً)
      </button>
    </div>
  );
}