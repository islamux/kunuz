# Kunuz — Q&A Guide

**Purpose:** Prepare the presenter for audience questions. Every answer is 30–60 seconds spoken (2–4 sentences). Every reference is a verified `path:lines` from `facts.md`.

**Total questions: 30** (across 9 categories).

---

## 1. Architecture & System Design

### Q1: What is the overall architecture of this application?
**Answer:** It is a single-page React 19 CSR application with no server, no database, and no router. The data pipeline is: 4 typed TypeScript data modules → aggregation in `src/data/index.ts` → memoized filtering in `src/App.tsx` → 9 UI components → localStorage for persistence.
**Ref:** `src/data/index.ts:8-13` (aggregation), `src/App.tsx:94-121` (filtering), `src/App.tsx:33-57` (state)
**Trade-off:** The entire dataset compiles into one JS bundle — content updates require a rebuild.
**Improvement:** Could split data modules with dynamic `import()` for lazy loading.

### Q2: Why did you choose typed TypeScript modules over JSON or a database?
**Answer:** Compile-time type safety, zero runtime fetch, tree-shakeable imports, and no network dependency. The `Treasure` interface at `src/types.ts:32-46` enforces 7 required fields; the compiler catches missing fields at build time, not at runtime.
**Ref:** `src/types.ts:32-46`, `src/data/treasuresPart1.ts:3`, `src/data/index.ts:8-13`
**Trade-off:** Content changes require a rebuild; no dynamic loading without refactoring.

### Q3: How many components does the app have, and what is the component hierarchy?
**Answer:** 9 components in `src/components/`: TreasureCard, Navbar, ChapterFilter, DailyTreasureModal, TasbeehModal, ShareCardModal, DailyChecklistModal, AboutModal, and ChapterIcon. All are imported by `src/App.tsx` except ChapterIcon, which is imported by its consumers directly.
**Ref:** `src/components/` (9 files), `src/App.tsx:11-18` (8 of 9 imports)
**Trade-off:** Flat hierarchy means all 9 are in one bundle — no code splitting.

### Q4: What deployment target does the app use?
**Answer:** Vercel static hosting. The build produces a `dist/` folder with one HTML, one CSS, and one JS file. Vercel serves it with SPA rewrites (`/(.*) → /index.html`) and immutable cache headers for `/assets/*`.
**Ref:** `vercel.json:3-6` (framework/build), `:10-16` (headers), `package.json:16` (deploy command)
**Trade-off:** Tied to Vercel as the hosting provider — migrating to another host would require rewriting the SPA rewrite and caching config.

---

## 2. Rendering & CSR/SSR/Hydration

### Q5: SSR vs CSR vs Hydration — which one is this app?
**Answer:** This is a pure CSR application. `src/main.tsx:7` calls `createRoot(document.getElementById('root')!).render(...)` — there is no `hydrateRoot` anywhere in the codebase. The HTML template at `index.html:17` serves an empty `<div id="root">` that the JS bundle fills entirely client-side.
**Ref:** `src/main.tsx:2` (import), `src/main.tsx:7` (`createRoot`), `index.html:17` (empty root)
**Trade-off:** Content is not paintable until the JS bundle loads — the entire DOM tree is built in the browser.
**Improvement:** Could add SSR for faster first paint if the app outgrows its static content use case.

### Q6: Why do hydration mismatches happen, and why can't they happen here?
**Answer:** Hydration mismatches occur when server-rendered HTML differs from what React renders on the client — the two must produce identical DOM trees. This app cannot have hydration mismatches because there is no server-rendered markup: `createRoot` builds from scratch; there is no prior HTML to attach to.
**Ref:** `src/main.tsx:7` (`createRoot` only), `index.html:17` (empty `#root`)
**Trade-off:** N/A — the absence of SSR eliminates hydration risk but introduces a blank-first-paint trade-off.

### Q7: What runs before and after `useEffect`?
**Answer:** Before `useEffect`: the component renders (JSX returns DOM elements), React commits those elements to the DOM. After commit: all `useEffect` callbacks run — this is the "post-mount" phase where browser APIs like `localStorage` are safe to read. In this app, `src/components/DailyChecklistModal.tsx:32-43` uses `useEffect` to load saved tasks from localStorage after mount.
**Ref:** `src/components/DailyChecklistModal.tsx:32-48` (post-mount read), `src/App.tsx:43-50` (pre-mount read via lazy initializer)
**Trade-off:** The lazy initializer runs during render (before commit), which is safe in CSR but would be a mismatch under SSR.
**Improvement:** Could use `useSyncExternalStore` for the pub/sub stores instead of `useEffect` + `useState`.

### Q8: Why can't an SSR app read `localStorage` during render — and why is `src/App.tsx:45` legal in this app?
**Answer:** In SSR, the render happens on the server where `localStorage` doesn't exist — accessing it during render would throw. In this CSR app, `src/App.tsx:45` reads `localStorage` inside a lazy `useState` initializer, which runs during the first render in the browser — `localStorage` is available there. This is safe only because there is no server rendering step.
**Ref:** `src/App.tsx:42-50` (lazy initializer), `src/main.tsx:7` (CSR only)
**Trade-off:** This pattern is SSR-unsafe if the app ever migrates to server rendering.

---

## 3. Routing & State Management

### Q9: How does navigation work without a router?
**Answer:** Navigation is tab/modal state managed by `useState` in `src/App.tsx`. The `activeTab` state variable (`src/App.tsx:33`) is a union of `'all' | 'chapters' | 'favorites' | 'tasbeeh' | 'checklist'` — modals like Tasbeeh and Checklist set a boolean to open rather than switching views.
**Ref:** `src/App.tsx:33` (tab union), `src/App.tsx:127-149` (tab handling)
**Trade-off:** No deep-linking to specific treasures; no browser back/forward for navigation.

### Q10: What are the state management patterns in use?
**Answer:** Three tiers: (1) 9 `useState` variables in `src/App.tsx:33-57` for UI state, (2) module-level pub/sub stores in `src/utils/dailyTasks.ts:30-55` and `src/utils/speech.ts:1-7` for shared domain state, and (3) 4 `localStorage` keys for persistence. No React Context API, no Redux, no external state library.
**Ref:** `src/App.tsx:33-57`, `src/utils/dailyTasks.ts:30-55`, `src/utils/speech.ts:1-7`
**Trade-off:** Pub/sub stores are outside React's rendering model — components must manually subscribe.

### Q11: What are the 4 localStorage keys and what do they store?
**Answer:** (1) `sunnah-favorites`: JSON array of treasure ids, (2) `sunnah-tasks-<YYYY-MM-DD>`: per-day checklist state, (3) `sunnah-streak`: streak counter, (4) `sunnah-streak-last`: date of last full completion. There are 13 total `localStorage` access points across the codebase, all `getItem`/`setItem` — no `removeItem` anywhere.
**Ref:** `src/App.tsx:45,65`, `src/utils/dailyTasks.ts:1-3,23,46,73-79,84-89`
**Trade-off:** localStorage is user-controlled (~5MB quota, user-clearable, no cross-device sync).

### Q12: Is there a discrepancy between how the checklist and dailyTasks derive "today"?
**Answer:** Yes. `src/components/DailyChecklistModal.tsx:35` uses `new Date().toISOString().slice(0, 10)` which is UTC-based, while `src/utils/dailyTasks.ts:5-9` (`localDateKey`) uses local timezone via `getFullYear/getMonth/getDate`. These can diverge around UTC midnight — a user in UTC+5 completing tasks at 11 PM local time (7 PM UTC) would have different keys.
**Ref:** `src/components/DailyChecklistModal.tsx:35`, `src/utils/dailyTasks.ts:5-9`
**Trade-off:** Two different "today" derivations in the same feature means tasks saved by one path may not be found by the other.
**Improvement:** Unify both to use the same date derivation.

---

## 4. Data Pipeline & Arabic Text Processing

### Q13: How does the data flow from raw files to rendered UI?
**Answer:** 4 part modules (`TREASURES_PART_1..4`, 35 records each) are spread into `ALL_TREASURES` at `src/data/index.ts:8-13`. Derived selectors (`getChapterById`, `getDailyTreasure`, `CHAPTER_COUNTS`) are computed from this array. `src/App.tsx:94-121` applies a memoized filter chain (chapter → tag → Arabic search) and renders the result as a grid of `TreasureCard` components.
**Ref:** `src/data/index.ts:8-13` (spread), `:17-31` (selectors), `src/App.tsx:94-121` (filtering)
**Trade-off:** All 140 records compile into one bundle regardless of how many the user views.

### Q14: How does Arabic search normalization work?
**Answer:** `removeTashkeel` at `src/utils/arabic.ts:4-17` strips tatweel, harakat, normalizes alef variants to alef, teh marbuta to heh, and alef maqsura to yeh. `matchesSearch` at `:22-27` lowercases both content and query, applies `removeTashkeel` to both, then does substring containment (`includes`). It searches across concatenated fields at `src/App.tsx:111-117`.
**Ref:** `src/utils/arabic.ts:4-17` (`removeTashkeel`), `:22-27` (`matchesSearch`), `src/App.tsx:111-117`
**Trade-off:** No ranking, no fuzzy match — substring containment only, which is sufficient for 140 curated records.

### Q15: How are per-chapter treasure counts computed?
**Answer:** `CHAPTER_COUNTS` at `src/data/index.ts:17-31` is built by looping `ALL_TREASURES` and grouping by `chapterId` — counts are computed at runtime, not hardcoded. The `src/data/data.test.ts:62-65` assertion verifies that the sum of all chapter counts equals `TOTAL_TREASURES`.
**Ref:** `src/data/index.ts:17-31`, `src/data/data.test.ts:62-65`
**Trade-off:** Counts are computed once per module load — not dynamically updated if data changes.

### Q16: How does the daily treasure determinism work?
**Answer:** `getDailyTreasure` at `src/data/index.ts:48-55` computes the day-of-year from `new Date()`, then takes `dayOfYear % ALL_TREASURES.length` (140). This is deterministic within one timezone — same calendar day always yields the same index. The test at `src/data/data.test.ts:89-91` asserts `getDailyTreasure().id === getDailyTreasure().id`.
**Ref:** `src/data/index.ts:48-55`, `src/data/data.test.ts:89-91`
**Trade-off:** Timezone-dependent — the "same" treasure may differ across timezones at day boundaries.

---

## 5. API, Database, Identity

### Q17: Why is there no API layer?
**Answer:** By design. All data is compiled into the client bundle as typed TypeScript modules — no network round-trips, no API keys, no server to operate. The thesis (slide 5) is that a knowledge app can be a static, verifiable artifact: typed data modules + pure functions + browser storage.
**Ref:** `src/data/index.ts:8-13`, `src/main.tsx:7`, `index.html:17`
**Trade-off:** Content updates require a rebuild and redeploy.

### Q18: Is there any server-side logic?
**Answer:** No. The dev server (`vite.config.ts:8-64`) has an `aistudioMediaPlugin` middleware that serves files from `public/assets/aistudio/`, but it is dev-server-only and does not appear in production builds. The production build is a static folder served by Vercel.
**Ref:** `vite.config.ts:8-64` (plugin), `:11-12` (`configureServer`), `vercel.json:3-6`
**Trade-off:** The dev middleware is dead weight in production — it should be removed (roadmap item 1).

---

## 6. Performance & Caching

### Q21: What is the bundle size and what does it include?
**Answer:** JS: 454.79 kB (gzip 128.69 kB), CSS: 42.75 kB (gzip 8.08 kB). The single JS chunk includes React 19, all 140 typed data records, 9 components, and 4 utility modules. There is no code splitting — `rg "lazy|Suspense|import(" src/` returns zero matches.
**Ref:** facts §8 (dated build snapshot 2026-09-10), `rg` evidence facts §9
**Trade-off:** The initial payload includes all data even if a user reads 5 treasures.
**Improvement:** Could use `React.lazy()` + `Suspense` to split modals and data modules.

### Q22: What caching strategy is in place?
**Answer:** Vercel serves `/assets/*` with `Cache-Control: public, max-age=31536000, immutable` — the content-hashed filenames (`index-B2YIRRZX.js`, `index-BUn42KMn.css`) make this safe. The SPA rewrite serves `index.html` for all routes.
**Ref:** `vercel.json:10-16` (headers), `vercel.json:3-6` (framework)
**Trade-off:** No offline caching beyond browser cache — no service worker.

### Q23: Are there any performance concerns?
**Answer:** The main concern is the 454.79 kB JS bundle with no code splitting. For 140 curated records, this is acceptable, but it means React + all data load on first paint. The `useMemo` for filtering (`src/App.tsx:94-121`) prevents unnecessary re-computation on re-renders. The `canvas-confetti` library (package.json:24) adds visual weight for the completion celebration.
**Ref:** facts §8 (bundle size), `src/App.tsx:94-121` (useMemo), `package.json:24` (confetti)
**Trade-off:** Single chunk loads everything upfront — the initial payload includes all 140 records even if a user reads 5 treasures.
**Improvement:** Could use `React.lazy()` + `Suspense` to split modals; dynamic `import()` for data modules to defer the cost.

---

## 7. Security & Threat Model

### Q25: What is the security posture of this app?
**Answer:** The threat surface is a single static page — no server, no auth, no database, no network writes, no API keys. The main trust boundary is localStorage, which is user-controlled. The favorites read at `src/App.tsx:44-49` is wrapped in try/catch to handle corrupt JSON gracefully.
**Ref:** `src/App.tsx:44-49` (defensive read), `package.json:5` (GPL-3.0-or-later)
**Trade-off:** No CSP headers configured; all content is authored, not user-generated — so XSS risk is minimal but unmitigated.

### Q26: Could a user inject malicious data through localStorage?
**Answer:** A user could write arbitrary JSON to `sunnah-favorites`, but the app only reads it as an array of numbers — `JSON.parse` is wrapped in try/catch (`src/App.tsx:44-49`), and invalid data returns `[]`. The checklist and streak data are similarly protected by try/catch in `loadTodayTasks` (`src/utils/dailyTasks.ts:21-28`). However, `setTodayTasks` and `recordStreakOnCompletion` at `src/utils/dailyTasks.ts:46,73-79` have bare writes without try/catch — a quota or serialization failure would throw.
**Ref:** `src/App.tsx:44-49`, `src/utils/dailyTasks.ts:21-28`, `:46`, `:73-79`
**Trade-off:** Read paths are defensive; write paths at `src/utils/dailyTasks.ts:46,73-79,84-89` are bare — inconsistent error handling.
**Improvement:** Wrap all localStorage writes in try/catch consistently.

### Q27: Are there any supply-chain concerns?
**Answer:** Yes. Four runtime dependencies are declared but never imported: `@google/genai`, `dotenv`, `express`, and `motion` (package.json:19,25,26,28). These are AI Studio template leftovers that inflate the install and widen the audit surface. The `vite` package is also duplicated in both dependencies and devDependencies (package.json:31,45).
**Ref:** `package.json:19,25,26,28` (dead deps), `package.json:31,45` (vite duplication), facts §9
**Trade-off:** Each unused dep is a potential vulnerability that must be audited — even if never imported, the install pulls in their transitive trees.
**Improvement:** Remove dead deps — roadmap item 1, pure subtraction, zero behavior change.

### Q28: What license governs this code?
**Answer:** GPL-3.0-or-later (`package.json:5`, `LICENSE:1`). The code is free and open source. Content attribution: hadith texts curated from Sheikh Mahmoud Al-Masri's series, documented with narrator, source, and grade — the project is an independent, community-driven index, not an official publication.
**Ref:** `package.json:5`, `LICENSE:1-2`, `README.md:5-7,71-73`
**Trade-off:** GPL-3.0 requires derivative works to also be open-source, which limits commercial forkability but protects the free-software intent.
**Improvement:** None — the license choice aligns with the project's stated mission.

---

## 8. Testing & Observability

### Q29: What is actually tested and what is not?
**Answer:** 47 tests across 6 files (fresh run 2026-09-10): arabic (12), dailyTasks (12), data (11), share (7), speech (4), App (1). The utils tests are behavioral and thorough. `src/App.test.tsx` is a single smoke test (16 lines) that renders the h1 and checks one `<article>` exists. What is NOT tested: filtering/search in the UI, favorites persistence flow, all 5 modals, checklist/streak UI interaction, TTS voice selection, and there are no E2E tests (no Playwright/Cypress).
**Ref:** `src/App.test.tsx:6-15` (single it block), facts §7 (per-file counts)
**Trade-off:** The utility functions have strong coverage; the UI layer has only one smoke assertion — integration and E2E gaps are real.
**Improvement:** Golden-path E2E smoke (roadmap item 5) would cover filter → search → favorites → checklist.

### Q30: Which claims should the presenter NOT make?
**Answer:** Do not say: "fully tested" (only 1 App smoke test, no E2E), "works offline" (no service worker, no manifest, facts §9), "cross-device sync" (localStorage is per-browser — no sync layer exists), "no bugs" (timezone-dependent daily pick, UTC vs local date divergence, bare localStorage writes). Do not present the "100% authentic" UI label (`src/App.tsx:199-213`) as test-verified — tests only assert `grade` is a non-empty string (`src/data/data.test.ts:45-52`).
**Ref:** `src/App.test.tsx:6-15`, `src/App.tsx:199-213`, `src/data/data.test.ts:45-52`, facts §9
**Trade-off:** Honesty about gaps builds trust more than overstating coverage.
**Improvement:** None — these are discipline rules, not features.

---

## 9. Trade-offs & Roadmap

### Q31: What are the four main trade-offs in the current design?
**Answer:** (1) Static typed data — gained offline-capability and testability, paid with content-requires-rebuild. (2) No router — gained simplicity, paid with no deep links. (3) localStorage — gained zero-backend persistence, paid with no cross-device sync. (4) CSR-only — gained simple deploy, paid with blank first paint until JS loads (454.79 kB).
**Ref:** `src/data/index.ts:8-13`, `src/App.tsx:33`, `src/App.tsx:45`, `src/main.tsx:7`, facts §8
**Trade-off:** Each decision is defensible for 140 curated records, but any one of them becomes a constraint if the app scales.
**Improvement:** Roadmap items 1–5 address these trade-offs incrementally.

### Q32: What does the roadmap prioritize and why?
**Answer:** Risk reduction first, features second: (1) Remove dead deps (pure subtraction, zero behavior change), (2) Harden data integrity gates (content is the product), (3) Deep links via hash routing (contained UX win), (4) PWA offline (matches the pocket-treasure promise), (5) E2E smoke of the golden path (proves the release pipeline). Each step is a prerequisite for the next one's value.
**Ref:** `package.json:19,25,26` (dead deps), `src/data/data.test.ts:45-52` (data gap), `src/App.tsx:33` (no router), facts §9 (no PWA), `src/App.test.tsx:6-15` (smoke test)
**Trade-off:** Each roadmap item adds complexity — deep links require a router, PWA adds a service-worker layer, E2E tests require a test runner.
**Improvement:** Execute in order — each step makes the next safer.

### Q33: Could this app scale beyond 140 treasures?
**Answer:** The typed module approach compiles all data into the bundle — 140 records produce a 454.79 kB JS file. Scaling to 1,000+ would require dynamic loading (`import()`) or a data API. The filtering `useMemo` (`src/App.tsx:94-121`) would also need optimization for larger datasets — currently it does a linear scan of all records on every filter change.
**Ref:** `src/App.tsx:94-121`, `src/data/index.ts:8-13`, facts §8
**Trade-off:** The current architecture is optimal for a curated, static collection — scaling fundamentally changes the data loading model.
**Improvement:** Dynamic `import()` for data modules + `React.lazy()` for modals would defer the cost.
