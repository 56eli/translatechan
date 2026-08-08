// Minimal DOM stub smoke test for TranslateChan app.js
// TranslateChan smoke test — exercises renderReader for every corpus text, all modes, search, namespace.
// Run: node scripts/smoke_test.mjs   (no dependencies)
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const store = {};
globalThis.localStorage = {
  getItem: k => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: k => { delete store[k]; }
};

class StubElement {
  constructor(id = '') {
    this.id = id;
    this._innerHTML = '';
    this._handlers = {};
    this.clientWidth = 900;
    this.value = '';
    const self = this;
    this.style = new Proxy({}, { get: (t, p) => (p === 'setProperty' ? () => {} : self['_' + String(p)]), set: () => true });
    this.classList = { add() {}, remove() {}, contains() { return false; } };
  }
  set innerHTML(v) { this._innerHTML = String(v); }
  get innerHTML() { return this._innerHTML; }
  set textContent(v) { this._text = String(v); }
  get textContent() { return this._text || ''; }
  addEventListener(ev, fn) { (this._handlers[ev] ||= []).push(fn); }
  setAttribute() {}
  getAttribute() { return null; }
  scrollIntoView() {}
  click() {}
  querySelectorAll(sel) {
    // Parse corpus buttons out of assigned HTML so we can simulate clicks
    if (sel === '.corpus-btn' && this._innerHTML.includes('data-corpus-key')) {
      const keys = [...this._innerHTML.matchAll(/data-corpus-key="([^"]+)"/g)].map(m => m[1]);
      const clicks = [...this._innerHTML.matchAll(/class="corpus-btn/g)].length;
      return keys.slice(0, clicks).map(k => ({
        getAttribute: () => k,
        addEventListener: (ev, fn) => { corpusClicks[k] = fn; }
      }));
    }
    return [];
  }
}

const corpusClicks = {};
const modeHandlers = [];
const ids = {};
globalThis.window = globalThis;

globalThis.document = {
  readyState: 'complete',
  documentElement: { setAttribute() {}, style: { setProperty() {} } },
  getElementById(id) { return (ids[id] ||= new StubElement(id)); },
  createElement(tag) { return new StubElement(tag); },
  querySelectorAll(sel) {
    if (sel === '[data-reader-mode]') {
      if (modeHandlers.length === 0) {
        for (const mode of ['bilingual', 'stacked', 'chinese_only', 'multi_translators']) {
          modeHandlers.push({
            getAttribute: () => mode,
            classList: { add() {}, remove() {} },
            addEventListener: (ev, fn) => { modeHandlers.find(h => h.getAttribute() === mode)._click = fn; }
          });
        }
      }
      return modeHandlers;
    }
    if (sel === '.nav-tab-btn' || sel === '.view-section') return [];
    return [];
  },
  addEventListener() {}
};

// Load data bundle + app
eval(readFileSync(join(ROOT, 'app_data.js'), 'utf8'));
if (!window.TRANSLATECHAN_DATA) throw new Error('app_data.js did not populate TRANSLATECHAN_DATA');
console.log('DATA loaded. corpus keys:', Object.keys(window.TRANSLATECHAN_DATA.corpus).length);

eval(readFileSync(join(ROOT, 'app.js'), 'utf8'));
console.log('APP executed + init() completed without crash');

// 1. Exercise renderReader for every corpus key via corpus button clicks
let failures = 0;
for (const [key, fn] of Object.entries(corpusClicks)) {
  try { fn(); }
  catch (e) { failures++; console.log(`  ❌ renderReader CRASH for ${key}: ${e.message}`); }
}
console.log(`RENDERER: ${Object.keys(corpusClicks).length} corpus texts exercised, ${failures} crashes`);

// 2. Exercise each reader mode
for (const h of modeHandlers) {
  try { h._click && h._click(); } catch (e) { failures++; console.log(`  ❌ reader mode ${h.getAttribute()} crash: ${e.message}`); }
}

// 3. Exercise global search with several queries
const searchEl = ids['global-search'];
for (const q of ['dog', '無', 'buddha', '平常心', 'xyz-not-found']) {
  try { (searchEl._handlers['input'] || []).forEach(fn => fn({ target: { value: q } })); }
  catch (e) { failures++; console.log(`  ❌ search crash for "${q}": ${e.message}`); }
}

// 4. Verify namespace merge
if (typeof window.TranslateChan.openCase !== 'function') { failures++; console.log('❌ openCase missing'); }
if (typeof window.TranslateChan.openMasterDossier !== 'function') { failures++; console.log('❌ openMasterDossier OVERWRITTEN'); }

// 5. Content sanity: reset reader to wumenguan, then assert key content present
corpusClicks['wumenguan'] && corpusClicks['wumenguan']();
const readerHtml = ids['reader-content-target']._innerHTML;
for (const [must, label] of [['Zhàozhōu héshang', 'case 1 pinyin line'], ['Mu', 'mu translations'], ['Red Pine', 'translator tag'], ['評唱', 'commentary block']]) {
  if (!readerHtml.includes(must)) { failures++; console.log(`❌ reader missing ${label}`); }
}

console.log(failures === 0 ? '\n✅ SMOKE TEST PASSED' : `\n🔴 SMOKE TEST: ${failures} failures`);
process.exit(failures === 0 ? 0 : 1);
