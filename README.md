# كنوز من السنة النبوية — Kunuz

[العربية](README.ar.md) | English

A free, open-source encyclopedia of **140 authenticated Prophetic hadiths** ("treasures"), sourced from Sheikh Mahmoud Al-Masri's (Abu Ammar) series *«كنوز من السنة»* and *«كنوز وأسرار»*. Every treasure includes the full Arabic text, narrator, source, grade, a plain-language explanation, and a practical daily action.

This is an independent, community-driven project to index Sheikh Al-Masri's material and make it easy to act on — it is **not** an official publication of the Sheikh.

## Features

- **140 documented hadiths** across **9 chapters** (daily dhikr, prayer, repentance, relief & ruqyah, Quran virtues, morals, charity, fasting, prophetic manners)
- **Smart Arabic search** — matches with or without diacritics (tashkeel) and normalizes alef/hamza, teh marbuta, and alef maqsura variants
- **Treasure of the day** — a deterministic pick that rotates through the collection each day
- **Favorites** — bookmark treasures, persisted in `localStorage`
- **Tasbeeh counter** — interactive dhikr counter with a per-hadith repetition target, optional sound, and haptic vibration
- **Daily checklist** — a morning/evening sunnah checklist with progress tracking and a streak
- **Text-to-speech** — listen to any hadith (or the daily treasure) in Arabic
- **Sharing** — copy the full formatted text, or share directly to WhatsApp and Telegram
- **Reading comfort** — RTL layout with Amiri/Tajawal typography, three font sizes, and a tashkeel on/off toggle

## Tech Stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev) + [Tailwind CSS v4](https://tailwindcss.com)
- [lucide-react](https://lucide.dev) icons, [canvas-confetti](https://github.com/catdad/canvas-confetti)
- [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com) for unit and component tests

## Getting Started

**Prerequisites:** [Node.js](https://nodejs.org) 20+ and [pnpm](https://pnpm.io) 11+

```bash
# 1. Install dependencies
pnpm install

# 2. Start the dev server (http://localhost:3000)
pnpm dev
```

## Scripts

| Command            | Description                               |
| ------------------ | ----------------------------------------- |
| `pnpm dev`         | Start the dev server on port 3000         |
| `pnpm build`       | Production build to `dist/`               |
| `pnpm preview`     | Preview the production build locally      |
| `pnpm lint`        | Type-check with `tsc --noEmit`            |
| `pnpm test`        | Run the test suite once (Vitest)          |
| `pnpm test:watch`  | Run tests in watch mode                   |
| `pnpm clean`       | Remove `dist/` and stray build artifacts  |

## Project Structure

```
src/
├── App.tsx                  # Root layout: tabs, filtering, and modal wiring
├── main.tsx                 # React entry point
├── index.css                # Tailwind v4 stylesheet
├── components/              # Navbar, TreasureCard, ChapterFilter, modals, icons
├── data/                    # 140 treasures (4 parts) + chapters metadata
│   └── index.ts             # Aggregation, chapter counts, daily/random picks
├── types.ts                 # Shared TypeScript types
├── test/setup.ts            # Vitest setup (jsdom + mocks)
└── utils/                   # Pure, unit-tested helpers
    ├── arabic.ts            # Arabic normalization and search
    ├── dailyTasks.ts        # Daily checklist store and streak logic
    ├── share.ts             # Share-message formatting
    └── speech.ts            # Arabic text-to-speech
```

## Source and Attribution

All hadith texts, explanations, and practical actions are curated from the series and videos of Sheikh **Mahmoud Al-Masri (Abu Ammar)** — mainly *«كنوز من السنة»* and *«كنوز وأسرار»* — each documented with narrator, source, and grade.

## Contributing

Contributions are welcome! Open an issue or pull request. For hadith text changes, keep the existing documentation format: narrator, source, and grade fields are required for every treasure.

## License

This project is licensed under the [GNU General Public License v3.0 or later](LICENSE). The hadith texts are common heritage of the Ummah; the application code is released so that it stays free and open for everyone.

> نسأل الله أن يجعل هذا العمل خالصاً لوجهه الكريم ونافعاً لكل مسلم.