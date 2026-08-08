/**
 * TranslateChan - Interactive Classical Chan Translation & Preservation Platform
 * Zero-backend client-side application for GitHub Pages.
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
      return (v >= 1.0 && v <= 2.2) ? v : 1.35;
    })(),
    collapsedCases: (() => {
      try { return JSON.parse(storageGet('translatechan_collapsed_cases') || '{}') || {}; }
      catch (e) { return {}; }
    })(),
    theme: storageGet('translatechan_theme') || 'light',
    searchQuery: '',
    selectedMasterSchool: 'all',
    lineageSort: 'generation',
    selectedLexiconCategory: 'all',
    gonganThemeFilter: null,
    caseLimit: {}, // per-corpus lazy-render limit (Phase D2)
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

  // Corpus selection has a single persistence path so sidebar, mobile picker,
  // deep links, and search jumps all restore the same reading context.
  function setCurrentCorpusKey(key) {
    if (!key || !state.data.corpus || !state.data.corpus[key]) return false;
    state.currentCorpusKey = key;
    storageSet('translatechan_corpus_key', key);
    return true;
  }

  // Initialize
  function init() {
    // Initial URL state (#/view/corpus) — deep links & refresh restore position
    const m = (location.hash || '').match(/^#\/([a-z]+)(?:\/([a-z0-9_]+))?/);
    if (m && VALID_VIEWS.includes(m[1])) state.currentView = m[1];
    if (m && m[2]) setCurrentCorpusKey(m[2]);

    applyTheme(state.theme);
    document.documentElement.style.setProperty('--zh-font-size', `${state.fontSize}rem`);
    setupEventListeners();
    applyPinyinVisibility();
    renderCorpusList();
    renderReader();
    renderMatrix();
    renderLineage();
    renderGonganIndex();
    renderLexicon();
    setActiveModeButtons();
    switchViewRaw(state.currentView); // sync nav/section classes with the initial hash
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
      termPopoverEl.style.display = 'none';
      document.body.appendChild(termPopoverEl);
    }
    return termPopoverEl;
  }
  function termById(id) {
    const list = state.data.glossary || [];
    return list.find(t => t && t.id === id) || null;
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
    const rect = termSpan.getBoundingClientRect();
    const vw = window.innerWidth || document.documentElement.clientWidth || 900;
    const popW = 290;
    let left = Math.min(rect.left, vw - popW - 8);
    if (left < 8) left = 8;
    pop.style.left = `${left}px`;
    pop.style.top = `${rect.bottom + 8}px`;
    if (pop.style.top && rect.bottom + 8 + 160 > (window.innerHeight || 800)) {
      pop.style.top = `${Math.max(8, rect.top - 8 - 150)}px`; // flip above
    }
    pop.style.display = 'block';
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
      citationPopoverEl.style.display = 'none';
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

  function positionCitationPopover(pop, anchor) {
    const rect = anchor.getBoundingClientRect();
    const vw = window.innerWidth || document.documentElement.clientWidth || 900;
    const popW = 340;
    let left = Math.min(rect.left, vw - popW - 8);
    if (left < 8) left = 8;
    let top = rect.bottom + 8;
    if (top + 190 > (window.innerHeight || 800)) top = Math.max(8, rect.top - 198);
    pop.style.left = `${left}px`;
    pop.style.top = `${top}px`;
  }

  function showCitationPopover(trigger) {
    if (!trigger || typeof trigger.getBoundingClientRect !== 'function') return;
    const detail = citationDetails.get(trigger.getAttribute('data-citation-id'));
    if (!detail) return;
    const pop = getCitationPopover();
    const rows = Array.isArray(detail.rows) ? detail.rows : [];
    pop.innerHTML = `<div class="citation-title">${escHtml(detail.title || 'Citation & disclosure')}</div>` +
      rows.map(row => citationRow(row[0], row[1])).join('');
    positionCitationPopover(pop, trigger);
    pop.style.display = 'block';
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
      if (trigger && !trigger.contains(e.relatedTarget)) hideCitationPopover();
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
      }
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
    let m = state.collapsedCases[key];
    if (!m || typeof m !== 'object') m = {};
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
      elements.themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  // Event Listeners
  function setupEventListeners() {
    setupCitationPopoverListeners();
    if (elements.themeToggle) {
      elements.themeToggle.addEventListener('click', () => {
        applyTheme(state.theme === 'dark' ? 'light' : 'dark');
      });
    }

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
    if (readerPrintBtn) readerPrintBtn.addEventListener('click', () => { try { window.print(); } catch (e) { /* ignore */ } });

    // Mobile bottom-bar: case index, scroll to top, pinyin toggle
    const mobileCasesBtn = document.getElementById('mobile-cases-btn');
    if (mobileCasesBtn) {
      mobileCasesBtn.addEventListener('click', () => {
        const strip = document.getElementById('case-jump-strip');
        if (strip) strip.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
    const mobileTopBtn = document.getElementById('mobile-top-btn');
    if (mobileTopBtn) mobileTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
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
    switchViewRaw(viewName);
    const target = viewHash(viewName, state.currentCorpusKey);
    if (location.hash !== target) {
      try { location.hash = target; } catch (e) { /* file:// edge cases */ }
    }
  }
  function switchViewRaw(viewName) {
    if (!VALID_VIEWS.includes(viewName)) return;
    state.currentView = viewName;
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Apply the URL hash to app state (view + reader corpus); no re-render loop.
  function applyHash() {
    const m = (location.hash || '').match(/^#\/([a-z]+)(?:\/([a-z0-9_]+))?/);
    const view = m && VALID_VIEWS.includes(m[1]) ? m[1] : 'reader';
    if (view !== state.currentView) switchViewRaw(view);
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

    elements.corpusList.innerHTML = corpusMap.map(c => `
      <button class="corpus-btn ${c.key === state.currentCorpusKey ? 'active' : ''}" data-corpus-key="${escHtml(c.key)}">
        <span>${escHtml(c.title)}</span>
        <span class="corpus-badge">${escHtml(c.cbeta)}</span>
      </button>
    `).join('');

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
    return `<div class="source-location ${className}"><span>📍 ${escHtml(label)}: ${escHtml(location)}</span>${renderCitationTrigger(detail, 'ⓘ Source')}</div>`;
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
    const coverage = perText && stringValue(perText.coverage)
      ? perText.coverage
      : (unitSummary ? `Excerpt seed (${unitSummary})` : 'Excerpt seed');
    const detail = {
      title: 'Coverage disclosure',
      rows: [
        ['Coverage', coverage],
        ['Note', coverageNote || 'Excerpt-scale seed: the full canonical text is not yet ingested (Phase 2).'],
        ['Measured by', 'data/project_metrics.json → corpus.per_text (validator-generated, 2026-08-08)']
      ]
    };
    return `<div class="source-location coverage-disclosure"><span>📊 Coverage: ${escHtml(coverage)}</span>${renderCitationTrigger(detail, 'ⓘ Coverage')}</div>`;
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

    // Case index strip for long case-based texts (e.g. Wumenguan 48/48)
    const caseStrip = (Array.isArray(doc.cases) && doc.cases.length >= 10)
      ? `<div class="case-jump-strip" id="case-jump-strip" aria-label="Case index">
           <span class="case-strip-label">📑 則 / Case</span>
           ${doc.cases.map(c => `<button class="case-chip" data-jump-case="${c.case_num}" title="第${c.case_num}則 ${c.title_zh || ''}">${c.case_num}</button>`).join('')}
         </div>`
      : '';

    let html = `
      <div class="text-header">
        <div class="text-title-zh">${doc.title_zh}</div>
        <div class="text-title-en">${doc.title_en} (${doc.title_pinyin})</div>
        <div class="text-meta-chips">
          <span class="meta-chip">📜 Canon: ${doc.cbeta_id || 'Taisho'}${(/T\d{4}/.test(doc.cbeta_id || '') && doc.taisho_vol) ? ` (Vol. ${doc.taisho_vol})` : ''}</span>
          <span class="meta-chip">✍️ Master/Author: ${doc.author_zh || ''}</span>
          <span class="meta-chip">⏳ Era: ${doc.era || ''}</span>
          <span class="meta-chip">🏷️ Genre: ${doc.genre || ''}</span>
        </div>
        ${renderDocumentSourceDisclosure(doc, state.currentCorpusKey)}
        ${renderCoverageDisclosure(state.currentCorpusKey)}
      </div>
      ${caseStrip}
    `;

    // Render Preface if exists
    if (doc.preface) {
      html += `
        <div class="case-card" style="border-left: 4px solid var(--accent-gold);">
          <div class="case-header">
            <span class="case-num-title">序言 / Preface</span>
          </div>
          <div class="classical-zh" lang="zh">${annotateClassicalChinese(doc.preface.zh)}</div>
          <div class="pinyin-line">${doc.preface.pinyin}</div>
          ${renderFlatTranslationColumns([
            { key: 'red_pine', name: 'Red Pine (Bill Porter)', text: doc.preface.en_red_pine || doc.preface.en_cleary || '' },
            { key: 'cleary', name: 'Thomas Cleary', text: doc.preface.en_cleary || '' },
            { key: 'sasaki', name: 'Ruth Fuller Sasaki', text: doc.preface.en_sasaki || '' }
          ], { zh: doc.preface.zh, locator: locatorDocumentForKey(state.currentCorpusKey) })}
        </div>
      `;
    }

    // Render Epilogue if exists
    if (doc.epilogue) {
      html += `
        <div class="case-card" style="border-left: 4px solid var(--accent-gold); margin-bottom: 1.5rem;">
          <div class="case-header">
            <span class="case-num-title">後序與結頌 / Wumen's Epilogue & Gatha</span>
          </div>
          <div class="classical-zh" lang="zh">${annotateClassicalChinese(doc.epilogue.zh)}</div>
          <div class="pinyin-line">${doc.epilogue.pinyin}</div>
          ${renderFlatTranslationColumns([
            { key: 'red_pine', name: 'Red Pine (Bill Porter)', text: doc.epilogue.en_red_pine || '' },
            { key: 'cleary', name: 'Thomas Cleary', text: doc.epilogue.en_cleary || '' },
            { key: 'sasaki', name: 'Ruth Fuller Sasaki', text: doc.epilogue.en_sasaki || '' }
          ], { zh: doc.epilogue.zh, locator: locatorDocumentForKey(state.currentCorpusKey) })}
        </div>
      `;
    }

    if (doc.cases && doc.cases.length > 0) {
      const total = doc.cases.length;
      const CASE_CHUNK = 12;
      const limit = state.caseLimit[state.currentCorpusKey] || (total > CASE_CHUNK ? CASE_CHUNK : total);
      doc.cases.slice(0, limit).forEach((caseItem, i) => {
        html += renderCaseItem(caseItem, i, doc.cases);
      });
      if (limit < total) {
        const remaining = total - limit;
        html += `
          <div style="text-align: center; margin: 1.5rem 0;">
            <button id="case-load-more-btn" class="btn-primary" aria-label="Show more cases">
              Show more cases — ${limit} of ${total} · +${Math.min(CASE_CHUNK, remaining)}
            </button>
          </div>`;
      }
    }

    if (doc.sections && doc.sections.length > 0) {
      doc.sections.forEach(sec => {
        html += renderSectionItem(sec);
      });
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
          <div class="case-num-title" style="margin-bottom: 0.5rem; color: var(--accent-green);">☯️ 曹洞宗五位君臣綱宗 / The Dialectic of the Five Ranks</div>
          <div style="font-size: 0.92rem; color: var(--text-secondary); margin-bottom: 1rem;">${doc.overview || ''}</div>
        </div>
      `;

      doc.five_ranks.forEach(r => {
        html += `
          <div class="case-card">
            <div class="case-header">
              <span class="case-num-title">第 ${r.rank_num} 位：${r.name_zh} (${r.name_en})</span>
              <span class="case-speaker">${r.symbol}</span>
            </div>
            <div class="classical-zh" lang="zh" style="font-size: 1.2rem;">${annotateClassicalChinese(r.verse_zh)}</div>
            <div class="pinyin-line">${r.verse_pinyin}</div>
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
          <div class="case-num-title" style="margin-bottom: 0.5rem;">📚 Canonical Architecture & Scope</div>
          <div style="font-size: 0.95rem; color: var(--text-primary); margin-bottom: 1rem;">${doc.overview}</div>
          ${doc.fascicle_structure ? `
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0.5rem;">
              ${doc.fascicle_structure.map(f => `
                <div style="background: var(--bg-card); padding: 0.5rem 0.75rem; border-radius: 4px; border: 1px solid var(--border-color); font-size: 0.78rem;">
                  <strong>卷 ${f.fascicle}:</strong> ${f.scope}
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
            <div class="case-speaker">${d.speaker}</div>
            <div class="classical-zh" lang="zh">${annotateClassicalChinese(d.zh)}</div>
            <div class="pinyin-line">${d.pinyin}</div>
            ${renderTranslationColumns(d.translations, d.zh)}
          </div>
        `).join('');

        html += `
          <div class="case-card">
            <div class="case-header">
              <span class="case-num-title">卷 ${rec.fascicle} 傳燈本則：${rec.title_zh}</span>
              <span class="case-speaker">${rec.title_en}</span>
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

    elements.readerContent.innerHTML = html;
  }

  function renderCaseItem(caseItem, idx, allCases) {
    let dialoguesHtml = '';
    if (caseItem.dialogue) {
      dialoguesHtml = caseItem.dialogue.map(d => `
        <div style="margin-bottom: 1.25rem;">
          <div class="case-speaker">${d.speaker}</div>
          <div class="classical-zh" lang="zh">${annotateClassicalChinese(d.zh)}</div>
          <div class="pinyin-line">${d.pinyin}</div>
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
        ${previousCase ? `<button class="btn-pill" data-jump-case="${previousCase.case_num}">‹ 第${previousCase.case_num}則</button>` : '<span></span>'}
        <button class="btn-pill" data-jump-case="${caseItem.case_num}">⤒ 本則</button>
        ${nextCase ? `<button class="btn-pill" data-jump-case="${nextCase.case_num}">第${nextCase.case_num}則 ›</button>` : '<span></span>'}
      </div>` : '';

    return `
      <div class="case-card ${collapsed ? 'collapsed' : ''}" id="case-${caseItem.case_num}">
        <div class="case-header">
          <span class="case-num-title">第 ${caseItem.case_num} 則：${caseItem.title_zh}</span>
          <span style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
            <span class="case-speaker">${caseItem.title_en}</span>
            ${renderCaseSourceDisclosure(caseItem.case_num)}
            <button class="case-toggle" data-case-toggle="${caseItem.case_num}" aria-expanded="${collapsed ? 'false' : 'true'}" aria-label="${collapsed ? 'Expand' : 'Collapse'} case ${caseItem.case_num}" title="${collapsed ? 'Expand' : 'Collapse'} case">${collapsed ? '＋' : '−'}</button>
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
            <div class="commentary-label">無門評唱 / Commentary</div>
            <div class="classical-zh" lang="zh" style="font-size: 1.15rem;">${annotateClassicalChinese(caseItem.commentary_zh)}</div>
            <div class="pinyin-line" style="border:none; padding:0;">${caseItem.commentary_pinyin || ''}</div>
            ${caseItem.commentary_en && state.readerMode !== 'chinese_only' ? `<div style="margin-top: 0.5rem; font-size: 0.92rem; color: var(--text-primary);">${escHtml(caseItem.commentary_en)}</div>${renderProjectDraftDisclosure('Commentary: project AI draft', { zh: caseItem.commentary_zh, locator: locatorDocumentForKey(state.currentCorpusKey) })}` : ''}
          </div>
        ` : ''}
        ${caseItem.verse_zh ? `
          <div class="verse-block">
            <div class="commentary-label" style="color: var(--accent-green);">頌曰 / Verse</div>
            <div class="classical-zh" lang="zh" style="font-size: 1.2rem;">${annotateClassicalChinese(caseItem.verse_zh)}</div>
            <div class="pinyin-line" style="border:none; padding:0;">${caseItem.verse_pinyin || ''}</div>
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
        <div class="case-speaker">${d.speaker}</div>
        <div class="classical-zh" lang="zh">${annotateClassicalChinese(d.zh)}</div>
        <div class="pinyin-line">${d.pinyin}</div>
        ${renderTranslationColumns(d.translations, d.zh, sectionLocator)}
      </div>
    `).join('');

    // Sections may embed verse stanzas instead of dialogue (e.g. Shitou Sandokai / Grass Hut Song)
    let stanzasHtml = (sec.stanzas || []).map(st => `
      <div style="margin-bottom: 1.25rem;">
        <div class="case-speaker">第 ${st.stanza_num} 節 / Stanza ${st.stanza_num}</div>
        <div class="classical-zh" lang="zh">${annotateClassicalChinese(st.zh)}</div>
        <div class="pinyin-line">${st.pinyin}</div>
        ${renderTranslationColumns(st.translations, st.zh, sectionLocator)}
      </div>
    `).join('');

    return `
      <div class="case-card">
        <div class="case-header">
          <span class="case-num-title">${sec.title_zh}</span>
          <span class="case-speaker">${sec.title_en}</span>
          ${renderSourceLocationDisclosure(sectionLocator, 'Section source', 'case-source-location')}
        </div>
        ${dialoguesHtml}${stanzasHtml}
      </div>
    `;
  }

  function renderDialogueItem(dia) {
    let dialoguesHtml = (dia.dialogue || []).map(d => `
      <div style="margin-bottom: 1.25rem;">
        <div class="case-speaker">${d.speaker}</div>
        <div class="classical-zh" lang="zh">${annotateClassicalChinese(d.zh)}</div>
        <div class="pinyin-line">${d.pinyin}</div>
        ${renderTranslationColumns(d.translations, d.zh)}
      </div>
    `).join('');

    return `
      <div class="case-card">
        <div class="case-header">
          <span class="case-num-title">${dia.title_zh}</span>
          <span class="case-speaker">${dia.title_en}</span>
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
          <span class="case-num-title">第 ${st.stanza_num} 節 / Stanza ${st.stanza_num}</span>
          ${renderSourceLocationDisclosure(stanzaLocator, 'Stanza source', 'case-source-location')}
        </div>
        <div class="classical-zh" lang="zh">${annotateClassicalChinese(st.zh)}</div>
        <div class="pinyin-line">${st.pinyin}</div>
        ${renderTranslationColumns(st.translations, st.zh, stanzaLocator)}
      </div>
    `;
  }

  function renderChapterItem(ch) {
    let contentHtml = '';
    if (ch.verses) {
      contentHtml = ch.verses.map(v => `
        <div style="margin-bottom: 1.25rem;">
          <div class="case-speaker">${v.author}</div>
          <div class="classical-zh" lang="zh">${annotateClassicalChinese(v.zh)}</div>
          <div class="pinyin-line">${v.pinyin}</div>
          ${renderTranslationColumns(v.translations, v.zh)}
          ${v.recension_note ? `<div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.25rem;">ℹ️ ${v.recension_note}</div>` : ''}
        </div>
      `).join('');
    } else if (ch.dialogue) {
      contentHtml = ch.dialogue.map(d => `
        <div style="margin-bottom: 1.25rem;">
          <div class="case-speaker">${d.speaker}</div>
          <div class="classical-zh" lang="zh">${annotateClassicalChinese(d.zh)}</div>
          <div class="pinyin-line">${d.pinyin}</div>
          ${renderTranslationColumns(d.translations, d.zh)}
        </div>
      `).join('');
    }

    return `
      <div class="case-card">
        <div class="case-header">
          <span class="case-num-title">${ch.title_zh}</span>
          <span class="case-speaker">${ch.title_en}</span>
        </div>
        ${contentHtml}
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
        label: '✅ Verified quotation',
        title: 'Checked against a specific edition; source details are shown below.',
        className: 'is-verified'
      };
    }
    if (status === 'ai_draft') {
      return {
        label: '🤖 AI draft',
        title: 'Explicitly AI-generated project draft.',
        className: 'is-ai'
      };
    }
    return {
      label: '⚠️ AI register reconstruction',
      title: 'Written for TranslateChan using broad style characteristics associated with this translator. It was not copied from, checked against, or attributable as wording in that translator’s book; do not cite it as their translation.',
      className: 'is-reconstruction'
    };
  }

  function renderTranslationStatus(entry) {
    const meta = translationStatusMeta(entry.status);
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
    const translator = stringValue(translatorName) || formatTranslatorName(entry.key);
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
    const disclosure = isAi
      ? 'AI draft — no external book quotation'
      : 'Project register reconstruction — not a published book quotation';
    const detail = {
      title: 'Translation disclosure',
      rows: [
        ['Translator / label', translator],
        ['Status', isAi ? 'AI draft' : 'Register reconstruction'],
        ['Book / edition', 'Not applicable — this displayed text is not a verified quotation'],
        ['Page / section', 'Not applicable — citation prohibited for this project draft'],
        ['Disclosure', disclosure],
        ['Citation rule', isAi ? 'Do not cite as an external translation.' : 'Do not cite as a translation by the named scholar.'],
        ...originalRows
      ]
    };
    return `<div class="translation-source source-disclosure">${isAi ? '🤖' : '⚠️'} <strong>${escHtml(translator)}</strong> — ${escHtml(disclosure)} ${renderCitationTrigger(detail, 'ⓘ Disclosure')}</div>`;
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
          return `
            <div class="translation-col">
              <div class="translator-tag">
                <span>${escHtml(item.name || formatTranslatorName(item.key))}</span>
                ${renderTranslationStatus(entry)}
              </div>
              <div class="translation-text">${escHtml(entry.text)}</div>
              ${renderTranslationSource(entry, item.name || formatTranslatorName(item.key), originalContext)}
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
          return `
          <div class="translation-col">
            <div class="translator-tag">
              <span>${escHtml(formatTranslatorName(k))}</span>
              ${renderTranslationStatus(entry)}
            </div>
            <div class="translation-text">${escHtml(entry.text)}</div>
            ${renderTranslationSource(entry, formatTranslatorName(k), originalContext)}
          </div>`;
        }).join('')}
      </div>
    `;
  }

  function formatTranslatorName(key) {
    const map = {
      red_pine: 'Red Pine (Bill Porter)',
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
    return map[key] || key.replace('_', ' ').toUpperCase();
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
      <div class="matrix-card">
        <div class="matrix-header">
          <div class="matrix-ref">📌 ${escHtml(item.source_ref)}</div>
        </div>
        <div class="classical-zh" lang="zh">${annotateClassicalChinese(item.sentence_zh)}</div>
        <div class="pinyin-line">${escHtml(item.sentence_pinyin)}</div>
        ${sourceDisclosure}
        <div class="matrix-grid">
          ${translators.map(rawTranslator => {
            const t = isRecord(rawTranslator) ? rawTranslator : {};
            const entry = normalizeTranslationEntry(t.translator, {
              text: t.text,
              status: t.status,
              source: t.source
            }, {
              isAI: /\bAI\b/i.test(stringValue(t.translator))
            });
            return `
            <div class="matrix-col">
              <div>
                <div class="matrix-author">${escHtml(t.translator)}</div>
                <div class="matrix-work">${escHtml(t.work)}${t.style ? ` (${escHtml(t.style)})` : ''}</div>
                <div class="matrix-text">“${escHtml(entry.text)}”</div>
              </div>
              ${renderTranslationStatus(entry)}
              ${renderTranslationSource(entry, t.translator, { zh: item.sentence_zh, locator })}
              <div class="matrix-note">💡 ${escHtml(t.notes)}</div>
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
      `<span>📚 Chart status: ${verified} source-verified · ${pending} traditional links awaiting exact locators · ${frontiers.length} frontiers</span>` +
      renderCitationTrigger(detail, 'ⓘ Verification details');
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
    if (teacher) return `<button class="btn-pill teacher-link" data-master-teacher="${escHtml(teacher.id)}">Teacher: ${escHtml(teacher.name_zh)} / ${escHtml(teacher.name_en)}</button>`;
    return `<span>Teacher frontier: ${escHtml(master.teacher || 'not recorded')} — profile/source record pending</span>`;
  }

  // Render Lineage Explorer
  function renderLineage() {
    if (!elements.lineageTarget || !state.data.lineage) return;
    renderLineageVerificationSummary();
    let masters = state.data.lineage;

    if (state.selectedMasterSchool !== 'all') {
      masters = masters.filter(m => m.school.toLowerCase().includes(state.selectedMasterSchool.toLowerCase()));
    }

    masters = sortLineageMasters(masters);
    renderVisualLineageGraph(masters);

    elements.lineageTarget.innerHTML = masters.map(m => `
      <div class="master-card" data-master-card="${escHtml(m.id)}" role="button" tabindex="0" aria-label="Open dossier for ${escHtml(m.name_en)}" style="cursor: pointer;">
        <div>
          <div class="master-header">
            <div>
              <div class="master-name-zh">${m.name_zh}</div>
              <div class="master-name-en">${m.name_en} (${m.name_pinyin})</div>
            </div>
            <span class="corpus-badge" style="font-weight: 600;">Gen ${m.lineage_depth}</span>
          </div>
          <div class="master-title">👑 ${m.title}</div>
          <div class="master-meta">
            <span>⏳ Dates: ${m.dates} (${m.era})</span>
            <span>🏛️ Lineage: ${m.school}</span>
            <span>📍 Temple: ${m.location}</span>
            <span>📜 Canonical Ref: ${m.cbeta_id}</span>
            <span>👤 ${lineageTeacherDetail(m)}</span>
          </div>
          <div class="master-quote">
            "${m.key_quote_zh}"
            <div class="master-quote-en">"${m.key_quote_en}"</div>
          </div>
        </div>
        <div style="font-size: 0.8rem; color: var(--text-secondary); border-top: 1px solid var(--border-color); padding-top: 0.5rem;">
          ${m.summary}
        </div>
      </div>
    `).join('');
  }

  // Interactive Visual SVG Lineage Graph (pan/zoom; reset via window.TranslateChan.resetLineageView)
  function renderVisualLineageGraph(masters) {
    const svg = document.getElementById('lineage-svg-graph');
    if (!svg) return;

    const width = Math.max(720, svg.clientWidth || 900);
    const ROW_GAP = 88;
    const TOP_PAD = 78;
    const BOTTOM_PAD = 74;
    svg.innerHTML = '';

    // Define school colors
    const schoolColors = {
      'Foundational Patriarch': '#b38238',
      'East Mountain Teaching': '#c29d59',
      'Southern School': '#c94a4c',
      'Hongzhou School': '#b85d19',
      'Hunan Lineage': '#4d9377',
      'Linji School': '#b53335',
      'Linji': '#b53335',
      'Caodong School': '#3a6b56',
      'Caodong': '#3a6b56',
      'Yunmen School': '#2c5d79',
      'Yunmen': '#2c5d79',
      'Guiyang School': '#7d4a88',
      'Guiyang': '#7d4a88',
      'Fayan School': '#2d7d74',
      'Fayan': '#2d7d74',
      'Linji / Yangqi Branch': '#b53335'
    };

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
      const color = schoolColors[master.school] || '#b38238';

      const shortName = stringValue(master.name_en).split(' ').pop().slice(0, 14);
      nodesHtml += `
        <g class="graph-node" transform="translate(${x}, ${y})" role="button" tabindex="0" aria-label="${escHtml(master.name_en)} — open profile source" data-master-node="${escHtml(master.id)}">
          <circle class="graph-node-halo" r="30" fill="${color}" fill-opacity="0.09"></circle>
          <circle r="24" fill="var(--bg-card)" stroke="${color}" stroke-width="2.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.12))"></circle>
          <text text-anchor="middle" dy=".34em" font-size="12" font-weight="700" fill="var(--text-primary)" font-family="var(--font-serif)">${escHtml(master.name_zh.slice(-2))}</text>
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

  // Master Dossier Modal Display
  window.TranslateChan = window.TranslateChan || {};
  window.TranslateChan.openMasterDossier = function(masterId) {
    if (!state.data.lineage) return;
    const master = state.data.lineage.find(m => m.id === masterId);
    if (!master) return;

    const panel = document.getElementById('master-dossier-panel');
    const nameZh = document.getElementById('dossier-name-zh');
    const nameEn = document.getElementById('dossier-name-en');
    const content = document.getElementById('dossier-content');
    const closeBtn = document.getElementById('dossier-close-btn');

    if (nameZh) nameZh.textContent = `${master.name_zh} (${master.title})`;
    if (nameEn) nameEn.textContent = `${master.name_en} • Pinyin: ${master.name_pinyin} • Generation: ${master.lineage_depth} • Era: ${master.dates}`;
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
          <strong>🏛️ School / Lineage:</strong> ${escHtml(master.school)} &nbsp;|&nbsp;
          <strong>📍 Primary Monastery:</strong> ${escHtml(master.location)} &nbsp;|&nbsp;
          <strong>📜 Canonical record:</strong> ${escHtml(master.cbeta_id)} ${renderCitationTrigger(masterCitation, 'ⓘ Profile source')}
        </div>
        <div class="master-quote" style="background: var(--bg-card); margin-bottom: 0.75rem;">
          "${master.key_quote_zh}"
          <div class="master-quote-en">"${master.key_quote_en}"</div>
        </div>
        <div style="margin-bottom: 0.5rem;"><strong>👤 Teacher:</strong> ${lineageTeacherDetail(master)}</div>
        <div style="margin-bottom: 0.5rem;">
          <strong>📚 Primary Classical Texts & Records:</strong> ${master.texts ? master.texts.map(escHtml).join(', ') : 'Transmission records pending'}
        </div>
        <div style="margin-bottom: 0.5rem;"><strong>🔎 Names & record state:</strong> ${escHtml((master.alternative_names || []).join(' · ') || 'Alternative names not yet reviewed')} · ${escHtml(master.profile_status || 'Seed profile — exact biographical/source locator pending')}</div>
        <div style="margin-bottom: 0.5rem;"><strong>🧾 Evidence status:</strong> ${escHtml(master.profile_evidence?.status || 'not recorded')} — ${escHtml(master.profile_evidence?.note || 'No evidence note recorded.')}</div>
        <div style="margin-bottom: 0.5rem;"><strong>🔗 Cross-referenced project works:</strong> ${renderMasterWorkLinks(master)}</div>
        <div>
          <strong>📖 Historical & Philosophical Significance:</strong> ${master.summary}
        </div>
      `;
    }

    if (panel) {
      panel.style.display = 'block';
      panel.scrollIntoView({ behavior: 'smooth' });
    }

    if (closeBtn) {
      closeBtn.onclick = () => {
        panel.style.display = 'none';
      };
    }
  };

  window.TranslateChan.openLineageEdge = function(teacherId, discipleId) {
    const edge = lineageEdgeRecord(teacherId, discipleId);
    const source = lineageSourceRecord(edge.source_id);
    const teacher = (state.data.lineage || []).find(master => master.id === teacherId);
    const disciple = (state.data.lineage || []).find(master => master.id === discipleId);
    const panel = document.getElementById('master-dossier-panel');
    const nameZh = document.getElementById('dossier-name-zh');
    const nameEn = document.getElementById('dossier-name-en');
    const content = document.getElementById('dossier-content');
    const closeBtn = document.getElementById('dossier-close-btn');
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
    if (panel) {
      panel.style.display = 'block';
      panel.scrollIntoView({ behavior: 'smooth' });
    }
    if (closeBtn) closeBtn.onclick = () => { panel.style.display = 'none'; };
  };

  // Render Gong'an Index
  function renderGonganIndex() {
    if (!elements.gonganTarget || !state.data.gongan_index) return;
    let list = state.data.gongan_index;
    if (state.gonganThemeFilter && state.gonganThemeFilter !== 'all') {
      list = list.filter(g => (g.theme || '').toLowerCase().includes(state.gonganThemeFilter.toLowerCase()));
    }

    const themes = [...new Set(state.data.gongan_index.map(g => g.theme).filter(Boolean))];
    const filterBar = `
      <div style="display:flex; flex-wrap:wrap; gap:0.4rem; margin-bottom:1.25rem; align-items:center;">
        <span style="font-size:0.75rem; font-weight:700; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.6px;">Filter:</span>
        <button class="btn-pill gongan-filter-chip ${!state.gonganThemeFilter || state.gonganThemeFilter === 'all' ? 'active' : ''}" data-gongan-filter="all">All</button>
        ${themes.map(t => `<button class="btn-pill gongan-filter-chip ${state.gonganThemeFilter === t ? 'active' : ''}" data-gongan-filter="${t}">${t}</button>`).join('')}
      </div>`;

    elements.gonganTarget.innerHTML = filterBar + list.map(g => `
      <div class="case-card" style="margin-bottom: 1.25rem;">
        <div class="case-header">
          <span class="case-num-title">${g.title_zh}</span>
          <span class="case-speaker">${g.title_en}</span>
        </div>
        <div style="font-size: 0.85rem; color: var(--accent-gold); font-weight: 600; margin-bottom: 0.4rem;">
          📚 Collection: ${g.collection} | Canon ID: ${g.cbeta_id}
        </div>
        <div style="font-size: 0.92rem; color: var(--text-primary); margin-bottom: 0.6rem;">
          ${g.summary}
        </div>
        <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
          <span class="meta-chip">🎯 Theme: ${g.theme}</span>
          ${g.cross_refs ? g.cross_refs.map(cr => `<span class="meta-chip">🔗 ${cr}</span>`).join('') : ''}
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

  // Render Lexicon
  function renderLexicon() {
    if (!elements.lexiconTarget || !state.data.glossary) return;
    let list = state.data.glossary;

    if (state.selectedLexiconCategory !== 'all') {
      list = list.filter(item => item.category.toLowerCase().includes(state.selectedLexiconCategory.toLowerCase()));
    }

    elements.lexiconTarget.innerHTML = list.map(item => `
      <div class="term-card">
        <div class="term-card-zh">${item.term}</div>
        <div class="term-card-literal">${item.literal} (${item.pinyin})</div>
        <div class="term-card-sanskrit">Sanskrit: ${item.sanskrit || '—'} | 🏷️ ${item.category}</div>
        <div class="term-card-def">${item.definition}</div>
        <div class="term-card-occurrences">
          ${item.occurrences.map(occ => `<span class="term-occ-tag">📖 ${occ}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  // ---- Search: universal segment extraction across every corpus schema ----
  // Orthographic variant pairs found across canon editions. Both spellings are
  // normalized to ONE canonical side (first listed) so 洗鉢盂去/洗缽盂去, 師云/師曰
  // etc. cross-match; variantRegex() still marks either spelling in the raw text.
  const SEARCH_VARIANTS = { '鉢': '缽', '曰': '云', '臺': '台', '裏': '里', '無': '无' };
  function normalizeForSearch(s) {
    return String(s || '').toLowerCase().split('').map(ch => SEARCH_VARIANTS[ch] || ch).join('');
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
    const fromDialogue = (items, label, jump) => (items || []).forEach(d => {
      units.push({
        label, jump,
        zh: d.zh || '', pinyin: d.pinyin || '',
        blob: asBlob(label, d.speaker, d.zh, d.pinyin, blobWithTranslations(d.translations))
      });
    });

    if (doc.preface && doc.preface.zh) {
      units.push({ label: '序言 / Preface', jump: null, zh: doc.preface.zh, pinyin: doc.preface.pinyin || '',
        blob: asBlob('preface', doc.preface.zh, doc.preface.pinyin, doc.preface.en_red_pine, doc.preface.en_cleary, doc.preface.en_sasaki) });
    }
    if (doc.epilogue && doc.epilogue.zh) {
      units.push({ label: '後序 / Epilogue', jump: null, zh: doc.epilogue.zh, pinyin: doc.epilogue.pinyin || '',
        blob: asBlob('epilogue', doc.epilogue.zh, doc.epilogue.pinyin, doc.epilogue.en_red_pine, doc.epilogue.en_cleary, doc.epilogue.en_sasaki) });
    }
    (doc.cases || []).forEach(c => {
      const label = `第${c.case_num}則 ${c.title_zh || ''} / ${c.title_en || ''}`;
      fromDialogue(c.dialogue, label, { kind: 'case', num: c.case_num });
      if (c.pointer_zh) units.push({ label: label + ' · pointer', jump: { kind: 'case', num: c.case_num }, zh: c.pointer_zh, pinyin: c.pointer_pinyin || '', blob: asBlob(label, c.pointer_zh, c.pointer_pinyin, c.pointer_en) });
      if (c.commentary_zh) units.push({ label: label + ' · commentary', jump: { kind: 'case', num: c.case_num }, zh: c.commentary_zh, pinyin: c.commentary_pinyin || '', blob: asBlob(label, c.commentary_zh, c.commentary_pinyin, c.commentary_en) });
      if (c.verse_zh) units.push({ label: label + ' · verse', jump: { kind: 'case', num: c.case_num }, zh: c.verse_zh, pinyin: c.verse_pinyin || '', blob: asBlob(label, c.verse_zh, c.verse_pinyin, c.verse_en) });
      // explicit title unit so title-only queries surface the case
      units.push({ label, jump: { kind: 'case', num: c.case_num }, zh: c.title_zh || '', pinyin: c.title_pinyin || '', blob: asBlob(label) });
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
        blob: asBlob(`stanza ${st.stanza_num}`, st.zh, st.pinyin, blobWithTranslations(st.translations)) });
    });
    (doc.chapters || []).forEach(ch => {
      const label = `${ch.title_zh || ''} / ${ch.title_en || ''}`;
      fromDialogue(ch.dialogue, label, null);
      (ch.verses || []).forEach(v => units.push({ label, jump: null, zh: v.zh || '', pinyin: v.pinyin || '',
        blob: asBlob(label, v.author, v.zh, v.pinyin, blobWithTranslations(v.translations)) }));
    });
    (doc.five_ranks || []).forEach(r => {
      units.push({ label: `Five Ranks · ${r.name_zh || ''}`, jump: null, zh: r.verse_zh || '', pinyin: r.verse_pinyin || '',
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
            <div class="case-header"><span class="case-num-title" style="font-size:0.95rem;">${escHtml(u.label)}</span></div>
            <div class="classical-zh" lang="zh" style="font-size:1.15rem;">${makeSnippet(u.zh, q)}</div>
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
    const headerHtml = `<div class="text-header"><div class="text-title-zh">🔍 Search Results for: "${escHtml(q)}"</div><div class="text-title-en">${totalHits} matching unit(s) across ${matchedDocuments.length} text(s)</div>${resultNotice}</div>`;

    elements.readerContent.innerHTML = totalHits === 0
      ? headerHtml + `<div class="case-card"><p>No matches found for "${escHtml(q)}". Try Classical Chinese (e.g. 狗子, 無, 佛性, 平常心, 絕學) or English (e.g. Buddha, mind, fox, mirror) across all 36 texts.</p></div>`
      : headerHtml + bodyHtml;
  }

  // Global helpers (merge into existing namespace — do NOT overwrite openMasterDossier)
  window.TranslateChan = window.TranslateChan || {};
  const CASE_CHUNK = 12;
  function caseTotal() {
    const d = state.data.corpus && state.data.corpus[state.currentCorpusKey];
    return d && Array.isArray(d.cases) ? d.cases.length : 0;
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
  window.TranslateChan.loadMoreCases = function() {
    const total = caseTotal();
    const cur = state.caseLimit[state.currentCorpusKey] || (total > CASE_CHUNK ? CASE_CHUNK : total);
    state.caseLimit[state.currentCorpusKey] = Math.min(total, cur + CASE_CHUNK);
    // keep the reader roughly in place after re-render
    const btn = document.getElementById('case-load-more-btn');
    const y = (btn && typeof btn.getBoundingClientRect === 'function')
      ? btn.getBoundingClientRect().top + (window.scrollY || 0) : null;
    renderReader();
    if (y !== null) window.scrollTo({ top: Math.max(0, y - 96) });
  };
  window.TranslateChan.scrollToCase = function(caseNum) {
    ensureCaseLoaded(caseNum);
    expandCase(caseNum);
    setTimeout(() => {
      const el = document.getElementById(`case-${caseNum}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };
  window.TranslateChan.openCase = function(corpusKey, caseNum) {
    if (!setCurrentCorpusKey(corpusKey)) return;
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
    state.searchQuery = '';
    if (elements.globalSearch) elements.globalSearch.value = '';
    renderCorpusList();
    renderReader();
    const t = viewHash('reader', corpusKey);
    if (location.hash !== t) { try { location.hash = t; } catch (e) { /* ignore */ } }
  };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
