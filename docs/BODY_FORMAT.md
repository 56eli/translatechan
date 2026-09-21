# Body Format — plain_cjk_markdown_subset_v1

## Declared format

`body_format: plain_cjk_markdown_subset_v1`

Conservative, no arbitrary HTML. Unicode normalized to NFC for export.

## What body contains

- **zh-Hant**: original Chinese, plain CJK, no HTML. Only characters U+3400-U+9FFF, U+F900-U+FAFF, plus punctuation 。，、；：？！「」『』（） etc. No footnotes inline — footnotes are separate field `cbeta_note`, `coverage_note`, `editorial_note`.
- **zh-Latn**: Hanyu Pinyin, plain Latin with tone marks, spaces. `transliteration_scheme: Hanyu Pinyin`.
- **en**: English, Markdown subset only: `**bold**`, `*italic*`, `` `code` ``, `[link text](relative/path)` — no absolute wiki URLs, no `<div>`, no `<script>`, no arbitrary HTML. Footnotes as separate field if needed.

## What is NOT allowed

- No `<div>`, `<span>`, `<style>`, `<script>`, `<iframe>` — arbitrary HTML forbidden.
- No absolute `https://nonduality.duckdns.org/...` URLs inside corpus data — cross-refs by id only (R10).
- No inline apparatus — apparatus dropped by extraction rule.

## Extraction rule (claimed witness)

- Rule `cbeta-p5-body-cjk-v1`:
  - Input: CBETA XML P5 revision `dbdea41071e1e260ad84b72faefd4587333cf76d`
  - Take TEI `<body>` only, drop `<note>`, `<app>`, `<g>`, `<lb>` kept as boundary for locator but not in text.
  - Keep only CJK characters U+3400-U+4DBF, U+4E00-U+9FFF, U+F900-U+FAFF
  - Join lines, whitespace collapsed
  - Output one line per fascicle/file
  - NFC normalized for export, collator internally uses NFKC + graphic-variant map for matching.

## Collation

- Collator searches for contiguous runs ≥8 CJK chars in reference body.
- If found verbatim, EXACT. If reworded with same meaning but different chars, REWORDED (collated).
- Otherwise MINOR, DIVERGENT, NOT_FOUND, TITLE_COMPOSITE, SHORT_UNMATCHED, WITNESS_UNAVAILABLE, EMPTY.
- Coverage note example: `s1.d0 24/34 @60,222` means section 1 dialogue 0, 24 of 34 chars found at offset 60,222 in uncited X80n1565.

## Notes fields (separate ledgers)

- `cbeta_note`: extended witness info, e.g. "T48n2005 p0292b... — additive note"
- `coverage_note`: per-field run measurements, Baizhang pattern
- `editorial_note`: R-B labels, e.g. "Project retelling — no witness attribution" or "Collated to claimed witness"
- `recension_note`: recension differences
- All notes are separate from body, rendered as separate ledger blocks.

## Unicode

- Export: NFC
- Collator internal: NFKC + variant map (e.g. 峯→峰) applied for matching, not baked into reference.
- Search and duplicate detection uses NFC + NFKC folding.

## Example

```json
{
  "id": "wumenguan_case_01",
  "type": "case",
  "parent_id": "wumenguan",
  "order": 1,
  "texts": [
    {
      "lang": "zh-Hant",
      "script": "Hant",
      "body": "趙州和尚因僧問：「狗子還有佛性也無？」州云：「無。」",
      "is_ai_styled": false
    },
    {
      "lang": "zh-Latn",
      "script": "Latn",
      "transliteration_scheme": "Hanyu Pinyin",
      "body": "Zhàozhōu héshang yīn sēng wèn: 'Gǒuzi hái yǒu fóxìng yě wú?' Zhōu yún: 'Wú.'",
      "is_ai_styled": false
    },
    {
      "lang": "en",
      "script": "Latn",
      "body": "A monk asked Zhaozhou, 'Does a dog have Buddha-nature or not?' Zhaozhou said, 'No.'",
      "is_ai_styled": true
    }
  ],
  "body_format": "plain_cjk_markdown_subset_v1"
}
```
