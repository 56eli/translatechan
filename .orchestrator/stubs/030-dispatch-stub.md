# DISPATCH STUB — 030 Redo 3-7 Truly Drastic — Keep 1 and 2, Completely Redo 3-7

**Hand this to dispatch agent to start work immediately. Base main ffa139a, target feature/phase5-redo-3-7-truly-drastic**

## Branch Setup (copy-paste)

```bash
git fetch origin main:main
git checkout main
git pull --ff-only
git checkout -b feature/phase5-redo-3-7-truly-drastic
ls -lh app_data.js docs/app_data.js
python3 scripts/build_data_bundle.py
ls -lh app_data.js
# must be 1693251 B byte-identical, deterministic
```

## Files To Edit

- `app.css` + `docs/app.css` (mirror identical)
- `app.js` + `docs/app.js` (mirror identical)
- `docs/index.html` only if needed for hamburger button (keep CSP untouched)
- NEVER edit `data/` corpus, `app_data.js` manually, `data/project_metrics.json` manually

## Keep Untouched (MANDATORY)

- Layout 1: NO `[data-design="1"]` rule at all — :root base ideal colors kept
- Layout 2: Accordion Reader byte-identical 2,336 chars — keep both CSS and JS byte-identical to main ffa139a
  - CSS: `::root[data-design="2"] .acc-sec` 31 lines
  - JS: `function enhanceAccordionReader()` 2,336 chars
- :root primitives: --paper #f4efe5, --panel #fbf8f1, --line #d8cbb8, --ink #2c2523, --gold #8b622b, --green #3d6e58, --blue #325d79, --red #9e3335, --wood #211814, --wood-ink #f3ead9, --brass #c9a66b — keep exactly
- 0 style= attributes, 4 setProperty only: --shell-height, --zh-font-size, --pop-shift x2
- CSP: style-src 'self' https://fonts.googleapis.com, no unsafe-inline
- app_data.js 1,693,251 B byte-identical rebuild

## Completely Redo 3-7 — CSS Skeleton (replace existing 3-7 blocks, each 300-800 lines)

```css
/* Layouts 3-7 TRULY DRASTIC — redo completely per owner 2026-09-14
   Each MUST override shell+nav+body grid, visually distinct at first glance
   Keep ideal colors of 1, only structure varies */

/* --- Layout 3 · Focus Mode — centered 38rem, no sidebar, whitespace 3x --- */
:root[data-design="3"] .site-shell { min-height: 2.8rem; border-bottom: none; }
:root[data-design="3"] .shell-frame { padding: 0.5rem 1rem; }
:root[data-design="3"] .shell-lintel { min-height: 2.8rem; }
:root[data-design="3"] .brand-mark { display: none; }
:root[data-design="3"] .room-nav { display: none !important; }
:root[data-design="3"] .room-filter-rail { display: none !important; }
:root[data-design="3"] .room-heading { display: none; }
:root[data-design="3"] .hero, :root[data-design="3"] .hero-beam { display: none; }
:root[data-design="3"] .room-body { max-width: 38rem; margin: 0 auto; padding: 3rem 1rem 4rem; }
:root[data-design="3"] #reader-content-target { max-width: 38rem; margin: 0 auto; line-height: 1.9; font-size: 1.15rem; }
:root[data-design="3"] #reader-content-target .classical-zh,
:root[data-design="3"] #reader-content-target .pinyin-line,
:root[data-design="3"] #reader-content-target .provenance-line,
:root[data-design="3"] #reader-content-target .ledger-drawer { display: none; }
:root[data-design="3"] .case-card { margin: 0 0 3rem; border: none; border-bottom: 1px solid var(--line-soft); padding-bottom: 2rem; background: transparent; box-shadow: none; }
:root[data-design="3"] .matrix-proof-sheet,
:root[data-design="3"] .lineage-master-row,
:root[data-design="3"] .catalogue-row,
:root[data-design="3"] .lexicon-entry { max-width: 38rem; margin: 0 auto 2.5rem; border: none; border-bottom: 1px solid var(--line-soft); background: transparent; }
:root[data-design="3"] .rm-focus-toggle { display: inline-flex; margin-left: 0.5rem; font-size: 0.75rem; border: 1px solid var(--line); border-radius: 999px; padding: 0.15rem 0.5rem; background: var(--panel); color: var(--ink-soft); cursor: pointer; }
:root[data-design="3"] .rm-focus-drawer[hidden] { display: none; }
:root[data-design="3"] .rm-focus-drawer { margin-top: 1rem; padding: 1rem; border: 1px solid var(--line); border-radius: var(--radius); background: var(--panel); }

/* --- Layout 4 · Timeline — horizontal scroll, cards 18-26rem scroll-snap --- */
:root[data-design="4"] .room-body { display: flex; flex-direction: row; overflow-x: auto; overflow-y: hidden; gap: 1.5rem; padding: 2rem 1rem; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; position: relative; }
:root[data-design="4"] .room-body::before { content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--line), var(--gold)); z-index: 0; }
:root[data-design="4"] .room-heading { position: sticky; left: 0; background: var(--paper); z-index: 2; padding-right: 1rem; flex-shrink: 0; }
:root[data-design="4"] .case-card { width: 26rem; flex-shrink: 0; scroll-snap-align: start; position: relative; z-index: 1; background: var(--panel); }
:root[data-design="4"] .matrix-proof-sheet { width: 24rem; flex-shrink: 0; scroll-snap-align: start; position: relative; z-index: 1; }
:root[data-design="4"] .lineage-band { width: 22rem; flex-shrink: 0; scroll-snap-align: start; position: relative; z-index: 1; background: var(--panel); border: 1px solid var(--line); border-radius: var(--radius); padding: 1rem; }
:root[data-design="4"] .catalogue-row { width: 20rem; flex-shrink: 0; scroll-snap-align: start; position: relative; z-index: 1; background: var(--panel); border: 1px solid var(--line); border-radius: var(--radius); padding: 1rem; }
:root[data-design="4"] .lexicon-entry { width: 18rem; flex-shrink: 0; scroll-snap-align: start; position: relative; z-index: 1; background: var(--panel); border: 1px solid var(--line); border-radius: var(--radius); padding: 1rem; }

/* --- Layout 5 · Graph+Reader Split — 32% dots sticky + 68% reader --- */
:root[data-design="5"] .room-body { display: grid; grid-template-columns: 32% 68%; gap: 0; min-height: calc(100vh - var(--shell-height)); padding: 0; }
:root[data-design="5"] .rm-graph-pane { background: var(--sunken); border-right: 1px solid var(--line); position: sticky; top: var(--shell-height); height: calc(100vh - var(--shell-height)); overflow-y: auto; padding: 1rem; }
:root[data-design="5"] .rm-reader-pane { padding: 2rem; overflow-y: auto; }
:root[data-design="5"] .rm-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--line); display: inline-block; margin: 0.35rem; cursor: pointer; border: 2px solid transparent; }
:root[data-design="5"] .rm-dot.active { background: var(--gold); border-color: var(--wood); }
:root[data-design="5"] .rm-dot:hover { background: var(--gold-soft); border-color: var(--gold); }

/* --- Layout 6 · Hamburger — 3rem header only title+numbers, nav behind drawer --- */
:root[data-design="6"] .site-shell { min-height: 3rem; }
:root[data-design="6"] .shell-frame { padding: 0.5rem 1rem; }
:root[data-design="6"] .shell-lintel { min-height: 3rem; }
:root[data-design="6"] .brand-mark { display: none; }
:root[data-design="6"] .room-nav { display: none; }
:root[data-design="6"] .room-filter-rail { display: none; }
:root[data-design="6"] .hamburger-btn { display: inline-flex; width: 2rem; height: 2rem; flex-direction: column; justify-content: center; gap: 4px; background: transparent; border: 1px solid var(--brass); border-radius: var(--radius); cursor: pointer; }
:root[data-design="6"] .hamburger-btn span { display: block; height: 2px; background: var(--brass); }
:root[data-design="6"].nav-open .room-nav { display: block; position: fixed; top: 3rem; right: 0; width: 18rem; height: calc(100vh - 3rem); background: var(--panel); border-left: 1px solid var(--line); z-index: 200; overflow-y: auto; padding: 1rem; box-shadow: var(--shadow); }
:root[data-design="6"].nav-open .room-filter-rail { display: block; position: fixed; top: 3rem; right: 18rem; width: 16rem; height: calc(100vh - 3rem); background: var(--sunken); border-left: 1px solid var(--line); z-index: 199; overflow-y: auto; padding: 1rem; }
:root[data-design="6"] .room-body { max-width: 42rem; margin: 0 auto; padding: 2rem 1rem; }
:root[data-design="6"] .room-heading { font-size: 1.2rem; margin: 3rem 0 1rem; }

/* --- Layout 7 · Dossier — info-first inverted, translation collapsed --- */
:root[data-design="7"] .room-body { display: flex; flex-direction: column; }
:root[data-design="7"] .rm-dossier-top { order: -1; background: var(--panel); border: 1px solid var(--line); border-radius: var(--radius); padding: 1.5rem; margin-bottom: 1.5rem; border-top: 3px solid var(--gold); }
:root[data-design="7"] .rm-dossier-title { font-family: var(--font-display); font-size: 1.1rem; margin-bottom: 0.8rem; color: var(--gold-strong); }
:root[data-design="7"] .rm-dossier-row { display: grid; grid-template-columns: 8rem 1fr; gap: 0.5rem; margin-bottom: 0.5rem; font-size: 0.9rem; }
:root[data-design="7"] .rm-dossier-label { color: var(--ink-soft); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; }
:root[data-design="7"] .translation-grid { display: none; }
:root[data-design="7"] .translation-grid.expanded { display: block; }
:root[data-design="7"] .rm-read-btn { display: inline-flex; margin-top: 1rem; padding: 0.5rem 1rem; background: var(--wood); color: var(--wood-ink); border: 1px solid var(--brass); border-radius: var(--radius); cursor: pointer; font-family: var(--font-ui); }
```

## JS Skeleton — Keep 1-2, Redo 3-7

```js
// Keep 1: no override
// Keep 2: enhanceAccordionReader() byte-identical 2,336 chars — DO NOT EDIT

function enhanceRoomLayout(room) {
  const v = document.documentElement.getAttribute('data-design') || '1';
  if (v === '1' || v === '2') return;

  if (v === '3') { // Focus Mode
    document.querySelectorAll('.case-card, .matrix-proof-sheet, .lineage-master-row, .catalogue-row, .lexicon-entry').forEach(unit => {
      if (unit.querySelector('.rm-focus-toggle')) return;
      const zh = unit.querySelector('.classical-zh, .matrix-sentence-zh, .lineage-master-record, .catalogue-detail, .lexicon-entry-def');
      if (!zh) return;
      const btn = document.createElement('button');
      btn.className = 'rm-focus-toggle';
      btn.textContent = '[i]';
      btn.setAttribute('aria-label', 'Show context');
      const drawer = document.createElement('div');
      drawer.className = 'rm-focus-drawer';
      drawer.hidden = true;
      drawer.innerHTML = '<div class="rm-dossier-title">Context — where from, who related, background</div>' + (zh.outerHTML || '');
      btn.addEventListener('click', () => { drawer.hidden = !drawer.hidden; });
      unit.appendChild(btn);
      unit.appendChild(drawer);
    });
    return;
  }

  if (v === '4') { // Timeline
    const body = document.querySelector('.room-body');
    if (body && !body.querySelector('.rm-timeline-hint')) {
      const hint = document.createElement('div');
      hint.className = 'rm-timeline-hint';
      hint.textContent = '← Scroll horizontally → Timeline — where this work came from chronologically';
      hint.style.cssText = 'position:sticky;left:0;background:var(--panel);border:1px solid var(--line);padding:0.4rem 0.8rem;border-radius:999px;font-size:0.8rem;z-index:3;white-space:nowrap;';
      body.prepend(hint);
    }
    return;
  }

  if (v === '5') { // Graph+Reader Split
    const body = document.querySelector('.room-body');
    if (!body || body.querySelector('.rm-graph-pane')) return;
    const units = Array.from(body.querySelectorAll('.case-card, .matrix-proof-sheet, .lineage-master-row, .catalogue-row, .lexicon-entry'));
    if (units.length === 0) return;
    const graphPane = document.createElement('div');
    graphPane.className = 'rm-graph-pane';
    graphPane.innerHTML = '<div class="rm-dossier-title">Navigation — dots</div><div class="rm-dots"></div><div class="rm-dossier-row"><span class="rm-dossier-label">Where from</span><span>Chronological / lineage order</span></div>';
    const readerPane = document.createElement('div');
    readerPane.className = 'rm-reader-pane';
    const dotsContainer = graphPane.querySelector('.rm-dots');
    units.forEach((unit, i) => {
      const dot = document.createElement('span');
      dot.className = 'rm-dot' + (i===0?' active':'');
      dot.title = unit.querySelector('h1,h2,h3')?.textContent?.slice(0,30) || `Unit ${i+1}`;
      dot.addEventListener('click', () => {
        graphPane.querySelectorAll('.rm-dot').forEach(d=>d.classList.remove('active'));
        dot.classList.add('active');
        unit.scrollIntoView({behavior:'smooth', block:'start'});
      });
      dotsContainer.appendChild(dot);
      readerPane.appendChild(unit);
    });
    body.innerHTML = '';
    body.appendChild(graphPane);
    body.appendChild(readerPane);
    return;
  }

  if (v === '6') { // Hamburger
    const shell = document.querySelector('.site-shell');
    if (shell && !shell.querySelector('.hamburger-btn')) {
      const btn = document.createElement('button');
      btn.className = 'hamburger-btn';
      btn.setAttribute('aria-label','Open navigation');
      btn.innerHTML = '<span></span><span></span><span></span>';
      btn.addEventListener('click', () => {
        document.documentElement.classList.toggle('nav-open');
      });
      document.querySelector('.shell-lintel')?.appendChild(btn);
    }
    return;
  }

  if (v === '7') { // Dossier
    document.querySelectorAll('.case-card, .matrix-proof-sheet, .lineage-master-row, .catalogue-row, .lexicon-entry').forEach(unit => {
      if (unit.querySelector('.rm-dossier-top')) return;
      const top = document.createElement('div');
      top.className = 'rm-dossier-top';
      const whereFrom = unit.querySelector('.provenance-line, .matrix-source-location, .lineage-master-record, .catalogue-locator, .lexicon-occurrences')?.textContent || 'Origin: historical Chan lineage';
      top.innerHTML = `
        <div class="rm-dossier-title">Where this came from — plain language dossier</div>
        <div class="rm-dossier-row"><span class="rm-dossier-label">Where from</span><span>${whereFrom.slice(0,200)}</span></div>
        <div class="rm-dossier-row"><span class="rm-dossier-label">Who related</span><span>Related teachers and works — click to explore</span></div>
        <div class="rm-dossier-row"><span class="rm-dossier-label">Background</span><span>Historical and doctrinal context — piece meal</span></div>
        <button class="rm-read-btn" type="button">Read translation ↓</button>
      `;
      const trans = unit.querySelector('.translation-grid, .matrix-sentence-zh, .lineage-master-quote, .catalogue-detail, .lexicon-entry-def');
      if (trans) {
        trans.classList.add('translation-grid');
        const btn = top.querySelector('.rm-read-btn');
        btn.addEventListener('click', () => {
          trans.classList.toggle('expanded');
          btn.textContent = trans.classList.contains('expanded') ? 'Hide translation ↑' : 'Read translation ↓';
        });
      }
      unit.prepend(top);
    });
    return;
  }
}
```

## Design Switcher

```js
const DESIGN_VARIANTS = [
  {key:'1', label:'1 Classic'},
  {key:'2', label:'2 Accordion Reader (kept)'},
  {key:'3', label:'3 Focus 38rem'},
  {key:'4', label:'4 Timeline →'},
  {key:'5', label:'5 Graph+Reader'},
  {key:'6', label:'6 Hamburger'},
  {key:'7', label:'7 Dossier'},
];
```

## Gates

- MUST PASS: py_compile, validate_data corpus35 slots1252 verified177 matrix21 locators148/148 flagged630, build deterministic app_data.js 1693251 B unchanged, preservation 0 unauthorized, review 138
- ALLOWED TO BREAK: smoke_test, diff -rq, git diff app_data.js docs
- KEPT ON: test_website_ruling law + common qualities
- Bundle <30MB, 0 style=, 4 setProperty, CSP untouched

## LAW Verbatim

"In no way is the website beautiful. In no way is it done. Immediately after chinese integrity, it is of utmost importance to work on the website. YOU AS ORCHESTRATOR AND ALL DISPATCH AGENTS ARE NOT CAPABLE TO JUDGE THE WEBSITE. You are 100% relying on my feedback, all you can do is provide examples, suggestions and demonstration and ask 'does this look good?', 'Is this the right direction?', 'how good is it on a scale from 1-10 where we aim for at least 8?'. This is definitive."

COMMON_QUALITIES:
"All directions need to have a light mental load. That means the minimum amount of information is presented to the viewer, and everything extra he wants to see he can expand, or hover over, or toggle. It should be english first and it can't be a dense layout. It needs to feel comfortable to read and easy to navigate. Explanations and description need to be piece meal. Everything should be explained in plain language. There should be some form of info section for every work and teacher that put into context where they came from, what or who is related, what the background context is."
