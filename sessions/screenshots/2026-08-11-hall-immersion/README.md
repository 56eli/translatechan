# Hall-immersion screenshot evidence — 2026-08-11

Ten real-browser screenshots of `arena/019ff0c0-translatechan` at commit
`d3088b1`, captured in-sandbox (headless Chromium via `@sparticuz/chromium`
through the npm registry; Noto Serif SC subsets from npm `noto-serif-sc`,
converted woff2→ttf into the sandbox's fontconfig). Environment caveats:
Google Fonts does not load in the sandbox (Inter/Noto Serif SC webfont reasons
fall back to local Noto Serif SC + system stacks); KaiTi-family brush scripts
are not installed, so source Chinese renders in Song-style here. Layout,
spacing, color, and component behavior are fully authentic.

| File | State |
|---|---|
| `01-desktop-light-reader.png` | Day hall: reader fold — beam, shelf, sheet, lintel, headband |
| `02-desktop-light-reader-scrolled.png` | Folio dinkus separators + collapsed case headers |
| `03-desktop-dark-reader.png` | Night hall reader |
| `04-desktop-light-matrix.png` | Comparison room: proof sheet rows |
| `05-desktop-dark-matrix.png` | Night hall matrix |
| `06-desktop-light-lineage.png` | Lineage network in the scroll frame (dowel bars) |
| `07-desktop-light-gongan.png` | Gong'an catalogue rows + theme chips |
| `08-desktop-light-lexicon.png` | Lexicon definition rows (post-fix full-width) |
| `09-mobile-light-reader.png` | 390px fold: picker, lintel, clamped title, tray |
| `10-mobile-dark-reader.png` | 390px night hall |

Defects caught by this evidence pass and fixed the same session: paper-sheet
center crease (looked like a stray divider), `◆` dinkus tofu → CSS lozenge,
case-rail hard truncation → right-edge fade, tofu glyph icons (`⌕`, `☾/☀`,
`⤒`, `⟲`) → inline SVG/text, lexicon rows squeezed by the legacy card grid,
mobile title consuming the first fold, full-width lineage selects.
