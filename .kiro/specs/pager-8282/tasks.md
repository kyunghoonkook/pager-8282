# Tasks: 8282 Pager

Implementation checklist. Each task references the requirements it satisfies (US-N from requirements.md).

---

## 1. Project scaffold and static file setup — [x] (refs: US-10)

- [x] Create `index.html` with minimal structure: a single `<div id="app">` container and `<script type="module" src="src/main.js">`.
- [x] Create `styles.css` with CSS reset, CSS custom properties (colors: dark grey plastic `#2a2a2a`, LCD green-on-dark `#0a3d0a`/`#7CFC00`, rubber button `#1a1a1a`), and system monospace font stack.
- [x] Create `package.json` with `type: "module"`, `scripts.test = "node --test test/*.test.mjs"`, and `devDependencies.fast-check`.
- [x] Create `src/main.js` skeleton: import `hash.js`, check `window.location.hash`, call `initSender` or `initReceiver` based on hash validity.
- [x] Verify: opening `index.html` in a browser shows a blank page with no console errors.

## 2. Code book data module — [x] (refs: US-1, US-7)

- [x] Create `src/codebook.js` with the `CODEBOOK` array (18 entries per design.md) and `search(keyword)` and `decode(digits)` functions.
- [x] Each entry: `code`, `meaning_ko`, `meaning_en`, `keywords_ko[]`, `keywords_en[]`, `etymology_type`, `confidence`, `note_ko`, `note_en`.
- [x] `search()`: case-insensitive substring match on `keywords_ko` and `keywords_en`. Empty string returns all entries.
- [x] `decode()`: exact match on `code` field. Returns `null` if not found.
- [x] Verify: `node -e "import('./src/codebook.js').then(m => console.log(m.search('angel')))"` returns the 1004 entry.

## 3. Hash encode/decode/validate module + tests — [x] (refs: US-2, US-3)

- [x] Create `src/hash.js` with `encode(page)`, `decode(hash)`, and `hasValidHash()` functions per design.md validation rules.
- [x] `encode`: validates p (1–20 digits), cb (1–15 digits, optional), t (optional, defaults to now). Returns `#p=...&cb=...&t=...` string.
- [x] `decode`: strips `#`, splits on `&`, validates keys are only `p`/`cb`/`t`, validates p present and 1–20 digits, cb 1–15 digits if present, t 1–10 digits if present. Returns object or `null`.
- [x] No duplicate keys allowed. Unknown keys → `null`.
- [x] Create `test/hash.test.mjs` with fast-check property tests:
  - [x] Round-trip: `decode(encode(page))` returns original for all valid pages.
  - [x] Invalid rejection: `decode()` returns `null` for garbage/missing-p/oversized/unknown-key inputs.
  - [x] Encode rejection: `encode()` throws on empty/non-digit/oversized `p`.
  - [x] Code book search and decode assertions.
- [x] Run `npm test` — all tests pass.

## 4. Sender UI — [x] (refs: US-1, US-2, US-3)

- [x] Create `src/sender.js` exporting `initSender(container)`.
- [x] Render: search input, results list (code + meaning_ko + meaning_en), digits input (max 20, numeric only), callback input (max 15, numeric only, optional), generate button, share link output + copy button.
- [x] On search input: call `codebook.search()`, re-render results. Empty query shows all entries.
- [x] On result click: fill digits input with the code.
- [x] On generate click: validate digits non-empty, call `hash.encode()`, display link.
- [x] Copy button: `navigator.clipboard.writeText()` with `select()` fallback.
- [x] Digits and callback inputs: reject non-numeric characters via `inputmode="numeric"` and JS filtering.
- [x] Generate button disabled when digits field is empty.
- [x] Add sender CSS to `styles.css` (functional, not yet styled as pager — styling happens in task 6).

## 5. Pager device CSS — [x] (refs: US-9)

- [x] Add pager CSS to `styles.css`: dark grey plastic body (`#2a2a2a`, border-radius, box-shadow for depth, no gradients).
- [x] LCD: dark green background (`#0a3d0a`), light green text (`#7CFC00`), monospace font, segment-like appearance.
- [x] Rubber buttons: raised matte dark rubber appearance (border, box-shadow, no rounded pill shapes).
- [x] Dead state: LCD dark (near-black background, no text), dust overlay (CSS pseudo-element with `radial-gradient` noise or `box-shadow` speckle — this is a texture effect, not a decorative gradient), "TAP TO WAKE" blink animation.
- [x] Alive state: LCD backlight on (green background), dust fade-out transition.
- [x] Scroll animation: `@keyframes` right-to-left scroll for digit string on LCD.
- [x] Responsive: pager scales to fit mobile viewport.

## 6. Receiver flow — [x] (refs: US-4, US-5, US-6, US-7)

- [x] Create `src/receiver.js` exporting `initReceiver(container, pageData)`.
- [x] Dead state: render pager with dark LCD, dust overlay, "TAP TO WAKE" prompt.
- [x] On tap (dead → alive): lazy-create `AudioContext`, play square-wave beep (800 Hz, 0.15 s, `type: 'square'`). Fade out dust. Start LCD scroll of `pageData.p`.
- [x] If AudioContext creation fails, catch error, skip beep, proceed with visual.
- [x] LCD scroll: CSS animation scrolling `pageData.p` right-to-left. After scroll, show digits centered.
- [x] Callback display: if `pageData.cb` present, show "CB: <number>" on a second LCD line.
- [x] DECODE button: on press, call `codebook.decode(pageData.p)`. If found, display meaning_ko, meaning_en, etymology type, confidence, note_ko, note_en. If not found, display "알 수 없는 코드 / Unknown code".
- [x] On resurrection (tap), call `inbox.addPage(pageData)`.

## 7. Inbox — [x] (refs: US-8)

- [x] Create `src/inbox.js` with `addPage()`, `getInbox()`, `clearInbox()`.
- [x] Storage key: `pager8282_inbox`. JSON array. Newest first.
- [x] `addPage()`: prepend new page, trim to 50 entries (remove oldest), write to localStorage.
- [x] `getInbox()`: parse localStorage, return array. Return `[]` if unavailable.
- [x] `clearInbox()`: remove key from localStorage.
- [x] Graceful degradation: if `localStorage` throws (private browsing), `addPage` is a no-op, `getInbox` returns `[]`.
- [x] Render inbox list on pager: each entry shows digits, callback (if any), received time.
- [x] Inbox navigation button on pager. Selecting an entry shows its digits on LCD and allows decoding.
- [x] Clear-inbox button with inline confirmation (not `confirm()` — use a second tap pattern or "정말 지우시겠습니까?" inline text).

## 8. Integration, polish, and deployment — [x] (refs: US-4–US-10)

- [x] Wire `main.js`: on load, check hash → receiver mode or sender mode.
- [x] End-to-end test: compose a page in sender mode → copy link → open in new tab → receiver mode → tap → beep → scroll → decode → inbox.
- [x] Test invalid hashes: `#p=abc`, `#p=` + '1'.repeat(21), `#x=1` → all fall back to sender mode.
- [x] Test empty hash → sender mode.
- [x] Test audio: confirm beep only plays after tap, not on page load.
- [x] Test localStorage: receive 51 pages → oldest trimmed. Test in private browsing → no crash.
- [x] Visual review: no gradients, no glow effects, no pill badges. Pager looks like a physical 1990s device.
- [x] Run `npm test` — all fast-check tests pass.
- [ ] Deploy to Vercel (static files, no config needed) — verify share links work in production.
