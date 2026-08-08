/**
 * TranslateChan - Interactive Classical Chan Translation & Preservation Platform
 * Zero-backend client-side application for GitHub Pages.
 */

(function() {
  'use strict';

  // Application State
  const state = {
    data: window.TRANSLATECHAN_DATA || {},
    currentView: 'reader',
    currentCorpusKey: 'wumenguan',
    readerMode: 'bilingual', // 'bilingual', 'stacked', 'chinese_only', 'multi_translators'
    theme: localStorage.getItem('translatechan_theme') || 'light',
    searchQuery: '',
    selectedMasterSchool: 'all',
    selectedLexiconCategory: 'all',
    selectedStudioRefTranslator: 'red_pine',
    personalTranslations: JSON.parse(localStorage.getItem('translatechan_user_translations') || '{}')
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
    lineageTarget: document.getElementById('lineage-content-target'),
    // Gong'an Elements
    gonganTarget: document.getElementById('gongan-content-target'),
    // Lexicon Elements
    lexiconFilter: document.getElementById('lexicon-cat-filter'),
    lexiconTarget: document.getElementById('lexicon-content-target'),
    // Studio Elements
    studioSelectText: document.getElementById('studio-select-text'),
    studioSourceZh: document.getElementById('studio-source-zh'),
    studioSourcePinyin: document.getElementById('studio-source-pinyin'),
    studioCharCount: document.getElementById('studio-char-count'),
    studioRefTranslatorSelect: document.getElementById('studio-ref-translator-select'),
    studioRefText: document.getElementById('studio-ref-text'),
    studioDetectedTerms: document.getElementById('studio-detected-terms'),
    studioUserTranslation: document.getElementById('studio-user-translation'),
    studioUserNotes: document.getElementById('studio-user-notes'),
    studioSaveBtn: document.getElementById('studio-save-btn'),
    studioExportJsonBtn: document.getElementById('studio-export-json-btn'),
    studioExportMdBtn: document.getElementById('studio-export-md-btn'),
    studioExportLatexBtn: document.getElementById('studio-export-latex-btn'),
    studioClearAllBtn: document.getElementById('studio-clear-all-btn'),
    studioStatus: document.getElementById('studio-status'),
    studioSavedList: document.getElementById('studio-saved-list')
  };

  // Initialize
  function init() {
    applyTheme(state.theme);
    setupEventListeners();
    renderCorpusList();
    renderReader();
    renderMatrix();
    renderLineage();
    renderGonganIndex();
    renderLexicon();
    setupStudio();
  }

  // Theme Management
  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('translatechan_theme', theme);
    if (elements.themeToggle) {
      elements.themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  // Event Listeners
  function setupEventListeners() {
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

    elements.readerModeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        elements.readerModeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.readerMode = btn.getAttribute('data-reader-mode');
        renderReader();
      });
    });

    if (elements.globalSearch) {
      elements.globalSearch.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.trim().toLowerCase();
        handleGlobalSearch();
      });
    }

    if (elements.lineageFilter) {
      elements.lineageFilter.addEventListener('change', (e) => {
        state.selectedMasterSchool = e.target.value;
        renderLineage();
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
  }

  // View Switcher
  function switchView(viewName) {
    state.currentView = viewName;
    elements.navTabs.forEach(tab => {
      if (tab.getAttribute('data-view') === viewName) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
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

  // Annotate text with glossary tooltips
  function annotateClassicalChinese(text) {
    if (!text || !state.data.glossary) return text;
    let annotated = text;
    const sortedTerms = [...state.data.glossary].sort((a, b) => b.term.length - a.term.length);

    sortedTerms.forEach(termObj => {
      const term = termObj.term;
      if (annotated.includes(term)) {
        const regex = new RegExp(term, 'g');
        const tooltipHtml = `
          <span class="term-highlight">${term}
            <span class="term-tooltip">
              <div class="tooltip-term-title">${term} (${termObj.pinyin})</div>
              <div class="tooltip-sanskrit">Sanskrit: ${termObj.sanskrit || '—'}</div>
              <div><strong>Literal:</strong> ${termObj.literal}</div>
              <div style="margin-top: 0.35rem;">${termObj.definition}</div>
            </span>
          </span>
        `;
        annotated = annotated.replace(regex, tooltipHtml);
      }
    });
    return annotated;
  }

  // Render Sidebar Corpus List
  function renderCorpusList() {
    if (!elements.corpusList || !state.data.corpus) return;
    const corpusMap = [
      { key: 'wumenguan', title: 'The Gateless Gate (無門關)', cbeta: 'T2005' },
      { key: 'linji_yulu', title: 'Record of Linji (臨濟語錄)', cbeta: 'T1985' },
      { key: 'huangbo_chuanxin', title: 'Transmission of Mind (黃檗法要)', cbeta: 'T2012A' },
      { key: 'zhaozhou_yulu', title: 'Sayings of Zhaozhou (趙州語錄)', cbeta: 'T1987' },
      { key: 'xinxin_ming', title: 'Faith in Mind (信心銘)', cbeta: 'T2010' },
      { key: 'baojing_sanmei', title: 'Jewel Mirror Samadhi (寶鏡三昧)', cbeta: 'T1986' },
      { key: 'biyanlu_cases', title: 'Blue Cliff Record (碧巖錄)', cbeta: 'T2003' },
      { key: 'platform_sutra', title: 'Platform Sutra (六祖壇經)', cbeta: 'T2007' },
      { key: 'chuandenglu', title: 'Transmission of Lamp (景德傳燈錄)', cbeta: 'T2076' },
      { key: 'qinggui_monastic_codes', title: 'Rules of Purity (百丈禪苑清規)', cbeta: 'T2025' },
      { key: 'dongshan_yulu', title: 'Dongshan Yulu & Five Ranks (洞山五位)', cbeta: 'T1986' },
      { key: 'yunmen_yulu', title: 'Yunmen Yulu (雲門語錄一字關)', cbeta: 'T1988' },
      { key: 'fayan_yulu', title: 'Fayan Yulu & Ten Rules (法眼十規論)', cbeta: 'T1991' },
      { key: 'guiyang_yulu', title: 'Guiyang Yulu & Circles (溈仰九十六圓相)', cbeta: 'T1989' },
      { key: 'dahui_hongzhi', title: 'Dahui & Hongzhi (看話書問與默照銘)', cbeta: 'T1998A' },
      { key: 'shitou_sandokai', title: 'Shitou Sandokai & Grass Hut (參同契與草庵歌)', cbeta: 'T1985' },
      { key: 'zhengdao_ge', title: 'Yongjia Zhengdao Ge (永嘉證道歌)', cbeta: 'T2014' },
      { key: 'bodhidharma_erru', title: 'Bodhidharma Erru Sixing (二入四行論)', cbeta: 'T2009' },
      { key: 'niutou_juezhu', title: 'Niutou Farong Juezhu Lun (絕觀論)', cbeta: 'P.2885' },
      { key: 'lidai_fabao_ji', title: 'Lidai Fabao Ji (歷代法寶記)', cbeta: 'T2075' },
      { key: 'dazhu_huihai', title: 'Dazhu Huihai Dunwu Yaomen (頓悟入道要門)', cbeta: 'X1258' },
      { key: 'baizhang_guanglu', title: 'Baizhang Guanglu (百丈廣錄三句)', cbeta: 'X1304' },
      { key: 'foyan_qingyuan', title: 'Foyan Qingyuan Instant Zen (佛眼坐禪銘)', cbeta: 'T1995' },
      { key: 'dahui_shobogenzo', title: 'Dahui Shobogenzo (大慧正法眼藏)', cbeta: 'T2002' },
      { key: 'mazu_yulu', title: 'Mazu Daoyi Yulu (江西馬祖語錄)', cbeta: 'X1304' },
      { key: 'nanquan_yulu', title: 'Nanquan Puyuan Yulu (南泉普願語錄)', cbeta: 'X1315' },
      { key: 'deshan_yulu', title: 'Deshan Xuanjian Yulu (德山宣鑑語錄)', cbeta: 'T1985' }
    ];

    elements.corpusList.innerHTML = corpusMap.map(c => `
      <button class="corpus-btn ${c.key === state.currentCorpusKey ? 'active' : ''}" data-corpus-key="${c.key}">
        <span>${c.title}</span>
        <span class="corpus-badge">${c.cbeta}</span>
      </button>
    `).join('');

    elements.corpusList.querySelectorAll('.corpus-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.currentCorpusKey = btn.getAttribute('data-corpus-key');
        renderCorpusList();
        renderReader();
      });
    });
  }

  // Render Reader View
  function renderReader() {
    if (!elements.readerContent || !state.data.corpus) return;
    const doc = state.data.corpus[state.currentCorpusKey];
    if (!doc) {
      elements.readerContent.innerHTML = '<p>Corpus document loading...</p>';
      return;
    }

    let html = `
      <div class="text-header">
        <div class="text-title-zh">${doc.title_zh}</div>
        <div class="text-title-en">${doc.title_en} (${doc.title_pinyin})</div>
        <div class="text-meta-chips">
          <span class="meta-chip">📜 Canon: ${doc.cbeta_id || 'Taisho'} (Vol. ${doc.taisho_vol || 48})</span>
          <span class="meta-chip">✍️ Master/Author: ${doc.author_zh || ''}</span>
          <span class="meta-chip">⏳ Era: ${doc.era || ''}</span>
          <span class="meta-chip">🏷️ Genre: ${doc.genre || ''}</span>
        </div>
      </div>
    `;

    // Render Preface if exists
    if (doc.preface) {
      html += `
        <div class="case-card" style="border-left: 4px solid var(--accent-gold);">
          <div class="case-header">
            <span class="case-num-title">序言 / Preface</span>
          </div>
          <div class="classical-zh">${annotateClassicalChinese(doc.preface.zh)}</div>
          <div class="pinyin-line">${doc.preface.pinyin}</div>
          <div class="translation-grid">
            <div class="translation-col">
              <div class="translator-tag">Red Pine (Bill Porter)</div>
              <div class="translation-text">${doc.preface.en_red_pine || doc.preface.en_cleary || ''}</div>
            </div>
            <div class="translation-col">
              <div class="translator-tag">Thomas Cleary</div>
              <div class="translation-text">${doc.preface.en_cleary || ''}</div>
            </div>
            <div class="translation-col">
              <div class="translator-tag">Ruth Fuller Sasaki</div>
              <div class="translation-text">${doc.preface.en_sasaki || ''}</div>
            </div>
          </div>
        </div>
      `;
    }

    if (doc.cases && doc.cases.length > 0) {
      doc.cases.forEach(caseItem => {
        html += renderCaseItem(caseItem);
      });
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
            <div class="classical-zh" style="font-size: 1.2rem;">${annotateClassicalChinese(r.verse_zh)}</div>
            <div class="pinyin-line">${r.verse_pinyin}</div>
            ${renderTranslationColumns(r.translations)}
            <div class="commentary-block" style="margin-top: 1rem; border-left-color: var(--accent-green);">
              <div class="commentary-label" style="color: var(--accent-green);">曹山註解 / Caoshan Commentary</div>
              <div class="classical-zh" style="font-size: 1.05rem;">${annotateClassicalChinese(r.commentary_zh)}</div>
              <div style="font-size: 0.9rem; color: var(--text-primary); margin-top: 0.35rem;">${r.commentary_en}</div>
            </div>
          </div>
        `;
      });
    }

    elements.readerContent.innerHTML = html;
      if (doc.overview) {
        html += `
          <div class="case-card" style="border-left: 4px solid var(--accent-gold); margin-bottom: 1.5rem;">
            <div class="case-num-title" style="margin-bottom: 0.5rem;">📚 30 Fascicles Canonical Architecture</div>
            <div style="font-size: 0.95rem; color: var(--text-primary); margin-bottom: 1rem;">${doc.overview}</div>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0.5rem;">
              ${doc.fascicle_structure.map(f => `
                <div style="background: var(--bg-card); padding: 0.5rem 0.75rem; border-radius: 4px; border: 1px solid var(--border-color); font-size: 0.78rem;">
                  <strong>卷 ${f.fascicle}:</strong> ${f.scope}
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      doc.sample_records.forEach(rec => {
        let diaHtml = rec.dialogue.map(d => `
          <div style="margin-bottom: 1.25rem;">
            <div class="case-speaker">${d.speaker}</div>
            <div class="classical-zh">${annotateClassicalChinese(d.zh)}</div>
            <div class="pinyin-line">${d.pinyin}</div>
            ${renderTranslationColumns(d.translations)}
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

    elements.readerContent.innerHTML = html;
  }

  function renderCaseItem(caseItem) {
    let dialoguesHtml = '';
    if (caseItem.dialogue) {
      dialoguesHtml = caseItem.dialogue.map(d => `
        <div style="margin-bottom: 1.25rem;">
          <div class="case-speaker">${d.speaker}</div>
          <div class="classical-zh">${annotateClassicalChinese(d.zh)}</div>
          <div class="pinyin-line">${d.pinyin}</div>
          ${renderTranslationColumns(d.translations)}
        </div>
      `).join('');
    }

    return `
      <div class="case-card" id="case-${caseItem.case_num}">
        <div class="case-header">
          <span class="case-num-title">第 ${caseItem.case_num} 則：${caseItem.title_zh}</span>
          <span class="case-speaker">${caseItem.title_en}</span>
        </div>
        ${caseItem.pointer_zh ? `
          <div class="commentary-block" style="background: var(--bg-card); border-left-color: var(--accent-blue); margin-bottom: 1rem;">
            <div class="commentary-label" style="color: var(--accent-blue);">垂示 / Pointer</div>
            <div class="classical-zh" style="font-size: 1.05rem;">${annotateClassicalChinese(caseItem.pointer_zh)}</div>
            <div style="font-size: 0.88rem; color: var(--text-secondary);">${caseItem.pointer_en || ''}</div>
          </div>
        ` : ''}
        ${dialoguesHtml}
        ${caseItem.commentary_zh ? `
          <div class="commentary-block">
            <div class="commentary-label">無門評唱 / Commentary</div>
            <div class="classical-zh" style="font-size: 1.15rem;">${annotateClassicalChinese(caseItem.commentary_zh)}</div>
            <div class="pinyin-line" style="border:none; padding:0;">${caseItem.commentary_pinyin || ''}</div>
            <div style="margin-top: 0.5rem; font-size: 0.92rem; color: var(--text-primary);">${caseItem.commentary_en || ''}</div>
          </div>
        ` : ''}
        ${caseItem.verse_zh ? `
          <div class="verse-block">
            <div class="commentary-label" style="color: var(--accent-green);">頌曰 / Verse</div>
            <div class="classical-zh" style="font-size: 1.2rem;">${annotateClassicalChinese(caseItem.verse_zh)}</div>
            <div class="pinyin-line" style="border:none; padding:0;">${caseItem.verse_pinyin || ''}</div>
            <div style="margin-top: 0.4rem; font-size: 0.92rem; color: var(--text-primary);">${caseItem.verse_en || ''}</div>
          </div>
        ` : ''}
      </div>
    `;
  }

  function renderSectionItem(sec) {
    let dialoguesHtml = sec.dialogue.map(d => `
      <div style="margin-bottom: 1.25rem;">
        <div class="case-speaker">${d.speaker}</div>
        <div class="classical-zh">${annotateClassicalChinese(d.zh)}</div>
        <div class="pinyin-line">${d.pinyin}</div>
        ${renderTranslationColumns(d.translations)}
      </div>
    `).join('');

    return `
      <div class="case-card">
        <div class="case-header">
          <span class="case-num-title">${sec.title_zh}</span>
          <span class="case-speaker">${sec.title_en}</span>
        </div>
        ${dialoguesHtml}
      </div>
    `;
  }

  function renderDialogueItem(dia) {
    let dialoguesHtml = dia.dialogue.map(d => `
      <div style="margin-bottom: 1.25rem;">
        <div class="case-speaker">${d.speaker}</div>
        <div class="classical-zh">${annotateClassicalChinese(d.zh)}</div>
        <div class="pinyin-line">${d.pinyin}</div>
        ${renderTranslationColumns(d.translations)}
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
    return `
      <div class="case-card">
        <div class="case-header">
          <span class="case-num-title">第 ${st.stanza_num} 節 / Stanza ${st.stanza_num}</span>
        </div>
        <div class="classical-zh">${annotateClassicalChinese(st.zh)}</div>
        <div class="pinyin-line">${st.pinyin}</div>
        ${renderTranslationColumns(st.translations)}
      </div>
    `;
  }

  function renderChapterItem(ch) {
    let contentHtml = '';
    if (ch.verses) {
      contentHtml = ch.verses.map(v => `
        <div style="margin-bottom: 1.25rem;">
          <div class="case-speaker">${v.author}</div>
          <div class="classical-zh">${annotateClassicalChinese(v.zh)}</div>
          <div class="pinyin-line">${v.pinyin}</div>
          ${renderTranslationColumns(v.translations)}
        </div>
      `).join('');
    } else if (ch.dialogue) {
      contentHtml = ch.dialogue.map(d => `
        <div style="margin-bottom: 1.25rem;">
          <div class="case-speaker">${d.speaker}</div>
          <div class="classical-zh">${annotateClassicalChinese(d.zh)}</div>
          <div class="pinyin-line">${d.pinyin}</div>
          ${renderTranslationColumns(d.translations)}
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

  function renderTranslationColumns(translations) {
    if (!translations) return '';
    if (state.readerMode === 'chinese_only') return '';

    const keys = Object.keys(translations);
    if (keys.length === 0) return '';

    let displayKeys = keys;
    if (state.readerMode === 'bilingual') {
      displayKeys = keys.slice(0, 2);
    }

    return `
      <div class="translation-grid">
        ${displayKeys.map(k => `
          <div class="translation-col">
            <div class="translator-tag">
              <span>${formatTranslatorName(k)}</span>
              <span style="font-size: 0.65rem; color: var(--text-muted); font-weight: normal;">${k.startsWith('ai_') ? 'AI Synthesis' : 'Scholarly'}</span>
            </div>
            <div class="translation-text">${translations[k]}</div>
          </div>
        `).join('')}
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
      ai_literal: 'AI Draft (Literal)',
      ai_poetic: 'AI Draft (Poetic Zen)'
    };
    return map[key] || key.replace('_', ' ').toUpperCase();
  }

  // Render Comparison Matrix
  function renderMatrix() {
    if (!elements.matrixTarget || !state.data.translations_matrix) return;
    const matrixList = state.data.translations_matrix;

    elements.matrixTarget.innerHTML = matrixList.map(item => `
      <div class="matrix-card">
        <div class="matrix-header">
          <div class="matrix-ref">📌 ${item.source_ref}</div>
        </div>
        <div class="classical-zh">${annotateClassicalChinese(item.sentence_zh)}</div>
        <div class="pinyin-line">${item.sentence_pinyin}</div>
        <div class="matrix-grid">
          ${item.translators.map(t => `
            <div class="matrix-col">
              <div>
                <div class="matrix-author">${t.translator}</div>
                <div class="matrix-work">${t.work} (${t.style})</div>
                <div class="matrix-text">"${t.text}"</div>
              </div>
              <div class="matrix-note">💡 ${t.notes}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  // Render Lineage Explorer
  function renderLineage() {
    if (!elements.lineageTarget || !state.data.lineage) return;
    let masters = state.data.lineage;

    if (state.selectedMasterSchool !== 'all') {
      masters = masters.filter(m => m.school.toLowerCase().includes(state.selectedMasterSchool.toLowerCase()));
    }

    renderVisualLineageGraph(masters);

    elements.lineageTarget.innerHTML = masters.map(m => `
      <div class="master-card" onclick="window.TranslateChan.openMasterDossier('${m.id}')" style="cursor: pointer;">
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

  // Interactive Visual SVG Lineage Graph
  function renderVisualLineageGraph(masters) {
    const svg = document.getElementById('lineage-svg-graph');
    if (!svg) return;

    const width = svg.clientWidth || 900;
    const height = 480;
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
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
      'Fayan': '#2d7d74'
    };

    // Calculate node coordinates based on lineage generation
    const genGroups = {};
    masters.forEach(m => {
      const gen = m.lineage_depth || 1;
      if (!genGroups[gen]) genGroups[gen] = [];
      genGroups[gen].push(m);
    });

    const gens = Object.keys(genGroups).map(Number).sort((a, b) => a - b);
    const nodeCoords = {};

    gens.forEach((gen, gIdx) => {
      const group = genGroups[gen];
      const x = 70 + gIdx * ((width - 140) / Math.max(1, gens.length - 1));
      group.forEach((m, mIdx) => {
        const y = 60 + (mIdx + 1) * ((height - 120) / (group.length + 1));
        nodeCoords[m.id] = { x, y, master: m };
      });
    });

    // Draw Links (Teacher -> Disciple)
    let linksHtml = '<g class="graph-links" stroke="var(--border-focus)" stroke-width="1.8" stroke-opacity="0.6" stroke-dasharray="3,3">';
    masters.forEach(m => {
      if (m.teacher && nodeCoords[m.teacher] && nodeCoords[m.id]) {
        const source = nodeCoords[m.teacher];
        const target = nodeCoords[m.id];
        linksHtml += `<line x1="${source.x}" y1="${source.y}" x2="${target.x}" y2="${target.y}" />`;
      }
    });
    linksHtml += '</g>';

    // Draw Nodes
    let nodesHtml = '<g class="graph-nodes">';
    Object.keys(nodeCoords).forEach(id => {
      const { x, y, master } = nodeCoords[id];
      const color = schoolColors[master.school] || '#b38238';

      nodesHtml += `
        <g class="graph-node" transform="translate(${x}, ${y})" style="cursor: pointer;" onclick="window.TranslateChan.openMasterDossier('${master.id}')">
          <circle r="22" fill="var(--bg-card)" stroke="${color}" stroke-width="3" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"></circle>
          <text text-anchor="middle" dy=".3em" font-size="11" font-weight="700" fill="var(--text-primary)" font-family="var(--font-serif)">${master.name_zh.slice(-2)}</text>
          <text text-anchor="middle" dy="34" font-size="9.5" font-weight="600" fill="var(--text-secondary)">${master.name_en.split(' ').pop()}</text>
        </g>
      `;
    });
    nodesHtml += '</g>';

    svg.innerHTML = linksHtml + nodesHtml;
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
      content.innerHTML = `
        <div style="margin-top: 0.5rem; margin-bottom: 0.75rem;">
          <strong>🏛️ School / Lineage:</strong> ${master.school} &nbsp;|&nbsp;
          <strong>📍 Primary Monastery:</strong> ${master.location} &nbsp;|&nbsp;
          <strong>📜 CBETA ID:</strong> ${master.cbeta_id}
        </div>
        <div class="master-quote" style="background: var(--bg-card); margin-bottom: 0.75rem;">
          "${master.key_quote_zh}"
          <div class="master-quote-en">"${master.key_quote_en}"</div>
        </div>
        <div style="margin-bottom: 0.5rem;">
          <strong>📚 Primary Classical Texts & Records:</strong> ${master.texts ? master.texts.join(', ') : 'Transmission records in Jingde Chuandenglu'}
        </div>
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

  // Render Gong'an Index
  function renderGonganIndex() {
    if (!elements.gonganTarget || !state.data.gongan_index) return;
    const list = state.data.gongan_index;

    elements.gonganTarget.innerHTML = list.map(g => `
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

  // Setup Personal Translation Studio
  function setupStudio() {
    if (!elements.studioSelectText) return;

    const studioPassages = [
      {
        id: 'wumen_1',
        label: 'Wumenguan Case 1: Zhaozhou Dog (狗子還有佛性也無？州云：無。)',
        zh: '趙州和尚因僧問：「狗子還有佛性也無？」州云：「無。」',
        pinyin: 'Zhàozhōu héshang yīn sēng wèn: "Gǒuzi hái yǒu fóxìng yě wú?" Zhōu yún: "Wú."',
        translations: {
          red_pine: "A monk asked Zhaozhou: 'Does a dog have Buddha-nature or not?' Zhaozhou said: 'Wu!'",
          cleary: "A monk asked Master Zhaozhou, 'Does a dog have Buddha-nature?' Zhaozhou said, 'No.'",
          sasaki: "A monk asked Master Jōshū: 'Does even a dog have Buddha-nature, or not?' Jōshū said: 'Mu!'",
          suzuki: "A monk asked Chao-chou: 'Has a dog Buddha-nature?' Chao-chou replied: 'Wu!'",
          blyth: "A monk asked Jōshū, 'Has a dog the Buddha Nature?' Jōshū answered: 'Mu!'",
          blofeld: "A monk asked Zhaozhou: 'Has a dog Buddha-nature or not?' The Master replied: 'None!'",
          ai_literal: "A monk asked the monk Zhaozhou: 'Does a dog still have Buddha-nature or not?' Zhou said: 'Not.'"
        }
      },
      {
        id: 'wumen_2',
        label: 'Wumenguan Case 2: Baizhang Fox (大修行底人還落因果也無？不昧因果。)',
        zh: '大修行底人還落因果也無？師曰：不昧因果。',
        pinyin: 'Dà xiūxíng dǐ rén hái luò yīnguǒ yě wú? Shī yuē: Bù mèi yīnguǒ.',
        translations: {
          red_pine: "Does a person of great practice still fall into causality? The Master said: Is not blind to causality.",
          cleary: "Does an adept of great cultivation still fall into cause and effect? The Master said: Is not blind to cause and effect.",
          sasaki: "Does a great practitioner fall under cause and effect? Hyakujō said: Not blind to cause and effect."
        }
      },
      {
        id: 'wumen_19',
        label: 'Wumenguan Case 19: Ordinary Mind (平常心是道。擬向即乖。)',
        zh: '平常心是道。擬向即乖。道不屬知，不屬不知。',
        pinyin: 'Píngcháng xīn shì dào. Nǐ xiàng jí guāi. Dào bù shǔ zhī, bù shǔ bù zhī.',
        translations: {
          red_pine: "Ordinary mind is the Way. To intend toward it is to go astray. The Way belongs neither to knowing nor not-knowing.",
          cleary: "Ordinary mind is the Way. To intend toward it is to deviate from it. The Way does not belong to knowing or not-knowing.",
          sasaki: "Ordinary mind is the Way. If you try to direct yourself toward it, you go astray."
        }
      },
      {
        id: 'linji_1',
        label: 'Linji Yulu: True Person of No Rank (赤肉團上有一無位真人)',
        zh: '赤肉團上有一無位真人，常從諸人面門出入。未證據者看看！',
        pinyin: 'Chì ròu tuán shàng yǒu yī wú wèi zhēn rén, cháng cóng zhū rén miàn mén chū rù. Wèi zhèng jù zhě kàn kàn!',
        translations: {
          red_pine: "On this lump of red flesh is a True Person without rank, constantly going in and out through the gates of your face. You who haven't witnessed it: look, look!",
          cleary: "On this lump of red flesh is a true human of no status, constantly entering and exiting through the gates of your face. Those who have not experienced this, look! Look!",
          sasaki: "On your lump of red flesh is a True Person of No Rank who is constantly going in and out through your facial gates. Those who have not yet recognized him: look, look!"
        }
      },
      {
        id: 'huangbo_1',
        label: 'Huangbo Chuanxin: One Mind (諸佛與一切眾生唯是一心)',
        zh: '諸佛與一切眾生，唯是一心，更無別法。此心無始已來，不曾生不曾滅。',
        pinyin: 'Zhūfó yǔ yīqiè zhòngshēng, wéi shì yī xīn, gèng wú bié fǎ. Cǐ xīn wú shǐ yǐ lái, bù céng shēng bù céng miè.',
        translations: {
          blofeld: "All the Buddhas and all sentient beings are nothing whatever but the One Mind, besides which nothing exists. This Mind from beginningless time is unborn and indestructible.",
          cleary: "All Buddhas and all sentient beings are only One Mind, with no other reality. This mind from beginningless time has never been born and never perishes.",
          red_pine: "Buddhas and all sentient beings are nothing other than One Mind, beyond which is no other dharma."
        }
      },
      {
        id: 'xinxin_1',
        label: 'Xinxin Ming: Line 1 (至道無難，唯嫌揀擇。但莫憎愛，洞然明白。)',
        zh: '至道無難，唯嫌揀擇。但莫憎愛，洞然明白。',
        pinyin: 'Zhì dào wú nán, wéi xián jiǎnzé. Dàn mò zēng ài, dòng rán míng bái.',
        translations: {
          red_pine: "The Great Way is not hard, it only detests picking and choosing. Simply without hate or love, it opens wide and clear.",
          cleary: "The Great Way is not difficult, it only avoids picking and choosing. Just do not love or hate, and it is clearly evident.",
          suzuki: "The Great Way is not difficult, for those who have no preferences. When love and hate are both absent, everything becomes clear and undisguised."
        }
      },
      {
        id: 'platform_1',
        label: 'Platform Sutra: Huineng Verse (菩提本無樹，明鏡亦非臺。)',
        zh: '菩提本無樹，明鏡亦非臺。本來無一物，何處惹塵埃。',
        pinyin: 'Pútí běn wú shù, míngjìng yì fēi tái. Běnlái wú yī wù, héchù rě chén\'āi.',
        translations: {
          red_pine: "Bodhi originally has no tree, the mirror has no stand. From the beginning not a thing exists; where could dust ever alight?",
          cleary: "Bodhi fundamentally has no tree, nor is the clear mirror a stand. Originally there is not a single thing; where could dust gather?",
          yampolsky: "Bodhi fundamentally has no tree, the bright mirror also has no stand. Fundamentally there is not a single thing: where could any dust alight?"
        }
      }
    ];

    elements.studioSelectText.innerHTML = studioPassages.map(opt => `
      <option value="${opt.id}">${opt.label}</option>
    `).join('');

    function updateRefTranslationDisplay(selectedPassage) {
      if (!selectedPassage || !elements.studioRefText) return;
      const refKey = elements.studioRefTranslatorSelect ? elements.studioRefTranslatorSelect.value : 'red_pine';
      const text = (selectedPassage.translations && selectedPassage.translations[refKey]) ||
                   (selectedPassage.translations && Object.values(selectedPassage.translations)[0]) ||
                   'No reference available for this translator.';
      elements.studioRefText.innerHTML = `<strong>${formatTranslatorName(refKey)}:</strong> "${text}"`;
    }

    function detectTermsInPassage(zhText) {
      if (!elements.studioDetectedTerms || !state.data.glossary) return;
      const termsFound = state.data.glossary.filter(item => zhText.includes(item.term));
      if (termsFound.length === 0) {
        elements.studioDetectedTerms.innerHTML = '';
        return;
      }
      elements.studioDetectedTerms.innerHTML = `
        <div style="width: 100%; font-size: 0.75rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 0.2rem;">Detected Terms in Lexicon:</div>
        ${termsFound.map(t => `
          <span class="meta-chip" style="cursor: pointer; background: var(--accent-gold-light); border-color: var(--accent-gold); color: var(--accent-gold);" title="${t.definition}">
            📖 ${t.term} (${t.literal})
          </span>
        `).join('')}
      `;
    }

    function loadSelectedPassage(id) {
      const selected = studioPassages.find(o => o.id === id);
      if (selected) {
        elements.studioSourceZh.innerHTML = annotateClassicalChinese(selected.zh);
        elements.studioSourcePinyin.textContent = selected.pinyin;
        if (elements.studioCharCount) {
          elements.studioCharCount.textContent = `${selected.zh.length} classical characters`;
        }

        updateRefTranslationDisplay(selected);
        detectTermsInPassage(selected.zh);

        const saved = state.personalTranslations[id];
        if (saved) {
          elements.studioUserTranslation.value = saved.translation || '';
          elements.studioUserNotes.value = saved.notes || '';
          if (elements.studioStatus) elements.studioStatus.textContent = `Loaded saved draft (${saved.updatedAt})`;
        } else {
          elements.studioUserTranslation.value = '';
          elements.studioUserNotes.value = '';
          if (elements.studioStatus) elements.studioStatus.textContent = 'Ready for drafting.';
        }
      }
    }

    elements.studioSelectText.addEventListener('change', (e) => {
      loadSelectedPassage(e.target.value);
    });

    if (elements.studioRefTranslatorSelect) {
      elements.studioRefTranslatorSelect.addEventListener('change', () => {
        const id = elements.studioSelectText.value;
        const selected = studioPassages.find(o => o.id === id);
        updateRefTranslationDisplay(selected);
      });
    }

    // Save translation
    if (elements.studioSaveBtn) {
      elements.studioSaveBtn.addEventListener('click', () => {
        const id = elements.studioSelectText.value;
        const selected = studioPassages.find(o => o.id === id);
        state.personalTranslations[id] = {
          passageId: id,
          title: selected ? selected.label : id,
          source_zh: selected ? selected.zh : '',
          source_pinyin: selected ? selected.pinyin : '',
          translation: elements.studioUserTranslation.value,
          notes: elements.studioUserNotes.value,
          updatedAt: new Date().toLocaleString()
        };
        localStorage.setItem('translatechan_user_translations', JSON.stringify(state.personalTranslations));
        if (elements.studioStatus) {
          elements.studioStatus.textContent = '✅ Saved translation to local repository storage!';
          setTimeout(() => {
            elements.studioStatus.textContent = `Last modified: ${new Date().toLocaleString()}`;
          }, 2500);
        }
        renderSavedList();
      });
    }

    // Export JSON
    if (elements.studioExportJsonBtn) {
      elements.studioExportJsonBtn.addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.personalTranslations, null, 2));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute("href", dataStr);
        dlAnchor.setAttribute("download", "translatechan_personal_corpus.json");
        dlAnchor.click();
      });
    }

    // Export Markdown
    if (elements.studioExportMdBtn) {
      elements.studioExportMdBtn.addEventListener('click', () => {
        let md = `# TranslateChan: Personal Translation & Scholarly Notebook\n\nGenerated: ${new Date().toISOString()}\nProject: https://github.com/56eli/translatechan\n\n---\n\n`;
        Object.keys(state.personalTranslations).forEach(k => {
          const item = state.personalTranslations[k];
          md += `## ${item.title}\n\n`;
          md += `### Classical Chinese Source\n> ${item.source_zh}\n\n`;
          if (item.source_pinyin) md += `*Pinyin*: \`${item.source_pinyin}\`\n\n`;
          md += `### Personal English Translation\n> ${item.translation}\n\n`;
          md += `### Philological Commentary & Hermeneutics\n${item.notes}\n\n`;
          md += `*Last modified: ${item.updatedAt}*\n\n---\n\n`;
        });
        const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(md);
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute("href", dataStr);
        dlAnchor.setAttribute("download", "translatechan_scholarly_notebook.md");
        dlAnchor.click();
      });
    }

    // Export LaTeX
    if (elements.studioExportLatexBtn) {
      elements.studioExportLatexBtn.addEventListener('click', () => {
        let tex = `% TranslateChan Academic Paper Edition
\\documentclass[11pt,twocolumn]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{ctex}
\\usepackage{amsmath,amssymb}
\\usepackage{geometry}
\\geometry{margin=1in}

\\title{TranslateChan: Critical Bilingual Editions of Classical Chinese Chan Literature}
\\author{TranslateChan Research Scholar}
\\date{\\today}

\\begin{document}
\\maketitle

\\begin{abstract}
This document contains personal critical translations, sentence-aligned Classical Chinese source texts, and philological notes produced via the TranslateChan platform (\\texttt{56eli/translatechan}).
\\end{abstract}

\\section{Canonical Translations}
`;
        Object.keys(state.personalTranslations).forEach((k, idx) => {
          const item = state.personalTranslations[k];
          tex += `
\\subsection{${item.title.replace(/[#&_]/g, '\\$&')}}

\\noindent\\textbf{Classical Chinese Source:}
\\begin{quote}
\\large ${item.source_zh}
\\end{quote}

\\noindent\\textbf{Personal Translation:}
\\begin{quote}
${item.translation.replace(/[#&_]/g, '\\$&')}
\\end{quote}

\\noindent\\textbf{Philological Apparatus:}
\\begin{enumerate}
\\item ${item.notes.replace(/[#&_]/g, '\\$&')}
\\end{enumerate}
`;
        });
        tex += `\n\\end{document}\n`;

        const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(tex);
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute("href", dataStr);
        dlAnchor.setAttribute("download", "translatechan_edition.tex");
        dlAnchor.click();
      });
    }

    // Clear All
    if (elements.studioClearAllBtn) {
      elements.studioClearAllBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to clear all saved personal translation drafts? This cannot be undone.")) {
          state.personalTranslations = {};
          localStorage.removeItem('translatechan_user_translations');
          renderSavedList();
          loadSelectedPassage(elements.studioSelectText.value);
        }
      });
    }

    function renderSavedList() {
      if (!elements.studioSavedList) return;
      const keys = Object.keys(state.personalTranslations);
      if (keys.length === 0) {
        elements.studioSavedList.innerHTML = '<p style="font-size: 0.85rem; color: var(--text-muted);">No saved personal translations yet.</p>';
        return;
      }
      elements.studioSavedList.innerHTML = keys.map(k => {
        const item = state.personalTranslations[k];
        return `
          <div style="background: var(--bg-primary); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); margin-bottom: 0.5rem;">
            <div style="font-weight: 600; font-size: 0.85rem; color: var(--accent-gold);">${item.title}</div>
            <div style="font-size: 0.82rem; margin: 0.25rem 0; color: var(--text-primary);">"${item.translation}"</div>
            <div style="font-size: 0.7rem; color: var(--text-muted);">Saved: ${item.updatedAt}</div>
          </div>
        `;
      }).join('');
    }

    loadSelectedPassage(studioPassages[0].id);
    renderSavedList();
  }

  // Global Search Handler
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

    let matchCount = 0;
    let resultsHtml = `<div class="text-header"><div class="text-title-zh">🔍 Search Results for: "${q}"</div></div>`;

    Object.keys(state.data.corpus).forEach(corpKey => {
      const doc = state.data.corpus[corpKey];

      if (doc.cases) {
        doc.cases.forEach(c => {
          let matched = false;
          let preview = '';

          if (c.title_zh.includes(q) || c.title_en.toLowerCase().includes(q)) {
            matched = true;
            preview = c.title_zh + ' / ' + c.title_en;
          }
          if (c.dialogue) {
            c.dialogue.forEach(d => {
              if (d.zh.includes(q) || d.pinyin.toLowerCase().includes(q) || JSON.stringify(d.translations).toLowerCase().includes(q)) {
                matched = true;
                preview = d.zh;
              }
            });
          }
          if (matched) {
            matchCount++;
            resultsHtml += `
              <div class="case-card" style="margin-bottom: 1rem;">
                <div class="case-header">
                  <span class="case-num-title">${doc.title_zh} - Case ${c.case_num}: ${c.title_zh}</span>
                </div>
                <div class="classical-zh">${annotateClassicalChinese(preview)}</div>
                <div style="margin-top: 0.5rem;">
                  <button class="btn-pill active" onclick="window.TranslateChan.openCase('${corpKey}', ${c.case_num})">View Case in Reader</button>
                </div>
              </div>
            `;
          }
        });
      }
    });

    if (matchCount === 0) {
      resultsHtml += `<div class="case-card"><p>No matches found for "${q}". Try searching for Classical Chinese (e.g. 狗子, 無, 佛性, 平常心) or English terms (e.g. Red Pine, Cleary, Buddha, mind, fox).</p></div>`;
    }

    elements.readerContent.innerHTML = resultsHtml;
  }

  // Global helper for opening case
  window.TranslateChan = {
    openCase: function(corpusKey, caseNum) {
      state.currentCorpusKey = corpusKey;
      state.searchQuery = '';
      if (elements.globalSearch) elements.globalSearch.value = '';
      renderCorpusList();
      renderReader();
      setTimeout(() => {
        const el = document.getElementById(`case-${caseNum}`);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
