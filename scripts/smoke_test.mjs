// Minimal DOM stub smoke test for TranslateChan app.js
// TranslateChan smoke test — exercises renderReader for every corpus text, all modes, search, namespace.
// Run: node scripts/smoke_test.mjs   (no dependencies)
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// Public Pages scope deliberately excludes browser drafting, agent branding, and
// a header GitHub link; keep that composition from regressing during app work.
const publicHtml = readFileSync(join(ROOT, 'index.html'), 'utf8');
for (const forbidden of ['data-view="studio"', 'data-view="agents"', 'id="view-studio"', 'id="view-agents"', 'https://github.com/56eli/translatechan']) {
  if (publicHtml.includes(forbidden)) throw new Error(`public Pages scope regression: ${forbidden}`);
}

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
    this._attrs = {};
    const self = this;
    this.style = new Proxy({}, { get: (t, p) => (p === 'setProperty' ? () => {} : self['_' + String(p)]), set: () => true });
    this.classList = { add() {}, remove() {}, contains() { return false; } };
  }
  set innerHTML(v) { this._innerHTML = String(v); }
  get innerHTML() { return this._innerHTML; }
  set textContent(v) { this._text = String(v); }
  get textContent() { return this._text || ''; }
  addEventListener(ev, fn) { (this._handlers[ev] ||= []).push(fn); }
  setAttribute(name, value) { this._attrs[name] = String(value); }
  getAttribute(name) { return this._attrs[name] || null; }
  scrollIntoView() {}
  click() {}
  getBoundingClientRect() { return { top: 0, left: 0, right: 900, bottom: 0, width: 900, height: 0 }; }
  querySelector(sel) { return null; }
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
const createdElements = [];
const documentHandlers = {};
let tabStubs = null;
globalThis.window = globalThis;
globalThis.location = { hash: '', href: 'http://localhost/index.html', protocol: 'http:', host: 'localhost' };
globalThis.addEventListener = () => {};
globalThis.scrollTo = () => {};
globalThis.print = () => {};

const makeTabStub = (view) => {
  const el = {
    _attrs: { 'data-view': view },
    _handlers: {},
    _clicked: false,
    classList: { add() {}, remove() {}, contains() { return false; } },
    setAttribute(n, val) { el._attrs[n] = String(val); },
    getAttribute(n) { return el._attrs[n] || null; },
    addEventListener(ev, fn) { el._handlers[ev] = fn; },
    click() { el._clicked = true; if (el._handlers.click) el._handlers.click(); },
    focus() {}
  };
  return el;
};

globalThis.document = {
  readyState: 'complete',
  activeElement: null,
  documentElement: { setAttribute() {}, style: { setProperty() {} } },
  body: { appendChild() {} },
  getElementById(id) { return (ids[id] ||= new StubElement(id)); },
  createElement(tag) { const el = new StubElement(tag); createdElements.push(el); return el; },
  querySelector(sel) {
    if (sel === '.nav-tabs') {
      return { addEventListener(ev, fn) { (documentHandlers['navtabs_' + ev] ||= []).push(fn); } };
    }
    return null;
  },
  querySelectorAll(sel) {
    if (sel === '.nav-tab-btn') {
      if (!tabStubs) tabStubs = ['reader', 'matrix', 'lineage', 'gongan', 'lexicon'].map(makeTabStub);
      return tabStubs;
    }
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
  addEventListener(ev, fn) { (documentHandlers[ev] ||= []).push(fn); }
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
// F4: per-text coverage metrics (zh counts, unit counts, N/M coverage strings)
// must exist for every corpus key and agree with the README's headline claims.
const perText = window.TRANSLATECHAN_DATA.project_metrics?.corpus?.per_text || {};
if (Object.keys(perText).length !== 36) {
  throw new Error('app_data.js is missing per-text coverage metrics');
}
for (const [key, expect] of [['wumenguan', '48/48 cases'], ['biyanlu_cases', '14/100 cases'], ['congronglu_cases', '2/100 cases'], ['platform_sutra', '4/10 chapters']]) {
  if (perText[key]?.coverage !== expect) throw new Error(`per_text coverage for ${key} should be '${expect}', got '${perText[key]?.coverage}'`);
}
if (perText.wumenguan?.declared_zh_chars !== perText.wumenguan?.content_zh_chars) {
  throw new Error('per_text wumenguan declared zh_chars is not metrics-consistent');
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

// 1b. The Linji locator pilot must expose its reviewed unit anchor, not only T1985.
try {
  corpusClicks.linji_yulu();
  const linjiHtml = ids['reader-content-target']._innerHTML;
  const linjiAnchor = window.TRANSLATECHAN_DATA.canonical_locators.documents.linji_yulu.unit_locators['sections.four_shouts'];
  if (!linjiHtml.includes('Section source: T47n1985_p0504a26–p0504a29') ||
      linjiAnchor?.status !== 'collated_with_normalization') {
    failures++; console.log('❌ Linji unit-level locator pilot is not rendered');
  }
} catch (e) { failures++; console.log(`❌ Linji locator pilot crash: ${e.message}`); }

// 1c. The Xinxin Ming pilot exposes stanza-level T2010 source anchors.
try {
  corpusClicks.xinxin_ming();
  if (!ids['reader-content-target']._innerHTML.includes('Stanza source: T48n2010_p0376b20–p0376b21')) {
    failures++; console.log('❌ Xinxin Ming stanza-level locator pilot is not rendered');
  }
} catch (e) { failures++; console.log(`❌ Xinxin Ming locator pilot crash: ${e.message}`); }

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
if (!biyanHtml.includes('data-jump-case="4">第4則 ›') || !biyanHtml.includes('data-jump-case="2">‹ 第2則')) {
  failures++; console.log('❌ Biyanlu sparse prev/next navigation is incorrect');
}
// 4e1. Biyanlu pilot cases 4-10 render with labeled AI-draft renderings
// (cases 1-12 render in the lazy first chunk, so 4/6/8 are present).
if (!biyanHtml.includes('勘破了也') || !biyanHtml.includes('Deshan') || !biyanHtml.includes('AI draft')) {
  failures++; console.log('❌ Biyanlu case 4 content or AI-draft labeling missing');
}
if (!biyanHtml.includes('日日是好日') || !biyanHtml.includes('Yunmen')) {
  failures++; console.log('❌ Biyanlu case 6 (Yunmen) content missing');
}
if (!biyanHtml.includes('翠嵒眉毛') || !biyanHtml.includes('Barrier')) {
  failures++; console.log('❌ Biyanlu case 8 (Cuiyan) content missing');
}
if (store['translatechan_corpus_key'] !== 'biyanlu_cases') { failures++; console.log('❌ corpus selection was not persisted'); }
const mobileCorpusSelect = ids['corpus-mobile-select'];
mobileCorpusSelect.value = 'congronglu_cases';
(mobileCorpusSelect._handlers.change || []).forEach(fn => fn({ target: mobileCorpusSelect }));
if (store['translatechan_corpus_key'] !== 'congronglu_cases') { failures++; console.log('❌ mobile corpus selection was not persisted'); }
corpusClicks['congronglu_cases'] && corpusClicks['congronglu_cases']();
const congrongHtml = ids['reader-content-target']._innerHTML;
if (!congrongHtml.includes('data-jump-case="9">第9則 ›') || !congrongHtml.includes('data-jump-case="1">‹ 第1則')) {
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
const wmStripChips = (ids['reader-content-target']._innerHTML.match(/class="case-chip"/g) || []).length;
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
// 4i. Public reader source/translation disclosure: document + case locations,
// book/page status, translator, AI/reconstruction label, and hoverable citation triggers.
if (!wmHtml.includes('Source location: T2005') || !wmHtml.includes('Case source: T2005, case 1') || !wmHtml.includes('citation-trigger')) {
  failures++; console.log('❌ reader source-location disclosure missing');
}
if (!wmHtml.includes('Page / section:') || !wmHtml.includes('Project register reconstruction — not a published book quotation') || !wmHtml.includes('AI draft — no external book quotation')) {
  failures++; console.log('❌ reader translation/AI disclosure missing');
}
const citationId = (wmHtml.match(/data-citation-id="([^"]+)"/) || [])[1];
if (!citationId || !(documentHandlers.mouseover || []).length || !(documentHandlers.focusin || []).length || !(documentHandlers.click || []).length) {
  failures++; console.log('❌ citation hover/focus/touch handlers missing');
} else {
  const citationTrigger = {
    getAttribute: () => citationId,
    getBoundingClientRect: () => ({ top: 0, left: 0, bottom: 12 }),
    contains: () => false
  };
  const target = { closest: selector => selector === '.citation-trigger' ? citationTrigger : null };
  (documentHandlers.mouseover || []).forEach(fn => fn({ target, relatedTarget: null }));
  const citationPopover = createdElements.find(el => el.id === 'citation-popover');
  if (!citationPopover || !citationPopover._innerHTML.includes('Canonical location')) {
    failures++; console.log('❌ citation hover popover did not render source details');
  }
  // Translation disclosures must carry the aligned Chinese excerpt and source-review state.
  const allCitationIds = [...wmHtml.matchAll(/data-citation-id="([^"]+)"/g)].map(m => m[1]);
  let hasOriginalSourceDisclosure = false;
  for (const id of allCitationIds) {
    citationTrigger.getAttribute = () => id;
    (documentHandlers.mouseover || []).forEach(fn => fn({ target, relatedTarget: null }));
    if (citationPopover && citationPopover._innerHTML.includes('Original Chinese source') && citationPopover._innerHTML.includes('Source verification status')) {
      hasOriginalSourceDisclosure = true;
      break;
    }
  }
  if (!hasOriginalSourceDisclosure) {
    failures++; console.log('❌ translation disclosure omitted original Chinese or canonical verification status');
  }
}
// 4j. Tooltip DOM is de-duplicated: no embedded .term-tooltip nodes remain in reader output
if (wmHtml.includes('term-tooltip')) { failures++; console.log('❌ embedded tooltip markup still emitted (de-dup regression)'); }
// 4j2. Coverage disclosure (truth-in-UI): an excerpt must never be mistaken for
// a complete text — the reader header shows validator-derived coverage.
corpusClicks['biyanlu_cases'] && corpusClicks['biyanlu_cases']();
const biyanCovHtml = ids['reader-content-target']._innerHTML;
if (!biyanCovHtml.includes('📊 Coverage: 14/100 cases')) { failures++; console.log('❌ Biyanlu coverage disclosure missing'); }
corpusClicks['wumenguan'] && corpusClicks['wumenguan']();
if (!ids['reader-content-target']._innerHTML.includes('📊 Coverage: 48/48 cases')) { failures++; console.log('❌ Wumenguan coverage disclosure missing'); }
// 4j. Mobile corpus picker is populated (mirrors the sidebar)
const mobileSelectHtml = ids['corpus-mobile-select']._innerHTML;
if (!mobileSelectHtml.includes('wumenguan')) { failures++; console.log('❌ mobile corpus picker not populated'); }
// 4k. Lineage graph: pan/zoom group + reset controller present
const svgHtml = ids['lineage-svg-graph']._innerHTML;
if (!svgHtml.includes('lineage-panzoom')) { failures++; console.log('❌ lineage pan/zoom group missing'); }
if (typeof window.TranslateChan.resetLineageView !== 'function') { failures++; console.log('❌ lineage reset view missing'); }
// 4l. Lineage aggregation/verification: every internal graph link is registered
// as a source-aware status, summary is visible, and click opens citation details.
const lineageVerification = window.TRANSLATECHAN_DATA.lineage_verification;
if (!lineageVerification || lineageVerification.edges.length !== 30 || lineageVerification.frontiers.length !== 4) {
  failures++; console.log('❌ lineage verification registry coverage is incorrect');
}
if (!svgHtml.includes('graph-link is-pending') || !svgHtml.includes('graph-generation-labels') || !svgHtml.includes('graph-node-halo') || typeof window.TranslateChan.openLineageEdge !== 'function') {
  failures++; console.log('❌ source-aware layered lineage chart missing');
}
if (Number(ids['lineage-svg-graph']._attrs.height || 0) < 1200) {
  failures++; console.log('❌ lineage chart did not expand into readable generation rows');
}
const lineageSummaryHtml = ids['lineage-verification-summary']._innerHTML;
if (!lineageSummaryHtml.includes('Chart status') || !lineageSummaryHtml.includes('citation-trigger')) {
  failures++; console.log('❌ lineage verification summary disclosure missing');
}
try {
  window.TranslateChan.openLineageEdge('bodhidharma', 'huike');
  if (!ids['dossier-content']._innerHTML.includes('Traditional link') || !ids['dossier-content']._innerHTML.includes('citation-trigger')) {
    failures++; console.log('❌ lineage edge citation panel missing');
  }
  window.TranslateChan.openMasterDossier('bodhidharma');
  if (!ids['dossier-content']._innerHTML.includes('Profile source')) {
    failures++; console.log('❌ master profile source disclosure missing');
  }
} catch (e) { failures++; console.log(`❌ lineage source disclosure crashed: ${e.message}`); }
// 4m. Hash routing: initial deep-link state + viewHash helper
if (typeof window.TranslateChan.openDoc !== 'function') { failures++; console.log('❌ openDoc missing (hash routing depends on it)'); }
// 4m. Gong'an filter chips remain available in the public reading scope.
const gonganHtml = ids['gongan-content-target']._innerHTML;
if (!gonganHtml.includes('gongan-filter-chip')) { failures++; console.log('❌ gongan filter chips missing'); }
// 4n. Matrix provenance is explicit for every translator, with citations for verified rows.
const matrixEntries = window.TRANSLATECHAN_DATA.translations_matrix.flatMap(row => row.translators || []);
const malformedMatrixEntries = matrixEntries.filter(t => !t.status ||
  (t.status === 'verified_quotation' && (!t.source || !t.source.work || !t.source.edition || !t.source.reference || !t.source.verification || !t.source.source_id)));
if (malformedMatrixEntries.length) { failures++; console.log(`❌ matrix provenance incomplete for ${malformedMatrixEntries.length} entry/entries`); }
const matrixHtml = ids['matrix-content-target']._innerHTML;
const matrixStatusCount = (matrixHtml.match(/class="translation-status/g) || []).length;
if (matrixStatusCount !== matrixEntries.length) { failures++; console.log(`❌ matrix has ${matrixStatusCount} provenance badges (expected ${matrixEntries.length})`); }
const matrixSourceCount = (matrixHtml.match(/class="translation-source/g) || []).length;
if (matrixSourceCount !== matrixEntries.length) { failures++; console.log(`❌ matrix has ${matrixSourceCount} disclosure lines (expected ${matrixEntries.length})`); }
if (!matrixHtml.includes('Source location:') || !matrixHtml.includes('Page / section:') || !matrixHtml.includes('AI draft — no external book quotation') || !matrixHtml.includes('citation-trigger')) {
  failures++; console.log('❌ matrix citation/disclosure rendering missing');
}
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

// 4u. CSP/a11y hardening: no inline event-handler attributes may exist in
// index.html or app.js source (a strict Content-Security-Policy is enforced
// via the meta tag, so script-src 'self' must be satisfiable).
const appSrc = readFileSync(join(ROOT, 'app.js'), 'utf8');
for (const [label, src] of [['index.html', publicHtml], ['app.js', appSrc]]) {
  for (const attr of ['onclick="', 'onload="', 'onerror="', 'onchange="', 'oninput="', 'onmouseover="', 'onmouseout="', 'onkeydown="', 'onfocus="', 'onblur="']) {
    if (src.includes(attr)) { failures++; console.log(`❌ ${label} still contains inline handler attribute '${attr}'`); }
  }
}
if (!publicHtml.includes('http-equiv="Content-Security-Policy"') || !publicHtml.includes("script-src 'self'")) {
  failures++; console.log('❌ CSP meta tag missing or not restrictive for scripts');
}
// 4v. Delegated clicks replace inline onclick: a [data-jump-case] chip and a
// [data-open-doc] button must route through the document-level handler.
corpusClicks['wumenguan'] && corpusClicks['wumenguan']();
let jumpedNum = null;
const origScrollToCase = window.TranslateChan.scrollToCase;
window.TranslateChan.scrollToCase = (num) => { jumpedNum = num; };
const jumpTarget = {
  getAttribute: n => n === 'data-jump-case' ? '3' : null,
  closest: sel => sel === '[data-jump-case]' ? jumpTarget : null
};
try { (documentHandlers.click || []).forEach(fn => fn({ target: jumpTarget, preventDefault() {} })); }
catch (e) { failures++; console.log(`❌ delegated jump-chip click crashed: ${e.message}`); }
window.TranslateChan.scrollToCase = origScrollToCase;
if (jumpedNum !== 3) { failures++; console.log('❌ [data-jump-case] delegation did not reach scrollToCase'); }
const docTarget = {
  getAttribute: n => n === 'data-open-doc' ? 'xinxin_ming' : null,
  closest: sel => sel === '[data-open-doc]' ? docTarget : null
};
try { (documentHandlers.click || []).forEach(fn => fn({ target: docTarget, preventDefault() {} })); }
catch (e) { failures++; console.log(`❌ delegated open-doc click crashed: ${e.message}`); }
if (store['translatechan_corpus_key'] !== 'xinxin_ming') { failures++; console.log('❌ [data-open-doc] delegation did not open the document'); }
// 4w. Glossary terms are keyboard-activatable: Enter on a .term-highlight span
// opens the shared popover (focus alone must not be a dead end).
corpusClicks['wumenguan'] && corpusClicks['wumenguan']();
const termId = (ids['reader-content-target']._innerHTML.match(/data-term-id="([^"]+)"/) || [])[1];
if (!termId) { failures++; console.log('❌ no annotated glossary term found in reader'); }
else {
  const termSpan = {
    getAttribute: n => n === 'data-term-id' ? termId : null,
    getBoundingClientRect: () => ({ left: 100, top: 100, bottom: 112, right: 130, width: 30, height: 12 })
  };
  (ids['reader-content-target']._handlers['keydown'] || []).forEach(fn => fn({
    key: 'Enter',
    preventDefault() {},
    target: { closest: sel => sel === '.term-highlight' ? termSpan : null }
  }));
  const termPopover = createdElements.find(el => el.id === 'term-popover');
  const glossaryTerm = (window.TRANSLATECHAN_DATA.glossary || []).find(t => t.id === termId);
  if (!termPopover || !glossaryTerm || !termPopover._innerHTML.includes(glossaryTerm.term)) {
    failures++; console.log('❌ Enter did not open the glossary popover for the focused term');
  }
}
// 4x. ARIA tabs: only the active tab is tabbable (roving tabindex), and the
// tablist arrow/Home/End keys activate the adjacent tab like a click would.
const navTabStubs = document.querySelectorAll('.nav-tab-btn');
const activeTab = navTabStubs.find(t => t.getAttribute('aria-selected') === 'true');
if (!activeTab || activeTab.getAttribute('tabindex') !== '0') { failures++; console.log('❌ active nav tab is not the roving-focus target'); }
if (navTabStubs.some(t => t !== activeTab && t.getAttribute('tabindex') !== '-1')) { failures++; console.log('❌ inactive nav tabs are still tabbable'); }
document.activeElement = navTabStubs[1]; // matrix
(documentHandlers['navtabs_keydown'] || []).forEach(fn => fn({ key: 'ArrowRight', preventDefault() {} }));
if (!navTabStubs[2]._clicked || navTabStubs[2].getAttribute('aria-selected') !== 'true' || navTabStubs[1].getAttribute('aria-selected') !== 'false') {
  failures++; console.log('❌ ArrowRight did not activate the next nav tab');
}
document.activeElement = navTabStubs[4]; // lexicon
(documentHandlers['navtabs_keydown'] || []).forEach(fn => fn({ key: 'End', preventDefault() {} }));
if (!navTabStubs[4]._clicked) { failures++; console.log('❌ End did not activate the last nav tab'); }

// 5. Content sanity: reset reader to wumenguan, then assert key content present
corpusClicks['wumenguan'] && corpusClicks['wumenguan']();
const readerHtml = ids['reader-content-target']._innerHTML;
for (const [must, label] of [['Zhàozhōu héshang', 'case 1 pinyin line'], ['Mu', 'mu translations'], ['Red Pine', 'translator tag'], ['評唱', 'commentary block']]) {
  if (!readerHtml.includes(must)) { failures++; console.log(`❌ reader missing ${label}`); }
}

console.log(failures === 0 ? '\n✅ SMOKE TEST PASSED' : `\n🔴 SMOKE TEST: ${failures} failures`);
process.exit(failures === 0 ? 0 : 1);
