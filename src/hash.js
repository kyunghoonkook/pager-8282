/**
 * hash.js — URL hash encode(), decode(), hasValidHash().
 * Pure functions (no DOM). Testable in Node without a browser.
 *
 * Hash format: #p=<digits>&cb=<digits>&t=<unix seconds>
 *   p  — required, 1–20 digits
 *   cb — optional, 1–15 digits
 *   t  — optional, 1–10 digits (Unix timestamp in seconds)
 */

const RE_P  = /^[0-9]{1,20}$/;
const RE_CB = /^[0-9]{1,15}$/;
const RE_T  = /^[0-9]{1,10}$/;
const VALID_KEYS = new Set(['p', 'cb', 't']);

/**
 * Encode page data into a URL hash string.
 * @param {{ p: string, cb?: string | null, t?: string | number }} page
 * @returns {string} Hash string starting with '#'
 * @throws {Error} If p is missing/invalid or cb is present but invalid.
 */
export function encode(page) {
  const { p, cb, t } = page;

  // Validate p (required)
  if (!p || !RE_P.test(p)) {
    throw new Error(`Invalid p: must be 1–20 digits, got "${p}"`);
  }

  // Validate cb if provided
  let useCb = null;
  if (cb !== null && cb !== undefined && cb !== '') {
    if (!RE_CB.test(cb)) {
      throw new Error(`Invalid cb: must be 1–15 digits, got "${cb}"`);
    }
    useCb = cb;
  }

  // Determine timestamp
  const tValue = (t !== undefined && t !== null) ? String(t) : Math.floor(Date.now() / 1000).toString();

  let hash = `#p=${p}`;
  if (useCb) {
    hash += `&cb=${useCb}`;
  }
  hash += `&t=${tValue}`;
  return hash;
}

/**
 * Decode a URL hash string into page data.
 * @param {string} hash - Hash string (with or without leading '#').
 * @returns {{ p: string, cb: string | null, t: string | null } | null}
 *   Returns null for any invalid input.
 */
export function decode(hash) {
  if (!hash) return null;

  // Strip leading '#'
  let str = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!str) return null;

  const pairs = str.split('&');
  const result = { p: null, cb: null, t: null };
  const seen = new Set();

  for (const pair of pairs) {
    const eq = pair.indexOf('=');
    if (eq === -1) return null;

    const key = pair.slice(0, eq);
    const value = pair.slice(eq + 1);

    if (!VALID_KEYS.has(key)) return null;
    if (seen.has(key)) return null; // duplicate key
    seen.add(key);

    result[key] = value;
  }

  // p is required
  if (result.p === null || !RE_P.test(result.p)) return null;

  // cb if present must be valid
  if (result.cb !== null && !RE_CB.test(result.cb)) return null;

  // t if present must be valid
  if (result.t !== null && !RE_T.test(result.t)) return null;

  return result;
}

/**
 * Check whether the current browser URL has a valid page hash.
 * Browser-only — do not call in Node tests.
 * @returns {boolean}
 */
export function hasValidHash() {
  if (typeof window === 'undefined') return false;
  const hash = window.location.hash;
  if (!hash || hash === '#') return false;
  return decode(hash) !== null;
}
