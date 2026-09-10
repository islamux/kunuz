# Presentation Package — README

## 1. Run

**Direct open (recommended):**
```
open presentation/slides.html
# or on Linux:
xdg-open presentation/slides.html
```
The deck loads via `file://` — no server, no internet, zero external resources. All styles and scripts are inline in the single HTML file.

**Optional local server** (for projector machines that restrict `file://`):
```bash
npx serve presentation/        # any static file server works
# or
python3 -m http.server 8080 --directory presentation/
```
Then open `http://localhost:8080/slides.html`.

---

## 2. Keyboard Shortcuts

| Key | Action |
|---|---|
| `→` or `Space` | Next slide |
| `←` | Previous slide |
| `Home` | First slide |
| `End` | Last slide |
| `N` | Toggle speaker notes |
| `I` | Toggle slide index overlay |
| `F` | Toggle fullscreen |
| `Escape` | Close index overlay |
| Touch swipe (≥40px horizontal, beats vertical drift) | Swipe left = next, swipe right = prev (`slides.html:1043–1044`) |

**Deep-linking:** Append `#slide-N` to the URL (1-based) to open a specific slide, e.g. `slides.html#slide-16` opens the CSR vs SSR contrast table.

**On-screen controls:** Bottom-right corner — `‹` (prev), `›` (next), `Notes`, `⛶` (fullscreen). Bottom-left HUD shows current/total slide count.

---

## 3. Order of Use

1. **Pre-flight** — Run `demo-script.md` preflight commands (`pnpm install && pnpm test && pnpm lint && pnpm build && pnpm preview`) at least 15 minutes before the presentation.
2. **Deck** — Present `slides.html` following the slide order (31 slides, ~45 minutes).
3. **Demo** — At slide 27 (live demo divider), switch to the browser tab on `http://localhost:4173` and follow `demo-script.md` (~10 minutes).
4. **Q&A Guide** — After the closing slide (31), use `qa-guide.md` to field audience questions (~5 minutes).

---

## 4. Pre-Presentation Rehearsal Checklist (60-Minute Version)

### Timing

| Phase | Minutes | Cumulative |
|---|---|---|
| Opening (slides 1–4) | 5 | 5 |
| Thesis (slides 5–6) | 4 | 9 |
| Decisions (slides 7–10) | 7 | 16 |
| Mental model (slide 11) | 4 | 20 |
| Product (slides 12–14) | 5 | 25 |
| Deep dives (slides 15–26) | 14 | 39 |
| Live demo (slide 27) | 10 | 49 |
| Trade-offs (slides 28–29) | 4 | 53 |
| Roadmap (slide 30) | 3 | 56 |
| Closing (slide 31) | 4 | 60 |

Total: 31 slides, 60 minutes.

### Checklist

- [ ] **Full timed run:** Present the entire deck once, timed. Target ≤ 60 minutes including demo.
- [ ] **Deck smoke re-run:** `node /tmp/opencode/deck-smoke.mjs` → `SMOKE PASS: 31 slides` (script preserved at that path; if missing, re-create from `docs/superpowers/plans/2026-09-10-presentation-package.md` lines 278–297).
- [ ] **Slide count:** Verify 31 slides in `slides.html` (count `<section class="slide">` elements). HUD should show `N / 31`.
- [ ] **All package.json preflight commands pass:**
  - [ ] `pnpm install` — exits 0
  - [ ] `pnpm test` — 6 files / 47 tests passed (record actual numbers from this run)
  - [ ] `pnpm lint` (`tsc --noEmit`) — exit 0
  - [ ] `pnpm build` — dist/ emitted (record build time and output sizes)
  - [ ] `pnpm preview` — serves at `http://localhost:4173`
- [ ] **Fallback demo rehearsed:** Practice the 5-minute compressed version (segments 1–3 only) at least once.
- [ ] **Keyboard tested:** Test `→`, `←`, `Space`, `Home`, `End`, `N`, `I`, `F`, `Escape` in the actual presentation browser.
- [ ] **Fullscreen tested:** `F` key enters/exits fullscreen without issues.
- [ ] **Speaker notes tested:** `N` key toggles notes dock below the slide.
- [ ] **Index tested:** `I` key opens overlay with all 31 slide titles; clicking a title navigates to it.
- [ ] **Touch tested:** Swipe left/right on a touch device or emulator.
- [ ] **Print/PDF checked:** `Ctrl+P` / `Cmd+P` — every slide on its own page, notes/controls/progress hidden.
- [ ] **Aspect ratio:** Deck is designed for 16:9. On a different ratio, letterboxing appears automatically. Test on the actual projector if possible.
- [ ] **Demo backup:** Screenshots of the running app prepared in case the live preview fails.

---

## 5. Environment Requirements

| Requirement | Version | Source |
|---|---|---|
| Node.js | 20+ | `README.md:30` |
| pnpm | 11+ (pinned: 11.24.0) | `package.json:7` (`"packageManager": "pnpm@11.24.0"`) |
| Browser | Any modern browser with ES module support | Required for `type="module"` script in `index.html:18` |

**Zero external resources:** The deck (`slides.html`) loads no CDN assets, no fonts, no stylesheets, no scripts from external URLs. All CSS and JS are inline. The `file://` protocol works.

---

## 6. Known Issues

- **Dead dependencies:** `@google/genai`, `dotenv`, `express`, and `motion` are declared in `package.json:19,25,26,28` but never imported in app code. These are AI Studio template leftovers. They inflate `pnpm install` and widen the audit surface. See facts §9 for grep evidence.
- **Vite duplication:** `vite ^6.2.3` appears in both `dependencies` (`package.json:31`) and `devDependencies` (`package.json:45`). Only one copy is needed.
- **Deck smoke test:** `node /tmp/opencode/deck-smoke.mjs` (re-created from the plan, re-run this session → `SMOKE PASS: 31 slides`). It resolves `jsdom` via a `node_modules` symlink into the project's devDependencies; if the script or symlink is missing, re-create from `docs/superpowers/plans/2026-09-10-presentation-package.md` lines 278–297 and re-link, or verify slide count independently with `grep -c 'class="slide"' presentation/slides.html` (should return 31).
