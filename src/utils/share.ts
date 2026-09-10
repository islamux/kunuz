import { Treasure } from '../types';

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