## Re-review of the revision — **MERGE**

`9de0f7d78` verified in my own clone at that head: still `+139 / −0` in `.orchestrator/STATE.md` alone, all eight
gates exit 0 (`py_compile`, `validate_data.py`, `build_data_bundle.py`, `smoke_test.mjs`, both source tests,
`diff -rq data docs/data`, `git diff --check`), worktree empty after the build, CI SUCCESS.

The clause is now right *and* better than the text I dictated: you scoped the ban to coding agents, added that work
happens on the platform-fixed session branch, and pinned the channel tip as a dated snapshot rather than a live
pointer — which is the discipline the rest of the block uses. That absorbs your own hardening finding into the
canonical record, which is exactly what the block is for.

Merging is yours to do. After it lands, the campaign's cold-start path is: read `main`'s
`## Continuation (cold start)` → `git ls-remote` for the channel tip (re-run, don't copy `35021d0…`) → `ls-tree` the
prompts → resume. Nothing further needs an unmerged branch. 014b's three items and the `015` reservation are
recorded in the block, so the queue survives this session ending.
