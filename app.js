/**
 * Fake Chan Factory - Interactive Classical Chan Translation Playground
 * Zero-backend client-side application for GitHub Pages.
 *
 * NOTE on naming: the user-facing brand is "Fake Chan Factory", but the
 * internal JS API namespace (window.TranslateChan), the persisted localStorage
 * keys (translatechan_*), and the data global (TRANSLATECHAN_DATA) keep the
 * original "translatechan" identifiers so returning users keep their prefs and
 * the test suite keeps working. Only visible text was rebranded.
 */

(function() {
  'use strict';

  // Application State
  const TOUCH_DEVICE = typeof window.matchMedia === 'function' && window.matchMedia('(hover: none)').matches;
  const READER_MODES = ['bilingual', 'chinese_only', 'multi_translators'];

  // Data that originated in browser storage must be treated as untrusted input.
  // Keep generic browser-provided records narrow so malformed persisted
  // preferences cannot break the public reader.
  function isRecord(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }
  function stringValue(value) {
    return typeof value === 'string' ? value : (value == null ? '' : String(value));
  }
  // Storage can throw in privacy-restricted frames, disabled-storage modes, or
  // quota failures. Preferences improve the app but must never prevent reading.
  function storageGet(key) {
    try { return window.localStorage ? window.localStorage.getItem(key) : null; }
    catch (e) { return null; }
  }
  function storageSet(key, value) {
    try {
      if (!window.localStorage) return false;
      window.localStorage.setItem(key, value);
      return true;
    } catch (e) { return false; }
  }
  function storageRemove(key) {
    try {
      if (!window.localStorage) return false;
      window.localStorage.removeItem(key);
      return true;
    } catch (e) { return false; }
  }

  // Honor the OS/browser reduced-motion preference for programmatic scrolls:
  // vestibular-sensitive users get instant jumps instead of animated pans.
  // CSS @media covers declarative animation, but the scroll APIs take an
  // explicit behavior token, so every smooth scroll in this file routes here
  // (a11y audit 2026-08-09, session 019fe731, N1; smoke-guarded).
  function motionBehavior() {
    const reduced = typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return reduced ? 'auto' : 'smooth';
  }

  const state = {
    data: window.TRANSLATECHAN_DATA || {},
    currentView: 'reader',
    currentCorpusKey: (() => {
      const k = storageGet('translatechan_corpus_key');
      return k && window.TRANSLATECHAN_DATA && window.TRANSLATECHAN_DATA.corpus && window.TRANSLATECHAN_DATA.corpus[k] ? k : 'wumenguan';
    })(),
    readerMode: (() => {
      const m = storageGet('translatechan_reader_mode');
      return READER_MODES.includes(m) ? m : 'bilingual';
    })(),
    showPinyin: storageGet('translatechan_show_pinyin') !== '0',
    fontSize: (() => {
      const v = parseFloat(storageGet('translatechan_font_size'));
      return (v >= 1.0 && v <= 2.2) ? v : 1.2;
    })(),
    collapsedCases: (() => {
      try {
        const val = JSON.parse(storageGet('translatechan_collapsed_cases') || '{}');
        return (val && typeof val === 'object' && !Array.isArray(val)) ? val : {};
      } catch (e) { return {}; }
    })(),
    theme: storageGet('translatechan_theme') || 'light',
    // Reading preferences (measure, register count, quiet, context rail) are
    // loaded from storage in loadReadingPrefs() and published as data-*
    // attributes on <html>; the sheet and the margin read them from there.
    nameMode: (() => { const v = storageGet('translatechan_name_mode'); return v === 'romaji' ? 'romaji' : 'pinyin'; })(),
    searchQuery: '',
    selectedMasterSchool: 'all',
    lineageSort: 'generation',
    selectedLexiconCategory: 'all',
    lexiconQuery: '', // U3 free-text filter
    gonganThemeFilter: null,
    corpusFilter: '', // L1 corpus sidebar search filter (session-only)
    caseLimit: {}, // per-corpus lazy-render limit (Phase D2)
    viewScroll: {}, // per-view scroll position for history restoration
  };

  // DOM Elements
  const elements = {
    themeToggle: document.getElementById('theme-toggle'),
    navTabs: document.querySelectorAll('.nav-tab-btn'),
    viewSections: document.querySelectorAll('.view-section'),
    globalSearch: document.getElementById('global-search'),
    // Reader Elements
    corpusList: document.getElementById('corpus-selector-list'),
    readerContent: document.getElementById('reader-content-target'),
    readerModeButtons: document.querySelectorAll('[data-reader-mode]'),
    // Matrix Elements
    matrixTarget: document.getElementById('matrix-content-target'),
    // Lineage Elements
    lineageFilter: document.getElementById('lineage-school-filter'),
    lineageSort: document.getElementById('lineage-sort-filter'),
    lineageTarget: document.getElementById('lineage-content-target'),
    lineageVerificationSummary: document.getElementById('lineage-verification-summary'),
    // Gong'an Elements
    gonganTarget: document.getElementById('gongan-content-target'),
    // Lexicon Elements
    lexiconFilter: document.getElementById('lexicon-cat-filter'),
    lexiconTarget: document.getElementById('lexicon-content-target'),
  };

  // Keep the hero's hand-authored work/register chips truthful by deriving them
  // from the live bundle rather than repeating counts in presentation code.
  function updateHeroCounts() {
    const corpusValue = document.getElementById('hero-corpus-count');
    if (corpusValue && state.data.corpus) {
      const count = Object.keys(state.data.corpus).length;
      corpusValue.textContent = String(count);
      corpusValue.parentElement?.setAttribute('aria-label', `${count} Canonical Works`);
    }
    const registerValue = document.getElementById('hero-translator-count');
    const rows = Array.isArray(state.data.translations_matrix) ? state.data.translations_matrix : [];
    const matrixRegisters = state.data.project_metrics?.translations?.matrix_entries
      || rows.reduce((total, row) => total + (Array.isArray(row?.translators) ? row.translators.length : 0), 0);
    if (registerValue) {
      registerValue.textContent = String(matrixRegisters);
      registerValue.parentElement?.setAttribute('aria-label', `${matrixRegisters} Matrix Registers`);
    }
  }

  // Corpus selection has a single persistence path so sidebar, mobile picker,
  // deep links, and search jumps all restore the same reading context.
  function setCurrentCorpusKey(key) {
    if (!key || !state.data.corpus || !state.data.corpus[key]) return false;
    state.currentCorpusKey = key;
    storageSet('translatechan_corpus_key', key);
    return true;
  }

  function setupShellMetrics() {
    const shell = document.getElementById('site-shell');
    if (!shell) return;
    const update = () => {
      const height = Math.ceil(shell.getBoundingClientRect?.().height || shell.offsetHeight || 0);
      if (height > 0) document.documentElement.style.setProperty('--shell-height', `${height}px`);
    };
    update();
    if (typeof ResizeObserver === 'function') {
      const observer = new ResizeObserver(update);
      observer.observe(shell);
      shell._resizeObserver = observer;
    } else {
      window.addEventListener('resize', update);
    }
  }

  function hasUsableDataBundle(data) {
    return isRecord(data) && isRecord(data.corpus) && Object.keys(data.corpus).length > 0 &&
      Array.isArray(data.corpus_manifest?.items) && Array.isArray(data.translations_matrix);
  }

  // A missing, blocked, or malformed 1.5 MB bundle used to leave a mostly blank
  // shell. Fail visibly and give readers two recovery paths without requiring
  // developer tools or assuming localStorage is available.
  function showLoadError() {
    const main = document.getElementById('main-content');
    if (!main) return;
    main.innerHTML = `
      <section class="error-boundary-card" role="alert" aria-labelledby="load-error-title">
        <p class="section-kicker">Reader unavailable</p>
        <h1 class="error-boundary-title" id="load-error-title">The text bundle did not load.</h1>
        <p class="error-boundary-text">The page shell is here, but its source-text bundle is missing or malformed. This is usually a temporary cache or network problem.</p>
        <div class="error-boundary-actions">
          <button type="button" class="btn-primary" id="load-error-retry">Reload page</button>
          <button type="button" class="btn-pill" id="load-error-reset">Reset display preferences</button>
        </div>
      </section>`;
    const retry = document.getElementById('load-error-retry');
    const reset = document.getElementById('load-error-reset');
    retry?.addEventListener('click', () => window.location.reload());
    reset?.addEventListener('click', () => {
      ['translatechan_corpus_key', 'translatechan_reader_mode', 'translatechan_show_pinyin',
       'translatechan_font_size', 'translatechan_collapsed_cases', 'translatechan_theme',
       'translatechan_name_mode', 'translatechan_hero_dismissed'].forEach(storageRemove);
      window.location.reload();
    });
  }

  // Initialize
  function init() {
    if (!hasUsableDataBundle(state.data)) {
      showLoadError();
      return;
    }
    // Initial URL state (#/view/corpus) — deep links & refresh restore position
    const m = (location.hash || '').match(/^#\/([a-z]+)(?:\/([a-z0-9_]+))?/);
    if (m && VALID_VIEWS.includes(m[1])) state.currentView = m[1];
    if (m && m[2]) setCurrentCorpusKey(m[2]);

    applyTheme(state.theme);
    loadReadingPrefs();
    applyReadingPrefs();
    syncSettingsUI();
    syncReadingUI();
    setupMargin();
    setupShellMetrics();
    document.documentElement.style.setProperty('--zh-font-size', `${state.fontSize}rem`);
    updateHeroCounts();
    setupHeroDismiss();
    populateLineageSchoolFilter();
    populateLexiconCategoryFilter();
    setupEventListeners();
    applyPinyinVisibility();
    renderCorpusList();
    renderReader();
    setActiveModeButtons();
    // Render-lazy (Checkpoint-C C-4): only the Reader renders at boot. The
    // four hidden rooms render on first tab activation; this call renders the
    // initial room when a deep link lands outside the Reader. One bundle, no
    // pipeline change — boot simply skips DOM building for rooms nobody is
    // looking at.
    switchViewRaw(state.currentView, false); // sync nav/section classes with the initial hash
    // The margin follows the sheet from the first passage onward.
    armScrollSpy();
    if (READER_PREFS.contextOn) marginFollowCurrent(true);
  }

  // L1 (audit 2026-08-10, session 019feabb): dismissable hero banner.
  // The "about" block explains the project's joke once; after that, a
  // returning reader wants the content area, not the joke. We honor a
  // session-scoped hide (localStorage key) so the choice survives
  // navigation but is easy to re-show by clearing the key. A small
  // "ⓘ" button in the header re-shows the banner when it's hidden.
  function setupHeroDismiss() {
    const banner = document.getElementById('zen-hero-banner');
    const btn = document.getElementById('hero-dismiss-btn');
    const aboutBtn = document.getElementById('about-toggle');
    if (!banner || !btn) return;
    const isDismissed = () => storageGet('translatechan_hero_dismissed') === '1';
    if (isDismissed()) {
      banner.hidden = true;
      if (aboutBtn) aboutBtn.hidden = false;
    }
    btn.addEventListener('click', () => {
      banner.hidden = true;
      storageSet('translatechan_hero_dismissed', '1');
      if (aboutBtn) aboutBtn.hidden = false;
    });
    if (aboutBtn) {
      aboutBtn.addEventListener('click', () => {
        banner.hidden = false;
        storageRemove('translatechan_hero_dismissed');
        aboutBtn.hidden = true;
        if (typeof banner.scrollIntoView === 'function') {
          banner.scrollIntoView({ behavior: motionBehavior(), block: 'start' });
        }
      });
    }
  }

  // Reader mode switching (shared by sidebar + mobile bar, persisted)
  function setReaderMode(mode) {
    if (!READER_MODES.includes(mode)) return;
    state.readerMode = mode;
    storageSet('translatechan_reader_mode', mode);
    setActiveModeButtons();
    renderReader();
  }

  function setActiveModeButtons() {
    document.querySelectorAll('[data-reader-mode]').forEach(b => {
      const on = b.getAttribute('data-reader-mode') === state.readerMode;
      if (on) b.classList.add('active'); else b.classList.remove('active');
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  // Pinyin visibility (mobile-friendly; desktop default on)
  function applyPinyinVisibility() {
    if (!elements.readerContent) return;
    elements.readerContent.dataset.showPinyin = state.showPinyin ? '1' : '0';
    const btn = document.getElementById('mobile-pinyin-btn');
    if (btn) { state.showPinyin ? btn.classList.add('active') : btn.classList.remove('active'); }
  }

  // ---- Shared glossary popover (one node, positioned; hover/focus/tap) ----
  let termPopoverEl = null;
  function getTermPopover() {
    if (!termPopoverEl) {
      termPopoverEl = document.createElement('div');
      termPopoverEl.id = 'term-popover';
      termPopoverEl.className = 'term-popover chan-popover';
      termPopoverEl.setAttribute('role', 'tooltip');
      termPopoverEl.hidden = true;
      // N8: the popover itself is interactive (scrollable); leaving it hides it.
      termPopoverEl.addEventListener('mouseleave', () => { hideTermPopover(); });
      document.body.appendChild(termPopoverEl);
    }
    return termPopoverEl;
  }
  function termById(id) {
    const list = state.data.glossary || [];
    return list.find(t => t && t.id === id) || null;
  }
  // Shared popover positioning (N8, 2026-08-09, session 019fe731): measure the
  // real rendered height (add display before calling) instead of hardcoding a
  // guess, so long citations/definitions flip cleanly above the anchor.
  //
  // Phase 3 (2026-09-13) turned the old `left`/`top` pair into ONE write of the
  // `--pop-shift` custom property, consumed as `translate` by the shared
  // .chan-popover rule in app.css. The mechanism is the one behind --shell-height
  // and --zh-font-size too: the sheet owns placement, script publishes the
  // measured number. A CSP style-src list governs style attributes and `style`
  // elements, not CSSOM writes, so the tightened policy leaves this path working
  // — see the note above the CSP meta in index.html for the full contract.
  function positionFloatingPopover(pop, anchor, popW) {
    const rect = anchor.getBoundingClientRect();
    const vw = window.innerWidth || document.documentElement.clientWidth || 900;
    const vh = window.innerHeight || 800;
    let left = Math.min(rect.left, vw - popW - 8);
    if (left < 8) left = 8;
    const height = pop.offsetHeight || 220;
    let top = rect.bottom + 8;
    if (top + height > vh - 8) top = Math.max(8, rect.top - 8 - height);
    pop.style.setProperty('--pop-shift', `${left}px ${top}px`);
  }

  function showTermPopover(termSpan) {
    if (!termSpan || typeof termSpan.getBoundingClientRect !== 'function') return;
    const t = termById(termSpan.getAttribute('data-term-id'));
    if (!t) return;
    const pop = getTermPopover();
    pop.innerHTML =
      `<div class="tooltip-term-title">${escHtml(t.term)} (${escHtml(t.pinyin || '—')})</div>` +
      `<div class="tooltip-sanskrit">Sanskrit: ${escHtml(t.sanskrit || '—')}</div>` +
      `<div class="tooltip-row"><strong>Literal:</strong> ${escHtml(t.literal || '')}</div>` +
      `<div class="tooltip-row">${escHtml(t.definition || '')}</div>`;
    pop.hidden = false; // shown first so the positioner can measure
    positionFloatingPopover(pop, termSpan, 290);
    pop._anchor = termSpan;
  }
  function hideTermPopover() {
    if (termPopoverEl) termPopoverEl.hidden = true;
  }
  function toggleTermPopover(termSpan) {
    if (termPopoverEl && !termPopoverEl.hidden &&
        termPopoverEl._anchor === termSpan) {
      hideTermPopover();
      return;
    }
    showTermPopover(termSpan);
    if (termPopoverEl) termPopoverEl._anchor = termSpan;
  }

  // ---- Robo-name real-fakeness popover (hover/focus/tap a Robo name) ----
  let roboPopoverEl = null;
  function getRoboPopover() {
    if (!roboPopoverEl) {
      roboPopoverEl = document.createElement('div');
      roboPopoverEl.id = 'robo-popover';
      roboPopoverEl.className = 'robo-popover chan-popover';
      roboPopoverEl.setAttribute('role', 'tooltip');
      roboPopoverEl.hidden = true;
      roboPopoverEl.addEventListener('mouseleave', () => { hideRoboPopover(); });
      document.body.appendChild(roboPopoverEl);
    }
    return roboPopoverEl;
  }
  function showRoboPopover(span) {
    if (!span || typeof span.getBoundingClientRect !== 'function') return;
    const key = span.getAttribute('data-robo-key');
    const p = key ? profileForKey(key) : null;
    const meta = p ? fakenessFromProfile(p) : null;
    const pop = getRoboPopover();
    if (meta) {
      const hour = meta.pending ? ' \u23f3' : '';
      pop.innerHTML =
        `<div class="tooltip-term-title">${escHtml(p.robo_name)} <span class="robo-score">\u{1F916} ${escHtml(meta.label)}${hour}</span></div>` +
        `<div class="robo-tier-row">Real-fakeness: tier ${meta.tier}/5 · ${meta.pending ? 'evidence pending' : 'evidence-backed'}</div>` +
        `<div class="tooltip-row">${escHtml(meta.blurb)}</div>` +
        (meta.wu ? `<div class="tooltip-row"><strong>Renders 無:</strong> ${escHtml(meta.wu)}</div>` : '') +
        (meta.personality ? `<div class="tooltip-row robo-personality">${escHtml(meta.personality)}</div>` : '');
    } else {
      pop.innerHTML = `<div class="tooltip-term-title">Robolation</div><div class="tooltip-row">AI text in a translator\u2019s register — not their actual words. Profile pending.</div>`;
    }
    pop.hidden = false;
    positionFloatingPopover(pop, span, 300);
    pop._anchor = span;
  }
  function hideRoboPopover() {
    if (roboPopoverEl) roboPopoverEl.hidden = true;
  }
  function toggleRoboPopover(span) {
    if (roboPopoverEl && !roboPopoverEl.hidden && roboPopoverEl._anchor === span) {
      hideRoboPopover();
      return;
    }
    showRoboPopover(span);
  }
  function setupRoboNameListeners() {
    document.addEventListener('mouseover', (e) => {
      const span = e.target && e.target.closest ? e.target.closest('.robo-name') : null;
      if (span) showRoboPopover(span);
    });
    document.addEventListener('mouseout', (e) => {
      const span = e.target && e.target.closest ? e.target.closest('.robo-name') : null;
      const intoPop = e.relatedTarget && typeof e.relatedTarget.closest === 'function' && e.relatedTarget.closest('#robo-popover');
      if (span && !span.contains(e.relatedTarget) && !intoPop) hideRoboPopover();
    });
    document.addEventListener('focusin', (e) => {
      const span = e.target && e.target.closest ? e.target.closest('.robo-name') : null;
      if (span && typeof span.matches === 'function' && span.matches(':focus-visible')) showRoboPopover(span);
    });
    document.addEventListener('focusout', (e) => {
      const span = e.target && e.target.closest ? e.target.closest('.robo-name') : null;
      if (span && !span.contains(e.relatedTarget)) hideRoboPopover();
    });
    document.addEventListener('click', (e) => {
      const span = e.target && e.target.closest ? e.target.closest('.robo-name') : null;
      if (span) { e.preventDefault(); toggleRoboPopover(span); return; }
      const insidePop = e.target && typeof e.target.closest === 'function' && e.target.closest('#robo-popover');
      if (!insidePop) hideRoboPopover();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { hideRoboPopover(); return; }
      if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.closest && e.target.closest('.robo-name')) {
        e.preventDefault();
        toggleRoboPopover(e.target.closest('.robo-name'));
      }
    });
  }

  // ---- Shared citation/disclosure popover (source + translation provenance) ----
  // Rendered citation details live in JS rather than data attributes so book/source
  // metadata stays structured and never becomes an executable HTML payload.
  let citationPopoverEl = null;
  let citationSerial = 0;
  const citationDetails = new Map();

  function registerCitation(detail) {
    const id = `citation-${++citationSerial}`;
    citationDetails.set(id, detail);
    return id;
  }

  function getCitationPopover() {
    if (!citationPopoverEl) {
      citationPopoverEl = document.createElement('div');
      citationPopoverEl.id = 'citation-popover';
      citationPopoverEl.className = 'citation-popover chan-popover';
      citationPopoverEl.setAttribute('role', 'tooltip');
      citationPopoverEl.hidden = true;
      // N8: the popover itself is interactive (scrollable); leaving it hides it.
      citationPopoverEl.addEventListener('mouseleave', () => { hideCitationPopover(); });
      document.body.appendChild(citationPopoverEl);
    }
    return citationPopoverEl;
  }

  function citationRow(label, value) {
    if (!value) return '';
    return `<div class="citation-row"><strong>${escHtml(label)}:</strong> ${escHtml(value)}</div>`;
  }

  function renderCitationTrigger(detail, label = 'ⓘ Details', className = '') {
    const id = registerCitation(detail);
    const title = detail && detail.title ? `${detail.title} — hover, focus, or tap for disclosure` : 'Hover, focus, or tap for disclosure';
    return `<button type="button" class="citation-trigger ${className}" data-citation-id="${id}" aria-label="${escHtml(title)}" title="${escHtml(title)}">${escHtml(label)}</button>`;
  }

  function showCitationPopover(trigger) {
    if (!trigger || typeof trigger.getBoundingClientRect !== 'function') return;
    const detail = citationDetails.get(trigger.getAttribute('data-citation-id'));
    if (!detail) return;
    const pop = getCitationPopover();
    const rows = Array.isArray(detail.rows) ? detail.rows : [];
    pop.innerHTML = `<div class="citation-title">${escHtml(detail.title || 'Citation & disclosure')}</div>` +
      rows.map(row => citationRow(row[0], row[1])).join('');
    pop.hidden = false; // shown first so the positioner can measure
    positionFloatingPopover(pop, trigger, 340);
    pop._anchor = trigger;
  }

  function hideCitationPopover() {
    if (citationPopoverEl) citationPopoverEl.hidden = true;
  }

  function toggleCitationPopover(trigger) {
    if (citationPopoverEl && !citationPopoverEl.hidden && citationPopoverEl._anchor === trigger) {
      hideCitationPopover();
      return;
    }
    showCitationPopover(trigger);
  }

  function setupCitationPopoverListeners() {
    document.addEventListener('mouseover', (e) => {
      const trigger = e.target && e.target.closest ? e.target.closest('.citation-trigger') : null;
      if (trigger) showCitationPopover(trigger);
    });
    document.addEventListener('mouseout', (e) => {
      const trigger = e.target && e.target.closest ? e.target.closest('.citation-trigger') : null;
      // N8: keep the popover alive when the pointer moves INTO it (scrollable content)
      const intoPop = e.relatedTarget && typeof e.relatedTarget.closest === 'function' && e.relatedTarget.closest('#citation-popover');
      if (trigger && !trigger.contains(e.relatedTarget) && !intoPop) hideCitationPopover();
    });
    document.addEventListener('focusin', (e) => {
      const trigger = e.target && e.target.closest ? e.target.closest('.citation-trigger') : null;
      if (trigger) showCitationPopover(trigger);
    });
    document.addEventListener('focusout', (e) => {
      const trigger = e.target && e.target.closest ? e.target.closest('.citation-trigger') : null;
      if (trigger && !trigger.contains(e.relatedTarget)) hideCitationPopover();
    });
    document.addEventListener('click', (e) => {
      const trigger = e.target && e.target.closest ? e.target.closest('.citation-trigger') : null;
      if (trigger) {
        e.preventDefault();
        toggleCitationPopover(trigger);
        return;
      }
      // N8: a tap/click outside the trigger and the popover dismisses it (touch)
      const insidePop = e.target && typeof e.target.closest === 'function' && e.target.closest('#citation-popover');
      if (!insidePop) hideCitationPopover();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') hideCitationPopover();
    });
  }

  // ---- Collapsible case cards (touch defaults to collapsed) ----
  // collapsedCases[corpusKey] = { caseNum: true|false } — explicit user choices
  // only; unlisted cases fall back to the device default (collapsed on touch).
  function caseCollapsedKey() { return state.currentCorpusKey; }
  function caseCollapsedState(num, fallback) {
    const m = state.collapsedCases[caseCollapsedKey()];
    return (m && typeof m === 'object' && num in m) ? !!m[num] : !!fallback;
  }
  function setCaseCollapsed(num, collapsed) {
    const key = caseCollapsedKey();
    if (!state.collapsedCases || typeof state.collapsedCases !== 'object' || Array.isArray(state.collapsedCases)) {
      state.collapsedCases = {};
    }
    let m = state.collapsedCases[key];
    if (!m || typeof m !== 'object' || Array.isArray(m)) m = {};
    m[num] = !!collapsed;
    state.collapsedCases[key] = m;
    storageSet('translatechan_collapsed_cases', JSON.stringify(state.collapsedCases));
  }
  function toggleCase(toggleBtn) {
    const card = toggleBtn.closest ? toggleBtn.closest('.case-card') : null;
    if (!card) return;
    const num = parseInt(toggleBtn.getAttribute('data-case-toggle'), 10);
    const collapsed = !card.classList.contains('collapsed');
    card.classList.toggle('collapsed', collapsed);
    toggleBtn.textContent = collapsed ? '＋' : '−';
    toggleBtn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    if (!Number.isNaN(num)) setCaseCollapsed(num, collapsed);
  }
  function expandCase(num) {
    const el = document.getElementById(`case-${num}`);
    if (!el) return;
    el.classList.remove('collapsed');
    const toggle = el.querySelector('.case-toggle');
    if (toggle) { toggle.textContent = '−'; toggle.setAttribute('aria-expanded', 'true'); }
    if (!Number.isNaN(num)) setCaseCollapsed(num, false);
  }

  // Theme Management
  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    storageSet('translatechan_theme', theme);
    if (elements.themeToggle) {
      elements.themeToggle.innerHTML = theme === 'dark' ? '<span aria-hidden="true">☀</span>' : '<span aria-hidden="true">☾</span>';
    }
  }



  // ==========================================================================
  //  THE MARGIN — the built-in wiki
  // --------------------------------------------------------------------------
  //  The hall used to be five rooms that never spoke to each other: a Reader, a
  //  Matrix, a Lineage tree, a case index and a dictionary — the same master,
  //  the same case and the same term written five times in five vocabularies,
  //  with thirty-six layout demonstrations piled on top (removed 2026-09-19).
  //
  //  This block is the recomposition. One index of entities is built from the
  //  deterministic bundle (masters, works, terms, cases, registers); an
  //  annotator turns the names inside the text into doors; and one margin rail
  //  renders the record of whatever the reader is looking at. The margin IS the
  //  dossier panel (#master-dossier-panel), so a master, a term, a case card and
  //  a work's provenance all open in the same place, one gesture from the
  //  passage. Nothing here invents content: every string comes from data/, and
  //  every disclosure the rooms already printed is still printed — quieter, in
  //  one voice, beside the text it describes.
  // ==========================================================================

  const WIKI_LABEL = { master: 'Master', work: 'Work', term: 'Term', case: 'Case', register: 'Register', edge: 'Lineage link' };
  const FRONTIER_NOTE = 'Not profiled in this project; the record stays with the frontier list in data/lineage/profile_review_queue.json.';
  const glossaryList = () => (Array.isArray(state.data.glossary) ? state.data.glossary : []);
  const lineageList = () => (Array.isArray(state.data.lineage) ? state.data.lineage : []);
  const gonganList = () => (Array.isArray(state.data.gongan_index) ? state.data.gongan_index : []);

  // ---- folded matching ------------------------------------------------------
  // English needles are tone-marked (Zhàozhōu, Sēngcàn) while prose is not, so
  // both sides fold through normalizeForSearch. The fold map turns a folded
  // offset back into a raw one, so a span never cuts a combining mark in half.
  const foldMapCache = new Map();
  function foldMap(text) {
    const cached = foldMapCache.get(text);
    if (cached) return cached;
    const offsets = [];
    const chars = [];
    for (let i = 0; i < text.length; i += 1) {
      const folded = normalizeForSearch(text[i]);
      for (let j = 0; j < folded.length; j += 1) { chars.push(folded[j]); offsets.push(i); }
    }
    const map = { folded: chars.join(''), offsets };
    if (foldMapCache.size > 6000) foldMapCache.clear();
    foldMapCache.set(text, map);
    return map;
  }

  // ---- the entity index ------------------------------------------------------
  let wikiIndex = null;

  function wikiEnsure() {
    if (wikiIndex) return wikiIndex;
    const entities = new Map();
    const zhNeedles = [];
    const enNeedles = [];

    const add = (kind, id, record) => {
      if (!id) return null;
      const key = `${kind}:${id}`;
      if (entities.has(key)) return key;
      entities.set(key, Object.assign({ kind, id, key }, record || {}));
      return key;
    };
    const push = (list, needle, key, minLength, once) => {
      const text = stringValue(needle).trim();
      if (!text || !key) return;
      if (minLength && text.length < minLength) return;
      list.push({ needle: text, key, once: !!once });
    };

    lineageList().forEach(m => {
      if (!isRecord(m) || !m.id) return;
      const key = add('master', m.id, {
        name_zh: m.name_zh, name_en: m.name_en, name_pinyin: m.name_pinyin, name_romaji: m.name_romaji,
        title: m.title, dates: m.dates, era: m.era, school: m.school, school_key: m.school_key,
        location: m.location, summary: m.summary, cbeta_id: m.cbeta_id, profile_status: m.profile_status
      });
      const zhName = stringValue(m.name_zh);
      push(zhNeedles, zhName, key, 2);
      // Names are often written bare (僧璨) rather than with the patriarchal
      // prefix (三祖僧璨), so the given name is a needle too.
      if (zhName.length >= 3) push(zhNeedles, zhName.slice(-2), key, 2);
      [m.name_pinyin, m.name_romaji, m.name_en].forEach(form => {
        push(enNeedles, stringValue(form).replace(/\s*\(.*?\)\s*/g, '').trim(), key, 4);
      });
      (Array.isArray(m.alternative_names) ? m.alternative_names : []).forEach(alt => {
        const value = stringValue(alt);
        const han = value.match(/[㐀-鿿]{2,}/g);
        if (han) han.forEach(part => push(zhNeedles, part, key, 2));
        const latin = value.replace(/[㐀-鿿]{2,}/g, ' ').replace(/\s*\/\s*/g, ' ')
          .replace(/[^A-Za-z .-]/g, ' ').replace(/\s+/g, ' ').trim();
        latin.split(',').forEach(part => push(enNeedles, part.trim(), key, 6));
      });
    });

    const manifestItems = (state.data.corpus_manifest && Array.isArray(state.data.corpus_manifest.items))
      ? state.data.corpus_manifest.items : [];
    manifestItems.forEach(item => {
      if (!isRecord(item) || !item.key || !state.data.corpus || !state.data.corpus[item.key]) return;
      const doc = state.data.corpus[item.key] || {};
      const key = add('work', item.key, {
        title: item.title, title_en: doc.title_en, title_zh: doc.title_zh, title_pinyin: doc.title_pinyin,
        cbeta: item.cbeta, author_en: doc.author_en, era: doc.era, genre: doc.genre
      });
      push(zhNeedles, doc.title_zh, key, 3);
      push(enNeedles, stringValue(doc.title_en).replace(/\s*\(.*?\)\s*/g, '').trim(), key, 7, true);
    });

    glossaryList().forEach(t => {
      if (!isRecord(t) || !t.id || !t.term) return;
      const key = add('term', t.id, {
        term: t.term, pinyin: t.pinyin, literal: t.literal, sanskrit: t.sanskrit,
        category: t.category, definition: t.definition, occurrences: t.occurrences
      });
      push(zhNeedles, t.term, key, 1);
      const py = stringValue(t.pinyin).split(/[(/,]/)[0].trim();
      if (py.length >= 4) push(enNeedles, py, key, 4, true);
      push(enNeedles, t.literal, key, 6, true);
    });

    gonganList().forEach(g => {
      if (!isRecord(g) || !g.id) return;
      const key = add('case', g.id, {
        case_no: g.case_no, title_zh: g.title_zh, title_en: g.title_en, collection: g.collection,
        theme_group: g.theme_group, theme: g.theme, protagonist: g.protagonist,
        cbeta_id: g.cbeta_id, summary: g.summary, cross_refs: g.cross_refs
      });
      push(zhNeedles, g.title_zh, key, 3);
      push(enNeedles, stringValue(g.title_en).replace(/\s*\(.*?\)\s*/g, '').trim(), key, 9, true);
    });

    profileList().forEach(p => {
      if (!isRecord(p) || !p.register_key) return;
      const key = add('register', p.register_key, {
        translator: p.translator, robo_name: p.robo_name, evidence_source: p.evidence_source,
        verified_sample_count: p.verified_sample_count
      });
      push(enNeedles, p.robo_name, key, 5, true);
    });

    const dedupe = list => {
      const seen = new Set();
      const out = [];
      list.forEach(entry => {
        const id = `${entry.needle}|${entry.key}`;
        if (seen.has(id)) return;
        seen.add(id);
        out.push(entry);
      });
      out.sort((a, b) => b.needle.length - a.needle.length);
      return out;
    };

    const byProtagonist = new Map();
    gonganList().forEach(g => {
      if (!g || !g.protagonist) return;
      if (!byProtagonist.has(g.protagonist)) byProtagonist.set(g.protagonist, []);
      byProtagonist.get(g.protagonist).push(g);
    });

    wikiIndex = { entities, zh: dedupe(zhNeedles), en: dedupe(enNeedles), byProtagonist };
    return wikiIndex;
  }

  function wikiGet(key) {
    const value = stringValue(key);
    if (!value || value.indexOf(':') === -1) return null;
    return wikiEnsure().entities.get(value) || null;
  }

  // Master names follow the reader's romanization choice (pinyin ↔ rōmaji), the
  // same preference the lineage register honours.
  function masterRomanization(master) {
    if (!master) return '';
    if (state.nameMode === 'romaji' && master.name_romaji) return master.name_romaji;
    return stringValue(master.name_pinyin || master.name_en || master.id);
  }

  function entityLabel(entity) {
    if (!entity) return 'Record';
    switch (entity.kind) {
      case 'master': return `${stringValue(entity.name_zh)} · ${masterRomanization(entity)}`;
      case 'work': return stringValue(entity.title_en || entity.title || entity.id);
      case 'term': return `${stringValue(entity.term)} · ${stringValue(entity.literal || entity.pinyin || '')}`.trim();
      case 'case': return `Case ${stringValue(entity.case_no)} · ${stringValue(entity.title_en || entity.title_zh || '')}`;
      case 'register': return stringValue(entity.robo_name || entity.translator || entity.id);
      default: return stringValue(entity.id);
    }
  }

  // A gong'an protagonist id is a data-side label and the lineage registry keys
  // masters its own way (huangbo vs huangbo_xiyun). Resolve by exact id, then by
  // the leading token — never by a fuzzy guess.
  function masterForLabel(label) {
    const value = stringValue(label).trim();
    if (!value) return null;
    const masters = lineageList();
    const exact = masters.find(m => m && (m.id === value || m.name_zh === value || m.name_en === value));
    if (exact) return exact;
    const head = value.toLowerCase().replace(/[^a-z0-9]+/g, '_').split('_')[0];
    if (head.length < 4) return null;
    return masters.find(m => m && String(m.id).toLowerCase().split('_')[0] === head) || null;
  }

  // ---- the annotator --------------------------------------------------------
  // One matcher for both languages: gather every needle occurrence, prefer the
  // longest needle at a position, never overlap, escape everything else. The
  // glossary side keeps its historical class (.term-highlight + data-term-id)
  // because the popover and keyboard paths are bound to it; every other entity
  // gets .wiki-link. English prose links once per block — a wall of links is a
  // maze, not a wiki.
  function markEntities(text, mode) {
    const source = stringValue(text);
    if (!source) return '';
    const index = wikiEnsure();
    const needles = mode === 'zh' ? index.zh : index.en;
    if (!needles.length) return escHtml(source);
    const folded = mode === 'en' ? foldMap(source) : null;
    const hits = [];
    const claimed = [];
    const usedOnce = new Set();

    const overlaps = (from, to) => claimed.some(span => from < span[1] && to > span[0]);
    const claim = (from, to) => { claimed.push([from, to]); };

    needles.forEach(entry => {
      const needleFolded = mode === 'en' ? normalizeForSearch(entry.needle) : '';
      if (mode === 'en' && (!needleFolded || folded.folded.indexOf(needleFolded) === -1)) return;
      if (mode === 'zh' && source.indexOf(entry.needle) === -1) return;
      let searchFrom = 0;
      let guard = 0;
      while (guard < 40) {
        guard += 1;
        let at;
        let end;
        if (mode === 'zh') {
          at = source.indexOf(entry.needle, searchFrom);
          if (at === -1) break;
          end = at + entry.needle.length;
        } else {
          const foldedAt = folded.folded.indexOf(needleFolded, searchFrom);
          if (foldedAt === -1) break;
          at = folded.offsets[foldedAt];
          const after = foldedAt + needleFolded.length;
          end = after < folded.offsets.length ? folded.offsets[after] : source.length;
          searchFrom = foldedAt + needleFolded.length;
          // Word boundary: "Mu" must not bite the middle of "museum".
          const before = at > 0 ? source[at - 1] : ' ';
          const next = end < source.length ? source[end] : ' ';
          if (/[A-Za-z0-9]/.test(before) || /[A-Za-z0-9]/.test(next)) continue;
        }
        if (usedOnce.has(entry.key)) { if (mode === 'zh') searchFrom = end; continue; }
        if (overlaps(at, end)) { if (mode === 'zh') searchFrom = end; continue; }
        usedOnce.add(entry.key);
        claim(at, end);
        hits.push({ start: at, end, key: entry.key });
        if (mode === 'zh') searchFrom = end;
      }
    });

    if (!hits.length) return escHtml(source);
    // Restraint: a word gets one door per passage in either language, and the
    // Chinese sheet never turns into a wall of dotted rules. Needles are matched
    // longest-first, so if the ceiling bites it is the shortest, least specific
    // marks that fall away — the text is never rewritten to achieve this.
    if (mode === 'zh' && hits.length > MAX_DOORS_PER_BLOCK) hits.length = MAX_DOORS_PER_BLOCK;
    hits.sort((a, b) => a.start - b.start);
    let out = '';
    let cursor = 0;
    hits.forEach(hit => {
      if (hit.start < cursor) return;
      out += escHtml(source.slice(cursor, hit.start));
      const entity = index.entities.get(hit.key);
      const kind = entity ? entity.kind : hit.key.split(':')[0];
      const label = entity ? entityLabel(entity) : hit.key;
      const cls = kind === 'term' ? 'term-highlight wiki-link wiki-link-term' : `wiki-link wiki-link-${kind}`;
      const attrs = kind === 'term' && entity && entity.id ? ` data-term-id="${escHtml(entity.id)}"` : '';
      out += `<span class="${cls}"${attrs} data-wiki="${escHtml(hit.key)}" tabindex="0" role="link"`
        + ` aria-label="${escHtml(`${label} — open the record in the margin`)}" title="${escHtml(label)}">`
        + `${escHtml(source.slice(hit.start, hit.end))}</span>`;
      cursor = hit.end;
    });
    out += escHtml(source.slice(cursor));
    return out;
  }

  // Source Chinese: terms and master names at every occurrence — the reader is
  // looking at the Chinese, so the door belongs where the word is. English: the
  // first occurrence of each entity per block only.
  // A ceiling, not a quota: about one door per sixteen characters of source.
  const MAX_DOORS_PER_BLOCK = 6;

  function annotateSourceText(text) { return markEntities(text, 'zh'); }
  function annotateEnglishProse(text) { return markEntities(text, 'en'); }

  // ---- the margin rail ------------------------------------------------------
  const margin = { mode: 'follow', key: null, history: [], future: [], currentUnit: null };

  function marginOpen() {
    const panel = document.getElementById('master-dossier-panel');
    if (!panel) return;
    panel.hidden = false;
    panel.removeAttribute('hidden');
    document.documentElement.setAttribute('data-margin', 'open');
    const toggle = document.getElementById('context-toggle');
    if (toggle && typeof toggle.setAttribute === 'function') toggle.setAttribute('aria-expanded', 'true');
  }

  function marginClose() {
    const panel = document.getElementById('master-dossier-panel');
    if (!panel) return;
    panel.hidden = true;
    panel.setAttribute('hidden', '');
    document.documentElement.setAttribute('data-margin', 'closed');
    const toggle = document.getElementById('context-toggle');
    if (toggle && typeof toggle.setAttribute === 'function') toggle.setAttribute('aria-expanded', 'false');
  }

  // Dossier atoms. Every record is a lede in plain language, the ledger, then
  // the doors out of it — so learning one teaches all five kinds.
  function dossierSection(title, body, note) {
    if (!body) return '';
    return `<section class="dossier-section"><h3 class="dossier-section-head">${escHtml(title)}</h3>${body}`
      + `${note ? `<p class="dossier-section-note">${escHtml(note)}</p>` : ''}</section>`;
  }
  function dossierRows(rows) {
    const body = rows.filter(row => Array.isArray(row) && row[1] !== '' && row[1] != null)
      .map(([label, value]) => `<div class="dossier-row"><span class="dossier-row-label">${escHtml(label)}</span>`
        + `<span class="dossier-row-value">${value}</span></div>`).join('');
    return body ? `<div class="dossier-rows">${body}</div>` : '';
  }
  function dossierText(value) { return escHtml(stringValue(value)); }
  function dossierCode(value) {
    const text = stringValue(value);
    return text ? `<code class="dossier-code">${escHtml(text)}</code>` : '';
  }
  function dossierChips(items) {
    const kept = items.filter(Boolean);
    return kept.length ? `<div class="dossier-chips">${kept.join('')}</div>` : '';
  }
  function dossierList(items) {
    return items.length ? `<ul class="dossier-list">${items.map(item => `<li>${dossierText(item)}</li>`).join('')}</ul>` : '';
  }
  function wikiButton(kind, id, label) {
    const entity = wikiGet(`${kind}:${id}`);
    const title = entity ? entityLabel(entity) : stringValue(label);
    return `<button type="button" class="btn-pill wiki-jump" data-wiki-open="${escHtml(`${kind}:${id}`)}`
      + `" title="${escHtml(`${title} — open in the margin`)}">`
      + `<span class="wiki-jump-kind" aria-hidden="true">${escHtml(WIKI_LABEL[kind] || '')}</span>`
      + `<span class="wiki-jump-label">${escHtml(stringValue(label) || title)}</span></button>`;
  }
  function docButton(corpusKey, label) {
    const item = manifestItemForCorpusKey(corpusKey);
    const title = stringValue(label) || (item ? stringValue(item.title) : corpusKey);
    return `<button type="button" class="btn-pill doc-jump" data-open-doc="${escHtml(corpusKey)}">${escHtml(title)}</button>`;
  }
  function itemLabel(corpusKey) {
    const item = manifestItemForCorpusKey(corpusKey);
    return item ? stringValue(item.title) : 'No work open';
  }
  function metricsPerText(corpusKey) {
    const metrics = state.data.project_metrics;
    return (metrics && metrics.corpus && metrics.corpus.per_text && metrics.corpus.per_text[corpusKey]) || {};
  }

  // ---- one master's record --------------------------------------------------
  function renderMasterDossierBody(masterId) {
    const master = lineageList().find(m => m && m.id === masterId);
    if (!master) return '';
    const masters = lineageList();
    const teacher = masters.find(m => m && m.id === master.teacher);
    const edge = master.teacher ? lineageEdgeRecord(master.teacher, master.id) : null;
    const edgeMeta = edge ? lineageStatusMeta(edge.status) : null;
    const edgeSource = edge ? lineageSourceRecord(edge.source_id) : null;
    const disciples = (Array.isArray(master.disciples) ? master.disciples : [])
      .map(id => masters.find(m => m && m.id === id)).filter(Boolean);
    const cases = (wikiEnsure().byProtagonist.get(master.id) || []).slice(0, 12);
    const works = (Array.isArray(master.linked_corpus_keys) ? master.linked_corpus_keys : [])
      .filter(key => state.data.corpus && state.data.corpus[key]);
    const schoolEntry = ((((state.data.lineage_school_vocab || {}).schools) || []).find(s => s && s.key === master.school_key));
    const texts = Array.isArray(master.texts) ? master.texts : [];
    const evidence = isRecord(master.profile_evidence) ? master.profile_evidence : {};

    const lede = `<p class="dossier-lede">${annotateEnglishProse(stringValue(master.summary)
      || 'No biographical summary has been recorded for this master in this project yet.')}</p>`
      + `<p class="dossier-tagline">${dossierText(master.dates)} · ${dossierText(master.era)} · `
      + `${dossierText(master.location)} · generation ${dossierText(master.lineage_depth)}</p>`;

    const quote = master.key_quote_zh
      ? `<figure class="dossier-quote"><blockquote class="dossier-quote-zh" lang="zh">${annotateSourceText(master.key_quote_zh)}</blockquote>`
        + (master.key_quote_en ? `<figcaption class="dossier-quote-en">${annotateEnglishProse(master.key_quote_en)}</figcaption>` : '')
        + '</figure>' : '';

    const transmission = dossierRows([
      ['Teacher', teacher
        ? `${wikiButton('master', teacher.id, masterDisplayName(teacher))}`
          + (edgeMeta ? `<span class="dossier-inline-status ${edgeMeta.className}">${dossierText(edgeMeta.label)}</span>` : '')
        : `<span>${dossierText(stringValue(master.teacher) || 'Frontier — teacher not profiled here')}</span>`],
      ['Disciples profiled here', disciples.length
        ? dossierChips(disciples.map(d => wikiButton('master', d.id, masterDisplayName(d))))
        : '<span>No profiled disciple in this project.</span>'],
      ['House', schoolEntry
        ? `<span class="school-tag" data-school="${dossierText(schoolEntry.key)}">${dossierText(schoolEntry.display)}</span>`
        : `<span>${dossierText(master.school)}</span>`]
    ]);
    const edgeNote = edge && edgeMeta
      ? `<p class="dossier-edge ${edgeMeta.className}"><strong>${dossierText(edgeMeta.label)}</strong> · `
        + `${dossierText(stringValue(edge.reference) || 'No reference recorded.')}`
        + `${edgeSource ? ` · ${dossierText(edgeSource.title)} (${dossierText(edgeSource.canonical_id)})` : ''}`
        + ` — ${dossierText(stringValue(edge.note) || 'Do not treat this displayed link as source-verified.')}</p>`
      : '';

    const profileDetail = {
      title: 'Master profile source disclosure',
      rows: [
        ['Master', `${stringValue(master.name_zh)} / ${stringValue(master.name_en)}`],
        ['Canonical record', stringValue(master.cbeta_id) || 'Locator pending'],
        ['Profile status', stringValue(master.profile_status) || 'Seed profile — exact biographical/source locator pending'],
        ['Evidence note', stringValue(evidence.note) || 'No evidence note recorded.']
      ]
    };

    return lede + quote
      + dossierSection('Transmission', transmission + edgeNote,
        'A traditional link is not a verified one: the status above is the record in data/lineage/lineage_verification.json.')
      + dossierSection('Works in this project', renderMasterWorkLinks(master),
        'Only works the project actually carries are linked; the record above names the rest.')
      + dossierSection('Cases naming this master', cases.length
        ? dossierChips(cases.map(g => wikiButton('case', g.id, `Case ${g.case_no} · ${stringValue(g.title_en || g.title_zh)}`)))
        : '<p class="dossier-empty">The case index names no record with this master as protagonist.</p>')
      + dossierSection('The record', dossierRows([
        ['Name in English', dossierText(master.name_en) || 'not recorded'],
        ['Title', dossierText(master.title) || 'not recorded'],
        ['Canonical record', dossierCode(master.cbeta_id) || 'not recorded'],
        ['Primary texts', texts.length ? texts.map(dossierText).join(' · ') : 'Transmission records pending'],
        ['Names on record', (Array.isArray(master.alternative_names) && master.alternative_names.length)
          ? master.alternative_names.map(dossierText).join(' · ') : 'Alternative names not yet reviewed'],
        ['Profile status', master.profile_status || 'Seed profile — exact biographical/source locator pending'],
        ['Evidence', `${stringValue(evidence.status) || 'not recorded'} — ${stringValue(evidence.note) || 'No evidence note recorded.'}`]
      ]) + renderCitationTrigger(profileDetail, 'ⓘ Profile source'),
        'Where this profile came from, stated plainly: this project’s own record of a seed profile is not a scholarly edition.')
      + renderTeacherContext(master);
  }

  // ---- one work's record ----------------------------------------------------
  // Where a glossary term actually occurs in the works this project carries,
  // counted from the shipped Chinese — never from the occurrence citations, which
  // name canonical locators that may sit outside the current excerpt.
  function termHitsInDocument(corpusKey) {
    const doc = state.data.corpus && state.data.corpus[corpusKey];
    if (!doc) return [];
    const haystack = JSON.stringify(doc);
    return glossaryList()
      .map(t => {
        if (!t || !t.term || !t.id || t.term.length < 2) return null;
        let count = 0;
        let at = haystack.indexOf(t.term);
        while (at !== -1 && count < 400) { count += 1; at = haystack.indexOf(t.term, at + t.term.length); }
        return count ? { id: t.id, count } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.count - a.count);
  }

  function renderWorkDossierBody(corpusKey) {
    const doc = state.data.corpus && state.data.corpus[corpusKey];
    if (!doc) return '';
    const perText = metricsPerText(corpusKey);
    const review = sourceReviewForCorpusKey(corpusKey);
    const related = relatedTeachersForCorpusKey(corpusKey);
    const counts = isRecord(perText.unit_counts) ? perText.unit_counts : {};
    const collectionHint = stringValue(doc.title_zh).slice(0, 3);
    const cases = collectionHint
      ? gonganList().filter(g => stringValue(g.collection).indexOf(collectionHint) !== -1) : [];
    const termHits = termHitsInDocument(corpusKey);
    const completion = stringValue(perText.completion_status) || 'excerpt_seed';
    const compatible = isCompletionSourceReviewCompatible(completion, review.status);
    const firstCase = Array.isArray(doc.cases) && doc.cases.length ? doc.cases[0] : null;

    return `<p class="dossier-titles"><span class="dossier-title-zh" lang="zh">${dossierText(doc.title_zh)}</span>`
      + `<span class="dossier-title-pinyin">${dossierText(doc.title_pinyin)}</span></p>`
      + `<p class="dossier-lede">${annotateEnglishProse(stringValue(doc.author_en) || 'Compiler not recorded.')} · `
      + `${dossierText(doc.era)} · ${dossierText(doc.genre)}</p>`
      + `<p class="dossier-coverage"><span class="dossier-coverage-number">${dossierText(stringValue(perText.coverage) || 'units not declared')}</span>`
      + `<span class="dossier-coverage-label">${compatible ? dossierText(completion) : 'Completion/status conflict — validation required'}</span>`
      + `<span class="ledger-status ledger-status-${review.status || 'missing'}">${dossierText(sourceReviewStatusLabel(review.status))}</span></p>`
      + dossierSection('Open the text', `<div class="dossier-open-row">${docButton(corpusKey,
        firstCase ? `Begin at case ${firstCase.case_num}` : 'Read this work')}</div>`)
      + dossierSection('What is held here', dossierRows([
        ['Units present', Object.keys(counts).length
          ? Object.keys(counts).map(name => `${counts[name]} ${dossierText(String(name).replace(/_/g, ' '))}`).join(' · ')
          : 'No unit containers in this document'],
        ['Canonical id', dossierCode(doc.cbeta_id) || 'not recorded'],
        ['Locator', (locatorDocumentForKey(corpusKey) || {}).canonical_locator || 'Locator pending'],
        ['Source review', `${dossierText(sourceReviewStatusLabel(review.status))} ${dossierCode(review.status || 'missing')}`],
        ['Reading note', doc.coverage_note || 'Excerpt-scale seed: the full canonical text is not yet ingested.']
      ]), 'Representation counts what this project carries. It is not a collation verdict and never a completeness claim.')
      + dossierSection('Masters linked to this work', related.length
        ? dossierChips(related.map(m => wikiButton('master', m.id, masterDisplayName(m))))
        : '<p class="dossier-empty">No profiled master is linked to this work yet.</p>')
      + dossierSection('Cases indexed from this collection', cases.length
        ? dossierChips(cases.slice(0, 12).map(g => wikiButton('case', g.id, `Case ${g.case_no} · ${stringValue(g.title_en)}`)))
        : '<p class="dossier-empty">The case index names no entry from this collection.</p>')
      + dossierSection('Glossary terms in this text', termHits.length
        ? dossierChips(termHits.slice(0, 10).map(hit => {
            const entry = termById(hit.id);
            return wikiButton('term', hit.id, `${entry && entry.term ? entry.term : hit.id} · ${hit.count}`);
          }))
        : '<p class="dossier-empty">No glossary term of this project occurs in the Chinese held here.</p>')
      + renderProvenanceNotes(doc)
      + renderWorkContext(corpusKey);
  }

  // ---- one term's record ----------------------------------------------------
  function renderTermDossierBody(termId) {
    const term = termById(termId);
    if (!term) return '';
    const occurrences = Array.isArray(term.occurrences) ? term.occurrences : [];
    const hits = Object.keys(state.data.corpus || {})
      .map(key => {
        const found = termHitsInDocument(key).filter(hit => hit.id === termId)[0];
        return found ? { key, count: found.count } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.count - a.count);
    const caseLinks = gonganList().filter(g => term.term && stringValue(g.summary).indexOf(term.term) !== -1);

    return `<p class="dossier-reading">${dossierText(term.pinyin)}`
      + `${term.sanskrit ? ` · Sanskrit ${dossierText(term.sanskrit)}` : ''}`
      + `${term.category ? ` · ${dossierText(term.category)}` : ''}</p>`
      + `<p class="dossier-literal">${dossierText(term.literal)}</p>`
      + dossierSection('What it means', `<p class="dossier-lede">${annotateEnglishProse(stringValue(term.definition))}</p>`)
      + dossierSection('Where it turns up in the works you can read', hits.length
        ? dossierChips(hits.slice(0, 8).map(hit => docButton(hit.key, `${itemLabel(hit.key)} · ${hit.count}`)))
        : '<p class="dossier-empty">Not in any work this project carries yet — the citations below name the canon, not the excerpt.</p>',
        'Counted from the Chinese actually held in the bundle.')
      + dossierSection('Cases whose précis uses it', caseLinks.length
        ? dossierChips(caseLinks.slice(0, 6).map(g => wikiButton('case', g.id, `Case ${g.case_no} · ${stringValue(g.title_en)}`))) : '')
      + dossierSection('Canonical citations', occurrences.length
        ? dossierList(occurrences)
        : '<p class="dossier-empty">No canonical citation recorded for this term.</p>',
        'A citation names where the term is attested in the canon; it is not a claim that the wording was checked here.');
  }

  // ---- one case's record ----------------------------------------------------
  function renderCaseDossierBody(caseId) {
    const entry = gonganList().find(g => g && g.id === caseId);
    if (!entry) return '';
    const protagonist = masterForLabel(entry.protagonist);
    const cross = Array.isArray(entry.cross_refs) ? entry.cross_refs : [];
    const collection = stringValue(entry.collection);
    const corpusKey = /碧巖|biyanlu/i.test(collection) ? 'biyanlu_cases'
      : (/無門關|wumenguan/i.test(collection) ? 'wumenguan' : '');
    const doc = corpusKey && state.data.corpus ? state.data.corpus[corpusKey] : null;
    const target = doc && Array.isArray(doc.cases)
      ? doc.cases.find(c => String(c.case_num) === String(entry.case_no)) : null;
    const locatorDoc = corpusKey ? locatorDocumentForKey(corpusKey) : null;
    const caseLocator = locatorDoc && isRecord(locatorDoc.case_locators)
      ? locatorDoc.case_locators[String(entry.case_no)] : null;

    const doors = `<div class="dossier-open-row">`
      + (target ? `<button type="button" class="btn-primary case-open" data-open-case="${escHtml(corpusKey)}`
        + `" data-case-num="${escHtml(entry.case_no)}">Read case ${dossierText(entry.case_no)} in the sheet</button>` : '')
      + (corpusKey && !target ? docButton(corpusKey, 'Open the collection') : '')
      + (!corpusKey ? '<p class="dossier-empty">This collection is not in the reading room yet.</p>' : '')
      + '</div>';

    return `<p class="dossier-caseno">Case ${dossierText(entry.case_no)} · ${dossierText(collection)}</p>`
      + `<p class="dossier-titles"><span class="dossier-title-zh" lang="zh">${dossierText(entry.title_zh)}</span></p>`
      + `<p class="dossier-title-en">${dossierText(entry.title_en)}</p>`
      + `<p class="dossier-lede">${annotateEnglishProse(stringValue(entry.summary))}</p>`
      + doors
      + dossierSection('The record', dossierRows([
        ['Protagonist', protagonist ? wikiButton('master', protagonist.id, masterDisplayName(protagonist))
          : `<span>${dossierText(entry.protagonist || 'not recorded')} — ${FRONTIER_NOTE}</span>`],
        ['Theme group', dossierText(gonganGroupDisplay(stringValue(entry.theme_group)))],
        ['Theme', dossierText(entry.theme)],
        ['Canonical record', dossierCode(entry.cbeta_id) || 'not recorded'],
        ['In the Reader', target ? dossierText(target.title_en) : 'not represented in the current excerpt']
      ]))
      + dossierSection('Cross-references', cross.length ? dossierChips(cross.map(ref => {
          const words = stringValue(ref).toLowerCase().split(/\s+/).filter(word => word.length > 3);
          if (!words.length) return `<span class="dossier-ref">${dossierText(ref)}</span>`;
          const match = (((state.data.corpus_manifest || {}).items) || []).find(it => {
            const title = stringValue(it.title).toLowerCase();
            return words.every(word => title.indexOf(word.slice(0, Math.max(4, word.length - 2))) !== -1);
          });
          return match ? docButton(match.key, ref) : `<span class="dossier-ref">${dossierText(ref)}</span>`;
        })) : '',
        'Only the cross-references that name a work held here are clickable.')
      + (caseLocator && locatorDoc
        ? renderSourceLocationDisclosure(Object.assign({}, locatorDoc, {
            canonical_locator: caseLocator.canonical_locator, granularity: 'case', status: caseLocator.status
          }), 'Case source', 'dossier-locator') : '');
  }

  // ---- one register's record (the twenty-one voices) ------------------------
  function countRegisterSlots(registerKey) {
    let total = 0;
    let verified = 0;
    Object.keys(state.data.corpus || {}).forEach(key => {
      documentTranslationSlots(state.data.corpus[key], key).forEach(slot => {
        if (slot.translator !== registerKey) return;
        total += 1;
        if (slot.status === 'verified_quotation') verified += 1;
      });
    });
    return { total, verified };
  }

  function fakenessMeterHtml(meta) {
    if (!meta) return '';
    return `<div class="fakeness-meter" role="img" aria-label="Real-fakeness tier ${meta.tier} of 5${meta.pending ? ', evidence pending' : ''}">`
      + `<span class="fakeness-bars" aria-hidden="true">`
      + [1, 2, 3, 4, 5].map(step => `<i class="fakeness-bar${step <= meta.tier ? ' is-on' : ''}"></i>`).join('')
      + `</span><span class="fakeness-label">${dossierText(meta.label)}${meta.pending ? ' ⏳' : ''}</span></div>`
      + `<p class="fakeness-blurb">${dossierText(meta.blurb)}</p>`;
  }

  function renderRegisterDossierBody(registerKey) {
    const profile = profileForKey(registerKey);
    if (!profile) return '';
    const meta = fakenessFromProfile(profile);
    const slots = countRegisterSlots(registerKey);

    return `<p class="dossier-lede">${dossierText(stringValue(profile.personality)
      || 'No stylistic note recorded for this register.')}</p>`
      + fakenessMeterHtml(meta)
      + dossierSection('The register', dossierRows([
        ['Imitates', dossierText(profile.translator)],
        ['Shown here as', dossierText(profile.robo_name)],
        ['Evidence source', dossierText(profile.evidence_source)],
        ['Verified samples in the corpus', dossierText(profile.verified_sample_count)],
        ['Renders 無', dossierText(profile.rendering_of_wu)],
        ['Naming', dossierText(profile.naming)]
      ]), 'A Robolation is project text written in a translator\u2019s broad register — not their words, and not citable as their translation.')
      + dossierSection('What the imitation listens to', Array.isArray(profile.observed_features) && profile.observed_features.length
        ? dossierList(profile.observed_features) : '')
      + dossierSection('Where this register is used',
        `<p class="dossier-usage">${slots.total} corpus slot${slots.total === 1 ? '' : 's'} carry this register; ${slots.verified} of them hold an edition-verified quotation.</p>`);
  }

  // ---- what the margin shows while you read ---------------------------------
  // The rail is never empty: when nothing is pinned it follows the passage on
  // screen — who speaks, which terms are in it, what the record says about it.
  function passageWorkContext(doc) {
    const review = sourceReviewForCorpusKey(state.currentCorpusKey);
    const perText = metricsPerText(state.currentCorpusKey);
    return {
      kicker: 'Reading · the whole work',
      nameZh: stringValue(doc.title_zh),
      nameEn: stringValue(doc.title_en),
      content: `<p class="context-unit">${dossierText(doc.title_en)}</p>`
        + dossierSection('This work', dossierRows([
          ['Canonical id', dossierCode(doc.cbeta_id) || 'not recorded'],
          ['Held here', dossierText(perText.coverage || 'units not declared')],
          ['Source review', dossierText(sourceReviewStatusLabel(review.status))]
        ]), 'The margin follows the sheet. Select any name, term or case and it becomes the record on screen.')
        + dossierSection('Open the dossier', dossierChips([wikiButton('work', state.currentCorpusKey, itemLabel(state.currentCorpusKey))]))
    };
  }

  function findUnit(corpusKey, ref) {
    const doc = state.data.corpus && state.data.corpus[corpusKey];
    if (!doc || !ref || !ref.id) return null;
    const pools = [
      ['cases', 'case_num', num => `Case ${num}`],
      ['sections', 'section_id', () => 'Section'],
      ['dialogues', 'dialogue_id', () => 'Dialogue'],
      ['stanzas', 'stanza_num', num => `Stanza ${num}`],
      ['chapters', 'chapter_num', num => `Chapter ${num}`],
      ['five_ranks', 'rank_num', num => `Rank ${num}`]
    ];
    for (const pool of pools) {
      const items = Array.isArray(doc[pool[0]]) ? doc[pool[0]] : [];
      const found = items.find(item => item && String(item[pool[1]]) === String(ref.id));
      if (found) {
        return Object.assign({}, found, {
          __label: `${pool[2](found[pool[1]])} · ${stringValue(found.title_zh || found.name_zh || '')}`.trim(),
          __kind: ref.kind
        });
      }
    }
    if (String(ref.id) === 'preface' && doc.preface) return Object.assign({}, doc.preface, { __label: '序 Front matter' });
    if (String(ref.id) === 'epilogue' && doc.epilogue) return Object.assign({}, doc.epilogue, { __label: '後 End matter' });
    return null;
  }

  function renderPassageContext(ref) {
    const doc = state.data.corpus && state.data.corpus[state.currentCorpusKey];
    if (!doc) return { kicker: 'Reading', nameZh: '', nameEn: '', content: '<p class="dossier-empty">No work is open.</p>' };
    const unit = findUnit(state.currentCorpusKey, ref);
    if (!unit) return passageWorkContext(doc);
    const zh = [unit.zh, unit.commentary_zh, unit.verse_zh, unit.pointer_zh].filter(Boolean).join(' ');
    const terms = glossaryList().filter(t => t && t.term && zh.indexOf(t.term) !== -1).slice(0, 6);
    const voices = lineageList().filter(m => m && m.name_zh && zh.indexOf(m.name_zh) !== -1).slice(0, 4);
    const caseEntry = unit.case_num !== undefined && unit.case_num !== null
      ? gonganList().find(g => g && String(g.case_no) === String(unit.case_num)
        && stringValue(g.collection).indexOf(stringValue(doc.title_zh).slice(0, 3)) !== -1)
      : null;
    const registers = isRecord(unit.translations)
      ? Object.keys(unit.translations).map(key => normalizeTranslationEntry(key, unit.translations[key])) : [];
    const verified = registers.filter(entry => entry.status === 'verified_quotation').length;

    const body = [
      `<p class="context-unit">${dossierText(unit.__label)}</p>`,
      unit.speaker ? `<p class="context-speaker">${annotateEnglishProse(stringValue(unit.speaker))}</p>` : '',
      zh ? `<p class="context-excerpt" lang="zh">${dossierText(zh.length > 96 ? `${zh.slice(0, 96)}…` : zh)}</p>` : '',
      terms.length ? dossierSection('Terms in this passage', dossierChips(
        terms.map(t => wikiButton('term', t.id, `${t.term} · ${stringValue(t.literal)}`)))) : '',
      voices.length ? dossierSection('Voices in this passage', dossierChips(
        voices.map(m => wikiButton('master', m.id, masterDisplayName(m))))) : '',
      caseEntry ? dossierSection('On the case shelf',
        `<p class="context-case">${dossierText(caseEntry.theme)} — ${dossierText(caseEntry.summary)}</p>`
        + dossierChips([wikiButton('case', caseEntry.id, 'Open the case record')])) : '',
      registers.length ? dossierSection('English here',
        `<p class="context-registers">${registers.length} register${registers.length === 1 ? '' : 's'} · ${verified} edition-verified</p>`,
        'Select a register name in the text for its record, its citation and its real-fakeness.') : ''
    ].filter(Boolean).join('');

    return {
      kicker: `Reading · ${stringValue(unit.__label).slice(0, 46)}`,
      nameZh: stringValue(unit.title_zh) || stringValue(doc.title_zh),
      nameEn: stringValue(unit.title_en) || stringValue(doc.title_en),
      content: body
    };
  }

  // ---- opening a record -----------------------------------------------------
  const DOSSIER_BUILDERS = {
    master: {
      body: renderMasterDossierBody,
      head(id) {
        const master = lineageList().find(m => m && m.id === id);
        if (!master) return null;
        return {
          kicker: `Master dossier · generation ${master.lineage_depth} · ${stringValue(master.era)}`,
          nameZh: `${stringValue(master.name_zh)} (${stringValue(master.title)})`,
          nameEn: `${masterDisplayName(master)} • Pinyin: ${stringValue(master.name_pinyin)}`
            + (master.name_romaji ? ` • Rōmaji: ${stringValue(master.name_romaji)}` : '')
            + ` • Generation: ${stringValue(master.lineage_depth)} • Era: ${stringValue(master.dates)}`
        };
      }
    },
    work: {
      body: renderWorkDossierBody,
      head(id) {
        const doc = state.data.corpus && state.data.corpus[id];
        if (!doc) return null;
        return { kicker: 'Work dossier', nameZh: doc.title_zh, nameEn: `${stringValue(doc.title_en)} · ${stringValue(doc.cbeta_id) || 'source pending'}` };
      }
    },
    term: {
      body: renderTermDossierBody,
      head(id) {
        const term = termById(id);
        if (!term) return null;
        return { kicker: `Term · ${stringValue(term.category)}`, nameZh: term.term, nameEn: `${stringValue(term.pinyin)} · ${stringValue(term.literal)}` };
      }
    },
    case: {
      body: renderCaseDossierBody,
      head(id) {
        const entry = gonganList().find(g => g && g.id === id);
        if (!entry) return null;
        return {
          kicker: `Case ${entry.case_no} · ${gonganGroupDisplay(stringValue(entry.theme_group))}`,
          nameZh: entry.title_zh,
          nameEn: `${stringValue(entry.title_en)} · ${stringValue(entry.collection)}`
        };
      }
    },
    register: {
      body: renderRegisterDossierBody,
      head(id) {
        const profile = profileForKey(id);
        if (!profile) return null;
        const count = Number(profile.verified_sample_count) || 0;
        return {
          kicker: 'Register dossier',
          nameZh: profile.robo_name || profile.translator,
          nameEn: `${stringValue(profile.translator)} · ${count} verified sample${count === 1 ? '' : 's'}`
        };
      }
    }
  };

  function openWiki(key, options) {
    const opts = options || {};
    const value = stringValue(key);
    if (value.indexOf(':') === -1) return;
    const kind = value.split(':')[0];
    const id = value.slice(kind.length + 1);
    const builder = DOSSIER_BUILDERS[kind];
    const content = document.getElementById('dossier-content');
    if (!builder || !content) return;
    const head = builder.head(id);
    if (!head) return;
    const body = builder.body(id);
    if (!body) return;

    if (margin.key !== value) {
      if (margin.key) margin.history.push(margin.key);
      if (margin.history.length > 30) margin.history.shift();
      margin.future = [];
    }
    margin.mode = 'pinned';
    margin.key = value;

    const kicker = document.getElementById('dossier-kicker');
    if (kicker) kicker.innerHTML = escHtml(head.kicker);
    const nameZh = document.getElementById('dossier-name-zh');
    if (nameZh) { nameZh.textContent = stringValue(head.nameZh); nameZh.setAttribute('lang', 'zh'); }
    const nameEn = document.getElementById('dossier-name-en');
    if (nameEn) nameEn.innerHTML = escHtml(head.nameEn);
    content.innerHTML = body;
    marginOpen();
    renderDossierTrail();

    const panel = document.getElementById('master-dossier-panel');
    if (panel && !opts.keepScroll && typeof panel.scrollTo === 'function') panel.scrollTo({ top: 0, behavior: motionBehavior() });
    if (opts.focus && panel && typeof panel.focus === 'function') {
      try { panel.focus({ preventScroll: true }); } catch (err) { try { panel.focus(); } catch (e) { /* no focus */ } }
    }
    if (opts.shareHash) {
      const target = `#/wiki/${kind}/${id}`;
      if (location.hash !== target) { try { location.hash = target; } catch (e) { /* file:// edge cases */ } }
    }
    document.documentElement.setAttribute('data-margin-kind', kind);
  }

  function renderDossierTrail() {
    const trail = document.getElementById('dossier-trail');
    if (!trail) return;
    const kind = margin.key ? margin.key.split(':')[0] : '';
    const parts = [`<button type="button" class="trail-btn${margin.mode === 'follow' ? ' is-active' : ''}" data-wiki-follow>Follow the text</button>`];
    if (kind) parts.push(`<span class="trail-kind">${dossierText(WIKI_LABEL[kind] || kind)}</span>`);
    if (margin.history.length) parts.push('<button type="button" class="trail-btn" data-wiki-back>← back</button>');
    if (margin.future.length) parts.push('<button type="button" class="trail-btn" data-wiki-fwd>forward →</button>');
    trail.innerHTML = parts.join('');
  }

  function wikiBack() {
    let prev = margin.history.pop();
    while (prev && !wikiGet(prev)) prev = margin.history.pop();
    if (!prev) { marginResumeFollow(); return; }
    if (margin.key) margin.future.push(margin.key);
    openWiki(prev, { keepScroll: true });
  }
  function wikiForward() {
    const next = margin.future.pop();
    if (!next) return;
    if (margin.key) margin.history.push(margin.key);
    openWiki(next, { keepScroll: true });
  }
  function marginResumeFollow() {
    margin.mode = 'follow';
    margin.key = null;
    document.documentElement.setAttribute('data-margin-kind', 'context');
    marginFollowCurrent(true);
  }
  function marginFollowCurrent(force) {
    if (margin.mode !== 'follow' && !force) return;
    const content = document.getElementById('dossier-content');
    if (!content) return;
    const context = renderPassageContext(margin.currentUnit);
    content.innerHTML = context.content;
    const kicker = document.getElementById('dossier-kicker');
    if (kicker) kicker.innerHTML = escHtml(context.kicker);
    const nameZh = document.getElementById('dossier-name-zh');
    if (nameZh) { nameZh.textContent = stringValue(context.nameZh); nameZh.setAttribute('lang', 'zh'); }
    const nameEn = document.getElementById('dossier-name-en');
    if (nameEn) nameEn.innerHTML = escHtml(context.nameEn);
    renderDossierTrail();
    if (force && READER_PREFS.contextOn) marginOpen();
  }

  // ---- scroll spy ------------------------------------------------------------
  // One observer, re-armed after every reader render: it reports the unit whose
  // head has passed the reading line, which is what "the passage you are on"
  // means under a fixed lintel.
  let unitObserver = null;
  let unitNodes = [];

  function parseUnitRef(raw) {
    const match = stringValue(raw).match(/^([a-z]+):(.+)$/);
    return match ? { kind: match[1], id: match[2] } : null;
  }

  function markActiveUnit(ref) {
    unitNodes.forEach(node => {
      if (!node || !node.classList || typeof node.classList.toggle !== 'function') return;
      const nodeRef = parseUnitRef(node.getAttribute('data-unit-ref'));
      const on = !!(nodeRef && ref && nodeRef.kind === ref.kind && String(nodeRef.id) === String(ref.id));
      node.classList.toggle('is-current', on);
    });
  }

  function armScrollSpy() {
    const root = document.getElementById('reader-content-target');
    if (!root || typeof root.querySelectorAll !== 'function') return;
    unitNodes = Array.prototype.slice.call(root.querySelectorAll('[data-unit-ref]'));
    margin.currentUnit = unitNodes.length ? parseUnitRef(unitNodes[0].getAttribute('data-unit-ref')) : null;
    markActiveUnit(margin.currentUnit);
    if (typeof window.IntersectionObserver !== 'function') return;
    if (unitObserver && typeof unitObserver.disconnect === 'function') unitObserver.disconnect();
    unitObserver = new window.IntersectionObserver(entries => {
      if (margin.mode !== 'follow') return;
      let best = null;
      entries.forEach(entry => {
        if (!entry.isIntersecting || !entry.target || typeof entry.target.getAttribute !== 'function') return;
        const top = entry.boundingClientRect ? entry.boundingClientRect.top : 0;
        if (!best || Math.abs(top) < Math.abs(best.top)) {
          best = { ref: parseUnitRef(entry.target.getAttribute('data-unit-ref')), top };
        }
      });
      if (!best || !best.ref) return;
      const current = margin.currentUnit;
      if (current && best.ref.kind === current.kind && String(best.ref.id) === String(current.id)) return;
      margin.currentUnit = best.ref;
      markActiveUnit(best.ref);
      marginFollowCurrent(false);
    }, { rootMargin: '-12% 0px -60% 0px', threshold: [0, 0.2] });
    unitNodes.forEach(node => { if (node && typeof unitObserver.observe === 'function') unitObserver.observe(node); });
  }

  // ---- the index palette (⌘K) ----------------------------------------------
  // One box for "take me to X": every work, master, case, term and register in
  // the bundle, with a hand-off to the full-corpus search. Built from the same
  // entity index the annotator uses, so the palette can never list something the
  // data does not carry.
  const palette = { open: false, query: '', results: [], cursor: 0, index: null };

  function paletteEntries() {
    if (palette.index) return palette.index;
    const out = [];
    (((state.data.corpus_manifest || {}).items) || []).forEach(item => {
      if (!item || !state.data.corpus || !state.data.corpus[item.key]) return;
      const doc = state.data.corpus[item.key] || {};
      out.push({ kind: 'work', key: `work:${item.key}`, label: stringValue(doc.title_en), zh: stringValue(doc.title_zh), note: stringValue(item.cbeta) });
    });
    lineageList().forEach(m => {
      if (!m) return;
      out.push({ kind: 'master', key: `master:${m.id}`, label: masterDisplayName(m), zh: stringValue(m.name_zh), note: `${stringValue(m.era)} · ${stringValue(m.school)}` });
    });
    gonganList().forEach(g => {
      if (!g) return;
      out.push({ kind: 'case', key: `case:${g.id}`, label: stringValue(g.title_en), zh: stringValue(g.title_zh), note: `Case ${g.case_no} · ${stringValue(g.collection)}` });
    });
    glossaryList().forEach(t => {
      if (!t) return;
      out.push({ kind: 'term', key: `term:${t.id}`, label: `${stringValue(t.term)} — ${stringValue(t.literal)}`, zh: stringValue(t.term), note: `${stringValue(t.pinyin)} · ${stringValue(t.category)}` });
    });
    profileList().forEach(p => {
      if (!p) return;
      out.push({ kind: 'register', key: `register:${p.register_key}`, label: stringValue(p.robo_name || p.translator), zh: '', note: `${p.verified_sample_count || 0} verified sample(s) in the corpus` });
    });
    out.forEach(entry => { entry.hay = normalizeForSearch(`${entry.label} ${entry.zh} ${entry.note} ${entry.key}`); });
    palette.index = out;
    return out;
  }

  function paletteFilter(query) {
    const entries = paletteEntries();
    const q = normalizeForSearch(query);
    if (!q) {
      const out = [];
      [['work', 6], ['master', 5], ['case', 4], ['term', 4], ['register', 3]].forEach(([kind, limit]) => {
        entries.filter(entry => entry.kind === kind).slice(0, limit).forEach(entry => out.push(entry));
      });
      return out;
    }
    const scored = [];
    entries.forEach(entry => {
      const label = normalizeForSearch(entry.label);
      let score = -1;
      if (label.indexOf(q) === 0) score = 0;
      else if (label.indexOf(q) !== -1) score = 1;
      else if (entry.hay.indexOf(q) !== -1) score = 2;
      if (score > -1) scored.push({ entry, score });
    });
    scored.sort((a, b) => a.score - b.score || a.entry.label.localeCompare(b.entry.label));
    return scored.slice(0, 40).map(item => item.entry);
  }

  function paletteRender() {
    const list = document.getElementById('palette-list');
    if (!list) return;
    palette.results = paletteFilter(palette.query);
    if (!palette.results.length) {
      list.innerHTML = '<li class="palette-empty">Nothing in the index matches. Press Enter to search every work for those words instead.</li>';
      return;
    }
    list.innerHTML = palette.results.map((entry, i) => `<li class="palette-item${i === palette.cursor ? ' is-cursor' : ''}" role="option" aria-selected="${i === palette.cursor ? 'true' : 'false'}">`
      + `<button type="button" data-palette-key="${escHtml(entry.key)}">`
      + `<span class="palette-kind">${escHtml(WIKI_LABEL[entry.kind] || entry.kind)}</span>`
      + `<span class="palette-label">${escHtml(entry.label)}</span>`
      + (entry.zh ? `<span class="palette-zh" lang="zh">${escHtml(entry.zh)}</span>` : '')
      + `<span class="palette-note">${escHtml(entry.note)}</span></button></li>`).join('');
  }

  function paletteMove(delta) {
    const total = palette.results.length;
    if (!total) return;
    palette.cursor = (palette.cursor + delta + total) % total;
    paletteRender();
  }

  function paletteGo(key) {
    paletteClose();
    const kind = String(key).split(':')[0];
    const id = String(key).slice(kind.length + 1);
    if (kind === 'work') { window.TranslateChan.openDoc(id); return; }
    if (kind === 'case') {
      const entry = gonganList().find(g => g && g.id === id);
      const collection = entry ? stringValue(entry.collection) : '';
      const corpusKey = /碧巖|biyanlu/i.test(collection) ? 'biyanlu_cases'
        : (/無門關|wumenguan/i.test(collection) ? 'wumenguan' : '');
      const doc = corpusKey && state.data.corpus ? state.data.corpus[corpusKey] : null;
      const target = doc && Array.isArray(doc.cases) && entry
        ? doc.cases.find(c => String(c.case_num) === String(entry.case_no)) : null;
      if (target) { window.TranslateChan.openCase(corpusKey, entry.case_no); return; }
    }
    openWiki(key, { focus: true, shareHash: true });
  }

  function paletteDom() {
    let root = document.getElementById('index-palette');
    if (root) return root;
    root = document.createElement('div');
    root.id = 'index-palette';
    root.className = 'palette-shell';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', 'Index palette');
    root.innerHTML = '<div class="palette-frame"><div class="palette-input-row">'
      + '<span class="palette-glyph" aria-hidden="true">⌕</span>'
      + '<input type="search" id="palette-input" class="palette-input" placeholder="Jump to a work, master, case, term or register…" autocomplete="off" spellcheck="false" aria-label="Jump to an entry in the index">'
      + '<button type="button" class="palette-close" data-palette-close aria-label="Close the index palette">✕</button></div>'
      + '<ul class="palette-list" id="palette-list" role="listbox" aria-label="Index results"></ul>'
      + '<p class="palette-foot">↑ ↓ move · Enter open · Esc close · the header box searches every work for words</p></div>';
    document.body.appendChild(root);
    return root;
  }

  // Bound once, on first open: the palette element is built lazily, and the
  // wiring must follow the element rather than the build step, so a palette that
  // was already in the document can never end up without its listeners.
  function paletteWire() {
    const root = paletteDom();
    if (!root || root._wired) return;
    root._wired = true;
    const input = document.getElementById('palette-input');
    if (input) {
      input.addEventListener('input', () => { palette.query = input.value; palette.cursor = 0; paletteRender(); });
      input.addEventListener('keydown', paletteKeydown);
    }
    root.addEventListener('click', e => {
      const target = e && e.target;
      if (!target || typeof target.closest !== 'function') return;
      if (target === root || target.closest('[data-palette-close]')) { paletteClose(); return; }
      const option = target.closest('[data-palette-key]');
      if (option) paletteGo(option.getAttribute('data-palette-key'));
    });
  }

  function paletteKeydown(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); paletteMove(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); paletteMove(-1); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      const entry = palette.results[palette.cursor];
      if (entry) { paletteGo(entry.key); return; }
      const query = palette.query;
      paletteClose();
      if (query) {
        state.searchQuery = String(query).toLowerCase();
        if (elements.globalSearch) elements.globalSearch.value = query;
        handleGlobalSearch();
      }
    } else if (e.key === 'Escape') { e.preventDefault(); paletteClose(); }
  }

  function paletteOpen() {
    const root = paletteDom();
    paletteWire();
    palette.open = true;
    palette.cursor = 0;
    root.removeAttribute('hidden');
    document.documentElement.setAttribute('data-palette', 'open');
    paletteRender();
    const input = document.getElementById('palette-input');
    if (input && typeof input.focus === 'function') input.focus();
  }

  function paletteClose() {
    const root = document.getElementById('index-palette');
    if (root) root.setAttribute('hidden', '');
    palette.open = false;
    document.documentElement.setAttribute('data-palette', 'closed');
  }

  // ---- reading preferences, shared by the sheet and the margin --------------
  const READER_PREFS = { measure: 'narrow', registerCount: 2, quiet: false, contextOn: true };

  function loadReadingPrefs() {
    const measure = storageGet('translatechan_measure');
    if (measure === 'wide' || measure === 'narrow') READER_PREFS.measure = measure;
    const count = storageGet('translatechan_register_count');
    if (count === '0' || count === '1' || count === '2') READER_PREFS.registerCount = Number(count);
    READER_PREFS.quiet = storageGet('translatechan_quiet') === '1';
    READER_PREFS.contextOn = storageGet('translatechan_context') !== '0';
  }

  function applyReadingPrefs() {
    const root = document.documentElement;
    if (!root || typeof root.setAttribute !== 'function') return;
    root.setAttribute('data-measure', READER_PREFS.measure);
    root.setAttribute('data-registers', String(READER_PREFS.registerCount));
    root.setAttribute('data-quiet', READER_PREFS.quiet ? 'on' : 'off');
    root.setAttribute('data-context', READER_PREFS.contextOn ? 'on' : 'off');
    const quiet = document.getElementById('quiet-toggle-btn');
    if (quiet) {
      if (READER_PREFS.quiet) quiet.classList.add('active'); else quiet.classList.remove('active');
      if (typeof quiet.setAttribute === 'function') quiet.setAttribute('aria-pressed', READER_PREFS.quiet ? 'true' : 'false');
    }
  }

  function toggleQuiet() {
    READER_PREFS.quiet = !READER_PREFS.quiet;
    storageSet('translatechan_quiet', READER_PREFS.quiet ? '1' : '0');
    applyReadingPrefs();
  }

  // The size control lives in two places (the reader toolbar and the settings
  // menu) and writes one value: --zh-font-size, a measured runtime contract.
  function adjustFontSize(delta) {
    const next = Math.min(2.2, Math.max(1.0, Math.round((state.fontSize + delta) * 100) / 100));
    if (next === state.fontSize) return;
    state.fontSize = next;
    document.documentElement.style.setProperty('--zh-font-size', `${next}rem`);
    storageSet('translatechan_font_size', String(next));
  }

  function dismissHero() {
    const banner = document.getElementById('zen-hero-banner');
    if (!banner) return;
    banner.hidden = true;
    banner.setAttribute('hidden', '');
    storageSet('translatechan_hero_dismissed', '1');
    const about = document.getElementById('about-toggle');
    if (about) { about.removeAttribute('hidden'); about.hidden = false; }
  }

  // Keep the settings panel's controls honest with the live state. The name-mode
  // radios are synced by syncSettingsUI(); the reading controls are synced here.
  function syncReadingUI() {
    const setPressed = (el, on) => {
      if (!el) return;
      if (on) el.classList.add('active'); else el.classList.remove('active');
      if (typeof el.setAttribute === 'function') {
        el.setAttribute('aria-pressed', on ? 'true' : 'false');
        if (el.getAttribute('role') === 'radio') el.setAttribute('aria-checked', on ? 'true' : 'false');
      }
    };
    document.querySelectorAll('[data-measure]').forEach(opt => {
      setPressed(opt, opt.getAttribute('data-measure') === READER_PREFS.measure);
    });
    document.querySelectorAll('[data-register-count]').forEach(opt => {
      setPressed(opt, Number(opt.getAttribute('data-register-count')) === READER_PREFS.registerCount);
    });
    document.querySelectorAll('[data-pref="pinyin"]').forEach(opt => setPressed(opt, state.showPinyin));
    const pinyinBtn = document.getElementById('pinyin-toggle-btn');
    setPressed(pinyinBtn, state.showPinyin);
    const mobilePinyin = document.getElementById('mobile-pinyin-btn');
    setPressed(mobilePinyin, state.showPinyin);
  }

  // ---- the margin's one delegated listener --------------------------------
  // Every generated link, chip and dossier button routes through here, so the
  // file never emits an inline handler and the CSP stays script-src 'self'.
  function setupMargin() {
    document.addEventListener('click', e => {
      const target = e.target;
      if (!target || typeof target.closest !== 'function') return;
      const door = target.closest('[data-wiki]');
      if (door) { e.preventDefault(); openWiki(door.getAttribute('data-wiki'), { shareHash: true }); return; }
      const chip = target.closest('[data-wiki-open]');
      if (chip) { e.preventDefault(); openWiki(chip.getAttribute('data-wiki-open'), { shareHash: true }); return; }
      if (target.closest('[data-wiki-follow]')) { e.preventDefault(); marginResumeFollow(); return; }
      if (target.closest('[data-wiki-back]')) { e.preventDefault(); wikiBack(); return; }
      if (target.closest('[data-wiki-fwd]')) { e.preventDefault(); wikiForward(); return; }
      if (target.closest('#context-toggle')) {
        e.preventDefault();
        READER_PREFS.contextOn = !READER_PREFS.contextOn;
        storageSet('translatechan_context', READER_PREFS.contextOn ? '1' : '0');
        applyReadingPrefs();
        if (READER_PREFS.contextOn) marginFollowCurrent(true); else marginClose();
        return;
      }
      if (target.closest('#mobile-context-btn')) {
        e.preventDefault();
        READER_PREFS.contextOn = true;
        storageSet('translatechan_context', '1');
        applyReadingPrefs();
        marginFollowCurrent(true);
        return;
      }
      if (target.closest('#quiet-toggle-btn')) { e.preventDefault(); toggleQuiet(); return; }
      if (target.closest('#pinyin-toggle-btn')) {
        e.preventDefault();
        state.showPinyin = !state.showPinyin;
        storageSet('translatechan_show_pinyin', state.showPinyin ? '1' : '0');
        applyPinyinVisibility();
        syncReadingUI();
        return;
      }
      if (target.closest('#palette-btn')) { e.preventDefault(); paletteOpen(); return; }
      if (target.closest('#hero-begin-btn')) { e.preventDefault(); window.TranslateChan.openDoc('wumenguan'); dismissHero(); return; }
      const measure = target.closest('[data-measure]');
      if (measure) {
        e.preventDefault();
        READER_PREFS.measure = measure.getAttribute('data-measure') === 'wide' ? 'wide' : 'narrow';
        storageSet('translatechan_measure', READER_PREFS.measure);
        applyReadingPrefs();
        syncReadingUI();
        return;
      }
      const registers = target.closest('[data-register-count]');
      if (registers) {
        e.preventDefault();
        READER_PREFS.registerCount = Number(registers.getAttribute('data-register-count')) || 0;
        storageSet('translatechan_register_count', String(READER_PREFS.registerCount));
        applyReadingPrefs();
        syncReadingUI();
        renderReader();
        return;
      }
      const step = target.closest('[data-size-step]');
      if (step) { e.preventDefault(); adjustFontSize(Number(step.getAttribute('data-size-step')) * 0.15); return; }
      if (target.closest('[data-pref="pinyin"]')) {
        e.preventDefault();
        state.showPinyin = !state.showPinyin;
        storageSet('translatechan_show_pinyin', state.showPinyin ? '1' : '0');
        applyPinyinVisibility();
        syncReadingUI();
      }
    });

    // Hover or focus on an entity name: one line of identity in the shared
    // popover, so a reader can keep moving without opening anything.
    document.addEventListener('mouseover', e => {
      const span = e.target && e.target.closest ? e.target.closest('.wiki-link') : null;
      if (!span) return;
      const entity = wikiGet(span.getAttribute('data-wiki'));
      if (!entity) return;
      const pop = getCitationPopover();
      pop.innerHTML = `<div class="citation-title">${escHtml(entityLabel(entity))}</div>`
        + `<div class="citation-row">${escHtml(wikiPreviewLine(entity))}</div>`
        + '<div class="citation-row citation-open-hint">Click — the record opens in the margin beside the text.</div>';
      pop.hidden = false;
      positionFloatingPopover(pop, span, 320);
      pop._anchor = span;
    });
    document.addEventListener('mouseout', e => {
      const span = e.target && e.target.closest ? e.target.closest('.wiki-link') : null;
      if (!span) return;
      const intoPop = e.relatedTarget && typeof e.relatedTarget.closest === 'function' && e.relatedTarget.closest('#citation-popover');
      if (!intoPop) hideCitationPopover();
    });

    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        if (palette.open) paletteClose(); else paletteOpen();
        return;
      }
      if (palette.open) return;
      if (e.key === 'Escape' && READER_PREFS.quiet) { toggleQuiet(); return; }
      if (e.key === 'Enter' || e.key === ' ') {
        const span = e.target && e.target.closest ? e.target.closest('.wiki-link') : null;
        if (!span || !span.classList || typeof span.classList.contains !== 'function') return;
        // A glossary span keeps its own keyboard path (Enter reveals the shared
        // tooltip); every other entity opens its record.
        if (span.classList.contains('term-highlight') && !span.classList.contains('wiki-link-master')) return;
        e.preventDefault();
        openWiki(span.getAttribute('data-wiki'), { shareHash: true });
      }
    });
  }

  function wikiPreviewLine(entity) {
    if (!entity) return '';
    switch (entity.kind) {
      case 'master': return `${stringValue(entity.era)} · ${stringValue(entity.location)} — ${stringValue(entity.summary).slice(0, 170)}`;
      case 'work': return `${stringValue(entity.era)} · ${stringValue(entity.cbeta)} — ${stringValue(entity.genre)}`;
      case 'term': return `${stringValue(entity.pinyin)} — ${stringValue(entity.definition).slice(0, 170)}`;
      case 'case': return `${stringValue(entity.collection)}, case ${stringValue(entity.case_no)} — ${stringValue(entity.summary).slice(0, 170)}`;
      case 'register': return `${stringValue(entity.translator)} · ${stringValue(entity.verified_sample_count)} verified sample(s) in the corpus`;
      default: return stringValue(entity.id);
    }
  }
  function setupEventListeners() {
    setupCitationPopoverListeners();
    setupRoboNameListeners();
    if (elements.themeToggle) {
      elements.themeToggle.addEventListener('click', () => {
        applyTheme(state.theme === 'dark' ? 'light' : 'dark');
      });
    }

    // Display settings menu (gear) — romanization preference, persisted.
    const settingsBtn = document.getElementById('settings-btn');
    const settingsPanel = document.getElementById('settings-panel');
    let settingsOpen = false;
    if (settingsBtn && settingsPanel) {
      const applyOpen = (open) => {
        settingsOpen = open;
        if (open) settingsPanel.removeAttribute('hidden'); else settingsPanel.setAttribute('hidden', '');
        settingsBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      };
      settingsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        applyOpen(!settingsOpen);
      });
      document.addEventListener('click', (e) => {
        if (!settingsOpen) return;
        if (!settingsPanel.contains(e.target) && e.target !== settingsBtn && !settingsBtn.contains(e.target)) applyOpen(false);
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && settingsOpen) applyOpen(false);
      });
    }
    document.querySelectorAll('.settings-opt[data-name-mode]').forEach(opt => {
      opt.addEventListener('click', () => {
        const mode = opt.getAttribute('data-name-mode');
        if (mode !== 'pinyin' && mode !== 'romaji') return;
        state.nameMode = mode;
        storageSet('translatechan_name_mode', mode);
        syncSettingsUI();
        renderLineage();
      });
    });

    elements.navTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const view = tab.getAttribute('data-view');
        switchView(view);
      });
    });

    // URL hash drives view + reader corpus (back/forward, deep links)
    window.addEventListener('hashchange', applyHash);

    elements.readerModeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        setReaderMode(btn.getAttribute('data-reader-mode'));
      });
    });

    if (elements.globalSearch) {
      let searchTimer = null;
      elements.globalSearch.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.trim().toLowerCase();
        clearTimeout(searchTimer);
        searchTimer = setTimeout(handleGlobalSearch, 200); // debounce: full-corpus walk per keystroke is heavy
      });
    }

    // Reading font size adjusters (persisted)
    const fontIncBtn = document.getElementById('font-size-inc-btn');
    const fontDecBtn = document.getElementById('font-size-dec-btn');
    const fontIncBtnMobile = document.getElementById('mobile-font-inc-btn');
    const fontDecBtnMobile = document.getElementById('mobile-font-dec-btn');

    if (fontIncBtn) fontIncBtn.addEventListener('click', () => adjustFontSize(0.15));
    if (fontDecBtn) fontDecBtn.addEventListener('click', () => adjustFontSize(-0.15));
    if (fontIncBtnMobile) fontIncBtnMobile.addEventListener('click', () => adjustFontSize(0.15));
    if (fontDecBtnMobile) fontDecBtnMobile.addEventListener('click', () => adjustFontSize(-0.15));

    // Mobile corpus picker
    const mobileCorpusSelect = document.getElementById('corpus-mobile-select');
    if (mobileCorpusSelect) {
      mobileCorpusSelect.addEventListener('change', (e) => {
        if (!setCurrentCorpusKey(e.target.value)) return;
        renderCorpusList();
        renderReader();
        const t = viewHash('reader', state.currentCorpusKey);
        if (location.hash !== t) { try { location.hash = t; } catch (err) { /* ignore */ } }
      });
    }

    const readerPrintBtn = document.getElementById('reader-print-btn');
    if (readerPrintBtn) readerPrintBtn.addEventListener('click', printFullReader);

    // Mobile bottom-bar: case index, scroll to top, pinyin toggle
    const mobileCasesBtn = document.getElementById('mobile-cases-btn');
    if (mobileCasesBtn) {
      mobileCasesBtn.addEventListener('click', () => {
        const strip = document.getElementById('case-jump-strip');
        if (strip) strip.scrollIntoView({ behavior: motionBehavior(), block: 'start' });
        else window.scrollTo({ top: 0, behavior: motionBehavior() });
      });
    }
    const mobileTopBtn = document.getElementById('mobile-top-btn');
    if (mobileTopBtn) mobileTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: motionBehavior() }));
    const mobilePinyinBtn = document.getElementById('mobile-pinyin-btn');
    if (mobilePinyinBtn) {
      mobilePinyinBtn.addEventListener('click', () => {
        state.showPinyin = !state.showPinyin;
        storageSet('translatechan_show_pinyin', state.showPinyin ? '1' : '0');
        applyPinyinVisibility();
      });
    }

    // Shared glossary popover (hover / focus / tap) — delegated
    const readerRoot = elements.readerContent;
    if (readerRoot) {
      readerRoot.addEventListener('mouseover', (e) => {
        const t = e.target.closest ? e.target.closest('.term-highlight') : null;
        if (t) showTermPopover(t);
      });
      readerRoot.addEventListener('mouseout', (e) => {
        const t = e.target.closest ? e.target.closest('.term-highlight') : null;
        // N8: keep the popover alive when the pointer moves INTO it (scrollable content)
        const intoPop = e.relatedTarget && typeof e.relatedTarget.closest === 'function' && e.relatedTarget.closest('#term-popover');
        if (t && !t.contains(e.relatedTarget) && !intoPop) hideTermPopover();
      });
      // Keyboard discoverability (a11y N3, 2026-08-09): Tab-focus on a term
      // reveals its definition just like hover does; gated on :focus-visible
      // so a mouse click-focus keeps the click-to-toggle semantics unchanged.
      readerRoot.addEventListener('focusin', (e) => {
        const t = e.target && e.target.closest ? e.target.closest('.term-highlight') : null;
        if (!t) return;
        if (typeof t.matches === 'function' && !t.matches(':focus-visible')) return;
        showTermPopover(t);
      });
      readerRoot.addEventListener('focusout', (e) => {
        const t = e.target && e.target.closest ? e.target.closest('.term-highlight') : null;
        if (t && !t.contains(e.relatedTarget)) hideTermPopover();
      });
      readerRoot.addEventListener('click', (e) => {
        const t = e.target.closest ? e.target.closest('.term-highlight') : null;
        if (t) { e.preventDefault(); toggleTermPopover(t); return; }
        const toggle = e.target.closest ? e.target.closest('.case-toggle') : null;
        if (toggle) { toggleCase(toggle); return; }
        hideTermPopover();
      });
      readerRoot.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { hideTermPopover(); return; }
        // Keyboard activation for glossary terms (Enter/Space open the shared popover)
        if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.closest && e.target.closest('.term-highlight')) {
          e.preventDefault();
          toggleTermPopover(e.target.closest('.term-highlight'));
        }
      });
    }

    // Lineage school filter
    if (elements.lineageFilter) {
      elements.lineageFilter.addEventListener('change', (e) => {
        state.selectedMasterSchool = e.target.value;
        renderLineage();
      });
    }

    if (elements.lineageSort) {
      elements.lineageSort.addEventListener('change', (e) => {
        state.lineageSort = ['generation', 'chronology', 'name', 'school'].includes(e.target.value) ? e.target.value : 'generation';
        renderLineage();
      });
    }

    // Lexicon category filter (state existed but no listener did — the control
    // was inert until this handler; now derived from data + wired).
    if (elements.lexiconFilter) {
      elements.lexiconFilter.addEventListener('change', (e) => {
        state.selectedLexiconCategory = e.target.value || 'all';
        renderLexicon();
      });
    }

    // U3 (audit 2026-08-10, session 019feabb): free-text filter above the
    // Lexicon grid. Debounced 200ms to stay snappy on mobile keyboards; uses
    // the same diacritic + variant normalization as the global search.
    const lexiconQueryInput = document.getElementById('lexicon-query');
    if (lexiconQueryInput) {
      let lexiconTimer = null;
      lexiconQueryInput.addEventListener('input', (e) => {
        clearTimeout(lexiconTimer);
        const value = e.target.value;
        lexiconTimer = setTimeout(() => {
          state.lexiconQuery = value;
          renderLexicon();
        }, 200);
      });
    }

    // L1 (audit 2026-08-10, session 019feabb): corpus sidebar search
    // filter. Same debounce + normalization as the lexicon filter.
    // Renders inline; the current selection is preserved when the
    // user types (the corpus_btn is hidden, not removed).
    const corpusFilterInput = document.getElementById('corpus-filter-input');
    if (corpusFilterInput) {
      let corpusFilterTimer = null;
      corpusFilterInput.addEventListener('input', (e) => {
        clearTimeout(corpusFilterTimer);
        const value = e.target.value;
        corpusFilterTimer = setTimeout(() => {
          state.corpusFilter = value;
          renderCorpusList();
        }, 150);
      });
    }

    if (elements.lineageTarget) {
      elements.lineageTarget.addEventListener('click', (e) => {
        const card = e.target.closest ? e.target.closest('[data-master-card]') : null;
        if (card && !e.target.closest('.teacher-link')) window.TranslateChan.openMasterDossier(card.getAttribute('data-master-card'));
      });
      elements.lineageTarget.addEventListener('keydown', (e) => {
        const card = e.target.closest ? e.target.closest('[data-master-card]') : null;
        if (card && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); window.TranslateChan.openMasterDossier(card.getAttribute('data-master-card')); }
      });
    }

    // Mode switcher — Phase 3 made the transmission register the room's first
    // view and the layered SVG network its optional second view. Visibility is
    // toggled through the semantic `hidden` attribute only (no style writes), and
    // the chart re-lays itself out on activation because a hidden <svg> measures
    // zero width: without this the chart would keep the fallback viewBox from
    // the render that happened while it was still hidden.
    const graphBtn = document.getElementById('lineage-mode-graph-btn');
    const cardsBtn = document.getElementById('lineage-mode-cards-btn');
    const graphContainer = document.getElementById('lineage-graph-container');
    const cardsContainer = document.getElementById('lineage-content-target');

    if (graphBtn && cardsBtn && graphContainer && cardsContainer) {
      const setLineageMode = (mode) => {
        const graph = mode === 'graph';
        if (graph) { graphBtn.classList.add('active'); cardsBtn.classList.remove('active'); }
        else { cardsBtn.classList.add('active'); graphBtn.classList.remove('active'); }
        graphBtn.setAttribute('aria-pressed', graph ? 'true' : 'false');
        cardsBtn.setAttribute('aria-pressed', graph ? 'false' : 'true');
        graphContainer.hidden = !graph;
        cardsContainer.hidden = graph;
        if (graph) renderVisualLineageGraph(filteredLineageMasters());
      };
      graphBtn.addEventListener('click', () => setLineageMode('graph'));
      cardsBtn.addEventListener('click', () => setLineageMode('register'));
    }

    const lineageResetBtn = document.getElementById('lineage-reset-btn');
    if (lineageResetBtn) {
      lineageResetBtn.addEventListener('click', () => {
        if (typeof window.TranslateChan.resetLineageView === 'function') window.TranslateChan.resetLineageView();
      });
    }

    // N8: a tap/click outside any term highlight or the shared glossary popover
    // dismisses it (readerRoot only covers taps inside the reader panel).
    document.addEventListener('click', (e) => {
      const t = e.target && typeof e.target.closest === 'function' ? e.target.closest('.term-highlight, #term-popover') : null;
      if (!t) hideTermPopover();
    });

    // Dossier dialog (N2): the ✕ button and Escape both close through the same
    // focus-restoring path; bound once here, not per dossier open.
    const dossierCloseBtn = document.getElementById('dossier-close-btn');
    if (dossierCloseBtn) dossierCloseBtn.addEventListener('click', closeDossierPanel);
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      // Let an open tooltip absorb the first Escape press before the dossier closes.
      if ((citationPopoverEl && !citationPopoverEl.hidden) ||
          (termPopoverEl && !termPopoverEl.hidden) ||
          (roboPopoverEl && !roboPopoverEl.hidden)) return;
      closeDossierPanel();
    });

    // U8 (audit 2026-08-10, session 019feabb): keyboard case navigation in
    // the reader. ← / → jump to the previous / next case; [ / ] jump to the
    // first / last case. Skipped while the user is typing in a search,
    // lexicon query, or settings field; also skipped when the dossier or any
    // popover is open so the keys don't fight a focused glossary term.
    document.addEventListener('keydown', (e) => {
      if (state.currentView !== 'reader') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target;
      const tag = target && target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (target && target.isContentEditable)) return;
      // Don't fight an open popover or the dossier.
      if ((citationPopoverEl && !citationPopoverEl.hidden) ||
          (termPopoverEl && !termPopoverEl.hidden) ||
          (roboPopoverEl && !roboPopoverEl.hidden)) return;
      const doc = state.data.corpus && state.data.corpus[state.currentCorpusKey];
      if (!doc) return;
      const cases = Array.isArray(doc.cases) ? doc.cases : [];
      if (cases.length === 0) return;
      // Find the case currently in view (or fall back to the first one).
      const currentNum = (() => {
        for (const c of cases) {
          const el = document.getElementById(`case-${c.case_num}`);
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          if (rect.bottom > 80 && rect.top < (window.innerHeight || 800) * 0.4) {
            return c.case_num;
          }
        }
        return cases[0].case_num;
      })();
      const currentIdx = cases.findIndex(c => String(c.case_num) === String(currentNum));
      let nextIdx = -1;
      if (e.key === 'ArrowRight') nextIdx = Math.min(cases.length - 1, currentIdx + 1);
      else if (e.key === 'ArrowLeft') nextIdx = Math.max(0, currentIdx - 1);
      else if (e.key === ']') nextIdx = cases.length - 1;
      else if (e.key === '[') nextIdx = 0;
      if (nextIdx < 0 || nextIdx === currentIdx) return;
      e.preventDefault();
      window.TranslateChan.scrollToCase(cases[nextIdx].case_num);
    });

    // ---- Delegated clicks: generated controls use data-* attributes instead of
    // inline `onclick` so a restrictive Content-Security-Policy (script-src 'self')
    // can be enforced. Native <button>/<a> semantics already provide Enter/Space.
    document.addEventListener('click', (e) => {
      if (!e.target || typeof e.target.closest !== 'function') return;
      const hit = (sel) => e.target.closest(sel);

      // Case strip chips + per-case prev/current/next footer (reader)
      const jump = hit('[data-jump-case]');
      if (jump) {
        e.preventDefault();
        const num = parseInt(jump.getAttribute('data-jump-case'), 10);
        if (num) window.TranslateChan.scrollToCase(num);
        return;
      }
      if (hit('#case-load-more-btn')) {
        e.preventDefault();
        window.TranslateChan.loadMoreCases();
        return;
      }
      // U2 (audit 2026-08-10, session 019feabb): the 12/24/all segmented
      // buttons sit beside the primary load-more button and jump directly
      // to a target unit count (e.g. +24 cases or "all").
      const loadTargetBtn = hit('[data-load-target]');
      if (loadTargetBtn) {
        e.preventDefault();
        const t = parseInt(loadTargetBtn.getAttribute('data-load-target'), 10);
        if (Number.isFinite(t)) window.TranslateChan.loadMoreCases(t);
        return;
      }
      // Search result jump buttons
      const openCaseBtn = hit('[data-open-case]');
      if (openCaseBtn) {
        e.preventDefault();
        window.TranslateChan.openCase(openCaseBtn.getAttribute('data-open-case'), parseInt(openCaseBtn.getAttribute('data-case-num'), 10) || 0);
        return;
      }
      const openDocBtn = hit('[data-open-doc]');
      if (openDocBtn) {
        e.preventDefault();
        window.TranslateChan.openDoc(openDocBtn.getAttribute('data-open-doc'));
        return;
      }
      // Lineage teacher links inside master cards / dossier
      const teacherLink = hit('[data-master-teacher]');
      if (teacherLink) {
        e.preventDefault();
        window.TranslateChan.openMasterDossier(teacherLink.getAttribute('data-master-teacher'));
      }
    });

    // N7 (2026-08-09, session 019fe731): the lineage graph lays out from the
    // live viewport width — re-render (debounced) on resize so rotated phones /
    // resized desktops never keep a stale viewBox. Pan/zoom survives via
    // svg._panzoom (ensureLineagePanZoom re-applies the transform on redraw).
    let lineageResizeTimer = null;
    window.addEventListener('resize', () => {
      if (state.currentView !== 'lineage') return;
      clearTimeout(lineageResizeTimer);
      lineageResizeTimer = setTimeout(renderLineage, 220);
    });

    // ---- ARIA tabs: roving tabindex + arrow/Home/End navigation on the tablist.
    const tabList = (typeof document.querySelector === 'function') ? document.querySelector('.nav-tabs') : null;
    if (tabList && typeof tabList.addEventListener === 'function') {
      tabList.addEventListener('keydown', (e) => {
        const tabs = Array.from(elements.navTabs || []);
        const idx = tabs.indexOf(document.activeElement);
        if (idx < 0 || tabs.length === 0) return;
        let next = null;
        if (e.key === 'ArrowRight') next = tabs[(idx + 1) % tabs.length];
        else if (e.key === 'ArrowLeft') next = tabs[(idx - 1 + tabs.length) % tabs.length];
        else if (e.key === 'Home') next = tabs[0];
        else if (e.key === 'End') next = tabs[tabs.length - 1];
        if (!next) return;
        e.preventDefault();
        next.focus();
        next.click(); // activates the view (same path as pointer activation)
      });
    }
  }

  // View Switcher (updates DOM + URL hash so back/forward and deep links work)
  const VALID_VIEWS = ['reader', 'matrix', 'lineage', 'gongan', 'lexicon'];

  // Render-lazy (C-4, Phase 2): a hidden room builds its DOM the first time
  // it becomes visible, not at boot. Renderers rewrite their whole target, so
  // this is a first-render gate only — later re-renders (filters, name mode,
  // resize) keep calling the renderers directly and remain correct if they
  // happen before activation.
  const ROOM_RENDERERS = {
    matrix: () => renderMatrix(),
    lineage: () => renderLineage(),
    gongan: () => renderGonganIndex(),
    lexicon: () => renderLexicon()
  };
  const renderedRooms = new Set(['reader']);
  function ensureRoomRendered(viewName) {
    const render = ROOM_RENDERERS[viewName];
    if (!render || renderedRooms.has(viewName)) return;
    renderedRooms.add(viewName);
    render();
  }

  function viewHash(view, corpusKey) {
    return `#/${view}${(view === 'reader' && corpusKey) ? '/' + corpusKey : ''}`;
  }
  function switchView(viewName) {
    switchViewRaw(viewName, true);
    const target = viewHash(viewName, state.currentCorpusKey);
    if (location.hash !== target) {
      try { location.hash = target; } catch (e) { /* file:// edge cases */ }
    }
  }
  function switchViewRaw(viewName, scroll = true) {
    if (!VALID_VIEWS.includes(viewName)) return;
    const oldView = state.currentView;
    if (oldView && oldView !== viewName) {
      state.viewScroll = state.viewScroll || {};
      state.viewScroll[oldView] = window.scrollY || 0;
    }
    state.currentView = viewName;
    if (document.body && document.body.dataset) document.body.dataset.currentView = viewName;
    elements.navTabs.forEach(tab => {
      const on = tab.getAttribute('data-view') === viewName;
      if (on) tab.classList.add('active'); else tab.classList.remove('active');
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
      // Roving tabindex: only the active tab is tabbable (ARIA tabs pattern)
      if (typeof tab.setAttribute === 'function') tab.setAttribute('tabindex', on ? '0' : '-1');
    });

    elements.viewSections.forEach(section => {
      if (section.id === `view-${viewName}`) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });
    ensureRoomRendered(viewName); // C-4 render-lazy: first activation builds the room
    if (scroll) {
      window.scrollTo({ top: 0, behavior: motionBehavior() });
    } else if (state.viewScroll && typeof state.viewScroll[viewName] === 'number') {
      const targetY = state.viewScroll[viewName];
      setTimeout(() => window.scrollTo({ top: targetY, behavior: motionBehavior() }), 0);
    }
  }

  // Apply the URL hash to app state (view + reader corpus); no re-render loop.
  function applyHash() {
    const wikiMatch = /^#\/wiki\/([a-z]+):?(.*)$/.exec(location.hash || '');
    if (wikiMatch && DOSSIER_BUILDERS[wikiMatch[1]] && wikiMatch[2]) {
      switchView('reader');
      openWiki(`${wikiMatch[1]}:${wikiMatch[2]}`, { focus: true });
      return;
    }
    const m = (location.hash || '').match(/^#\/([a-z]+)(?:\/([a-z0-9_]+))?/);
    const view = m && VALID_VIEWS.includes(m[1]) ? m[1] : 'reader';
    if (view !== state.currentView) switchViewRaw(view, false);
    if (view === 'reader') {
      const key = m && m[2] ? m[2] : state.currentCorpusKey;
      if (state.data.corpus && state.data.corpus[key] && key !== state.currentCorpusKey) {
        setCurrentCorpusKey(key);
        renderCorpusList();
        renderReader();
      }
    }
  }

  // Annotate text with glossary markers (single-pass, no nested highlights).
  // Tooltip CONTENT is emitted ONCE into a shared popover on demand (see
  // showTermPopover) — occurrence spans carry only `data-term-id`, which keeps
  // the DOM lean (previously every 無 occurrence inlined the full definition).
  function annotateClassicalChinese(text) {
    // One pass for the whole source line: glossary terms (.term-highlight, the
    // historical class the popover and keyboard path are bound to) and every
    // other entity (.wiki-link) come out of the same matcher, so no span is ever
    // nested in another and nothing in the Chinese is rewritten.
    return annotateSourceText(text);
  }
  function annotateClassicalChineseLegacy(text) {
    if (!text) return '';
    if (!state.data.glossary || !Array.isArray(state.data.glossary)) return escHtml(text);
    const terms = state.data.glossary.filter(t => t && t.term && t.id && text.includes(t.term));
    if (terms.length === 0) return escHtml(text);

    // Collect every match span of every term, longest terms winning overlaps
    const matches = [];
    terms.sort((a, b) => b.term.length - a.term.length);
    terms.forEach(termObj => {
      let idx = text.indexOf(termObj.term);
      while (idx !== -1) {
        matches.push({ start: idx, end: idx + termObj.term.length, termObj });
        idx = text.indexOf(termObj.term, idx + 1);
      }
    });
    matches.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));

    let out = '';
    let pos = 0;
    matches.forEach(m => {
      if (m.start < pos) return; // skip overlaps with an already-emitted longer/earlier match
      const t = m.termObj;
      out += escHtml(text.slice(pos, m.start));
      out += `<span class="term-highlight" data-term-id="${escHtml(t.id)}" tabindex="0" ` +
             `title="${escHtml((t.term) + ' — ' + (t.literal || ''))}">${escHtml(t.term)}</span>`;
      pos = m.end;
    });
    out += escHtml(text.slice(pos));
    return out;
  }

  // Render Sidebar Corpus List
  function renderCorpusList() {
    if (!elements.corpusList || !state.data.corpus) return;
    const manifestItems = state.data.corpus_manifest && Array.isArray(state.data.corpus_manifest.items)
      ? state.data.corpus_manifest.items
      : [];
    // The manifest is bundled from data/corpus_manifest.json and is shared with
    // build_data_bundle.py. Keep a metadata fallback for an old cached bundle.
    const corpusMap = manifestItems.length > 0
      ? manifestItems.filter(item => item && state.data.corpus[item.key])
      : Object.keys(state.data.corpus).sort().map(key => {
          const doc = state.data.corpus[key] || {};
          return {
            key,
            title: `${doc.title_en || key} (${doc.title_zh || ''})`,
            cbeta: doc.cbeta_id || '—'
          };
        });

    // L1 (audit 2026-08-10, session 019feabb): the corpus sidebar now
    // honors a typed filter (state.corpusFilter). Uses the same
    // diacritic + variant normalization as the global search so
    // 'wumenguan' matches 'Wuménguān'. Empty filter shows the full manifest.
    const filterRaw = (state.corpusFilter || '').trim();
    const filteredMap = filterRaw
      ? corpusMap.filter(c => {
          const norm = normalizeForSearch(`${c.title} ${c.key} ${c.cbeta || ''}`);
          return norm.includes(normalizeForSearch(filterRaw));
        })
      : corpusMap;

    const perText = (state.data.project_metrics && state.data.project_metrics.corpus && state.data.project_metrics.corpus.per_text) || {};
    const groupOrder = [
      { key: 'complete_selected_witness', label: 'Complete witnesses' },
      { key: 'partial_selected_witness', label: 'Partial witnesses' },
      { key: 'excerpt_seed', label: 'Excerpt seeds' }
    ];
    const titleParts = (title) => {
      const match = stringValue(title).match(/^(.*?)\s*\(([^()]*)\)\s*$/);
      return match ? { en: match[1], zh: match[2] } : { en: stringValue(title), zh: '' };
    };
    const effectiveCompletionStatus = (key, metric) => {
      const completion = stringValue(metric.completion_status);
      const review = sourceReviewForCorpusKey(key);
      return isCompletionSourceReviewCompatible(completion, review.status)
        ? completion
        : (completion === 'complete_selected_witness' ? 'partial_selected_witness' : completion);
    };
    const renderCorpusRow = (c) => {
      const pt = perText[c.key] || {};
      const cov = stringValue(pt.coverage);
      const parts = titleParts(c.title);
      const complete = effectiveCompletionStatus(c.key, pt) === 'complete_selected_witness';
      const coverageMark = complete
        ? '<span class="corpus-status-mark is-complete" aria-label="Complete selected witness" title="Complete selected witness">✓</span>'
        : (cov ? `<span class="corpus-status-mark" aria-label="${escHtml(cov)} represented">${escHtml(cov.match(/^(\d+)\/(\d+)/)?.[0] || '•')}</span>` : '');
      return `<button class="corpus-btn ${c.key === state.currentCorpusKey ? 'active' : ''}" data-corpus-key="${escHtml(c.key)}">
        <span class="corpus-btn-text"><span class="corpus-title-en">${escHtml(parts.en)}</span>${parts.zh ? `<span class="corpus-title-zh" lang="zh">${escHtml(parts.zh)}</span>` : ''}</span>
        <span class="corpus-btn-meta">${coverageMark}<span class="corpus-badge">${escHtml(c.cbeta)}</span></span>
      </button>`;
    };
    if (filteredMap.length === 0) {
      elements.corpusList.innerHTML = '<p class="corpus-filter-empty">No works match <strong>' + escHtml(filterRaw) + '</strong>.</p>';
    } else {
      elements.corpusList.innerHTML = groupOrder.map(group => {
        const items = filteredMap.filter(item => effectiveCompletionStatus(item.key, perText[item.key] || {}) === group.key);
        if (!items.length) return '';
        return `<section class="corpus-group" data-completion-group="${group.key}">
          <h3 class="corpus-group-title"><span>${group.label}</span><span>${items.length}</span></h3>
          <div class="corpus-group-list">${items.map(renderCorpusRow).join('')}</div>
        </section>`;
      }).join('');
    }

    elements.corpusList.querySelectorAll('.corpus-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!setCurrentCorpusKey(btn.getAttribute('data-corpus-key'))) return;
        renderCorpusList();
        renderReader();
        const t = viewHash('reader', state.currentCorpusKey);
        if (location.hash !== t) { try { location.hash = t; } catch (e) { /* ignore */ } }
      });
    });

    // Mobile corpus picker mirrors the sidebar list (hidden on desktop)
    const mobileSelect = document.getElementById('corpus-mobile-select');
    if (mobileSelect) {
      mobileSelect.innerHTML = corpusMap.map(c => `
        <option value="${escHtml(c.key)}" ${c.key === state.currentCorpusKey ? 'selected' : ''}>${escHtml(c.title)} — ${escHtml(c.cbeta)}</option>
      `).join('');
    }
  }

  // ---- Canonical source-location disclosure ----
  function locatorDocumentForKey(key) {
    const registry = state.data.canonical_locators;
    const documents = registry && isRecord(registry.documents) ? registry.documents : {};
    return isRecord(documents[key]) ? documents[key] : null;
  }

  function locatorStatusLabel(status) {
    if (status === 'case_level_anchor') return 'Case-level canonical anchor';
    if (status === 'anchor_identified_not_collated') return 'Anchor identified — character-level collation pending';
    if (status === 'collated_with_normalization') return 'Collated with documented normalization — human sign-off pending';
    if (status === 'collated_with_variants') return 'Collated variant/selective wording — not source-checked';
    if (status === 'source_checked_excerpt') return 'Source-checked excerpt';
    if (status === 'legacy_document_seed') return 'Document-level seed locator — unit locator pending';
    return status ? stringValue(status) : 'Locator pending';
  }

  function unitLocatorForKey(key, unitKey) {
    const documentLocator = locatorDocumentForKey(key);
    const unitLocators = documentLocator && isRecord(documentLocator.unit_locators) ? documentLocator.unit_locators : {};
    const unit = isRecord(unitLocators[unitKey]) ? unitLocators[unitKey] : null;
    if (!unit) return documentLocator;
    return {
      ...documentLocator,
      ...unit,
      granularity: 'unit',
      source_note: stringValue(unit.note) || stringValue(documentLocator.source_note)
    };
  }

  function renderSourceLocationDisclosure(locator, label = 'Source location', className = '') {
    const entry = isRecord(locator) ? locator : {};
    const location = stringValue(entry.canonical_locator) || 'Locator pending';
    const detail = {
      title: `${label} disclosure`,
      rows: [
        ['Canonical location', location],
        ['Granularity', stringValue(entry.granularity) || 'Document level'],
        ['Status', locatorStatusLabel(entry.status)],
        ['Source edition', stringValue(entry.source_edition) || 'Edition/revision not recorded'],
        ['Collation', stringValue(entry.collation_note) || 'No character-level collation note recorded.'],
        ['Source note', stringValue(entry.source_note) || 'No additional locator note recorded.']
      ]
    };
    return `<div class="source-location ${className}"><span>${escHtml(label)}: ${escHtml(location)}</span>${renderCitationTrigger(detail, 'Details')}</div>`;
  }

  // (the document-level locator lives in the canonical-locator ledger of the Reader
  // header, which shows the same registry fields plus what a locator does not prove)

  const SOURCE_REVIEW_STATUS_LABELS = {
    collated_to_claimed_witness: 'Collated to claimed witness',
    partial_or_failed_w1_collation: 'Partial or failed W1 collation',
    witness_unavailable: 'Witness unavailable — not collated'
  };
  const SOURCE_REVIEW_STATUS_CLASSES = {
    collated_to_claimed_witness: 'is-collated',
    partial_or_failed_w1_collation: 'is-partial',
    witness_unavailable: 'is-unavailable'
  };

  function manifestItemForCorpusKey(corpusKey) {
    const items = state.data.corpus_manifest && Array.isArray(state.data.corpus_manifest.items)
      ? state.data.corpus_manifest.items
      : [];
    return items.find(item => isRecord(item) && item.key === corpusKey) || null;
  }

  function sourceReviewForCorpusKey(corpusKey) {
    const manifest = state.data.corpus_manifest;
    const item = manifestItemForCorpusKey(corpusKey);
    return {
      item,
      status: item ? stringValue(item.source_review_status) : '',
      evidence: isRecord(manifest && manifest.source_review) ? manifest.source_review : null
    };
  }

  function sourceReviewStatusLabel(status) {
    const value = stringValue(status);
    // Labels are generated (scripts/source_review.py → corpus.source_review.status_labels)
    // so the words a reader sees cannot drift from the vocabulary the validator enforces.
    const generated = sourceReviewAggregate().status_labels;
    if (isRecord(generated) && stringValue(generated[value])) return stringValue(generated[value]);
    if (Object.prototype.hasOwnProperty.call(SOURCE_REVIEW_STATUS_LABELS, value)) return SOURCE_REVIEW_STATUS_LABELS[value];
    return value ? `Unknown source-review status — validation required (${value})` : 'Source-review status unavailable — validation required';
  }

  // One rule, generated by scripts/source_review.py and published in
  // data/project_metrics.json (corpus.source_review.completion_compatibility). When the table is
  // present the runtime follows it verbatim; the literal fallback is the same rule, and
  // scripts/test_source_review_rules.py asserts the two agree. A complete-selected-witness claim
  // is only representable when the source was collated to its claimed witness.
  function isCompletionSourceReviewCompatible(completionStatus, sourceReviewStatus) {
    const table = state.data.project_metrics?.corpus?.source_review?.completion_compatibility;
    const row = isRecord(table) ? table[completionStatus] : undefined;
    if (isRecord(row) && Object.prototype.hasOwnProperty.call(row, sourceReviewStatus)) {
      return row[sourceReviewStatus] !== false;
    }
    if (isRecord(table) && Object.keys(table).length) {
      return completionStatus !== 'complete_selected_witness';
    }
    return completionStatus !== 'complete_selected_witness' || sourceReviewStatus === 'collated_to_claimed_witness';
  }

  function sourceReviewAggregate() {
    const block = state.data.project_metrics?.corpus?.source_review;
    return isRecord(block) ? block : {};
  }

  function ledgerSeparationNote() {
    return stringValue(sourceReviewAggregate().ledger_separation_note) || LEDGER_SEPARATION_NOTE;
  }

  function ledgerLabel(key, fallback) {
    const ledgers = Array.isArray(sourceReviewAggregate().disclosure_ledgers)
      ? sourceReviewAggregate().disclosure_ledgers : [];
    const found = ledgers.find(entry => isRecord(entry) && entry.key === key);
    return (found && stringValue(found.label)) || fallback;
  }

  // ---- Reader disclosure ledgers (five, always visible, never hover-only) ----
  //
  // Five different questions are answered by five separate blocks so that a collation
  // status can never be read as a "complete text" claim, an edition-verified quotation, or a
  // rights clearance. Each block carries machine-parseable attributes for the smoke test and
  // for anyone auditing the public surface:
  //   data-ledger                              which ledger this is
  //   data-source-review-status                exact W1 status (or "missing")
  //   data-evidence-date / -register / -report  dated evidence record behind the claim
  //   data-rights-status / data-represented-complete / data-locator-status
  // Labels come from data/project_metrics.json (generated from scripts/source_review.py).
  const DISCLOSURE_LEDGERS = [
    ['source_collation', 'Source collation (W1)'],
    ['represented_units', 'Represented units'],
    ['translation_edition_verification', 'Translation & edition verification'],
    ['canonical_locator', 'Canonical source locator'],
    ['rights_review', 'Rights review']
  ];
  const LEDGER_SEPARATION_NOTE = 'Separate ledgers: none of these answers implies another.';

  function ledgerBlock(key, label, rows, attrs = {}) {
    const className = stringValue(attrs.className) || 'ledger-block';
    const attributes = Object.entries(attrs)
      .filter(([name, value]) => name !== 'className' && value !== undefined && value !== null && value !== '')
      .map(([name, value]) => ` data-${name}="${escHtml(String(value))}"`)
      .join('');
    const body = rows
      .filter(row => Array.isArray(row) && row.length >= 2 && row[1] !== '' && row[1] != null)
      .map(([term, value]) => `<div class="ledger-row"><span class="ledger-key">${escHtml(term)}</span>`
        + `<span class="ledger-value">${value}</span></div>`)
      .join('');
    return `<div class="${escHtml(className)}" data-ledger="${key}"${attributes}>`
      + `<h4 class="ledger-name">${escHtml(label)}</h4><div class="ledger-rows">${body}</div></div>`;
  }

  function ledgerText(value) {
    return escHtml(stringValue(value));
  }

  function ledgerCode(value) {
    return `<code class="ledger-code">${escHtml(stringValue(value))}</code>`;
  }

  const translationSlotCache = new Map();
  function documentTranslationSlots(doc, cacheKey) {
    // Every {status, source?} translation register in the document, the same population the
    // validator counts as "corpus slots". Walked instead of stored because the answer must
    // describe the text on screen even if a summary field were stale.
    if (cacheKey && translationSlotCache.has(cacheKey)) return translationSlotCache.get(cacheKey);
    const found = [];
    const seen = new Set();
    const walk = (node, depth) => {
      if (depth > 8 || seen.has(node) || (!Array.isArray(node) && !isRecord(node))) return;
      if (isRecord(node)) seen.add(node);
      if (Array.isArray(node)) { node.forEach(child => walk(child, depth + 1)); return; }
      for (const [name, value] of Object.entries(node)) {
        if (name === 'translations' && isRecord(value)) {
          for (const [translator, entry] of Object.entries(value)) {
            if (typeof entry === 'string') { found.push({ translator, status: 'legacy_string', source: null }); continue; }
            if (!isRecord(entry)) continue;
            found.push({ translator, status: stringValue(entry.status) || 'status_pending', source: isRecord(entry.source) ? entry.source : null });
          }
        }
        walk(value, depth + 1);
      }
    };
    walk(doc, 0);
    if (cacheKey) translationSlotCache.set(cacheKey, found);
    return found;
  }

  function renderSourceCollationLedger(corpusKey) {
    const review = sourceReviewForCorpusKey(corpusKey);
    const evidence = review.evidence || {};
    const status = review.status;
    const label = sourceReviewStatusLabel(status);
    const perText = state.data.project_metrics?.corpus?.per_text?.[corpusKey] || {};
    const ledger = sourceReviewAggregate();
    const record = isRecord(perText.source_review) ? perText.source_review : {};
    const authoritative = isRecord(ledger.authoritative) ? ledger.authoritative : {};
    const historical = isRecord(ledger.historical) ? ledger.historical : {};
    const verification = isRecord(ledger.reference_verification) ? ledger.reference_verification : {};
    const collated = Number.isInteger(record.content_fields_collated) ? record.content_fields_collated : null;
    const total = Number.isInteger(record.content_fields_total) ? record.content_fields_total : null;
    const witnessRefs = Array.isArray(record.witness_refs) ? record.witness_refs : [];
    const refsVerified = Number.isInteger(record.refs_verified) ? record.refs_verified : null;
    const refsTotal = Number.isInteger(record.refs_total) ? record.refs_total : null;
    const rows = [
      ['Status', `<span class="ledger-status ledger-status-${status || 'missing'}">${ledgerText(label)}</span> `
        + ledgerCode(status || 'missing')],
      ['Evidence date', ledgerText(record.evidence_date || evidence.correction_evidence_date || evidence.evidence_date)],
      ['Authoritative register', ledgerText(authoritative.register_path || evidence.correction_register_path
        || evidence.w1_register_path)],
      ['Correction report', ledgerText(authoritative.report_path || evidence.correction_report_path)],
      ['Historical register', ledgerText(historical.register_path || evidence.w1_register_path)],
      ['Witness claimed', witnessRefs.length ? witnessRefs.map(ledgerCode).join(' ') : ledgerText('none — no CBETA witness claimed in the corpus record')],
      ['Reference digests', refsTotal && refsTotal > 0
        ? ledgerText(`${refsVerified}/${refsTotal} claimed witness reference(s) byte-verified`)
        : ledgerText('no claimed witness to verify')],
      ['Content fields collating', collated !== null && total
        ? ledgerText(`${collated}/${total} source-content fields; ${record.flagged_entries ?? 0} flagged`)
        : ledgerText('field-level evidence pending')],
      ['Scope', ledgerText(evidence.status_scope || sourceReviewAggregate().status_scope
        || 'Containment/remediation state, not a rights decision.')],
      ['Reuse', ledgerText(sourceReviewAggregate().non_approval_statement || 'Source collation does not approve reuse.')],
      ['Metadata excluded', ledgerText(sourceReviewAggregate().metadata_field_note || '')]
    ];
    if (typeof record.witness_note === 'string' && record.witness_note) {
      rows.push(['Collation note', ledgerText(record.witness_note)]);
    }
    const statusClass = SOURCE_REVIEW_STATUS_CLASSES[status] || 'is-unavailable';
    return ledgerBlock('source_collation', ledgerLabel('source_collation', 'Source collation (W1)'), rows, {
      'source-review-status': status || 'missing',
      'evidence-date': record.evidence_date || evidence.correction_evidence_date || evidence.evidence_date,
      'evidence-register': authoritative.register_path || evidence.correction_register_path || evidence.w1_register_path,
      'evidence-report': authoritative.report_path || evidence.correction_report_path || evidence.w1_report_path,
      'reference-verification': verification.counts
        ? `${verification.counts.verified ?? 0}verified${(verification.drifted_refs || []).length ? `-with-${verification.drifted_refs.length}-documented-drift` : ''}`
        : 'not-recorded',
      'className': `ledger-block source-review-disclosure ${statusClass}`
    });
  }

  function renderRepresentedUnitsLedger(corpusKey) {
    const doc = state.data.corpus && state.data.corpus[corpusKey];
    const perText = state.data.project_metrics?.corpus?.per_text?.[corpusKey] || {};
    const UNIT_LABELS = {
      cases: 'cases', sections: 'sections', dialogues: 'dialogues', stanzas: 'stanzas',
      chapters: 'chapters', five_ranks: 'five ranks', sample_records: 'sample records'
    };
    const unitCounts = isRecord(perText.unit_counts) ? perText.unit_counts : {};
    const unitSummary = Object.entries(unitCounts).map(([name, value]) => `${value} ${UNIT_LABELS[name] || name}`).join(' · ');
    const represented = stringValue(perText.coverage);
    const completionStatus = stringValue(perText.completion_status) || 'excerpt_seed';
    const review = sourceReviewForCorpusKey(corpusKey);
    const compatible = isCompletionSourceReviewCompatible(completionStatus, review.status);
    const statusLabels = {
      complete_selected_witness: 'Complete selected witness',
      partial_selected_witness: 'Partial selected witness',
      excerpt_seed: 'Excerpt seed'
    };
    const rows = [
      ['Units present', ledgerText(unitSummary || 'no unit containers in this document')],
      ['Declared coverage', represented ? ledgerText(represented) : ledgerText('no unit targets declared')],
      ['Editorial status', compatible
        ? ledgerText(statusLabels[completionStatus] || 'Editorial status pending')
        : `<span class="ledger-alert">${ledgerText('Completion/status conflict — validation required')}</span>`],
      ['Reading', doc && stringValue(doc.coverage_note)
        ? ledgerText(doc.coverage_note)
        : ledgerText('Excerpt-scale seed: the full canonical text is not yet ingested (Phase 2).')],
      ['Meaning', ledgerText('Representation labels count containers present in this project; '
        + 'they never establish that the source text is complete, and they are not the W1 collation verdict.')]
    ];
    return ledgerBlock('represented_units', ledgerLabel('represented_units', 'Represented units'), rows, {
      'represented-complete': represented && completionStatus === 'complete_selected_witness' && compatible ? 'true' : 'false',
      'completion-status': completionStatus,
      'className': 'ledger-block coverage-disclosure'
    });
  }

  function renderTranslationVerificationLedger(corpusKey) {
    const doc = state.data.corpus && state.data.corpus[corpusKey];
    const slots = documentTranslationSlots(doc, corpusKey);
    const counts = new Map();
    for (const slot of slots) counts.set(slot.status, (counts.get(slot.status) || 0) + 1);
    const verified = slots.filter(slot => slot.status === 'verified_quotation');
    const editions = [];
    for (const slot of verified) {
      const work = slot.source && stringValue(slot.source.work);
      const edition = slot.source && stringValue(slot.source.edition);
      const verification = slot.source && stringValue(slot.source.verification);
      const token = `${work || ''}|${edition || ''}|${verification || ''}`;
      if (!work && !edition) continue;
      if (editions.some(entry => entry.token === token)) continue;
      editions.push({ token, label: [work, edition, verification].filter(Boolean).join(' — ') });
    }
    const statusList = [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]))
      .map(([status, count]) => `${count} ${status}`).join(' · ');
    const rows = [
      ['Translation registers', ledgerText(statusList || 'no translation registers in this document')],
      ['Edition-verified quotations', ledgerText(`${verified.length} of ${slots.length} slot(s) carry wording checked against a recorded edition`)],
      ['Checked against', editions.length
        ? editions.slice(0, 3).map(entry => ledgerText(entry.label)).join('<br>')
        : ledgerText('no edition citation recorded for this document yet')],
      ['Meaning', ledgerText('Whether a rendering matches a printed edition. This is not source collation '
        + '(the Classical Chinese is checked separately above) and not a rights clearance.')]
    ];
    return ledgerBlock('translation_edition_verification',
      ledgerLabel('translation_edition_verification', 'Translation & edition verification'), rows, {
        'translation-slots': slots.length,
        'verified-quotations': verified.length,
        'className': 'ledger-block translation-verification-ledger'
      });
  }

  function renderCanonicalLocatorLedger(corpusKey) {
    const registry = state.data.canonical_locators;
    const entry = locatorDocumentForKey(corpusKey) || {};
    const caseLocators = isRecord(entry.case_locators) ? entry.case_locators : {};
    const unitLocators = isRecord(entry.unit_locators) ? entry.unit_locators : {};
    const caseCount = Object.keys(caseLocators).length;
    const unitCount = Object.keys(unitLocators).length;
    const rows = [
      ['Canonical id', entry.canonical_id ? ledgerCode(entry.canonical_id) : ledgerText('not recorded')],
      ['Locator', entry.canonical_locator ? ledgerText(entry.canonical_locator) : ledgerText('Locator pending')],
      ['Granularity', ledgerText(stringValue(entry.granularity) === 'document'
        ? 'Document level (unit anchors pending)' : (stringValue(entry.granularity) || 'Document level'))],
      ['Registry status', ledgerText(locatorStatusLabel(entry.status))],
      ['Unit anchors', ledgerText(`${caseCount || unitCount} case/unit anchor(s) recorded in data/canonical_locators.json`)],
      ['Edition', ledgerText(stringValue(entry.source_edition) || 'Edition/revision not recorded')],
      ['Collation note', ledgerText(stringValue(entry.collation_note) || 'No character-level collation note recorded.')],
      ['Meaning', ledgerText('Where a reader can find the text in the canon. A locator identifies a place; it '
        + 'does not prove the wording was checked there — that is the collation ledger.')]
    ];
    return ledgerBlock('canonical_locator', ledgerLabel('canonical_locator', 'Canonical source locator'), rows, {
      'locator-status': stringValue(entry.status) || 'pending',
      'locator-granularity': stringValue(entry.granularity) || 'document',
      'registry': isRecord(registry) ? 'canonical_locators' : undefined,
      'className': 'ledger-block locator-ledger'
    });
  }

  function renderRightsLedger(corpusKey) {
    const doc = state.data.corpus && state.data.corpus[corpusKey];
    const slots = documentTranslationSlots(doc, corpusKey);
    const sourceIds = [...new Set(slots.map(slot => slot.source && stringValue(slot.source.source_id)).filter(Boolean))];
    const records = sourceIds.map(id => ({ id, record: rightsRecordFor(id) })).filter(entry => isRecord(entry.record));
    const policy = state.data.translations_rights && stringValue(state.data.translations_rights.policy);
    const statuses = [...new Set(records.map(entry => stringValue(entry.record.rights_status) || 'status_pending'))];
    const reviews = [...new Set(records.map(entry => stringValue(entry.record.review_status) || 'review_pending'))];
    const rows = [
      ['Sources with rights records', records.length
        ? records.map(entry => `${ledgerCode(entry.id)} ${ledgerText(stringValue(entry.record.rights_status) || 'status_pending')}`
          + ` · ${ledgerText(stringValue(entry.record.review_status) || 'review_pending')}`).join('<br>')
        : ledgerText('no rights record is attached to this document’s quotation sources yet')],
      ['Rights status', ledgerText(statuses.length ? statuses.join(', ') : 'not yet reviewed for these sources')],
      ['Review status', ledgerText(reviews.length ? reviews.join(', ') : 'editorial and jurisdictional review pending')],
      ['Redistribution', ledgerText(records.length
        ? stringValue(records[0].record.redistribution_policy) || 'policy not recorded'
        : 'no per-source policy resolved yet')],
      ['Policy', ledgerText(policy || 'rights_manifest.json policy unavailable')],
      ['Meaning', ledgerText('A separate editorial and jurisdictional question. Nothing in this panel is legal '
        + 'advice, a licence grant, or approval to reuse.')]
    ];
    return ledgerBlock('rights_review', ledgerLabel('rights_review', 'Rights review'), rows, {
      'rights-status': statuses.length ? statuses[0] : 'pending',
      'rights-records': records.length,
      'className': 'ledger-block rights-ledger'
    });
  }

  function renderDocumentLedgers(corpusKey, doc = {}) {
    const blocks = [
      renderSourceCollationLedger(corpusKey),
      renderRepresentedUnitsLedger(corpusKey),
      renderTranslationVerificationLedger(corpusKey),
      renderCanonicalLocatorLedger(corpusKey),
      renderRightsLedger(corpusKey)
    ];
    const canon = escHtml(stringValue(doc.cbeta_id) || 'Not recorded') +
      ((/T\d{4}/.test(stringValue(doc.cbeta_id)) && doc.taisho_vol) ? ` · Vol. ${escHtml(doc.taisho_vol)}` : '');
    const editionDetails = `<details class="document-details">
            <summary>Edition details</summary>
            <dl>
              <div><dt>Canon</dt><dd>${canon}</dd></div>
              <div><dt>Author</dt><dd>${escHtml(doc.author_zh || '')}</dd></div>
              <div><dt>Era</dt><dd>${escHtml(doc.era || '')}</dd></div>
              <div><dt>Genre</dt><dd>${escHtml(doc.genre || '')}</dd></div>
            </dl>
          </details>`;
    // One drawer holds the set: the five blocks stay visible inside it (a drawer
    // is a container, not a toggle — the separation note below repeats the
    // rule the CSS cannot enforce). Edition metadata is the one line that
    // expands on demand.
    return `<div class="ledger-drawer" data-ledger-count="${blocks.length}" aria-label="About this edition — document disclosure ledgers">`
      + `<div class="ledger-drawer-head"><h3 class="ledger-drawer-title">About this edition</h3>`
      + `<span class="ledger-drawer-hint">${blocks.length} separate ledgers — a calmer set, not a quieter one</span></div>`
      + `<div class="document-ledgers">${blocks.join('')}</div>`
      + `<p class="ledger-footnote">${escHtml(ledgerSeparationNote())}</p>`
      + editionDetails
      + `</div>`;
  }

  // Phase 5 — Info section for every WORK (common qualities: where it came
  // from, what/who is related, background context; collapsed by default so the
  // default view stays light on mental load; plain-language, piece-meal).
  // Built only from existing data fields — no invented Classical Chinese.
  // Related teachers: masters whose curated corpus links include this work.
  function relatedTeachersForCorpusKey(corpusKey) {
    const masters = Array.isArray(state.data.lineage) ? state.data.lineage : [];
    return masters.filter(m => Array.isArray(m.linked_corpus_keys) && m.linked_corpus_keys.includes(corpusKey));
  }

  // The three plain-language info rows for a WORK (where it came from, what/
  // who is related, background) — split out from the <details> wrapper so
  // bundle-026 layouts can reuse them (tabs pane, modal, hover cards). Built
  // only from existing data fields (no invented Chinese).
  function workContextRows(corpusKey) {
    const doc = state.data.corpus && state.data.corpus[corpusKey];
    if (!doc) return '';
    const manifestItem = manifestItemForCorpusKey(corpusKey);
    const metrics = state.data.project_metrics?.corpus?.per_text?.[corpusKey] || {};
    const cbeta = stringValue(doc.cbeta_id || (manifestItem && manifestItem.cbeta)) || 'Not recorded';
    const coverage = stringValue(metrics.coverage) || 'representation not recorded';
    const related = relatedTeachersForCorpusKey(corpusKey);
    const relatedHtml = related.length
      ? related.map(m => `<button class="btn-pill teacher-link" data-master-teacher="${escHtml(m.id)}">${escHtml(masterDisplayName(m))}</button>`).join(' ')
      : '<span>Not yet linked to a profiled teacher in this project.</span>';
    const background = related.length
      ? `This text is part of the Chan / Zen corpus held in this project. It is shown here alongside ${related.length} related teacher profile${related.length === 1 ? '' : 's'}, and as an excerpt-scale seed unless its editorial status states otherwise.`
      : `This text is part of the Chan / Zen corpus held in this project. It is shown here as an excerpt-scale seed unless its editorial status states otherwise.`;
    return `    <div class="context-row"><div class="context-label">Where it came from</div><div class="context-text">Drawn from the CBETA canon witness ${escHtml(cbeta)}. Recorded coverage here: ${escHtml(coverage)}. The Classical Chinese is the source; English renderings are separate and clearly marked.</div></div>\n` +
      `    <div class="context-row"><div class="context-label">Related teachers</div><div class="context-text">${relatedHtml}</div></div>\n` +
      `    <div class="context-row"><div class="context-label">Background</div><div class="context-text">${escHtml(background)}</div></div>\n`;
  }

  function renderWorkContext(corpusKey) {
    const doc = state.data.corpus && state.data.corpus[corpusKey];
    if (!doc) return '';
    return `<details class="context-info work-context">\n` +
      `  <summary>About this work — context</summary>\n` +
      `  <div class="context-info-body">\n` +
      workContextRows(corpusKey) +
      `  </div>\n` +
      `</details>`;
  }

  // Phase 5 — Info section for every TEACHER (common qualities: where they came
  // from, who they are related to, background context). Built only from existing
  // data fields — no invented Classical Chinese.
  // The three plain-language info rows for a TEACHER — see workContextRows.
  function teacherContextRows(master) {
    const teacher = (state.data.lineage || []).find(m => m && m.id === master.teacher);
    const disciples = Array.isArray(master.disciples) ? master.disciples : [];
    const discipleNames = disciples
      .map(id => (state.data.lineage || []).find(m => m.id === id))
      .filter(Boolean)
      .map(m => escHtml(masterDisplayName(m)));
    const relatedWorks = Array.isArray(master.linked_corpus_keys)
      ? master.linked_corpus_keys.filter(k => state.data.corpus && state.data.corpus[k])
      : [];
    const relatedHtml = relatedWorks.length
      ? relatedWorks.map(k =>
          `<button class="btn-pill" data-open-doc="${escHtml(k)}">${escHtml((state.data.corpus_manifest?.items || []).find(i => i.key === k)?.title || k)}</button>`
        ).join(' ')
      : '<span>No linked project work yet.</span>';
    const teacherHtml = teacher
      ? `<button class="btn-pill teacher-link" data-master-teacher="${escHtml(teacher.id)}">${escHtml(masterDisplayName(teacher))}</button>`
      : `<span>${escHtml(master.teacher || 'Frontier — teacher not yet profiled')}</span>`;
    const disciplesHtml = discipleNames.length ? discipleNames.join(', ') : 'No profiled disciples in this project';
    const summary = stringValue(master.summary) || 'No background summary recorded.';
    return `    <div class="context-row"><div class="context-label">Where they came from</div><div class="context-text">${escHtml(master.name_zh)} — ${escHtml(master.dates || 'dates not recorded')} · ${escHtml(master.era || 'era not recorded')} · ${escHtml(master.location || 'location not recorded')}. Lineage depth: generation ${escHtml(String(master.lineage_depth))}.</div></div>\n` +
      `    <div class="context-row"><div class="context-label">Who they are related to</div><div class="context-text">Teacher: ${teacherHtml}. Disciples profiled here: ${escHtml(discipleNames.length ? disciplesHtml : 'none')}.</div></div>\n` +
      `    <div class="context-row"><div class="context-label">Background</div><div class="context-text">${escHtml(summary)} Linked project works: ${relatedHtml}</div></div>\n`;
  }

  function renderTeacherContext(master) {
    return `<details class="context-info teacher-context">\n` +
      `  <summary>About this teacher — context</summary>\n` +
      `  <div class="context-info-body">\n` +
      teacherContextRows(master) +
      `  </div>\n` +
      `</details>`;
  }

  function renderCaseSourceDisclosure(caseNum) {
    const documentLocator = locatorDocumentForKey(state.currentCorpusKey);
    const caseLocators = documentLocator && isRecord(documentLocator.case_locators) ? documentLocator.case_locators : {};
    const caseLocator = isRecord(caseLocators[String(caseNum)]) ? caseLocators[String(caseNum)] : null;
    const locator = caseLocator ? {
      ...documentLocator,
      canonical_locator: caseLocator.canonical_locator,
      granularity: 'case',
      status: caseLocator.status,
      source_note: documentLocator.source_note
    } : documentLocator;
    return renderSourceLocationDisclosure(locator, 'Case source', 'case-source-location');
  }

  function matrixLocatorForReference(sourceRef) {
    const documents = state.data.canonical_locators && isRecord(state.data.canonical_locators.documents)
      ? state.data.canonical_locators.documents
      : {};
    const reference = stringValue(sourceRef);
    const tokens = reference.match(/(?:T|X)\d{4}[A-Z]?|P\.\d+/g) || [];
    for (const token of tokens) {
      const match = Object.values(documents).find(entry => isRecord(entry) && stringValue(entry.canonical_id).includes(token));
      if (match) {
        const caseMatch = reference.match(/Case\s+(\d+)/i);
        const caseLocators = isRecord(match.case_locators) ? match.case_locators : {};
        const caseLocator = caseMatch && isRecord(caseLocators[caseMatch[1]]) ? caseLocators[caseMatch[1]] : null;
        return caseLocator ? {
          ...match,
          canonical_locator: caseLocator.canonical_locator,
          granularity: 'case',
          status: caseLocator.status
        } : match;
      }
    }
    return null;
  }

  // Provenance notes are the corpus's honesty mechanism for a passage: they record
  // which recension a text belongs to and whether it is verbatim or a project
  // précis (`recension_note`), which field carries no witness attribution
  // (`editorial_note`), and which citation was corrected (`cbeta_note`). The
  // corpus carries 49 of them; the reader used to show exactly one (a single
  // verse-level site), so the rest of the honesty mechanism never reached anyone.
  // One shared renderer keeps the muted-note treatment already used there — same
  // markup shape, same ℹ️ affordance, same escHtml path — identical at every
  // node, and keeps precedence in exactly one place: recension → editorial →
  // cbeta, each on its own line, never concatenated into one sentence, because
  // the three keys were introduced deliberately and mean different things.
  // `coverage_note` is intentionally absent from this list: it is a dossier
  // ledger field, not a passage label, and already renders as the "Reading" row
  // of the represented-units ledger in the document header.
  const PROVENANCE_NOTE_KEYS = ['recension_note', 'editorial_note', 'cbeta_note'];

  function renderProvenanceNoteLine(note) {
    // Missing, empty, whitespace-only or non-string ⇒ render nothing at all.
    if (typeof note !== 'string') return '';
    const text = note.trim();
    if (!text) return '';
    return `<div class="provenance-line">ℹ️ ${escHtml(text)}</div>`;
  }

  function renderProvenanceNotes(node) {
    if (!isRecord(node)) return '';
    return PROVENANCE_NOTE_KEYS.map(key => renderProvenanceNoteLine(node[key])).join('');
  }

  function renderUnitTitle(titleEn, titleZh, kicker = '') {
    return `${kicker ? `<span class="case-heading-kicker">${escHtml(kicker)}</span>` : ''}` +
      `<span class="case-heading-en">${escHtml(titleEn || titleZh || 'Untitled unit')}</span>` +
      `${titleZh ? `<span class="case-heading-zh" lang="zh">${escHtml(titleZh)}</span>` : ''}`;
  }

  // Render Reader View
  function renderReader() {
    if (!elements.readerContent || !state.data.corpus) return;
    elements.readerContent.dataset.mode = state.readerMode; // drives chinese_only CSS hiding of pinyin/translations
    applyPinyinVisibility(); // dataset.showPinyin drives mobile pinyin hiding
    const doc = state.data.corpus[state.currentCorpusKey];
    if (!doc) {
      elements.readerContent.innerHTML = '<p>Corpus document loading...</p>';
      return;
    }

    // Long case collections use one horizontal rail; titles stay available to
    // focus/hover without turning 48–100 chips into a multi-row sticky wall.
    const caseStrip = (Array.isArray(doc.cases) && doc.cases.length >= 10)
      ? `<div class="case-jump-strip" id="case-jump-strip" aria-label="Case index">
           <span class="case-strip-label">Cases</span>
           ${doc.cases.map(c => {
             const title = escHtml(c.title_zh || '');
             const num = escHtml(c.case_num);
             return `<button class="case-chip" data-jump-case="${num}" title="第${num}則 ${title}" aria-label="Jump to case ${num}${title ? ': ' + title : ''}"><span class="case-chip-num">${num}</span><span class="case-chip-title">${title}</span></button>`;
           }).join('')}
         </div>`
      : '';

    const docMetric = state.data.project_metrics?.corpus?.per_text?.[state.currentCorpusKey] || {};
    const sourceReview = sourceReviewForCorpusKey(state.currentCorpusKey);
    const statusLabels = {
      complete_selected_witness: 'Complete witness',
      partial_selected_witness: 'Partial witness',
      excerpt_seed: 'Excerpt seed'
    };
    const completionCompatible = isCompletionSourceReviewCompatible(docMetric.completion_status, sourceReview.status);
    const editorialStatus = completionCompatible
      ? (statusLabels[docMetric.completion_status] || 'Editorial status pending')
      : 'Completion/status conflict — validation required';
    let html = `
      <header class="text-header document-heading">
        <nav class="reader-breadcrumb" aria-label="Reader breadcrumb">
          <a href="#/reader" data-nav-link>Reader</a>
          <span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-current">${escHtml(doc.cbeta_id || '')}</span>
        </nav>
        <div class="document-title-row">
          <div>
            <p class="section-kicker">Selected work · ${escHtml(doc.cbeta_id || 'Source pending')}</p>
            <h1 class="text-title-zh"><span>${escHtml(doc.title_en)}</span><small lang="zh">${escHtml(doc.title_zh)}</small></h1>
            <p class="text-title-en">${escHtml(doc.title_pinyin)}</p>
          </div>
          <span class="document-status">${escHtml(editorialStatus)}</span>
          ${marginDoor(`work:${state.currentCorpusKey}`, 'Work dossier', 'document-dossier-btn')}
        </div>
        ${renderDocumentLedgers(state.currentCorpusKey, doc)}
        ${renderWorkContext(state.currentCorpusKey)}
        ${renderProvenanceNotes(doc)}
      </header>
      ${caseStrip}
    `;

    // Front matter remains intact but no longer blocks the first case on entry.
    if (doc.preface) {
      html += `
        <details class="front-matter">
          <summary><span lang="zh">序</span> / Front matter</summary>
          <div class="front-matter-content">
            <div class="classical-zh" lang="zh">${annotateClassicalChinese(doc.preface.zh)}</div>
            <div class="pinyin-line">${escHtml(doc.preface.pinyin)}</div>
            ${renderFlatTranslationColumns([
              { key: 'red_pine', name: 'Red Pine', text: doc.preface.en_red_pine || doc.preface.en_cleary || '' },
              { key: 'cleary', name: 'Thomas Cleary', text: doc.preface.en_cleary || '' },
              { key: 'sasaki', name: 'Ruth Fuller Sasaki', text: doc.preface.en_sasaki || '' }
            ], { zh: doc.preface.zh, locator: locatorDocumentForKey(state.currentCorpusKey) })}
            ${renderProvenanceNotes(doc.preface)}
          </div>
        </details>
      `;
    }

    // Build the epilogue now but append it only after the document's units.
    // It previously appeared between the preface and Case 1.
    const epilogueHtml = doc.epilogue ? `
      <div class="case-card is-epilogue">
        <div class="case-header">
          <h2 class="case-num-title">${renderUnitTitle("Wumen's Epilogue & Gatha", '後序與結頌', 'End matter')}</h2>
        </div>
        <div class="classical-zh" lang="zh">${annotateClassicalChinese(doc.epilogue.zh)}</div>
        <div class="pinyin-line">${escHtml(doc.epilogue.pinyin)}</div>
        ${renderFlatTranslationColumns([
          { key: 'red_pine', name: 'Red Pine', text: doc.epilogue.en_red_pine || '' },
          { key: 'cleary', name: 'Thomas Cleary', text: doc.epilogue.en_cleary || '' },
          { key: 'sasaki', name: 'Ruth Fuller Sasaki', text: doc.epilogue.en_sasaki || '' }
        ], { zh: doc.epilogue.zh, locator: locatorDocumentForKey(state.currentCorpusKey) })}
        ${renderProvenanceNotes(doc.epilogue)}
      </div>` : '';

    if (doc.cases && doc.cases.length > 0) {
      const total = doc.cases.length;
      const CASE_CHUNK = 12;
      const limit = state.caseLimit[state.currentCorpusKey] || (total > CASE_CHUNK ? CASE_CHUNK : total);
      doc.cases.slice(0, limit).forEach((caseItem, i) => {
        html += renderCaseItem(caseItem, i, doc.cases);
      });
      if (limit < total) {
        // U2 (audit 2026-08-10, session 019feabb): offer 12/24/all segmented
        // control so a scholar studying a long text can jump to a chapter
        // instead of clicking "Show more" repeatedly.
        const remaining = total - limit;
        const nextChunk = Math.min(CASE_CHUNK, remaining);
        const nextAll = total - limit;
        html += `
          <div class="case-load-more" data-case-total="${total}">
            <button id="case-load-more-btn" class="btn-primary" aria-label="Show more cases" data-load-step="${nextChunk}">
              Show more cases — ${limit} of ${total} · +${nextChunk}
            </button>
            <div class="case-load-more-segmented" role="group" aria-label="Show more cases (segmented)">
              <button class="btn-pill" data-load-target="${Math.min(total, limit + 12)}" aria-label="Show 12 more cases">+12</button>
              <button class="btn-pill" data-load-target="${Math.min(total, limit + 24)}" aria-label="Show 24 more cases">+24</button>
              <button class="btn-pill" data-load-target="${total}" aria-label="Show all ${total - limit} remaining cases">all (${total - limit})</button>
            </div>
          </div>`;
      }
    }

    if (doc.sections && doc.sections.length > 0) {
      // Lazy-render long sections documents (complete-text Linji has 88 units)
      const secTotal = doc.sections.length;
      const SEC_CHUNK = 12;
      const secLimit = state.caseLimit[state.currentCorpusKey] || (secTotal > SEC_CHUNK ? SEC_CHUNK : secTotal);
      doc.sections.slice(0, secLimit).forEach(sec => {
        html += renderSectionItem(sec);
      });
      if (secLimit < secTotal) {
        const remaining = secTotal - secLimit;
        html += `
          <div class="case-load-more" data-case-total="${secTotal}">
            <button id="case-load-more-btn" class="btn-primary" aria-label="Show more sections" data-load-step="${Math.min(SEC_CHUNK, remaining)}">
              Show more sections — ${secLimit} of ${secTotal} · +${Math.min(SEC_CHUNK, remaining)}
            </button>
            <div class="case-load-more-segmented" role="group" aria-label="Show more sections (segmented)">
              <button class="btn-pill" data-load-target="${Math.min(secTotal, secLimit + 12)}" aria-label="Show 12 more sections">+12</button>
              <button class="btn-pill" data-load-target="${Math.min(secTotal, secLimit + 24)}" aria-label="Show 24 more sections">+24</button>
              <button class="btn-pill" data-load-target="${secTotal}" aria-label="Show all ${secTotal - secLimit} remaining sections">all (${secTotal - secLimit})</button>
            </div>
          </div>`;
      }
    }

    if (doc.dialogues && doc.dialogues.length > 0) {
      doc.dialogues.forEach(dia => {
        html += renderDialogueItem(dia);
      });
    }

    if (doc.stanzas && doc.stanzas.length > 0) {
      doc.stanzas.forEach(st => {
        html += renderStanzaItem(st);
      });
    }

    // Render Sample Records (e.g. Chuandenglu)
    // Render Five Ranks (e.g. Dongshan Yulu)
    if (doc.five_ranks && doc.five_ranks.length > 0) {
      html += `
        <div class="case-card is-ranks">
          <h2 class="case-num-title">☯️ 曹洞宗五位君臣綱宗 / The Dialectic of the Five Ranks</h2>
          <div class="sheet-overview">${escHtml(doc.overview || '')}</div>
        </div>
      `;

      doc.five_ranks.forEach(r => {
        html += `
          <div class="case-card" data-unit-ref="five_ranks:${escHtml(r.rank_num)}">
            <div class="case-header">
              <h2 class="case-num-title">第 ${escHtml(r.rank_num)} 位：${escHtml(r.name_zh)} (${escHtml(r.name_en)})</h2>
              <span class="case-speaker">${escHtml(r.symbol)}</span>
            </div>
            <div class="classical-zh" lang="zh">${annotateClassicalChinese(r.verse_zh)}</div>
            <div class="pinyin-line">${escHtml(r.verse_pinyin)}</div>
            ${renderTranslationColumns(r.translations, r.verse_zh)}
            <div class="commentary-block is-caoshan">
              <div class="commentary-label is-green">曹山註解 / Caoshan Commentary</div>
              <div class="classical-zh is-secondary" lang="zh">${annotateClassicalChinese(r.commentary_zh)}</div>
              ${r.commentary_en && state.readerMode !== 'chinese_only' ? `<div class="prose-en is-small">${escHtml(r.commentary_en)}</div>${renderProjectDraftDisclosure('Commentary: project AI draft', { zh: r.commentary_zh, locator: locatorDocumentForKey(state.currentCorpusKey) })}` : ''}
            </div>
            ${renderProvenanceNotes(r)}
          </div>
        `;
      });
    }

    // Render canonical scope / overview card (e.g. Chuandenglu architecture, Platform Sutra coverage)
    // (skipped when a five_ranks block is present — it already surfaces doc.overview)
    if (doc.overview && !doc.five_ranks) {
      html += `
        <div class="case-card is-architecture">
          <h2 class="case-num-title">📚 Canonical Architecture & Scope</h2>
          <div class="sheet-overview is-bright">${escHtml(doc.overview)}</div>
          ${doc.fascicle_structure ? `
            <div class="fascicle-grid">
              ${doc.fascicle_structure.map(f => `
                <div class="fascicle-cell">
                  <strong>卷 ${escHtml(f.fascicle)}:</strong> ${escHtml(f.scope)}
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `;
    }

    // Render Sample Records (e.g. Chuandenglu)
    if (doc.sample_records && doc.sample_records.length > 0) {
      doc.sample_records.forEach(rec => {
        let diaHtml = rec.dialogue.map(d => `
          <div class="dialogue-turn">
            <div class="case-speaker">${escHtml(d.speaker)}</div>
            <div class="classical-zh" lang="zh">${annotateClassicalChinese(d.zh)}</div>
            <div class="pinyin-line">${escHtml(d.pinyin)}</div>
            ${renderTranslationColumns(d.translations, d.zh)}
            ${renderProvenanceNotes(d)}
          </div>
        `).join('');

        html += `
          <div class="case-card">
            <div class="case-header">
              <h2 class="case-num-title">卷 ${escHtml(rec.fascicle)} 傳燈本則：${escHtml(rec.title_zh)}</h2>
              <span class="case-speaker">${escHtml(rec.title_en)}</span>
            </div>
            ${diaHtml}
            ${renderProvenanceNotes(rec)}
          </div>
        `;
      });
    }

    // Render Chapters (e.g. Platform Sutra)
    if (doc.chapters && doc.chapters.length > 0) {
      doc.chapters.forEach(ch => {
        html += renderChapterItem(ch);
      });
    }

    // End matter belongs after all rendered source units.
    html += epilogueHtml;
    elements.readerContent.innerHTML = html;
    // The margin follows this sheet: re-arm the observer over the units just
    // rendered and republish the passage context (no-op while a record is pinned).
    armScrollSpy();
    marginFollowCurrent(false);
    // Bundle 026: layouts 2–6 re-structure this content into their disclosure
    // pattern; a no-op in layout 1, which renders exactly as before.
  }

  function caseTextLabels(corpusKey) {
    if (corpusKey === 'wumenguan') {
      return { commentary: '無門評唱 / Wumen Commentary', verse: '無門頌 / Wumen Verse' };
    }
    if (corpusKey === 'biyanlu_cases') {
      return { commentary: '圜悟評唱 / Yuanwu Commentary', verse: '雪竇頌 / Xuedou Verse' };
    }
    return { commentary: '評唱 / Commentary', verse: '頌曰 / Verse' };
  }

  function renderCaseItem(caseItem, idx, allCases) {
    const textLabels = caseTextLabels(state.currentCorpusKey);
    let dialoguesHtml = '';
    if (caseItem.dialogue) {
      dialoguesHtml = caseItem.dialogue.map(d => `
        <div class="dialogue-turn">
          <div class="case-speaker">${escHtml(d.speaker)}</div>
          <div class="classical-zh" lang="zh">${annotateClassicalChinese(d.zh)}</div>
          <div class="pinyin-line">${escHtml(d.pinyin)}</div>
          ${renderTranslationColumns(d.translations, d.zh)}
          ${renderProvenanceNotes(d)}
        </div>
      `).join('');
    }

    // Collapse by default on touch devices (except the first case), honoring saved state
    const defaultCollapsed = TOUCH_DEVICE && idx > 0;
    const collapsed = caseCollapsedState(caseItem.case_num, defaultCollapsed);
    // Case seeds need not be numerically consecutive (e.g. Biyanlu 1, 2, 3,
    // 12, 14, 21, 43). Navigate through actual neighbors, not arithmetic IDs.
    const cases = Array.isArray(allCases) ? allCases : [];
    const previousCase = idx > 0 ? cases[idx - 1] : null;
    const nextCase = idx < cases.length - 1 ? cases[idx + 1] : null;
    const navFooter = cases.length > 1 ? `
      <div class="case-nav-footer">
        ${previousCase ? `<button class="btn-pill" data-jump-case="${previousCase.case_num}" title="Previous case (←)">‹ 第${previousCase.case_num}則</button>` : '<span></span>'}
        <button class="btn-pill" data-jump-case="${caseItem.case_num}" title="Jump to this case">⤒ 本則</button>
        ${nextCase ? `<button class="btn-pill" data-jump-case="${nextCase.case_num}" title="Next case (→)">第${nextCase.case_num}則 ›</button>` : '<span></span>'}
      </div>` : '';

    return `
      <div class="case-card ${collapsed ? 'collapsed' : ''}" id="case-${caseItem.case_num}" data-unit-ref="cases:${caseItem.case_num}">
        <div class="case-header">
          <h2 class="case-num-title">${renderUnitTitle(caseItem.title_en, caseItem.title_zh, `Case ${caseItem.case_num}`)}</h2>
          <span class="case-header-actions">
            ${marginDoor(`case:${stringValue((gonganEntryForCase(state.currentCorpusKey, caseItem.case_num) || {}).id)}`, 'Case record', 'case-record-btn')}
            ${renderCaseSourceDisclosure(caseItem.case_num)}
            <button class="case-toggle" data-case-toggle="${escHtml(caseItem.case_num)}" aria-expanded="${collapsed ? 'false' : 'true'}" aria-label="${collapsed ? 'Expand' : 'Collapse'} case ${escHtml(caseItem.case_num)}" title="${collapsed ? 'Expand' : 'Collapse'} case">${collapsed ? '＋' : '−'}</button>
          </span>
        </div>
        <div class="case-body">
        ${caseItem.pointer_zh ? `
          <div class="commentary-block is-pointer">
            <div class="commentary-label is-blue">垂示 / Pointer</div>
            <div class="classical-zh is-secondary" lang="zh">${annotateClassicalChinese(caseItem.pointer_zh)}</div>
            ${caseItem.pointer_en && state.readerMode !== 'chinese_only' ? `<div class="prose-en is-quiet">${escHtml(caseItem.pointer_en)}</div>${renderProjectDraftDisclosure('Pointer: project AI draft', { zh: caseItem.pointer_zh, locator: locatorDocumentForKey(state.currentCorpusKey) })}` : ''}
          </div>
        ` : ''}
        ${dialoguesHtml}
        ${caseItem.commentary_zh ? `
          <div class="commentary-block">
            <div class="commentary-label">${textLabels.commentary}</div>
            <div class="classical-zh is-lead" lang="zh">${annotateClassicalChinese(caseItem.commentary_zh)}</div>
            <div class="pinyin-line is-bare">${escHtml(caseItem.commentary_pinyin || '')}</div>
            ${caseItem.commentary_en && state.readerMode !== 'chinese_only' ? `<div class="prose-en">${escHtml(caseItem.commentary_en)}</div>${renderProjectDraftDisclosure('Commentary: project AI draft', { zh: caseItem.commentary_zh, locator: locatorDocumentForKey(state.currentCorpusKey) })}` : ''}
          </div>
        ` : ''}
        ${caseItem.verse_zh ? `
          <div class="verse-block">
            <div class="commentary-label is-green">${textLabels.verse}</div>
            <div class="classical-zh" lang="zh">${annotateClassicalChinese(caseItem.verse_zh)}</div>
            <div class="pinyin-line is-bare">${escHtml(caseItem.verse_pinyin || '')}</div>
            ${caseItem.verse_en && state.readerMode !== 'chinese_only' ? `<div class="prose-en">${escHtml(caseItem.verse_en)}</div>${renderProjectDraftDisclosure('Verse: project AI draft', { zh: caseItem.verse_zh, locator: locatorDocumentForKey(state.currentCorpusKey) })}` : ''}
          </div>
        ` : ''}
        ${renderProvenanceNotes(caseItem)}
        </div>
        ${navFooter}
      </div>
    `;
  }

  function renderSectionItem(sec) {
    const sectionLocator = unitLocatorForKey(state.currentCorpusKey, `sections.${sec.section_id}`);
    let dialoguesHtml = (sec.dialogue || []).map(d => `
      <div class="dialogue-turn">
        <div class="case-speaker">${escHtml(d.speaker)}</div>
        <div class="classical-zh" lang="zh">${annotateClassicalChinese(d.zh)}</div>
        <div class="pinyin-line">${escHtml(d.pinyin)}</div>
        ${renderTranslationColumns(d.translations, d.zh, sectionLocator)}
        ${renderProvenanceNotes(d)}
      </div>
    `).join('');

    // Sections may embed verse stanzas instead of dialogue (e.g. Shitou Sandokai / Grass Hut Song)
    let stanzasHtml = (sec.stanzas || []).map(st => `
      <div class="dialogue-turn">
        <div class="case-speaker">第 ${escHtml(st.stanza_num)} 節 / Stanza ${escHtml(st.stanza_num)}</div>
        <div class="classical-zh" lang="zh">${annotateClassicalChinese(st.zh)}</div>
        <div class="pinyin-line">${escHtml(st.pinyin)}</div>
        ${renderTranslationColumns(st.translations, st.zh, sectionLocator)}
        ${renderProvenanceNotes(st)}
      </div>
    `).join('');

    return `
      <div class="case-card" data-unit-ref="sections:${sec.section_id != null ? escHtml(sec.section_id) : 'n' + (sec.section_num != null ? sec.section_num : 'x')}">
        <div class="case-header">
          <h2 class="case-num-title">${renderUnitTitle(sec.title_en, sec.title_zh, 'Section')}</h2>
          <span class="case-header-actions">${renderSourceLocationDisclosure(sectionLocator, 'Section source', 'case-source-location')}</span>
        </div>
        ${dialoguesHtml}${stanzasHtml}
        ${renderProvenanceNotes(sec)}
      </div>
    `;
  }

  function renderDialogueItem(dia) {
    let dialoguesHtml = (dia.dialogue || []).map(d => `
      <div class="dialogue-turn">
        <div class="case-speaker">${escHtml(d.speaker)}</div>
        <div class="classical-zh" lang="zh">${annotateClassicalChinese(d.zh)}</div>
        <div class="pinyin-line">${escHtml(d.pinyin)}</div>
        ${renderTranslationColumns(d.translations, d.zh)}
        ${renderProvenanceNotes(d)}
      </div>
    `).join('');

    return `
      <div class="case-card" data-unit-ref="dialogues:${dia.dialogue_id != null ? escHtml(dia.dialogue_id) : 'n' + (dia.dialogue_num != null ? dia.dialogue_num : 'x')}">
        <div class="case-header">
          <h2 class="case-num-title">${renderUnitTitle(dia.title_en, dia.title_zh, 'Dialogue')}</h2>
        </div>
        ${dialoguesHtml}
        ${renderProvenanceNotes(dia)}
      </div>
    `;
  }

  function renderStanzaItem(st) {
    const stanzaLocator = unitLocatorForKey(state.currentCorpusKey, `stanzas.${st.stanza_num}`);
    return `
      <div class="case-card" data-unit-ref="stanzas:${st.stanza_num}">
        <div class="case-header">
          <h2 class="case-num-title">${renderUnitTitle(`Stanza ${st.stanza_num}`, `第 ${st.stanza_num} 節`, 'Verse')}</h2>
          <span class="case-header-actions">${renderSourceLocationDisclosure(stanzaLocator, 'Stanza source', 'case-source-location')}</span>
        </div>
        <div class="classical-zh" lang="zh">${annotateClassicalChinese(st.zh)}</div>
        <div class="pinyin-line">${escHtml(st.pinyin)}</div>
        ${renderTranslationColumns(st.translations, st.zh, stanzaLocator)}
        ${renderProvenanceNotes(st)}
      </div>
    `;
  }

  function renderChapterItem(ch) {
    const chapterLocator = unitLocatorForKey(state.currentCorpusKey, `chapters.${ch.chapter_num}`);
    const contentBlocks = [];
    if (Array.isArray(ch.verses)) {
      contentBlocks.push(ch.verses.map(v => `
        <div class="dialogue-turn">
          <div class="case-speaker">${escHtml(v.author)}</div>
          <div class="classical-zh" lang="zh">${annotateClassicalChinese(v.zh)}</div>
          <div class="pinyin-line">${escHtml(v.pinyin)}</div>
          ${renderTranslationColumns(v.translations, v.zh, chapterLocator)}
          ${renderProvenanceNotes(v)}
        </div>
      `).join(''));
    }
    if (Array.isArray(ch.dialogue)) {
      contentBlocks.push(ch.dialogue.map(d => `
        <div class="dialogue-turn">
          <div class="case-speaker">${escHtml(d.speaker)}</div>
          <div class="classical-zh" lang="zh">${annotateClassicalChinese(d.zh)}</div>
          <div class="pinyin-line">${escHtml(d.pinyin)}</div>
          ${renderTranslationColumns(d.translations, d.zh, chapterLocator)}
          ${renderProvenanceNotes(d)}
        </div>
      `).join(''));
    }
    // Several Platform Sutra chapter excerpts use direct chapter-level fields
    // rather than nested `dialogue`/`verses`; these were previously empty cards.
    if (stringValue(ch.zh)) {
      contentBlocks.push(`
        <div class="dialogue-turn">
          ${ch.speaker ? `<div class="case-speaker">${escHtml(ch.speaker)}</div>` : ''}
          <div class="classical-zh" lang="zh">${annotateClassicalChinese(ch.zh)}</div>
          <div class="pinyin-line">${escHtml(ch.pinyin)}</div>
          ${renderTranslationColumns(ch.translations, ch.zh, chapterLocator)}
        </div>`);
    }

    return `
      <div class="case-card" data-chapter-num="${escHtml(ch.chapter_num)}" data-unit-ref="chapters:${escHtml(ch.chapter_num)}">
        <div class="case-header">
          <h2 class="case-num-title">${renderUnitTitle(ch.title_en, ch.title_zh, `Chapter ${ch.chapter_num}`)}</h2>
          <span class="case-header-actions">${renderSourceLocationDisclosure(chapterLocator, 'Chapter source', 'case-source-location')}</span>
        </div>
        ${contentBlocks.join('')}
        ${renderProvenanceNotes(ch)}
      </div>
    `;
  }

  // Translation records are deliberately polymorphic: legacy/reconstruction entries
  // are strings, while citation-ready entries carry { text, status, source }. Keep
  // their normalization in one place so the Reader and Matrix cannot diverge.
  function normalizeTranslationEntry(key, raw, options = {}) {
    const objectValue = isRecord(raw);
    const explicitStatus = options.status || (objectValue ? raw.status : '');
    const isAi = options.isAI === true || String(key || '').startsWith('ai_');
    const status = explicitStatus || (isAi ? 'ai_draft' : 'reconstruction_unverified');
    const source = isRecord(options.source)
      ? options.source
      : (objectValue && isRecord(raw.source) ? raw.source : null);
    return {
      key: stringValue(key),
      text: objectValue ? stringValue(raw.text) : stringValue(raw),
      status,
      source
    };
  }

  function translationStatusMeta(status) {
    if (status === 'verified_quotation') {
      return {
        label: '✅ Edition-verified quotation',
        title: 'Wording checked against a recorded edition. Rights status is separate and shown in the citation details; verification does not by itself mean public domain or approved reuse.',
        className: 'is-verified'
      };
    }
    if (status === 'ai_draft') {
      return {
        label: '🤖 Robo draft',
        title: 'AI-generated project draft — not a translation by the named master.',
        className: 'is-ai'
      };
    }
    return {
      label: '🤖 Robolation',
      title: 'AI text written in this translator\u2019s broad register \u2014 not copied from, checked against, or attributable as wording in that translator\u2019s book. Do not cite it as their translation.',
      className: 'is-reconstruction'
    };
  }

  function renderTranslationStatus(entry) {
    const meta = translationStatusMeta(entry.status);
    if (entry.status !== 'verified_quotation') {
      return `<span class="translation-status ${meta.className} is-silent-robo" title="${escHtml(meta.title)}" hidden></span>`;
    }
    return `<span class="translation-status ${meta.className}" title="${escHtml(meta.title)}">${meta.label}</span>`;
  }

  function sourceReference(source) {
    if (!isRecord(source)) return 'Not applicable';
    const explicit = stringValue(source.page || source.section || source.reference || source.locator);
    if (explicit) return explicit;
    // Preserve an actual page/section token embedded in legacy edition metadata;
    // otherwise disclose the missing locator instead of inventing one.
    const embedded = `${stringValue(source.edition)} ${stringValue(source.verification)}`
      .match(/(?:pp?\.?\s*\d+(?:[–-]\d+)?|§\s*[^,;)\n]+|Q&A\s*(?:no\.)?\s*\d+|teaching\s*\d+|episode\s*(?:no\.)?\s*\d+|case\s*\d+)/i);
    return embedded ? embedded[0] : 'Page/section locator pending';
  }

  function rightsRecordFor(sourceId) {
    const manifest = state.data.translations_rights;
    const sources = manifest && Array.isArray(manifest.sources) ? manifest.sources : [];
    return sources.find(item => item && item.source_id === sourceId) || null;
  }

  function renderOriginalSourceRows(context = {}) {
    const zh = stringValue(context.zh);
    const locator = isRecord(context.locator) ? context.locator : null;
    const rows = [];
    if (zh) rows.push(['Original Chinese source', zh]);
    if (locator) {
      rows.push(['Canonical source', stringValue(locator.canonical_id) || 'Canonical identifier pending']);
      rows.push(['Source locator', stringValue(locator.canonical_locator) || 'Exact locator pending']);
      rows.push(['Source verification status', stringValue(locator.status) || 'Status pending']);
    }
    return rows;
  }

  function renderTranslationSource(entry, translatorName, originalContext = {}) {
    const translator = stringValue(translatorName) || formatTranslatorName(entry.key, entry.status);
    const originalRows = renderOriginalSourceRows(originalContext);
    if (entry.status === 'verified_quotation') {
      if (!isRecord(entry.source)) {
        const detail = {
          title: 'Verified quotation disclosure',
          rows: [
            ['Translator', translator],
            ['Status', 'Verified quotation'],
            ['Book / edition', 'Source record pending'],
            ['Page / section', 'Locator pending'],
            ...originalRows
          ]
        };
        return `<div class="translation-source source-missing">⚠️ Source record pending ${renderCitationTrigger(detail, 'ⓘ Citation')}</div>`;
      }
      const source = entry.source;
      const work = stringValue(source.work) || 'Book title pending';
      const edition = stringValue(source.edition) || 'Edition pending';
      const page = sourceReference(source);
      const sourceId = stringValue(source.source_id);
      const rights = rightsRecordFor(sourceId);
      const detail = {
        title: 'Verified translation citation',
        rows: [
          ['Translator', translator],
          ['Status', 'Verified quotation'],
          ['Book', work],
          ['Edition', edition],
          ['Page / section', page],
          ['Verification', stringValue(source.verification) || 'Verification note pending'],
          ['Rights record', sourceId || 'Rights identifier pending'],
          ['Rights status', rights ? stringValue(rights.rights_status) : 'Rights record pending'],
          ...originalRows
        ]
      };
      return `<div class="translation-source"><span>${escHtml(work)} · ${escHtml(page)}</span>${renderCitationTrigger(detail, 'Citation')}</div>`;
    }

    // Robo names already disclose reconstruction status and open the shared
    // real-fakeness popover. Repeating “Robo X — Robolation” below every column
    // adds noise without adding provenance.
    return '';
  }

  function renderProjectDraftDisclosure(label = 'Project AI draft', originalContext = {}) {
    if (state.readerMode === 'chinese_only') return '';
    return `<div class="translation-source source-disclosure">${escHtml(label)}</div>`;
  }

  function renderFlatTranslationColumns(entries, originalContext = {}) {
    const shown = state.readerMode === 'bilingual'
      ? entries.filter(item => item && String(item.text || '').trim()).slice(0, READER_PREFS.registerCount || entries.length)
      : entries;
    return `
      <div class="translation-grid">
        ${shown.map(item => {
          const entry = normalizeTranslationEntry(item.key, item.text);
          const name = formatTranslatorName(item.key, entry.status);
          return `
            <div class="translation-col">
              <div class="translator-tag">
                <span>${roboNameSpan(item.key, entry.status, name)}</span>
                ${renderTranslationStatus(entry)}
              </div>
              <div class="translation-text">${escHtml(entry.text)}</div>
              ${renderTranslationSource(entry, name, originalContext)}
            </div>`;
        }).join('')}
      </div>`;
  }

  function limitRegisters(keys, prefer) {
    const wanted = READER_PREFS.registerCount;
    if (state.readerMode !== 'bilingual') return keys;
    if (!wanted || wanted <= 0 || wanted >= keys.length) return keys;
    const chosen = (prefer || []).filter(k => keys.indexOf(k) !== -1);
    return chosen.concat(keys.filter(k => chosen.indexOf(k) === -1)).slice(0, wanted);
  }

  function renderTranslationColumns(translations, zh = '', locatorOverride = null) {
    if (!translations) return '';
    if (state.readerMode === 'chinese_only') return '';

    const originalContext = { zh, locator: locatorOverride || locatorDocumentForKey(state.currentCorpusKey) };
    const keys = Object.keys(translations);
    if (keys.length === 0) return '';

    // A bilingual sheet is a reading choice, not a fixed pair: the settings menu
    // asks how many registers to lay beside the source (one anchor, two, or
    // every one this unit carries). 'All registers' mode ignores the preference.
    let displayKeys = limitRegisters(keys, ['red_pine', 'cleary']);

    return `
      <div class="translation-grid">
        ${displayKeys.map(k => {
          const entry = normalizeTranslationEntry(k, translations[k]);
          const name = formatTranslatorName(k, entry.status);
          return `
          <div class="translation-col">
            <div class="translator-tag">
              <span>${roboNameSpan(k, entry.status, name)}</span>
              ${renderTranslationStatus(entry)}
            </div>
            <div class="translation-text">${escHtml(entry.text)}</div>
            ${renderTranslationSource(entry, name, originalContext)}
          </div>`;
        }).join('')}
      </div>
    `;
  }

  // Translator display names. The user-facing brand is "Fake Chan Factory": the
  // joke is that every AI reconstruction is a *Robo* version of a famous
  // translator, while genuine verified quotations keep the real name (because
  // they ARE real). The underlying data keys are unchanged — only the display
  // layer is rebranded. `status` decides Robo-vs-real; callers that lack a
  // status default to the Robo rendering (the common case for this corpus).
  const REAL_TRANSLATOR_NAMES = {
    red_pine: 'Red Pine',
    cleary: 'Thomas Cleary',
    sasaki: 'Ruth Fuller Sasaki',
    suzuki: 'D.T. Suzuki',
    blyth: 'R.H. Blyth',
    blofeld: 'John Blofeld',
    heine: 'Steven Heine',
    yampolsky: 'Philip Yampolsky',
    senzaki_reps: 'Senzaki & Reps (1934)',
    snyder: 'Gary Snyder',
    adamek: 'Wendi L. Adamek',
    liebenthal: 'Walter Liebenthal',
    clarke: 'Richard B. Clarke',
    watson: 'Burton Watson',
    hoffman: 'Yoel Hoffman',
    ferguson: 'Andy Ferguson',
    shimomisse: 'Eiichi Shimomissé',
    aitken: 'Robert Aitken',
    shibayama: 'Zenkei Shibayama',
    sekida: 'Katsuki Sekida',
    yamada: 'Kōun Yamada',
    ai_literal: 'AI Draft (Literal)',
    ai_poetic: 'AI Draft (Poetic Zen)'
  };
  const ROBO_TRANSLATOR_NAMES = {
    red_pine: 'Robo Red Pine',
    cleary: 'Robo T-Cleary',
    sasaki: 'Robo Ruth',
    suzuki: 'Robozuki',
    blyth: 'Robo Blyth',
    blofeld: 'Roblofeld',
    heine: 'Robo Heine',
    yampolsky: 'Robo Yampolsky',
    senzaki_reps: 'Robo Senzaki & Reps',
    snyder: 'Robo Snyder',
    adamek: 'Robo Adamek',
    liebenthal: 'Robo Liebenthal',
    clarke: 'Robo Clarke',
    watson: 'Robo Watson',
    hoffman: 'Robo Hoffman',
    ferguson: 'Robo Ferguson',
    shimomisse: 'Robo Shimomissé',
    aitken: 'Robo Aitken',
    shibayama: 'Robo Shibayama',
    sekida: 'Robo Sekida',
    yamada: 'Robo Yamada',
    ai_literal: 'Robo-Literal',
    ai_poetic: 'Robo-Poetic'
  };
  function humanizeKey(key) {
    return String(key || '').replace('_', ' ').toUpperCase();
  }
  function formatTranslatorName(key, status) {
    if (status === 'verified_quotation') {
      return REAL_TRANSLATOR_NAMES[key] || humanizeKey(key);
    }
    return ROBO_TRANSLATOR_NAMES[key] || ('Robo ' + (REAL_TRANSLATOR_NAMES[key] || humanizeKey(key)));
  }
  // Matrix translator names are free-form strings in the data; Robo-ify anything
  // that is NOT a verified quotation (verified keeps its real attribution). A few
  // names blend into a single Robo coinage (Robozuki, Roblofeld) for the cast.
  const ROBO_BLEND = { suzuki: 'Robozuki', blofeld: 'Roblofeld' };
  function roboifyTranslatorName(name, status) {
    const real = stringValue(name);
    if (!real) return real;
    if (status === 'verified_quotation') return real;
    if (/^robo/i.test(real)) return real; // already branded
    const lower = real.toLowerCase();
    for (const tail in ROBO_BLEND) {
      if (lower.endsWith(tail)) return ROBO_BLEND[tail];
    }
    return 'Robo ' + real;
  }

  // ---- Real-fakeness score (Fake Chan Factory) ----
  // Hover/focus/tap a Robo name to see how *confidently* its voice is faked.
  // The scale is deliberately upside-down: MORE evidence (verified samples in the
  // corpus) => a better imitation => "truly fake"; LESS evidence => just "fake",
  // flagged ⏳ (we're faking it but can't prove we faked it well). Verified (real)
  // names are the honest opposite: not fake at all.
  function profileList() {
    const tp = state.data.translator_profiles;
    if (Array.isArray(tp)) return tp;            // future-proof: direct array
    if (tp && Array.isArray(tp.profiles)) return tp.profiles;  // current bundled shape
    return [];
  }
  function profileForKey(key) {
    const list = profileList();
    return list.find(p => p && p.register_key === key) || null;
  }
  function _normName(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]/g, ''); }
  function profileForName(name) {
    const list = profileList();
    const norm = _normName(name);
    let hit = list.find(p => p && _normName(p.translator) === norm);
    if (hit) return hit;
    const last = String(name || '').split(/\s+/).filter(Boolean).pop();
    if (last) {
      const ln = _normName(last);
      hit = list.find(p => p && _normName(p.translator).includes(ln));
      if (hit) return hit;
    }
    return null;
  }
  function fakenessFromProfile(p) {
    if (!p) return null;
    const n = Number(p.verified_sample_count) || 0;
    const src = p.evidence_source;
    const wu = stringValue(p.rendering_of_wu);
    const personality = stringValue(p.personality);
    if (src === 'not_applicable') {
      return { tier: 0, label: 'the literal machine', blurb: 'Not a translator imitation at all — the project\u2019s deliberately wooden word-for-word control.', wu, personality, pending: false };
    }
    if (src === 'documented_external' || n === 0) {
      return { tier: 1, label: 'fake', blurb: 'We\u2019re faking it, but the corpus has no verified sample for this translator yet — so we can\u2019t prove we faked the voice well.', wu, personality, pending: true };
    }
    if (n <= 2) return { tier: 2, label: 'fairly fake', blurb: `Grounded in ${n} verified sample(s) already in the corpus — a tentative imitation.`, wu, personality, pending: false };
    if (n <= 5) return { tier: 3, label: 'very fake', blurb: `Grounded in ${n} verified samples — a confident imitation.`, wu, personality, pending: false };
    if (n <= 23) return { tier: 4, label: 'truly fake', blurb: `Excellent imitation: ${n} verified samples anchor the voice.`, wu, personality, pending: false };
    return { tier: 5, label: 'certifiably fake', blurb: `Supremely fake: ${n} verified samples — the voice is richly documented.`, wu, personality, pending: false };
  }
  function roboNameSpanFromProfile(p, status, displayName, key) {
    const name = stringValue(displayName);
    if (status === 'verified_quotation') {
      return `<span class="real-name" title="✅ Edition-verified quotation — genuine recorded wording, not a Robo; see citation for rights status.">${escHtml(name)}</span>`;
    }
    const meta = p ? fakenessFromProfile(p) : null;
    const hourglass = meta && meta.pending ? ' \u23f3' : '';
    const titleTxt = meta ? `\u{1F916} ${meta.label}${hourglass} — hover/focus for the real-fakeness score` : 'Robolation — not the translator\u2019s actual words';
    return `<span class="robo-name" data-robo-key="${escHtml(key || '')}" tabindex="0" role="button" aria-label="${escHtml(name)} — real-fakeness score" title="${escHtml(titleTxt)}">${escHtml(name)}</span>`;
  }
  function roboNameSpan(key, status, displayName) {
    return roboNameSpanFromProfile(profileForKey(key), status, displayName || formatTranslatorName(key, status), key);
  }
  function roboNameSpanByName(name, status) {
    const p = profileForName(name);
    return roboNameSpanFromProfile(p, status, roboifyTranslatorName(name, status), p ? p.register_key : '');
  }

  // Render Comparison Matrix — Room 02, re-composed 2026-09-13 (Phase 3).
  //
  // The proposal's shape for this room is a collation table, not a card grid:
  // one source line across the top of a proof, then one aligned register row
  // per translator — the Robo name, the work it imitates and the provenance
  // glyph in the margin rail, the register's English text in the column beside
  // it. Every visible translator entry carries an explicit provenance status
  // and (where verified) the same citation treatment used by the Reader; all of
  // it is class-driven (the room emits no style attributes).
  function renderMatrix() {
    if (!elements.matrixTarget || !Array.isArray(state.data.translations_matrix)) return;
    const matrixList = state.data.translations_matrix;

    elements.matrixTarget.innerHTML = matrixList.map(rawItem => {
      const item = isRecord(rawItem) ? rawItem : {};
      const translators = Array.isArray(item.translators) ? item.translators : [];
      const locator = matrixLocatorForReference(item.source_ref);
      const sourceDisclosure = renderSourceLocationDisclosure(locator, 'Source location', 'matrix-source-location');
      return `
      <div class="matrix-proof-sheet">
        <div class="matrix-source-band">
          <h2 class="matrix-ref-clean">${escHtml(item.source_ref)}</h2>
          <div class="matrix-sentence-zh" lang="zh">${annotateClassicalChinese(item.sentence_zh)}</div>
          <div class="matrix-sentence-pinyin">${escHtml(item.sentence_pinyin)}</div>
          ${sourceDisclosure}
        </div>
        <div class="matrix-collation">
          <div class="matrix-collation-head">
            <span>Register</span><span>English rendering of this line</span>
          </div>
          ${translators.map(rawTranslator => {
            const t = isRecord(rawTranslator) ? rawTranslator : {};
            const entry = normalizeTranslationEntry(t.translator, {
              text: t.text,
              status: t.status,
              source: t.source
            }, {
              isAI: /\bAI\b/i.test(stringValue(t.translator))
            });
            const displayTranslator = roboifyTranslatorName(t.translator, entry.status);
            return `
            <div class="matrix-register-row">
              <div class="matrix-register-rail">
                <span class="matrix-register-name">${roboNameSpanByName(t.translator, entry.status)}</span>
                <span class="matrix-register-work">${escHtml(t.work)}${t.style ? ` · ${escHtml(t.style)}` : ''}</span>
                ${renderTranslationStatus(entry)}
                ${marginDoor(`register:${registerKeyForName(t.translator)}`, 'Register record', 'matrix-register-door')}
              </div>
              <div class="matrix-register-body">
                <div class="matrix-register-text">“${escHtml(entry.text)}”</div>
                ${renderTranslationSource(entry, displayTranslator, { zh: item.sentence_zh, locator })}
                ${t.notes ? `<div class="matrix-register-note">${escHtml(t.notes)}</div>` : ''}
              </div>
            </div>
            `;
          }).join('')}
        </div>
      </div>
      `;
    }).join('');
  }

  // ---- Lineage chart aggregation + verification registry ----
  function lineageVerificationRegistry() {
    return isRecord(state.data.lineage_verification) ? state.data.lineage_verification : {};
  }

  function lineageEdgeRecord(teacher, disciple) {
    const registry = lineageVerificationRegistry();
    const edges = Array.isArray(registry.edges) ? registry.edges : [];
    return edges.find(edge => edge && edge.teacher === teacher && edge.disciple === disciple) || {
      teacher,
      disciple,
      status: 'source_missing',
      source_id: '',
      reference: 'No lineage verification record has been registered.',
      note: 'Do not treat this displayed link as source-verified.'
    };
  }

  function lineageSourceRecord(sourceId) {
    const registry = lineageVerificationRegistry();
    const sources = Array.isArray(registry.sources) ? registry.sources : [];
    return sources.find(source => source && source.source_id === sourceId) || null;
  }

  function lineageStatusMeta(status) {
    if (status === 'source_verified') return { label: 'Source verified', className: 'is-verified' };
    if (status === 'disputed') return { label: 'Disputed lineage claim', className: 'is-disputed' };
    if (status === 'traditional_link_pending_exact_locator') {
      return { label: 'Traditional link — exact locator pending', className: 'is-pending' };
    }
    return { label: 'Source record pending', className: 'is-missing' };
  }

  function renderLineageVerificationSummary() {
    if (!elements.lineageVerificationSummary) return;
    const registry = lineageVerificationRegistry();
    const edges = Array.isArray(registry.edges) ? registry.edges : [];
    const frontiers = Array.isArray(registry.frontiers) ? registry.frontiers : [];
    const counts = edges.reduce((out, edge) => {
      const status = edge && edge.status ? edge.status : 'source_missing';
      out[status] = (out[status] || 0) + 1;
      return out;
    }, {});
    const pending = counts.traditional_link_pending_exact_locator || 0;
    const verified = counts.source_verified || 0;
    const detail = {
      title: 'Lineage chart aggregation status',
      rows: [
        ['Internal links represented', String(edges.length)],
        ['Source-verified links', String(verified)],
        ['Traditional links awaiting exact locator', String(pending)],
        ['Frontier teachers not yet profiled', String(frontiers.length)],
        ['Policy', stringValue(registry.policy) || 'Lineage verification registry pending.']
      ]
    };
    elements.lineageVerificationSummary.innerHTML =
      `<span>${verified} verified · ${pending} locator pending · ${frontiers.length} frontiers</span>` +
      renderCitationTrigger(detail, 'Details');
  }

  function sortLineageMasters(masters) {
    const list = [...masters];
    const date = m => parseInt(String(m.dates || '').match(/\d{3,4}/)?.[0], 10) || 9999;
    const byName = (a, b) => stringValue(a.name_en).localeCompare(stringValue(b.name_en));
    if (state.lineageSort === 'chronology') return list.sort((a, b) => date(a) - date(b) || byName(a, b));
    if (state.lineageSort === 'name') return list.sort(byName);
    if (state.lineageSort === 'school') return list.sort((a, b) => stringValue(a.school).localeCompare(stringValue(b.school)) || byName(a, b));
    return list.sort((a, b) => Number(a.lineage_depth) - Number(b.lineage_depth) || byName(a, b));
  }

  function lineageTeacherDetail(master) {
    const teacher = (state.data.lineage || []).find(m => m && m.id === master.teacher);
    if (teacher) return `<button class="btn-pill teacher-link" data-master-teacher="${escHtml(teacher.id)}">Teacher: ${escHtml(teacher.name_zh)} / ${escHtml(masterDisplayName(teacher))}</button>`;
    return `<span>Teacher frontier: ${escHtml(master.teacher || 'not recorded')} — profile/source record pending</span>`;
  }

  // Display-settings: master-name romanization (Pinyin ↔ Japanese Rōmaji).
  // Pinyin is the scholarly default; Rōmaji honors the Japanese Zen lineage
  // reading (Rinzai, Jōshū, Ōbaku…). Falls back to the pinyin name_en if a
  // master has no romaji form recorded.
  function masterDisplayName(master) {
    if (!isRecord(master)) return '';
    if (state.nameMode === 'romaji') {
      const r = stringValue(master.name_romaji);
      if (r) return r;
    }
    return stringValue(master.name_en);
  }
  function syncSettingsUI() {
    document.querySelectorAll('.settings-opt[data-name-mode]').forEach(o => {
      const on = o.getAttribute('data-name-mode') === state.nameMode;
      o.classList.toggle('active', on);
      o.setAttribute('aria-checked', on ? 'true' : 'false');
    });
  }

  // Render Lineage Explorer
  // Controlled school vocabulary (data-driven; enforced by validate_data.py).
  // Returns ordered [{key, display}] restricted to keys actually present in
  // the master data so filter options never point at empty groups.
  function lineageSchoolOptions() {
    const masters = Array.isArray(state.data.lineage) ? state.data.lineage : [];
    const present = new Map();
    masters.forEach(m => {
      if (!m || typeof m.school_key !== 'string') return;
      const count = present.get(m.school_key) || { key: m.school_key, display: stringValue(m.school), count: 0 };
      count.count += 1;
      present.set(m.school_key, count);
    });
    const vocab = state.data.lineage_school_vocab && Array.isArray(state.data.lineage_school_vocab.schools)
      ? state.data.lineage_school_vocab.schools : [];
    const ordered = [];
    vocab.forEach(v => {
      if (v && present.has(v.key)) {
        const p = present.get(v.key);
        ordered.push({ key: v.key, display: stringValue(v.display) || p.display, count: p.count });
        present.delete(v.key);
      }
    });
    // Any key present in data but missing from the vocabulary still shows up (validator rejects this state).
    present.forEach(p => ordered.push(p));
    return ordered;
  }

  // School graph colors are generated from the bundled controlled vocabulary
  // (data/lineage/school_vocabulary.json → each school's curated `color`),
  // not hardcoded here — adding/renaming a school cannot silently fall back to
  // a default color (validator requires a 6-digit hex per school; audit A2).
  function schoolColorMap() {
    const out = {};
    const vocab = state.data.lineage_school_vocab && Array.isArray(state.data.lineage_school_vocab.schools)
      ? state.data.lineage_school_vocab.schools : [];
    vocab.forEach(v => { if (v && v.key && v.color) out[v.key] = v.color; });
    return out;
  }

  // Filter options are generated from the bundled vocabulary, not hardcoded in
  // index.html: new schools added to the data appear automatically, and stale
  // options can never linger after data changes.
  function populateLineageSchoolFilter() {
    const sel = elements.lineageFilter;
    if (!sel) return;
    const allLabel = 'All Lineages & Patriarchs';
    sel.innerHTML = `<option value="all">${escHtml(allLabel)}</option>` +
      lineageSchoolOptions().map(o =>
        `<option value="${escHtml(o.key)}">${escHtml(o.display)} · ${o.count}</option>`
      ).join('');
  }

  // Render Lineage — Room 03, re-composed 2026-09-13 (Phase 3).
  //
  // The room's first view is now the transmission register: masters banded by
  // generation, one ruled row per master, the house (controlled school
  // vocabulary) and the dated transmission record in fixed columns so a reader
  // can scan Bodhidharma → the Five Houses top to bottom. The layered SVG chart
  // is the room's second view (see the mode switch in setupEventListeners), and
  // the dossier below the register stays the place a profile's full evidence
  // record opens. Rows keep the `data-master-card`/role/tabindex contract and
  // carry no style attributes.
  function renderLineage() {
    if (!elements.lineageTarget || !state.data.lineage) return;
    renderLineageVerificationSummary();
    const masters = filteredLineageMasters();
    renderVisualLineageGraph(masters);
    elements.lineageTarget.innerHTML = renderLineageRegister(masters);
  }

  // The room's one filter+sort path: the school filter narrows the record, the
  // sort orders it. Both the register and the chart draw from this list, so the
  // two views can never disagree about which masters are in scope.
  function filteredLineageMasters() {
    let masters = state.data.lineage || [];
    if (state.selectedMasterSchool !== 'all') {
      masters = masters.filter(m => m.school_key === state.selectedMasterSchool);
    }
    return sortLineageMasters(masters);
  }

  // The register itself. Tree order reads as ruled generation bands (the
  // transmission sequence is the room's spine); the chronology / name / school
  // orders read as one flat ruled list, because banding by generation while the
  // user asked for another order would hide what the control just did.
  function renderLineageRegister(masters) {
    if (!masters.length) {
      return '<p class="lineage-register-empty">No master in the curated record matches this filter.</p>';
    }
    if (state.lineageSort !== 'generation') {
      const order = { chronology: 'Chronological order', name: 'Name order', school: 'House order' }[state.lineageSort] || 'Register order';
      return `<div class="lineage-register">
        <div class="lineage-flat">
          <h2 class="lineage-flat-head"><span>Transmission register</span><small>${masters.length} masters · ${escHtml(order)}</small></h2>
          ${masters.map(m => renderLineageMasterRow(m, true)).join('')}
        </div>
      </div>`;
    }

    const bands = new Map();
    masters.forEach(m => {
      const gen = Number(m.lineage_depth) || 0;
      if (!bands.has(gen)) bands.set(gen, []);
      bands.get(gen).push(m);
    });
    const generations = [...bands.keys()].sort((a, b) => a - b);

    return `<div class="lineage-register">
      ${generations.map(gen => `
      <section class="lineage-band">
        <div class="lineage-band-head">
          <h2 class="lineage-band-gen">Generation ${escHtml(gen)}</h2>
          <p class="lineage-band-meta">${bands.get(gen).length} ${bands.get(gen).length === 1 ? 'master' : 'masters'} · ${escHtml(lineageBandEra(bands.get(gen)))}</p>
        </div>
        <div class="lineage-band-cols">
          <span>Master</span><span>House</span><span>Dated record</span><span>Signature</span>
        </div>
        ${bands.get(gen).map(m => renderLineageMasterRow(m)).join('')}
      </section>`).join('')}
    </div>`;
  }

  // One aligned master row. `showGeneration` labels the row when the register
  // is not banded, so the generation is never silently dropped from view.
  function renderLineageMasterRow(m, showGeneration = false) {
    return `
        <div class="lineage-master-row" data-master-card="${escHtml(m.id)}" role="button" tabindex="0" aria-label="Open dossier for ${escHtml(m.name_en)}">
          <div class="lineage-master-name">
            ${showGeneration ? `<span class="lineage-master-gen">Gen ${escHtml(m.lineage_depth)}</span>` : ''}
            <h3 class="lineage-master-name-en">${escHtml(masterDisplayName(m))}</h3>
            <span class="lineage-master-name-zh" lang="zh">${escHtml(m.name_zh)} · ${escHtml(m.name_pinyin)}</span>
            <span class="lineage-master-title">${escHtml(m.title)}</span>
          </div>
          <div class="lineage-master-house">${escHtml(m.school)}</div>
          <div class="lineage-master-record">
            <span>${escHtml(m.dates)} · ${escHtml(m.era)}</span>
            <span>${escHtml(m.location)}</span>
            <span class="lineage-master-ref">${escHtml(m.cbeta_id)}</span>
            <span class="lineage-master-teacher">${lineageTeacherDetail(m)}</span>
          </div>
          <div class="lineage-master-quote">
            <span class="lineage-master-quote-zh" lang="zh">“${escHtml(m.key_quote_zh)}”</span>
            <span class="lineage-master-quote-en">“${escHtml(m.key_quote_en)}”</span>
          </div>
        </div>`;
  }

  // A band's era line is derived from the masters in it — never invented.
  function lineageBandEra(masters) {
    const eras = [...new Set(masters.map(m => stringValue(m.era)).filter(Boolean))];
    if (!eras.length) return 'Era not recorded';
    return eras.length === 1 ? eras[0] : `${eras.length} eras in this band`;
  }

  // Interactive Visual SVG Lineage Graph (pan/zoom; reset via window.TranslateChan.resetLineageView)
  function renderVisualLineageGraph(masters) {
    const svg = document.getElementById('lineage-svg-graph');
    if (!svg) return;

    const width = Math.max(360, svg.clientWidth || 900);
    const ROW_GAP = 88;
    const TOP_PAD = 78;
    const BOTTOM_PAD = 74;
    svg.innerHTML = '';

    // School colors are derived from the controlled vocabulary (schoolColorMap),
    // which reads each school's curated hex from the bundled data — no hardcoded
    // palette here (validator guarantees every school has a color).
    const schoolColors = schoolColorMap();

    // Calculate node coordinates based on lineage generation
    const genGroups = {};
    sortLineageMasters(masters).forEach(m => {
      const gen = m.lineage_depth || 1;
      if (!genGroups[gen]) genGroups[gen] = [];
      genGroups[gen].push(m);
    });

    const gens = Object.keys(genGroups).map(Number).sort((a, b) => a - b);
    const height = Math.max(720, TOP_PAD + Math.max(0, gens.length - 1) * ROW_GAP + BOTTOM_PAD);
    svg.setAttribute('height', String(height));
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    // A vertical generation layout trades the old compressed 18-column strip for
    // breathing room: each generation is a calm horizontal row, labels have a
    // full row gap, and the chart scrolls naturally rather than overlapping.
    const nodeCoords = {};
    const rowLabelX = 18;
    const horizontalMargin = Math.min(108, Math.max(64, width * 0.12));
    let generationLabelsHtml = '<g class="graph-generation-labels">';

    gens.forEach((gen, gIdx) => {
      const group = genGroups[gen];
      const y = TOP_PAD + gIdx * ROW_GAP;
      const availableWidth = width - horizontalMargin * 2;
      generationLabelsHtml += `<text x="${rowLabelX}" y="${y + 4}" text-anchor="start" font-size="10" font-weight="700" fill="var(--ink-soft)" font-family="var(--font-ui)">G${gen}</text>`;
      group.forEach((m, mIdx) => {
        const x = group.length === 1
          ? width / 2
          : horizontalMargin + mIdx * (availableWidth / Math.max(1, group.length - 1));
        nodeCoords[m.id] = { x, y, master: m };
      });
    });
    generationLabelsHtml += '</g>';

    // Draw Links (Teacher -> Disciple). Every displayed link resolves through
    // the verification registry; pending traditional claims stay visually distinct.
    let linksHtml = '<g class="graph-links">';
    masters.forEach(m => {
      if (m.teacher && nodeCoords[m.teacher] && nodeCoords[m.id]) {
        const source = nodeCoords[m.teacher];
        const target = nodeCoords[m.id];
        const edge = lineageEdgeRecord(m.teacher, m.id);
        const meta = lineageStatusMeta(edge.status);
        const sourceRecord = lineageSourceRecord(edge.source_id);
        const edgeTitle = `${source.master.name_en} → ${target.master.name_en}: ${meta.label}${sourceRecord ? ` (${sourceRecord.title})` : ''}`;
        linksHtml += `<line class="graph-link ${meta.className}" x1="${source.x}" y1="${source.y + 27}" x2="${target.x}" y2="${target.y - 27}" role="button" tabindex="0" aria-label="${escHtml(edgeTitle)}" data-lineage-teacher="${escHtml(m.teacher)}" data-lineage-disciple="${escHtml(m.id)}"><title>${escHtml(edgeTitle)}</title></line>`;
      }
    });
    linksHtml += '</g>';

    // Draw Nodes
    let nodesHtml = '<g class="graph-nodes">';
    Object.keys(nodeCoords).forEach(id => {
      const { x, y, master } = nodeCoords[id];
    // Every master.school_key is guaranteed to carry a color by the validator;
    // the fallback only covers a malformed/old cached bundle.
    const color = schoolColors[master.school_key] || '#b38238';

      const displayName = stringValue(masterDisplayName(master));
      const shortName = displayName.split(' ').pop().slice(0, 14);
      const monogram = displayName.split(/\s+/).map(part => part.charAt(0)).join('').slice(0, 2).toUpperCase() || '—';
      nodesHtml += `
        <g class="graph-node" transform="translate(${x}, ${y})" role="button" tabindex="0" aria-label="${escHtml(master.name_en)} — open profile source" data-master-node="${escHtml(master.id)}">
          <circle class="graph-node-halo" r="30" fill="${color}" fill-opacity="0.09"></circle>
          <circle r="24" fill="var(--panel)" stroke="${color}" stroke-width="2.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.12))"></circle>
          <text text-anchor="middle" dy=".34em" font-size="10" font-weight="800" fill="var(--ink)" font-family="var(--font-mono)">${escHtml(monogram)}</text>
          <text text-anchor="middle" y="40" font-size="10" font-weight="650" fill="var(--ink-soft)" font-family="var(--font-ui)">${escHtml(shortName)}</text>
        </g>
      `;
    });
    nodesHtml += '</g>';

    // Wrap in a transformable group for pan/zoom (kept across re-renders).
    // Generation labels travel with the chart, so panning never detaches context.
    svg.innerHTML = `<g class="lineage-panzoom" id="lineage-panzoom">${generationLabelsHtml}${linksHtml}${nodesHtml}</g>`;
    ensureLineagePanZoom(svg);
  }

  // Pan / zoom controller (wheel + pointer drag + two-finger pinch), one per svg
  function ensureLineagePanZoom(svg) {
    const view = svg._panzoom || { x: 0, y: 0, k: 1 };
    const group = () => svg.querySelector('.lineage-panzoom');
    const apply = () => {
      const g = group();
      if (g) g.setAttribute('transform', `translate(${view.x}, ${view.y}) scale(${view.k})`);
    };
    if (svg._panzoom) { apply(); return; } // already bound — just re-apply transform after redraw
    svg._panzoom = view;
    svg.addEventListener('click', (e) => {
      const node = e.target && e.target.closest ? e.target.closest('[data-master-node]') : null;
      const edge = e.target && e.target.closest ? e.target.closest('[data-lineage-teacher]') : null;
      if (node) window.TranslateChan.openMasterDossier(node.getAttribute('data-master-node'));
      else if (edge) window.TranslateChan.openLineageEdge(edge.getAttribute('data-lineage-teacher'), edge.getAttribute('data-lineage-disciple'));
    });

    const container = svg.closest ? svg.closest('#lineage-graph-container') : svg.parentNode;

    svg.addEventListener('wheel', (e) => {
      e.preventDefault();
      const rect = svg.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const f = Math.exp(-e.deltaY * 0.0015);
      const k2 = Math.min(3, Math.max(0.35, view.k * f));
      const r = k2 / view.k;
      view.x = cx - (cx - view.x) * r;
      view.y = cy - (cy - view.y) * r;
      view.k = k2;
      apply();
    }, { passive: false });

    const pointers = new Map();
    let panning = false, lastX = 0, lastY = 0, lastDist = null, lastMid = null;

    svg.addEventListener('pointerdown', (e) => {
      if (svg.setPointerCapture) { try { svg.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ } }
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      lastX = e.clientX; lastY = e.clientY;
      panning = true;
      if (container) container.classList.add('panning');
      e.preventDefault();
    });

    svg.addEventListener('pointermove', (e) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 1 && panning) {
        view.x += e.clientX - lastX;
        view.y += e.clientY - lastY;
        lastX = e.clientX; lastY = e.clientY;
        apply();
      } else if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        if (lastDist && lastMid) {
          const rect = svg.getBoundingClientRect();
          const f = dist / lastDist;
          const k2 = Math.min(3, Math.max(0.35, view.k * f));
          const r = k2 / view.k;
          const mx = mid.x - rect.left, my = mid.y - rect.top;
          view.x = mx - (mx - view.x) * r;
          view.y = my - (my - view.y) * r;
          view.x += mid.x - lastMid.x;
          view.y += mid.y - lastMid.y;
          view.k = k2;
          apply();
        }
        lastDist = dist; lastMid = mid;
      }
    });

    const endPointer = (e) => {
      pointers.delete(e.pointerId);
      if (pointers.size === 0) {
        panning = false; lastDist = null; lastMid = null;
        if (container) container.classList.remove('panning');
      }
    };
    svg.addEventListener('pointerup', endPointer);
    svg.addEventListener('pointercancel', endPointer);
    svg.addEventListener('pointerleave', endPointer);

    window.TranslateChan.resetLineageView = function() {
      view.x = 0; view.y = 0; view.k = 1;
      apply();
    };

    svg.addEventListener('keydown', (e) => {
      const node = e.target && e.target.closest ? e.target.closest('.graph-node') : null;
      const edge = e.target && e.target.closest ? e.target.closest('.graph-link') : null;
      if ((node || edge) && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        (node || edge).click();
      }
    });
  }

  function renderMasterWorkLinks(master) {
    const keys = Array.isArray(master.linked_corpus_keys) ? master.linked_corpus_keys : [];
    const items = state.data.corpus_manifest && Array.isArray(state.data.corpus_manifest.items) ? state.data.corpus_manifest.items : [];
    const labels = new Map(items.map(item => [item.key, item.title]));
    if (!keys.length) return '<span>Project corpus link not yet curated.</span>';
    return keys.filter(key => state.data.corpus && state.data.corpus[key]).map(key =>
      `<button class="btn-pill" data-open-doc="${escHtml(key)}">Open ${escHtml(labels.get(key) || key)}</button>`
    ).join(' ');
  }

  // Master dossier = non-modal dialog (a11y N2, 2026-08-09): the panel carries
  // role="dialog" in index.html, focus moves into it on open, and ✕/Escape
  // closes it and returns focus to the invoking control for continuous reading.
  function getDossierPanel() { return document.getElementById('master-dossier-panel'); }
  function openDossierPanel() {
    const panel = getDossierPanel();
    if (!panel) return;
    panel._invoker = (typeof document.activeElement !== 'undefined') ? document.activeElement : null;
    // The HTML ships with `hidden`; clear the semantic state (Phase 2: the
    // redundant inline display write is gone — [hidden] CSS alone governs).
    panel.hidden = false;
    panel.removeAttribute('hidden');
    if (typeof panel.scrollIntoView === 'function') panel.scrollIntoView({ behavior: motionBehavior() });
    if (typeof panel.focus === 'function') {
      try { panel.focus({ preventScroll: true }); } catch (e) { try { panel.focus(); } catch (err) { /* ignore */ } }
    }
  }
  function closeDossierPanel() {
    const panel = getDossierPanel();
    if (!panel || panel.hidden === true) return;
    panel.hidden = true;
    panel.setAttribute('hidden', '');
    const invoker = panel._invoker || null;
    panel._invoker = null;
    if (invoker && typeof document.contains === 'function' && document.contains(invoker) && typeof invoker.focus === 'function') {
      invoker.focus();
    }
  }

  // Master Dossier Modal Display
  window.TranslateChan = window.TranslateChan || {};
  // One door for every master record: the lineage register, a name inside a
  // passage, a case's protagonist and a search result all open the same dossier
  // in the margin. The legacy direct-write path is gone, so the trail, the
  // history and the follow-mode rail stay coherent whatever opened them.
  window.TranslateChan.openMasterDossier = function(masterId) {
    if (!state.data.lineage) return;
    const master = state.data.lineage.find(m => m && m.id === masterId);
    if (!master) return;
    openWiki(`master:${masterId}`, { focus: true });
  };

  window.TranslateChan.openLineageEdge = function(teacherId, discipleId) {
    const edge = lineageEdgeRecord(teacherId, discipleId);
    const source = lineageSourceRecord(edge.source_id);
    const teacher = (state.data.lineage || []).find(master => master.id === teacherId);
    const disciple = (state.data.lineage || []).find(master => master.id === discipleId);
    const nameZh = document.getElementById('dossier-name-zh');
    const nameEn = document.getElementById('dossier-name-en');
    const content = document.getElementById('dossier-content');
    const meta = lineageStatusMeta(edge.status);
    const teacherName = teacher ? `${teacher.name_zh} / ${teacher.name_en}` : teacherId;
    const discipleName = disciple ? `${disciple.name_zh} / ${disciple.name_en}` : discipleId;
    const detail = {
      title: 'Lineage link citation',
      rows: [
        ['Teacher', teacherName],
        ['Disciple', discipleName],
        ['Status', meta.label],
        ['Source chart / record', source ? stringValue(source.title) : 'Source record pending'],
        ['Canonical source', source ? stringValue(source.canonical_id) : 'Locator pending'],
        ['Source reference', source ? stringValue(source.reference) : 'Locator pending'],
        ['Edge reference', stringValue(edge.reference)],
        ['Verification note', stringValue(edge.note)]
      ]
    };

    if (nameZh) nameZh.textContent = '法脈連結 / Lineage Link';
    if (nameEn) nameEn.textContent = `${teacherName} → ${discipleName}`;
    if (content) {
      content.innerHTML = `
        <div class="dossier-meta-row">
          <strong>Verification status:</strong> ${escHtml(meta.label)}
        </div>
        <div class="commentary-block is-blue is-flush">
          <div class="commentary-label is-blue">Lineage chart disclosure</div>
          <div class="prose-en is-small">${escHtml(stringValue(edge.note) || 'No verification note recorded.')}</div>
          <div class="citation-line">${renderCitationTrigger(detail, 'ⓘ Source chart & verification')}</div>
        </div>`;
    }
    openDossierPanel();
  };

  // Gong'an filter chips are generated from the controlled theme taxonomy
  // (validator-enforced theme_group keys), so chips group cases instead of
  // listing 23 one-off labels. The rich per-entry `theme` stays on the card.
  function gonganThemeGroups() {
    const entries = Array.isArray(state.data.gongan_index) ? state.data.gongan_index : [];
    const present = new Map();
    entries.forEach(g => {
      if (!g || typeof g.theme_group !== 'string') return;
      present.set(g.theme_group, (present.get(g.theme_group) || 0) + 1);
    });
    const vocab = state.data.gongan_theme_vocab && Array.isArray(state.data.gongan_theme_vocab.themes)
      ? state.data.gongan_theme_vocab.themes : [];
    const ordered = [];
    vocab.forEach(v => {
      if (v && present.has(v.key)) {
        ordered.push({ key: v.key, display: stringValue(v.display) || v.key, count: present.get(v.key) });
        present.delete(v.key);
      }
    });
    // Any group present in data but missing from the taxonomy still shows up (validator rejects this state).
    present.forEach((count, key) => ordered.push({ key, display: key, count }));
    return ordered;
  }
  function gonganGroupDisplay(key) {
    const vocab = state.data.gongan_theme_vocab && Array.isArray(state.data.gongan_theme_vocab.themes)
      ? state.data.gongan_theme_vocab.themes : [];
    const hit = vocab.find(v => v && v.key === key);
    return hit ? stringValue(hit.display) : key;
  }

  // Render Gong'an Index — Room 04, re-composed 2026-09-13 (Phase 3).
  //
  // The proposal's shape for this room is a case catalogue: one ruled row per
  // indexed case, carrying the case number, both titles, the collection it was
  // indexed from, the controlled theme group and the canonical record it points
  // at. Nothing here is a card, and the theme filter is a single row of text
  // filters rather than a field of pills. `gongan-filter-chip` +
  // `data-gongan-filter` stay as the delegated click contract.
  function renderGonganIndex() {
    if (!elements.gonganTarget || !state.data.gongan_index) return;
    let list = state.data.gongan_index;
    const activeGroup = state.gonganThemeFilter && state.gonganThemeFilter !== 'all'
      ? state.gonganThemeFilter : '';
    if (activeGroup) list = list.filter(g => g.theme_group === activeGroup);

    const groups = gonganThemeGroups();
    const showAll = !activeGroup;
    const filterBar = `
      <div class="room-filter-rail" role="group" aria-label="Filter the case catalogue by theme group">
        <span class="room-filter-legend">Theme groups</span>
        <button class="gongan-filter-chip${showAll ? ' active' : ''}" data-gongan-filter="all" aria-pressed="${showAll ? 'true' : 'false'}">All · ${state.data.gongan_index.length}</button>
        ${groups.map(g => `<button class="gongan-filter-chip${activeGroup === g.key ? ' active' : ''}" data-gongan-filter="${escHtml(g.key)}" aria-pressed="${activeGroup === g.key ? 'true' : 'false'}">${escHtml(g.display)} · ${g.count}</button>`).join('')}
      </div>`;

    const catalogue = list.map(g => `
      <div class="catalogue-row">
        <span class="catalogue-case">${escHtml(g.case_no)}</span>
        <div class="catalogue-title">
          <h2 class="catalogue-title-en">${escHtml(g.title_en)}</h2>
          <span class="catalogue-title-zh" lang="zh">${escHtml(g.title_zh)}</span>
        </div>
        <span class="catalogue-collection">${escHtml(g.collection)}</span>
        <div class="catalogue-theme">
          <span>Group: ${escHtml(gonganGroupDisplay(stringValue(g.theme_group)))}</span>
          <span>${escHtml(g.theme)}</span>
        </div>
        <span class="catalogue-locator">${escHtml(g.cbeta_id)}</span>
        <div class="catalogue-detail">
          <p class="catalogue-summary">${escHtml(g.summary)}</p>
          ${g.cross_refs ? `<p class="catalogue-cross">Cross-references: ${g.cross_refs.map(escHtml).join(' · ')}</p>` : ''}
        </div>
      </div>`).join('');

    elements.gonganTarget.innerHTML = `${filterBar}
      <div class="gongan-catalogue">
        <div class="gongan-catalogue-head">
          <span>Case</span><span>Title</span><span>Collection</span><span>Theme</span><span>Record</span>
        </div>
        ${catalogue}
      </div>`;
  }

  // Gong'an theme filter chips
  if (elements.gonganTarget) {
    elements.gonganTarget.addEventListener('click', (e) => {
      const chip = e.target.closest ? e.target.closest('.gongan-filter-chip') : null;
      if (!chip) return;
      state.gonganThemeFilter = chip.getAttribute('data-gongan-filter') === 'all' ? null : chip.getAttribute('data-gongan-filter');
      renderGonganIndex();
    });
  }

  // Lexicon categories are derived from the glossary data (with display labels
  // for known categories), so the filter can never lag glossary growth.
  const LEXICON_CATEGORY_LABELS = {
    'Ontology': 'Ontology & Buddha-Nature',
    'Encounter': 'Encounter Dialogue',
    "Gong'an Barrier": "Gong'an Barriers",
    'Pedagogical': 'Pedagogical Devices',
    'Linji Dialectics': 'Linji Dialectics',
    'Caodong Meditation': 'Caodong Meditation'
  };
  function populateLexiconCategoryFilter() {
    const sel = elements.lexiconFilter;
    if (!sel || !Array.isArray(state.data.glossary)) return;
    const seen = new Map();
    state.data.glossary.forEach(item => {
      if (!item || typeof item.category !== 'string') return;
      seen.set(item.category, (seen.get(item.category) || 0) + 1);
    });
    const ordered = Object.keys(LEXICON_CATEGORY_LABELS).filter(c => seen.has(c));
    seen.forEach((count, cat) => { if (!ordered.includes(cat)) ordered.push(cat); });
    sel.innerHTML = '<option value="all">All Categories</option>' + ordered.map(cat =>
      `<option value="${escHtml(cat)}">${escHtml(LEXICON_CATEGORY_LABELS[cat] || cat)} · ${seen.get(cat)}</option>`
    ).join('');
  }

  // Render Lexicon — Room 05, re-composed 2026-09-13 (Phase 3).
  //
  // A field dictionary reads as a running list, so the room is one now: each
  // entry puts the headword Chinese (largest), its pinyin and its literal
  // gloss in the head line, the definition in the body, and the category plus
  // the recorded occurrences in the margin. `lexicon-summary`,
  // `lexicon-no-match` and the occurrence caveat title stay exactly as the
  // smoke test guards them.
  function renderLexicon() {
    if (!elements.lexiconTarget || !state.data.glossary) return;
    let list = state.data.glossary;

    if (state.selectedLexiconCategory !== 'all') {
      list = list.filter(item => item.category === state.selectedLexiconCategory);
    }

    // U3 (audit 2026-08-10, session 019feabb): a free-text filter on top of
    // the category dropdown. Uses the same diacritic + variant normalization
    // as the global search so 'foxing' matches 'fóxìng' and 'mu' matches 無.
    const rawQuery = (state.lexiconQuery || '').trim();
    if (rawQuery) {
      const q = normalizeForSearch(rawQuery);
      list = list.filter(item => {
        if (!item) return false;
        const haystack = [
          item.term, item.pinyin, item.literal, item.definition,
          item.sanskrit, item.category,
          Array.isArray(item.occurrences) ? item.occurrences.join(' ') : ''
        ].map(normalizeForSearch).join(' ');
        return haystack.includes(q);
      });
    }

    const noMatchHint = rawQuery
      ? `<p class="lexicon-no-match">No terms match <strong>${escHtml(rawQuery)}</strong> in this category. Try a different search term or switch the category filter back to <em>All Categories</em>.</p>`
      : '';
    const summary = (state.selectedLexiconCategory !== 'all' || rawQuery)
      ? `<p class="lexicon-summary" aria-live="polite">${list.length} of ${state.data.glossary.length} terms</p>`
      : '';

    elements.lexiconTarget.innerHTML = summary + noMatchHint + `<div class="lexicon-entries">` + list.map(item => `
      <div class="lexicon-entry">
        <div class="lexicon-entry-margin">
          <span class="lexicon-entry-cat">${escHtml(item.category)}</span>
          <span class="lexicon-entry-count">${item.occurrences.length} recorded ${item.occurrences.length === 1 ? 'occurrence' : 'occurrences'}</span>
          ${marginDoor(`term:${item.id}`, 'Full record', 'lexicon-entry-door')}
        </div>
        <div class="lexicon-entry-main">
          <h2 class="lexicon-headword">${escHtml(item.literal)}<span class="lexicon-headword-zh" lang="zh">${escHtml(item.term)}</span></h2>
          <p class="lexicon-headword-meta">${escHtml(item.pinyin)}${item.sanskrit ? ` · Sanskrit: ${escHtml(item.sanskrit)}` : ''}</p>
          <div class="lexicon-entry-def">${escHtml(item.definition)}</div>
          <div class="lexicon-occurrences">
            ${item.occurrences.map(occ => `<span class="lexicon-occ-tag" title="Canonical occurrence reference; may fall outside the current Reader excerpt.">${escHtml(occ)}</span>`).join('')}
          </div>
        </div>
      </div>
    `).join('') + `</div>`;
  }

  // ---- Search: universal segment extraction across every corpus schema ----
  // Orthographic variant pairs found across canon editions. Both spellings are
  // normalized to ONE canonical side (first listed) so 洗鉢盂去/洗缽盂去, 師云/師曰
  // etc. cross-match; variantRegex() still marks either spelling in the raw text.
  const SEARCH_VARIANTS = { '鉢': '缽', '曰': '云', '臺': '台', '裏': '里', '無': '无' };
  // Diacritic folding (search UX N5, 2026-08-09, session 019fe731): corpus
  // pinyin is tone-marked (Zhàozhōu, fóxìng), but realistic queries are typed
  // toneless (zhaozhou, foxing). NFD + combining-mark strip makes both sides
  // comparable; CJK characters have no decomposable marks and are unaffected.
  const COMBINING_MARKS = /[\u0300-\u036f]/g;
  function normalizeForSearch(s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(COMBINING_MARKS, '')
      .split('').map(ch => SEARCH_VARIANTS[ch] || ch).join('');
  }
  function escHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function variantRegex(q) {
    const escaped = [...String(q)].map(ch => SEARCH_VARIANTS[ch] ? `[${ch}${SEARCH_VARIANTS[ch]}]` : ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('');
    try { return new RegExp(escaped, 'gi'); } catch (e) { return null; }
  }
  function extractSearchableUnits(doc, corpKey) {
    // Returns [{label, jump, zh, pinyin, blob}] covering cases (including pointers,
    // commentary and verses), sections, dialogues, stanzas, chapters, five_ranks,
    // sample_records, and preface/epilogue.
    const units = [];
    const asBlob = (...parts) => normalizeForSearch(parts.filter(Boolean).join(' '));
    const blobWithTranslations = (tr) => tr ? Object.values(tr).map(v => (v && typeof v === 'object' ? v.text : v)).filter(Boolean).join(' ') : '';
    // Human-readable per-register English fields, carried next to the blob so a
    // result card can disclose WHAT matched (register + text) when the classical
    // Chinese itself did not (search UX N4, 2026-08-09, session 019fe731).
    const registerPairs = (tr) => tr ? Object.entries(tr)
      .map(([k, v]) => {
        const entry = normalizeTranslationEntry(k, v);
        return { name: formatTranslatorName(k, entry.status), text: entry.text };
      })
      .filter(p => p.text) : [];
    const namedPair = (name, text) => (text ? [{ name, text: stringValue(text) }] : []);
    const fromDialogue = (items, label, jump) => (items || []).forEach(d => {
      units.push({
        label, jump,
        zh: d.zh || '', pinyin: d.pinyin || '',
        en: registerPairs(d.translations),
        blob: asBlob(label, d.speaker, d.zh, d.pinyin, blobWithTranslations(d.translations))
      });
    });

    if (doc.preface && doc.preface.zh) {
      units.push({ label: '序言 / Preface', jump: null, zh: doc.preface.zh, pinyin: doc.preface.pinyin || '',
        en: [
          ...namedPair(formatTranslatorName('red_pine'), doc.preface.en_red_pine),
          ...namedPair(formatTranslatorName('cleary'), doc.preface.en_cleary),
          ...namedPair(formatTranslatorName('sasaki'), doc.preface.en_sasaki)
        ],
        blob: asBlob('preface', doc.preface.zh, doc.preface.pinyin, doc.preface.en_red_pine, doc.preface.en_cleary, doc.preface.en_sasaki) });
    }
    if (doc.epilogue && doc.epilogue.zh) {
      units.push({ label: '後序 / Epilogue', jump: null, zh: doc.epilogue.zh, pinyin: doc.epilogue.pinyin || '',
        en: [
          ...namedPair(formatTranslatorName('red_pine'), doc.epilogue.en_red_pine),
          ...namedPair(formatTranslatorName('cleary'), doc.epilogue.en_cleary),
          ...namedPair(formatTranslatorName('sasaki'), doc.epilogue.en_sasaki)
        ],
        blob: asBlob('epilogue', doc.epilogue.zh, doc.epilogue.pinyin, doc.epilogue.en_red_pine, doc.epilogue.en_cleary, doc.epilogue.en_sasaki) });
    }
    (doc.cases || []).forEach(c => {
      const label = `第${c.case_num}則 ${c.title_zh || ''} / ${c.title_en || ''}`;
      fromDialogue(c.dialogue, label, { kind: 'case', num: c.case_num });
      if (c.pointer_zh) units.push({ label: label + ' · pointer', jump: { kind: 'case', num: c.case_num }, zh: c.pointer_zh, pinyin: c.pointer_pinyin || '', en: namedPair('Pointer (project draft)', c.pointer_en), blob: asBlob(label, c.pointer_zh, c.pointer_pinyin, c.pointer_en) });
      if (c.commentary_zh) units.push({ label: label + ' · commentary', jump: { kind: 'case', num: c.case_num }, zh: c.commentary_zh, pinyin: c.commentary_pinyin || '', en: namedPair('Commentary (project draft)', c.commentary_en), blob: asBlob(label, c.commentary_zh, c.commentary_pinyin, c.commentary_en) });
      if (c.verse_zh) units.push({ label: label + ' · verse', jump: { kind: 'case', num: c.case_num }, zh: c.verse_zh, pinyin: c.verse_pinyin || '', en: namedPair('Verse (project draft)', c.verse_en), blob: asBlob(label, c.verse_zh, c.verse_pinyin, c.verse_en) });
      // explicit title unit so title-only queries surface the case
      units.push({ label, jump: { kind: 'case', num: c.case_num }, zh: c.title_zh || '', pinyin: c.title_pinyin || '', en: [], blob: asBlob(label) });
    });
    (doc.sections || []).forEach(sec => {
      const label = `${sec.title_zh || ''} / ${sec.title_en || ''}`;
      fromDialogue(sec.dialogue, label, null);
      fromDialogue(sec.stanzas, label, null);
    });
    (doc.dialogues || []).forEach(dia => {
      fromDialogue(dia.dialogue, `${dia.title_zh || ''} / ${dia.title_en || ''}`, null);
    });
    (doc.stanzas || []).forEach(st => {
      units.push({ label: `Stanza ${st.stanza_num}`, jump: null, zh: st.zh || '', pinyin: st.pinyin || '',
        en: registerPairs(st.translations),
        blob: asBlob(`stanza ${st.stanza_num}`, st.zh, st.pinyin, blobWithTranslations(st.translations)) });
    });
    (doc.chapters || []).forEach(ch => {
      const label = `${ch.title_zh || ''} / ${ch.title_en || ''}`;
      fromDialogue(ch.dialogue, label, null);
      (ch.verses || []).forEach(v => units.push({ label, jump: null, zh: v.zh || '', pinyin: v.pinyin || '',
        en: registerPairs(v.translations),
        blob: asBlob(label, v.author, v.zh, v.pinyin, blobWithTranslations(v.translations)) }));
    });
    (doc.five_ranks || []).forEach(r => {
      units.push({ label: `Five Ranks · ${r.name_zh || ''}`, jump: null, zh: r.verse_zh || '', pinyin: r.verse_pinyin || '',
        en: [...registerPairs(r.translations), ...namedPair('Caoshan commentary (project draft)', r.commentary_en)],
        blob: asBlob(r.name_zh, r.name_en, r.verse_zh, r.verse_pinyin, r.commentary_zh, r.commentary_en, blobWithTranslations(r.translations)) });
    });
    (doc.sample_records || []).forEach(rec => {
      fromDialogue(rec.dialogue, `卷${rec.fascicle} ${rec.title_zh || ''}`, null);
    });
    return units;
  }

  function makeSnippet(zh, q) {
    // Window the classical text around the first hit, then highlight all hits.
    // Escape every non-match too: escaping only the marked match left a source-data
    // injection path in the previous implementation.
    const raw = stringValue(zh);
    const re = variantRegex(q);
    const first = re ? raw.search(re) : -1;
    const center = first === -1 ? 0 : first;
    const start = Math.max(0, center - 30);
    const end = Math.min(raw.length, center + 50);
    const snip = (start > 0 ? '…' : '') + raw.slice(start, end) + (end < raw.length ? '…' : '');
    if (!re) return escHtml(snip);

    let html = '';
    let cursor = 0;
    let match;
    re.lastIndex = 0;
    while ((match = re.exec(snip)) !== null) {
      html += escHtml(snip.slice(cursor, match.index));
      html += `<mark>${escHtml(match[0])}</mark>`;
      cursor = re.lastIndex;
      // The UI never submits an empty query, but keep the loop safe if this
      // helper is reused with a zero-width expression in the future.
      if (match[0] === '') re.lastIndex++;
    }
    return html + escHtml(snip.slice(cursor));
  }

  // Window a matched non-Chinese field (translation, pinyin) for display. When
  // the query literally occurs there, makeSnippet marks it; toneless queries
  // that only match after diacritic folding get an unmarked window instead of
  // a misleading highlight (search UX N4/N5, 2026-08-09, session 019fe731).
  function makeFieldSnippet(raw, q) {
    const text = stringValue(raw);
    const re = variantRegex(q);
    if (re && re.test(text)) return makeSnippet(text, q);
    const idx = normalizeForSearch(text).indexOf(normalizeForSearch(q));
    const center = idx === -1 ? 0 : idx;
    const start = Math.max(0, center - 30);
    const end = Math.min(text.length, center + 50);
    return escHtml((start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : ''));
  }

  // Disclose which field satisfied the query when the classical Chinese did
  // not: first matching translation register, else pinyin, else the title.
  function renderSearchMatchNote(u, q, qLower) {
    if (u.zh && normalizeForSearch(u.zh).includes(qLower)) return '';
    const enHit = (u.en || []).find(p => normalizeForSearch(p.text).includes(qLower));
    if (enHit) {
      return `<div class="search-match-note"><strong>${escHtml(enHit.name)}</strong> · “${makeFieldSnippet(enHit.text, q)}”</div>`;
    }
    if (u.pinyin && normalizeForSearch(u.pinyin).includes(qLower)) {
      return `<div class="search-match-note"><strong>Pinyin</strong> · ${makeFieldSnippet(u.pinyin, q)}</div>`;
    }
    return `<div class="search-match-note">Title or speaker</div>`;
  }

  // D1: searchable units are expensive to extract (traversal + string building),
  // so build the full index ONCE per session and filter cached strings per keystroke.
  let searchUnitsCache = null;
  function getSearchUnitsIndex() {
    if (searchUnitsCache) return searchUnitsCache;
    searchUnitsCache = {};
    Object.keys(state.data.corpus || {}).forEach(corpKey => {
      searchUnitsCache[corpKey] = extractSearchableUnits(state.data.corpus[corpKey], corpKey);
    });
    return searchUnitsCache;
  }

  // Global Search Handler — covers every corpus schema, with counts + highlighting
  function handleGlobalSearch() {
    const q = state.searchQuery;
    if (!q) {
      renderReader();
      return;
    }

    if (state.currentView !== 'reader') {
      switchView('reader');
    }

    if (!elements.readerContent || !state.data.corpus) return;

    const qLower = normalizeForSearch(q);
    const MAX_RESULT_CARDS = 200;
    const MAX_PER_DOCUMENT = 12;
    const searchIndex = getSearchUnitsIndex();
    const matchedDocuments = Object.keys(state.data.corpus).map(corpKey => {
      const doc = state.data.corpus[corpKey];
      const units = searchIndex[corpKey] || [];
      const hits = units.filter(u => u.blob.includes(qLower) || (u.zh && normalizeForSearch(u.zh).includes(qLower)));
      return { corpKey, doc, hits };
    }).filter(result => result.hits.length > 0);

    // Count every matched unit before applying presentation limits. This keeps the
    // header truthful even when cards are deliberately capped for readability.
    const totalHits = matchedDocuments.reduce((sum, result) => sum + result.hits.length, 0);
    let displayedHits = 0;
    let bodyHtml = '';

    matchedDocuments.forEach(({ corpKey, doc, hits }) => {
      const remaining = MAX_RESULT_CARDS - displayedHits;
      if (remaining <= 0) return;
      const shown = hits.slice(0, Math.min(MAX_PER_DOCUMENT, remaining));
      if (shown.length === 0) return;

      bodyHtml += `<div class="search-document-heading"><span>${escHtml(doc.title_en)}</span><small lang="zh">${escHtml(doc.title_zh)}</small><strong>${hits.length}</strong></div>`;
      shown.forEach(u => {
        const action = u.jump && u.jump.kind === 'case'
          ? `<button class="btn-pill active" data-open-case="${escHtml(corpKey)}" data-case-num="${u.jump.num}">Open case</button>`
          : `<button class="btn-pill active" data-open-doc="${escHtml(corpKey)}">Open work</button>`;
        bodyHtml += `
          <div class="case-card search-result-card">
            <div class="case-header"><h2 class="case-num-title search-result-title">${escHtml(u.label)}</h2></div>
            ${u.zh ? `<div class="classical-zh search-result-zh" lang="zh">${makeSnippet(u.zh, q)}</div>` : ''}
            ${renderSearchMatchNote(u, q, qLower)}
            <div class="search-result-action">${action}</div>
          </div>`;
      });
      displayedHits += shown.length;
      const hiddenInDocument = hits.length - shown.length;
      if (hiddenInDocument > 0) {
        bodyHtml += `<div class="search-more-note">+${hiddenInDocument} more in this work</div>`;
      }
    });

    const hiddenTotal = totalHits - displayedHits;
    const resultNotice = hiddenTotal > 0
      ? `<div class="search-result-limit">Showing ${displayedHits} of ${totalHits} · Refine to narrow</div>`
      : '';
    const headerHtml = `<div class="text-header search-header"><p class="section-kicker">Corpus search</p><h1 class="text-title-zh"><span>Search</span><small>“${escHtml(q)}”</small></h1><p class="text-title-en">${totalHits} results in ${matchedDocuments.length} works</p>${resultNotice}</div>`;

    elements.readerContent.innerHTML = totalHits === 0
      ? headerHtml + `<div class="case-card search-empty"><p>No results. Try a title, term, or passage in English, pinyin, or Chinese.</p></div>`
      : headerHtml + bodyHtml;
  }

  // The margin's public surface: any room, and any future slice, opens a record
  // through these three calls rather than duplicating the dossier markup.
  window.TranslateChan.openWiki = function(key, options) { openWiki(key, options); };
  window.TranslateChan.closeWiki = function() { marginResumeFollow(); };
  window.TranslateChan.openPalette = function() { paletteOpen(); };

  // The case shelf and the Reader sheet use one id each: resolve a corpus case
  // number to its gong'an index entry so a case card can offer its own record.
  function registerKeyForName(name) {
    const label = stringValue(name);
    const found = profileList().find(p => p && (stringValue(p.translator) === label
      || stringValue(p.robo_name) === label));
    return found ? found.register_key : '';
  }

  // A door into the margin, drawn as a pill so it obeys the house button and
  // never needs its own stylesheet entry.
  function marginDoor(key, label, extraClass) {
    if (!key || !wikiGet(key)) return '';
    return `<button type="button" class="btn-pill${extraClass ? ` ${extraClass}` : ''}" data-wiki-open="${escHtml(key)}"`
      + ` title="Open ${escHtml(entityLabel(wikiGet(key)))} in the margin">${escHtml(label)}</button>`;
  }

  function gonganEntryForCase(corpusKey, caseNum) {
    const collection = /biyanlu/i.test(stringValue(corpusKey)) ? '碧巖' : '無門關';
    return gonganList().find(g => g && String(g.case_no) === String(caseNum)
      && stringValue(g.collection).indexOf(collection) !== -1) || null;
  }

  // Global helpers (merge into existing namespace — do NOT overwrite openMasterDossier)
  window.TranslateChan = window.TranslateChan || {};
  const CASE_CHUNK = 12;
  function caseTotal() {
    const d = state.data.corpus && state.data.corpus[state.currentCorpusKey];
    if (d && Array.isArray(d.cases) && d.cases.length) return d.cases.length;
    return d && Array.isArray(d.sections) ? d.sections.length : 0;
  }
  function printFullReader() {
    const total = caseTotal();
    const scrollY = window.scrollY || 0;
    state.searchQuery = '';
    if (elements.globalSearch) elements.globalSearch.value = '';
    if (total > 0) {
      // Printing CSS can expand collapsed nodes, but it cannot print lazy units
      // absent from the DOM. Keep the fully rendered document after printing;
      // the user explicitly requested the complete export and may keep reading.
      state.caseLimit[state.currentCorpusKey] = total;
    }
    renderReader();
    elements.readerContent?.querySelectorAll?.('details.front-matter, details.document-details').forEach(detail => { detail.open = true; });
    setTimeout(() => {
      window.scrollTo({ top: scrollY, behavior: 'auto' });
      try { window.print(); } catch (e) { /* printing unavailable */ }
    }, 0);
  }
  function ensureCaseLoaded(caseNum) {
    const doc = state.data.corpus && state.data.corpus[state.currentCorpusKey];
    const cases = doc && Array.isArray(doc.cases) ? doc.cases : [];
    const total = cases.length;
    const targetIndex = cases.findIndex(c => String(c.case_num) === String(caseNum));
    if (targetIndex < 0) return;
    const cur = state.caseLimit[state.currentCorpusKey] || (total > CASE_CHUNK ? CASE_CHUNK : total);
    const required = targetIndex + 1;
    if (required > cur) {
      state.caseLimit[state.currentCorpusKey] = Math.min(total, required);
      renderReader();
    }
  }
  window.TranslateChan.loadMoreCases = function(target) {
    const total = caseTotal();
    const cur = state.caseLimit[state.currentCorpusKey] || (total > CASE_CHUNK ? CASE_CHUNK : total);
    // U2 (audit 2026-08-10, session 019feabb): accept an explicit target
    // from the 12/24/all segmented control; default keeps the old +12 behavior.
    const next = (typeof target === 'number' && target > cur) ? target : (cur + CASE_CHUNK);
    state.caseLimit[state.currentCorpusKey] = Math.min(total, next);
    // keep the reader roughly in place after re-render
    const btn = document.getElementById('case-load-more-btn');
    const y = (btn && typeof btn.getBoundingClientRect === 'function')
      ? btn.getBoundingClientRect().top + (window.scrollY || 0) : null;
    renderReader();
    if (y !== null) window.scrollTo({ top: Math.max(0, y - 96), behavior: motionBehavior() });
  };
  window.TranslateChan.scrollToCase = function(caseNum) {
    ensureCaseLoaded(caseNum);
    expandCase(caseNum);
    setTimeout(() => {
      const el = document.getElementById(`case-${caseNum}`);
      if (el) el.scrollIntoView({ behavior: motionBehavior(), block: 'start' });
    }, 60);
  };
  window.TranslateChan.openCase = function(corpusKey, caseNum) {
    if (!setCurrentCorpusKey(corpusKey)) return;
    if (state.currentView !== 'reader') switchViewRaw('reader', false);
    state.searchQuery = '';
    if (elements.globalSearch) elements.globalSearch.value = '';
    renderCorpusList();
    renderReader();
    const t = viewHash('reader', corpusKey);
    if (location.hash !== t) { try { location.hash = t; } catch (e) { /* ignore */ } }
    window.TranslateChan.scrollToCase(caseNum);
  };
  window.TranslateChan.openDoc = function(corpusKey) {
    if (!setCurrentCorpusKey(corpusKey)) return;
    if (state.currentView !== 'reader') switchViewRaw('reader', false);
    state.searchQuery = '';
    if (elements.globalSearch) elements.globalSearch.value = '';
    renderCorpusList();
    renderReader();
    const t = viewHash('reader', corpusKey);
    if (location.hash !== t) { try { location.hash = t; } catch (e) { /* ignore */ } }
  };

  function startApp() {
    try { init(); }
    catch (error) { showLoadError(); }
  }

  // Run on DOM ready. A top-level render failure uses the same recoverable UI as
  // a missing bundle rather than exposing a blank panel.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
  } else {
    startApp();
  }

})();
