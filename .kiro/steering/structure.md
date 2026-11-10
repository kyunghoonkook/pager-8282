# Structure: 8282

## Directory Structure

```
/
├── index.html              # Single entry point (sender or receiver mode auto-detected from URL hash)
├── styles.css              # All CSS (pager device, sender UI, shared resets)
├── package.json            # Test dependencies only (fast-check); type: module
├── src/
│   ├── main.js             # Entry: detects mode from URL hash, imports sender or receiver
│   ├── codebook.js         # Code book data array + search() + decode()
│   ├── hash.js             # URL hash encode(), decode(), validate()
│   ├── sender.js           # Sender UI: keyword search, code suggestion, raw digits, share link
│   ├── receiver.js         # Receiver UI: pager display, resurrection, beep, scroll, decode
│   └── inbox.js            # localStorage inbox: addPage(), getInbox(), clearInbox()
└── test/
    └── hash.test.mjs       # Property-based tests for hash encode/decode round-trip (fast-check)
```

## Module Dependencies

```
main.js
├── hash.js            (detects mode from URL hash)
├── sender.js
│   ├── codebook.js    (keyword search)
│   └── hash.js        (generates share link)
└── receiver.js
    ├── codebook.js    (decode lookup)
    ├── inbox.js       (stores received page)
    └── hash.js        (parses incoming page data)
```

Audio (beep) is handled inline in receiver.js using the Web Audio API — no separate module needed for a single square-wave oscillator.

## Data Flow

### Sender Flow
1. User types keyword → `codebook.search()` returns matching entries → results displayed
2. User selects a code or types raw digits → `hash.encode()` generates share link → displayed with copy button
3. User copies/shares link

### Receiver Flow
1. URL hash detected on page load → `hash.decode()` validates and extracts page data
2. Pager renders in dead state → user taps → receiver triggers resurrection animation
3. WebAudio beep plays (after user gesture) → digits scroll across LCD
4. User taps DECODE → `codebook.decode()` looks up meaning → displayed on LCD
5. Page stored via `inbox.addPage()`

## Key Design Decisions

- **Single HTML entry**: Mode (sender vs receiver) auto-detected from URL hash presence. No client-side router.
- **Single CSS file**: `styles.css` covers everything — resets, pager device, sender UI. One file keeps the project simple.
- **ES modules**: Native browser ESM via `<script type="module">`. No bundler.
- **No framework**: Vanilla JS DOM manipulation. The app is small enough that a framework adds overhead without benefit.
- **Code book as JS data**: The code book is a plain JS array in `codebook.js`, not a JSON file. Single source of truth importable by both sender (search) and receiver (decode).
- **Audio inline**: The beep is a single square-wave oscillator. Not worth a separate module. Implemented in `receiver.js`.
