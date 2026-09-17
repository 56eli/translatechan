/**
 * Fake Chan Factory — early theme bootstrap (FOUC guard).
 *
 * Loaded synchronously in <head> before the stylesheet and the data
 * bundle so that a returning dark-mode user never sees a white flash before
 * app.js applies the persisted theme. Storage can throw in privacy-restricted
 * frames; fall back to the document default (light) and let app.js continue.
 *
 * Kept as an external file (rather than an inline <script>) to satisfy the
 * strict CSP (script-src 'self') without a hash/nonce exception.
 */
(function () {
  'use strict';
  try {
    var theme = window.localStorage ? window.localStorage.getItem('translatechan_theme') : null;
    if (theme === 'dark' || theme === 'light') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  } catch (e) {
    /* storage unavailable — keep the server-rendered default theme */
  }
  // Apply the persisted layout preset (1–6) before first paint so a returning
  // reader never sees a flash of the default layout. Layout 1 (current ideal
  // layout + colors) is the page default and needs no attribute; layouts 2–6
  // are the structural disclosure layouts of Phase 5 bundle 026. Legacy 025
  // letter presets (a–e, colors-only) normalize to 1.
  try {
    var design = window.localStorage ? window.localStorage.getItem('translatechan_design_variant') : null;
    if (design === '2' || design === '3' || design === '4' || design === '5' || design === '6') {
      document.documentElement.setAttribute('data-design', design);
    } else if (design === 'a' || design === 'b' || design === 'c' || design === 'd' || design === 'e') {
      try { window.localStorage.setItem('translatechan_design_variant', '1'); } catch (e2) { /* ignore */ }
    }
  } catch (e) {
    /* storage unavailable — keep the server-rendered default layout */
  }
})();
