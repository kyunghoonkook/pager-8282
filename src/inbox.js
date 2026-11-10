/**
 * inbox.js — localStorage inbox: addPage(), getInbox(), clearInbox().
 * Key: pager8282_inbox. JSON array. Max 50 entries, trim oldest.
 */
const STORAGE_KEY = 'pager8282_inbox';
const MAX_PAGES = 50;

export function addPage(page) {
  try {
    const inbox = getInbox();
    inbox.unshift({
      p: page.p,
      cb: page.cb,
      t: page.t,
      received: Date.now(),
    });
    if (inbox.length > MAX_PAGES) inbox.length = MAX_PAGES;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inbox));
  } catch (e) {
    // localStorage unavailable — silent no-op
  }
}

export function getInbox() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function clearInbox() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // Silent
  }
}
