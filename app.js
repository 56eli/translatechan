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
    renderMatrix();
    renderLineage();
    renderGonganIndex();
    renderLexicon();
    setActiveModeButtons();
    switchViewRaw(state.currentView, false); // sync nav/section classes with the initial hash
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
      termPopoverEl.className = 'term-popover';
      termPopoverEl.setAttribute('role', 'tooltip');
      termPopoverEl.style.display = 'none';
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
  function positionFloatingPopover(pop, anchor, popW) {
    const rect = anchor.getBoundingClientRect();
    const vw = window.innerWidth || document.documentElement.clientWidth || 900;
    const vh = window.innerHeight || 800;
    let left = Math.min(rect.left, vw - popW - 8);
    if (left < 8) left = 8;
    const height = pop.offsetHeight || 220;
    let top = rect.bottom + 8;
    if (top + height > vh - 8) top = Math.max(8, rect.top - 8 - height);
    pop.style.left = `${left}px`;
    pop.style.top = `${top}px`;
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
    pop.style.display = 'block'; // display first so the positioner can measure
    positionFloatingPopover(pop, termSpan, 290);
    pop._anchor = termSpan;
  }
  function hideTermPopover() {
    if (termPopoverEl) termPopoverEl.style.display = 'none';
  }
  function toggleTermPopover(termSpan) {
    if (termPopoverEl && termPopoverEl.style.display === 'block' &&
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
      roboPopoverEl.className = 'robo-popover';
      roboPopoverEl.setAttribute('role', 'tooltip');
      roboPopoverEl.style.display = 'none';
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
        (meta.personality ? `<div class="tooltip-row" style="margin-top:.35rem;font-style:italic;color:var(--text-secondary)">${escHtml(meta.personality)}</div>` : '');
    } else {
      pop.innerHTML = `<div class="tooltip-term-title">Robolation</div><div class="tooltip-row">AI text in a translator\u2019s register — not their actual words. Profile pending.</div>`;
    }
    pop.style.display = 'block';
    positionFloatingPopover(pop, span, 300);
    pop._anchor = span;
  }
  function hideRoboPopover() {
    if (roboPopoverEl) roboPopoverEl.style.display = 'none';
  }
  function toggleRoboPopover(span) {
    if (roboPopoverEl && roboPopoverEl.style.display === 'block' && roboPopoverEl._anchor === span) {
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
      citationPopoverEl.className = 'citation-popover';
      citationPopoverEl.setAttribute('role', 'tooltip');
      citationPopoverEl.style.display = 'none';
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
    pop.style.display = 'block'; // display first so the positioner can measure
    positionFloatingPopover(pop, trigger, 340);
    pop._anchor = trigger;
  }

  function hideCitationPopover() {
    if (citationPopoverEl) citationPopoverEl.style.display = 'none';
  }

  function toggleCitationPopover(trigger) {
    if (citationPopoverEl && citationPopoverEl.style.display === 'block' && citationPopoverEl._anchor === trigger) {
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

  // Event Listeners
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

    // Mode switcher between Visual Network and Cards
    const graphBtn = document.getElementById('lineage-mode-graph-btn');
    const cardsBtn = document.getElementById('lineage-mode-cards-btn');
    const graphContainer = document.getElementById('lineage-graph-container');
    const cardsContainer = document.getElementById('lineage-content-target');

    if (graphBtn && cardsBtn && graphContainer && cardsContainer) {
      graphBtn.addEventListener('click', () => {
        graphBtn.classList.add('active');
        cardsBtn.classList.remove('active');
        graphContainer.style.display = 'block';
        cardsContainer.style.display = 'none';
      });

      cardsBtn.addEventListener('click', () => {
        cardsBtn.classList.add('active');
        graphBtn.classList.remove('active');
        graphContainer.style.display = 'none';
        cardsContainer.style.display = 'grid';
      });
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
      if ((citationPopoverEl && citationPopoverEl.style.display === 'block') ||
          (termPopoverEl && termPopoverEl.style.display === 'block') ||
          (roboPopoverEl && roboPopoverEl.style.display === 'block')) return;
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
      if ((citationPopoverEl && citationPopoverEl.style.display === 'block') ||
          (termPopoverEl && termPopoverEl.style.display === 'block') ||
          (roboPopoverEl && roboPopoverEl.style.display === 'block')) return;
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
    const renderCorpusRow = (c) => {
      const pt = perText[c.key] || {};
      const cov = stringValue(pt.coverage);
      const parts = titleParts(c.title);
      const complete = pt.completion_status === 'complete_selected_witness';
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
        const items = filteredMap.filter(item => (perText[item.key]?.completion_status || 'excerpt_seed') === group.key);
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

  function renderDocumentSourceDisclosure(doc, corpusKey) {
    const locator = locatorDocumentForKey(corpusKey) || {
      canonical_locator: doc && doc.cbeta_id,
      granularity: 'document',
      status: 'locator_pending',
      source_note: 'Source registry entry pending.'
    };
    return renderSourceLocationDisclosure(locator, 'Source location', 'document-source-location');
  }

  // Coverage disclosure: never let an excerpt be mistaken for a complete text.
  // Source of truth is the validator-generated per-text metrics (which embed the
  // document's own coverage_note when present); unit counts come from live data.
  function renderCoverageDisclosure(corpusKey) {
    const doc = state.data.corpus && state.data.corpus[corpusKey];
    const metrics = state.data.project_metrics;
    const perText = metrics && metrics.corpus && metrics.corpus.per_text
      ? metrics.corpus.per_text[corpusKey] : null;
    const coverageNote = (isRecord(doc) && stringValue(doc.coverage_note))
      || (perText && stringValue(perText.coverage_note));
    const unitCounts = perText && isRecord(perText.unit_counts) ? perText.unit_counts : {};
    const UNIT_LABELS = {
      cases: 'cases', sections: 'sections', dialogues: 'dialogues', stanzas: 'stanzas',
      chapters: 'chapters', five_ranks: 'five ranks', sample_records: 'sample records'
    };
    const unitSummary = Object.entries(unitCounts).map(([k, v]) => `${v} ${UNIT_LABELS[k] || k}`).join(' · ');
    const completionStatus = perText && stringValue(perText.completion_status) || 'excerpt_seed';
    const represented = perText && stringValue(perText.coverage);
    const coverage = represented
      ? (completionStatus === 'complete_selected_witness'
          ? `${represented} · Complete selected witness`
          : `${represented} represented · Incomplete source coverage`)
      : (unitSummary ? `Excerpt seed (${unitSummary})` : 'Excerpt seed');
    const statusLabels = {
      complete_selected_witness: 'Complete selected witness',
      partial_selected_witness: 'Partial selected witness',
      excerpt_seed: 'Excerpt seed'
    };
    const detail = {
      title: 'Coverage disclosure',
      rows: [
        ['Coverage', coverage],
        ['Editorial status', statusLabels[completionStatus] || completionStatus],
        ['Note', coverageNote || 'Excerpt-scale seed: the full canonical text is not yet ingested (Phase 2).'],
        ['Measured by', 'data/project_metrics.json → corpus.per_text (validator-generated)']
      ]
    };
    return `<div class="source-location coverage-disclosure"><span>Coverage: ${escHtml(coverage)}</span>${renderCitationTrigger(detail, 'Details')}</div>`;
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
    const statusLabels = {
      complete_selected_witness: 'Complete witness',
      partial_selected_witness: 'Partial witness',
      excerpt_seed: 'Excerpt seed'
    };
    const editorialStatus = statusLabels[docMetric.completion_status] || 'Editorial status pending';
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
        <div class="document-ledger">
          ${renderDocumentSourceDisclosure(doc, state.currentCorpusKey)}
          ${renderCoverageDisclosure(state.currentCorpusKey)}
          <details class="document-details">
            <summary>Edition details</summary>
            <dl>
              <div><dt>Canon</dt><dd>${escHtml(doc.cbeta_id || 'Not recorded')}${(/T\d{4}/.test(doc.cbeta_id || '') && doc.taisho_vol) ? ` · Vol. ${escHtml(doc.taisho_vol)}` : ''}</dd></div>
              <div><dt>Author</dt><dd>${escHtml(doc.author_zh || '')}</dd></div>
              <div><dt>Era</dt><dd>${escHtml(doc.era || '')}</dd></div>
              <div><dt>Genre</dt><dd>${escHtml(doc.genre || '')}</dd></div>
            </dl>
          </details>
        </div>
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
          </div>
        </details>
      `;
    }

    // Build the epilogue now but append it only after the document's units.
    // It previously appeared between the preface and Case 1.
    const epilogueHtml = doc.epilogue ? `
      <div class="case-card is-epilogue" style="margin-bottom: 1.5rem;">
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
        <div class="case-card" style="border-left: 4px solid var(--accent-green); margin-bottom: 1.5rem;">
          <h2 class="case-num-title" style="margin-bottom: 0.5rem; color: var(--accent-green);">☯️ 曹洞宗五位君臣綱宗 / The Dialectic of the Five Ranks</h2>
          <div style="font-size: 0.92rem; color: var(--text-secondary); margin-bottom: 1rem;">${escHtml(doc.overview || '')}</div>
        </div>
      `;

      doc.five_ranks.forEach(r => {
        html += `
          <div class="case-card">
            <div class="case-header">
              <h2 class="case-num-title">第 ${escHtml(r.rank_num)} 位：${escHtml(r.name_zh)} (${escHtml(r.name_en)})</h2>
              <span class="case-speaker">${escHtml(r.symbol)}</span>
            </div>
            <div class="classical-zh" lang="zh" style="font-size: 1.2rem;">${annotateClassicalChinese(r.verse_zh)}</div>
            <div class="pinyin-line">${escHtml(r.verse_pinyin)}</div>
            ${renderTranslationColumns(r.translations, r.verse_zh)}
            <div class="commentary-block" style="margin-top: 1rem; border-left-color: var(--accent-green);">
              <div class="commentary-label" style="color: var(--accent-green);">曹山註解 / Caoshan Commentary</div>
              <div class="classical-zh" lang="zh" style="font-size: 1.05rem;">${annotateClassicalChinese(r.commentary_zh)}</div>
              ${r.commentary_en && state.readerMode !== 'chinese_only' ? `<div style="font-size: 0.9rem; color: var(--text-primary); margin-top: 0.35rem;">${escHtml(r.commentary_en)}</div>${renderProjectDraftDisclosure('Commentary: project AI draft', { zh: r.commentary_zh, locator: locatorDocumentForKey(state.currentCorpusKey) })}` : ''}
            </div>
          </div>
        `;
      });
    }

    // Render canonical scope / overview card (e.g. Chuandenglu architecture, Platform Sutra coverage)
    // (skipped when a five_ranks block is present — it already surfaces doc.overview)
    if (doc.overview && !doc.five_ranks) {
      html += `
        <div class="case-card" style="border-left: 4px solid var(--accent-gold); margin-bottom: 1.5rem;">
          <h2 class="case-num-title" style="margin-bottom: 0.5rem;">📚 Canonical Architecture & Scope</h2>
          <div style="font-size: 0.95rem; color: var(--text-primary); margin-bottom: 1rem;">${escHtml(doc.overview)}</div>
          ${doc.fascicle_structure ? `
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0.5rem;">
              ${doc.fascicle_structure.map(f => `
                <div style="background: var(--bg-card); padding: 0.5rem 0.75rem; border-radius: 4px; border: 1px solid var(--border-color); font-size: 0.78rem;">
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
          <div style="margin-bottom: 1.25rem;">
            <div class="case-speaker">${escHtml(d.speaker)}</div>
            <div class="classical-zh" lang="zh">${annotateClassicalChinese(d.zh)}</div>
            <div class="pinyin-line">${escHtml(d.pinyin)}</div>
            ${renderTranslationColumns(d.translations, d.zh)}
          </div>
        `).join('');

        html += `
          <div class="case-card">
            <div class="case-header">
              <h2 class="case-num-title">卷 ${escHtml(rec.fascicle)} 傳燈本則：${escHtml(rec.title_zh)}</h2>
              <span class="case-speaker">${escHtml(rec.title_en)}</span>
            </div>
            ${diaHtml}
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
        <div style="margin-bottom: 1.25rem;">
          <div class="case-speaker">${escHtml(d.speaker)}</div>
          <div class="classical-zh" lang="zh">${annotateClassicalChinese(d.zh)}</div>
          <div class="pinyin-line">${escHtml(d.pinyin)}</div>
          ${renderTranslationColumns(d.translations, d.zh)}
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
          <div class="commentary-block" style="background: var(--bg-card); border-left-color: var(--accent-blue); margin-bottom: 1rem;">
            <div class="commentary-label" style="color: var(--accent-blue);">垂示 / Pointer</div>
            <div class="classical-zh" lang="zh" style="font-size: 1.05rem;">${annotateClassicalChinese(caseItem.pointer_zh)}</div>
            ${caseItem.pointer_en && state.readerMode !== 'chinese_only' ? `<div style="font-size: 0.88rem; color: var(--text-secondary);">${escHtml(caseItem.pointer_en)}</div>${renderProjectDraftDisclosure('Pointer: project AI draft', { zh: caseItem.pointer_zh, locator: locatorDocumentForKey(state.currentCorpusKey) })}` : ''}
          </div>
        ` : ''}
        ${dialoguesHtml}
        ${caseItem.commentary_zh ? `
          <div class="commentary-block">
            <div class="commentary-label">${textLabels.commentary}</div>
            <div class="classical-zh" lang="zh" style="font-size: 1.15rem;">${annotateClassicalChinese(caseItem.commentary_zh)}</div>
            <div class="pinyin-line" style="border:none; padding:0;">${escHtml(caseItem.commentary_pinyin || '')}</div>
            ${caseItem.commentary_en && state.readerMode !== 'chinese_only' ? `<div style="margin-top: 0.5rem; font-size: 0.92rem; color: var(--text-primary);">${escHtml(caseItem.commentary_en)}</div>${renderProjectDraftDisclosure('Commentary: project AI draft', { zh: caseItem.commentary_zh, locator: locatorDocumentForKey(state.currentCorpusKey) })}` : ''}
          </div>
        ` : ''}
        ${caseItem.verse_zh ? `
          <div class="verse-block">
            <div class="commentary-label" style="color: var(--accent-green);">${textLabels.verse}</div>
            <div class="classical-zh" lang="zh" style="font-size: 1.2rem;">${annotateClassicalChinese(caseItem.verse_zh)}</div>
            <div class="pinyin-line" style="border:none; padding:0;">${escHtml(caseItem.verse_pinyin || '')}</div>
            ${caseItem.verse_en && state.readerMode !== 'chinese_only' ? `<div style="margin-top: 0.4rem; font-size: 0.92rem; color: var(--text-primary);">${escHtml(caseItem.verse_en)}</div>${renderProjectDraftDisclosure('Verse: project AI draft', { zh: caseItem.verse_zh, locator: locatorDocumentForKey(state.currentCorpusKey) })}` : ''}
          </div>
        ` : ''}
        </div>
        ${navFooter}
      </div>
    `;
  }

  function renderSectionItem(sec) {
    const sectionLocator = unitLocatorForKey(state.currentCorpusKey, `sections.${sec.section_id}`);
    let dialoguesHtml = (sec.dialogue || []).map(d => `
      <div style="margin-bottom: 1.25rem;">
        <div class="case-speaker">${escHtml(d.speaker)}</div>
        <div class="classical-zh" lang="zh">${annotateClassicalChinese(d.zh)}</div>
        <div class="pinyin-line">${escHtml(d.pinyin)}</div>
        ${renderTranslationColumns(d.translations, d.zh, sectionLocator)}
      </div>
    `).join('');

    // Sections may embed verse stanzas instead of dialogue (e.g. Shitou Sandokai / Grass Hut Song)
    let stanzasHtml = (sec.stanzas || []).map(st => `
      <div style="margin-bottom: 1.25rem;">
        <div class="case-speaker">第 ${escHtml(st.stanza_num)} 節 / Stanza ${escHtml(st.stanza_num)}</div>
        <div class="classical-zh" lang="zh">${annotateClassicalChinese(st.zh)}</div>
        <div class="pinyin-line">${escHtml(st.pinyin)}</div>
        ${renderTranslationColumns(st.translations, st.zh, sectionLocator)}
      </div>
    `).join('');

    return `
      <div class="case-card">
        <div class="case-header">
          <h2 class="case-num-title">${renderUnitTitle(sec.title_en, sec.title_zh, 'Section')}</h2>
          <span class="case-header-actions">${renderSourceLocationDisclosure(sectionLocator, 'Section source', 'case-source-location')}</span>
        </div>
        ${dialoguesHtml}${stanzasHtml}
      </div>
    `;
  }

  function renderDialogueItem(dia) {
    let dialoguesHtml = (dia.dialogue || []).map(d => `
      <div style="margin-bottom: 1.25rem;">
        <div class="case-speaker">${escHtml(d.speaker)}</div>
        <div class="classical-zh" lang="zh">${annotateClassicalChinese(d.zh)}</div>
        <div class="pinyin-line">${escHtml(d.pinyin)}</div>
        ${renderTranslationColumns(d.translations, d.zh)}
      </div>
    `).join('');

    return `
      <div class="case-card">
        <div class="case-header">
          <h2 class="case-num-title">${renderUnitTitle(dia.title_en, dia.title_zh, 'Dialogue')}</h2>
        </div>
        ${dialoguesHtml}
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
      </div>
    `;
  }

  function renderChapterItem(ch) {
    const chapterLocator = unitLocatorForKey(state.currentCorpusKey, `chapters.${ch.chapter_num}`);
    const contentBlocks = [];
    if (Array.isArray(ch.verses)) {
      contentBlocks.push(ch.verses.map(v => `
        <div style="margin-bottom: 1.25rem;">
          <div class="case-speaker">${escHtml(v.author)}</div>
          <div class="classical-zh" lang="zh">${annotateClassicalChinese(v.zh)}</div>
          <div class="pinyin-line">${escHtml(v.pinyin)}</div>
          ${renderTranslationColumns(v.translations, v.zh, chapterLocator)}
          ${v.recension_note ? `<div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.25rem;">ℹ️ ${escHtml(v.recension_note)}</div>` : ''}
        </div>
      `).join(''));
    }
    if (Array.isArray(ch.dialogue)) {
      contentBlocks.push(ch.dialogue.map(d => `
        <div style="margin-bottom: 1.25rem;">
          <div class="case-speaker">${escHtml(d.speaker)}</div>
          <div class="classical-zh" lang="zh">${annotateClassicalChinese(d.zh)}</div>
          <div class="pinyin-line">${escHtml(d.pinyin)}</div>
          ${renderTranslationColumns(d.translations, d.zh, chapterLocator)}
        </div>
      `).join(''));
    }
    // Several Platform Sutra chapter excerpts use direct chapter-level fields
    // rather than nested `dialogue`/`verses`; these were previously empty cards.
    if (stringValue(ch.zh)) {
      contentBlocks.push(`
        <div style="margin-bottom: 1.25rem;">
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
      return `<div class="translation-source">📖 <strong>${escHtml(translator)}</strong> · ${escHtml(work)}<br>Edition: ${escHtml(edition)}<br>Page / section: ${escHtml(page)} ${renderCitationTrigger(detail, 'ⓘ Citation')}</div>`;
    }

    const isAi = entry.status === 'ai_draft';
    const short = isAi ? 'Robo draft' : 'Robolation';
    const detail = {
      title: 'Robo rendering disclosure',
      rows: [
        ['What this is', isAi ? 'AI draft \u2014 not a real translation.' : 'AI text in this translator\u2019s register \u2014 not their actual words.'],
        ['Citation rule', 'Do not cite as the named translator\u2019s work.'],
        ...originalRows
      ]
    };
    return `<div class="translation-source source-disclosure">\u{1F916} <strong>${escHtml(translator)}</strong> \u2014 ${escHtml(short)}</div>`;
  }

  function renderProjectDraftDisclosure(label = 'Project AI draft', originalContext = {}) {
    if (state.readerMode === 'chinese_only') return '';
    return renderTranslationSource({ key: 'ai_project', status: 'ai_draft', source: null }, label, originalContext);
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

  // Render Comparison Matrix. Unlike the early matrix seed, every visible
  // translator entry now receives an explicit provenance status and (where
  // verified) the same citation treatment used by the Reader.
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
        <div class="matrix-registers-grid">
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
            <div class="matrix-register-col">
              <div>
                <div class="matrix-reg-header">
                  <div class="matrix-author">${roboNameSpanByName(t.translator, entry.status)}</div>
                  <div class="matrix-work">${escHtml(t.work)}${t.style ? ` (${escHtml(t.style)})` : ''}</div>
                </div>
                <div class="matrix-reg-text">“${escHtml(entry.text)}”</div>
              </div>
              <div>
                ${renderTranslationStatus(entry)}
                ${renderTranslationSource(entry, displayTranslator, { zh: item.sentence_zh, locator })}
                ${t.notes ? `<div class="matrix-reg-note">${escHtml(t.notes)}</div>` : ''}
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

  function renderLineage() {
    if (!elements.lineageTarget || !state.data.lineage) return;
    renderLineageVerificationSummary();
    let masters = state.data.lineage;

    if (state.selectedMasterSchool !== 'all') {
      masters = masters.filter(m => m.school_key === state.selectedMasterSchool);
    }

    masters = sortLineageMasters(masters);
    renderVisualLineageGraph(masters);

    elements.lineageTarget.innerHTML = masters.map(m => `
      <div class="master-directory-row" data-master-card="${escHtml(m.id)}" role="button" tabindex="0" aria-label="Open dossier for ${escHtml(m.name_en)}">
        <div class="master-dir-gen">Gen ${escHtml(m.lineage_depth)}</div>
        <div class="master-dir-main">
          <h2 class="master-dir-name">${escHtml(masterDisplayName(m))}<span class="master-dir-name-zh" lang="zh">${escHtml(m.name_zh)} · ${escHtml(m.name_pinyin)}</span></h2>
          <div class="master-dir-title">${escHtml(m.title)}</div>
          <div class="master-dir-meta">
            <span>Dates: ${escHtml(m.dates)} (${escHtml(m.era)})</span>
            <span>Lineage: ${escHtml(m.school)}</span>
            <span>Temple: ${escHtml(m.location)}</span>
            <span>Ref: ${escHtml(m.cbeta_id)}</span>
            <span>Teacher: ${lineageTeacherDetail(m)}</span>
          </div>
          <div class="text-sm-muted">${escHtml(m.summary)}</div>
        </div>
        <div class="master-dir-quote">
          <div class="master-dir-quote-zh">“${escHtml(m.key_quote_zh)}”</div>
          <div class="master-dir-quote-en">“${escHtml(m.key_quote_en)}”</div>
        </div>
      </div>
    `).join('');
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
      generationLabelsHtml += `<text x="${rowLabelX}" y="${y + 4}" text-anchor="start" font-size="10" font-weight="700" fill="var(--text-muted)" font-family="var(--font-sans)">G${gen}</text>`;
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
          <circle r="24" fill="var(--bg-card)" stroke="${color}" stroke-width="2.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.12))"></circle>
          <text text-anchor="middle" dy=".34em" font-size="10" font-weight="800" fill="var(--text-primary)" font-family="var(--font-mono)">${escHtml(monogram)}</text>
          <text text-anchor="middle" y="40" font-size="10" font-weight="650" fill="var(--text-secondary)" font-family="var(--font-sans)">${escHtml(shortName)}</text>
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
    // The HTML ships with `hidden`; remove the semantic state as well as setting
    // display. An inline display value alone cannot override [hidden] CSS.
    panel.hidden = false;
    panel.removeAttribute('hidden');
    panel.style.display = 'block';
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
    panel.style.display = 'none';
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
        <div style="margin-top: 0.5rem; margin-bottom: 0.75rem;">
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
        <div style="margin-top:0.5rem; margin-bottom:0.75rem;">
          <strong>Verification status:</strong> ${escHtml(meta.label)}
        </div>
        <div class="commentary-block" style="background:var(--bg-card); border-left-color:var(--accent-blue); margin:0;">
          <div class="commentary-label" style="color:var(--accent-blue);">Lineage chart disclosure</div>
          <div style="font-size:0.9rem; color:var(--text-primary);">${escHtml(stringValue(edge.note) || 'No verification note recorded.')}</div>
          <div style="margin-top:0.55rem;">${renderCitationTrigger(detail, 'ⓘ Source chart & verification')}</div>
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

  // Render Gong'an Index
  function renderGonganIndex() {
    if (!elements.gonganTarget || !state.data.gongan_index) return;
    let list = state.data.gongan_index;
    if (state.gonganThemeFilter && state.gonganThemeFilter !== 'all') {
      list = list.filter(g => g.theme_group === state.gonganThemeFilter);
    }

    const groups = gonganThemeGroups();
    const filterBar = `
      <div class="room-filter-rail">
        <span class="dossier-ledger-label">Theme groups:</span>
        <button class="btn-pill gongan-filter-chip ${!state.gonganThemeFilter || state.gonganThemeFilter === 'all' ? 'active' : ''}" data-gongan-filter="all" aria-pressed="${!state.gonganThemeFilter || state.gonganThemeFilter === 'all' ? 'true' : 'false'}">All · ${state.data.gongan_index.length}</button>
        ${groups.map(g => `<button class="btn-pill gongan-filter-chip ${state.gonganThemeFilter === g.key ? 'active' : ''}" data-gongan-filter="${escHtml(g.key)}" aria-pressed="${state.gonganThemeFilter === g.key ? 'true' : 'false'}">${escHtml(g.display)} · ${g.count}</button>`).join('')}
      </div>`;

    elements.gonganTarget.innerHTML = filterBar + list.map(g => `
      <div class="gongan-catalogue-row">
        <div class="catalogue-meta">${escHtml(g.collection)} · Canon ID: ${escHtml(g.cbeta_id)} · ${escHtml(gonganGroupDisplay(stringValue(g.theme_group)))}</div>
        <div class="catalogue-title-row">
          <h2 class="catalogue-title-en">${escHtml(g.title_en)}</h2>
          <span class="catalogue-title-zh" lang="zh">${escHtml(g.title_zh)}</span>
        </div>
        <div class="catalogue-summary">${escHtml(g.summary)}</div>
        <div class="catalogue-tags">
          <span class="catalogue-tag-item">Group: ${escHtml(gonganGroupDisplay(stringValue(g.theme_group)))}</span>
          <span class="catalogue-tag-item">Theme: ${escHtml(g.theme)}</span>
          ${g.cross_refs ? g.cross_refs.map(cr => `<span class="catalogue-tag-item">${escHtml(cr)}</span>`).join('') : ''}
        </div>
      </div>
    `).join('');
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

  // Render Lexicon
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

    elements.lexiconTarget.innerHTML = summary + noMatchHint + list.map(item => `
      <div class="lexicon-definition-row">
        <div class="lexicon-headword-col">
          <p class="section-kicker">${escHtml(item.category)}</p>
          <h2 class="lexicon-headword-literal">${escHtml(item.literal)}</h2>
          <div class="lexicon-headword-zh" lang="zh">${escHtml(item.term)}</div>
          <div class="lexicon-headword-meta">${escHtml(item.pinyin)} · Sanskrit: ${escHtml(item.sanskrit || '—')}</div>
        </div>
        <div class="lexicon-def-col">
          <div class="lexicon-def-text">${escHtml(item.definition)}</div>
          <div class="lexicon-occurrences">
            ${item.occurrences.map(occ => `<span class="lexicon-occ-tag" title="Canonical occurrence reference; may fall outside the current Reader excerpt.">${escHtml(occ)}</span>`).join('')}
          </div>
        </div>
      </div>
    `).join('');
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
      return `<div class="search-match-note">⚖️ Matched in translations — <strong>${escHtml(enHit.name)}</strong>: “${makeFieldSnippet(enHit.text, q)}”</div>`;
    }
    if (u.pinyin && normalizeForSearch(u.pinyin).includes(qLower)) {
      return `<div class="search-match-note">🔤 Matched in pinyin: ${makeFieldSnippet(u.pinyin, q)}</div>`;
    }
    return `<div class="search-match-note">🏷️ Matched in the unit title or speaker label</div>`;
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

      bodyHtml += `<div style="margin: 1.25rem 0 0.4rem; font-weight: 700; color: var(--accent-gold);">${escHtml(doc.title_zh)} · ${escHtml(doc.title_en)} — ${hits.length} matching unit(s)</div>`;
      shown.forEach(u => {
        const action = u.jump && u.jump.kind === 'case'
          ? `<button class="btn-pill active" data-open-case="${escHtml(corpKey)}" data-case-num="${u.jump.num}">View Case in Reader</button>`
          : `<button class="btn-pill active" data-open-doc="${escHtml(corpKey)}">View in Reader</button>`;
        bodyHtml += `
          <div class="case-card" style="margin-bottom: 0.75rem;">
            <div class="case-header"><h2 class="case-num-title" style="font-size:0.95rem;">${escHtml(u.label)}</h2></div>
            ${u.zh ? `<div class="classical-zh" lang="zh" style="font-size:1.15rem;">${makeSnippet(u.zh, q)}</div>` : ''}
            ${renderSearchMatchNote(u, q, qLower)}
            <div style="margin-top: 0.4rem;">${action}</div>
          </div>`;
      });
      displayedHits += shown.length;
      const hiddenInDocument = hits.length - shown.length;
      if (hiddenInDocument > 0) {
        bodyHtml += `<div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.75rem;">… ${hiddenInDocument} additional match(es) in this text (open the text to browse).</div>`;
      }
    });

    const hiddenTotal = totalHits - displayedHits;
    const resultNotice = hiddenTotal > 0
      ? `<div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.4rem;">Showing ${displayedHits} of ${totalHits} matching units; narrow your query for more focused results.</div>`
      : '';
    const headerHtml = `<div class="text-header"><h1 class="text-title-zh">🔍 Search Results for: "${escHtml(q)}"</h1><p class="text-title-en">${totalHits} matching unit(s) across ${matchedDocuments.length} text(s)</p>${resultNotice}</div>`;

    const corpusCount = Object.keys(state.data.corpus).length;
    elements.readerContent.innerHTML = totalHits === 0
      ? headerHtml + `<div class="case-card"><p>No matches found for "${escHtml(q)}". Try Classical Chinese (e.g. 狗子, 無, 佛性, 平常心, 絕學) or English (e.g. Buddha, mind, fox, mirror) across all ${corpusCount} texts.</p></div>`
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
