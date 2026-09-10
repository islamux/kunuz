# Kunuz — Live Demo Script

**Total budget:** ~10 minutes within a 60-minute presentation (slide 27 divider).
**Compressed fallback:** ~5 minutes (segments 1–3 only).

---

## Preflight (T-15 min, not counted)

Run these **before** the audience arrives — the `pnpm` commands are real scripts from `package.json:9-16` (plus `pnpm install`, the package-manager command):

```bash
pnpm install       # pnpm 11.24.0 (package.json:7); not a package.json script, a pnpm command
pnpm test          # package.json:14 — "vitest run" → expect 6 files / 47 tests (facts §7)
pnpm lint          # package.json:13 — "tsc --noEmit" → expect exit 0
pnpm build         # package.json:10 — "vite build" → dist/ emitted (facts §8)
pnpm preview       # package.json:11 — "vite preview" → serves on PORT 4173 (verified by running it this session: "Local: http://localhost:4173/")
```

**Important:** `pnpm preview` serves the **production build** from `dist/`. The dev-server middleware from `vite.config.ts:8-64` (aistudioMediaPlugin) and HMR/watch config at `:75-81` are **not** what the audience sees.

---

## Segment 1 — Landing + Chapter Filter (1.75 min)

**Open:** `http://localhost:4173`

**What to show:**
1. Hero section — stats grid showing ١٤٠ / ٩ / ١٠٠٪ / مجاني (`src/App.tsx:199-213`).
2. Chapter pills — click 2–3 different chapter filters. Grid updates instantly.

**What to say:**
> "140 treasures, 9 chapters — the counts are computed at runtime, not hardcoded. You can verify: `src/data/index.ts:17-31` loops ALL_TREASURES to build CHAPTER_COUNTS."

**External evidence → internal file:**
- Grid re-renders on filter click → filter state `src/App.tsx:34` (`selectedChapter` useState).
- Chapter pills component → `src/components/ChapterFilter.tsx:12-121` (chips variant).
- Count derivation → `src/data/index.ts:17-31` (runtime loop, not hardcoded).

**Fallback:** If the preview server isn't up, run `pnpm dev` (port 3000) instead. Note that the audience sees the dev build, not production — HMR is active, the aistudioMediaPlugin middleware is loaded.

---

## Segment 2 — Arabic Search (1.75 min)

**What to show:**
1. Type a diacritics-heavy Arabic query in the search bar — results appear.
2. Clear and type the **same query stripped of diacritics** — identical results.

**What to say:**
> "The search normalizes Arabic text: it strips tatweel, harakat, normalizes alef variants and teh marbuta, then does substring containment. No ranking, no fuzzy match — substring containment is enough for 140 curated records."

**External evidence → internal file:**
- Normalization pipeline → `src/utils/arabic.ts:4-17` (`removeTashkeel`).
- Search matching → `src/utils/arabic.ts:22-27` (`matchesSearch`).
- Fields searched (concatenated) → `src/App.tsx:111-117`.
- 12 tests → `src/utils/arabic.test.ts`.

**Fallback:** If search appears broken, point to the 12 test cases in `src/utils/arabic.test.ts` as behavioral evidence.

---

## Segment 3 — Favorites + Reload (1.75 min)

**What to show:**
1. Click the bookmark/star icon on a treasure card — it turns gold.
2. Reload the page (`Ctrl+R` / `Cmd+R`).
3. Open DevTools → Application → Local Storage → show the `sunnah-favorites` key with the treasure id stored.

**What to say:**
> "Favorites persist across reloads via localStorage. The key is `sunnah-favorites`, read in a lazy useState initializer with try/catch — if the JSON is corrupt, it returns an empty array instead of crashing."

**External evidence → internal file:**
- Read on init → `src/App.tsx:45` (lazy initializer).
- Write on change → `src/App.tsx:65`.
- Try/catch defensive read → `src/App.tsx:44-49`.

**Fallback:** If localStorage isn't accessible, show the write effect code at `src/App.tsx:63-69`.

---

## Segment 4 — Daily Treasure Determinism (1.25 min)

**What to show:**
1. Open the daily treasure modal.
2. Open the same URL in a **second browser tab** — same treasure appears.

**What to say:**
> "The daily treasure is deterministic within one timezone: day-of-year modulo 140. Same day, same index. But — and I'll be honest — this is timezone-dependent. `getDailyTreasure` uses local `new Date()`, so users in different timezones may see a different treasure around UTC midnight."

**External evidence → internal file:**
- Deterministic pick → `src/data/index.ts:48-55` (dayOfYear % ALL_TREASURES.length).
- Same-day test → `src/data/data.test.ts:89-91`.

**Fallback:** Show the verbatim code block from `src/data/index.ts:48-55` in the editor.

---

## Segment 5 — Tasbeeh + Checklist Streak (1.75 min)

**What to show:**
1. Open the checklist modal — tick 2–3 items.
2. Show the streak display incrementing.
3. **Do not fake dates live.** Instead, open the test file `src/utils/dailyTasks.test.ts` in the editor and scroll to the streak tests at lines 71–126 as the "yesterday" proof.

**What to say:**
> "The streak has three branches: today = no-op (already counted), yesterday = increment, stale (≥2 days gap) = reset to 1. A streak dies on a single missed day — deliberately, to keep the habit honest."

**External evidence → internal file:**
- Streak state machine → `src/utils/dailyTasks.ts:73-79` (`recordStreakOnCompletion`).
- Effective streak → `src/utils/dailyTasks.ts:83-91` (`getEffectiveStreak`).
- 4 streak branch tests → `src/utils/dailyTasks.test.ts:71-126`.

**Fallback:** Walk the three branches verbally using the verbatim code block already shown on slide 22.

---

## Segment 6 — TTS + Share (1.25 min, environment-gated)

**What to show:**
1. Click the "listen" button on a treasure card → Arabic TTS plays (if Arabic voices are installed on the demo machine).
2. Click "share" → clipboard copy + WhatsApp/Telegram deep links.

**What to say:**
> "TTS uses the Web Speech API with `lang='ar-SA'`. It requires Arabic system voices — this is an environment dependency, not a code bug. If voices aren't installed, the app degrades to a no-op."

**External evidence → internal file:**
- TTS implementation → `src/utils/speech.ts:26-72`.
- Share formatting + deep links → `src/utils/share.ts:6-25`.
- 4 speech tests → `src/utils/speech.test.ts`.

**Fallback:** If TTS is absent on the demo machine, say: "The Web Speech API isn't available here — but 4 speech tests pass, proving the logic works." Run `pnpm test -- src/utils/speech.test.ts` if time allows.

---

## Segment 7 — Close: Deployment Story (45 sec)

**What to show:**
1. Run `ls dist/` in the terminal — show the built output.
2. Show `vercel.json` — SPA rewrite + immutable cache headers.

**What to say:**
> "One command to deploy: `npx vercel deploy --prod`. Static hosting, immutable asset caching, zero runtime infrastructure."

**External evidence → internal file:**
- Build output → `dist/` (497K total, facts §8).
- Vercel config → `vercel.json:3-6` (framework/build), `:7-9` (install), `:10-16` (headers).
- Deploy command → `package.json:16`.

---

## Compress-to-5-Minutes Plan

If time runs short, run **only segments 1–3** (the golden path):

1. **Filter** (1.5 min) — click 2 chapter pills, show grid update.
2. **Search** (2 min) — diacritics query + stripped query, same results.
3. **Persist** (1.5 min) — star a treasure, reload, still starred, DevTools localStorage.
4. **Point to this script** for segments 4–7 — "daily treasure, checklist, TTS, and deployment are documented in the demo script if you want to explore them."

This covers the three most impactful features: filtering, search normalization, and client-side persistence.

---

## Fallback Plans

### If `pnpm preview` fails
Run `pnpm dev` (port 3000 per `package.json:9`). Note to the audience: "This is the dev build — HMR is active, but the features are identical."

### If TTS is absent
Skip the live TTS demo. Say: "Arabic system voices aren't installed on this machine — the TTS logic is verified by 4 passing tests at `src/utils/speech.test.ts`." Move to segment 7.

### If everything fails (preview, dev, network)
1. Note the screenshots directory exists (if prepared).
2. Walk `src/App.test.tsx` (16 lines, 1 smoke test) as behavioral evidence.
3. Walk `src/data/data.test.ts` (11 integrity assertions) as the data evidence.
4. Never fake live results.

---

## Say List

Use these exact phrases (numbers are verified from facts.md):

- "47 tests passing on this machine today" (facts §7, fresh run 2026-09-10)
- "6 test files, 47 assertions" (facts §7)
- "140 treasures — test-verified at `src/data/data.test.ts:39-42`" (facts §1)
- "9 chapters, counts computed at runtime" (facts §1, §6)
- "4 localStorage keys — no server, no database" (facts §5)
- "Pure CSR: `createRoot` only, zero `hydrateRoot`" (facts §4)
- "No router, no Context API, no Redux" (facts §4, §9)
- "Content curated from Sheikh Mahmoud Al-Masri's series" (facts §1)

## Avoid List

| Do not say | Why | Say instead |
|---|---|---|
| "Fully tested" | Only 1 App smoke test (`src/App.test.tsx:6-15`); no E2E, no modal tests, no filter tests | "47 unit/component tests pass — the UI layer has one smoke test" |
| "Works offline" | No service worker, no manifest, no workbox (facts §9) | "The static build can be served from browser cache, but there is no offline PWA story" |
| "No bugs" | Timezone-dependent daily pick (`src/data/index.ts:48-55`); UTC vs local date divergence in checklist; bare localStorage writes without try/catch (`src/utils/dailyTasks.ts:46,73-79,84-89`) | "Known limitations include timezone-dependent daily pick and inconsistent localStorage error handling" |
| "100% authentic" as a test claim | Tests only assert `grade` is non-empty (`src/data/data.test.ts:45-52`); the "100%" is UI copy (`src/App.tsx:199-213`) | "The UI displays a 100% authentic label — the test suite verifies the grade field is non-empty" |
| "Production-ready" | Dead deps, no E2E, no code splitting, no CSP headers (facts §9) | "The deployment pipeline works — the roadmap addresses the gaps" |
| "Significant" or any marketing quantifier | Unverifiable | State the raw number with its file:line reference |
