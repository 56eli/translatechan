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
  getBoundingClientRect() { return { top: 0, left: 0, right: 900, bottom: 0, width: 900, height: 0 }; }
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
globalThis.location = { hash: '', href: 'http://localhost/index.html', protocol: 'http:', host: 'localhost' };
globalThis.addEventListener = () => {};
globalThis.scrollTo = () => {};
globalThis.print = () => {};

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
if (!Array.isArray(window.TRANSLATECHAN_DATA.corpus_manifest?.items) || window.TRANSLATECHAN_DATA.corpus_manifest.items.length !== 36) {
  throw new Error('app_data.js is missing the shared 36-item corpus manifest');
}
if (window.TRANSLATECHAN_DATA.project_metrics?.manifest_integrity?.corpus_files !== 36 ||
    Object.keys(window.TRANSLATECHAN_DATA.canonical_locators?.documents || {}).length !== 36) {
  throw new Error('app_data.js is missing validated metrics or canonical locator coverage');
}
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

// 3. Exercise global search with several queries (search is debounced ~200ms — await it)
const searchEl = ids['global-search'];
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const fireSearch = async (q) => {
  (searchEl._handlers['input'] || []).forEach(fn => fn({ target: { value: q } }));
  await sleep(260); // allow the application's debounced timer to run
};
for (const q of ['dog', '無', 'buddha', '平常心', 'xyz-not-found']) {
  try { await fireSearch(q); }
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
  ['見面便見', 'biyanlu (pointer schema)'],
  ['Buddha-nature', 'translations text search']
];
for (const [q, label] of schemaQueries) {
  try {
    await fireSearch(q);
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
// 4e. Sparse case collections navigate through actual adjacent records, not
// arithmetic case numbers; selecting a corpus also persists the reading context.
corpusClicks['biyanlu_cases'] && corpusClicks['biyanlu_cases']();
const biyanHtml = ids['reader-content-target']._innerHTML;
if (!biyanHtml.includes('scrollToCase(12)">第12則 ›') || !biyanHtml.includes('scrollToCase(3)">‹ 第3則')) {
  failures++; console.log('❌ Biyanlu sparse prev/next navigation is incorrect');
}
if (store['translatechan_corpus_key'] !== 'biyanlu_cases') { failures++; console.log('❌ corpus selection was not persisted'); }
const mobileCorpusSelect = ids['corpus-mobile-select'];
mobileCorpusSelect.value = 'congronglu_cases';
(mobileCorpusSelect._handlers.change || []).forEach(fn => fn({ target: mobileCorpusSelect }));
if (store['translatechan_corpus_key'] !== 'congronglu_cases') { failures++; console.log('❌ mobile corpus selection was not persisted'); }
corpusClicks['congronglu_cases'] && corpusClicks['congronglu_cases']();
const congrongHtml = ids['reader-content-target']._innerHTML;
if (!congrongHtml.includes('scrollToCase(9)">第9則 ›') || !congrongHtml.includes('scrollToCase(1)">‹ 第1則')) {
  failures++; console.log('❌ Congronglu sparse prev/next navigation is incorrect');
}
// 4f. Preference writes must be non-fatal when browser storage is unavailable.
const originalStorageSet = localStorage.setItem;
localStorage.setItem = () => { throw new Error('storage blocked'); };
try {
  modeHandlers[0]._click && modeHandlers[0]._click();
  (ids['theme-toggle']._handlers.click || []).forEach(fn => fn());
} catch (e) {
  failures++; console.log(`❌ blocked-storage preference update crashed: ${e.message}`);
} finally {
  localStorage.setItem = originalStorageSet;
}
// 4g. Wumenguan lazy rendering: 48 chips in the strip, 12 case cards initially,
// then loadMoreCases() reveals the rest (Phase D2)
corpusClicks['wumenguan'] && corpusClicks['wumenguan']();
const wmStripChips = (ids['reader-content-target']._innerHTML.match(/data-jump-case=/g) || []).length;
if (wmStripChips !== 48) { failures++; console.log(`❌ case strip has ${wmStripChips} chips (expected 48)`); }
let wmCaseCount = (ids['reader-content-target']._innerHTML.match(/id="case-\d+"/g) || []).length;
if (wmCaseCount !== 12) { failures++; console.log(`❌ initial lazy render shows ${wmCaseCount} cases (expected 12)`); }
if (!ids['reader-content-target']._innerHTML.includes('case-load-more-btn')) { failures++; console.log('❌ load-more button missing'); }
try { window.TranslateChan.loadMoreCases(); window.TranslateChan.loadMoreCases(); window.TranslateChan.loadMoreCases(); }
catch (e) { failures++; console.log(`❌ loadMoreCases crashed: ${e.message}`); }
wmCaseCount = (ids['reader-content-target']._innerHTML.match(/id="case-\d+"/g) || []).length;
if (wmCaseCount !== 48) { failures++; console.log(`❌ after load-more: ${wmCaseCount} cases (expected 48)`); }
if (ids['reader-content-target']._innerHTML.includes('case-load-more-btn')) { failures++; console.log('❌ load-more button still present after all cases loaded'); }
// 4h. Case index strip + collapsible case cards + per-case nav footer (Calm Reader)
const wmHtml = ids['reader-content-target']._innerHTML;
if (!wmHtml.includes('case-jump-strip')) { failures++; console.log('❌ case index strip missing'); }
if (!wmHtml.includes('case-toggle')) { failures++; console.log('❌ case collapse toggle missing'); }
if (!wmHtml.includes('case-nav-footer')) { failures++; console.log('❌ case prev/next nav missing'); }
// 4i. Tooltip DOM is de-duplicated: no embedded .term-tooltip nodes remain in reader output
if (wmHtml.includes('term-tooltip')) { failures++; console.log('❌ embedded tooltip markup still emitted (de-dup regression)'); }
// 4j. Mobile corpus picker is populated (mirrors the sidebar)
const mobileSelectHtml = ids['corpus-mobile-select']._innerHTML;
if (!mobileSelectHtml.includes('wumenguan')) { failures++; console.log('❌ mobile corpus picker not populated'); }
// 4k. Lineage graph: pan/zoom group + reset controller present
const svgHtml = ids['lineage-svg-graph']._innerHTML;
if (!svgHtml.includes('lineage-panzoom')) { failures++; console.log('❌ lineage pan/zoom group missing'); }
if (typeof window.TranslateChan.resetLineageView !== 'function') { failures++; console.log('❌ lineage reset view missing'); }
// 4l. Hash routing: initial deep-link state + viewHash helper
if (typeof window.TranslateChan.openDoc !== 'function') { failures++; console.log('❌ openDoc missing (hash routing depends on it)'); }
// 4m. Studio passage picker covers all 48 Wumenguan cases (C5)
const studioSelect = ids['studio-select-text'];
const studioOptionCount = (studioSelect._innerHTML.match(/<option/g) || []).length;
if (studioOptionCount < 48) { failures++; console.log(`❌ studio picker has only ${studioOptionCount} passages (expected >= 48)`); }
// 4n. Gong'an filter chips + draft delete helper (C5)
if (typeof window.TranslateChan.deleteDraft !== 'function') { failures++; console.log('❌ deleteDraft missing'); }
const gonganHtml = ids['gongan-content-target']._innerHTML;
if (!gonganHtml.includes('gongan-filter-chip')) { failures++; console.log('❌ gongan filter chips missing'); }
// 4o. Matrix provenance is explicit for every translator, with citations for verified rows.
const matrixEntries = window.TRANSLATECHAN_DATA.translations_matrix.flatMap(row => row.translators || []);
const malformedMatrixEntries = matrixEntries.filter(t => !t.status ||
  (t.status === 'verified_quotation' && (!t.source || !t.source.work || !t.source.edition || !t.source.verification)));
if (malformedMatrixEntries.length) { failures++; console.log(`❌ matrix provenance incomplete for ${malformedMatrixEntries.length} entry/entries`); }
const matrixHtml = ids['matrix-content-target']._innerHTML;
const matrixStatusCount = (matrixHtml.match(/class="translation-status/g) || []).length;
if (matrixStatusCount !== matrixEntries.length) { failures++; console.log(`❌ matrix has ${matrixStatusCount} provenance badges (expected ${matrixEntries.length})`); }
const matrixSourceCount = (matrixHtml.match(/class="translation-source/g) || []).length;
if (matrixSourceCount !== 2) { failures++; console.log(`❌ matrix has ${matrixSourceCount} verified source lines (expected 2)`); }
// 4p. Object-form verified translations must render as text in the Studio, and
// the selector must adapt when a passage only has the Senzaki/Reps register.
studioSelect.value = 'wumen_8';
(studioSelect._handlers.change || []).forEach(fn => fn({ target: studioSelect }));
const studioRefHtml = ids['studio-ref-text']._innerHTML;
if (studioRefHtml.includes('[object Object]')) { failures++; console.log('❌ Studio rendered an object-form translation literally'); }
if (!studioRefHtml.includes('Senzaki &amp; Reps') && !studioRefHtml.includes('Senzaki & Reps')) { failures++; console.log('❌ Studio did not expose the available verified translator'); }
if (!studioRefHtml.includes('Verified quotation') || !studioRefHtml.includes('translation-source')) { failures++; console.log('❌ Studio lost verified provenance/source metadata'); }
// 4q. Saved user drafts are escaped before entering innerHTML (self-XSS guard).
studioSelect.value = 'wumen_1';
(studioSelect._handlers.change || []).forEach(fn => fn({ target: studioSelect }));
ids['studio-user-translation'].value = '<img src=x onerror="alert(1)">';
ids['studio-user-notes'].value = '<b>unsafe note</b>';
(ids['studio-save-btn']._handlers.click || []).forEach(fn => fn());
const savedDraftHtml = ids['studio-saved-list']._innerHTML;
if (savedDraftHtml.includes('<img') || savedDraftHtml.includes('<b>unsafe')) { failures++; console.log('❌ saved draft markup was not escaped'); }
if (!savedDraftHtml.includes('&lt;img')) { failures++; console.log('❌ saved draft escape regression'); }
// 4r. Variant-normalized search: 鉢/曰 must hit the corpus's 缽/云 spellings (e.g. 洗缽盂去, 師云)
for (const q of ['鉢', '曰']) {
  await fireSearch(q);
  const html = ids['reader-content-target']._innerHTML;
  if (html.includes('No matches found')) { failures++; console.log(`❌ variant search missed results for "${q}"`); }
}
// 4s. Broad searches report the true hit count while clearly describing a
// presentation limit, rather than claiming a truncated count is the total.
await fireSearch('the');
const broadSearchHtml = ids['reader-content-target']._innerHTML;
const broadCount = broadSearchHtml.match(/(\d+) matching unit\(s\) across/);
if (!broadCount || Number(broadCount[1]) <= 200 || !/Showing \d+ of \d+ matching units/.test(broadSearchHtml)) {
  failures++; console.log('❌ broad-search count/cap accounting is not truthful');
}
// 4t. Search query must be HTML-escaped in both the header and no-results body (self-XSS guard)
await fireSearch('<img src=x onerror="alert(1)">');
const searchHtml = ids['reader-content-target']._innerHTML;
if (searchHtml.includes('<img') || searchHtml.includes('onerror="alert(1)"')) { failures++; console.log('❌ search query markup was not escaped'); }
if (!searchHtml.includes('&lt;img')) { failures++; console.log('❌ escaped search query missing'); }
if (searchHtml.includes('<mark><img')) { failures++; console.log('❌ search mark injection'); }
// clear search
await fireSearch('');

// 5. Content sanity: reset reader to wumenguan, then assert key content present
corpusClicks['wumenguan'] && corpusClicks['wumenguan']();
const readerHtml = ids['reader-content-target']._innerHTML;
for (const [must, label] of [['Zhàozhōu héshang', 'case 1 pinyin line'], ['Mu', 'mu translations'], ['Red Pine', 'translator tag'], ['評唱', 'commentary block']]) {
  if (!readerHtml.includes(must)) { failures++; console.log(`❌ reader missing ${label}`); }
}

console.log(failures === 0 ? '\n✅ SMOKE TEST PASSED' : `\n🔴 SMOKE TEST: ${failures} failures`);
process.exit(failures === 0 ? 0 : 1);
