/**
 * receiver.js — Receiver UI: pager display, resurrection, beep, scroll, decode, inbox.
 * Audio (WebAudio square-wave beep) handled inline — no separate module.
 */
import { decode as decodeCode } from './codebook.js';
import { addPage, getInbox, clearInbox } from './inbox.js';

const ETYMOLOGY_LABELS = {
  folk:      '민간어원 / Folk etymology',
  direct:    '직접 동음 / Direct homonym',
  reference: '문화 참조 / Cultural reference',
};

const CONFIDENCE_LABELS = {
  high:   '높음 / High',
  medium: '보통 / Medium',
  low:    '낮음 / Low',
};

export function initReceiver(container, pageData) {
  container.innerHTML = `
    <div class="pager" id="pager">
      <div class="lcd-frame">
        <div class="lcd" id="lcd">
          <div class="lcd-main" id="lcd-main"></div>
          <div class="lcd-callback" id="lcd-callback"></div>
          <div class="lcd-decode" id="lcd-decode"></div>
          <div class="lcd-battery-low">BATTERY LOW</div>
          <div class="dust" id="dust"></div>
          <div class="wake-prompt" id="wake-prompt">TAP TO WAKE</div>
          <div class="inbox-list" id="inbox-list"></div>
        </div>
      </div>
      <div class="pager-buttons">
        <button class="btn-rubber" id="decode-btn" disabled>DECODE</button>
        <button class="btn-rubber" id="inbox-btn">INBOX</button>
        <button class="btn-rubber" id="sendback-btn" disabled>SEND BACK</button>
      </div>
    </div>
  `;

  const pager        = container.querySelector('#pager');
  const lcd          = container.querySelector('#lcd');
  const lcdMain      = container.querySelector('#lcd-main');
  const lcdCallback  = container.querySelector('#lcd-callback');
  const lcdDecode    = container.querySelector('#lcd-decode');
  const dust         = container.querySelector('#dust');
  const wakePrompt   = container.querySelector('#wake-prompt');
  const decodeBtn    = container.querySelector('#decode-btn');
  const inboxBtn     = container.querySelector('#inbox-btn');
  const sendbackBtn  = container.querySelector('#sendback-btn');
  const inboxList    = container.querySelector('#inbox-list');

  let state = 'dead';
  let audioCtx = null;

  // --- Tap to wake ---
  pager.addEventListener('click', (e) => {
    if (e.target.closest('button')) return;
    if (state === 'dead') resurrect();
  });

  function resurrect() {
    state = 'alive';

    // Lazy-create AudioContext (must be after user gesture)
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      playBeep(audioCtx);
    } catch (err) {
      console.warn('AudioContext unavailable — skipping beep');
    }

    // Visual transition
    lcd.classList.add('alive');
    dust.classList.add('fade');
    wakePrompt.classList.add('hidden');

    // Show digits with scroll animation
    lcdMain.textContent = pageData.p;
    lcdMain.classList.add('scroll');

    // Show callback if present
    if (pageData.cb) {
      lcdCallback.textContent = 'CB: ' + pageData.cb;
    }

    // Enable buttons
    decodeBtn.disabled = false;
    sendbackBtn.disabled = false;

    // Store in inbox
    addPage(pageData);
  }

  function playBeep(ctx) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 800;

    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.01);
    gain.gain.setValueAtTime(0.15, now + 0.14);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  // --- DECODE button ---
  decodeBtn.addEventListener('click', () => {
    if (state === 'dead') return;

    const entry = decodeCode(pageData.p);
    if (entry) {
      lcdDecode.innerHTML = `
        <div class="meaning">${entry.meaning_ko} / ${entry.meaning_en}</div>
        <div class="etymology">${ETYMOLOGY_LABELS[entry.etymology_type]} · ${CONFIDENCE_LABELS[entry.confidence]}</div>
        <div class="note">${entry.note_ko}</div>
        <div class="note">${entry.note_en}</div>
      `;
    } else {
      lcdDecode.innerHTML = '<div class="meaning">알 수 없는 코드 / Unknown code</div>';
    }
    lcdDecode.classList.add('visible');
    state = 'decoded';
  });

  // --- INBOX button ---
  let inboxVisible = false;

  inboxBtn.addEventListener('click', () => {
    inboxVisible = !inboxVisible;
    if (inboxVisible) renderInbox();
    else inboxList.classList.remove('visible');
  });

  function renderInbox() {
    const inbox = getInbox();
    if (inbox.length === 0) {
      inboxList.innerHTML = '<div class="inbox-empty">받은 페이지 없음 / No pages</div>';
    } else {
      inboxList.innerHTML = inbox.map((pg, i) => `
        <div class="inbox-entry" data-index="${i}">
          <div class="entry-digits">${pg.p}</div>
          <div class="entry-meta">${pg.cb ? 'CB: ' + pg.cb + ' · ' : ''}${new Date(pg.received).toLocaleString()}</div>
        </div>
      `).join('') + '<button class="btn-rubber inbox-clear" id="clear-inbox">CLEAR</button>';
    }
    inboxList.classList.add('visible');

    inboxList.querySelectorAll('.inbox-entry').forEach((el) => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.dataset.index, 10);
        const pg = inbox[idx];
        lcdMain.textContent = pg.p;
        lcdMain.classList.remove('scroll');
        lcdCallback.textContent = pg.cb ? 'CB: ' + pg.cb : '';
        lcdDecode.classList.remove('visible');
        inboxVisible = false;
        inboxList.classList.remove('visible');
      });
    });

    const clearBtn = inboxList.querySelector('#clear-inbox');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (clearBtn.dataset.confirm) {
          clearInbox();
          renderInbox();
        } else {
          clearBtn.dataset.confirm = '1';
          clearBtn.textContent = '정말? / Sure?';
        }
      });
    }
  }

  // --- SEND BACK button ---
  sendbackBtn.addEventListener('click', () => {
    if (pageData.cb) {
      sessionStorage.setItem('pager8282_prefill_cb', pageData.cb);
    }
    window.location.hash = '';
    window.location.reload();
  });
}
