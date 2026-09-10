# Kunuz — Verified Facts Sheet (internal, source of truth for the presentation package)
Every row: claim | evidence | verified date. Nothing enters slides/demo/QA without a row here.

> **Fresh gate results (run 2026-09-10, this session):** tests `6 files / 47 passed`; lint (`tsc --noEmit`) exit 0 (`LINT_OK`); build OK (1693 modules, JS 454.79 kB gzip 128.69 kB). **No deltas vs the Task 1/2 brief baselines** (brief expected 6/47, LINT_OK, dist/ emitted — all matched).

## 1. Product & content (treasure count via `node -e "console.log(require('./src/data/index.ts'))"` is NOT possible; instead cite src/data/data.test.ts assertions + count rows)

| claim | evidence | verified |
|---|---|---|
| The collection contains exactly **140 treasures** | `src/data/data.test.ts:39-42` — `it('contains exactly 140 treasures with ids 1..140 and no duplicates')` with `expect(ALL_TREASURES).toHaveLength(140)`; assertion passed in the fresh 47/47 run | verified 2026-09-10 |
| Counting method: command count corroborates the test (README not trusted for numbers) | `rg -c '^\s*\{' src/data/treasuresPart1.ts src/data/treasuresPart2.ts src/data/treasuresPart3.ts src/data/treasuresPart4.ts` → `35 / 35 / 35 / 35` = 140; primary evidence is the test assertion, secondary is this count | verified 2026-09-10 |
| Treasures live in 4 part modules, 35 records each, named `TREASURES_PART_1..4` | rg output above; `export const TREASURES_PART_1: Treasure[] = [` at `src/data/treasuresPart1.ts:3`; parts spread into `ALL_TREASURES` at `src/data/index.ts:8-13` | verified 2026-09-10 |
| There are exactly **9 chapters** | `src/data/chapters.ts:3-76` defines 9 `Chapter` entries; `src/data/data.test.ts:12-22` lists 9 `VALID_CHAPTER_IDS`; `src/types.ts:1-10` is a union of 9 `ChapterId` literals | verified 2026-09-10 |
| Per-chapter counts are computed at runtime, not hardcoded | `src/data/index.ts:17-31` builds `CHAPTER_COUNTS` by looping `ALL_TREASURES`; `src/data/data.test.ts:62-65` asserts counts sum to `TOTAL_TREASURES` | verified 2026-09-10 |
| Every treasure carries 7 required non-empty fields: title, hadith, narrator, source, grade, explanation, action | `src/data/data.test.ts:36` (`REQUIRED_FIELDS`) and `:45-52` (non-empty assertion loop); `Treasure` interface at `src/types.ts:32-46` | verified 2026-09-10 |
| The UI hero claims 140 treasures / 9 chapters / "100% authentic (sahih/hasan)" / free | `src/App.tsx:199-213` (stats grid: ١٤٠, ٩, ١٠٠٪, مجاني). **Caution:** the "100%" grade claim is content/UI copy (also `README.md:5`); tests verify only that `grade` is non-empty (`data.test.ts:45-52`), not grade values — do not present it as test-verified | verified 2026-09-10 |
| Content is curated from Sheikh Mahmoud Al-Masri (Abu Ammar)'s series «كنوز من السنة» and «كنوز وأسرار» | `src/App.tsx:171-173` (hero paragraph); `README.md:5` | verified 2026-09-10 |

## 2. Stack & versions (from package.json, exact semver ranges)

| claim | evidence | verified |
|---|---|---|
| React 19 + ReactDOM 19 | `package.json:29-30` — `react ^19.0.1`, `react-dom ^19.0.1` | verified 2026-09-10 |
| Build tool: Vite 6 | `package.json:31` — `vite ^6.2.3` (also duplicated in devDependencies at `package.json:45`) | verified 2026-09-10 |
| TypeScript ~5.8 | `package.json:44` — `typescript ~5.8.2` | verified 2026-09-10 |
| Styling: Tailwind CSS v4 via the Vite plugin (no tailwind.config / postcss.config) | `package.json:20` — `@tailwindcss/vite ^4.1.14`; `package.json:42` — `tailwindcss ^4.1.14` (devDeps); loaded by `@import "tailwindcss"` at `src/index.css:1`; no `tailwind.config.*`/`postcss.config.*` in repo root (ls, exit nonzero) | verified 2026-09-10 |
| Tests: Vitest 5 + Testing Library + jsdom | `package.json:46` `vitest ^5.0.0`; `:34-36` `@testing-library/jest-dom ^7.0.1`, `@testing-library/react ^16.3.3`, `@testing-library/user-event ^14.6.7`; `:41` `jsdom ^30.0.1` | verified 2026-09-10 |
| Icons: lucide-react; effects: canvas-confetti | `package.json:27` `lucide-react ^0.546.0`; `:24` `canvas-confetti ^1.9.4` + `:21` `@types/canvas-confetti ^1.9.0` | verified 2026-09-10 |
| Analytics: Vercel Speed Insights | `package.json:22` `@vercel/speed-insights ^2.0.0`; mounted in `src/main.tsx:3,10` | verified 2026-09-10 |
| `motion ^12.23.24`, `@google/genai ^2.4.0`, `dotenv ^17.2.3`, `express ^4.21.2` are declared runtime deps but unused by the app | `package.json:28`, `:19`, `:25`, `:26`; grep evidence in section 9 | verified 2026-09-10 |
| Scripts (package.json:8-17): dev = `vite --port=3000 --host=0.0.0.0`, build = `vite build`, lint = `tsc --noEmit`, test = `vitest run`, deploy = `npx vercel deploy --prod` | `package.json:9,10,13,14,16` | verified 2026-09-10 |
| Package manager pinned: pnpm 11.24.0; docs require Node 20+ / pnpm 11+ | `package.json:7` `"packageManager": "pnpm@11.24.0"`; `README.md:30` | verified 2026-09-10 |
| License field: GPL-3.0-or-later | `package.json:5` | verified 2026-09-10 |

## 3. Entry points & module map (src/main.tsx, src/App.tsx, src/components/*, src/utils/*, src/data/*)

| claim | evidence | verified |
|---|---|---|
| `index.html` is RTL Arabic (`lang="ar" dir="rtl"`), mounts `#root`, loads `/src/main.tsx` as a module script, loads Amiri + Tajawal from Google Fonts | `index.html:2` (lang/dir), `:17` (`<div id="root">`), `:18` (module script), `:14` (fonts stylesheet) | verified 2026-09-10 |
| Entry `src/main.tsx` (12 lines): `createRoot(...).render()` of `<App />` + `<SpeedInsights />` inside `<StrictMode>`, imports `./index.css` | `src/main.tsx:1-12` | verified 2026-09-10 |
| Root component `App` (428 lines) owns tabs, filters, favorites, and modal wiring; tab state is `'all' | 'chapters' | 'favorites' | 'tasbeeh' | 'checklist'` (tasbeeh/checklist open modals instead of switching views) | `src/App.tsx:33` (union type), `:127-149` (Navbar tab handling) | verified 2026-09-10 |
| `src/components/` contains exactly 9 components: TreasureCard, Navbar, ChapterFilter, DailyTreasureModal, TasbeehModal, ShareCardModal, DailyChecklistModal, AboutModal, ChapterIcon | glob `src/components/*`; 8 of 9 are imported in `src/App.tsx:11-18` — `ChapterIcon` is imported by its consumers instead: `src/components/ChapterFilter.tsx:4`, `src/components/TreasureCard.tsx:17`, `src/components/DailyTreasureModal.tsx:4` (`rg -n "ChapterIcon" src/ --glob '!*.test.*'`) | verified 2026-09-10 |
| `src/utils/` has 4 modules + their 4 test files: `arabic.ts` (normalization/search), `dailyTasks.ts` (checklist store + streak), `share.ts` (share formatting), `speech.ts` (Arabic TTS) | glob `src/utils/*`; `src/utils/arabic.ts:4-41`, `src/utils/dailyTasks.ts:1-92`, `src/utils/share.ts:6-25`, `src/utils/speech.ts:26-87` | verified 2026-09-10 |
| `src/data/` has 4 part files + `chapters.ts` (metadata) + `index.ts` (aggregation & selectors) | glob `src/data/*`; aggregation at `src/data/index.ts:8-15` | verified 2026-09-10 |
| Shared types live in `src/types.ts`: `ChapterId`, `ChapterIconName`, `Chapter`, `Treasure`, `TabId`, `FontSize` | `src/types.ts:1-50` | verified 2026-09-10 |
| Test setup mocks `speechSynthesis`/`SpeechSynthesisUtterance` and `canvas-confetti` | `src/test/setup.ts:4-29` (speech mocks), `:31-33` (confetti mock) | verified 2026-09-10 |
| `src/index.css` (31 lines): Tailwind import, Tajawal base font, `.font-amiri`/`.font-tajawal` classes, custom scrollbar | `src/index.css:1-15` (read 1-30) | verified 2026-09-10 |

## 4. Rendering model (createRoot, no hydrateRoot — grep evidence)

| claim | evidence | verified |
|---|---|---|
| Pure client-side rendering: `createRoot` only; **no `hydrateRoot`** anywhere | `rg -n "createRoot\|hydrateRoot" src/` → only `src/main.tsx:2` (import) and `src/main.tsx:7` (`createRoot(...).render(`); zero hydrateRoot matches | verified 2026-09-10 |
| No SSR/prerender: static host serves `index.html` with an empty `#root` that JS fills | `index.html:17` (empty div), `:18` (module script) | verified 2026-09-10 |
| **No React Context API at all** (needed by Task 5) | `rg -n "createContext\|useContext" src/` → exit 1, no matches | verified 2026-09-10 |
| State patterns instead: local `useState` + props in App, plus two module-level pub/sub stores | `src/App.tsx:33-57` (useState block); `src/utils/dailyTasks.ts:30-55` (module store + `subscribeDailyTasks`); `src/utils/speech.ts:1-7,82-87` (listener Set + `subscribeToSpeech`) | verified 2026-09-10 |

## 5. State & persistence (all localStorage keys with file:line; grep 'localStorage' src/)

Source command: `rg -n "localStorage\.(get|set|remove)Item" src/ --glob '!*.test.*'` → 13 matches, all `getItem`/`setItem` (no `removeItem` anywhere).

| claim | evidence | verified |
|---|---|---|
| Key `sunnah-favorites` — JSON array of treasure ids; read on init, written on every favorites change | read `src/App.tsx:45`, write `src/App.tsx:65`; lazy `useState` initializer `src/App.tsx:43-50`, save effect `src/App.tsx:63-69` | verified 2026-09-10 |
| Key `sunnah-tasks-<YYYY-MM-DD>` — per-day checklist state (prefix constant `TASKS_KEY_PREFIX = 'sunnah-tasks-'`) | const at `src/utils/dailyTasks.ts:3`; read `:23`, write `:46` | verified 2026-09-10 |
| Key `sunnah-streak` — streak counter (const `STREAK_KEY`) | const at `src/utils/dailyTasks.ts:1`; read `:75`, `:89`; write `:78`; also read directly in `src/components/DailyChecklistModal.tsx:41` | verified 2026-09-10 |
| Key `sunnah-streak-last` — date of last full completion (const `STREAK_LAST_KEY`) | const at `src/utils/dailyTasks.ts:2`; read `:73`, `:84`; write `:79` | verified 2026-09-10 |
| `DailyChecklistModal` also reads/writes the `sunnah-tasks-` key but derives the date with `new Date().toISOString().slice(0, 10)` (**UTC-based**), while `dailyTasks.localDateKey` (`src/utils/dailyTasks.ts:5-9`) is **local-timezone-based** — the two "today" derivations can diverge around UTC midnight | `src/components/DailyChecklistModal.tsx:35-36` and `:58-59` (toISOString) vs `src/utils/dailyTasks.ts:5-9` (local getFullYear/getMonth/getDate) | verified 2026-09-10 |
| localStorage error handling is **inconsistent**: favorites read/write, `loadTodayTasks`, and all `DailyChecklistModal` accesses are wrapped in try/catch, but the accesses in `setTodayTasks`, `recordStreakOnCompletion`, and `getEffectiveStreak` are bare — a quota/serialization failure there would throw | wrapped: `src/App.tsx:44-49` (favorites read), `src/App.tsx:63-69` (favorites write), `src/utils/dailyTasks.ts:21-28` (`loadTodayTasks` only), `src/components/DailyChecklistModal.tsx:33-48` and `:56-62`; bare: `src/utils/dailyTasks.ts:46` (`setTodayTasks` setItem), `:73`, `:75`, `:78`, `:79` (`recordStreakOnCompletion`), `:84`, `:89` (`getEffectiveStreak`) | verified 2026-09-10 |
| No `localStorage.removeItem` / `sessionStorage` / cookies used | rg output above: only getItem/setItem; no sessionStorage matches in read source | verified 2026-09-10 |

## 6. Data pipeline (parts -> index.ts aggregation -> filtering in App.tsx -> TreasureCard)

| claim | evidence | verified |
|---|---|---|
| 4 part arrays are spread into `ALL_TREASURES`; `TOTAL_TREASURES = ALL_TREASURES.length` | `src/data/index.ts:8-13`, `:15` | verified 2026-09-10 |
| Derived selectors: `getChapterById`, `getTreasureById`, `getRandomTreasure` (Math.random), `getDailyTreasure` (local day-of-year `% length`), `CHAPTER_COUNTS` | `src/data/index.ts:17-31`, `:35-37`, `:39-41`, `:43-46`, `:48-55` | verified 2026-09-10 |
| Filtering happens in one memoized `useMemo` in App: favorites-tab constraint → chapter → tag → normalized Arabic search over concatenated fields | `src/App.tsx:94-121` (constraints at `:97-99`, `:101-104`, `:106-109`, `:111-117`; deps at `:121`) | verified 2026-09-10 |
| Search is normalized substring containment (not ranked/fuzzy): lowercase + `removeTashkeel` (strips tatweel & harakat, normalizes إ/أ/آ→ا, ة→ه, ى→ي) then `includes` | `src/utils/arabic.ts:22-27` (`matchesSearch`), `:4-17` (`removeTashkeel`) | verified 2026-09-10 |
| Filtered list renders as a responsive grid (1 col, 2 cols ≥md) of `TreasureCard` | `src/App.tsx:319-340` | verified 2026-09-10 |
| `TreasureCard` renders one `<article>` per treasure with chapter badge, title, hadith frame, narrator/source/grade, repeat counter, action, collapsible explanation, tags, listen/copy buttons | `src/components/TreasureCard.tsx:106-339` (article at `:107-110`) | verified 2026-09-10 |
| Daily treasure is computed once per App mount via `useMemo(() => getDailyTreasure(), [])` | `src/App.tsx:60` | verified 2026-09-10 |

## 7. Testing (file-by-file test counts from `pnpm test 2>&1 | grep -E '✓|passed'`; what App.test.tsx covers vs not)

| claim | evidence | verified |
|---|---|---|
| Fresh totals: **6 test files passed, 47 tests passed**, duration 3.71s | `pnpm test 2>&1 \| tail -6` → `Test Files 6 passed (6)` / `Tests 47 passed (47)` | verified 2026-09-10 |
| Per-file counts: speech 4, share 7, dailyTasks 12, arabic 12, data 11, App 1 (= 47) | `pnpm exec vitest run --reporter=verbose 2>&1 \| grep -oE '✓ src/[a-zA-Z/.]+' \| sort \| uniq -c` → `1 App.test.tsx, 11 data.test.ts, 12 arabic.test.ts, 12 dailyTasks.test.ts, 7 share.test.ts, 4 speech.test.ts` (4+7+12+12+11+1 = 47). Note: the brief's `pnpm test 2>&1 \| grep -E '✓\|passed'` yields only the two summary lines under the default non-TTY reporter — verbose reporter used for the file-by-file breakdown | verified 2026-09-10 |
| `App.test.tsx` covers exactly ONE behavior: App renders the brand h1 «كنوز من السنة المطهرة» and at least one `<article>` treasure card | `src/App.test.tsx:6-15` (single `it` block; file is 16 lines) | verified 2026-09-10 |
| `App.test.tsx` does NOT cover: filtering/search, favorites persistence, any modal (daily/tasbeeh/share/checklist/about), checklist/streak logic in UI, speech UI | `src/App.test.tsx:1-16` — entire file is one render smoke test; absence of further `it` blocks is the evidence | verified 2026-09-10 |
| `data.test.ts` (11 tests) covers dataset integrity: exactly 140 with unique ids 1..140, all 7 fields non-empty, valid chapterIds, chapter counts sum, chapter colorClasses + icon names, daily-pick determinism, random membership/variety | `src/data/data.test.ts:39-43`, `:45-52`, `:54-58`, `:62-65`, `:67-71`, `:75-85`, `:89-91`, `:93-96`, `:99-111` | verified 2026-09-10 |
| Utils tests are behavioral: dailyTasks (12) covers date keys, persistence, streak increment/reset/no-op, effective streak; arabic (12) covers tashkeel removal, normalization, search matching, display stripping, digit conversion; share (7) covers each formatted field (title, hadith, narrator, source, grade, explanation, action); speech (4) covers speak/stop/subscribe | verbose reporter test names for `src/utils/dailyTasks.test.ts`, `src/utils/arabic.test.ts`, `src/utils/share.test.ts`, `src/utils/speech.test.ts` | verified 2026-09-10 |
| Test environment: jsdom, globals on, setup file mocks speechSynthesis + confetti | `vite.config.ts:82-86`; `src/test/setup.ts:1-33` | verified 2026-09-10 |

## 8. Build & deploy (vite.config.ts plugin roles, vercel.json, dist/ output size from `du -sh dist` after Task 1 build)

| claim | evidence | verified |
|---|---|---|
| Three Vite plugins: `react()`, `tailwindcss()`, `aistudioMediaPlugin()` | `vite.config.ts:69` | verified 2026-09-10 |
| `aistudioMediaPlugin` is a **dev-server-only** middleware serving `/assets/aistudio/*` from `public/` with MIME mapping and no-cache; it uses `configureServer` only, so production builds are unaffected (AI Studio template leftover) | `vite.config.ts:8-64` (plugin), `:11-12` (`configureServer`) | verified 2026-09-10 |
| Path alias `@` → project root; `DISABLE_HMR=true` env disables HMR and file watching (agent-edit mode) | `vite.config.ts:70-74` (alias), `:75-81` (HMR/watch) | verified 2026-09-10 |
| Vitest config lives inside vite.config.ts (jsdom, setupFiles, globals) | `vite.config.ts:82-86` | verified 2026-09-10 |
| Deploy target: Vercel — framework `vite`, install `pnpm install`, build `pnpm build`, output `dist/`, SPA rewrite `/(.*) → /index.html`, `Cache-Control: public, max-age=31536000, immutable` for `/assets/*` | `vercel.json:3-6`, `:7-9`, `:10-16`; project config dir `.vercel/` exists (root dir listing) | verified 2026-09-10 |
| Fresh production build (2026-09-10): 1693 modules transformed; outputs `dist/index.html 1.63 kB (gzip 0.73)`, `dist/assets/index-BUn42KMn.css 42.75 kB (gzip 8.08)`, `dist/assets/index-B2YIRRZX.js 454.79 kB (gzip 128.69)`; built in 2.41s. **Caution:** content hashes and byte sizes are a dated build snapshot, not stable facts — a reviewer rebuild produced `index-Cmjna5ll.css` at 42.78 kB; later deliverables must re-run `pnpm build` and cite their own fresh output, not these literals | `pnpm build 2>&1 \| tail -8` output, run 2026-09-10 | verified 2026-09-10 |
| `dist/` total size: **497K** | `du -sh dist` → `497K dist` (immediately after the Task 1 build) | verified 2026-09-10 |
| Deploy command: `npx vercel deploy --prod` | `package.json:16` | verified 2026-09-10 |

## 9. Dead weight & limitations (unused deps grep evidence; no router; no PWA; timezone-dependent daily pick; no E2E)

| claim | evidence | verified |
|---|---|---|
| Unused runtime deps `@google/genai ^2.4.0`, `dotenv ^17.2.3`, `express ^4.21.2` — no imports anywhere in app code | `rg -n "from 'express'\|from \"express\"\|@google/genai\|from 'dotenv'" src/ index.html` → no matches, `exit=1`; declared at `package.json:19`, `:25`, `:26` | verified 2026-09-10 |
| AI Studio template provenance of those deps: `.env.example` only defines `GEMINI_API_KEY`/`APP_URL`; `metadata.json` declares `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`; `clean` script still removes a nonexistent `server.js` | `.env.example` (full contents); `metadata.json` (full contents); `package.json:12` | verified 2026-09-10 |
| `motion ^12.23.24` (package.json:28) is also unused | `rg -n "from 'motion'\|from \"motion\"\|motion/react" src/ index.html` → exit=1 | verified 2026-09-10 |
| `@types/express` (package.json:37), `autoprefixer` (:39), `tsx` (:43), `esbuild` (:40) are unreferenced: no script in package.json:8-17 uses tsx/esbuild; no postcss/tailwind config exists; no autoprefixer/postcss references | `rg -n "autoprefixer\|postcss" src/ index.html vite.config.ts` → exit=1; no `postcss.config.*`/`tailwind.config.*` in root (ls); scripts read at `package.json:8-17` | verified 2026-09-10 |
| `vite` is literally duplicated in dependencies AND devDependencies | `package.json:31` and `package.json:45`. Note: the brief phrased this as "vite/tailwindcss duplicated" — precisely, only `vite` is duplicated; `@tailwindcss/vite` (deps, :20) and `tailwindcss` (devDeps, :42) are distinct packages | verified 2026-09-10 |
| Dead optional field: `isSpecialDailyCandidate` is declared but never referenced | `rg -n "isSpecialDailyCandidate" src/` → single match, the declaration at `src/types.ts:45` | verified 2026-09-10 |
| **No router** — no router package, no route components; navigation is tab/modal state | `rg -n "react-router\|createBrowserRouter\|<Route\|serviceWorker\|manifest\|workbox" src/ index.html package.json public/` → exit=1; no router dep in `package.json:18-47`; tab state at `src/App.tsx:33`, tab handling `:127-149` | verified 2026-09-10 |
| **No PWA** — no service worker, no manifest, no workbox; `public/` contains only `assets/`; index.html links no manifest and registers no SW | rg exit=1 (same command as above); root `ls public/` → `assets`; `index.html:1-21` (full file) | verified 2026-09-10 |
| **Timezone-dependent daily pick**: `getDailyTreasure` derives day-of-year from local `new Date()`, so the "treasure of the day" differs by user timezone | `src/data/index.ts:48-55`; same-day determinism is test-asserted (`src/data/data.test.ts:89-91`) but the timezone dependence is inherent | verified 2026-09-10 |
| Checklist date-key divergence (UTC vs local) is a second timezone-related quirk | `src/components/DailyChecklistModal.tsx:35`, `:58` (UTC `toISOString`) vs `src/utils/dailyTasks.ts:5-9` (local date) — see section 5 | verified 2026-09-10 |
| **No E2E tests** — no Playwright/Cypress anywhere; all 6 test files are unit/component tests under Vitest + jsdom | `rg -n "playwright\|cypress\|@playwright" package.json` → exit=1; test inventory in section 7 | verified 2026-09-10 |

## 10. Licensing & attribution (LICENSE, README.md:5-7,71-73)

| claim | evidence | verified |
|---|---|---|
| Application code is licensed **GPL-3.0-or-later** | `package.json:5`; `LICENSE:1-2` ("GNU GENERAL PUBLIC LICENSE, Version 3, 29 June 2007"); `README.md:81` | verified 2026-09-10 |
| Content attribution: hadith texts/explanations/actions curated from the series and videos of Sheikh Mahmoud Al-Masri (Abu Ammar) — mainly «كنوز من السنة» and «كنوز وأسرار» — each documented with narrator, source, and grade | `README.md:5-7` and `README.md:71-73` | verified 2026-09-10 |
| The project is an independent, community-driven index — **not** an official publication of the Sheikh | `README.md:7` | verified 2026-09-10 |
| Hadith texts are framed as the common heritage of the Ummah; the code is released so it stays free and open | `README.md:81` | verified 2026-09-10 |
| In-app attribution: footer prayer for the Sheikh + "عن التطبيق والمنهجية" button opening AboutModal | `src/App.tsx:376-378` (dua text), `:380-385` (about button) | verified 2026-09-10 |
