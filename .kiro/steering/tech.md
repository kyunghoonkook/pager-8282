# Technology: 8282

## Stack

- **HTML**: Plain HTML5, single `index.html` entry point
- **CSS**: Plain CSS, one file (`styles.css`). No preprocessor, no CSS-in-JS.
- **JavaScript**: Vanilla JS ES modules (ESM). No TypeScript, no transpilation.
- **No build step**: Files served as-is. No bundler, no minifier.

## Browser APIs

- **Web Audio API**: Square wave oscillator for pager beep. Must be triggered by a user gesture per browser autoplay policy. Create `AudioContext` lazily on first tap, never on page load.
- **localStorage**: Inbox storage (max 50 entries). Key: `pager8282_inbox`. JSON-serialized array. Trim oldest when exceeding 50.
- **URL Hash API**: Share link encoding. Format: `#p=<digits>&cb=<digits>&t=<unix seconds>`. Hash is client-side only — never sent to the server.
- **Clipboard API**: Copy share link. Provide a textarea-and-select fallback if `navigator.clipboard` is unavailable.

## Deployment

- **Platform**: Vercel static file hosting
- **Configuration**: No `vercel.json` needed — hash-based routing is entirely client-side. Vercel serves the static files as-is.
- **No server-side code**: Pure static files. Deploy by pushing to the repo or uploading the directory.

## Testing

- **Runner**: `node --test` (built-in Node.js test runner, available since Node 18)
- **Property testing**: `fast-check` for hash encode/decode round-trip verification
- **Test file**: `test/hash.test.mjs` (ES module with `.mjs` extension for ESM compatibility)
- **Run**: `npm test` → `node --test test/`

### package.json (test dependencies only)

```json
{
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test test/"
  },
  "devDependencies": {
    "fast-check": "^3.19.0"
  }
}
```

`fast-check` is a devDependency only — not shipped to the browser. The app itself has zero runtime dependencies.

## Browser Compatibility

- Modern browsers supporting ES modules, WebAudio, localStorage
- No IE11, no legacy browser support
- Mobile: responsive design with touch interaction (tap to resurrect)

## Performance

- No external runtime dependencies
- Minimal DOM manipulation; prefer CSS animations for scroll and resurrection
- Lazy-create AudioContext on first user gesture (not on page load)
- No external fonts — use system monospace stack

## Dependencies

| Dependency | Type | Purpose |
|---|---|---|
| fast-check | devDependency | Property-based testing for hash round-trip |
| (none at runtime) | — | Zero runtime dependencies |
