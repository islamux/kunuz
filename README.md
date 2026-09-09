# كنوز من السنة النبوية — Kunuz

A free, open-source encyclopedia of **140 authenticated Prophetic hadiths** ("treasures") curated from Sheikh Mahmoud Al-Masri's series *«كنوز من السنة»* and *«كنوز وأسرار»* — each with full text, narrator, source, grading, explanation, and a practical daily action.

## Features

- **140 documented hadiths** across **9 thematic chapters** (dhikr, prayer, repentance, ruqyah, Quran virtues, morals, charity, fasting, manners)
- **Smart Arabic search** — matches with or without diacritics (tashkeel), normalizes alef/hamza, teh marbuta, and alef maqsura variants
- **Daily treasure** — a deterministic "treasure of the day" that rotates through the collection
- **Favorites** — bookmark treasures locally (persisted in `localStorage`)
- **Tasbeeh counter** — interactive dhikr counter with targets, sound, haptic feedback, and per-hadith repetition goals
- **Daily checklist** — a morning/evening sunnah checklist with progress tracking
- **Text-to-speech** — listen to any hadith in Arabic
- **Sharing** — copy the full formatted text, or share directly to WhatsApp/Telegram
- **Reading comfort** — RTL layout, Amiri/Tajawal typography, three font sizes, and a tashkeel on/off toggle

## Tech Stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev) + [Tailwind CSS v4](https://tailwindcss.com)
- [lucide-react](https://lucide.dev) icons, [canvas-confetti](https://github.com/catdad/canvas-confetti)

## Getting Started

**Prerequisites:** [Node.js](https://nodejs.org) 20+ and [pnpm](https://pnpm.io) 11+

```bash
# 1. Install dependencies
pnpm install

# 2. Start the dev server (http://localhost:3000)
pnpm dev
```

## Scripts

| Command          | Description                          |
| ---------------- | ------------------------------------ |
| `pnpm dev`       | Start the dev server on port 3000    |
| `pnpm build`     | Production build to `dist/`          |
| `pnpm preview`   | Preview the production build locally |
| `pnpm lint`      | Type-check with `tsc --noEmit`       |

## Project Structure

```
src/
├── App.tsx                 # Root layout, filters, and modal wiring
├── components/             # Navbar, TreasureCard, modals, ChapterIcon
├── data/                   # 140 treasures (4 parts) + chapters metadata
├── types.ts                # Shared TypeScript types
└── utils/arabicUtils.ts    # Arabic normalization, search, TTS, share text
```

## Contributing

Contributions are welcome! Please open an issue or pull request. Hadith text changes should keep the existing verification format (narrator, source, and grade fields are required for every treasure).

## License

This project is licensed under the [GNU General Public License v3.0 or later](LICENSE) — the hadith texts themselves are the common heritage of the Ummah; the application code is released so that it stays free and open for everyone.

> نسأل الله أن يجعل هذا العمل خالصاً لوجهه الكريم ونافعاً لكل مسلم.
