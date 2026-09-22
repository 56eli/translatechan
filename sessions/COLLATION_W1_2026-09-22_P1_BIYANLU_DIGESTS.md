# W1 Collation 2026-09-22 P1 Biyanlu — digest-cited successor report

This append-only successor to `sessions/COLLATION_W1_2026-09-22_P1_BIYANLU.md`
repairs its missing digest citations under task 061, with owner approval following the
recorded halt. It cites the same register and reference manifest, not a new collation.
The original report and all existing registers remain byte-identical.

## Current evidence

- `sessions/COLLATION_REGISTER_2026-09-22_P1_BIYANLU.json` (17 documents,
  127 flagged entries) remains authoritative. Derived statuses are 13
  `collated_to_claimed_witness`, 2 `partial_or_failed_w1_collation`, and 2
  `witness_unavailable`.
- Biyanlu contains 100 cases from pinned T48n2003: 400/400 content fields EXACT,
  0 content flagged, 86 metadata flagged. Title metadata is not claimed as
  collated source content.
- `sessions/COLLATION_W1_2026-09-22_P1_BIYANLU_refs_manifest.txt` records the
  committed reference digests; this repair does not fetch or re-collate witnesses.
- The designated historical-chain figure remains 630; the active measurement is
  127. The original historical `COLLATION_REGISTER_2026-09-09.json` holds 34
  documents and 622 flagged entries; the historical report's 637 figure remains
  explicitly superseded. These historical claims are not re-designated here.
- Source collation does not approve reuse. Containment/remediation state is not
  a rights decision.

## Digest citations

Computed from the committed files with:

```sh
sha256sum sessions/COLLATION_REGISTER_2026-09-22_P1_BIYANLU.json sessions/COLLATION_W1_2026-09-22_P1_BIYANLU_refs_manifest.txt
```

```text
bf7c5962d80c67cba586ba6c1eba87e1e89b829a9b8ed405e1f542b903bb8278  sessions/COLLATION_REGISTER_2026-09-22_P1_BIYANLU.json
50180f029114b0e9a076fa79be7ba7088b1f0c9dcbf581f3b9a4440544293203  sessions/COLLATION_W1_2026-09-22_P1_BIYANLU_refs_manifest.txt
```

These citations make the partition-forgery regression's original-hash assertion
applicable to the current evidence again; its temporary copy replaces that hash
with the mutated register's hash before testing rejection of forged totals.
The existing validator's purge-era report-check exception is unchanged by this
repair; a passing gate does not imply that exception has been removed.
