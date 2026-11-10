/**
 * hash.test.mjs — Property-based tests for hash encode/decode round-trip.
 * Uses fast-check under node:test.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fc from 'fast-check';

import { encode, decode } from '../src/hash.js';
import { search, decode as decodeCode, CODEBOOK } from '../src/codebook.js';

// --- Helpers: fast-check arbitaries for digit strings ---

/** Generate a string of 1–maxLen random digits. */
const digitStr = (maxLen) =>
  fc.array(fc.integer({ min: 0, max: 9 }), { minLength: 1, maxLength: maxLen })
    .map((arr) => arr.join(''));

// ================================================================
// Test 1: Encode → Decode round-trip preserves data
// ================================================================
test('encode → decode round-trip preserves data', () => {
  fc.assert(
    fc.property(
      fc.record({
        p: digitStr(20),
        cb: fc.oneof(fc.constant(null), digitStr(15)),
        t: digitStr(10),
      }),
      (page) => {
        const hash = encode(page);
        const decoded = decode(hash);
        assert.ok(decoded !== null, 'decode should not return null for valid hash');
        assert.strictEqual(decoded.p, page.p);
        assert.strictEqual(decoded.cb, page.cb);
        assert.strictEqual(decoded.t, page.t);
      },
    ),
  );
});

// ================================================================
// Test 2: Decode returns null or valid p for arbitrary strings
// ================================================================
test('decode returns null or valid p for arbitrary strings', () => {
  fc.assert(
    fc.property(fc.string(), (s) => {
      const decoded = decode(s);
      if (decoded !== null) {
        assert.match(decoded.p, /^[0-9]{1,20}$/);
      }
    }),
  );
});

// ================================================================
// Test 3: Encode rejects invalid p
// ================================================================
test('encode throws on invalid p', () => {
  assert.throws(() => encode({ p: '' }));
  assert.throws(() => encode({ p: 'abc' }));
  assert.throws(() => encode({ p: '1'.repeat(21) })); // 21 digits
  assert.throws(() => encode({ p: '8282a' }));
});

// ================================================================
// Test 4: Decode edge cases
// ================================================================
test('decode handles edge cases', () => {
  // Empty / bare hash
  assert.strictEqual(decode(''), null);
  assert.strictEqual(decode('#'), null);

  // Well-formed without cb
  assert.deepStrictEqual(decode('#p=8282&t=1700000000'), {
    p: '8282',
    cb: null,
    t: '1700000000',
  });

  // Well-formed with cb
  assert.deepStrictEqual(decode('#p=1004&cb=01012345678&t=1700000000'), {
    p: '1004',
    cb: '01012345678',
    t: '1700000000',
  });

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

  // Without leading #
  assert.deepStrictEqual(decode('p=8282&t=100'), {
    p: '8282',
    cb: null,
    t: '100',
  });
});

// ================================================================
// Test 5: Code book search and decode
// ================================================================
test('codebook search works', () => {
  assert.ok(search('빨리').length > 0);
  assert.ok(search('천사').some((e) => e.code === '1004'));
  assert.ok(search('angel').some((e) => e.code === '1004'));
  assert.ok(search('hurry').some((e) => e.code === '8282'));
  assert.ok(search('ANGEL').some((e) => e.code === '1004')); // case-insensitive
  assert.strictEqual(search('').length, CODEBOOK.length); // empty → all
});

test('codebook decode works', () => {
  assert.strictEqual(decodeCode('8282').meaning_ko, '빨리빨리');
  assert.strictEqual(decodeCode('1004').meaning_en, 'Angel');
  assert.strictEqual(decodeCode('0000'), null);
});

test('codebook has 18 entries', () => {
  assert.strictEqual(CODEBOOK.length, 18);
});

test('codebook 0242 note acknowledges loose mapping', () => {
  const entry = decodeCode('0242');
  assert.ok(entry);
  assert.ok(entry.note_ko.includes('느슨') || entry.note_ko.includes('널리'));
  assert.ok(entry.note_en.includes('loose') || entry.note_en.includes('widely cited'));
});
