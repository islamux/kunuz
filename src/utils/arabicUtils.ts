import { Treasure } from '../types';

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

/**
 * Formats a treasure into a beautiful message for sharing on WhatsApp, Telegram, etc.
 */
export function formatTreasureForShare(treasure: Treasure): string {
  return `💎 كنز من السنة النبوية #${treasure.id}:
✨ ${treasure.title}

📜 نص الحديث الشريف:
«${treasure.hadith}»

👤 الراوي: ${treasure.narrator}
📚 المصدر: ${treasure.source}
🏷️ الدرجة: ${treasure.grade}

💡 فضل الكنز وسره:
${treasure.explanation}

🎯 كيف تعمل به؟
${treasure.action}

🤲 من كنوز السنة المطهرة للشيخ محمود المصري حفظه الله.
📲 شاركها واكسب أجر من عمل بها (الدال على الخير كفاعله).`;
}

/**
 * Text-To-Speech helper for Arabic
 */
let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speakArabicText(
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  // Stop previous speech if any
  window.speechSynthesis.cancel();

  // Create utterance with stripped tashkeel for smoother TTS flow
  const cleanText = text.replace(/«|»|[\(\)\[\]]/g, ' ');
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'ar-SA';
  utterance.rate = 0.92; // Slightly calm and deliberate pace
  utterance.pitch = 1.0;

  // Find an Arabic voice if available
  const voices = window.speechSynthesis.getVoices();
  const arabicVoice = voices.find(v => v.lang.startsWith('ar'));
  if (arabicVoice) {
    utterance.voice = arabicVoice;
  }

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    currentUtterance = null;
    if (onError) onError();
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopArabicSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}
