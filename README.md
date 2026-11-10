# 8282

In Korea in the 1990s, pagers (삐삐) could only show numbers, so people wrote in numbers. 8282 meant 빨리빨리, hurry. 486 meant 사랑해, I love you. 1004 meant 천사, angel. Almost nobody under 30 can read these now.

8282 is a small web pager that brings the code back.

- **Send**: search a meaning in Korean or English, pick a code from the code book (or type raw digits), add a callback number, get a link.
- **Receive**: the link opens a dead pager pulled out of a drawer. Tap it and it wakes up, beeps (WebAudio square wave, only after the tap) and scrolls the digits. DECODE shows the meaning and where the reading comes from.
- **Inbox**: received pages stay in localStorage, up to 50. SEND BACK opens the composer with the sender's callback number.

The whole page lives in the URL hash (`#p=<digits>&cb=<digits>&t=<unix seconds>`), strictly validated. There is no server and no account.

Live: https://pager-8282.vercel.app
Try a page: https://pager-8282.vercel.app/#p=486&cb=0212345678&t=1794316625

## The code book is honest

18 entries. Each one says whether the reading is folk etymology, a direct reading or a reference (like 112 for police), with a confidence level. Codes whose use as a pager code could not be verified are marked low confidence instead of being presented as fact.

## Run it

Static files, no build step.

```
npx serve .        # or any static server
npm install && npm test
```

Tests use `node:test` and `fast-check`: a round-trip property (decoding an encoded page gives the same page for random valid pages), rejection of malformed hashes, code book lookups, and inbox trimming at 50.

## How Kiro was used

Everything was done with **Kiro CLI** (3.1.0, free plan) in non-interactive chat sessions. The `.kiro` directory is the record.

1. **Steering first.** Kiro wrote `.kiro/steering/product.md`, `tech.md` and `structure.md` from one product brief. The design rules (no decorative gradients, no glow, no pill shapes, a physical 1990s pager) live in steering, so later runs kept to them without being reminded.
2. **Spec-driven.** Kiro wrote `.kiro/specs/pager-8282/requirements.md` (10 user stories, EARS acceptance criteria), `design.md` (code book data model, hash format and validation rules, error table, test plan with fast-check properties) and `tasks.md` (8 tasks). It then implemented the tasks in order and ticked them off.
3. **Hooks and a custom agent.** Kiro created `.kiro/hooks/run-tests-on-write.json` (PostToolUse: `npm test`) and `git-status-on-start.json` (SessionStart), and `.kiro/agents/pager-builder.json`, which loads the steering and spec as resources.
4. **Property-based testing.** The round-trip property for the URL hash came from the design doc's testing strategy.

### What went wrong, and what was done by hand

- The first run was started with only file read/write trusted, and Kiro's web search was denied, so it built the code book from its own knowledge and marked uncertain codes as such.
- The custom agent Kiro first wrote had no tools list. Two runs used that agent, and in both Kiro printed complete files in its chat output instead of writing them. Those files (`src/inbox.js`, `src/sender.js`, `src/receiver.js`, the test script fix, `test/inbox.test.mjs`, the CSS addition and the ticked `tasks.md`) were copied from Kiro's output into the repo unchanged. The commit messages say so.
- Done by hand, not by Kiro: `LICENSE`, `vercel.json`, `.gitignore`, this README, the Vercel deploy and the demo video.
- Everything else, including `index.html`, `styles.css`, `src/main.js`, `src/codebook.js`, `src/hash.js` and `test/hash.test.mjs`, was written to disk by Kiro.

The free plan has 50 credits a month; this build used about 27.

## License

MIT
