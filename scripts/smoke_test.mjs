// Minimal DOM stub smoke test for TranslateChan app.js
// TranslateChan smoke test — exercises renderReader for every corpus text, all modes, search, namespace.
// Run: node scripts/smoke_test.mjs   (no dependencies)
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// Public Pages scope deliberately excludes browser drafting, agent branding, and
// a header GitHub link; keep that composition from regressing during app work.
const publicHtml = readFileSync(join(ROOT, 'index.html'), 'utf8');
const appSrc = readFileSync(join(ROOT, 'app.js'), 'utf8');
const themeInitSrc = readFileSync(join(ROOT, 'theme-init.js'), 'utf8');
for (const forbidden of ['data-view="studio"', 'data-view="agents"', 'id="view-studio"', 'id="view-agents"', 'https://github.com/56eli/translatechan']) {
  if (publicHtml.includes(forbidden)) throw new Error(`public Pages scope regression: ${forbidden}`);
}
// B1 (a11y/perceived-performance): the persisted theme must be applied before
// first paint by an external head script (theme-init.js), referenced before the
// stylesheet, so returning dark-mode users don't see a light-mode flash.
if (!publicHtml.includes('<script src="theme-init.js"></script>')) {
  throw new Error('theme-init.js is not referenced from index.html');
}
if (publicHtml.indexOf('<script src="theme-init.js"></script>') > publicHtml.indexOf('<link rel="stylesheet" href="app.css">')) {
  throw new Error('theme-init.js must load before app.css to prevent a theme flash');
}
if (!/localStorage[^]*translatechan_theme[^]*setAttribute\(['"]data-theme['"]/.test(themeInitSrc)) {
  throw new Error('theme-init.js must read translatechan_theme and set data-theme before paint');
}
// B5: public share/SEO metadata and crawler files.
for (const requiredMeta of [
  'name="theme-color"',
  'property="og:title"',
  'property="og:description"',
  'name="twitter:card"',
  'rel="canonical" href="https://56eli.github.io/translatechan/"'
]) {
  if (!publicHtml.includes(requiredMeta)) throw new Error(`missing public metadata: ${requiredMeta}`);
}
for (const requiredFile of ['robots.txt', 'sitemap.xml']) {
  if (!existsSync(join(ROOT, requiredFile)) || !existsSync(join(ROOT, 'docs', requiredFile))) {
    throw new Error(`missing generated ${requiredFile} at root and docs/`);
  }
}
// B3/B6: decorative nav emoji are hidden, and the hero chip count is data-derived.
for (const iconSpan of publicHtml.match(/<span[^>]*>[\u{1F300}-\u{1FAFF}️⃣][^<]*<\/span>/gu) || []) {
  if (iconSpan.includes('<span>Bilingual') || iconSpan.includes('<span>Comparative')) continue;
  if (!iconSpan.includes('aria-hidden="true"')) throw new Error(`decorative emoji span is not aria-hidden: ${iconSpan}`);
}
if (!appSrc.includes("getElementById('hero-translator-count')") || !appSrc.includes('translators.size')) {
  throw new Error('hero translator/corpus counts are not derived from data');
}
// B4: app_data/app.js should use defer so parsing is not blocked while the
// ~873 KB bundle downloads; order remains app_data.js then app.js.
if (!publicHtml.includes('<script defer src="app_data.js"></script>')) {
  throw new Error('app_data.js is not deferred');
}
if (publicHtml.indexOf('<script defer src="app_data.js"></script>') >= publicHtml.indexOf('<script defer src="app.js"></script>')) {
  throw new Error('deferred scripts must preserve app_data.js before app.js order');
}
// N1 (a11y, 2026-08-09 session 019fe731): every programmatic scroll must route
// through motionBehavior() so prefers-reduced-motion users get instant jumps.
if (appSrc.includes("behavior: 'smooth'")) {
  throw new Error("programmatic smooth scroll bypasses prefers-reduced-motion — route through motionBehavior()");
}
if (!appSrc.includes("matchMedia('(prefers-reduced-motion: reduce)')")) {
  throw new Error('motionBehavior() must consult prefers-reduced-motion');
}
// N2: the master dossier is a focus-managed non-modal dialog (role, aria
// label, focus-in on open, ✕/Escape closes and restores focus).
if (!publicHtml.includes('id="master-dossier-panel" role="dialog"')) {
  throw new Error('master dossier panel must carry role="dialog"');
}
if (!appSrc.includes('function closeDossierPanel(') || !appSrc.includes("if (e.key !== 'Escape') return;")) {
  throw new Error('dossier dialog needs the Escape close path with focus restore');
}
// N3: keyboard focus reveals glossary definitions; both popovers are tooltips.
if (!appSrc.includes("matches(':focus-visible')")) {
  throw new Error('term popover must open on keyboard focus, not only on Enter/Space');
}
if ((appSrc.match(/setAttribute\('role', 'tooltip'\)/g) || []).length < 2) {
  throw new Error('term and citation popovers must carry role="tooltip"');
}
// N6: the global search input needs an accessible name and a search landmark.
if (!/<input[^>]*type="search"[^>]*id="global-search"[^>]*aria-label="[^"]+"/.test(publicHtml)) {
  throw new Error('global search input must be type="search" with an aria-label');
}
if (!publicHtml.includes('<div class="search-box" role="search">')) {
  throw new Error('search box must carry the search landmark role');
}

// N5: toneless pinyin queries (foxing, zhaozhou) must resolve against the
// tone-marked corpus pinyin via Unicode diacritic folding.
if (!appSrc.includes(".normalize('NFD')") || !appSrc.includes('\\u0300-\\u036f')) {
  throw new Error('normalizeForSearch must fold diacritics (NFD + combining-mark strip)');
}
// N4: result cards must disclose which field matched (translations/pinyin/
// title) when the classical Chinese itself did not contain the query.
if (!appSrc.includes('Matched in translations')) {
  throw new Error('search result cards must disclose translation-field matches');
}
// N7: the lineage graph re-lays out (debounced) on viewport resize while the
// lineage view is visible.
if (!appSrc.includes("addEventListener('resize',") || !appSrc.includes('setTimeout(renderLineage, 220)')) {
  throw new Error('lineage graph must re-render on debounced resize while the view is visible');
}
// N8: popovers are capped, scrollable, interactive, and positioned from their
// measured height (no hardcoded flip-height guesses).
const appCss = readFileSync(join(ROOT, 'app.css'), 'utf8');
if (!appSrc.includes('positionFloatingPopover(pop, anchor, popW)')) {
  throw new Error('popovers must share the measured positionFloatingPopover positioner');
}
for (const popSel of ['.citation-popover {', '.term-popover {']) {
  const start = appCss.indexOf(popSel);
  const block = start === -1 ? '' : appCss.slice(start, appCss.indexOf('}', start));
  if (!block.includes('max-height: min(60vh') || !block.includes('overflow-y: auto') || !block.includes('pointer-events: auto')) {
    throw new Error(`${popSel} must be capped, scrollable, and interactive (N8)`);
  }
}
// N10: citation metadata legibility floor — no sub-11px source text.
if (appCss.includes('font-size: 0.62rem')) {
  throw new Error('.translation-source fell below the 0.72rem legibility floor');
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
globalThis.window._handlers = {};
globalThis.location = { hash: '', href: 'http://localhost/index.html', protocol: 'http:', host: 'localhost' };
globalThis.addEventListener = (ev, fn) => { (globalThis.window._handlers[ev] ||= []).push(fn); };
globalThis.scrollTo = (opts) => { globalThis.window._lastScrollTo = opts; };
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
for (const [key, expect] of [['wumenguan', '48/48 cases'], ['biyanlu_cases', '100/100 cases'], ['congronglu_cases', '9/100 cases'], ['platform_sutra', '10/10 chapters']]) {
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
// The complete-text ingestion (2026-08-09) makes the section list long: the reader
// lazy-renders it in chunks, so keep loading more until the anchor section appears.
try {
  corpusClicks.linji_yulu();
  let linjiHtml = ids['reader-content-target']._innerHTML;
  let guard = 0;
  while (!linjiHtml.includes('Section source: T47n1985_p0504a26–p0504a29') && guard < 12) {
    window.TranslateChan.loadMoreCases();
    linjiHtml = ids['reader-content-target']._innerHTML;
    guard++;
  }
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

// 4b2. N4/N5 field disclosure (2026-08-09 session 019fe731): a translation-text
// query names the matching register on the card, and a toneless pinyin query
// resolves against tone-marked pinyin with the pinyin field disclosed.
try {
  await fireSearch('Buddha-nature');
  const html = ids['reader-content-target']._innerHTML;
  if (html.includes('No matches found')) { failures++; console.log('❌ N4: "Buddha-nature" search found nothing'); }
  if (!html.includes('Matched in translations')) { failures++; console.log('❌ N4: translation match not disclosed on the result card'); }
} catch (e) { failures++; console.log(`❌ N4 behavioral check crash: ${e.message}`); }
try {
  // 'foxing' exists ONLY as tone-marked 佛性 pinyin (fóxìng) — zero plain-ASCII
  // occurrences in the corpus — so this can only match via diacritic folding.
  await fireSearch('foxing');
  const html = ids['reader-content-target']._innerHTML;
  if (html.includes('No matches found')) { failures++; console.log('❌ N5: toneless pinyin query "foxing" found nothing'); }
  if (!html.includes('Matched in pinyin')) { failures++; console.log('❌ N4/N5: pinyin match note missing from the result card'); }
} catch (e) { failures++; console.log(`❌ N5 behavioral check crash: ${e.message}`); }

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
if (!wmHtml.includes('Page / section:') || !wmHtml.includes('Robolation') || !wmHtml.includes('Robo draft')) {
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
if (!biyanCovHtml.includes('📊 Coverage: 100/100 cases')) { failures++; console.log('❌ Biyanlu coverage disclosure missing'); }
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
// 4m2. Lineage school filter is generated from the controlled vocabulary
// (validator-enforced school_key groups), not hardcoded options.
const schoolFilterHtml = ids['lineage-school-filter']._innerHTML;
if (!schoolFilterHtml.includes('value="linji_yangqi"') || !schoolFilterHtml.includes('Foundational Patriarch') || schoolFilterHtml.includes('value="Linji"')) {
  failures++; console.log('❌ lineage school filter is not generated from the controlled school vocabulary');
}
(ids['lineage-school-filter']._handlers.change || []).forEach(fn => fn({ target: { value: 'linji' } }));
const lineageFilteredCards = ids['lineage-content-target']._innerHTML;
if (!lineageFilteredCards.includes('臨濟義玄') || lineageFilteredCards.includes('洞山良价') || lineageFilteredCards.includes('馬祖道一')) {
  failures++; console.log('❌ lineage school filter did not select exactly the Linji group');
}
if (!ids['lineage-svg-graph']._innerHTML.includes('stroke="#b53335"')) {
  failures++; console.log('❌ lineage graph is not using the school_key color palette');
}
// 4m2b. The graph palette must be data-derived from school_vocabulary.json's
// per-school `color` (audit A2): app.js must not carry a hardcoded school color
// map, and every bundled school must expose a hex color.
if (/indian_patriarchs:\s*'#/.test(appSrc) || /const schoolColors\s*=\s*\{/.test(appSrc)) {
  failures++; console.log('❌ lineage graph still uses a hardcoded school color map instead of the vocabulary');
}
const bundledSchools = (window.TRANSLATECHAN_DATA.lineage_school_vocab || {}).schools || [];
if (!bundledSchools.length || !bundledSchools.every(s => /^#[0-9a-fA-F]{6}$/.test(s.color))) {
  failures++; console.log('❌ bundled school vocabulary is missing per-school hex colors');
}
(ids['lineage-school-filter']._handlers.change || []).forEach(fn => fn({ target: { value: 'all' } }));
// 4m3. Lexicon category filter is data-derived and actually wired (state +
// listener existed only after the 2026-08-09 vocabulary pass).
const lexiconFilterHtml = ids['lexicon-cat-filter']._innerHTML;
if (!lexiconFilterHtml.includes('value="Ontology"') || !lexiconFilterHtml.includes('Ontology &amp; Buddha-Nature')) {
  failures++; console.log('❌ lexicon category filter is not generated from glossary data');
}
(ids['lexicon-cat-filter']._handlers.change || []).forEach(fn => fn({ target: { value: 'Ontology' } }));
const lexiconFiltered = ids['lexicon-content-target']._innerHTML;
if (!lexiconFiltered.includes('本來面目') || lexiconFiltered.includes('祖師西來意')) {
  failures++; console.log('❌ lexicon category filter did not restrict to Ontology terms');
}
(ids['lexicon-cat-filter']._handlers.change || []).forEach(fn => fn({ target: { value: 'all' } }));
// 4m4. Gong'an theme chips are generated from the controlled theme taxonomy
// (validator-enforced theme_group keys), grouping cases instead of 23 one-off labels.
const gonganChipsHtml = ids['gongan-content-target']._innerHTML;
if (!gonganChipsHtml.includes('data-gongan-filter="everyday_way"') || !gonganChipsHtml.includes('data-gongan-filter="what_is_buddha"')) {
  failures++; console.log('❌ gongan theme chips are not generated from the controlled theme taxonomy');
}
if (!gonganChipsHtml.includes('🏷️ The Everyday Way')) { failures++; console.log('❌ gongan cards do not show the theme group tag'); }
const chipClick = (key) => (ids['gongan-content-target']._handlers.click || []).forEach(fn => fn({
  target: { closest: (sel) => (sel === '.gongan-filter-chip' ? { getAttribute: () => key } : null) }
}));
chipClick('everyday_way');
const gonganFilteredHtml = ids['gongan-content-target']._innerHTML;
if (!gonganFilteredHtml.includes('趙州洗缽') || gonganFilteredHtml.includes('趙州狗子')) {
  failures++; console.log('❌ gongan theme-group chip did not restrict the index to the Everyday Way group');
}
chipClick('all');
// 4m5. Lexicon occurrence scope note (audit A5): occurrence tags cite canonical
// loci (chapter/fascicle/case) which may lie outside the excerpted units — the
// Lexicon header must keep disclosing that scoping.
if (!publicHtml.includes('occurrence tags cite each term') || !publicHtml.includes('canonical work')) {
  failures++; console.log('❌ lexicon occurrence scope note missing');
}
// 4m6. Semantic document outline (a11y audit 2026-08-09): each public view's
// title is a real heading element, not a styled <div>, so screen-reader users
// get "next heading" navigation. The reader document title is an <h1> and every
// case/section/matrix/master/lexicon card title is an <h2>.
const outlineReaderHtml = ids['reader-content-target']._innerHTML;
if (!/<h1 class="text-title-zh">/.test(outlineReaderHtml)) { failures++; console.log('❌ reader document title is not an <h1>'); }
if ((outlineReaderHtml.match(/<h2 class="case-num-title">/g) || []).length < 48) {
  failures++; console.log('❌ reader case/unit titles are not <h2> headings');
}
for (const [view, id] of [['matrix', 'matrix-content-target'], ['gongan', 'gongan-content-target'], ['lexicon', 'lexicon-content-target'], ['lineage', 'lineage-content-target']]) {
  const html = ids[id]._innerHTML;
  if (!/<h2 class="/.test(html)) { failures++; console.log(`❌ ${view} cards have no <h2> headings`); }
}
// The four non-reader view titles live as <h1 class="text-title-zh"> in index.html
// (matrix, lineage, gongan, lexicon); the dossier heading also uses that class.
const staticH1Count = (publicHtml.match(/<h1 class="text-title-zh">/g) || []).length;
if (staticH1Count < 4) { failures++; console.log('❌ non-reader view titles are not <h1> in index.html'); }
// 4m7. Corpus translations are explicit record objects, not legacy bare
// strings (audit A4): every slot must carry text/status.
let legacyStringSlots = 0;
let corpusSlots = 0;
(function walkTranslationRecords(value) {
  if (Array.isArray(value)) return value.forEach(walkTranslationRecords);
  if (value && typeof value === 'object') {
    if (value.translations && typeof value.translations === 'object') {
      Object.values(value.translations).forEach(slot => {
        corpusSlots++;
        if (typeof slot === 'string') legacyStringSlots++;
      });
    }
    Object.values(value).forEach(walkTranslationRecords);
  }
})(window.TRANSLATECHAN_DATA.corpus);
// Slot-count floor was data-derived from the bundle's own metrics (slot totals
// legitimately move when seed cases are re-collated; the old '874' literal
// hardcoded the A4-migration-era count, 2026-08-09 session 019fe731).
const expectedCorpusSlots = window.TRANSLATECHAN_DATA.project_metrics?.translations?.corpus_slots;
if (legacyStringSlots !== 0) failures++;
if (corpusSlots !== expectedCorpusSlots || corpusSlots < 800) failures++;
if (legacyStringSlots !== 0 || corpusSlots !== expectedCorpusSlots || corpusSlots < 800) {
  console.log(`❌ corpus translation record migration incomplete: ${legacyStringSlots} legacy string(s), ${corpusSlots} slots (metrics expect ${expectedCorpusSlots})`);
}
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
if (!matrixHtml.includes('Source location:') || !matrixHtml.includes('Page / section:') || !matrixHtml.includes('Robo') || !matrixHtml.includes('citation-trigger')) {
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

// 4y. Escaping consistency (P2-C): poisoned data fields must render as escaped
// text in EVERY view — reader titles, lineage cards, gongan chips, lexicon cards.
// One raw interpolation in any of these was previously an injection path.
const POISON = '<img src=x onerror=window.__poison=1>POISON';
const poisonMaster = window.TRANSLATECHAN_DATA.lineage[0];
const poisonGongan = window.TRANSLATECHAN_DATA.gongan_index[0];
const poisonTerm = window.TRANSLATECHAN_DATA.glossary[0];
const poisonCase = window.TRANSLATECHAN_DATA.corpus.wumenguan.cases[0];
const saved = { name_zh: poisonMaster.name_zh, theme: poisonGongan.theme, term: poisonTerm.term, title: poisonCase.title_zh };
poisonMaster.name_zh = POISON + saved.name_zh;
poisonGongan.theme = POISON + saved.theme;
poisonTerm.term = POISON + saved.term;
poisonCase.title_zh = POISON + saved.title;
// Re-render every affected view through the same handlers a user would trigger.
(ids['lineage-school-filter']._handlers.change || []).forEach(fn => fn({ target: { value: 'all' } }));
(ids['gongan-content-target']._handlers.click || []).forEach(fn => fn({
  target: { closest: (sel) => (sel === '.gongan-filter-chip' ? { getAttribute: () => 'all' } : null) }
}));
(ids['lexicon-cat-filter']._handlers.change || []).forEach(fn => fn({ target: { value: 'all' } }));
window.TranslateChan.openDoc('wumenguan');
const poisonTargets = {
  reader: ids['reader-content-target']._innerHTML,
  lineage: ids['lineage-content-target']._innerHTML,
  gongan: ids['gongan-content-target']._innerHTML,
  lexicon: ids['lexicon-content-target']._innerHTML
};
for (const [view, html] of Object.entries(poisonTargets)) {
  if (html.includes('<img src=x onerror')) { failures++; console.log(`❌ ${view} view renders unescaped data (injection path)`); }
  if (!html.includes('&lt;img src=x onerror')) { failures++; console.log(`❌ ${view} view did not render the poisoned field as escaped text`); }
}
// restore clean data so subsequent sections see unmodified fixtures
poisonMaster.name_zh = saved.name_zh;
poisonGongan.theme = saved.theme;
poisonTerm.term = saved.term;
poisonCase.title_zh = saved.title;

// 4z. switchViewRaw scroll-restore on back/forward (audit 2026-08-09 / standing recommendation):
// switching view saves previous scrollY; calling switchViewRaw(view, false) restores it.
globalThis.window.scrollY = 480;
navTabStubs[1].click(); // matrix
if (!globalThis.window._lastScrollTo || globalThis.window._lastScrollTo.top !== 0) {
  failures++; console.log('❌ active view switch did not scroll to top 0');
}
// simulate browser back navigation via hashchange (scroll=false)
globalThis.location.hash = '#/reader/wumenguan';
(globalThis.window._handlers['hashchange'] || []).forEach(fn => fn());
await new Promise(r => setTimeout(r, 15));
if (!globalThis.window._lastScrollTo || globalThis.window._lastScrollTo.top !== 480) {
  failures++; console.log(`❌ back navigation did not restore previous scroll position (got ${globalThis.window._lastScrollTo ? globalThis.window._lastScrollTo.top : 'null'})`);
}
globalThis.window.scrollY = 0;

// 5. Content sanity: reset reader to wumenguan, then assert key content present
corpusClicks['wumenguan'] && corpusClicks['wumenguan']();
const readerHtml = ids['reader-content-target']._innerHTML;
for (const [must, label] of [['Zhàozhōu héshang', 'case 1 pinyin line'], ['Mu', 'mu translations'], ['Red Pine', 'translator tag'], ['評唱', 'commentary block']]) {
  if (!readerHtml.includes(must)) { failures++; console.log(`❌ reader missing ${label}`); }
}

console.log(failures === 0 ? '\n✅ SMOKE TEST PASSED' : `\n🔴 SMOKE TEST: ${failures} failures`);
process.exit(failures === 0 ? 0 : 1);
