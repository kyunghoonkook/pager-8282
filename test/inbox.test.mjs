/**
 * inbox.test.mjs — Test inbox trim-to-50 using a fake localStorage.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

class FakeStorage {
  constructor() { this.data = {}; }
  getItem(key) { return this.data[key] ?? null; }
  setItem(key, val) { this.data[key] = val; }
  removeItem(key) { delete this.data[key]; }
  clear() { this.data = {}; }
}

test('inbox trims to 50 entries', async () => {
  const store = new FakeStorage();
  const originalLocalStorage = globalThis.localStorage;

  Object.defineProperty(globalThis, 'localStorage', {
    value: store,
    writable: true,
    configurable: true,
  });

  const { addPage, getInbox, clearInbox } = await import('../src/inbox.js');

  for (let i = 0; i < 55; i++) {
    addPage({ p: String(i), cb: null, t: '1700000000' });
  }

  const inbox = getInbox();
  assert.strictEqual(inbox.length, 50, 'inbox should be trimmed to 50');
  assert.strictEqual(inbox[0].p, '54', 'newest first');
  assert.strictEqual(inbox[49].p, '5', 'oldest kept');

  clearInbox();
  assert.strictEqual(getInbox().length, 0);

  Object.defineProperty(globalThis, 'localStorage', {
    value: originalLocalStorage,
    writable: true,
    configurable: true,
  });
});
