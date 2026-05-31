# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Lamplight, please **do not open a public GitHub issue**.

Report it privately via [GitHub Security Advisories](https://github.com/leelakumili/lamplight/security/advisories/new) or email **tilak007ai@gmail.com** with the subject line `[Lamplight Security]`.

Please include:
- A description of the vulnerability and its potential impact
- Steps to reproduce or a proof-of-concept
- Any suggested mitigations, if you have them

You can expect an acknowledgement within **48 hours** and a status update within **7 days**.

## Scope

This is a self-hosted, single-family app. The primary concerns are:

- **Data in transit** — parent interview answers (describing teens' social/emotional situations) are sent to whichever AI provider you configure. Use Ollama for fully local processing.
- **API key exposure** — keys live only in `.env` on the host machine and are never sent to the browser.
- **PIN auth** — the PIN is the only access control; use a non-trivial value and restrict network access to your home Wi-Fi.

## Out of Scope

- Vulnerabilities that require physical access to the host machine
- Ollama model behavior or third-party AI provider security (report those upstream)
