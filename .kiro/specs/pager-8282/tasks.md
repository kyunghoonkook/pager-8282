# Tasks: 8282 Pager

Implementation checklist. Each task references the requirements it satisfies (US-N from requirements.md).

---

## 1. Project scaffold and static file setup — [ ] (refs: US-10)

- [ ] Create `index.html` with minimal structure: a single `<div id="app">` container and `<script type="module" src="src/main.js">`.
- [ ] Create `styles.css` with CSS reset, CSS custom properties (colors: dark grey plastic `#2a2a2a`, LCD green-on-dark `#0a3d0a`/`#7CFC00`, rubber button `#1a1a1a`), and system monospace font stack.
- [ ] Create `package.json` with `type: "module"`, `scripts.test = "node --test test/"`, and `devDependencies.fast-check`.
- [ ] Create `src/main.js` skeleton: import `hash.js`, check `window.location.hash`, call `initSender` or `initReceiver` based on hash validity.
- [ ] Verify: opening `index.html` in a browser shows a blank page with no console errors.

## 2. Code book data module — [ ] (refs: US-1, US-7)

- [ ] Create `src/codebook.js` with the `CODEBOOK` array (18 entries per design.md) and `search(keyword)` and `decode(digits)` functions.
- [ ] Each entry: `code`, `meaning_ko`, `meaning_en`, `keywords_ko[]`, `keywords_en[]`, `etymology_type`, `confidence`, `note_ko`, `note_en`.
- [ ] `search()`: case-insensitive substring match on `keywords_ko` and `keywords_en`. Empty string returns all entries.
- [ ] `decode()`: exact match on `code` field. Returns `null` if not found.
- [ ] Verify: `node -e "import('./src/codebook.js').then(m => console.log(m.search('angel')))"` returns the 1004 entry.

## 3. Hash encode/decode/validate module + tests — [ ] (refs: US-2, US-3)

- [ ] Create `src/hash.js` with `encode(page)`, `decode(hash)`, and `hasValidHash()` functions per design.md validation rules.
- [ ] `encode`: validates p (1–20 digits), cb (1–15 digits, optional), t (optional, defaults to now). Returns `#p=...&cb=...&t=...` string.
- [ ] `decode`: strips `#`, splits on `&`, validates keys are only `p`/`cb`/`t`, validates p present and 1–20 digits, cb 1–15 digits if present, t 1–10 digits if present. Returns object or `null`.
- [ ] No duplicate keys allowed. Unknown keys → `null`.
- [ ] Create `test/hash.test.mjs` with fast-check property tests:
  - [ ] Round-trip: `decode(encode(page))` returns original for all valid pages.
  - [ ] Invalid rejection: `decode()` returns `null` for garbage/missing-p/oversized/unknown-key inputs.
  - [ ] Encode rejection: `encode()` throws on empty/non-digit/oversized `p`.
  - [ ] Code book search and decode assertions.
- [ ] Run `npm test` — all tests pass.

## 4. Sender UI — [ ] (refs: US-1, US-2, US-3)

- [ ] Create `src/sender.js` exporting `initSender(container)`.
- [ ] Render: search input, results list (code + meaning_ko + meaning_en), digits input (max 20, numeric only), callback input (max 15, numeric only, optional), generate button, share link output + copy button.
- [ ] On search input: call `codebook.search()`, re-render results. Empty query shows all entries.
- [ ] On result click: fill digits input with the code.
- [ ] On generate click: validate digits non-empty, call `hash.encode()`, display link.
- [ ] Copy button: `navigator.clipboard.writeText()` with `select()` fallback.
- [ ] Digits and callback inputs: reject non-numeric characters via `inputmode="numeric"` and JS filtering.
- [ ] Generate button disabled when digits field is empty.
- [ ] Add sender CSS to `styles.css` (functional, not yet styled as pager — styling happens in task 6).

## 5. Pager device CSS — [ ] (refs: US-9)

- [ ] Add pager CSS to `styles.css`: dark grey plastic body (`#2a2a2a`, border-radius, box-shadow for depth, no gradients).
- [ ] LCD: dark green background (`#0a3d0a`), light green text (`#7CFC00`), monospace font, segment-like appearance.
- [ ] Rubber buttons: raised matte dark rubber appearance (border, box-shadow, no rounded pill shapes).
- [ ] Dead state: LCD dark (near-black background, no text), dust overlay (CSS pseudo-element with `radial-gradient` noise or `box-shadow` speckle — this is a texture effect, not a decorative gradient), "TAP TO WAKE" blink animation.
- [ ] Alive state: LCD backlight on (green background), dust fade-out transition.
- [ ] Scroll animation: `@keyframes` right-to-left scroll for digit string on LCD.
- [ ] Responsive: pager scales to fit mobile viewport.

## 6. Receiver flow — [ ] (refs: US-4, US-5, US-6, US-7)

- [ ] Create `src/receiver.js` exporting `initReceiver(container, pageData)`.
- [ ] Dead state: render pager with dark LCD, dust overlay, "TAP TO WAKE" prompt.
- [ ] On tap (dead → alive): lazy-create `AudioContext`, play square-wave beep (800 Hz, 0.15 s, `type: 'square'`). Fade out dust. Start LCD scroll of `pageData.p`.
- [ ] If AudioContext creation fails, catch error, skip beep, proceed with visual.
- [ ] LCD scroll: CSS animation scrolling `pageData.p` right-to-left. After scroll, show digits centered.
- [ ] Callback display: if `pageData.cb` present, show "CB: <number>" on a second LCD line.
- [ ] DECODE button: on press, call `codebook.decode(pageData.p)`. If found, display meaning_ko, meaning_en, etymology type, confidence, note_ko, note_en. If not found, display "알 수 없는 코드 / Unknown code".
- [ ] On resurrection (tap), call `inbox.addPage(pageData)`.

## 7. Inbox — [ ] (refs: US-8)

- [ ] Create `src/inbox.js` with `addPage()`, `getInbox()`, `clearInbox()`.
- [ ] Storage key: `pager8282_inbox`. JSON array. Newest first.
- [ ] `addPage()`: prepend new page, trim to 50 entries (remove oldest), write to localStorage.
- [ ] `getInbox()`: parse localStorage, return array. Return `[]` if unavailable.
- [ ] `clearInbox()`: remove key from localStorage.
- [ ] Graceful degradation: if `localStorage` throws (private browsing), `addPage` is a no-op, `getInbox` returns `[]`.
- [ ] Render inbox list on pager: each entry shows digits, callback (if any), received time.
- [ ] Inbox navigation button on pager. Selecting an entry shows its digits on LCD and allows decoding.
- [ ] Clear-inbox button with inline confirmation (not `confirm()` — use a second tap pattern or "정말 지우시겠습니까?" inline text).

## 8. Integration, polish, and deployment — [ ] (refs: US-4–US-10)

- [ ] Wire `main.js`: on load, check hash → receiver mode or sender mode.
- [ ] End-to-end test: compose a page in sender mode → copy link → open in new tab → receiver mode → tap → beep → scroll → decode → inbox.
- [ ] Test invalid hashes: `#p=abc`, `#p=` + '1'.repeat(21), `#x=1` → all fall back to sender mode.
- [ ] Test empty hash → sender mode.
- [ ] Test audio: confirm beep only plays after tap, not on page load.
- [ ] Test localStorage: receive 51 pages → oldest trimmed. Test in private browsing → no crash.
- [ ] Visual review: no gradients, no glow effects, no pill badges. Pager looks like a physical 1990s device.
- [ ] Run `npm test` — all fast-check tests pass.
- [ ] Deploy to Vercel (static files, no config needed) — verify share links work in production.
