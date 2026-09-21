// Runtime check for the single completion/source-review compatibility rule.
//
// Applies a TEMPORARY in-memory pairing — completion_status = complete_selected_witness
// combined with a NON-collated W1 source-review status — to one corpus document, renders
// the Reader and the sidebar shelf, and asserts the runtime output never claims
// completeness: no "Complete witness" text, no complete mark, no represented-complete
// claim. Nothing on disk is mutated; the repository's committed data stays untouched.
//
// Usage: node scripts/compat_runtime_check.mjs [corpusKey] [expectedSourceReviewStatus]
// (defaults: wumenguan / partial_or_failed_w1_collation)
//
// The DOM stub below is a copy of the one in scripts/smoke_test.mjs (kept in sync by
// inspection); it exists so this check can run standalone from
// scripts/test_source_review_rules.py without executing the whole smoke suite.
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
  removeAttribute(name) { delete this._attrs[name]; }
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
globalThis.print = () => {
  globalThis.window._printedReaderHtml = ids['reader-content-target']?._innerHTML || '';
};

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
            _attrs: {},
            getAttribute: (name) => name === 'data-reader-mode' ? mode : null,
            setAttribute(name, value) { this._attrs[name] = String(value); },
            classList: { add() {}, remove() {} },
            addEventListener: (ev, fn) => { modeHandlers.find(h => h.getAttribute('data-reader-mode') === mode)._click = fn; }
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
// ---- the check itself ----
eval(readFileSync(join(ROOT, 'app_data.js'), 'utf8'));
if (!window.TRANSLATECHAN_DATA) throw new Error('app_data.js did not populate TRANSLATECHAN_DATA');
const appKey = process.argv[2] || 'hanshan_poems';
const expectedStatus = process.argv[3] || 'witness_unavailable';
const manifest = window.TRANSLATECHAN_DATA.corpus_manifest;
const item = (manifest?.items || []).find(i => i?.key === appKey);
if (!item) throw new Error(`no manifest item for ${appKey}`);
const perText = window.TRANSLATECHAN_DATA.project_metrics?.corpus?.per_text?.[appKey];
if (!perText) throw new Error(`no per_text entry for ${appKey}`);
if (item.source_review_status !== expectedStatus) {
  throw new Error(`manifest item ${appKey} has source_review_status ${item.source_review_status}, expected ${expectedStatus} (the pairing under test)`);
}

// The temporary pairing: an incompatible completion claim on top of the contained status.
item.completion_status = 'complete_selected_witness';
perText.completion_status = 'complete_selected_witness';
perText.is_complete = true;

eval(readFileSync(join(ROOT, 'app.js'), 'utf8'));
window.TranslateChan.openDoc(appKey);
const readerHtml = ids['reader-content-target']?._innerHTML || '';
const shelfHtml = ids['corpus-selector-list']?._innerHTML || '';
const fullHtml = readerHtml + shelfHtml;

let failures = 0;
const expectNot = (targetHtml, needle, label) => {
  if (targetHtml.includes(needle)) { failures++; console.log(`  ❌ ${label}: forbidden output present: ${needle}`); }
};
const expect = (targetHtml, needle, label) => {
  if (!targetHtml.includes(needle)) { failures++; console.log(`  ❌ ${label}: required output missing: ${needle}`); }
};

expectNot(readerHtml, 'Complete witness', 'reader must not render "Complete witness"');
expectNot(readerHtml, 'Complete selected witness', 'reader must not render "Complete selected witness"');
expectNot(readerHtml, 'data-represented-complete="true"', 'no represented-complete claim may be rendered');
expect(readerHtml, 'data-represented-complete="false"', 'the represented-units ledger must state data-represented-complete="false"');
expect(readerHtml, 'Completion/status conflict — validation required', 'the Reader must flag the completion/status conflict');
expect(readerHtml, `data-source-review-status="${expectedStatus}"`, 'the source-collation ledger must keep the contained W1 status');

const appKeyBtn = shelfHtml.slice(shelfHtml.indexOf(`data-corpus-key="${appKey}"`));
const appKeyBtnEnd = appKeyBtn.indexOf('</button>');
const buttonHtml = appKeyBtnEnd !== -1 ? appKeyBtn.slice(0, appKeyBtnEnd) : appKeyBtn;
expectNot(buttonHtml, 'is-complete', 'no complete mark may be rendered in the shelf for degraded claim');

// Restore the in-memory pairing so nothing leaks (the process exits right after).
item.completion_status = 'partial_selected_witness';
perText.completion_status = 'partial_selected_witness';
perText.is_complete = false;

if (failures) {
  console.log(`🔴 COMPAT-RUNTIME: ${failures} failure(s) for ${appKey} (${expectedStatus})`);
  process.exit(1);
}
console.log(`✅ COMPAT-RUNTIME OK: ${appKey} + ${expectedStatus} renders no completeness claim`);
process.exit(0);
