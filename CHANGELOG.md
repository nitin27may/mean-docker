# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

The 2026 modernization pass. See the audit in
[`.claude/plans/2026-modernization.md`](.claude/plans/2026-modernization.md)
and the tracking issue for the full picture.

### Breaking

- **A JWT signing key is now required.** The API refuses to start when `SECRET`
  is unset, still the `.env.example` placeholder, or shorter than 32
  characters. The previous fallback was a value published in this repository,
  so every deployment that followed the README shared a known signing key.
  Generate one with `openssl rand -base64 48`.
- **Tokens in the query string are rejected.** `Authorization: Bearer` only.
  `?token=` leaked JWTs into access logs, browser history and `Referer`
  headers.
- **MongoDB is no longer published to the host** in `docker-compose.nginx.yml`.
- **The gateway container listens on 8080** because it now runs unprivileged.
  Compose publishes `80:8080`, so `http://localhost` is unchanged.
- **Both workspaces use pnpm** instead of npm. `corepack enable`, then
  `pnpm install`.
- Kubernetes manifests read credentials from a `mean-secrets` Secret. Copy
  `manifest/secret.example.yaml` to `manifest/secret.yaml` before applying.

### Added

- PR-triggered CI: lint, build and test for both workspaces, plus a compose
  build. The repository had no PR automation at all.
- Semver and `sha-` image tags on Docker Hub alongside `latest`, so a release
  can be pinned; a `Release` workflow publishes all three images from a `v*`
  tag.
- Dependabot for pnpm, Docker and GitHub Actions.
- `GET /health`, reporting 503 while MongoDB is disconnected, wired to
  container healthchecks and Kubernetes probes.
- Helmet, rate limiting (tighter on the authenticate route) and a CORS
  allowlist read from `CORS_ORIGINS`.
- Working test suites: 11 tests in `api/` (Vitest), 12 in `frontend/` (Vitest,
  migrated from Karma). `pnpm test` previously failed immediately in both.
- ESLint in both workspaces. `frontend/` had no configuration at all;
  `api/.eslintrc` was in a format ESLint 9+ cannot read.
- `SECURITY.md`, `CODE_OF_CONDUCT.md`, `CODEOWNERS`, a PR template and this
  changelog.

### Changed

- Angular 21 -> 22, with zoneless change detection and signals.
- Express 4.21 -> 5.2, Mongoose 8.10 -> 9.9, Node 22 -> 24, MongoDB -> 8.2
  (pinned; 8.0 will not start on Linux kernel 6.19+, see SERVER-121912).
- `@ng-bootstrap` 20.0.0-rc.0 -> 21.0.0 stable, which is what lets the frontend
  image install from the lockfile instead of `--legacy-peer-deps`.
- ngx-toastr replaced by a signal-backed notification service on ng-bootstrap's
  toasts; ngx-toastr has no Angular 22 release.
- `strict: true` in both workspaces, and the pervasive `any` usage replaced
  with real types.
- Containers run as non-root with healthchecks; base images are pinned.
- Nginx: per-request upstream resolution, forwarded headers, gzip, body size
  limit.
- README, docs site and roadmap corrected to match what the code does.

### Fixed

- All three Docker build workflows declared `runs-on: Ubuntu-20.04`, a retired
  runner. Every run since 2025-12-06 was cancelled, which is why the README
  badges were red and Docker Hub had not seen a publish since 2025-04.
- `jekyll-gh-pages.yml` triggered on `main` while the default branch is
  `master`, so the docs site never auto-deployed.
- `EXPRESS_PORT` was assigned the database name in all three compose files, and
  nothing read it — the API reads `PORT`.
- `docker-compose.hub.yml` set `MONGO_DB_PARAMETERS` to the Mongo port,
  dropping `?authSource=admin` and breaking auth on the prebuilt-image path.
- The Mongo connection string, including the password, was logged on every boot.
- The Kubernetes Express deployment declared port 4100; the API listens on 3000.
- Four documentation links returned 404, and `docs/local-devlopment.md` was
  misspelled (renamed, with a redirect).
- A stray `console.log` of the whole contact list, a second in registration, and
  several silently empty error handlers.
- `angular.json` shipped a personal Angular CLI analytics ID that every fork
  inherited.
- Deleted two orphan files: the root `dockerfile` (Node 20, EOL) and
  `api/docker-compose.yml` (mounted paths that do not exist).

## [1.0.0]

Initial release: MEAN stack contact manager with Docker Compose, JWT auth and
an Nginx gateway.

[Unreleased]: https://github.com/nitin27may/mean-docker/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/nitin27may/mean-docker/releases/tag/v1.0.0
