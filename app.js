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
    // Bundle 028: numbered LAYOUT presets 1–7 (1 = current ideal layout +
    // ideal colors; 2 = the bundle-026 Accordion Reader, kept; 3–7 = the same
    // five disclosure ideas reimplemented DRASTIC across all five rooms).
    // Legacy 025 letter presets (a–e, colors-only) and 026's 3–6 collapse to 1.
    designVariant: (() => { const v = storageGet('translatechan_design_variant'); return ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'].includes(v) ? v : '1'; })(),
    // Per-room pane memory for the tabbed layout (keyed "<variant>:<room>").
    roomTab: {},
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
    designSwitcher: document.getElementById('design-switcher'),
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
    applyDesignVariant(state.designVariant);
    renderDesignSwitcher();
    syncSettingsUI();
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
    appBooted = true; // layout switches may now trigger live re-renders
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

  // Boot-complete flag: applyDesignVariant re-renders rooms only after init()
  // finishes (during boot it merely applies the persisted layout).
  let appBooted = false;

  // Phase 5 — layout switcher. Numbers 1–7: 1 keeps the current ideal layout
  // AND ideal colors; 2 keeps the bundle-026 Accordion Reader the owner saw
  // improvements in; 3–7 are COMPLETELY REDONE as truly drastic layouts
  // (Focus / Timeline / Graph-Split / Hamburger / Dossier). All seven share
  // layout 1's colors and the COMMON QUALITIES (light mental load, English
  // first, not dense, comfortable to read, easy to navigate, piece-meal plain
  // language, work/teacher info sections). data-design on <html>; examples
  // only — the owner rates them.
  const DESIGN_VARIANTS = [
    { key: '1', label: '1', name: 'Classic scroll — current ideal' },
    { key: '2', label: '2', name: 'Accordion Reader — kept' },
    { key: '3', label: '3', name: 'Focus Mode — centered 38rem' },
    { key: '4', label: '4', name: 'Timeline — horizontal scroll' },
    { key: '5', label: '5', name: 'Graph + Reader split 32/68' },
    { key: '6', label: '6', name: 'Minimal header + hamburger' },
    { key: '7', label: '7', name: 'Info-first dossier' },
    { key: '8', label: '8', name: 'Tabbed + breadcrumb' },
    { key: '9', label: '9', name: 'Bottom sheet' },
    { key: '10', label: '10', name: 'Sticky TOC 16rem / 1fr / 16rem' },
    { key: '11', label: '11', name: 'Search-first landing' },
    { key: '12', label: '12', name: 'Question-driven — where from / who related / background' },
    { key: '13', label: '13', name: 'Side-by-side English / Chinese' },
    { key: '14', label: '14', name: 'Related rail 18rem — hover for why' },
    { key: '15', label: '15', name: 'Footnotes + glossary' }
  ];

  function applyDesignVariant(variant) {
    if (!['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'].includes(variant)) variant = '1';
    state.designVariant = variant;
    document.documentElement.setAttribute('data-design', variant);
    storageSet('translatechan_design_variant', variant);
    // Reflect the active state on the switcher buttons (class + ARIA only).
    if (elements.designSwitcher) {
      elements.designSwitcher.querySelectorAll('.design-btn').forEach(btn => {
        const on = btn.getAttribute('data-design-variant') === variant;
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        btn.classList.toggle('active', on);
      });
    }
    // Layouts 2–7 are structural: rebuild the Reader AND every already-seen
    // room, so the new disclosure structure takes effect immediately in all
    // five rooms — that is the whole point of the drastic reimplementation.
    // Skipped before boot finishes (init applies the persisted variant first).
    if (appBooted) {
      resetLayoutRuntime();
      renderReader();
      for (const name of Object.keys(ROOM_RENDERERS)) {
        if (renderedRooms.has(name)) ROOM_RENDERERS[name]();
      }
    }
  }

  // Leaving a layout must not leave its runtime behind: an open modal, a pinned
  // hover card, a live IntersectionObserver or a stale content registry would
  // all survive into the next layout and show the wrong room's information.
  function resetLayoutRuntime() {
    closeInfoModal();
    hideHoverCard();
    closeNavDrawer();
    // 8–15 leave no runtime behind either: the bottom sheet (layout 9) closes
    // and every room's chrome container is torn down before a re-render.
    if (typeof document !== 'undefined' && document.querySelectorAll) {
      document.querySelectorAll('.rm-sheet-shell').forEach(shell => {
        shell.classList.remove('is-open');
        shell.setAttribute('hidden', '');
      });
    }
    if (roomRevealObserver && typeof roomRevealObserver.disconnect === 'function') roomRevealObserver.disconnect();
    roomRevealObserver = null;
    infoModalRegistry.clear();
    hoverCardRegistry.clear();
    applyShellBrandForVariant(state.designVariant);
    const fn = document.getElementById('focus-room-nav');
    if (fn) fn.hidden = state.designVariant !== '3';
  }

  function renderDesignSwitcher() {
    const container = elements.designSwitcher;
    if (!container) return;
    container.innerHTML =
      '<span class="design-switcher-label" aria-hidden="true">Layout</span>' +
      DESIGN_VARIANTS.map(v =>
        `<button type="button" class="design-btn" data-design-variant="${v.key}" ` +
        `aria-label="Layout ${v.label}: ${v.name}" ` +
        `title="Layout ${v.label}: ${v.name} — examples only, not a judgment" ` +
        `aria-pressed="${state.designVariant === v.key ? 'true' : 'false'}">${v.label}</button>`
      ).join('');
    // One delegated activator: each button applies the layout and persists it.
    container.addEventListener('click', (e) => {
      const btn = e.target && e.target.closest ? e.target.closest('.design-btn') : null;
      if (!btn) return;
      applyDesignVariant(btn.getAttribute('data-design-variant'));
    });
  }

  // ==========================================================================
  // Phase 5 — LAYOUTS 1–7 (redo 3–7 truly drastic, 2026-09-17)
  // keep 1 + 2, completely redo 3–7 per owner "3-7 must be completely redone"
  // --------------------------------------------------------------------------
  // 1 = the current ideal layout AND the ideal colors (no override at all).
  // 2 = Accordion Reader — KEPT byte-for-byte as bundle 026 shipped it, because
  //     the owner saw improvements there. Reader only.
  // 3–7 = truly drastic alternative layouts (shell+nav+grid+IA), not wrappers:
  //       3 Focus Mode             — centered 38rem, chrome off, [i] drawers
  //       4 Timeline View          — horizontal scroll-snap cards 18–26rem
  //       5 Graph + Reader Split   — 32% sticky dots + 68% English reader
  //       6 Minimal Header+Hamburger — 3rem header, nav in drawer, 42rem body
  //       7 Info-First Dossier     — info hero top, translation collapsed
  //
  // All seven share layout 1's colors exactly — only structure varies — and all
  // seven carry the COMMON QUALITIES: light mental load (minimum information by
  // default, everything extra behind expand / hover / toggle), English first,
  // not dense, comfortable to read, easy to navigate, piece-meal plain
  // language, and an info section for every work and teacher (where it came
  // from, what or who is related, background context).
  //
  // Zero inline styles, zero new .style writes — four setProperty calls stay
  // four. Everything below no-ops in layout 1. Layout 2 path unchanged.
  // ==========================================================================

  // Layouts 3–7 are structural in every room, so each room renderer calls
  // enhanceRoomLayout(room) after it writes innerHTML. That covers lazy first
  // render, filter changes, sort changes and layout switches alike.

  // Stubs kept so older listeners and resetLayoutRuntime stay safe after the
  // 3–7 redo removed modal/hover/progressive families. No-ops unless a future
  // layout reintroduces the real implementations.
  const infoModalRegistry = new Map();
  const hoverCardRegistry = new Map();
  let roomRevealObserver = null;
  let hoverCardEl = null;
  let hoverCardTimer = null;
  function closeInfoModal() {
    const root = document.getElementById('layout-info-modal');
    if (root) root.setAttribute('hidden', '');
  }
  function hideHoverCard() {
    if (hoverCardEl) hoverCardEl.setAttribute('hidden', '');
    clearTimeout(hoverCardTimer);
  }
  function setupHoverCardListeners() {
    // No-op: layout 7 is now Info-First Dossier, not hover cards.
  }

  const DRASTIC_LAYOUTS = ['3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'];

  function roomRoot(room) {
    if (room === 'reader') return elements.readerContent;
    if (room === 'matrix') return elements.matrixTarget;
    if (room === 'lineage') return elements.lineageTarget;
    if (room === 'gongan') return elements.gonganTarget;
    if (room === 'lexicon') return elements.lexiconTarget;
    return null;
  }

  // The repeating unit of each room — the thing a drastic layout re-structures.
  const ROOM_UNIT_SELECTOR = {
    reader: '.case-card',
    matrix: '.matrix-proof-sheet',
    lineage: '.lineage-master-row',
    gongan: '.catalogue-row',
    lexicon: '.lexicon-entry'
  };
  // Plain-language noun for the unit, used in button labels ("About this case").
  const ROOM_UNIT_NOUN = {
    reader: 'part', matrix: 'line', lineage: 'teacher', gongan: 'case', lexicon: 'term'
  };
  const ROOM_LAYOUT_CLASSES = ['rm-focus', 'rm-timeline', 'rm-graphsplit', 'rm-hamburger', 'rm-dossier',
    'rm-accordion', 'rm-progressive', 'rm-tabbed', 'rm-modal', 'rm-hovercards',
    'rm-sheet', 'rm-toc', 'rm-searchfirst', 'rm-questions', 'rm-sidebyside', 'rm-rail', 'rm-notes'];

  function clearRoomLayoutClasses(root) {
    if (!root || !root.classList) return;
    ROOM_LAYOUT_CLASSES.forEach(c => root.classList.remove(c));
  }

  function roomUnits(root, room) {
    if (!root || typeof root.querySelectorAll !== 'function') return [];
    const sel = ROOM_UNIT_SELECTOR[room];
    if (!sel) return [];
    return Array.from(root.querySelectorAll(sel)).filter(Boolean);
  }

  // Text helpers — everything generated here is escaped before it reaches HTML.
  function nodeText(node) {
    return node && typeof node.textContent === 'string' ? node.textContent.replace(/\s+/g, ' ').trim() : '';
  }
  function queryText(scope, sel) {
    if (!scope || typeof scope.querySelector !== 'function') return '';
    return nodeText(scope.querySelector(sel));
  }
  function clipText(text, max) {
    const s = String(text || '').trim();
    if (!s) return '';
    return s.length > max ? s.slice(0, max - 1).trimEnd() + '…' : s;
  }

  // One English-first headline per unit. Built from what the room already
  // rendered (never invented), Chinese kept as a quiet subordinate chip.
  function unitHeadline(room, unit, idx) {
    if (room === 'reader') {
      const kicker = queryText(unit, '.case-heading-kicker');
      const en = queryText(unit, '.case-heading-en') || queryText(unit, '.case-num-title');
      const zh = queryText(unit, '.case-heading-zh');
      const lead = queryText(unit, '.translation-text') || queryText(unit, '.prose-en');
      return { kicker: kicker || `Part ${idx + 1}`, en: clipText(en, 90), zh, note: clipText(lead, 110) };
    }
    if (room === 'matrix') {
      const ref = queryText(unit, '.matrix-ref-clean');
      const firstEn = queryText(unit, '.matrix-register-text');
      const count = typeof unit.querySelectorAll === 'function' ? unit.querySelectorAll('.matrix-register-row').length : 0;
      return { kicker: `Line ${idx + 1}`, en: clipText(ref, 80), zh: '', note: `${count} register${count === 1 ? '' : 's'} · ${clipText(firstEn, 90)}` };
    }
    if (room === 'lineage') {
      const en = queryText(unit, '.lineage-master-name-en');
      const zh = queryText(unit, '.lineage-master-name-zh');
      const house = queryText(unit, '.lineage-master-house');
      const dates = queryText(unit, '.lineage-master-record span');
      return { kicker: queryText(unit, '.lineage-master-gen'), en: clipText(en, 60), zh: clipText(zh, 40), note: `${house}${dates ? ' · ' + dates : ''}` };
    }
    if (room === 'gongan') {
      return {
        kicker: queryText(unit, '.catalogue-case'),
        en: clipText(queryText(unit, '.catalogue-title-en'), 80),
        zh: clipText(queryText(unit, '.catalogue-title-zh'), 40),
        note: clipText(queryText(unit, '.catalogue-collection'), 60)
      };
    }
    // lexicon
    return {
      kicker: queryText(unit, '.lexicon-entry-cat'),
      en: clipText(queryText(unit, '.lexicon-headword'), 60),
      zh: clipText(queryText(unit, '.lexicon-headword-zh'), 24),
      note: clipText(queryText(unit, '.lexicon-headword-meta'), 60)
    };
  }

  function headlineHtml(h) {
    return `${h.kicker ? `<span class="rm-acc-kicker">${escHtml(h.kicker)}</span>` : ''}` +
      `<span class="rm-acc-en">${escHtml(h.en || 'Untitled')}</span>` +
      `${h.zh ? `<span class="rm-acc-zh" lang="zh">${escHtml(h.zh)}</span>` : ''}` +
      `${h.note ? `<span class="rm-acc-note">${escHtml(h.note)}</span>` : ''}`;
  }

  // A plain-language info block, used wherever a room has no curated info
  // section of its own yet (matrix lines, cases, terms). Three rows, same
  // shape as the work/teacher info sections: where from · related · background.
  function infoRows(rows) {
    return rows.map(r =>
      `    <div class="context-row"><div class="context-label">${escHtml(r[0])}</div><div class="context-text">${r[1]}</div></div>\n`
    ).join('');
  }
  function infoBlock(title, rows, className) {
    return `<details class="context-info rm-info${className ? ' ' + className : ''}">\n` +
      `  <summary>${escHtml(title)}</summary>\n` +
      `  <div class="context-info-body">\n` + infoRows(rows) + `  </div>\n` +
      `</details>`;
  }

  // Per-room info sections (common qualities: every work and every teacher gets
  // one). Built only from bundled data fields — no invented Chinese.
  function matrixInfoRows(item, idx) {
    const translators = Array.isArray(item.translators) ? item.translators : [];
    const locator = matrixLocatorForReference(item.source_ref);
    const locatorText = locator
      ? `${stringValue(locator.document || 'recorded document')}${locator.locator ? ' · ' + stringValue(locator.locator) : ''}`
      : 'Locator not recorded for this line yet.';
    const registers = translators.map(t => stringValue(t.translator)).filter(Boolean);
    return [
      ['Where it came from', `One source line, ${escHtml(stringValue(item.source_ref))}, taken from ${escHtml(locatorText)}. The Classical Chinese is the source; every English line under it is a separate rendering.`],
      ['What is related', `${registers.length} rendering${registers.length === 1 ? '' : 's'} of this same line: ${escHtml(registers.length ? registers.join(', ') : 'none recorded')}. Compare them in the Full comparison pane.`],
      ['Background', `This room exists so one Chinese sentence can be read against several English voices at once. Renderings marked as project drafts are machine-made and clearly labelled; quoted renderings carry their own edition record.`]
    ];
  }

  function gonganInfoRows(g) {
    const masters = Array.isArray(state.data.lineage) ? state.data.lineage : [];
    const protagonist = masters.find(m => m && (m.id === g.protagonist || m.name_zh === g.protagonist));
    const related = protagonist
      ? `<button class="btn-pill teacher-link" data-master-teacher="${escHtml(protagonist.id)}">${escHtml(masterDisplayName(protagonist))}</button>`
      : escHtml(stringValue(g.protagonist) || 'Not recorded');
    const crosses = Array.isArray(g.cross_refs) ? g.cross_refs : [];
    return [
      ['Where it came from', `Indexed from ${escHtml(stringValue(g.collection) || 'a recorded collection')} as case ${escHtml(stringValue(g.case_no))}. Canonical record: ${escHtml(stringValue(g.cbeta_id) || 'not recorded')}.`],
      ['What is related', `Protagonist: ${related}. Cross-references: ${crosses.length ? escHtml(crosses.join(' · ')) : 'none recorded'}.`],
      ['Background', `${escHtml(gonganGroupDisplay(stringValue(g.theme_group)))} — ${escHtml(stringValue(g.theme) || 'theme not recorded')}. ${escHtml(clipText(stringValue(g.summary), 260))}`]
    ];
  }

  function lexiconInfoRows(item) {
    const occ = Array.isArray(item.occurrences) ? item.occurrences : [];
    return [
      ['Where it came from', `A Classical Chan term, read ${escHtml(stringValue(item.pinyin) || 'reading not recorded')}${item.sanskrit ? `, from Sanskrit ${escHtml(stringValue(item.sanskrit))}` : ''}. Recorded in ${occ.length} canonical location${occ.length === 1 ? '' : 's'} in this project.`],
      ['What is related', `Category: ${escHtml(stringValue(item.category) || 'not recorded')}. Occurrences: ${occ.length ? escHtml(occ.join(' · ')) : 'none recorded'}.`],
      ['Background', `${escHtml(stringValue(item.definition) || 'No definition recorded.')}`]
    ];
  }

  // The Reader's own info stack: this work, plus every teacher linked to it.
  // Layouts 3–7 all surface it, each in its own structure.
  function readerInfoStackHtml() {
    const corpusKey = state.currentCorpusKey;
    const related = relatedTeachersForCorpusKey(corpusKey);
    const teachers = related.length
      ? related.map(m =>
          `<div class="rm-teacher-block"><h3 class="rm-teacher-name">${escHtml(masterDisplayName(m))}` +
          `${m.name_zh ? ` <span lang="zh" class="rm-teacher-zh">${escHtml(m.name_zh)}</span>` : ''}</h3>` +
          `<div class="context-info-body">${teacherContextRows(m)}</div></div>`).join('')
      : '<p class="rm-empty">No profiled teacher is linked to this work yet.</p>';
    return `<div class="rm-info-stack">` +
      `<div class="context-info-body">${workContextRows(corpusKey)}</div>` +
      `<h3 class="rm-stack-subhead">Teachers connected to this work</h3>${teachers}` +
      `</div>`;
  }

  // Adopt everything a room already rendered into one box, so a tabbed layout
  // can offer it as a single pane without rewriting the room's own renderer.
  function adoptRoomChildren(root, className) {
    const box = document.createElement('div');
    box.className = className;
    Array.from(root.childNodes).forEach(n => box.appendChild(n));
    root.appendChild(box);
    return box;
  }

  // Move a set of sibling nodes into a fresh <details> where the first stood.
  function wrapNodesInDetails(nodes, summaryHtml, className, open) {
    const list = Array.from(nodes || []).filter(Boolean);
    if (!list.length) return null;
    const d = document.createElement('details');
    d.className = className;
    if (open) d.setAttribute('open', '');
    const s = document.createElement('summary');
    s.innerHTML = summaryHtml;
    d.appendChild(s);
    const first = list[0];
    if (first.parentNode) first.parentNode.insertBefore(d, first);
    list.forEach(n => d.appendChild(n));
    return d;
  }

  // Wrap ONE node in a <details> panel (used by every drastic family).
  function wrapNodeInDetails(node, summaryHtml, className, open) {
    return wrapNodesInDetails([node], summaryHtml, className, open);
  }

  // --- Layout 2 · Accordion Reader — KEPT from bundle 026, unchanged. ---------
  // The owner saw improvements here, so this code path stays exactly as it was:
  // Reader only, inner sections fold, English translation starts open.
  function enhanceAccordionReader() {
    const root = elements.readerContent;
    if (!root || typeof root.querySelectorAll !== 'function') return;
    root.classList.add('layout-accordion');

    // Dialogue turns: Chinese + pinyin fold away; English stays open.
    root.querySelectorAll('.dialogue-turn').forEach(turn => {
      if (!turn || !turn.children) return;
      const zhNodes = Array.from(turn.children).filter(n =>
        n.classList && (n.classList.contains('classical-zh') || n.classList.contains('pinyin-line')));
      if (zhNodes.length) {
        wrapNodesInDetails(zhNodes, 'Chinese source <span class="acc-zh-chip" lang="zh">漢文</span>', 'acc-sec acc-zh', false);
      }
      const grids = Array.from(turn.children).filter(n => n.classList && n.classList.contains('translation-grid'));
      if (grids.length) wrapNodesInDetails(grids, 'Translation — English', 'acc-sec acc-en', true);
      const notes = Array.from(turn.children).filter(n => n.classList && n.classList.contains('provenance-line'));
      if (notes.length) wrapNodesInDetails(notes, 'Notes on this passage', 'acc-sec acc-notes', false);
    });

    // Commentary/pointer/verse: Chinese folds; English stays visible.
    root.querySelectorAll('.commentary-block, .verse-block').forEach(block => {
      if (!block || !block.children) return;
      const kind = block.classList.contains('verse-block') ? 'Verse'
        : (block.classList.contains('is-pointer') ? 'Pointer' : 'Commentary');
      const zhNodes = Array.from(block.children).filter(n =>
        n.classList && (n.classList.contains('classical-zh') || n.classList.contains('pinyin-line')));
      if (zhNodes.length) wrapNodesInDetails(zhNodes, `${kind} — Chinese source`, 'acc-sec acc-zh', false);
    });

    // Document header: the five edition ledgers fold into one accordion.
    const drawer = root.querySelector('.ledger-drawer');
    if (drawer) wrapNodesInDetails([drawer], 'About this edition — ledgers', 'acc-sec acc-ledgers', false);
    const header = root.querySelector('.document-heading');
    if (header && header.children) {
      const prov = Array.from(header.children).filter(n => n.classList && n.classList.contains('provenance-line'));
      if (prov.length) wrapNodesInDetails(prov, 'Notes on this text', 'acc-sec acc-notes', false);
    }
  }

  // Reader entry point: layout 1 renders as before, layout 2 keeps the bundle
  // 026 accordion, layouts 3–7 go through the drastic all-room dispatcher.
  function enhanceReaderLayout() {
    hideHoverCard();
    closeInfoModal();
    closeNavDrawer();
    const root = elements.readerContent;
    if (root && root.classList) {
      ['layout-accordion', 'layout-progressive', 'layout-tabbed', 'layout-modal', 'layout-hovercards',
        'rm-focus', 'rm-timeline', 'rm-graphsplit', 'rm-hamburger', 'rm-dossier']
        .forEach(c => root.classList.remove(c));
      clearRoomLayoutClasses(root);
    }
    const v = state.designVariant;
    if (!v || v === '1') return;
    if (v === '2') { enhanceAccordionReader(); return; }
    enhanceRoomLayout('reader');
  }

  // The one dispatcher every room calls after it renders.
  function enhanceRoomLayout(room) {
    const v = state.designVariant;
    if (!v || !DRASTIC_LAYOUTS.includes(v)) return;
    // Layout 9's sheet is one per room; a room being (re)built always starts
    // with every other room's sheet closed, so two sheets can never stack.
    closeOpenBottomSheets(null);
    const root = roomRoot(room);
    if (!root || typeof root.querySelectorAll !== 'function') return;
    clearRoomLayoutClasses(root);
    if (v === '3') roomFocus(room, root);
    else if (v === '4') roomTimeline(room, root);
    else if (v === '5') roomGraphSplit(room, root);
    else if (v === '6') roomHamburger(room, root);
    else if (v === '7') roomDossier(room, root);
    // 8–15: the usable hand-pick family (alternative renderings of all rooms).
    else if (v === '8') roomTabbed(room, root);
    else if (v === '9') roomBottomSheet(room, root);
    else if (v === '10') roomStickyToc(room, root);
    else if (v === '11') roomSearchFirst(room, root);
    else if (v === '12') roomQuestionDriven(room, root);
    else if (v === '13') roomSideBySide(room, root);
    else if (v === '14') roomRelatedRail(room, root);
    else if (v === '15') roomFootnotes(room, root);
  }

  // Tear down layout-6 drawer chrome that lives outside room roots.
  function closeNavDrawer() {
    const rootEl = typeof document !== 'undefined' ? document.documentElement : null;
    if (rootEl && rootEl.classList) rootEl.classList.remove('nav-open');
    const btn = typeof document !== 'undefined' ? document.getElementById('hamburger-btn') : null;
    if (btn) btn.setAttribute('aria-expanded', 'false');
    const backdrop = typeof document !== 'undefined' ? document.getElementById('nav-drawer-backdrop') : null;
    if (backdrop) backdrop.setAttribute('hidden', '');
  }

  function ensureHamburgerChrome() {
    if (typeof document === 'undefined' || !document.getElementById) return;
    const shell = document.getElementById('site-shell');
    if (!shell) return;
    let btn = document.getElementById('hamburger-btn');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'hamburger-btn';
      btn.className = 'hamburger-btn';
      btn.setAttribute('aria-label', 'Open navigation menu');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-controls', 'site-room-nav');
      btn.innerHTML = '<span></span><span></span><span></span>';
      const lintel = shell.querySelector('.shell-lintel');
      const controls = shell.querySelector('.nav-controls');
      if (controls && controls.parentNode) controls.parentNode.insertBefore(btn, controls.nextSibling);
      else if (lintel) lintel.appendChild(btn);
      btn.addEventListener('click', () => {
        const open = !document.documentElement.classList.contains('nav-open');
        document.documentElement.classList.toggle('nav-open', open);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        const backdrop = document.getElementById('nav-drawer-backdrop');
        if (backdrop) {
          if (open) backdrop.removeAttribute('hidden');
          else backdrop.setAttribute('hidden', '');
        }
      });
    }
    let backdrop = document.getElementById('nav-drawer-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'nav-drawer-backdrop';
      backdrop.className = 'nav-drawer-backdrop';
      backdrop.setAttribute('hidden', '');
      backdrop.addEventListener('click', closeNavDrawer);
      document.body.appendChild(backdrop);
    }
    const nav = shell.querySelector('.room-nav');
    if (nav && !nav.id) nav.id = 'site-room-nav';
  }

  function applyShellBrandForVariant(v) {
    if (typeof document === 'undefined' || !document.querySelector) return;
    const brand = document.querySelector('.site-shell .brand');
    const title = document.querySelector('.site-shell .brand-title-en');
    if (!brand || !title) return;
    if (!title.dataset.originalTitle) title.dataset.originalTitle = title.textContent || '';
    if (v === '6') {
      brand.classList.add('is-minimal');
      title.textContent = 'TranslateChan';
    } else {
      brand.classList.remove('is-minimal');
      title.textContent = title.dataset.originalTitle || 'Fake Chan Factory';
    }
  }

  // ==========================================================================
  // LAYOUT 3 · FOCUS MODE — centered 38rem, no chrome, [i] drawers
  // ==========================================================================
  function roomFocus(room, root) {
    root.classList.add('rm-focus');
    ensureFocusRoomNav(room);
    const units = roomUnits(root, room);
    units.forEach((unit, i) => focusizeUnit(room, unit, i));
    if (room === 'reader') focusReaderExtras(root);
    else if (room === 'matrix') focusMatrixExtras(root, units);
    else if (room === 'lineage') focusLineageExtras(root, units);
    else if (room === 'gongan') focusGonganExtras(root, units);
    else if (room === 'lexicon') focusLexiconExtras(root, units);
  }

  function ensureFocusRoomNav(activeRoom) {
    // Tiny text room switcher under the thin shell (room-nav is display:none).
    if (typeof document === 'undefined' || !document.getElementById) return;
    let bar = document.getElementById('focus-room-nav');
    if (!bar) {
      bar = document.createElement('nav');
      bar.id = 'focus-room-nav';
      bar.className = 'focus-room-nav';
      bar.setAttribute('aria-label', 'Rooms');
      const main = document.getElementById('main-content');
      if (main && main.parentNode) main.parentNode.insertBefore(bar, main);
      else document.body.appendChild(bar);
      bar.addEventListener('click', (e) => {
        const b = e.target && e.target.closest ? e.target.closest('button[data-view]') : null;
        if (!b) return;
        const view = b.getAttribute('data-view');
        if (view && typeof switchView === 'function') switchView(view);
      });
    }
    const rooms = [
      ['reader', 'Read'], ['matrix', 'Compare'], ['lineage', 'Lineage'],
      ['gongan', 'Cases'], ['lexicon', 'Terms']
    ];
    bar.innerHTML = rooms.map(([k, lab]) =>
      `<button type="button" data-view="${k}" class="${k === activeRoom ? 'is-active' : ''}" ` +
      `aria-current="${k === activeRoom ? 'page' : 'false'}">${lab}</button>`
    ).join('');
    bar.hidden = state.designVariant !== '3';
  }

  function makeInfoButton(drawerId) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'rm-i-btn';
    btn.textContent = 'i';
    btn.setAttribute('aria-label', 'Show more information');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', drawerId);
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const drawer = document.getElementById(drawerId);
      if (!drawer) return;
      const open = !drawer.classList.contains('is-open');
      drawer.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    return btn;
  }

  function makeInfoDrawer(id, html) {
    const d = document.createElement('div');
    d.className = 'rm-i-drawer';
    d.id = id;
    d.innerHTML = html;
    return d;
  }

  function harvestNodes(unit, selectors) {
    const out = [];
    selectors.forEach(sel => {
      Array.from(unit.querySelectorAll(sel)).forEach(n => {
        if (n && out.indexOf(n) < 0) out.push(n);
      });
    });
    return out;
  }

  function focusizeUnit(room, unit, idx) {
    if (!unit || unit.dataset.focusReady === '1') return;
    unit.dataset.focusReady = '1';
    unit.classList.add('rm-focus-unit');
    const id = `focus-drawer-${room}-${idx}-${Math.random().toString(36).slice(2, 7)}`;
    const h = unitHeadline(room, unit, idx);
    // Attach [i] next to the primary English headline.
    let anchor = null;
    if (room === 'reader') anchor = unit.querySelector('.case-heading-en, .case-num-title, .case-heading');
    else if (room === 'matrix') anchor = unit.querySelector('.matrix-ref-clean, .matrix-source-band');
    else if (room === 'lineage') anchor = unit.querySelector('.lineage-master-name-en');
    else if (room === 'gongan') anchor = unit.querySelector('.catalogue-title-en');
    else if (room === 'lexicon') anchor = unit.querySelector('.lexicon-headword');
    if (!anchor) anchor = unit;

    const btn = makeInfoButton(id);
    if (anchor.parentNode && anchor !== unit) anchor.appendChild(btn);
    else {
      const head = document.createElement('div');
      head.className = 'rm-focus-head';
      head.innerHTML = `<span class="rm-acc-en">${escHtml(h.en || 'Untitled')}</span>`;
      head.appendChild(btn);
      unit.insertBefore(head, unit.firstChild);
    }

    // Build drawer: move Chinese/extra nodes in + plain-language info section.
    const drawer = makeInfoDrawer(id, '');
    const extras = harvestNodes(unit, [
      '.classical-zh', '.pinyin-line', '.provenance-line',
      '.matrix-sentence-zh', '.matrix-sentence-pinyin', '.matrix-source-location',
      '.lineage-master-record', '.lineage-master-quote',
      '.catalogue-detail', '.catalogue-theme', '.catalogue-locator',
      '.lexicon-entry-def', '.lexicon-occurrences',
      '.case-heading-zh', '.lineage-master-name-zh', '.catalogue-title-zh', '.lexicon-headword-zh'
    ]);
    extras.forEach(n => drawer.appendChild(n));

    let infoHtml = '';
    if (room === 'reader') {
      const corpusKey = state.currentCorpusKey;
      const doc = (state.data.corpus && state.data.corpus[corpusKey]) || {};
      const lead = queryText(unit, '.translation-text') || queryText(unit, '.prose-en');
      infoHtml = infoRows([
        ['Where it came from', `Part of ${escHtml(stringValue(doc.title_en) || corpusKey)}. English first — Chinese source is above when you need it.`],
        ['What is related', `Open the work info for teachers linked to this text.`],
        ['Background', escHtml(clipText(lead, 220) || 'No English rendering recorded for this part.')]
      ]);
    } else if (room === 'matrix') {
      const item = (state.data.translations_matrix || [])[idx];
      if (item) infoHtml = infoRows(matrixInfoRows(item, idx));
    } else if (room === 'lineage') {
      const idm = unit.getAttribute ? unit.getAttribute('data-master-card') : null;
      const m = (state.data.lineage || []).find(x => x && x.id === idm);
      if (m) infoHtml = teacherContextRows(m);
    } else if (room === 'gongan') {
      const list = Array.isArray(state.data.gongan_index) ? state.data.gongan_index : [];
      const no = queryText(unit, '.catalogue-case');
      const g = list.find(x => x && stringValue(x.case_no) === no) || list[idx];
      if (g) infoHtml = infoRows(gonganInfoRows(g));
    } else if (room === 'lexicon') {
      const list = Array.isArray(state.data.glossary) ? state.data.glossary : [];
      const head = queryText(unit, '.lexicon-headword-zh') || queryText(unit, '.lexicon-headword');
      const item = list.find(x => x && (x.term === head || x.literal === head)) || list[idx];
      if (item) infoHtml = infoRows(lexiconInfoRows(item));
    }
    if (infoHtml) {
      const infoWrap = document.createElement('div');
      infoWrap.className = 'rm-unit-info';
      infoWrap.innerHTML = `<div class="context-info-body">${infoHtml}</div>`;
      drawer.appendChild(infoWrap);
    }
    unit.appendChild(drawer);
  }

  function focusReaderExtras(root) {
    const drawer = root.querySelector('.ledger-drawer');
    const front = root.querySelector('.front-matter, .document-details');
    const workCtx = root.querySelector('.work-context');
    if (workCtx && workCtx.parentNode) workCtx.parentNode.removeChild(workCtx);
    const stack = document.createElement('div');
    stack.className = 'rm-room-info';
    const id = 'focus-work-info';
    stack.innerHTML = `<span class="rm-acc-en">This work</span>`;
    const btn = makeInfoButton(id);
    stack.appendChild(btn);
    const d = makeInfoDrawer(id, `<div class="context-info-body">${readerInfoStackHtml()}</div>`);
    if (drawer) d.appendChild(drawer);
    if (front) d.appendChild(front);
    stack.appendChild(d);
    const heading = root.querySelector('.document-heading');
    if (heading && heading.parentNode) heading.parentNode.insertBefore(stack, heading.nextSibling);
    else root.insertBefore(stack, root.firstChild);
  }

  function focusMatrixExtras(root, units) { /* per-unit drawers already attached */ }
  function focusLineageExtras(root, units) { /* per-unit drawers already attached */ }
  function focusGonganExtras(root, units) { /* per-unit drawers already attached */ }
  function focusLexiconExtras(root, units) { /* per-unit drawers already attached */ }

  // ==========================================================================
  // LAYOUT 4 · TIMELINE — horizontal scroll-snap cards
  // ==========================================================================
  function roomTimeline(room, root) {
    root.classList.add('rm-timeline');
    // Hide focus nav if present
    const fn = document.getElementById('focus-room-nav');
    if (fn) fn.hidden = true;

    if (room === 'reader') {
      // Move non-card chrome into cards on the rail; case-cards already sized by CSS.
      const heading = root.querySelector('.document-heading');
      if (heading) heading.classList.add('rm-tl-card-like');
      root.querySelectorAll('.case-card').forEach((card, i) => timelineCardify(room, card, i));
      // Work info as first rail card
      const workCtx = root.querySelector('.work-context');
      if (workCtx && workCtx.parentNode) workCtx.parentNode.removeChild(workCtx);
      const info = document.createElement('div');
      info.className = 'rm-room-info';
      info.innerHTML = `<div class="rm-tl-era">Work</div><div class="rm-tl-name">About this work</div>` +
        `<div class="rm-tl-extra"><div class="context-info-body">${readerInfoStackHtml()}</div></div>` +
        `<button type="button" class="rm-tl-expand" aria-expanded="false">Show context</button>`;
      wireTimelineExpand(info);
      root.insertBefore(info, root.firstChild);
      return;
    }

    const units = roomUnits(root, room);
    units.forEach((unit, i) => timelineCardify(room, unit, i));

    // Room-level intro card
    const intro = document.createElement('div');
    intro.className = 'rm-room-info';
    const titles = {
      matrix: ['Compare', 'What this room is', 'One Chinese line, several English voices. Scroll sideways by dynasty line.'],
      lineage: ['Lineage', 'Teachers over time', 'Each card is one teacher. Open a card for where they came from, who is related, background.'],
      gongan: ['Cases', 'Cases by theme', 'Scroll the catalogue as a timeline of cases. Only the title shows until you expand.'],
      lexicon: ['Terms', 'A–Z rail', 'Each term is a card. Definition and occurrences wait behind expand.']
    };
    const t = titles[room] || ['Room', 'Overview', ''];
    intro.innerHTML = `<div class="rm-tl-era">${escHtml(t[0])}</div><div class="rm-tl-name">${escHtml(t[1])}</div>` +
      `<div class="rm-tl-extra"><p class="rm-pane-lead">${escHtml(t[2])}</p></div>` +
      `<button type="button" class="rm-tl-expand" aria-expanded="false">Show context</button>`;
    wireTimelineExpand(intro);
    root.insertBefore(intro, root.firstChild);
  }

  function wireTimelineExpand(card) {
    card.classList.add('rm-tl-collapsed');
    const btn = card.querySelector('.rm-tl-expand');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const open = !card.classList.contains('is-open');
      card.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? 'Hide context' : 'Show context';
    });
  }

  function timelineCardify(room, unit, idx) {
    if (!unit || unit.dataset.tlReady === '1') return;
    unit.dataset.tlReady = '1';
    unit.classList.add('rm-tl-collapsed');
    const h = unitHeadline(room, unit, idx);

    // Build a face (era + name) at the top; wrap the rest as extra.
    const face = document.createElement('div');
    face.className = 'rm-tl-face';
    const era = h.kicker || (room === 'reader' ? `Part ${idx + 1}` : 'Entry');
    face.innerHTML = `<span class="rm-tl-era">${escHtml(era)}</span>` +
      `<span class="rm-tl-name">${escHtml(h.en || 'Untitled')}</span>` +
      (h.zh ? `<span class="rm-acc-zh" lang="zh">${escHtml(h.zh)}</span>` : '');
    unit.insertBefore(face, unit.firstChild);

    // Move existing children (except face) into extra wrapper conceptually via class
    // Mark heavy bits
    const extraBits = harvestNodes(unit, [
      '.case-body', '.dialogue-turn', '.commentary-block', '.verse-block',
      '.translation-grid', '.classical-zh', '.pinyin-line', '.provenance-line',
      '.matrix-register-list', '.matrix-registers', '.matrix-sentence-zh', '.matrix-sentence-pinyin',
      '.lineage-master-record', '.lineage-master-quote',
      '.catalogue-detail', '.catalogue-theme', '.catalogue-locator',
      '.lexicon-entry-def', '.lexicon-occurrences'
    ]);
    // Prefer wrapping: create extra container and move bits
    if (extraBits.length) {
      const extra = document.createElement('div');
      extra.className = 'rm-tl-extra';
      extraBits.forEach(n => {
        if (n.parentNode === unit || (n.parentNode && unit.contains(n.parentNode))) {
          // only move direct-ish content once
        }
      });
      // Simpler approach: add class rm-tl-extra to a wrapper of all non-face children
      const wrap = document.createElement('div');
      wrap.className = 'rm-tl-extra';
      Array.from(unit.childNodes).forEach(n => {
        if (n === face) return;
        wrap.appendChild(n);
      });
      unit.appendChild(wrap);

      // Append plain-language info section inside extra
      let infoHtml = '';
      if (room === 'reader') {
        const lead = queryText(unit, '.translation-text') || queryText(unit, '.prose-en');
        infoHtml = infoRows([
          ['Where it came from', `A part of the open work.`],
          ['What is related', `See the work card at the start of this timeline.`],
          ['Background', escHtml(clipText(lead, 200) || 'No English yet.')]
        ]);
      } else if (room === 'matrix') {
        const item = (state.data.translations_matrix || [])[idx];
        if (item) infoHtml = infoRows(matrixInfoRows(item, idx));
      } else if (room === 'lineage') {
        const idm = unit.getAttribute ? unit.getAttribute('data-master-card') : null;
        const m = (state.data.lineage || []).find(x => x && x.id === idm);
        if (m) infoHtml = teacherContextRows(m);
      } else if (room === 'gongan') {
        const list = Array.isArray(state.data.gongan_index) ? state.data.gongan_index : [];
        const no = queryText(unit, '.catalogue-case');
        const g = list.find(x => x && stringValue(x.case_no) === no) || list[idx];
        if (g) infoHtml = infoRows(gonganInfoRows(g));
      } else if (room === 'lexicon') {
        const list = Array.isArray(state.data.glossary) ? state.data.glossary : [];
        const head = queryText(unit, '.lexicon-headword-zh');
        const item = list.find(x => x && x.term === head) || list[idx];
        if (item) infoHtml = infoRows(lexiconInfoRows(item));
      }
      if (infoHtml) {
        const info = document.createElement('div');
        info.className = 'rm-unit-info';
        info.innerHTML = infoBlock('About — info section', [
          // infoBlock expects rows; pass via innerHTML of infoRows directly instead
        ]);
        // Use plain rows to avoid nested details title noise
        info.innerHTML = `<div class="context-info-body">${infoHtml}</div>`;
        wrap.appendChild(info);
      }
    }

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'rm-tl-expand';
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = 'Open card';
    unit.appendChild(btn);
    btn.addEventListener('click', () => {
      const open = !unit.classList.contains('is-open');
      unit.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? 'Close card' : 'Open card';
    });
  }

  // ==========================================================================
  // LAYOUT 5 · GRAPH + READER SPLIT — 32% dots + 68% detail
  // ==========================================================================
  function roomGraphSplit(room, root) {
    root.classList.add('rm-graphsplit');
    const fn = document.getElementById('focus-room-nav');
    if (fn) fn.hidden = true;

    // Avoid double-wrapping
    if (root.querySelector(':scope > .rm-graph-split')) return;

    const units = roomUnits(root, room);
    const split = document.createElement('div');
    split.className = 'rm-graph-split';
    const pane = document.createElement('aside');
    pane.className = 'rm-graph-pane';
    pane.setAttribute('aria-label', 'Index');
    const reader = document.createElement('div');
    reader.className = 'rm-reader-pane';

    // Move all current children into reader pane
    while (root.firstChild) reader.appendChild(root.firstChild);
    root.appendChild(split);
    split.appendChild(pane);
    split.appendChild(reader);

    // Build dots from units (now inside reader)
    const liveUnits = roomUnits(reader, room);
    const titleMap = {
      reader: 'Parts', matrix: 'Lines', lineage: 'Teachers', gongan: 'Cases', lexicon: 'Terms'
    };
    let html = `<div class="rm-graph-title">${titleMap[room] || 'Index'}</div>`;
    html += `<div class="rm-graph-count">${liveUnits.length} items · click a dot to jump</div>`;
    html += '<ul class="rm-graph-dot-list">';
    liveUnits.forEach((unit, i) => {
      const h = unitHeadline(room, unit, i);
      const uid = `graph-unit-${room}-${i}`;
      unit.id = unit.id || uid;
      unit.setAttribute('data-graph-idx', String(i));
      html += `<li><button type="button" class="rm-graph-dot${i === 0 ? ' is-active' : ''}" data-graph-target="${escHtml(unit.id)}">` +
        `<span class="rm-graph-dot-en">${escHtml(clipText(h.en || h.kicker || `Item ${i + 1}`, 42))}</span>` +
        (h.note ? `<small>${escHtml(clipText(h.note, 48))}</small>` : '') +
        `</button></li>`;
      // English-first extras + info section
      graphEnrichUnit(room, unit, i);
    });
    html += '</ul>';
    html += '<p class="rm-split-note">Left: minimal dots (light mental load). Right: English first — expand a unit for Chinese and notes.</p>';
    pane.innerHTML = html;

    pane.addEventListener('click', (e) => {
      const b = e.target && e.target.closest ? e.target.closest('.rm-graph-dot') : null;
      if (!b) return;
      const id = b.getAttribute('data-graph-target');
      let target = null;
      if (id) {
        try { target = reader.querySelector('#' + id.replace(/([^a-zA-Z0-9_-])/g, '\\$1')); }
        catch (err) { target = document.getElementById(id); }
      }
      pane.querySelectorAll('.rm-graph-dot').forEach(d => d.classList.remove('is-active'));
      b.classList.add('is-active');
      reader.querySelectorAll('.is-active-dot').forEach(n => n.classList.remove('is-active-dot'));
      if (target) {
        target.classList.add('is-active-dot');
        if (typeof target.scrollIntoView === 'function') {
          target.scrollIntoView({ behavior: motionBehavior(), block: 'start' });
        }
      }
    });

    // Room work/teacher stack for reader
    if (room === 'reader') {
      const workCtx = reader.querySelector('.work-context');
      if (workCtx && workCtx.parentNode) workCtx.parentNode.removeChild(workCtx);
      const stack = document.createElement('div');
      stack.className = 'rm-room-info';
      stack.innerHTML = `<details class="context-info rm-info"><summary>About this work and its teachers</summary>` +
        `<div class="context-info-body">${readerInfoStackHtml()}</div></details>`;
      reader.insertBefore(stack, reader.firstChild);
    }
  }

  function graphEnrichUnit(room, unit, idx) {
    // Toggle to reveal Chinese
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'rm-expand-zh';
    btn.textContent = 'Show Chinese & notes';
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', () => {
      const open = !unit.classList.contains('is-expanded');
      unit.classList.toggle('is-expanded', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? 'Hide Chinese & notes' : 'Show Chinese & notes';
    });
    unit.appendChild(btn);

    let infoHtml = '';
    if (room === 'matrix') {
      const item = (state.data.translations_matrix || [])[idx];
      if (item) infoHtml = infoBlock('About this line — info section', matrixInfoRows(item, idx));
    } else if (room === 'lineage') {
      const idm = unit.getAttribute ? unit.getAttribute('data-master-card') : null;
      const m = (state.data.lineage || []).find(x => x && x.id === idm);
      if (m) {
        infoHtml = infoBlock('About this teacher — info section', [
          ['Where they came from', `${escHtml(stringValue(m.name_zh))} — ${escHtml(stringValue(m.dates) || 'dates not recorded')} · ${escHtml(stringValue(m.era) || 'era not recorded')} · ${escHtml(stringValue(m.location) || 'location not recorded')}. Generation ${escHtml(String(m.lineage_depth))} of the recorded transmission.`],
          ['Who they are related to', `House: ${escHtml(stringValue(m.school) || 'not recorded')}. ${lineageTeacherDetail(m)}. Disciples profiled here: ${escHtml(discipleNamesFor(m) || 'none')}.`],
          ['Background', escHtml(stringValue(m.summary) || 'No background summary recorded.')]
        ]);
      }
    } else if (room === 'gongan') {
      const list = Array.isArray(state.data.gongan_index) ? state.data.gongan_index : [];
      const no = queryText(unit, '.catalogue-case');
      const g = list.find(x => x && stringValue(x.case_no) === no) || list[idx];
      if (g) infoHtml = infoBlock('About this case — info section', gonganInfoRows(g));
    } else if (room === 'lexicon') {
      const list = Array.isArray(state.data.glossary) ? state.data.glossary : [];
      const head = queryText(unit, '.lexicon-headword-zh');
      const item = list.find(x => x && x.term === head) || list[idx];
      if (item) infoHtml = infoBlock('About this term — info section', lexiconInfoRows(item));
    } else if (room === 'reader') {
      const lead = queryText(unit, '.translation-text') || queryText(unit, '.prose-en');
      infoHtml = infoBlock('About this part — info section', [
        ['Where it came from', 'A numbered part of the open work in the Reader.'],
        ['What is related', 'Teachers linked to this work are in the fold above.'],
        ['Background', escHtml(clipText(lead, 220) || 'No English rendering recorded.')]
      ]);
    }
    if (infoHtml) {
      const info = document.createElement('div');
      info.className = 'rm-unit-info';
      info.innerHTML = infoHtml;
      unit.appendChild(info);
    }
  }

  // ==========================================================================
  // LAYOUT 6 · HAMBURGER — minimal 3rem header, nav in drawer
  // ==========================================================================
  function roomHamburger(room, root) {
    root.classList.add('rm-hamburger');
    const fn = document.getElementById('focus-room-nav');
    if (fn) fn.hidden = true;
    ensureHamburgerChrome();
    applyShellBrandForVariant('6');

    const units = roomUnits(root, room);
    units.forEach((unit, i) => hamburgerizeUnit(room, unit, i));

    if (room === 'reader') {
      const workCtx = root.querySelector('.work-context');
      if (workCtx && workCtx.parentNode) workCtx.parentNode.removeChild(workCtx);
      const stack = document.createElement('div');
      stack.className = 'rm-room-info';
      stack.innerHTML = `<details class="context-info rm-info"><summary>About this work and its teachers</summary>` +
        `<div class="context-info-body">${readerInfoStackHtml()}</div></details>`;
      const heading = root.querySelector('.document-heading');
      if (heading && heading.parentNode) heading.parentNode.insertBefore(stack, heading.nextSibling);
      else root.insertBefore(stack, root.firstChild);
      // Fold ledgers
      const drawer = root.querySelector('.ledger-drawer');
      if (drawer) wrapNodeInDetails(drawer, 'About this edition — ledgers', 'rm-more', false);
    }

    // Move visible filter rails' clone label into drawer once
    populateHamburgerDrawerExtras(room);
  }

  function populateHamburgerDrawerExtras(room) {
    const nav = document.querySelector('.site-shell .room-nav');
    if (!nav) return;
    let extras = nav.querySelector('.rm-drawer-extras-slot');
    if (!extras) {
      extras = document.createElement('div');
      extras.className = 'rm-drawer-extras-slot';
      nav.appendChild(extras);
    }
    const labels = {
      reader: 'Library and rooms sit in this drawer. The page stays a quiet 42rem column.',
      matrix: 'Compare filters stay here so the page can stay English-first.',
      lineage: 'Lineage filters stay here so the page can stay English-first.',
      gongan: 'Case filters stay here so the page can stay English-first.',
      lexicon: 'Term filters stay here so the page can stay English-first.'
    };
    extras.innerHTML = `<p class="rm-drawer-section-title">This room</p>` +
      `<p class="rm-quiet rm-drawer-note">${escHtml(labels[room] || '')}</p>`;
    // NOTE: no inline style attributes allowed — fix below
  }

  function hamburgerizeUnit(room, unit, idx) {
    if (!unit || unit.dataset.hamReady === '1') return;
    unit.dataset.hamReady = '1';
    const bits = harvestNodes(unit, [
      '.classical-zh', '.pinyin-line',
      '.matrix-sentence-zh', '.matrix-sentence-pinyin',
      '.lineage-master-record', '.lineage-master-quote',
      '.catalogue-detail', '.lexicon-entry-def', '.lexicon-occurrences'
    ]);
    if (bits.length) {
      const d = document.createElement('details');
      d.className = 'rm-more';
      const s = document.createElement('summary');
      s.textContent = 'More — Chinese, records, detail';
      d.appendChild(s);
      bits.forEach(n => d.appendChild(n));
      unit.appendChild(d);
    }
    // Info section
    let infoHtml = '';
    if (room === 'matrix') {
      const item = (state.data.translations_matrix || [])[idx];
      if (item) infoHtml = infoBlock('About this line — info section', matrixInfoRows(item, idx));
    } else if (room === 'lineage') {
      const idm = unit.getAttribute ? unit.getAttribute('data-master-card') : null;
      const m = (state.data.lineage || []).find(x => x && x.id === idm);
      if (m) {
        infoHtml = infoBlock('About this teacher — info section', [
          ['Where they came from', `${escHtml(stringValue(m.name_zh))} — ${escHtml(stringValue(m.dates) || 'dates not recorded')} · ${escHtml(stringValue(m.era) || 'era not recorded')} · ${escHtml(stringValue(m.location) || 'location not recorded')}.`],
          ['Who they are related to', `House: ${escHtml(stringValue(m.school) || 'not recorded')}. ${lineageTeacherDetail(m)}. Disciples: ${escHtml(discipleNamesFor(m) || 'none')}.`],
          ['Background', escHtml(stringValue(m.summary) || 'No background summary recorded.')]
        ]);
      }
    } else if (room === 'gongan') {
      const list = Array.isArray(state.data.gongan_index) ? state.data.gongan_index : [];
      const no = queryText(unit, '.catalogue-case');
      const g = list.find(x => x && stringValue(x.case_no) === no) || list[idx];
      if (g) infoHtml = infoBlock('About this case — info section', gonganInfoRows(g));
    } else if (room === 'lexicon') {
      const list = Array.isArray(state.data.glossary) ? state.data.glossary : [];
      const head = queryText(unit, '.lexicon-headword-zh');
      const item = list.find(x => x && x.term === head) || list[idx];
      if (item) infoHtml = infoBlock('About this term — info section', lexiconInfoRows(item));
    } else if (room === 'reader') {
      const lead = queryText(unit, '.translation-text') || queryText(unit, '.prose-en');
      infoHtml = infoBlock('About this part — info section', [
        ['Where it came from', 'A part of the open work.'],
        ['What is related', 'See the work info fold at the top of the page.'],
        ['Background', escHtml(clipText(lead, 200) || 'No English rendering recorded.')]
      ]);
    }
    if (infoHtml) {
      const info = document.createElement('div');
      info.className = 'rm-unit-info';
      info.innerHTML = infoHtml;
      unit.appendChild(info);
    }
  }

  // ==========================================================================
  // LAYOUT 7 · INFO-FIRST DOSSIER — info hero, translation collapsed
  // ==========================================================================
  function roomDossier(room, root) {
    root.classList.add('rm-dossier');
    const fn = document.getElementById('focus-room-nav');
    if (fn) fn.hidden = true;
    applyShellBrandForVariant('7');

    // Build room-level dossier hero
    const hero = document.createElement('section');
    hero.className = 'rm-dossier-hero';
    hero.innerHTML = dossierHeroHtml(room);
    root.insertBefore(hero, root.firstChild);

    // Wrap remaining content as translation/body, hidden by default
    const body = document.createElement('div');
    body.className = 'rm-dossier-translation';
    body.hidden = true;
    body.id = `dossier-body-${room}`;
    const toMove = Array.from(root.childNodes).filter(n => n !== hero);
    toMove.forEach(n => body.appendChild(n));
    root.appendChild(body);

    const toggle = hero.querySelector('.rm-dossier-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const open = body.hidden;
        body.hidden = !open;
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.textContent = open ? 'Hide translation' : dossierToggleLabel(room);
      });
    }

    // Per-unit mini dossiers inside the body (info first on each card)
    const units = roomUnits(body, room);
    units.forEach((unit, i) => dossierizeUnit(room, unit, i));
  }

  function dossierToggleLabel(room) {
    if (room === 'reader') return 'Read translation';
    if (room === 'matrix') return 'Show comparison lines';
    if (room === 'lineage') return 'Show teachers';
    if (room === 'gongan') return 'Show cases';
    if (room === 'lexicon') return 'Show terms';
    return 'Show content';
  }

  function dossierHeroHtml(room) {
    if (room === 'reader') {
      const corpusKey = state.currentCorpusKey;
      const doc = (state.data.corpus && state.data.corpus[corpusKey]) || {};
      const title = stringValue(doc.title_en) || corpusKey || 'Work';
      const zh = stringValue(doc.title_zh);
      return `<p class="rm-dossier-kicker">Work dossier</p>` +
        `<h2>${escHtml(title)}</h2>` +
        (zh ? `<p class="rm-dossier-zh" lang="zh">${escHtml(zh)}</p>` : '') +
        `<div class="rm-dossier-meta"><span>Witness <strong>${escHtml(stringValue(doc.cbeta_id) || 'not recorded')}</strong></span>` +
        `<span>Status <strong>${escHtml(stringValue(doc.status) || 'open')}</strong></span></div>` +
        `<div class="context-info-body">${workContextRows(corpusKey)}</div>` +
        `<div class="rm-dossier-teachers"><h3>Related teachers</h3>${dossierTeacherChips(corpusKey)}</div>` +
        `<button type="button" class="rm-dossier-toggle" aria-expanded="false" aria-controls="dossier-body-reader">${dossierToggleLabel('reader')}</button>`;
    }
    if (room === 'matrix') {
      const n = Array.isArray(state.data.translations_matrix) ? state.data.translations_matrix.length : 0;
      return `<p class="rm-dossier-kicker">Compare dossier</p>` +
        `<h2>What is collation here?</h2>` +
        `<div class="context-info-body">${infoRows([
          ['Where it came from', 'Each line is one Classical Chinese sentence taken from a recorded source, shown with several English renderings side by side.'],
          ['What is related', `${n} source line${n === 1 ? '' : 's'} are indexed in this room. Quoted registers keep their edition record; project drafts are labelled as drafts.`],
          ['Background', 'Collation means reading one Chinese line against more than one English voice so differences in tone, vocabulary and structure stay visible.']
        ])}</div>` +
        `<button type="button" class="rm-dossier-toggle" aria-expanded="false" aria-controls="dossier-body-matrix">${dossierToggleLabel('matrix')}</button>`;
    }
    if (room === 'lineage') {
      const n = Array.isArray(state.data.lineage) ? state.data.lineage.length : 0;
      return `<p class="rm-dossier-kicker">Lineage dossier</p>` +
        `<h2>Generation context</h2>` +
        `<div class="context-info-body">${infoRows([
          ['Where it came from', `This room lists ${n} profiled teachers with dates, houses and places drawn from the project lineage register.`],
          ['What is related', 'Each teacher card links house, disciples and the works tied to them. Open a card for the full plain-language info section.'],
          ['Background', 'Lineage here is a reading aid, not a claim of unbroken transmission. Dates and places are recorded as the project has them.']
        ])}</div>` +
        `<button type="button" class="rm-dossier-toggle" aria-expanded="false" aria-controls="dossier-body-lineage">${dossierToggleLabel('lineage')}</button>`;
    }
    if (room === 'gongan') {
      const n = Array.isArray(state.data.gongan_index) ? state.data.gongan_index.length : 0;
      return `<p class="rm-dossier-kicker">Cases dossier</p>` +
        `<h2>Theme context</h2>` +
        `<div class="context-info-body">${infoRows([
          ['Where it came from', `${n} cases are indexed from recorded collections with case numbers and CBETA ids where known.`],
          ['What is related', 'Each case points at a protagonist and theme group. Cross-references sit in the case info section.'],
          ['Background', 'A gong\'an is a recorded encounter used for study. This catalogue is an index into those encounters, not the full commentary apparatus.']
        ])}</div>` +
        `<button type="button" class="rm-dossier-toggle" aria-expanded="false" aria-controls="dossier-body-gongan">${dossierToggleLabel('gongan')}</button>`;
    }
    // lexicon
    const n = Array.isArray(state.data.glossary) ? state.data.glossary.length : 0;
    return `<p class="rm-dossier-kicker">Terms dossier</p>` +
      `<h2>Headword context</h2>` +
      `<div class="context-info-body">${infoRows([
        ['Where it came from', `${n} Classical Chan terms are glossed with readings, categories and occurrence lists.`],
        ['What is related', 'Categories group terms by family of usage. Occurrences point back into the corpus.'],
        ['Background', 'Definitions are plain-language project notes to keep reading light — expand a term for the full entry.']
      ])}</div>` +
      `<button type="button" class="rm-dossier-toggle" aria-expanded="false" aria-controls="dossier-body-lexicon">${dossierToggleLabel('lexicon')}</button>`;
  }

  function dossierTeacherChips(corpusKey) {
    const related = relatedTeachersForCorpusKey(corpusKey);
    if (!related.length) return '<p class="rm-dossier-empty">No profiled teacher is linked to this work yet.</p>';
    return related.map(m =>
      `<button type="button" class="rm-dossier-teacher-chip teacher-link" data-master-teacher="${escHtml(m.id)}">` +
      `${escHtml(masterDisplayName(m))}</button>`
    ).join('');
  }

  function dossierizeUnit(room, unit, idx) {
    if (!unit || unit.dataset.dossierReady === '1') return;
    unit.dataset.dossierReady = '1';
    const h = unitHeadline(room, unit, idx);

    let rowsHtml = '';
    if (room === 'matrix') {
      const item = (state.data.translations_matrix || [])[idx];
      if (item) rowsHtml = infoRows(matrixInfoRows(item, idx));
    } else if (room === 'lineage') {
      const idm = unit.getAttribute ? unit.getAttribute('data-master-card') : null;
      const m = (state.data.lineage || []).find(x => x && x.id === idm);
      if (m) rowsHtml = teacherContextRows(m);
    } else if (room === 'gongan') {
      const list = Array.isArray(state.data.gongan_index) ? state.data.gongan_index : [];
      const no = queryText(unit, '.catalogue-case');
      const g = list.find(x => x && stringValue(x.case_no) === no) || list[idx];
      if (g) rowsHtml = infoRows(gonganInfoRows(g));
    } else if (room === 'lexicon') {
      const list = Array.isArray(state.data.glossary) ? state.data.glossary : [];
      const head = queryText(unit, '.lexicon-headword-zh');
      const item = list.find(x => x && x.term === head) || list[idx];
      if (item) rowsHtml = infoRows(lexiconInfoRows(item));
    } else if (room === 'reader') {
      const lead = queryText(unit, '.translation-text') || queryText(unit, '.prose-en');
      rowsHtml = infoRows([
        ['Where it came from', `Part ${idx + 1} of the open work.`],
        ['What is related', 'Teachers for this work are listed in the dossier above.'],
        ['Background', escHtml(clipText(lead, 180) || 'No English rendering recorded.')]
      ]);
    }

    const mini = document.createElement('div');
    mini.className = 'rm-unit-dossier';
    mini.innerHTML = `<span class="rm-acc-kicker">${escHtml(h.kicker || ROOM_UNIT_NOUN[room] || 'Item')}</span>` +
      `<div class="rm-acc-en">${escHtml(h.en || 'Untitled')}</div>` +
      `<div class="context-info-body">${rowsHtml}</div>`;
    unit.insertBefore(mini, unit.firstChild);

    // Collapse the rest of the unit behind a read button
    const body = document.createElement('div');
    body.className = 'rm-unit-body';
    body.hidden = true;
    Array.from(unit.childNodes).forEach(n => {
      if (n === mini) return;
      body.appendChild(n);
    });
    const read = document.createElement('button');
    read.type = 'button';
    read.className = 'rm-unit-read';
    read.setAttribute('aria-expanded', 'false');
    read.textContent = room === 'reader' ? 'Read this part' : 'Show details';
    read.addEventListener('click', () => {
      const open = body.hidden;
      body.hidden = !open;
      read.setAttribute('aria-expanded', open ? 'true' : 'false');
      read.textContent = open ? 'Hide details' : (room === 'reader' ? 'Read this part' : 'Show details');
    });
    unit.appendChild(read);
    unit.appendChild(body);
  }

  function discipleNamesFor(m) {
    if (!m) return '';
    const all = Array.isArray(state.data.lineage) ? state.data.lineage : [];
    const id = m.id;
    const kids = all.filter(x => x && (x.teacher_id === id || x.parent_id === id ||
      (Array.isArray(x.teachers) && x.teachers.indexOf(id) >= 0)));
    if (!kids.length && Array.isArray(m.disciples)) {
      return m.disciples.map(d => stringValue(d)).filter(Boolean).join(', ');
    }
    return kids.map(x => masterDisplayName(x)).filter(Boolean).join(', ');
  }

  // ==========================================================================
  // Phase 5 — LAYOUTS 8–15 · USABLE HAND-PICK FAMILY (2026-09-18)
  // --------------------------------------------------------------------------
  // Owner feedback on 3–7 (2026-09-14): "The good news is that there have been
  // drastic changes. The less good news is that it's not useable yet. However
  // there are individual elements that might be able to be handpicked later on
  // for a targeted page build. Lets first implement more examples before going
  // into review."
  //
  // So 8–15 are eight MORE examples, each a usable alternative rendering of all
  // five rooms. Every one of them:
  //   • keeps the walnut shell and the room nav VISIBLE — no hamburger, no
  //     hidden navigation — and leaves the room's own filter reachable;
  //   • shows English first and keeps Chinese one intentional step away
  //     (tab · bottom sheet · TOC pane · card · drawer · side pane · rail ·
  //     footnote), never gone and never invented;
  //   • carries a plain-language info section for the work, teacher, case or
  //     term in view (where it came from · what or who is related · background);
  //   • moves nothing out of the page and edits no text: extras are toggles;
  //   • keeps layout 1's colours exactly — structure only, scoped by data-design.
  //
  // Zero inline styles, zero new .style writes: the four CSSOM custom-property
  // writes elsewhere stay four. Class toggles + the hidden attribute only.
  // ==========================================================================

  const USABLE_LAYOUTS = ['8', '9', '10', '11', '12', '13', '14', '15'];
  const ROOM_LABEL = { reader: 'Read', matrix: 'Compare', lineage: 'Lineage', gongan: 'Cases', lexicon: 'Terms' };
  const ROOM_NOUN = { reader: 'part', matrix: 'line', lineage: 'teacher', gongan: 'case', lexicon: 'term' };
  const ROOM_NOUN_PLURAL = { reader: 'parts', matrix: 'lines', lineage: 'teachers', gongan: 'cases', lexicon: 'terms' };

  // "The rest" of a unit in the rooms where a layout parks it one step away:
  // source Chinese, reading aids, provenance and long records. The Reader's own
  // disclosure ledgers are deliberately NOT in this list — they stay in the
  // page in every layout (source-review status must never hide behind chrome).
  const UNIT_EXTRA_SELECTORS = {
    reader: ['.classical-zh', '.pinyin-line', '.provenance-line', '.translation-source', '.case-heading-zh'],
    matrix: ['.matrix-sentence-zh', '.matrix-sentence-pinyin', '.matrix-source-location', '.matrix-register-note'],
    lineage: ['.lineage-master-record', '.lineage-master-quote'],
    gongan: ['.catalogue-detail', '.catalogue-theme', '.catalogue-locator'],
    lexicon: ['.lexicon-entry-def', '.lexicon-occurrences']
  };

  function harvestExtras(unit, room) {
    return harvestNodes(unit, UNIT_EXTRA_SELECTORS[room] || []);
  }

  function ensureUnitId(room, unit, idx) {
    if (!unit.id) unit.id = `rm-unit-${room}-${idx}`;
    return unit.id;
  }

  function scrollToUnit(unit) {
    if (!unit) return;
    // If the unit lives in a hidden tab pane, open that pane first.
    if (typeof unit.closest === 'function') {
      const pane = unit.closest('.rm-tab-pane');
      const panels = pane && pane.parentNode ? pane.parentNode : null;
      if (pane && panels && pane.hasAttribute('hidden')) {
        const shell = panels.parentNode;
        const bar = shell && shell.querySelector ? shell.querySelector('.layout-tabs') : null;
        const btn = bar ? bar.querySelector(`.layout-tab[data-tab="${pane.getAttribute('data-tab')}"]`) : null;
        if (btn) btn.click();
      }
    }
    if (typeof unit.scrollIntoView === 'function') {
      unit.scrollIntoView({ behavior: motionBehavior(), block: 'start' });
    }
    unit.classList.add('rm-flash');
    setTimeout(() => { if (unit.classList) unit.classList.remove('rm-flash'); }, 1100);
  }

  function jumpButton(label, unit, className) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `btn-pill rm-jump${className ? ' ' + className : ''}`;
    b.textContent = label;
    b.addEventListener('click', () => scrollToUnit(unit));
    return b;
  }

  function toggleButton(label, className) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = className || 'btn-pill rm-toggle';
    b.textContent = label;
    b.setAttribute('aria-expanded', 'false');
    return b;
  }

  function setToggleState(btn, open, openLabel, closedLabel) {
    if (!btn) return;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.textContent = open ? openLabel : closedLabel;
  }

  function corpusTitle() {
    const doc = (state.data.corpus && state.data.corpus[state.currentCorpusKey]) || {};
    return stringValue(doc.title_en) || state.currentCorpusKey;
  }

  function readerLead(unit) {
    return queryText(unit, '.translation-text') || queryText(unit, '.prose-en');
  }

  function unitForIndex(room, units, idx) {
    return units && units[idx] ? units[idx] : null;
  }

  // The three plain-language rows for one TEACHER (where from · related ·
  // background). Same content as teacherContextRows(), delivered as rows so the
  // usable layouts can place it in a pane, a sheet, a drawer or a footnote.
  function teacherRowsFor(m) {
    const teacher = (state.data.lineage || []).find(x => x && x.id === m.teacher);
    const disciples = Array.isArray(m.disciples)
      ? m.disciples.map(id => (state.data.lineage || []).find(x => x && x.id === id)).filter(Boolean)
      : [];
    const works = Array.isArray(m.linked_corpus_keys)
      ? m.linked_corpus_keys
          .filter(k => state.data.corpus && state.data.corpus[k])
          .map(k => stringValue(state.data.corpus[k].title_en) || k)
      : [];
    return [
      ['Where they came from', `${escHtml(stringValue(m.name_zh))} — ${escHtml(stringValue(m.dates) || 'dates not recorded')} · ${escHtml(stringValue(m.era) || 'era not recorded')} · ${escHtml(stringValue(m.location) || 'location not recorded')}. Generation ${escHtml(String(m.lineage_depth))} of the recorded transmission.`],
      ['Who they are related to', `Teacher: ${teacher ? escHtml(masterDisplayName(teacher)) : escHtml(stringValue(m.teacher) || 'not recorded')}. House: ${escHtml(stringValue(m.school) || 'not recorded')}. Disciples profiled here: ${disciples.length ? escHtml(disciples.map(d => masterDisplayName(d)).join(', ')) : 'none'}.`],
      ['Background', `${escHtml(stringValue(m.summary) || 'No background summary recorded.')}${works.length ? ` Linked project works: ${escHtml(works.join(', '))}.` : ''}`]
    ];
  }

  // The three plain-language rows for the unit in view, per room — built only
  // from bundled data fields, never invented Chinese.
  function unitInfoRowsFor(room, unit, idx) {
    if (room === 'matrix') {
      const item = (state.data.translations_matrix || [])[idx];
      return item ? matrixInfoRows(item, idx) : [];
    }
    if (room === 'lineage') {
      const idm = unit && unit.getAttribute ? unit.getAttribute('data-master-card') : null;
      const m = (state.data.lineage || []).find(x => x && x.id === idm);
      return m ? teacherRowsFor(m) : [];
    }
    if (room === 'gongan') {
      const list = Array.isArray(state.data.gongan_index) ? state.data.gongan_index : [];
      const no = queryText(unit, '.catalogue-case');
      const g = list.find(x => x && stringValue(x.case_no) === no) || list[idx];
      return g ? gonganInfoRows(g) : [];
    }
    if (room === 'lexicon') {
      const list = Array.isArray(state.data.glossary) ? state.data.glossary : [];
      const head = queryText(unit, '.lexicon-headword-zh') || queryText(unit, '.lexicon-headword');
      const item = list.find(x => x && (x.term === head || x.literal === head)) || list[idx];
      return item ? lexiconInfoRows(item) : [];
    }
    const related = relatedTeachersForCorpusKey(state.currentCorpusKey);
    const label = unitHeadline('reader', unit, idx);
    return [
      ['Where it came from', `A numbered part of ${escHtml(corpusTitle())} — ${escHtml(label.kicker || `part ${idx + 1}`)}. The Classical Chinese is the source; each English line under it is a separate rendering.`],
      ['What is related', related.length
        ? `Teachers linked to this work: ${escHtml(related.map(m => masterDisplayName(m)).join(', '))}.`
        : 'No profiled teacher is linked to this work yet.'],
      ['Background', escHtml(clipText(readerLead(unit), 240) || 'No English rendering recorded for this part yet.')]
    ];
  }

  // The three plain-language rows for the ROOM itself.
  function roomInfoRowsFor(room) {
    if (room === 'reader') {
      const doc = (state.data.corpus && state.data.corpus[state.currentCorpusKey]) || {};
      const metrics = state.data.project_metrics?.corpus?.per_text?.[state.currentCorpusKey] || {};
      const related = relatedTeachersForCorpusKey(state.currentCorpusKey);
      return [
        ['Where it came from', `Drawn from the CBETA canon witness ${escHtml(stringValue(doc.cbeta_id) || 'not recorded')}. Recorded coverage here: ${escHtml(stringValue(metrics.coverage) || 'representation not recorded')}. The Classical Chinese is the source; English renderings are separate and clearly marked.`],
        ['What is related', related.length
          ? `Teachers linked to this work: ${escHtml(related.map(m => masterDisplayName(m)).join(', '))}.`
          : 'No profiled teacher is linked to this work yet.'],
        ['Background', 'This work is part of the Chan / Zen corpus held in this project and is an excerpt-scale seed unless its editorial status says otherwise. Every register under a line is labelled: machine-made drafts are marked, quoted renderings carry their edition record.']
      ];
    }
    if (room === 'matrix') {
      return [
        ['Where it came from', 'Each line is one Classical Chinese sentence from the canon, with the source reference it was recorded under.'],
        ['What is related', 'Under each line sit the English registers that render it: machine-made drafts and edition-verified quotations, side by side.'],
        ['Background', 'Compare is the room for disagreement between translators. The lines are the same source; the voices are different.']
      ];
    }
    if (room === 'lineage') {
      return [
        ['Where it came from', 'Each entry is one teacher from the recorded transmission register, from the First Patriarch to the Five Houses.'],
        ['What is related', 'Every teacher is linked back to the teacher who preceded them and forward to their recorded disciples and project works.'],
        ['Background', 'The register is a record of what the project holds, generation by generation. Dashed links await exact locators.']
      ];
    }
    if (room === 'gongan') {
      return [
        ['Where it came from', 'Each case is indexed from a recorded collection with its case number and canonical record identifier.'],
        ['What is related', 'Cases are grouped by theme and cross-referenced to the collections they appear in and the teachers in them.'],
        ['Background', 'The case shelf is a catalogue: title, collection, theme and record, with the summary one toggle away.']
      ];
    }
    return [
      ['Where it came from', 'Each entry is a Classical Chan term recorded in this project with its reading, literal gloss and category.'],
      ['What is related', 'Terms carry the canonical locations they occur in, so a word can be followed back into the texts.'],
      ['Background', 'The dictionary is a working field list, not a finished glossary: definitions are plain-language and expandable.']
    ];
  }

  function infoStackBlock(title, rows, open) {
    const d = document.createElement('details');
    d.className = 'context-info rm-room-note';
    if (open) d.setAttribute('open', '');
    d.innerHTML = `<summary>${escHtml(title)}</summary>` +
      `<div class="context-info-body">${infoRows(rows)}</div>`;
    return d;
  }

  function unitDetails(room, unit, idx) {
    const rows = unitInfoRowsFor(room, unit, idx);
    const h = unitHeadline(room, unit, idx);
    const d = document.createElement('details');
    d.className = 'context-info rm-unit-note';
    const summary = document.createElement('summary');
    summary.textContent = `${h.kicker ? h.kicker + ' · ' : ''}${clipText(h.en || `${ROOM_NOUN[room] || 'item'} ${idx + 1}`, 58)} — where from · related · background`;
    d.appendChild(summary);
    const body = document.createElement('div');
    body.className = 'context-info-body';
    body.innerHTML = infoRows(rows);
    d.appendChild(body);
    return d;
  }

  function roomUnitsIn(root, room) {
    return roomUnits(root, room);
  }

  // ==========================================================================
  // LAYOUT 8 · TABBED + BREADCRUMB — sticky tab strip per room, breadcrumb that
  // opens the context drawer in place.
  // ==========================================================================
  const TABBED_SPEC = {
    reader: [
      { key: 'translation', label: 'Translation', hint: 'English first' },
      { key: 'chinese', label: 'Chinese', hint: 'Source and reading' },
      { key: 'context', label: 'Context', hint: 'Where from · related · background' },
      { key: 'related', label: 'Related', hint: 'Teachers of this work' }
    ],
    matrix: [
      { key: 'glance', label: 'At a glance', hint: 'One card per line' },
      { key: 'full', label: 'Full', hint: 'Every register' },
      { key: 'context', label: 'Context', hint: 'About each line' }
    ],
    lineage: [
      { key: 'list', label: 'List', hint: 'The register' },
      { key: 'generations', label: 'By generation', hint: 'Who followed whom' },
      { key: 'context', label: 'Context', hint: 'About each teacher' }
    ],
    gongan: [
      { key: 'list', label: 'List', hint: 'The catalogue' },
      { key: 'themes', label: 'By theme', hint: 'Grouped cases' },
      { key: 'context', label: 'Context', hint: 'About each case' }
    ],
    lexicon: [
      { key: 'az', label: 'A–Z', hint: 'Headwords' },
      { key: 'detail', label: 'Detail', hint: 'Definitions and occurrences' },
      { key: 'context', label: 'Context', hint: 'About each term' }
    ]
  };
  const TABBED_BODY_TAB = { reader: 'translation', matrix: 'full', lineage: 'list', gongan: 'list', lexicon: 'az' };

  function roomTabbed(room, root) {
    root.classList.add('rm-tabbed');
    const fn = document.getElementById('focus-room-nav');
    if (fn) fn.hidden = true;
    if (root.querySelector(':scope > .rm-tab-shell')) return;

    const spec = TABBED_SPEC[room] || [{ key: 'main', label: 'Main', hint: '' }];
    const bodyKey = TABBED_BODY_TAB[room] || spec[0].key;
    const shell = document.createElement('div');
    shell.className = 'rm-tab-shell';
    const bar = document.createElement('div');
    bar.className = 'layout-tabs';
    bar.setAttribute('role', 'tablist');
    bar.setAttribute('aria-label', `${ROOM_LABEL[room] || 'Room'} sections`);
    const panels = document.createElement('div');
    panels.className = 'rm-tab-panels';
    spec.forEach((t, i) => {
      const pane = document.createElement('div');
      pane.className = 'rm-tab-pane';
      pane.setAttribute('data-tab', t.key);
      pane.id = `rm-tab-${room}-${t.key}`;
      pane.setAttribute('role', 'tabpanel');
      if (i > 0) pane.setAttribute('hidden', '');
      panels.appendChild(pane);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `layout-tab${i === 0 ? ' is-active' : ''}`;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('data-tab', t.key);
      btn.setAttribute('aria-controls', pane.id);
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      btn.tabIndex = i === 0 ? 0 : -1;
      btn.innerHTML = `<span class="rm-tab-label">${escHtml(t.label)}</span>` +
        (t.hint ? `<span class="rm-tab-hint">${escHtml(t.hint)}</span>` : '');
      bar.appendChild(btn);
    });
    shell.appendChild(bar);
    shell.appendChild(panels);

    // The room's own content moves into its body pane; the shell then owns the
    // room root. Nothing is discarded — the other panes only add index/context.
    const bodyPane = panels.querySelector(`[data-tab="${bodyKey}"]`);
    while (root.firstChild) bodyPane.appendChild(root.firstChild);
    root.appendChild(shell);
    root.insertBefore(buildBreadcrumb(room, root), shell);

    fillTabPanes(room, bodyPane, panels);
    wireTabBar(bar, panels);
  }

  function buildBreadcrumb(room, root) {
    const nav = document.createElement('nav');
    nav.className = 'bc-bar';
    nav.setAttribute('aria-label', 'Breadcrumb');
    const here = room === 'reader' ? clipText(corpusTitle(), 44) : (ROOM_LABEL[room] || 'Room');
    nav.innerHTML =
      `<button type="button" class="bc-crumb bc-home" data-bc-view="reader">Fake Chan Factory</button>` +
      `<span class="bc-sep" aria-hidden="true">›</span>` +
      `<span class="bc-crumb bc-here" aria-current="page">${escHtml(ROOM_LABEL[room] || 'Room')}</span>` +
      `<span class="bc-sep" aria-hidden="true">›</span>` +
      `<span class="bc-crumb bc-leaf">${escHtml(here)}</span>` +
      `<button type="button" class="bc-context-toggle" aria-expanded="false" aria-controls="bc-context-${room}">Where am I?</button>`;
    const drawer = document.createElement('div');
    drawer.className = 'bc-context';
    drawer.id = `bc-context-${room}`;
    drawer.setAttribute('hidden', '');
    drawer.innerHTML = `<div class="context-info-body">${infoRows(roomInfoRowsFor(room))}</div>`;
    nav.appendChild(drawer);
    nav.addEventListener('click', (e) => {
      const t = e.target && e.target.closest ? e.target.closest('button') : null;
      if (!t) return;
      if (t.classList.contains('bc-home')) {
        if (typeof switchView === 'function') switchView('reader');
        return;
      }
      if (!t.classList.contains('bc-context-toggle')) return;
      const open = drawer.hasAttribute('hidden');
      if (open) drawer.removeAttribute('hidden');
      else drawer.setAttribute('hidden', '');
      t.setAttribute('aria-expanded', open ? 'true' : 'false');
      t.textContent = open ? 'Hide context' : 'Where am I?';
    });
    if (!nav.id) nav.id = `bc-nav-${room}`;
    return nav;
  }

  function wireTabBar(bar, panels) {
    if (!bar || bar.dataset.wired === '1') return;
    bar.dataset.wired = '1';
    const activate = (key) => {
      Array.from(bar.querySelectorAll('.layout-tab')).forEach(t => {
        const on = t.getAttribute('data-tab') === key;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
      });
      Array.from(panels.children).forEach(p => {
        if (p.getAttribute('data-tab') === key) p.removeAttribute('hidden');
        else p.setAttribute('hidden', '');
      });
    };
    bar.addEventListener('click', (e) => {
      const b = e.target && e.target.closest ? e.target.closest('.layout-tab') : null;
      if (!b) return;
      activate(b.getAttribute('data-tab'));
    });
    bar.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const tabs = Array.from(bar.querySelectorAll('.layout-tab'));
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      next.focus();
      activate(next.getAttribute('data-tab'));
      e.preventDefault();
    });
  }

  function fillTabPanes(room, bodyPane, panels) {
    const pane = (key) => panels.querySelector(`[data-tab="${key}"]`);
    const units = roomUnitsIn(bodyPane, room);

    if (room === 'reader') {
      const zh = pane('chinese');
      if (zh) {
        zh.appendChild(paneHead('Chinese source', 'Each part, with its source Chinese, pinyin and provenance note — the English stays on the Translation tab.'));
        units.forEach((unit, i) => zh.appendChild(sourceBlock(room, unit, i)));
      }
      const ctx = pane('context');
      if (ctx) {
        ctx.appendChild(paneHead('Context', 'Plain-language notes: where this work came from, who is related, what the background is.'));
        ctx.appendChild(infoStackBlock('About this work and its teachers', roomInfoRowsFor('reader'), false));
        units.forEach((unit, i) => ctx.appendChild(unitDetails(room, unit, i)));
      }
      const related = pane('related');
      if (related) {
        related.appendChild(paneHead('Related', 'Teachers the project links to this work, and the other works they are linked to.'));
        related.appendChild(relatedTeachersBlock(state.currentCorpusKey, true));
      }
      return;
    }

    if (room === 'matrix') {
      const glance = pane('glance');
      if (glance) {
        glance.appendChild(paneHead('At a glance', 'One card per source line — the reference and the first English voice. Open Full for every register.'));
        units.forEach((unit, i) => glance.appendChild(glanceCard(room, unit, i)));
      }
      const ctx = pane('context');
      if (ctx) {
        ctx.appendChild(paneHead('Context', 'About each line: where it came from, which registers render it, and what the room is for.'));
        ctx.appendChild(infoStackBlock('About this room', roomInfoRowsFor('matrix'), false));
        units.forEach((unit, i) => ctx.appendChild(unitDetails(room, unit, i)));
      }
      return;
    }

    if (room === 'lineage') {
      const gens = pane('generations');
      if (gens) {
        gens.appendChild(paneHead('By generation', 'The same teachers, grouped by the generation the project records them in. Select a name to open it in the register.'));
        gens.appendChild(generationIndex(units));
      }
      const ctx = pane('context');
      if (ctx) {
        ctx.appendChild(paneHead('Context', 'About each teacher: where they came from, who they are related to, and the background the project records.'));
        ctx.appendChild(infoStackBlock('About this room', roomInfoRowsFor('lineage'), false));
        units.forEach((unit, i) => ctx.appendChild(unitDetails(room, unit, i)));
      }
      return;
    }

    if (room === 'gongan') {
      const themes = pane('themes');
      if (themes) {
        themes.appendChild(paneHead('By theme', 'The same cases, grouped by the theme the catalogue records. Select a case to open it in the list.'));
        themes.appendChild(themeIndex(units));
      }
      const ctx = pane('context');
      if (ctx) {
        ctx.appendChild(paneHead('Context', 'About each case: where it came from, what it is related to, and its background.'));
        ctx.appendChild(infoStackBlock('About this room', roomInfoRowsFor('gongan'), false));
        units.forEach((unit, i) => ctx.appendChild(unitDetails(room, unit, i)));
      }
      return;
    }

    // lexicon
    const detail = pane('detail');
    if (detail) {
      detail.appendChild(paneHead('Detail', 'Definitions and the canonical locations each term occurs in, gathered in one place.'));
      units.forEach((unit, i) => detail.appendChild(detailBlock(room, unit, i)));
    }
    const ctx = pane('context');
    if (ctx) {
      ctx.appendChild(paneHead('Context', 'About each term: where it came from, what it is related to, and the background.'));
      ctx.appendChild(infoStackBlock('About this room', roomInfoRowsFor('lexicon'), false));
      units.forEach((unit, i) => ctx.appendChild(unitDetails(room, unit, i)));
    }
  }

  function paneHead(title, lead) {
    const h = document.createElement('div');
    h.className = 'rm-pane-head';
    h.innerHTML = `<h2 class="rm-pane-title">${escHtml(title)}</h2><p class="rm-pane-lead">${escHtml(lead)}</p>`;
    return h;
  }

  function sourceBlock(room, unit, idx) {
    const h = unitHeadline(room, unit, idx);
    const box = document.createElement('section');
    box.className = 'rm-zh-block';
    box.innerHTML = `<h3 class="rm-zh-head"><span class="rm-acc-kicker">${escHtml(h.kicker || `Part ${idx + 1}`)}</span>` +
      `<span class="rm-zh-name">${escHtml(h.en || 'Untitled')}</span></h3>`;
    const extras = harvestExtras(unit, room);
    extras.forEach(n => box.appendChild(n));
    if (!extras.length) {
      const p = document.createElement('p');
      p.className = 'rm-quiet';
      p.textContent = 'No source text recorded for this part in the project yet.';
      box.appendChild(p);
    }
    return box;
  }

  function glanceCard(room, unit, idx) {
    const h = unitHeadline(room, unit, idx);
    const card = document.createElement('article');
    card.className = 'rm-glance-card';
    card.innerHTML = `<div class="rm-glance-kicker">${escHtml(h.kicker || `Line ${idx + 1}`)}</div>` +
      `<h3 class="rm-glance-title">${escHtml(h.en || 'Untitled')}</h3>` +
      (h.note ? `<p class="rm-glance-note">${escHtml(h.note)}</p>` : '');
    card.appendChild(jumpButton('Show in full comparison', unit));
    return card;
  }

  function generationIndex(units) {
    const box = document.createElement('div');
    box.className = 'rm-index-groups';
    const masters = Array.isArray(state.data.lineage) ? state.data.lineage : [];
    const groups = new Map();
    units.forEach((unit, i) => {
      const id = unit.getAttribute ? unit.getAttribute('data-master-card') : null;
      const m = masters.find(x => x && x.id === id);
      const gen = m ? String(m.lineage_depth) : (queryText(unit, '.lineage-master-gen') || 'n');
      const era = m ? stringValue(m.era) : '';
      if (!groups.has(gen)) groups.set(gen, { era: era, items: [] });
      groups.get(gen).items.push({ unit: unit, label: unitHeadline('lineage', unit, i).en || 'Untitled', sub: m ? `${stringValue(m.dates)} · ${stringValue(m.school)}` : '' });
    });
    Array.from(groups.keys()).sort((a, b) => (parseInt(a, 10) || 99) - (parseInt(b, 10) || 99)).forEach(gen => {
      const g = groups.get(gen);
      const sec = document.createElement('section');
      sec.className = 'rm-index-group';
      sec.innerHTML = `<h3 class="rm-index-gen">Generation ${escHtml(gen)}${g.era ? ` <span class="rm-quiet">· ${escHtml(g.era)}</span>` : ''}</h3>`;
      const list = document.createElement('ul');
      list.className = 'rm-index-list';
      g.items.forEach(it => {
        const li = document.createElement('li');
        li.appendChild(jumpButton(it.label + (it.sub ? ` — ${it.sub}` : ''), it.unit, 'rm-index-link'));
        list.appendChild(li);
      });
      sec.appendChild(list);
      box.appendChild(sec);
    });
    return box;
  }

  function themeIndex(units) {
    const box = document.createElement('div');
    box.className = 'rm-index-groups';
    const groups = new Map();
    units.forEach((unit, i) => {
      const themeText = queryText(unit, '.catalogue-theme');
      const group = themeText.split('Group: ')[1] || themeText || 'Theme not recorded';
      const key = group.split(' ·')[0] || group;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push({ unit: unit, label: unitHeadline('gongan', unit, i).en || 'Untitled', no: queryText(unit, '.catalogue-case') });
    });
    Array.from(groups.keys()).forEach(key => {
      const items = groups.get(key);
      const sec = document.createElement('section');
      sec.className = 'rm-index-group';
      sec.innerHTML = `<h3 class="rm-index-gen">${escHtml(key)} <span class="rm-quiet">· ${items.length} case${items.length === 1 ? '' : 's'}</span></h3>`;
      const list = document.createElement('ul');
      list.className = 'rm-index-list';
      items.forEach(it => {
        const li = document.createElement('li');
        li.appendChild(jumpButton(`${it.no ? it.no + ' · ' : ''}${it.label}`, it.unit, 'rm-index-link'));
        list.appendChild(li);
      });
      sec.appendChild(list);
      box.appendChild(sec);
    });
    return box;
  }

  function detailBlock(room, unit, idx) {
    const h = unitHeadline(room, unit, idx);
    const box = document.createElement('section');
    box.className = 'rm-detail-block';
    box.innerHTML = `<h3 class="rm-detail-head"><span class="rm-acc-kicker">${escHtml(h.kicker || 'Term')}</span>` +
      `<span class="rm-detail-title">${escHtml(h.en || 'Untitled')}</span>` +
      (h.zh ? `<span class="rm-acc-zh" lang="zh">${escHtml(h.zh)}</span>` : '') + `</h3>`;
    const extras = harvestExtras(unit, room);
    extras.forEach(n => box.appendChild(n));
    if (!extras.length) {
      const p = document.createElement('p');
      p.className = 'rm-quiet';
      p.textContent = 'No definition recorded for this term yet.';
      box.appendChild(p);
    }
    return box;
  }

  function relatedTeachersBlock(corpusKey, withWorks) {
    const box = document.createElement('div');
    box.className = 'rm-related-block';
    const related = relatedTeachersForCorpusKey(corpusKey);
    if (!related.length) {
      box.innerHTML = '<p class="rm-quiet">No profiled teacher is linked to this work yet.</p>';
      return box;
    }
    related.forEach(m => {
      const card = document.createElement('article');
      card.className = 'rm-related-card';
      const works = Array.isArray(m.linked_corpus_keys)
        ? m.linked_corpus_keys.filter(k => state.data.corpus && state.data.corpus[k])
            .map(k => stringValue(state.data.corpus[k].title_en) || k)
        : [];
      card.innerHTML = `<h3 class="rm-related-name">${escHtml(masterDisplayName(m))}` +
        (m.name_zh ? ` <span class="rm-related-zh" lang="zh">${escHtml(m.name_zh)}</span>` : '') + `</h3>` +
        `<p class="rm-related-meta">${escHtml(stringValue(m.dates) || 'dates not recorded')} · ${escHtml(stringValue(m.era) || 'era not recorded')}</p>` +
        `<p class="rm-related-why">Linked to this work because the project records their transmission here${works.length ? `; their linked works are ${escHtml(works.join(', '))}` : ''}.</p>`;
      box.appendChild(card);
    });
    if (withWorks) {
      const works = Array.from(new Set(related.flatMap(m => Array.isArray(m.linked_corpus_keys) ? m.linked_corpus_keys : [])))
        .filter(k => state.data.corpus && state.data.corpus[k]);
      if (works.length) {
        const sec = document.createElement('section');
        sec.className = 'rm-related-works';
        sec.innerHTML = `<h3 class="rm-index-gen">Works these teachers are linked to</h3>`;
        const list = document.createElement('ul');
        list.className = 'rm-index-list';
        works.forEach(k => {
          const li = document.createElement('li');
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'btn-pill rm-index-link';
          b.textContent = stringValue(state.data.corpus[k].title_en) || k;
          b.addEventListener('click', () => openCorpusDoc(k));
          li.appendChild(b);
          list.appendChild(li);
        });
        sec.appendChild(list);
        box.appendChild(sec);
      }
    }
    return box;
  }

  function openCorpusDoc(key) {
    if (!key) return;
    // The public API owns corpus switching (it also persists the choice); the
    // corpus-list button is the fallback when the API has not been reached.
    if (window.TranslateChan && typeof window.TranslateChan.openDoc === 'function') {
      window.TranslateChan.openDoc(key);
      return;
    }
    const btn = document.querySelector(`[data-corpus-key="${key}"]`);
    if (btn && typeof btn.click === 'function') btn.click();
  }

  // ==========================================================================
  // LAYOUT 9 · BOTTOM SHEET — English-first page; everything extra slides up
  // from the bottom edge in one sheet, with a handle and a plain-language head.
  // ==========================================================================
  function roomBottomSheet(room, root) {
    root.classList.add('rm-sheet');
    const fn = document.getElementById('focus-room-nav');
    if (fn) fn.hidden = true;
    const shell = ensureBottomSheet(room, root);
    const units = roomUnitsIn(root, room);

    units.forEach((unit, i) => {
      const h = unitHeadline(room, unit, i);
      const section = document.createElement('section');
      section.className = 'rm-sheet-block';
      section.id = `rm-sheet-block-${room}-${i}`;
      section.innerHTML = `<h3 class="rm-sheet-block-head"><span class="rm-acc-kicker">${escHtml(h.kicker || `Item ${i + 1}`)}</span>` +
        `<span class="rm-acc-en">${escHtml(h.en || 'Untitled')}</span></h3>`;
      harvestExtras(unit, room).forEach(n => section.appendChild(n));
      const rows = unitInfoRowsFor(room, unit, i);
      if (rows.length) {
        const info = document.createElement('div');
        info.className = 'context-info-body';
        info.innerHTML = infoRows(rows);
        section.appendChild(info);
      }
      shell.body.appendChild(section);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'rm-sheet-open rm-sheet-unit-btn';
      btn.textContent = 'More — source, notes and context';
      btn.setAttribute('aria-controls', section.id);
      btn.addEventListener('click', () => openBottomSheet(room, root, section.id));
      unit.appendChild(btn);
    });

    const roomBlock = document.createElement('section');
    roomBlock.className = 'rm-sheet-block rm-sheet-room';
    roomBlock.id = `rm-sheet-block-${room}-room`;
    roomBlock.innerHTML = `<h3 class="rm-sheet-block-head">About this room</h3>` +
      `<div class="context-info-body">${infoRows(roomInfoRowsFor(room))}</div>`;
    shell.body.insertBefore(roomBlock, shell.body.firstChild);
  }

  function ensureBottomSheet(room, root) {
    let shell = root.querySelector(':scope > .rm-sheet-shell');
    if (shell) return shell;
    shell = document.createElement('div');
    shell.className = 'rm-sheet-shell';
    shell.id = `rm-bottom-sheet-${room}`;
    shell.setAttribute('hidden', '');
    shell.setAttribute('role', 'dialog');
    shell.setAttribute('aria-label', 'Context and source detail');
    shell.innerHTML =
      `<div class="rm-sheet-handle" aria-hidden="true"></div>` +
      `<div class="rm-sheet-head">` +
      `<h2 class="rm-sheet-title">Context</h2>` +
      `<p class="rm-sheet-sub">Everything that is not the English reading, in plain language.</p>` +
      `<button type="button" class="rm-sheet-close" aria-label="Close context sheet">Close</button>` +
      `</div>` +
      `<div class="rm-sheet-body"></div>`;
    root.appendChild(shell);
    const body = shell.querySelector('.rm-sheet-body');
    const fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'rm-sheet-fab';
    fab.innerHTML = `<span aria-hidden="true">▲</span> Show context`;
    fab.setAttribute('aria-controls', shell.id);
    fab.addEventListener('click', () => openBottomSheet(room, root, roomBlockId(room)));
    root.appendChild(fab);
    shell.querySelector('.rm-sheet-close').addEventListener('click', () => closeBottomSheet(root));
    shell.addEventListener('click', (e) => {
      if (e.target === shell) closeBottomSheet(root);
    });
    shell.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeBottomSheet(root);
    });
    shell.dataset.room = room;
    return { shell: shell, body: body, fab: fab };
  }

  function roomBlockId(room) { return `rm-sheet-block-${room}-room`; }

  // Close every open layout-9 sheet, except the one being opened (if any).
  function closeOpenBottomSheets(keep) {
    if (typeof document === 'undefined' || !document.querySelectorAll) return;
    document.querySelectorAll('.rm-sheet-shell.is-open').forEach(shell => {
      if (keep && shell === keep) return;
      shell.classList.remove('is-open');
      shell.setAttribute('hidden', '');
    });
  }

  function openBottomSheet(room, root, blockId) {
    const shell = root.querySelector(':scope > .rm-sheet-shell');
    if (!shell) return;
    closeOpenBottomSheets(shell);
    shell.removeAttribute('hidden');
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => shell.classList.add('is-open'));
    else shell.classList.add('is-open');
    const body = shell.querySelector('.rm-sheet-body');
    const target = blockId ? document.getElementById(blockId) : null;
    if (target && body && body.contains(target)) {
      if (typeof target.scrollIntoView === 'function') {
        target.scrollIntoView({ behavior: motionBehavior(), block: 'start' });
      }
    }
    const close = shell.querySelector('.rm-sheet-close');
    if (close && typeof close.focus === 'function') close.focus();
  }

  function closeBottomSheet(root) {
    const host = root || document;
    const shell = host.querySelector ? host.querySelector('.rm-sheet-shell') : null;
    if (!shell) return;
    shell.classList.remove('is-open');
    setTimeout(() => { if (shell && !shell.classList.contains('is-open')) shell.setAttribute('hidden', ''); }, 220);
  }
  // ==========================================================================
  // LAYOUT 10 · STICKY TOC + READER + CONTEXT — 16rem / 1fr / 16rem, titles in
  // the left pane, English in the middle, context in the right, and a Context
  // button that folds the right pane without hiding the contents.
  // ==========================================================================
  function roomStickyToc(room, root) {
    root.classList.add('rm-toc');
    const fn = document.getElementById('focus-room-nav');
    if (fn) fn.hidden = true;
    if (root.querySelector(':scope > .rm-toc-shell')) return;

    const shell = document.createElement('div');
    shell.className = 'rm-toc-shell';
    shell.innerHTML =
      `<aside class="toc-pane" aria-label="Contents">` +
      `<div class="toc-head"><span class="toc-title">${escHtml(ROOM_LABEL[room] || 'Room')}</span>` +
      `<button type="button" class="toc-context-btn" aria-expanded="true" aria-controls="toc-context-${room}">Context</button></div>` +
      `<ul class="toc-list"></ul>` +
      `<p class="toc-note">Titles only. Select one to jump to it.</p>` +
      `</aside>` +
      `<div class="reader-pane" id="toc-reader-${room}"></div>` +
      `<aside class="context-pane" id="toc-context-${room}" aria-label="Context">` +
      `<div class="context-pane-head">Where from · related · background</div>` +
      `</aside>`;
    const main = shell.querySelector('.reader-pane');
    while (root.firstChild) main.appendChild(root.firstChild);
    root.appendChild(shell);

    const units = roomUnitsIn(main, room);
    const list = shell.querySelector('.toc-list');
    units.forEach((unit, i) => {
      const h = unitHeadline(room, unit, i);
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'toc-link';
      b.innerHTML = `<span class="toc-kicker">${escHtml(h.kicker || `${i + 1}`)}</span>` +
        `<span class="toc-name">${escHtml(clipText(h.en || 'Untitled', 46))}</span>`;
      b.addEventListener('click', () => scrollToUnit(unit));
      li.appendChild(b);
      list.appendChild(li);
    });
    if (!units.length) {
      const li = document.createElement('li');
      li.className = 'rm-quiet';
      li.textContent = 'Nothing recorded here yet.';
      list.appendChild(li);
    }

    const ctx = shell.querySelector('.context-pane');
    ctx.appendChild(infoStackBlock('About this room', roomInfoRowsFor(room), true));
    units.forEach((unit, i) => ctx.appendChild(unitDetails(room, unit, i)));

    const btn = shell.querySelector('.toc-context-btn');
    btn.addEventListener('click', () => {
      const off = root.classList.toggle('is-context-off');
      btn.setAttribute('aria-expanded', off ? 'false' : 'true');
      btn.textContent = off ? 'Show context' : 'Context';
    });
  }

  // ==========================================================================
  // LAYOUT 11 · SEARCH-FIRST LANDING — a big plain-English search box, minimal
  // cards, context on the card, and the room's own text kept below untouched.
  // ==========================================================================
  function roomSearchFirst(room, root) {
    root.classList.add('rm-searchfirst');
    if (root.querySelector(':scope > .sf-landing')) return;

    const units = roomUnitsIn(root, room);
    const landing = document.createElement('section');
    landing.className = 'sf-landing';
    landing.innerHTML =
      `<h2 class="sf-title">Start with a question</h2>` +
      `<p class="sf-lead">What is Chan? Where do these works come from? Who is related to whom, and what is the background? ` +
      `Type below to narrow the ${escHtml(ROOM_NOUN_PLURAL[room] || 'items')} in this room, or read the cards first — each one opens its own plain-language context.</p>` +
      `<div class="sf-search">` +
      `<label class="sf-label" for="sf-input-${room}">Search this room</label>` +
      `<input id="sf-input-${room}" class="sf-input" type="search" autocomplete="off" ` +
      `placeholder="${escHtml(searchPlaceholder(room))}" aria-label="Search this room">` +
      `</div>` +
      `<p class="sf-count" aria-live="polite"></p>`;
    root.insertBefore(landing, root.firstChild);

    // The room's own filter stays visible at the top of the landing.
    const filter = root.querySelector('.room-filter-rail, .lexicon-filter-row, .gongan-filter-rail');
    if (filter) landing.appendChild(filter);

    const cards = document.createElement('div');
    cards.className = 'sf-cards';
    cards.setAttribute('aria-label', `Quick cards for this room`);
    units.forEach((unit, i) => cards.appendChild(searchCard(room, unit, i)));
    root.insertBefore(cards, landing.nextSibling);

    const full = document.createElement('section');
    full.className = 'sf-full';
    const head = document.createElement('div');
    head.className = 'sf-full-head';
    head.innerHTML = `<h2 class="rm-pane-title">Full ${escHtml(ROOM_NOUN_PLURAL[room] || 'room')}</h2>` +
      `<p class="rm-pane-lead">The room as it is — English first, nothing hidden. The cards above are only a way in.</p>`;
    const toggle = toggleButton('Hide full text', 'btn-pill sf-full-toggle');
    head.appendChild(toggle);
    const body = document.createElement('div');
    body.className = 'sf-full-body';
    Array.from(root.childNodes)
      .filter(n => n !== landing && n !== cards)
      .forEach(n => body.appendChild(n));
    full.appendChild(head);
    full.appendChild(body);
    root.appendChild(full);
    toggle.addEventListener('click', () => {
      const collapsed = full.classList.toggle('is-collapsed');
      setToggleState(toggle, !collapsed, 'Hide full text', 'Show full text');
    });

    const input = landing.querySelector('.sf-input');
    const count = landing.querySelector('.sf-count');
    const apply = () => {
      const q = normalizeForSearch(input.value.trim());
      let hits = 0;
      Array.from(cards.children).forEach(card => {
        const hay = card.getAttribute('data-search') || '';
        const on = !q || hay.includes(q);
        if (on) card.removeAttribute('hidden');
        else card.setAttribute('hidden', '');
        if (on) hits++;
      });
      units.forEach(unit => {
        const hay = normalizeForSearch(nodeText(unit));
        const on = !q || hay.includes(q);
        if (on) unit.removeAttribute('hidden');
        else unit.setAttribute('hidden', '');
      });
      const total = units.length;
      count.textContent = q
        ? `${hits} of ${total} ${ROOM_NOUN_PLURAL[room] || 'items'} match “${input.value.trim()}”.`
        : `${total} ${ROOM_NOUN_PLURAL[room] || 'items'} in this room. Type to narrow them.`;
      if (q) landing.classList.add('is-searching');
    };
    input.addEventListener('input', apply);
    apply();
  }

  function searchPlaceholder(room) {
    if (room === 'reader') return 'A word, a phrase, or a question — e.g. “Buddha-nature”';
    if (room === 'matrix') return 'A source reference, or a word from a rendering';
    if (room === 'lineage') return 'A teacher, a house, a place or an era';
    if (room === 'gongan') return 'A case title, a number or a theme';
    return 'A term, its reading, or a word from the definition';
  }

  function searchCard(room, unit, idx) {
    const h = unitHeadline(room, unit, idx);
    const rows = unitInfoRowsFor(room, unit, idx);
    const card = document.createElement('article');
    card.className = 'sf-card';
    card.setAttribute('data-search', normalizeForSearch([
      h.kicker, h.en, h.zh, h.note,
      rows.map(r => stripTags(r[1])).join(' ')
    ].filter(Boolean).join(' ')));
    card.innerHTML =
      `<div class="sf-card-kicker">${escHtml(h.kicker || `${ROOM_NOUN[room] || 'item'} ${idx + 1}`)}</div>` +
      `<h3 class="sf-card-title">${escHtml(h.en || 'Untitled')}</h3>` +
      (h.note ? `<p class="sf-card-note">${escHtml(h.note)}</p>` : '') +
      `<div class="sf-card-why" hidden><div class="context-info-body">${infoRows(rows)}</div></div>`;
    const why = card.querySelector('.sf-card-why');
    const more = toggleButton('Why this is here', 'btn-pill sf-card-toggle');
    more.addEventListener('click', () => {
      const open = why.hasAttribute('hidden');
      if (open) why.removeAttribute('hidden');
      else why.setAttribute('hidden', '');
      setToggleState(more, open, 'Hide context', 'Why this is here');
    });
    const jump = jumpButton('Read it below', unit, 'sf-card-jump');
    jump.addEventListener('click', () => {
      const landing = card.closest ? card.closest('.rm-searchfirst') : null;
      const box = landing ? landing.querySelector('.sf-landing') : null;
      if (box) box.classList.add('is-compact');
    });
    const foot = document.createElement('div');
    foot.className = 'sf-card-foot';
    foot.appendChild(more);
    foot.appendChild(jump);
    card.appendChild(foot);
    return card;
  }

  function stripTags(html) {
    return String(html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }
  // ==========================================================================
  // LAYOUT 12 · QUESTION-DRIVEN DISCLOSURE — the page asks the three questions
  // the corpus can answer, and every answer arrives one piece at a time.
  // ==========================================================================
  const QUESTION_SPEC = {
    reader: {
      row: ['Where did this come from?', 'Who is related?', 'What is the background?'],
      lead: [
        'Each part is a piece of the open work. This is where its text was taken from, in one line.',
        'The project links teachers to the works they are recorded with. This is who is linked here.',
        'Background is the plain-language note for each part — one piece at a time, never a wall of text.'
      ]
    },
    matrix: {
      row: ['Where does this line come from?', 'Who renders it?', 'What is the background?'],
      lead: [
        'Each line is one Classical Chinese sentence. This is the canon reference it was recorded under.',
        'Under every line sit the English registers that render it. This is who those voices are.',
        'Background explains what the comparison room is for: the lines agree, the voices do not.'
      ]
    },
    lineage: {
      row: ['Where did this teacher come from?', 'Who are they related to?', 'What is the background?'],
      lead: [
        'Each teacher is a node in the recorded transmission register, with dates, era and place.',
        'Teacher and disciples are recorded as edges in the same register. This is each teacher\'s own edge set.',
        'Background is the recorded summary for each teacher, one short note at a time.'
      ]
    },
    gongan: {
      row: ['Where did this case come from?', 'What is it related to?', 'What is the background?'],
      lead: [
        'Each case is indexed from a recorded collection with its own canonical record identifier.',
        'Cases name a protagonist and cross-reference other cases and collections.',
        'Background is the theme the catalogue groups the case under, plus its own summary.'
      ]
    },
    lexicon: {
      row: ['Where did this term come from?', 'Where is it related?', 'What is the background?'],
      lead: [
        'Each term is a Classical Chan word with a reading, a literal gloss and a category.',
        'Terms carry the canonical locations they occur in. This is where each one is recorded.',
        'Background is the plain-language definition, one term at a time.'
      ]
    }
  };

  function roomQuestionDriven(room, root) {
    root.classList.add('rm-questions');
    if (root.querySelector(':scope > .question-row')) return;
    const spec = QUESTION_SPEC[room] || QUESTION_SPEC.reader;
    const units = roomUnitsIn(root, room);

    const row = document.createElement('div');
    row.className = 'question-row';
    row.setAttribute('role', 'group');
    row.setAttribute('aria-label', 'Questions this room can answer');
    const drawers = [];
    spec.row.forEach((label, qi) => {
      const wrap = document.createElement('div');
      wrap.className = 'question-item';
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'question-btn';
      btn.textContent = label;
      btn.setAttribute('aria-expanded', 'false');
      btn.id = `rm-q-btn-${room}-${qi}`;
      const drawer = questionDrawer(room, units, qi, label, spec.lead[qi]);
      drawer.setAttribute('aria-labelledby', btn.id);
      btn.setAttribute('aria-controls', drawer.id);
      btn.addEventListener('click', () => {
        const open = drawer.hasAttribute('hidden');
        drawers.forEach((d, i) => {
          const on = d === drawer && open;
          if (on) d.removeAttribute('hidden');
          else d.setAttribute('hidden', '');
          const b = row.querySelector(`#rm-q-btn-${room}-${i}`);
          if (b) {
            b.setAttribute('aria-expanded', on ? 'true' : 'false');
            b.classList.toggle('is-active', on);
          }
        });
      });
      wrap.appendChild(btn);
      wrap.appendChild(drawer);
      row.appendChild(wrap);
      drawers.push(drawer);
    });
    root.insertBefore(row, root.firstChild);

    // Every unit also carries its own three questions, so a reader who already
    // knows which part they are looking at never has to scan the room.
    units.forEach((unit, i) => unitQuestionRow(room, unit, i, spec));
  }

  function questionDrawer(room, units, qi, label, lead) {
    const drawer = document.createElement('div');
    drawer.className = 'question-drawer';
    drawer.id = `rm-q-drawer-${room}-${qi}`;
    drawer.setAttribute('hidden', '');
    drawer.setAttribute('role', 'region');
    const head = document.createElement('p');
    head.className = 'question-lead';
    head.textContent = lead;
    drawer.appendChild(head);
    units.forEach((unit, i) => {
      const rows = unitInfoRowsFor(room, unit, i);
      const row = rows[qi];
      if (!row) return;
      const h = unitHeadline(room, unit, i);
      const block = document.createElement('article');
      block.className = 'question-answer';
      block.innerHTML = `<div class="question-answer-head">${escHtml(clipText(h.en || `${ROOM_NOUN[room] || 'Item'} ${i + 1}`, 60))}</div>` +
        `<div class="context-text">${row[1]}</div>`;
      block.appendChild(jumpButton('Open it in the room', unit, 'question-jump'));
      drawer.appendChild(block);
    });
    if (!drawer.querySelector('.question-answer')) {
      const p = document.createElement('p');
      p.className = 'rm-quiet';
      p.textContent = 'Nothing is recorded for this question yet.';
      drawer.appendChild(p);
    }
    return drawer;
  }

  function unitQuestionRow(room, unit, idx, spec) {
    if (unit.dataset.qReady === '1') return;
    unit.dataset.qReady = '1';
    const rows = unitInfoRowsFor(room, unit, idx);
    if (!rows.length) return;
    const row = document.createElement('div');
    row.className = 'rm-q-row';
    row.setAttribute('role', 'group');
    row.setAttribute('aria-label', `Questions about this ${ROOM_NOUN[room] || 'unit'}`);
    const holder = document.createElement('div');
    holder.className = 'rm-q-answers';
    spec.row.forEach((label, qi) => {
      const short = ['Where from?', 'Who related?', 'Background?'][qi] || label;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'rm-q-btn';
      btn.textContent = short;
      btn.setAttribute('aria-expanded', 'false');
      const drawer = document.createElement('div');
      drawer.className = 'rm-q-drawer';
      drawer.setAttribute('hidden', '');
      drawer.innerHTML = `<div class="context-label">${escHtml(rows[qi] ? stripTags(rows[qi][0]) : label)}</div>` +
        `<div class="context-text">${rows[qi] ? rows[qi][1] : 'Not recorded yet.'}</div>`;
      btn.addEventListener('click', () => {
        const open = drawer.hasAttribute('hidden');
        if (open) drawer.removeAttribute('hidden');
        else drawer.setAttribute('hidden', '');
        setToggleState(btn, open, 'Hide', short);
      });
      row.appendChild(btn);
      holder.appendChild(drawer);
    });
    unit.appendChild(row);
    unit.appendChild(holder);
  }

  // ==========================================================================
  // LAYOUT 13 · SIDE-BY-SIDE MINIMAL — English on the left, source and detail
  // on the right, each collapsed until a part asks for it.
  // ==========================================================================
  function roomSideBySide(room, root) {
    root.classList.add('rm-sidebyside');
    const fn = document.getElementById('focus-room-nav');
    if (fn) fn.hidden = true;
    if (root.querySelector(':scope > .rm-sb-shell')) return;

    const shell = document.createElement('div');
    shell.className = 'rm-sb-shell';
    const left = document.createElement('div');
    left.className = 'en-pane';
    const right = document.createElement('aside');
    right.className = 'zh-pane';
    right.setAttribute('aria-label', 'Source text and detail');
    right.innerHTML =
      `<div class="zh-pane-head"><span class="zh-pane-title">Source &amp; detail</span>` +
      `<button type="button" class="zh-pane-toggle" aria-expanded="true" aria-controls="sb-pane-body-${room}">Hide pane</button></div>` +
      `<p class="zh-pane-lead">The English reading is on the left. Press “Show source &amp; detail” on a ${escHtml(ROOM_NOUN[room] || 'unit')} and its Chinese and records appear here, with the plain-language context.</p>` +
      `<div class="zh-pane-body" id="sb-pane-body-${room}"></div>`;
    while (root.firstChild) left.appendChild(root.firstChild);
    shell.appendChild(left);
    shell.appendChild(right);
    root.appendChild(shell);

    const body = right.querySelector('.zh-pane-body');
    body.appendChild(infoStackBlock('About this room', roomInfoRowsFor(room), true));

    const units = roomUnitsIn(left, room);
    units.forEach((unit, i) => {
      const h = unitHeadline(room, unit, i);
      const card = document.createElement('section');
      card.className = 'sb-card';
      card.id = `rm-sb-card-${room}-${i}`;
      card.setAttribute('hidden', '');
      card.innerHTML = `<h3 class="sb-card-head"><span class="rm-acc-kicker">${escHtml(h.kicker || `${ROOM_NOUN[room] || 'Item'} ${i + 1}`)}</span>` +
        `<span class="rm-acc-en">${escHtml(h.en || 'Untitled')}</span></h3>`;
      harvestExtras(unit, room).forEach(n => card.appendChild(n));
      const rows = unitInfoRowsFor(room, unit, i);
      if (rows.length) {
        const info = document.createElement('div');
        info.className = 'context-info-body';
        info.innerHTML = infoRows(rows);
        card.appendChild(info);
      }
      body.appendChild(card);

      const btn = toggleButton('Show source & detail', 'btn-pill rm-sb-toggle');
      btn.setAttribute('aria-controls', card.id);
      btn.addEventListener('click', () => {
        const open = card.hasAttribute('hidden');
        if (open) card.removeAttribute('hidden');
        else card.setAttribute('hidden', '');
        setToggleState(btn, open, 'Hide source & detail', 'Show source & detail');
        right.classList.toggle('has-open', body.querySelectorAll('.sb-card:not([hidden])').length > 0);
      });
      unit.appendChild(btn);
    });

    const paneToggle = right.querySelector('.zh-pane-toggle');
    paneToggle.addEventListener('click', () => {
      const off = root.classList.toggle('is-pane-off');
      paneToggle.setAttribute('aria-expanded', off ? 'false' : 'true');
      paneToggle.textContent = off ? 'Show pane' : 'Hide pane';
    });
  }
  // ==========================================================================
  // LAYOUT 14 · RELATED RAIL — the main column stays the room; a 18rem rail
  // lists only what is related, and every card says why on hover or select.
  // ==========================================================================
  function roomRelatedRail(room, root) {
    root.classList.add('rm-rail');
    const fn = document.getElementById('focus-room-nav');
    if (fn) fn.hidden = true;
    if (root.querySelector(':scope > .rm-rail-shell')) return;

    const shell = document.createElement('div');
    shell.className = 'rm-rail-shell';
    const main = document.createElement('div');
    main.className = 'rm-rail-main';
    const rail = document.createElement('aside');
    rail.className = 'related-rail';
    rail.setAttribute('aria-label', 'Related');
    while (root.firstChild) main.appendChild(root.firstChild);
    shell.appendChild(main);
    shell.appendChild(rail);
    root.appendChild(shell);

    const units = roomUnitsIn(main, room);
    const items = relatedRailItems(room, units);
    const shown = items.slice(0, 30);
    rail.innerHTML =
      `<div class="rail-head"><span class="rail-title">Related</span>` +
      `<span class="rail-count">${shown.length}${items.length > shown.length ? ` of ${items.length}` : ''}</span></div>` +
      `<p class="rail-lead">Only what is related to ${escHtml(ROOM_LABEL[room] || 'this room')} at this point. Hover or select a card and it says why.</p>` +
      `<ul class="rail-list"></ul>`;
    const list = rail.querySelector('.rail-list');
    if (!shown.length) {
      const p = document.createElement('p');
      p.className = 'rm-quiet rail-empty';
      p.textContent = 'Nothing is linked yet in the project data for this room.';
      rail.appendChild(p);
    }
    shown.forEach(it => list.appendChild(railCard(room, it)));
    rail.appendChild(infoStackBlock('About this room', roomInfoRowsFor(room), false));
  }

  // What a room is related to, drawn only from bundled links (never invented).
  function relatedRailItems(room, units) {
    const items = [];
    if (room === 'reader') {
      relatedTeachersForCorpusKey(state.currentCorpusKey).forEach(m => items.push({
        name: masterDisplayName(m),
        zh: stringValue(m.name_zh),
        meta: `${stringValue(m.dates) || 'dates not recorded'} · ${stringValue(m.era) || 'era not recorded'}`,
        why: `Recorded in the transmission register of this project and linked to ${corpusTitle()}.`,
        unit: null
      }));
      return items;
    }
    if (room === 'matrix') {
      const matrix = Array.isArray(state.data.translations_matrix) ? state.data.translations_matrix : [];
      units.forEach((unit, i) => {
        const item = matrix[i];
        if (!item || !Array.isArray(item.translators)) return;
        item.translators.forEach(t => items.push({
          name: stringValue(t.translator) || 'Unnamed register',
          meta: `${stringValue(t.work) || 'work not recorded'} · line ${stringValue(item.source_ref)}`,
          why: `One of the English registers rendering line ${stringValue(item.source_ref)} in this room.`,
          unit: unit
        }));
      });
      return items;
    }
    if (room === 'lineage') {
      const masters = Array.isArray(state.data.lineage) ? state.data.lineage : [];
      units.forEach(unit => {
        const id = unit.getAttribute ? unit.getAttribute('data-master-card') : null;
        const m = masters.find(x => x && x.id === id);
        if (!m) return;
        (Array.isArray(m.linked_corpus_keys) ? m.linked_corpus_keys : []).forEach(k => {
          const doc = state.data.corpus && state.data.corpus[k];
          if (!doc) return;
          items.push({
            name: stringValue(doc.title_en) || k,
            meta: `linked to ${masterDisplayName(m)}`,
            why: `The project records this work with ${masterDisplayName(m)}; opening it moves the Reader to that work.`,
            docKey: k
          });
        });
      });
      return items;
    }
    if (room === 'gongan') {
      const list = Array.isArray(state.data.gongan_index) ? state.data.gongan_index : [];
      const masters = Array.isArray(state.data.lineage) ? state.data.lineage : [];
      units.forEach(unit => {
        const no = queryText(unit, '.catalogue-case');
        const g = list.find(x => x && stringValue(x.case_no) === no);
        if (!g) return;
        const m = masters.find(x => x && (x.id === g.protagonist || x.name_zh === g.protagonist));
        items.push({
          name: m ? masterDisplayName(m) : stringValue(g.protagonist) || 'Protagonist not recorded',
          zh: m ? stringValue(m.name_zh) : '',
          meta: `case ${stringValue(g.case_no)} · ${stringValue(g.collection)}`,
          why: m ? `Recorded as the protagonist of this case.` : `Named in this case; not yet profiled as a teacher in this project.`,
          unit: unit
        });
      });
      return items;
    }
    const glossary = Array.isArray(state.data.glossary) ? state.data.glossary : [];
    units.forEach(unit => {
      const term = queryText(unit, '.lexicon-headword-zh') || queryText(unit, '.lexicon-headword');
      const entry = glossary.find(x => x && (x.term === term || x.literal === term)) ||
        glossary.find(x => term && stringValue(x.literal) === term);
      if (!entry || !Array.isArray(entry.occurrences)) return;
      entry.occurrences.forEach(occ => items.push({
        name: stringValue(occ),
        meta: `recorded for ${stringValue(entry.term)}`,
        why: `A canonical location this project records the term in; the tag may fall outside the current Reader excerpt.`,
        unit: unit
      }));
    });
    return items;
  }

  function railCard(room, it) {
    const li = document.createElement('li');
    li.className = 'rail-item';
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'related-card';
    card.setAttribute('aria-expanded', 'false');
    card.innerHTML =
      `<span class="rr-name">${escHtml(it.name)}${it.zh ? ` <span class="rr-zh" lang="zh">${escHtml(it.zh)}</span>` : ''}</span>` +
      `<span class="rr-meta">${escHtml(it.meta || '')}</span>` +
      `<span class="rr-why">${escHtml(it.why || '')}</span>`;
    card.addEventListener('click', () => {
      const open = !card.classList.contains('is-open');
      card.classList.toggle('is-open', open);
      card.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    li.appendChild(card);
    if (it.unit || it.docKey) {
      const open = document.createElement('button');
      open.type = 'button';
      open.className = 'rr-open';
      open.textContent = it.docKey ? 'Open work' : 'Show in room';
      open.addEventListener('click', () => {
        if (it.docKey) openCorpusDoc(it.docKey);
        else scrollToUnit(it.unit);
      });
      li.appendChild(open);
    }
    return li;
  }

  // ==========================================================================
  // LAYOUT 15 · FOOTNOTES + GLOSSARY — a comfortable English column, numbered
  // notes at the foot of the page, and dotted terms that explain themselves in
  // plain language on hover, focus or tap.
  // ==========================================================================
  function roomFootnotes(room, root) {
    root.classList.add('rm-notes');
    if (root.querySelector(':scope > .rm-footnotes')) return;
    const units = roomUnitsIn(root, room);
    const entries = [];

    units.forEach((unit, i) => {
      const rows = unitInfoRowsFor(room, unit, i);
      if (!rows.length) return;
      const h = unitHeadline(room, unit, i);
      const n = entries.length + 1;
      const noteId = `rm-fn-${room}-${i}`;
      const marker = document.createElement('button');
      marker.type = 'button';
      marker.className = 'fn-mark';
      marker.textContent = String(n);
      marker.setAttribute('aria-label', `Note ${n}: background for ${clipText(h.en || 'this item', 48)}`);
      marker.addEventListener('click', () => openFootnote(root, noteId));
      const anchor = headlineAnchor(room, unit);
      if (anchor && anchor.parentNode && anchor !== unit) anchor.appendChild(marker);
      else unit.insertBefore(marker, unit.firstChild);
      entries.push({ id: noteId, n: n, unit: unit, h: h, rows: rows });
      buildGlossaryStrip(room, unit, i);
    });

    const details = document.createElement('details');
    details.className = 'footnotes';
    const summary = document.createElement('summary');
    summary.textContent = `Show footnotes (${entries.length})`;
    details.appendChild(summary);
    const body = document.createElement('div');
    body.className = 'footnotes-body';
    entries.forEach(e => body.appendChild(footnoteItem(room, e)));
    if (!entries.length) {
      const p = document.createElement('p');
      p.className = 'rm-quiet';
      p.textContent = 'No notes recorded for this room yet.';
      body.appendChild(p);
    }
    details.appendChild(body);
    root.appendChild(details);

    const opener = toggleButton(`Show footnotes (${entries.length})`, 'btn-pill rm-footnotes-toggle');
    opener.setAttribute('aria-controls', 'rm-footnotes-list-' + room);
    opener.addEventListener('click', () => {
      const open = !details.hasAttribute('open');
      if (open) details.setAttribute('open', '');
      else details.removeAttribute('open');
      setToggleState(opener, open, 'Hide footnotes', `Show footnotes (${entries.length})`);
      if (open && typeof details.scrollIntoView === 'function') {
        details.scrollIntoView({ behavior: motionBehavior(), block: 'nearest' });
      }
    });
    details.id = 'rm-footnotes-list-' + room;
    const footHead = document.createElement('div');
    footHead.className = 'rm-footnotes-head';
    footHead.innerHTML = `<h2 class="rm-pane-title">Notes</h2>` +
      `<p class="rm-pane-lead">Background for each ${escHtml(ROOM_NOUN[room] || 'unit')}, kept at the foot of the page so the reading stays quiet. The numbers in the text point here.</p>`;
    footHead.appendChild(opener);
    root.insertBefore(footHead, details);
  }

  function headlineAnchor(room, unit) {
    if (room === 'reader') return unit.querySelector('.case-heading-en, .case-num-title, .case-heading');
    if (room === 'matrix') return unit.querySelector('.matrix-ref-clean, .matrix-source-band');
    if (room === 'lineage') return unit.querySelector('.lineage-master-name-en');
    if (room === 'gongan') return unit.querySelector('.catalogue-title-en');
    if (room === 'lexicon') return unit.querySelector('.lexicon-headword');
    return unit;
  }

  function footnoteItem(room, e) {
    const item = document.createElement('article');
    item.className = 'footnote-item';
    item.id = e.id;
    item.innerHTML = `<div class="footnote-head"><span class="fn-num">${e.n}</span>` +
      `<span class="fn-title">${escHtml(e.h.kicker ? e.h.kicker + ' · ' : '')}${escHtml(clipText(e.h.en || 'Untitled', 70))}</span></div>` +
      `<div class="context-info-body">${infoRows(e.rows)}</div>`;
    const back = document.createElement('button');
    back.type = 'button';
    back.className = 'btn-pill fn-back';
    back.textContent = '↑ Back to the text';
    back.addEventListener('click', () => scrollToUnit(e.unit));
    item.appendChild(back);
    return item;
  }

  function openFootnote(root, noteId) {
    const details = root.querySelector(':scope > .rm-footnotes');
    const note = document.getElementById(noteId);
    if (details) details.setAttribute('open', '');
    const opener = root.querySelector('.rm-footnotes-toggle');
    if (opener) setToggleState(opener, true, 'Hide footnotes', opener.textContent);
    if (note && typeof note.scrollIntoView === 'function') {
      note.scrollIntoView({ behavior: motionBehavior(), block: 'center' });
      note.classList.add('rm-flash');
      setTimeout(() => note.classList.remove('rm-flash'), 1100);
    }
  }

  // Dotted terms that explain themselves from the project's own glossary. Only
  // terms actually mentioned in the unit are listed — nothing is inserted into
  // the text itself, so the rendered text stays exactly what the data says.
  function buildGlossaryStrip(room, unit, idx) {
    const list = Array.isArray(state.data.glossary) ? state.data.glossary : [];
    if (!list.length) return;
    const text = nodeText(unit).toLowerCase();
    const found = list.filter(t => {
      if (!t) return false;
      const term = stringValue(t.term);
      const literal = stringValue(t.literal);
      if (term.length >= 2 && text.includes(term.toLowerCase())) return true;
      return literal.length >= 5 && text.includes(literal.toLowerCase());
    }).slice(0, 4);
    if (!found.length) return;
    const strip = document.createElement('div');
    strip.className = 'glossary-strip';
    const label = document.createElement('span');
    label.className = 'glossary-strip-label';
    label.textContent = 'Terms in this ' + (ROOM_NOUN[room] || 'unit');
    strip.appendChild(label);
    found.forEach(t => {
      const wrap = document.createElement('span');
      wrap.className = 'glossary-term';
      wrap.tabIndex = 0;
      wrap.setAttribute('role', 'button');
      wrap.setAttribute('aria-expanded', 'false');
      const tipId = `gloss-${room}-${idx}-${stringValue(t.id) || 'term'}`;
      wrap.innerHTML = `<span class="glossary-word">${escHtml(stringValue(t.literal) || stringValue(t.term))}</span>` +
        `<span class="glossary-tooltip" id="${escHtml(tipId)}" role="tooltip" hidden>` +
        `<span class="glossary-tip-head">${escHtml(stringValue(t.term))} · ${escHtml(stringValue(t.pinyin))}</span>` +
        `<span class="glossary-tip-body">${escHtml(clipText(stringValue(t.definition), 240))}</span></span>`;
      const flip = () => {
        const tip = wrap.querySelector('.glossary-tooltip');
        const open = tip.hasAttribute('hidden');
        if (open) tip.removeAttribute('hidden');
        else tip.setAttribute('hidden', '');
        wrap.setAttribute('aria-expanded', open ? 'true' : 'false');
      };
      wrap.addEventListener('click', flip);
      wrap.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); }
      });
      strip.appendChild(wrap);
    });
    unit.appendChild(strip);
  }

  function setupEventListeners() {
    setupCitationPopoverListeners();
    setupRoboNameListeners();
    setupHoverCardListeners(); // Phase 5 bundle 028 layout 7 (no-ops outside it)
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

    function changeFontSize(delta) {
      const next = Math.min(2.2, Math.max(1.0, Math.round((state.fontSize + delta) * 100) / 100));
      if (next === state.fontSize) return;
      state.fontSize = next;
      document.documentElement.style.setProperty('--zh-font-size', `${next}rem`);
      storageSet('translatechan_font_size', String(next));
    }
    if (fontIncBtn) fontIncBtn.addEventListener('click', () => changeFontSize(0.15));
    if (fontDecBtn) fontDecBtn.addEventListener('click', () => changeFontSize(-0.15));
    if (fontIncBtnMobile) fontIncBtnMobile.addEventListener('click', () => changeFontSize(0.15));
    if (fontDecBtnMobile) fontDecBtnMobile.addEventListener('click', () => changeFontSize(-0.15));

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
      // Bundle 028 layout 6 (Modal info, all rooms): ⓘ doorways open the one
      // info modal, at the section the doorway asked for.
      const modalOpenBtn = hit('[data-info-modal]');
      if (modalOpenBtn) {
        e.preventDefault();
        openInfoModal(
          modalOpenBtn.getAttribute('data-info-modal'),
          modalOpenBtn,
          modalOpenBtn.getAttribute('data-info-sec')
        );
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
    closeOpenBottomSheets(null); // layout 9: never carry a sheet into the next room
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
          <div class="case-card">
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
    // Bundle 026: layouts 2–6 re-structure this content into their disclosure
    // pattern; a no-op in layout 1, which renders exactly as before.
    enhanceReaderLayout();
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
      <div class="case-card ${collapsed ? 'collapsed' : ''}" id="case-${caseItem.case_num}">
        <div class="case-header">
          <h2 class="case-num-title">${renderUnitTitle(caseItem.title_en, caseItem.title_zh, `Case ${caseItem.case_num}`)}</h2>
          <span class="case-header-actions">
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
      <div class="case-card">
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
      <div class="case-card">
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
      <div class="case-card">
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
      <div class="case-card" data-chapter-num="${escHtml(ch.chapter_num)}">
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
    return `
      <div class="translation-grid">
        ${entries.map(item => {
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

  function renderTranslationColumns(translations, zh = '', locatorOverride = null) {
    if (!translations) return '';
    if (state.readerMode === 'chinese_only') return '';

    const originalContext = { zh, locator: locatorOverride || locatorDocumentForKey(state.currentCorpusKey) };
    const keys = Object.keys(translations);
    if (keys.length === 0) return '';

    let displayKeys = keys;
    if (state.readerMode === 'bilingual') {
      // Prefer the two anchor registers (Red Pine + Cleary); fall back to first two available
      const preferred = ['red_pine', 'cleary'].filter(k => keys.includes(k));
      displayKeys = preferred.length > 0 ? preferred : keys.slice(0, 2);
    }

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
    // Bundle 028: layouts 3–7 re-structure this room too (no-op in layouts 1–2).
    enhanceRoomLayout('matrix');
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
    // Bundle 028: layouts 3–7 re-structure the register as well (no-op in 1–2).
    enhanceRoomLayout('lineage');
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
  window.TranslateChan.openMasterDossier = function(masterId) {
    if (!state.data.lineage) return;
    const master = state.data.lineage.find(m => m.id === masterId);
    if (!master) return;

    const nameZh = document.getElementById('dossier-name-zh');
    const nameEn = document.getElementById('dossier-name-en');
    const content = document.getElementById('dossier-content');

    if (nameZh) nameZh.textContent = `${master.name_zh} (${master.title})`;
    if (nameEn) nameEn.textContent = `${masterDisplayName(master)} • Pinyin: ${master.name_pinyin}${master.name_romaji ? ' • Rōmaji: ' + master.name_romaji : ''} • Generation: ${master.lineage_depth} • Era: ${master.dates}`;
    if (content) {
      const masterCitation = {
        title: 'Master profile source disclosure',
        rows: [
          ['Master', `${master.name_zh} / ${master.name_en}`],
          ['Canonical record', stringValue(master.cbeta_id) || 'Locator pending'],
          ['Primary texts', Array.isArray(master.texts) ? master.texts.join(', ') : 'Transmission record pending'],
          ['Profile status', 'Seed profile — exact biographical/source locator pending']
        ]
      };
      content.innerHTML = `
        <div class="dossier-meta-row">
          <span class="dossier-ledger-label">School / Lineage:</span> ${escHtml(master.school)} &nbsp;|&nbsp;
          <span class="dossier-ledger-label">Primary Monastery:</span> ${escHtml(master.location)} &nbsp;|&nbsp;
          <span class="dossier-ledger-label">Canonical record:</span> ${escHtml(master.cbeta_id)} ${renderCitationTrigger(masterCitation, 'ⓘ Profile source')}
        </div>
        <div class="master-quote">
          “${escHtml(master.key_quote_zh)}”
          <div class="master-quote-en">“${escHtml(master.key_quote_en)}”</div>
        </div>
        <div class="dossier-ledger-item"><span class="dossier-ledger-label">Teacher:</span> ${lineageTeacherDetail(master)}</div>
        <div class="dossier-ledger-item">
          <span class="dossier-ledger-label">Primary Classical Texts & Records:</span> ${master.texts ? master.texts.map(escHtml).join(', ') : 'Transmission records pending'}
        </div>
        <div class="dossier-ledger-item"><span class="dossier-ledger-label">Names & record state:</span> ${escHtml((master.alternative_names || []).join(' · ') || 'Alternative names not yet reviewed')} · ${escHtml(master.profile_status || 'Seed profile — exact biographical/source locator pending')}</div>
        <div class="dossier-ledger-item"><span class="dossier-ledger-label">Evidence status:</span> ${escHtml(master.profile_evidence?.status || 'not recorded')} — ${escHtml(master.profile_evidence?.note || 'No evidence note recorded.')}</div>
        <div class="dossier-ledger-item"><span class="dossier-ledger-label">Cross-referenced project works:</span> ${renderMasterWorkLinks(master)}</div>
        <div class="dossier-ledger-item">
          <span class="dossier-ledger-label">Historical & Philosophical Significance:</span> ${escHtml(master.summary)}
        </div>
      `;
      // Phase 5 — Info section for every TEACHER (common qualities: where they
      // came from, who they are related to, background context). Collapsed by
      // default so the dossier stays calm; plain-language, piece-meal.
      content.innerHTML += renderTeacherContext(master);
    }

    openDossierPanel();
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
    // Bundle 028: layouts 3–7 re-structure the catalogue too (no-op in 1–2).
    enhanceRoomLayout('gongan');
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
    // Bundle 028: layouts 3–7 re-structure the dictionary too (no-op in 1–2).
    enhanceRoomLayout('lexicon');
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
