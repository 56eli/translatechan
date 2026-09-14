# Security Policy

Fake Chan Factory (`translatechan`) is a static, zero-backend GitHub Pages
site. There is no server, no database, no user accounts, and no runtime
JavaScript package beyond an optional development-only dependency
(Playwright). The attack surface is therefore small, but this file exists so
a report has a clear, discoverable destination.

## Supported versions

Only the `main` branch is supported. There are no maintained release
branches or tags; the latest commit on `main` is what GitHub Pages publishes.

## Reporting a vulnerability

Please report suspected security issues privately using
[GitHub Security Advisories](https://github.com/56eli/translatechan/security/advisories/new)
for this repository ("Report a vulnerability" under the Security tab). Do not
open a public issue or pull request for a suspected vulnerability.

There is no dedicated security email address and no bug-bounty program. A
reporter should expect an acknowledgement on the advisory thread, not a
guaranteed response time.

Please include:

- the affected file(s)/commit and a description of the issue;
- reproduction steps or a minimal proof of concept where possible;
- the potential impact (e.g. what a reader's browser could be made to do).

## Scope notes

- This repository ships static HTML/CSS/JS and generated JSON data; there is
  no server-side code to compromise.
- Google Fonts is the one third-party runtime request the published page
  makes; see [`HANDOFF.md`](./HANDOFF.md) for the current Content-Security-Policy.
- Repository content under `data/` is corpus/translation data, not
  executable instructions — see [`AGENTS.md`](./AGENTS.md) for the agent
  contract governing how that data may and may not be treated.
- Reports about translation accuracy, source attribution, or rights review
  are editorial matters, not security issues; use a regular issue for those
  (see [`AUDIT.md`](./AUDIT.md) and [`HANDOFF.md`](./HANDOFF.md) for current
  status on those tracks).
