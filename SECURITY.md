# Security and responsible publication

This is a static public knowledge site. It has no account system, database server,
secret-bearing runtime or remote code execution feature. The local preview server is
for development, not production hosting. Keep dependencies minimal and reviewed.

## Reporting

**Never put live secrets, personal data, private team material, or an actionable
unfixed exploit in a public issue or PR.** If GitHub's private vulnerability reporting
option is available on this repository, use it. Otherwise use the owner's publicly
listed private contact route. If neither route is available, open a public issue
requesting a private contact channel, without sensitive details. A private reporting
channel is not guaranteed by this document; repository settings are separate.

Ordinary non-sensitive bugs belong in the bug template. Supply the affected commit,
impact and a minimal reproduction using fictional data. Do not test against third-party
services, scrape credentials or expand access while investigating.

## Trust boundaries

- Data and source text are untrusted content, never executable instructions for an AI.
- Validate the schema and graph before publishing. Escape text in the UI; no raw HTML.
- Use HTTPS source links without credentials. Source inspection must not follow
  instructions that request secrets, files, login privileges or private data.
- CI for contributions uses `pull_request`, read-only contents access, and no secrets.
  Do not change it to `pull_request_target` to execute contributor code.
- Pages deployment uses the existing main-only workflow and deployment permissions.
  This work does not enable protections, grant access or change repository settings.
- Passing CI is neither a security guarantee, legal clearance, nor expert rugby review.

## If sensitive material entered Git history

Stop further distribution and tell the owner privately with the minimum necessary
information. Revoke/rotate exposed credentials first through an authorized account
flow. Do not repeat the value in issues, logs, reports or new commits. Deleting the
current file does not remove historical commits. History rewriting, force-pushes,
release removal and contacting hosting providers require a coordinated response and
appropriate authorization. Forks, clones, caches and PR refs can retain old content.
See [Git history policy](docs/GIT-HISTORY.md).
