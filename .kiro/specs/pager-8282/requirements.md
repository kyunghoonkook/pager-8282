# Requirements: 8282 Pager

## Overview

A static web app that revives the 1990s Korean pager numeric code language. No backend, no build step, deployable on Vercel as static files.

---

## US-1: Sender Keyword Search

**As a** sender, **I want** to type a keyword and see matching pager codes **so that** I can find the right numeric code for my message.

### Acceptance Criteria (EARS)

1. **When** the sender types a keyword in the search input, **the system shall** display all code book entries whose Korean or English keywords contain the keyword as a substring (case-insensitive).
2. **When** no code book entries match the keyword, **the system shall** display an honest "no exact code found" message and reveal the raw-digit input as a fallback.
3. **When** the sender clicks a suggested code, **the system shall** populate the digits field with that code's digits and display the code's meaning.
4. **While** the search input is empty, **the system shall** display the full code book as a browseable list.

## US-2: Sender Raw Digits + Callback Number

**As a** sender, **I want** to type raw digits and an optional callback number **so that** I can send a page even when no code book entry matches.

### Acceptance Criteria (EARS)

5. **The system shall** provide a digits input field that accepts only numeric characters, with a maximum of 20 digits.
6. **The system shall** provide a callback number input field that accepts only numeric characters, with a maximum of 15 digits. This field is optional.
7. **If** the sender enters non-numeric characters in either field, **the system shall** reject the input and not include it in the digits or callback value.
8. **When** the digits field is empty, **the system shall** disable the share-link generation.
9. **When** the digits field contains at least 1 digit, **the system shall** enable share-link generation.

## US-3: Share Link Generation

**As a** sender, **I want** to get a shareable link **so that** I can send the page to a receiver.

### Acceptance Criteria (EARS)

10. **When** the sender triggers share-link generation with valid digits, **the system shall** produce a URL with hash fragment `#p=<digits>&cb=<callback>&t=<unix seconds>`, where `t` is the current Unix timestamp in seconds.
11. **When** no callback number is provided, **the system shall** omit the `cb` parameter from the hash.
12. **The system shall** display the generated link in a read-only text field with a copy button.
13. **If** the Clipboard API is available, **the system shall** copy the link to the clipboard on button click. **If** the Clipboard API is unavailable, **the system shall** select the link text and prompt the user to copy manually.

## US-4: Receiver — Dead Pager State

**As a** receiver, **I want** to see a dead pager when I open a share link **so that** the resurrection moment is dramatic.

### Acceptance Criteria (EARS)

14. **When** a valid page hash is present in the URL on page load, **the system shall** render a pager device in a "dead" state: dark/unlit LCD, no animation, dust overlay (CSS texture), and a "tap to wake" prompt.
15. **While** the pager is in the dead state, **the system shall** not play any audio.
16. **While** the pager is in the dead state, **the system shall** not display the incoming digits or decoded meaning.

## US-5: Receiver — Resurrection

**As a** receiver, **I want** to tap the dead pager and see it come to life **so that** the Halloween "resurrection" theme is experienced.

### Acceptance Criteria (EARS)

17. **When** the user taps the pager while it is in the dead state, **the system shall** transition to an "alive" state: LCD backlights on (green), dust overlay fades out, and a WebAudio square-wave beep plays.
18. **The system shall** create the AudioContext only after the first user tap, not on page load.
19. **When** the resurrection transition completes, **the system shall** begin scrolling the incoming digits across the LCD from right to left.
20. **If** the AudioContext cannot be created (e.g., browser blocks audio), **the system shall** skip the beep and proceed with the visual resurrection.

## US-6: Receiver — LCD Scroll

**As a** receiver, **I want** to see the digits scroll across the LCD **so that** it feels like a real pager receiving a message.

### Acceptance Criteria (EARS)

21. **While** the pager is in the alive state and has incoming digits, **the system shall** scroll the digit string across the LCD from right to left using a monospace, segment-like font at a readable speed.
22. **When** the scroll completes, **the system shall** display the full digit string (or as much as fits) centered on the LCD.
23. **When** a callback number is present, **the system shall** display it on the LCD above or below the main digits, labeled as the callback number.

## US-7: Receiver — DECODE

**As a** receiver, **I want** to press a DECODE button **so that** I can learn the meaning of the code.

### Acceptance Criteria (EARS)

24. **When** the pager is alive, **the system shall** show a DECODE button (styled as a rubber button on the pager body).
25. **When** the user presses DECODE, **the system shall** look up the incoming digits in the code book and display the meaning in Korean and English, plus a short note on the code's origin/etymology.
26. **If** the incoming digits do not match any code book entry, **the system shall** display "알 수 없는 코드 / Unknown code" and show the raw digits as-is.
27. **When** a match is found, **the system shall** display the etymology type (folk etymology / direct homonym / cultural reference) and confidence level.

## US-8: Inbox

**As a** receiver, **I want** received pages stored in an inbox **so that** I can review them later.

### Acceptance Criteria (EARS)

28. **When** a page is received (resurrection triggered), **the system shall** store the page data (digits, callback number, timestamp) in localStorage under the key `pager8282_inbox`.
29. **The system shall** keep at most 50 pages. **When** the 51st page arrives, **the system shall** remove the oldest page.
30. **The system shall** display the inbox as a list on the pager, showing each page's digits, callback number (if any), and received time.
31. **When** the user selects an inbox entry, **the system shall** display that page's digits on the LCD and allow decoding.
32. **The system shall** provide a clear-inbox function that empties localStorage and refreshes the list.

## US-9: Visual Design — Pager Device

**As a** user, **I want** the app to look like a physical 1990s pager **so that** the experience is authentic and nostalgic.

### Acceptance Criteria (EARS)

33. **The system shall** render the pager with a dark grey plastic body (CSS border, box-shadow, and texture — no gradients).
34. **The system shall** render the LCD as a green backlit monochrome display with a dark green background and light green segment-like monospace digits.
35. **The system shall** render rubber-style buttons (DECODE, inbox navigation) with a tactile appearance (raised, matte, dark rubber color).
36. **The system shall not** use decorative gradients, glow effects, pill-shaped badges, or editorial-minimal styling anywhere in the app.

## US-10: No-Backend Static Deployment

**As a** developer, **I want** the app to be deployable as static files **so that** it can be hosted on Vercel without server-side code.

### Acceptance Criteria (EARS)

37. **The system shall** consist entirely of static files (HTML, CSS, JS) with no server-side runtime.
38. **The system shall** store all application state client-side (URL hash for page data, localStorage for inbox).
39. **The system shall** function correctly when served from any static file host, including Vercel's default static hosting.
