/**
 * Removes Arabic diacritics (Tashkeel / Harakat) for flexible searching and display
 */
export function removeTashkeel(text: string): string {
  if (!text) return '';
  return text
    // Remove tatweel (kashida)
    .replace(/\u0640/g, '')
    // Remove harakat (fatha, damma, kasra, sukun, shadda, tanween)
    .replace(/[\u064B-\u065F\u0670]/g, '')
    // Normalize alefs
    .replace(/[إأآٱ]/g, 'ا')
    // Normalize teh marbuta to heh
    .replace(/ة/g, 'ه')
    // Normalize alef maqsura to yeh
    .replace(/ى/g, 'ي');
}

/**
 * Checks if search query matches in original text or normalized text
 */
export function matchesSearch(content: string, query: string): boolean {
  if (!query.trim()) return true;
  const cleanContent = removeTashkeel(content.toLowerCase());
  const cleanQuery = removeTashkeel(query.toLowerCase().trim());
  return cleanContent.includes(cleanQuery);
}

/**
 * Strips tashkeel for display if user toggles off tashkeel
 */
export function stripTashkeelForDisplay(text: string): string {
  if (!text) return '';
  return text.replace(/[\u064B-\u0652\u0670]/g, '');
}

const ARABIC_DIGITS: string[] = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export function toArabicDigits(n: number): string {
  return String(n).replace(/[0-9]/g, (d) => ARABIC_DIGITS[Number(d)]);
}