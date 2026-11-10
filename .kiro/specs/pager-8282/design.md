# Design: 8282 Pager

## Architecture

### Mode Detection

`main.js` is the single entry point. On page load it inspects `window.location.hash`:

- **Hash present and valid** → Receiver mode: render the pager device with the incoming page data.
- **Hash absent or invalid** → Sender mode: render the search/compose UI.

No client-side router. The hash is the only mode switch. `hash.js` provides `decode()` for this check and `encode()` for link generation.

### Module Graph

```
index.html
  └─ <script type="module" src="src/main.js">
       ├─ import { decode, encode } from './hash.js'
       ├─ import { search, decode as decodeCode } from './codebook.js'
       ├─ import { initSender } from './sender.js'     // only if sender mode
       └─ import { initReceiver } from './receiver.js'  // only if receiver mode
```

Both `sender.js` and `receiver.js` import `codebook.js` and `hash.js`. `receiver.js` also imports `inbox.js`. Audio is inline in `receiver.js`.

### Sender UI Layout

```
┌─────────────────────────────┐
│  8282 — 삐삐 코드 보내기       │
├─────────────────────────────┤
│ [ 검색: ____________ ]       │
│                              │
│ ┌─ 검색 결과 ──────────────┐ │
│ │ 8282  빨리빨리 / Hurry   │ │
│ │ 1004  천사 / Angel       │ │
│ │ ...                       │ │
│ └───────────────────────────┘ │
│                              │
│ 숫자 코드: [____________]     │  ← max 20 digits
│ 콜백 번호: [____________]     │  ← max 15 digits, optional
│                              │
│ [ 링크 생성 ]                 │
│                              │
│ 공유 링크:                    │
│ [https://...#p=8282&t=...]   │
│ [ 복사 ]                      │
└─────────────────────────────┘
```

### Receiver UI Layout (Pager Device)

```
        ┌──────────────────────────┐
        │    ┌──────────────────┐  │   ← dark grey plastic body
        │    │  ┌────────────┐  │  │
        │    │  │ 8 2 8 2    │  │  │   ← green backlit LCD
        │    │  │ CB: 010... │  │  │
        │    │  └────────────┘  │  │
        │    │                   │  │
        │    │  [DECODE] [INBOX]  │  │   ← rubber buttons
        │    └──────────────────┘  │
        └──────────────────────────┘
```

**Dead state**: LCD is dark (background near-black, no digits), a dust-texture overlay sits on top, and a faint "TAP TO WAKE" prompt blinks slowly. No audio.

**Alive state**: LCD backlight turns green, dust overlay fades out, beep plays, digits scroll in from right to left.

---

## Code Book Data Model

Each entry is a plain object:

```js
{
  code: "8282",                    // string of digits [0-9]
  meaning_ko: "빨리빨리",            // Korean meaning
  meaning_en: "Hurry up",          // English meaning
  keywords_ko: ["빨리", "빨리빨리", "급해", "빠르게"],  // Korean search keywords
  keywords_en: ["hurry", "quick", "fast", "rush"],     // English search keywords
  etymology_type: "folk",          // "folk" | "direct" | "reference"
  confidence: "high",              // "high" | "medium" | "low"
  note_ko: "8=팔→빨, 2=이→리. 빨리를 두 번 반복.",  // how the code maps
  note_en: "8=pal→ppal, 2=i→ri. 'Hurry' repeated twice."
}
```

### `etymology_type` values

| Value | Meaning |
|---|---|
| `folk` | Sound-based folk etymology — Korean number pronunciation loosely resembles the target word. These are cultural conventions, not linguistic rules. |
| `direct` | Direct homonym — the number reads exactly as a Korean word (e.g., 1004 = 천사). |
| `reference` | Cultural reference — the number refers to a real phone number, date, or cultural convention (e.g., 112 = police emergency). |

### `confidence` values

| Value | Meaning |
|---|---|
| `high` | Widely known, referenced in media/pop culture, near-universal among Koreans who experienced the pager era. |
| `medium` | Known in pager-culture circles but less universally recognized. |
| `low` | Plausible construction based on the same sound-mapping system, but usage as an actual pager code is unverified. Clearly labeled as such. |

### Code Book Entries (18)

| # | Code | Korean | English | Etymology | Confidence | Origin note |
|---|---|---|---|---|---|---|
| 1 | 8282 | 빨리빨리 | Hurry up | folk | high | 8=팔→빨, 2=이→리. 빨리 repeated. |
| 2 | 1004 | 천사 | Angel | direct | high | 1004 reads as 천사 (천=1000, 사=4), the Korean word for "angel." |
| 3 | 486 | 사랑해 | I love you | folk | high | 4=사, 8=팔→랑, 6=육→해. Loosely maps to 사랑해. Widely referenced in pop culture. |
| 4 | 7942 | 친구사이 | Between friends | folk | high | 7=칠→친, 9=구, 4=사, 2=이 → 친구사이. |
| 5 | 0242 | 연인사이 | Between lovers | folk | high | 0=영→연, 2=이, 4=사, 2=이 → 연인사이. (0=영→연 is a loose mapping.) |
| 6 | 5824 | 오빠 빨리 와 | Oppa, come quickly | folk | medium | 5=오→오빠(abbrev.), 8=팔→빨, 2=이→리, 4=사→와 → 오빠빨리와. |
| 7 | 112 | 급한 일 | Urgent matter | reference | high | References 112, the Korean police emergency number. Urgent: call back immediately. |
| 8 | 1010235 | 열렬히 사모 | Passionately adore | folk | medium | 10=열, 10=열, 2=이→히, 3=삼→사, 5=오→모 → 열렬히 사모. Several mappings are loose. |
| 9 | 1225 | 크리스마스 | Christmas | reference | high | Date reference: December 25 (12월 25일). |
| 10 | 119 | 응급 | Emergency | reference | high | References 119, the Korean fire/ambulance emergency number. |
| 11 | 825 | 빨리 와 | Come quickly | folk | medium | 8=팔→빨, 2=이→리, 5=오→와 → 빨리 와. |
| 12 | 7982 | 친구 빨리 | Friend, hurry | folk | low | 7=칠→친, 9=구, 8=팔→빨, 2=이→리 → 친구 빨리. Unverified as a standalone code. |
| 13 | 49 | 사귀자 | Let's date | folk | medium | 4=사, 9=구 → 사구 → 사귀 (from 사귀다, to associate/date). |
| 14 | 79 | 친구 | Friend | folk | low | 7=칠→친, 9=구 → 친구. Short form of 7942; unverified as standalone. |
| 15 | 214 | 발렌타인 데이 | Valentine's Day | reference | medium | Date reference: February 14. In Korea, women give chocolate to men. |
| 16 | 314 | 화이트 데이 | White Day | reference | medium | Date reference: March 14. In Korea, men give candy to women (response to Valentine's). |
| 17 | 100 | 백일 | 100-day anniversary | reference | medium | Cultural reference: 100-day anniversaries are significant in Korean dating culture. |
| 18 | 1111 | 빼빼로 데이 | Pepero Day | reference | low | Date reference: November 11. Pepero Day began mid-1990s in Korea. Note: pagers were declining by then. |

> **Honesty note**: Entries marked `confidence: "low"` are plausible constructions based on the same sound-mapping system used by well-documented codes, but their actual historical usage as pager codes is unverified. They are included to make the code book useful, not to fabricate history. The confidence level is always shown to the receiver on decode.

---

## URL Hash Format and Validation

### Format

```
#p=<digits>&cb=<digits>&t=<unix seconds>
```

| Parameter | Required | Constraints | Description |
|---|---|---|---|
| `p` | Yes | 1–20 digits, `[0-9]+` | Pager code / message digits |
| `cb` | No | 1–15 digits, `[0-9]+` | Callback number |
| `t` | No | 1–10 digits, `[0-9]+` | Unix timestamp in seconds |

### Encoding Rules (`hash.encode`)

1. `p` is required. If empty or non-digit, throw `Error`.
2. If `p.length > 20`, throw `Error`.
3. `cb` is optional. If provided, must be 1–15 digits. If `cb.length > 15`, throw `Error`.
4. `t` is optional. If not provided, use `Math.floor(Date.now() / 1000)`.
5. Build the hash string: always include `p` and `t`. Include `cb` only if provided.
6. Return `#p=<p>&cb=<cb>&t=<t>` (with cb) or `#p=<p>&t=<t>` (without cb).

### Decoding Rules (`hash.decode`)

1. Strip the leading `#` if present.
2. Split on `&` into key=value pairs.
3. Validate each key is one of `p`, `cb`, `t`. Unknown keys → invalid.
4. `p` must be present. Missing → invalid.
5. `p` must match `/^[0-9]{1,20}$/`. Otherwise → invalid.
6. `cb` if present must match `/^[0-9]{1,15}$/`. Otherwise → invalid.
7. `t` if present must match `/^[0-9]{1,10}$/`. Otherwise → invalid.
8. Return `{ p: string, cb: string | null, t: string }` on success.
9. Return `null` on any validation failure.

### Strictness

- No URL-encoded characters allowed in values (digits only, no `%` encoding needed).
- No duplicate keys allowed. Duplicates → invalid.
- Order of parameters does not matter, but `p` must always be present.
- Empty hash (`#` or `""`) → sender mode (not an error, just no page).

---

## Components

### 1. `hash.js`

Pure functions, no DOM, no side effects. Testable in Node without a browser.

```
encode(page: { p: string, cb?: string, t?: number }) → string
decode(hash: string) → { p, cb, t } | null
hasValidHash() → boolean   // checks window.location.hash (browser only)
```

### 2. `codebook.js`

Pure data + pure functions.

```
CODEBOOK: CodeEntry[]           // exported array
search(keyword: string) → CodeEntry[]   // case-insensitive substring match on keywords_ko + keywords_en
decode(digits: string) → CodeEntry | null  // exact match on code field
```

### 3. `sender.js`

DOM manipulation for sender mode. Exported `initSender(container: HTMLElement)`.

- Renders search input, results list, digits input, callback input, generate button, share link output.
- On search input: calls `codebook.search()`, re-renders results.
- On result click: fills digits input with code.
- On generate click: validates inputs, calls `hash.encode()`, displays link.
- Copy button: uses `navigator.clipboard.writeText()` with fallback to `select()`.

### 4. `receiver.js`

DOM manipulation + audio for receiver mode. Exported `initReceiver(container: HTMLElement, pageData)`.

States: `dead` → `alive` → `decoded`.

- `dead`: renders pager with dark LCD, dust overlay, "TAP TO WAKE" prompt.
- On tap: transition to `alive`. Lazy-create `AudioContext`, play square-wave beep (800 Hz, 0.15 s duration, square type). Fade out dust. Start LCD scroll.
- `alive`: digits scroll right-to-left via CSS animation. Show DECODE button.
- On DECODE: call `codebook.decode(pageData.p)`. Display meaning + etymology + confidence on LCD. Transition to `decoded`.
- On page received: call `inbox.addPage(pageData)`.

### 5. `inbox.js`

localStorage wrapper.

```
addPage(page: { p: string, cb: string | null, t: string }) → void
getInbox() → Page[]            // newest first
clearInbox() → void
MAX_PAGES = 50                 // trim oldest when exceeded
```

- Serialize as JSON array under `localStorage` key `pager8282_inbox`.
- If localStorage is unavailable (private browsing), gracefully degrade: `addPage` is a no-op, `getInbox` returns `[]`.

---

## Error Handling

| Scenario | Behavior |
|---|---|
| Invalid hash on page load | Fall back to sender mode. Do not show an error. |
| Empty hash on page load | Sender mode (normal entry). |
| Hash with unknown parameters | `hash.decode()` returns `null` → sender mode. |
| Hash with `p` too long (>20) | `hash.decode()` returns `null` → sender mode. |
| Code not found on DECODE | Display "알 수 없는 코드 / Unknown code" on LCD, show raw digits. |
| localStorage unavailable | `inbox.addPage()` silently no-ops. `getInbox()` returns `[]`. Inbox list shows "저장 불가 / Storage unavailable". |
| AudioContext blocked | Skip beep, proceed with visual resurrection. Log a console warning. |
| Clipboard API unavailable | Select the link text in the input field, show "Ctrl+C로 복사하세요 / Press Ctrl+C to copy". |
| Digits field empty on generate | Disable generate button (visual, not an error). |

**No `alert()` or `confirm()` calls anywhere.** All feedback is inline in the UI.

---

## Testing Strategy

### Test Runner

`node --test` (built-in Node.js test runner). Tests run in Node, not in a browser. Only pure-logic modules (`hash.js`, `codebook.js`) are tested directly — DOM modules (`sender.js`, `receiver.js`, `inbox.js`) are tested manually in the browser.

### Test File: `test/hash.test.mjs`

Uses `fast-check` for property-based testing. All tests are ES modules (`.mjs`).

#### Test 1: Encode → Decode round-trip

**Property**: For any valid `page` object (p: 1–20 digits, cb: null or 1–15 digits, t: 1–10 digit unix seconds), `decode(encode(page))` must return an object equal to the original.

```js
import { encode, decode } from '../src/hash.js';
import fc from 'fast-check';

fc.assert(fc.property(
  fc.record({
    p: fc.stringMatching(/^[0-9]{1,20}$/),
    cb: fc.oneof(fc.constant(null), fc.stringMatching(/^[0-9]{1,15}$/)),
    t: fc.stringMatching(/^[0-9]{1,10}$/),
  }),
  (page) => {
    const hash = encode(page);
    const decoded = decode(hash);
    return decoded !== null &&
      decoded.p === page.p &&
      decoded.cb === page.cb &&
      decoded.t === page.t;
  }
));
```

#### Test 2: Decode rejects invalid inputs

**Property**: For any string that does not contain a valid `p` parameter with digits, `decode()` returns `null`.

```js
fc.assert(fc.property(fc.string(), (s) => {
  const decoded = decode(s);
  // null is always acceptable for garbage input
  if (decoded !== null) {
    // if non-null, p must be valid
    return /^[0-9]{1,20}$/.test(decoded.p);
  }
  return true;
}));
```

#### Test 3: Encode rejects empty p

```js
assert.throws(() => encode({ p: '' }));
assert.throws(() => encode({ p: 'abc' }));
assert.throws(() => encode({ p: '123456789012345678901' })); // 21 digits
```

#### Test 4: Decode handles edge cases

```js
// Empty hash → null
assert.strictEqual(decode(''), null);
assert.strictEqual(decode('#'), null);

// Well-formed hash → correct object
assert.deepStrictEqual(
  decode('#p=8282&t=1700000000'),
  { p: '8282', cb: null, t: '1700000000' }
);

// Well-formed hash with callback
assert.deepStrictEqual(
  decode('#p=1004&cb=01012345678&t=1700000000'),
  { p: '1004', cb: '01012345678', t: '1700000000' }
);

// Malformed: no p
assert.strictEqual(decode('#t=1700000000'), null);
// Malformed: p too long (21 digits)
assert.strictEqual(decode('#p=' + '1'.repeat(21) + '&t=1'), null);
// Malformed: unknown key
assert.strictEqual(decode('#p=8282&x=1&t=1'), null);
// Malformed: non-digit p
assert.strictEqual(decode('#p=abc&t=1'), null);
// Malformed: duplicate key
assert.strictEqual(decode('#p=8282&p=1004&t=1'), null);
```

#### Test 5: Code book search

```js
import { search, decode as decodeCode, CODEBOOK } from '../src/codebook.js';

// Search by Korean keyword
assert(search('빨리').length > 0);
assert(search('천사').some(e => e.code === '1004'));

// Search by English keyword
assert(search('angel').some(e => e.code === '1004'));
assert(search('hurry').some(e => e.code === '8282'));

// Case-insensitive
assert(search('ANGEL').some(e => e.code === '1004'));

// Empty query returns all
assert.strictEqual(search('').length, CODEBOOK.length);

// Decode exact match
assert.strictEqual(decodeCode('8282').meaning_ko, '빨리빨리');
assert.strictEqual(decodeCode('0000'), null);
```

#### Running tests

```bash
npm test
# or: node --test test/
```

#### fast-check note

`fast-check` generates random inputs within the constraints defined by arbitraries. The round-trip property test runs ~1000 random cases by default, catching edge cases that hand-written tests miss (e.g., boundary digit lengths, empty callback, minimal/maximal timestamps).

### Manual Browser Testing Checklist

- [ ] Open `index.html` with no hash → sender mode appears
- [ ] Type "angel" → 1004 appears in results
- [ ] Click 1004 → digits field fills with "1004"
- [ ] Type callback "01012345678" → generate link → link contains `p=1004&cb=01012345678&t=...`
- [ ] Copy link, open in new tab → dead pager appears
- [ ] Tap pager → LCD lights up, beep plays, digits scroll
- [ ] Tap DECODE → meaning "천사 / Angel" appears with etymology note
- [ ] Check inbox → page appears in list
- [ ] Open 50+ pages → oldest is trimmed
- [ ] Open link with invalid hash → sender mode appears (no crash)
- [ ] Open link with `#p=abc&t=1` → sender mode appears (invalid, no crash)
