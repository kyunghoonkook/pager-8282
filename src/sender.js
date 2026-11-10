/**
 * sender.js — Sender UI: keyword search, code suggestion, raw digits, share link.
 */
import { search, CODEBOOK } from './codebook.js';
import { encode } from './hash.js';

export function initSender(container) {
  container.innerHTML = `
    <div class="sender">
      <h1>8282 — 삐삐 코드 보내기</h1>
      <div class="search-section">
        <input type="text" id="search-input" placeholder="검색 / Search..."
               autocomplete="off" spellcheck="false">
        <div id="results"></div>
      </div>
      <div class="compose-section">
        <label>숫자 코드 / Code (max 20)
          <input type="text" id="digits-input" maxlength="20"
                 inputmode="numeric" placeholder="8282" autocomplete="off">
        </label>
        <label>콜백 번호 / Callback (optional, max 15)
          <input type="text" id="callback-input" maxlength="15"
                 inputmode="numeric" placeholder="01012345678" autocomplete="off">
        </label>
        <button id="generate-btn" disabled>링크 생성 / Generate Link</button>
      </div>
      <div id="link-output" class="link-output" hidden>
        <input type="text" id="share-link" readonly>
        <button id="copy-btn">복사 / Copy</button>
        <div class="copy-hint" id="copy-hint"></div>
      </div>
    </div>
  `;

  const searchInput = container.querySelector('#search-input');
  const resultsDiv  = container.querySelector('#results');
  const digitsInput = container.querySelector('#digits-input');
  const cbInput     = container.querySelector('#callback-input');
  const genBtn      = container.querySelector('#generate-btn');
  const linkOutput  = container.querySelector('#link-output');
  const shareLink   = container.querySelector('#share-link');
  const copyBtn     = container.querySelector('#copy-btn');
  const copyHint    = container.querySelector('#copy-hint');

  // --- Render search results ---
  function renderResults(entries) {
    if (entries.length === 0) {
      resultsDiv.innerHTML =
        '<div class="no-results">검색 결과 없음 / No exact code found — type raw digits below.</div>';
      return;
    }
    resultsDiv.innerHTML = entries.map((e) => `
      <div class="result-item" data-code="${e.code}">
        <span class="result-code">${e.code}</span>
        <span class="result-meaning">${e.meaning_ko} / ${e.meaning_en}</span>
      </div>
    `).join('');

    resultsDiv.querySelectorAll('.result-item').forEach((item) => {
      item.addEventListener('click', () => {
        digitsInput.value = item.dataset.code;
        updateGenerate();
      });
    });
  }

  // --- Search handler ---
  searchInput.addEventListener('input', () => {
    renderResults(search(searchInput.value));
  });

  // --- Numeric-only filtering ---
  digitsInput.addEventListener('input', () => {
    digitsInput.value = digitsInput.value.replace(/[^0-9]/g, '').slice(0, 20);
    updateGenerate();
  });

  cbInput.addEventListener('input', () => {
    cbInput.value = cbInput.value.replace(/[^0-9]/g, '').slice(0, 15);
  });

  // --- Generate button state ---
  function updateGenerate() {
    genBtn.disabled = digitsInput.value.length === 0;
  }

  // --- Generate share link ---
  genBtn.addEventListener('click', () => {
    const p  = digitsInput.value;
    const cb = cbInput.value || null;
    const hash = encode({ p, cb });
    const base = window.location.origin + window.location.pathname;
    shareLink.value = base + hash;
    linkOutput.hidden = false;
  });

  // --- Copy button ---
  copyBtn.addEventListener('click', () => {
    const done = () => { copyHint.textContent = '복사됨 / Copied!'; copyHint.classList.add('visible'); };
    const fail = () => {
      shareLink.select();
      copyHint.textContent = 'Ctrl+C로 복사하세요 / Press Ctrl+C to copy';
      copyHint.classList.add('visible');
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareLink.value).then(done).catch(fail);
    } else {
      fail();
    }
    setTimeout(() => copyHint.classList.remove('visible'), 3000);
  });

  // --- Initial: show all entries ---
  renderResults(CODEBOOK);
}
