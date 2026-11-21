# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2026-11-21

The 2026-11 maintenance pass. Audit and reasoning in
[`.claude/plans/2026-11-maintenance.md`](.claude/plans/2026-11-maintenance.md).
A major release only because of the MongoDB data-volume change below; the
application API is unchanged.

### Breaking

- **MongoDB 8.2 → 9.0.** 8.2 was a Rapid Release and reached end of life on
  2026-07-31; its image has had no rebuilds since. 9.0 cannot open a volume
  created by 8.2 — the container exits with code 62 and
  `UPGRADE PROBLEM: Found an invalid featureCompatibilityVersion document`.
  The data is demo data: run `./scripts/setup.sh --reset` (or
  `docker compose -f <file> down -v`) once. To keep data, step the volume
  through `mongo:8.3` first. See `docs/troubleshooting.md`.

### Fixed

- **The API and frontend images did not build.** Dependabot moved both
  Dockerfiles to `node:26-alpine`, and Node 25+ no longer bundles corepack, so
  `corepack enable` failed with exit 127. The images now install a pinned
  corepack from npm first; `packageManager` in `package.json` remains the one
  place the pnpm version is set.
- **The nginx and hub modes ran in development mode.** `.env.example` set
  `NODE_ENV=development`, which overrode the compose files' `production`
  default, so error responses carried stack traces and CORS reflected any
  origin. The line is gone. **Delete `NODE_ENV=` from your existing `.env`.**
- Docs that claimed Node 24 while the images ran Node 26; the Dockerfile
  quotes in `docs/docker-guide.md`, which still showed `nginx:1.29-alpine`;
  and the home page badge that said "MongoDB 8.2".

### Changed

- Node 26 LTS across images, CI and docs (became Active LTS on 2026-10-28).
  Local development still works on Node 24.
- Angular 22.1 → 22.3 (via `ng update`), angular-eslint 22.8, Vitest 4 → 5
  in both workspaces, jsdom 31, typescript-eslint 8.73, ESLint 10.15.
- Express 5.2 → 5.3, Mongoose 9.9 → 9.12, dotenv 17 → 18,
  express-rate-limit 8.7; `@types/bcryptjs` removed (bcryptjs ships its own).
- pnpm 11.22 → 11.28.
- GitHub Actions: setup-node 7, login-action 4, build-push-action 7,
  upload-artifact 7, configure-pages 6, deploy-pages 5,
  upload-pages-artifact 5.
- Dependabot now watches the compose files (MongoDB minors ignored — majors
  only), and the Actions PR cap no longer hides majors.

### Security

- `pnpm audit`: api 39 → 2, frontend 76 → 0. Cleared every advisory reachable
  at runtime: `proxy-addr` (critical), `body-parser`, `qs`, `ip-address`,
  `mongoose`, `@angular/router`, `zod`. The two left are moderate, in
  `glob`/`minimatch` under `swagger-jsdoc` (already its latest release), whose
  only input is the hard-coded `apis` pattern read at boot.

### Unchanged on purpose

- TypeScript stays on 6.0: Angular 22 and typescript-eslint both cap it below
  6.1. Angular 23 is not released yet. pnpm 12 is deferred to its own pass.

## [2.0.0] - 2026-08-20

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
- `scripts/setup.sh` — one command to check prerequisites, generate a signing
  key, start the stack and wait for healthy.
- `docs/troubleshooting.md` and `docs/audit-2026-08.md`.
- `CLAUDE.md`, a repo-local `.claude/` with `/verify`, `/bump-deps` and
  `/audit`, and an optional `.mcp.json`.

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

## [Unreleased]

Nothing yet.

## [1.0.0]

Initial release: MEAN stack contact manager with Docker Compose, JWT auth and
an Nginx gateway.

[Unreleased]: https://github.com/nitin27may/mean-docker/compare/v3.0.0...HEAD
[3.0.0]: https://github.com/nitin27may/mean-docker/compare/v2.0.0...v3.0.0
[2.0.0]: https://github.com/nitin27may/mean-docker/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/nitin27may/mean-docker/releases/tag/v1.0.0
