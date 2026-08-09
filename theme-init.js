/**
 * TranslateChan — early theme bootstrap (FOUC guard).
 *
 * Loaded synchronously in <head> before the stylesheet and the ~799 KB data
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
})();
