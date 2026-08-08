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
    studioUserTranslation: document.getElementById('studio-user-translation'),
    studioUserNotes: document.getElementById('studio-user-notes'),
    studioSaveBtn: document.getElementById('studio-save-btn'),
    studioExportJsonBtn: document.getElementById('studio-export-json-btn'),
    studioExportMdBtn: document.getElementById('studio-export-md-btn'),
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
    // Theme toggle
    if (elements.themeToggle) {
      elements.themeToggle.addEventListener('click', () => {
        applyTheme(state.theme === 'dark' ? 'light' : 'dark');
      });
    }

    // Navigation Tabs
    elements.navTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const view = tab.getAttribute('data-view');
        switchView(view);
      });
    });

    // Reader Mode Buttons
    elements.readerModeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        elements.readerModeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.readerMode = btn.getAttribute('data-reader-mode');
        renderReader();
      });
    });

    // Global Search
    if (elements.globalSearch) {
      elements.globalSearch.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.trim().toLowerCase();
        handleGlobalSearch();
      });
    }

    // Lineage Filter
    if (elements.lineageFilter) {
      elements.lineageFilter.addEventListener('change', (e) => {
        state.selectedMasterSchool = e.target.value;
        renderLineage();
      });
    }

    // Lexicon Filter
    if (elements.lexiconFilter) {
      elements.lexiconFilter.addEventListener('change', (e) => {
        state.selectedLexiconCategory = e.target.value;
        renderLexicon();
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
    // Sort terms by length descending to match compound phrases first
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
      { key: 'platform_sutra', title: 'Platform Sutra (六祖壇經)', cbeta: 'T2007' }
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

    // Render Cases (e.g. Wumenguan / Biyanlu)
    if (doc.cases && doc.cases.length > 0) {
      doc.cases.forEach(caseItem => {
        html += renderCaseItem(caseItem);
      });
    }

    // Render Sections (e.g. Linji Yulu, Huangbo)
    if (doc.sections && doc.sections.length > 0) {
      doc.sections.forEach(sec => {
        html += renderSectionItem(sec);
      });
    }

    // Render Dialogues (e.g. Zhaozhou Yulu)
    if (doc.dialogues && doc.dialogues.length > 0) {
      doc.dialogues.forEach(dia => {
        html += renderDialogueItem(dia);
      });
    }

    // Render Stanzas (e.g. Xinxin Ming, Baojing Sanmei)
    if (doc.stanzas && doc.stanzas.length > 0) {
      doc.stanzas.forEach(st => {
        html += renderStanzaItem(st);
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

    // If bilingual mode, prioritize Cleary, Sasaki, or Suzuki
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

    elements.lineageTarget.innerHTML = masters.map(m => `
      <div class="master-card">
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

    // Populate selectable passages
    const options = [
      { id: 'wumen_1', label: 'Wumenguan Case 1: Zhaozhou Dog (狗子還有佛性也無？州云：無。)', zh: '趙州和尚因僧問：「狗子還有佛性也無？」州云：「無。」', pinyin: 'Zhàozhōu héshang yīn sēng wèn: "Gǒuzi hái yǒu fóxìng yě wú?" Zhōu yún: "Wú."' },
      { id: 'wumen_2', label: 'Wumenguan Case 2: Baizhang Fox (大修行底人還落因果也無？不昧因果。)', zh: '大修行底人還落因果也無？師曰：不昧因果。', pinyin: 'Dà xiūxíng dǐ rén hái luò yīnguǒ yě wú? Shī yuē: Bù mèi yīnguǒ.' },
      { id: 'wumen_19', label: 'Wumenguan Case 19: Ordinary Mind (平常心是道。擬向即乖。)', zh: '平常心是道。擬向即乖。道不屬知，不屬不知。', pinyin: 'Píngcháng xīn shì dào. Nǐ xiàng jí guāi. Dào bù shǔ zhī, bù shǔ bù zhī.' },
      { id: 'linji_1', label: 'Linji Yulu: True Person of No Rank (赤肉團上有一無位真人)', zh: '赤肉團上有一無位真人，常從諸人面門出入。未證據者看看！', pinyin: 'Chì ròu tuán shàng yǒu yī wú wèi zhēn rén, cháng cóng zhū rén miàn mén chū rù. Wèi zhèng jù zhě kàn kàn!' },
      { id: 'huangbo_1', label: 'Huangbo Chuanxin: One Mind (諸佛與一切眾生唯是一心)', zh: '諸佛與一切眾生，唯是一心，更無別法。此心無始已來，不曾生不曾滅。', pinyin: 'Zhūfó yǔ yīqiè zhòngshēng, wéi shì yī xīn, gèng wú bié fǎ. Cǐ xīn wú shǐ yǐ lái, bù céng shēng bù céng miè.' },
      { id: 'xinxin_1', label: 'Xinxin Ming: Line 1 (至道無難，唯嫌揀擇。但莫憎愛，洞然明白。)', zh: '至道無難，唯嫌揀擇。但莫憎愛，洞然明白。', pinyin: 'Zhì dào wú nán, wéi xián jiǎnzé. Dàn mò zēng ài, dòng rán míng bái.' },
      { id: 'platform_1', label: 'Platform Sutra: Huineng Verse (菩提本無樹，明鏡亦非臺。)', zh: '菩提本無樹，明鏡亦非臺。本來無一物，何處惹塵埃。', pinyin: 'Pútí běn wú shù, míngjìng yì fēi tái. Běnlái wú yī wù, héchù rě chén\'āi.' }
    ];

    elements.studioSelectText.innerHTML = options.map(opt => `
      <option value="${opt.id}">${opt.label}</option>
    `).join('');

    function loadSelectedPassage(id) {
      const selected = options.find(o => o.id === id);
      if (selected) {
        elements.studioSourceZh.innerHTML = annotateClassicalChinese(selected.zh);
        elements.studioSourcePinyin.textContent = selected.pinyin;
        const saved = state.personalTranslations[id];
        if (saved) {
          elements.studioUserTranslation.value = saved.translation || '';
          elements.studioUserNotes.value = saved.notes || '';
          if (elements.studioStatus) elements.studioStatus.textContent = `Loaded saved draft (last modified: ${saved.updatedAt})`;
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

    // Save translation
    if (elements.studioSaveBtn) {
      elements.studioSaveBtn.addEventListener('click', () => {
        const id = elements.studioSelectText.value;
        const selected = options.find(o => o.id === id);
        state.personalTranslations[id] = {
          passageId: id,
          title: selected ? selected.label : id,
          source_zh: selected ? selected.zh : '',
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
        let md = `# TranslateChan: Personal Translation Notebook\n\nExported on: ${new Date().toISOString()}\n\n---\n\n`;
        Object.keys(state.personalTranslations).forEach(k => {
          const item = state.personalTranslations[k];
          md += `## ${item.title}\n\n`;
          md += `**Classical Chinese**: \n> ${item.source_zh}\n\n`;
          md += `**Translation**: \n> ${item.translation}\n\n`;
          md += `**Notes & Hermeneutics**: \n${item.notes}\n\n`;
          md += `*Last updated: ${item.updatedAt}*\n\n---\n\n`;
        });
        const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(md);
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute("href", dataStr);
        dlAnchor.setAttribute("download", "translatechan_translations.md");
        dlAnchor.click();
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
            <div style="font-size: 0.82rem; margin: 0.25rem 0;">"${item.translation}"</div>
            <div style="font-size: 0.7rem; color: var(--text-muted);">Saved: ${item.updatedAt}</div>
          </div>
        `;
      }).join('');
    }

    loadSelectedPassage(options[0].id);
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

    // Search across all texts in corpus
    Object.keys(state.data.corpus).forEach(corpKey => {
      const doc = state.data.corpus[corpKey];

      // Check cases
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
      resultsHtml += `<div class="case-card"><p>No matches found for "${q}". Try searching for Classical Chinese (e.g. 狗子, 無, 佛性, 平常心) or English terms (e.g. Cleary, Buddha, mind, fox).</p></div>`;
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
