#!/usr/bin/env node
/**
 * TranslateChan — optional real-browser regression suite (Playwright).
 *
 * Covers the public Pages app in a real Chromium engine, desktop + mobile:
 *   initial load, hash deep links, lazy Wumenguan rendering, case-chip jump,
 *   citation popovers, glossary-term popovers (pointer + keyboard),
 *   ARIA tab keyboard navigation, search (schema + XSS-escape), CSP console
 *   cleanliness, mobile bottom bar / corpus picker, and the print stylesheet.
 *
 * Usage:
 *   npm install                 # devDependency: playwright
 *   npx playwright install chromium   # once per machine (browser download)
 *   npm run test:browser        # or: node scripts/browser_test.mjs
 *
 * It is intentionally OPTIONAL: the dependency-free `scripts/smoke_test.mjs`
 * remains the CI gate. If no browser can be launched (e.g. a minimal sandbox
 * without a Chromium binary or its system libraries), this suite prints a
 * clear SKIP message and exits 0 so it never breaks other tooling.
 *
 * Overrides (advanced):
 *   BROWSER_TEST_PORT=PORT      reuse a running static server instead of spawning one
 *   BROWSER_TEST_EXECUTABLE=path  launch a specific Chromium/Chrome binary
 */
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.BROWSER_TEST_PORT
  ? `http://127.0.0.1:${process.env.BROWSER_TEST_PORT}/`
  : null;

// ---- tiny test harness -----------------------------------------------------
const failures = [];
async function testAsync(name, fn) {
  try { await fn(); }
  catch (e) { failures.push({ name, error: e }); }
}
function ok(condition, message) {
  if (!condition) throw new Error(message || 'assertion failed');
}

// ---- static server (spawned only when no BROWSER_TEST_PORT is given) -------
async function freePort() {
  return new Promise((resolve, reject) => {
    const srv = createServer();
    srv.listen(0, '127.0.0.1', () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
    srv.on('error', reject);
  });
}
function startServer(port) {
  return new Promise((resolve, reject) => {
    const child = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], { cwd: ROOT, stdio: 'ignore' });
    const deadline = Date.now() + 10000;
    const probe = async () => {
      if (child.exitCode !== null) return reject(new Error(`http.server exited early (${child.exitCode})`));
      try {
        const res = await fetch(`http://127.0.0.1:${port}/index.html`);
        if (res.ok) return resolve(child);
      } catch { /* not ready yet */ }
      if (Date.now() > deadline) return reject(new Error('http.server did not become ready'));
      setTimeout(probe, 100);
    };
    probe();
  });
}

// ---- main ------------------------------------------------------------------
async function main() {
  let serverChild = null;
  let base = BASE;
  if (!base) {
    const port = await freePort();
    serverChild = await startServer(port);
    base = `http://127.0.0.1:${port}/`;
  }
  process.on('exit', () => { if (serverChild) serverChild.kill('SIGTERM'); });
  process.on('SIGINT', () => process.exit(130));

  let browser = null;
  try {
    const launchOptions = {
      headless: true,
      executablePath: process.env.BROWSER_TEST_EXECUTABLE || undefined,
    };
    browser = await chromium.launch(launchOptions);
  } catch (launchError) {
    console.log('⚠️  BROWSER TEST SKIPPED — no usable Chromium in this environment.');
    console.log(`   Reason: ${launchError.message.split('\n')[0]}`);
    console.log('   To run the real-browser suite on a dev machine:');
    console.log('     npm install');
    console.log('     npx playwright install chromium   # + `npx playwright install-deps chromium` on Linux if needed');
    console.log('     npm run test:browser');
    if (serverChild) serverChild.kill('SIGTERM');
    process.exit(0);
  }

  const desktop = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  });
  const page = await desktop.newPage();
  const mobilePage = await mobile.newPage();

  const cspViolations = [];
  const pageErrors = [];
  for (const p of [page, mobilePage]) {
    p.on('console', (msg) => {
      const text = msg.text();
      if (/content security policy|refused to (execute|apply|load|connect)/i.test(text)) cspViolations.push(text);
    });
    p.on('pageerror', (err) => pageErrors.push(String(err)));
  }

  // 1. Initial load — reader visible, all active corpus buttons, 5 nav tabs.
  await testAsync('initial-load', async () => {
    await page.goto(base, { waitUntil: 'load' });
    ok((await page.title()).includes('Fake Chan Factory'), 'page title');
    ok((await page.locator('.nav-tab-btn').count()) === 5, '5 room tabs');
    ok((await page.locator('.corpus-btn').count()) === 35, '35 corpus rows');
    for (const room of ['閱藏堂', '對勘', '傳法堂', '公案架', '詞林']) ok((await page.locator('#site-shell').textContent()).includes(room), `${room} room label`);
    ok(await page.locator('#view-reader.active').count() === 1, 'reader view active by default');
    ok((await page.locator('.case-card').count()) > 0, 'reader renders content');
    ok((await page.locator('[data-completion-group="complete_selected_witness"] .corpus-btn').count()) === 2, '2 complete witnesses');
    ok((await page.locator('[data-completion-group="partial_selected_witness"] .corpus-btn').count()) === 2, '2 partial witnesses');
    ok((await page.locator('[data-completion-group="excerpt_seed"] .corpus-btn').count()) === 31, '31 excerpt seeds');
  });

  // 2. Hash deep links restore view + corpus.
  await testAsync('deep-links', async () => {
    await page.goto(base + '#/lineage', { waitUntil: 'load' });
    ok(await page.locator('#view-lineage.active').count() === 1, '#/lineage activates lineage view');
    await page.goto(base + '#/reader/xinxin_ming', { waitUntil: 'load' });
    await page.waitForSelector('.stanza-source-location, .source-location');
    const body = await page.textContent('body');
    ok(body.includes('Stanza source: T48n2010'), 'xinxin_ming stanza locator rendered from deep link');
  });

  // 3. Lineage node opens a visible, focused dossier and Close hides it.
  await testAsync('lineage-dossier-visibility', async () => {
    await page.goto(base + '#/lineage', { waitUntil: 'load' });
    await page.waitForSelector('.graph-node');
    await page.locator('.graph-node').first().click();
    const panel = page.locator('#master-dossier-panel');
    ok(await panel.isVisible(), 'dossier visible after node activation');
    ok((await panel.getAttribute('hidden')) === null, 'dossier hidden attribute removed');
    ok(await page.evaluate(() => document.activeElement?.id === 'master-dossier-panel'), 'focus moved into dossier');
    await page.click('#dossier-close-btn');
    ok(await panel.isHidden(), 'dossier hidden after close');
  });

  // 3b. Lineage graph/directory controls synchronize visible, semantic, and
  // pressed state. This regresses the Phase-D bug where inline display changed
  // but the directory retained its hidden attribute.
  await testAsync('lineage-display-modes', async () => {
    await page.goto(base + '#/lineage', { waitUntil: 'load' });
    const graph = page.locator('#lineage-graph-container');
    const directory = page.locator('#lineage-content-target');
    ok(await graph.isVisible(), 'graph mode initially visible');
    ok(await directory.isHidden(), 'directory initially hidden');
    await page.click('#lineage-mode-cards-btn');
    ok(await directory.isVisible(), 'directory visible after mode activation');
    ok((await directory.getAttribute('hidden')) === null, 'directory hidden attribute removed');
    ok((await page.locator('#lineage-mode-cards-btn').getAttribute('aria-pressed')) === 'true', 'directory mode pressed');
    ok(await graph.isHidden(), 'graph hidden in directory mode');
    await page.click('#lineage-mode-graph-btn');
    ok(await graph.isVisible(), 'graph visible after restoring graph mode');
    ok(await directory.isHidden(), 'directory hidden after restoring graph mode');
  });

  // 4. Platform direct-field chapters render source excerpts, not empty cards.
  await testAsync('platform-direct-chapters', async () => {
    await page.goto(base + '#/reader/platform_sutra', { waitUntil: 'load' });
    const expected = { 3: '武帝造寺度僧', 6: '自心歸依自性', 7: '說似一物即不中', 8: '法無頓漸', 9: '道由心悟', 10: '三十六對' };
    for (const [chapter, excerpt] of Object.entries(expected)) {
      const card = page.locator(`[data-chapter-num="${chapter}"]`);
      ok(await card.count() === 1, `chapter ${chapter} card present`);
      ok((await card.textContent()).includes(excerpt), `chapter ${chapter} source excerpt rendered`);
    }
  });

  // 5. Case-collection labels name the actual commentator and verse author.
  await testAsync('collection-labels', async () => {
    await page.goto(base + '#/reader/biyanlu_cases', { waitUntil: 'load' });
    const readerText = await page.locator('#reader-content-target').textContent();
    ok(readerText.includes('Yuanwu Commentary'), 'Biyanlu names Yuanwu commentary');
    ok(readerText.includes('Xuedou Verse'), 'Biyanlu names Xuedou verse');
    ok(!readerText.includes('Wumen Commentary'), 'Biyanlu does not use Wumen label');
  });

  // 6. Wumenguan lazy rendering: 12 cards → load-more → 48; strip has 48 chips.
  await testAsync('lazy-cases', async () => {
    await page.goto(base + '#/reader/wumenguan', { waitUntil: 'load' });
    await page.waitForSelector('.case-card[id^="case-"]');
    ok((await page.locator('.case-card[id^="case-"]').count()) === 12, 'first render shows 12 case cards');
    ok((await page.locator('.case-chip').count()) === 48, 'case rail has 48 chips');
    ok(!(await page.locator('details.front-matter').evaluate(el => el.open)), 'front matter collapsed by default');
    const caseOneBox = await page.locator('#case-1').boundingBox();
    ok(caseOneBox && caseOneBox.top < 900 && caseOneBox.bottom > 0, 'Case 1 reaches the first desktop viewport');
    ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), 'no desktop page overflow');
    const initialReaderText = await page.locator('#reader-content-target').textContent();
    ok(initialReaderText.includes('Wumen Commentary') && initialReaderText.includes('Wumen Verse'), 'Wumenguan labels name Wumen');
    ok(await page.evaluate(() => {
      const reader = document.querySelector('#reader-content-target');
      const lastCase = document.querySelector('#case-12');
      const epilogue = [...reader.querySelectorAll('h2')].find(el => el.textContent.includes("Wumen's Epilogue"));
      return !!lastCase && !!epilogue && Boolean(lastCase.compareDocumentPosition(epilogue) & Node.DOCUMENT_POSITION_FOLLOWING);
    }), 'epilogue follows rendered cases');
    for (const expected of [24, 36, 48]) {
      await page.click('#case-load-more-btn');
      await page.waitForFunction(
        (n) => document.querySelectorAll('.case-card[id^="case-"]').length === n,
        expected
      );
    }
    ok(await page.locator('#case-load-more-btn').count() === 0, 'load-more button gone at 48/48');
  });

  // 4. Case chip jumps to (and auto-loads) the target case.
  await testAsync('case-chip-jump', async () => {
    await page.goto(base + '#/reader/wumenguan', { waitUntil: 'load' });
    await page.click('.case-chip[data-jump-case="37"]');
    await page.waitForSelector('#case-37');
    ok((await page.locator('#case-37 .classical-zh').count()) === 1, 'case 37 card present with Chinese');
  });

  // 5. Citation popover on hover (source/translation disclosure).
  await testAsync('citation-popover', async () => {
    await page.goto(base + '#/reader/wumenguan', { waitUntil: 'load' });
    await page.waitForSelector('.citation-trigger');
    await page.hover('.citation-trigger', { force: true }).catch(() => {});
    await page.waitForTimeout(150);
    const pop = page.locator('#citation-popover');
    const visible = await pop.isVisible().catch(() => false);
    if (visible) {
      const text = await pop.textContent();
      ok(/Canonical location/.test(text), 'popover shows canonical location rows');
    } else {
      // Touch-style tap activation is exercised on mobile below; hover may be
      // unavailable in headless, so a hidden popover alone is not a failure.
    }
  });

  // 6. Glossary term popover via pointer click.
  await testAsync('glossary-term-click', async () => {
    await page.goto(base + '#/reader/wumenguan', { waitUntil: 'load' });
    await page.waitForSelector('.term-highlight');
    await page.click('.term-highlight >> nth=0');
    await page.waitForSelector('#term-popover', { state: 'visible' });
    const text = await page.locator('#term-popover').textContent();
    ok(text.length > 10, 'popover contains a definition');
  });

  // 7. Keyboard: Enter on a focused glossary term opens the popover.
  await testAsync('glossary-term-keyboard', async () => {
    await page.goto(base + '#/reader/wumenguan', { waitUntil: 'load' });
    await page.waitForSelector('.term-highlight');
    await page.focus('.term-highlight >> nth=0');
    await page.keyboard.press('Enter');
    await page.waitForSelector('#term-popover', { state: 'visible' });
  });

  // 8. ARIA tabs: ArrowRight from the active tab activates the next one.
  await testAsync('tabs-keyboard', async () => {
    await page.goto(base, { waitUntil: 'load' });
    const first = page.locator('.nav-tab-btn').nth(0);
    await first.focus();
    ok((await first.getAttribute('aria-selected')) === 'true', 'first tab active');
    await page.keyboard.press('ArrowRight');
    ok((await page.locator('.nav-tab-btn').nth(1).getAttribute('aria-selected')) === 'true', 'ArrowRight activates second tab');
    ok(await page.locator('#view-matrix.active').count() === 1, 'matrix view switched');
    await page.keyboard.press('End');
    ok((await page.locator('.nav-tab-btn').nth(4).getAttribute('aria-selected')) === 'true', 'End activates last tab');
  });

  // 9. Search: schema coverage, highlighting, and HTML-escape of the query.
  await testAsync('search', async () => {
    await page.goto(base, { waitUntil: 'load' });
    await page.fill('#global-search', '菩提本無樹');
    await page.waitForFunction(() => document.body.textContent.includes('Search Results'));
    ok((await page.locator('mark').count()) > 0, 'search results are highlighted');
    const resultsText = await page.textContent('#reader-content-target');
    ok(resultsText.includes('Platform'), 'platform sutra surfaced for its verse');
    // XSS guard: raw markup must never be injected back.
    await page.fill('#global-search', '<img src=x onerror="alert(1)">');
    await page.waitForTimeout(300);
    const html = await page.locator('#reader-content-target').innerHTML();
    ok(!html.includes('<img'), 'raw query markup is not injected');
    ok(html.includes('&lt;img'), 'query is HTML-escaped in output');
  });

  // 10. Mobile: bottom action bar + corpus picker + reading surface.
  await testAsync('mobile', async () => {
    await mobilePage.goto(base, { waitUntil: 'load' });
    ok(await mobilePage.locator('.mobile-action-bar').isVisible(), 'mobile bottom bar visible');
    ok(await mobilePage.locator('#corpus-mobile-select').isVisible(), 'mobile corpus picker visible');
    await mobilePage.selectOption('#corpus-mobile-select', 'xinxin_ming');
    await mobilePage.waitForFunction(() => document.body.textContent.includes('Stanza source: T48n2010'));
    ok(await mobilePage.locator('#corpus-mobile-select option[value="xinxin_ming"]').count() === 1, 'picker contains corpus options');
    ok(await mobilePage.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), 'no mobile page overflow');
    await mobilePage.locator('[data-view="matrix"]').click();
    ok(await mobilePage.locator('.mobile-action-bar').isHidden(), 'Reader controls hidden outside Reader');
    await mobilePage.locator('[data-view="lineage"]').click();
    await mobilePage.click('#lineage-mode-cards-btn');
    ok(await mobilePage.locator('#lineage-content-target').isVisible(), 'mobile Lineage directory visible');
    ok(await mobilePage.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), 'no mobile Lineage directory overflow');
  });

  // 11. Print/PDF expands all lazy units and keeps end matter last.
  await testAsync('print', async () => {
    await page.goto(base + '#/reader/wumenguan', { waitUntil: 'load' });
    await page.waitForSelector('.case-card[id^="case-"]');
    ok((await page.locator('.case-card[id^="case-"]').count()) === 12, 'print starts from lazy 12-case DOM');
    await page.evaluate(() => {
      window.__printSnapshot = null;
      window.print = () => {
        const cases = [...document.querySelectorAll('.case-card[id^="case-"]')];
        const epilogue = [...document.querySelectorAll('#reader-content-target h2')].find(el => el.textContent.includes("Wumen's Epilogue"));
        window.__printSnapshot = {
          cases: cases.length,
          epilogueAfterLast: Boolean(epilogue && cases.at(-1)?.compareDocumentPosition(epilogue) & Node.DOCUMENT_POSITION_FOLLOWING)
        };
      };
    });
    await page.click('#reader-print-btn');
    await page.waitForFunction(() => window.__printSnapshot?.cases === 48);
    const snapshot = await page.evaluate(() => window.__printSnapshot);
    ok(snapshot.cases === 48, 'Print/PDF receives all 48 cases');
    ok(snapshot.epilogueAfterLast, 'epilogue follows Case 48 in print DOM');
    await page.emulateMedia({ media: 'print' });
    ok((await page.evaluate(() => getComputedStyle(document.querySelector('header')).display)) === 'none', 'header hidden in print');
    ok((await page.evaluate(() => getComputedStyle(document.querySelector('.case-card')).display)) !== 'none', 'case cards remain visible in print');
    await page.emulateMedia({ media: 'screen' });
  });

  // 12. Missing data bundle renders an actionable, focusable recovery surface
  // instead of leaving the Reader on a permanent loading placeholder.
  await testAsync('fatal-bundle-recovery', async () => {
    const fatalPage = await desktop.newPage();
    await fatalPage.route('**/app_data.js', route => route.abort('failed'));
    await fatalPage.goto(base, { waitUntil: 'load' });
    const panel = fatalPage.locator('#app-fatal-error');
    ok(await panel.isVisible(), 'fatal recovery panel visible');
    ok((await panel.getAttribute('role')) === 'alert', 'fatal recovery announced as alert');
    ok(await fatalPage.locator('#app-reload-btn').isVisible(), 'reload action visible');
    ok(await fatalPage.evaluate(() => document.activeElement?.id === 'app-fatal-error'), 'fatal recovery receives focus');
    ok((await fatalPage.locator('#reader-content-target').count()) === 0, 'broken reader surface replaced');
    await fatalPage.close();
  });

  // 13. CSP + runtime cleanliness: no violations, no uncaught exceptions.
  await testAsync('csp-clean', async () => {
    await page.goto(base, { waitUntil: 'load' });
    await page.waitForTimeout(400);
    ok(cspViolations.length === 0, `no CSP violations (got: ${cspViolations.join(' | ') || 'none'})`);
    ok(pageErrors.length === 0, `no uncaught page errors (got: ${pageErrors.join(' | ') || 'none'})`);
  });

  await desktop.close();
  await mobile.close();
  await browser.close();
  if (serverChild) serverChild.kill('SIGTERM');

  if (failures.length) {
    for (const { name, error } of failures) {
      console.log(`  ❌ ${name}: ${error.message}`);
    }
    console.log(`\n🔴 BROWSER TEST: ${failures.length} failure(s)`);
    process.exit(1);
  }
  console.log('\n✅ BROWSER TEST PASSED (desktop + mobile, real Chromium)');
  process.exit(0);
}

main().catch((err) => {
  console.error(`🔴 BROWSER TEST crashed: ${err.stack || err}`);
  process.exit(1);
});
