# Product: 8282

## Vision

8282 revives the 1990s Korean pager (삐삐) numeric code language as a shareable web experience. Before mobile phones had keyboards, Koreans sent short numeric codes to pagers — 8282 for 빨리빨리 (hurry), 1004 for 천사 (angel), 486 for 사랑해 (I love you). This project brings that culture back for the Kiroween 2026 "Resurrection" category.

## Background

In 1990s Korea, pagers were the primary personal communication device. Since pagers could only display numbers, people developed a numeric code language based on Korean number pronunciation (e.g., 8 = 팔 sounds like 빨 in 빨리). Codes ranged from simple sound mappings to complex multi-digit phrases. This code language is a unique piece of Korean digital heritage.

The callback practice: you called the pager service, entered a callback number, and optionally appended a numeric code. The recipient saw the callback number and the code on their pager LCD, then decoded the meaning from memory.

## Target Users

- Koreans nostalgic for 1990s pager culture
- International users curious about Korean digital history
- Hackathon attendees experiencing the "Resurrection" theme

## Key Features

### Sender Mode
- Type a message or pick a meaning; the app suggests pager codes from the code book by keyword match (Korean and English keywords)
- Honest "no exact code" fallback that lets the sender type raw digits (max 20 digits) plus an optional callback number
- Generates a share link where the page lives in the URL hash

### Receiver Mode
- Opens a share link and sees a 1990s pager device
- First tap "resurrects" the dead pager (Halloween: it was in a drawer, dusty, dead battery)
- WebAudio square wave beep (only after a user gesture)
- Green LCD scrolls the digits
- DECODE button reveals the meaning in Korean and English plus a short note on the code's origin

### Inbox
- Received pages kept in localStorage (max 50)
- Shown as a list on the pager

## Design Philosophy

- Physical 1990s pager rendered in CSS (not a modern web widget)
- Dark grey plastic body, green backlit monochrome LCD
- Segment-like monospace digits on the LCD
- Rubber buttons
- Forbidden: decorative gradients, glow effects, pill-shaped badges, editorial-minimal style
- The overall aesthetic is industrial/retro, not modern web design

## Success Criteria

- Authentic pager experience that evokes 1990s nostalgia
- Honest code book (~18-20 entries) with transparent confidence levels and etymology types
- Shareable links that work without a backend
- Resurrection moment that fits the Halloween theme
- Works as a static deployment on Vercel

## Non-Goals

- Not a messaging app (no backend, no real-time communication)
- Not a comprehensive code book (honest small set, not exhaustive)
- Not a modern web design exercise (intentionally retro)
- No user accounts or authentication
- No server-side code of any kind
