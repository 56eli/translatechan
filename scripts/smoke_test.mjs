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
    this.dataset = {};
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
        for (const mode of ['bilingual', 'chinese_only', 'multi_translators']) {
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
if (typeof window.TranslateChan.openDoc !== 'function') { failures++; console.log('❌ openDoc missing'); }

// 4b. Full-schema search: queries must hit sections/stanzas/chapters texts, not just cases
const schemaQueries = [
  ['絕學無為', 'zhengdao_ge (stanzas schema)'],
  ['至道無難', 'xinxin_ming (stanzas schema)'],
  ['菩提本無樹', 'platform_sutra (chapters schema)'],
  ['竺土大仙心', 'shitou_sandokai (embedded stanzas)'],
  ['赤肉團', 'linji_yulu (sections schema)'],
  ['Buddha-nature', 'translations text search']
];
for (const [q, label] of schemaQueries) {
  try {
    (searchEl._handlers['input'] || []).forEach(fn => fn({ target: { value: q } }));
    const html = ids['reader-content-target']._innerHTML;
    if (html.includes('No matches found')) { failures++; console.log(`❌ full-schema search missed ${label} for "${q}"`); }
  } catch (e) { failures++; console.log(`❌ full-schema search crash "${q}": ${e.message}`); }
}

// 4c. No nested/duplicated term highlights from the annotator
corpusClicks['wumenguan'] && corpusClicks['wumenguan']();
const annotatedHtml = ids['reader-content-target']._innerHTML;
if (annotatedHtml.includes('term-highlight"><span class="term-highlight') || annotatedHtml.split('term-highlight').length > 200) {
  failures++; console.log('❌ tooltip double-annotation regression');
}
// 4d. Mode attribute is set on the reader container
if (ids['reader-content-target'].dataset && ids['reader-content-target'].dataset.mode === undefined) {
  // stub stores dataset via plain property; app sets dataset.mode — check direct assignment happened
  if (!('mode' in (ids['reader-content-target'].dataset || {}))) failures++; console.log('❌ reader data-mode not set');
}
// 4g. Wumenguan renders all 48 cases (regression guard for the 48/48 completion)
corpusClicks['wumenguan'] && corpusClicks['wumenguan']();
const wmCaseCount = (ids['reader-content-target']._innerHTML.match(/id="case-/g) || []).length;
if (wmCaseCount < 48) { failures++; console.log(`❌ wumenguan renders only ${wmCaseCount} cases (expected 48)`); }
// 4e. Variant-normalized search: 鉢/曰 must hit the corpus's 缽/云 spellings (e.g. 洗缽盂去, 師云)
for (const q of ['鉢', '曰']) {
  (searchEl._handlers['input'] || []).forEach(fn => fn({ target: { value: q } }));
  const html = ids['reader-content-target']._innerHTML;
  if (html.includes('No matches found')) { failures++; console.log(`❌ variant search missed results for "${q}"`); }
}
// 4f. Search query must be HTML-escaped (self-XSS guard)
(searchEl._handlers['input'] || []).forEach(fn => fn({ target: { value: '<b>x' } }));
const searchHtml = ids['reader-content-target']._innerHTML;
if (searchHtml.includes('<b>x') && !searchHtml.includes('&lt;b&gt;x')) { failures++; console.log('❌ search query not escaped'); }
if (searchHtml.includes('<mark><b>')) { failures++; console.log('❌ search mark injection'); }
// clear search
(searchEl._handlers['input'] || []).forEach(fn => fn({ target: { value: '' } }));

// 5. Content sanity: reset reader to wumenguan, then assert key content present
corpusClicks['wumenguan'] && corpusClicks['wumenguan']();
const readerHtml = ids['reader-content-target']._innerHTML;
for (const [must, label] of [['Zhàozhōu héshang', 'case 1 pinyin line'], ['Mu', 'mu translations'], ['Red Pine', 'translator tag'], ['評唱', 'commentary block']]) {
  if (!readerHtml.includes(must)) { failures++; console.log(`❌ reader missing ${label}`); }
}

console.log(failures === 0 ? '\n✅ SMOKE TEST PASSED' : `\n🔴 SMOKE TEST: ${failures} failures`);
process.exit(failures === 0 ? 0 : 1);
