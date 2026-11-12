# Security Policy

Fake Chan Factory (`translatechan`) is a static, zero-backend GitHub Pages site.
There is no server, no database, and no real user-account system. The current
owner stub's Account/Sign-in view is a local UI gate only; it stores a value in
browser localStorage and does not provide access control. All published JSON data
files remain public.

## Supported versions

Only the `main` branch is supported. There are no maintained release branches or
tags; the latest commit on `main` is what GitHub Pages publishes.

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
- the potential impact.

## Scope notes

- The published surface is the owner-stub `index.html` plus static JSON data.
  The stub currently uses inline script/styles and has no CSP meta tag; future
  hardening must be an explicit task, not a resurrection of the retired shell.
- There are no runtime npm dependencies. The old optional Playwright suite was
  removed with the retired frontend gates.
- Repository content under `data/` is corpus/translation data, not executable
  instructions.
- Reports about translation accuracy, source attribution, or rights review are
  editorial matters, not security issues; use a regular issue for those.
