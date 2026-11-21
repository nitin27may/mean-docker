# 2026-11 maintenance pass — audit and plan

Second semi-annual pass after the 2026-08 modernization. Audit run 2026-11-21 against `master`
at `04de2a8`. Method: `/audit` + `/bump-deps`, plus a sweep of open PRs, base-image freshness on
Docker Hub, and the latest major of every GitHub Action in use.

## Audit findings

### F1 — MongoDB 8.2 is end of life (P0)
- 8.2 was a Rapid Release; it reached EOL on 2026-07-31. The `mongo:8.2` image was last rebuilt
  2026-07-23, so every user is running a four-month-old, unpatched database.
- Current options on Docker Hub: `8.3` (latest Rapid Release) and `9.0` (new major).
- Rapid Releases die between our twice-yearly passes — that is exactly how 8.2 rotted. Pin the
  **major** instead.
- 9.0 is supported only as an upgrade from 8.0 or 8.3 FCV; an **8.2 data volume will not open
  under 9.0**. The seed data is demo data, so the migration is `down -v` — but it is a breaking
  change and must be documented as one.
- Mongoose 9.12 ships Node driver 7.8, which supports MongoDB 9.0 (driver ≥ 7.6). Verify by
  running the stack, not by trusting the compatibility table.

### F2 — Node version claims are false (P0 — credibility)
- Dependabot bumped `api/Dockerfile` and `frontend/Dockerfile` to `node:26-alpine`, while CI
  (`node-version: 24`), the README ("Node 24 LTS"), docs, CLAUDE.md, the rules file and the GitHub
  About text still say 24. The images and the CI that tests them run different majors.
- Node 26 became Active LTS ("Lithium") on 2026-10-28. Angular 22.3 supports `>=26`. Align on 26
  rather than revert. `engines` stays `>=24` (still a supported LTS; Angular supports `^24.15`).

### F2a — `master` images do not build (P0, found while verifying)
- Node 25+ stopped bundling corepack. After the Dependabot `node:26-alpine` bump, `RUN corepack
  enable` exits 127 and every API and frontend image build fails. CI's `verify (stack)` job builds
  these images, so those PRs were merged red or the check is not required.
- Fix: `npm install -g corepack@0.36.0 && corepack enable` (pinned). `packageManager` stays the
  single source of the pnpm version — installing pnpm directly would duplicate it.

### F2b — The production-shaped modes ran in development mode (P0, found while verifying)
- `.env.example` set `NODE_ENV=development`, overriding `${NODE_ENV:-production}` in the nginx and
  hub compose files. Observed on the live stack: a 404 returned a full stack trace, and
  `Origin: https://evil.example` was reflected in `Access-Control-Allow-Origin`.
- Fix: remove the line from `.env.example`. Re-verified: `NODE_ENV=production`, no stack trace,
  no ACAO header for a foreign origin. Existing users must delete the line from their own `.env`.

### F3 — Runtime vulnerabilities (P0)
`pnpm audit`: api 39 (1 critical, 13 high), frontend 76 (2 critical, 25 high). Most are dev
tooling, but these reach production:
- `proxy-addr` (critical), `body-parser`, `qs` — Express's request pipeline
- `mongoose` (< 9.11.4)
- `@angular/router` (< 22.2.1) — shipped to every browser
Dev-only: vite, vitest, piscina, undici, hono / `@modelcontextprotocol/sdk` (via `@angular/cli`),
fast-uri, brace-expansion, minimatch, glob, js-yaml, zod, source-map-js, ip-address.

### F4 — 11 open Dependabot PRs, all stale or superseded (P1)
| PR | Change | Disposition |
|---|---|---|
| #145 | frontend minor/patch group (19) | superseded by this pass |
| #144 | mongoose 9.11.4 | superseded (→ 9.12.x) |
| #142, #140 | @angular/router 22.2.x | superseded (→ 22.3 via `ng update`, whole framework) |
| #141 | api minor/patch group | superseded |
| #132 | frontend vitest 4.1.11 | superseded (→ vitest 5) |
| #139 | upload-pages-artifact 3→5 | applied here |
| #138 | setup-node 6→7 | applied here |
| #137 | login-action 3→4 | applied here |
| #136 | configure-pages 5→6 | applied here |
| #135 | deploy-pages 4→5 | applied here |

Bumping `@angular/router` alone (#140/#142) would split the framework across minors — never merge
those individually. The `angular` group in `dependabot.yml` exists to prevent this; the
single-package PRs predate it or slipped through.

### F5 — Dependabot is silently capped (P1)
The `github-actions` entry has no `open-pull-requests-limit`, so the default of 5 applies — and
there are exactly 5 open. `upload-artifact` (v4 → v7) and `build-push-action` (v6 → v7) have no PR
at all. Raise the limit; group majors for actions.

### F6 — Dependency drift
Angular 23 is **not** released (latest 22.3.0) — nothing to do there this pass.

| Package | Current | Target | Note |
|---|---|---|---|
| Angular (all) | 22.1.3 | 22.3.0 | via `ng update` |
| angular-eslint | 22.1.0 | 22.8.0 | |
| typescript | 6.0.3 | **stay 6.0** | Angular requires `>=6.0 <6.1`; typescript-eslint requires `<6.1`. TS 7 also drops the JS API ts-node relies on |
| vitest / coverage-v8 | 4.1 | 5.1 | `@angular/build` 22.3 accepts `^5` |
| jsdom | 30 | 31 | dev only |
| express | 5.2.1 | 5.3.0 | |
| mongoose | 9.9.3 | 9.12.x | security |
| dotenv | 17 | 18 | read changelog first |
| @types/bcryptjs | 3.0.0 | **remove** | deprecated stub; bcryptjs 3 ships its own types |
| pnpm | 11.22.0 | 11.28.x | pnpm 12 deferred: a package-manager major changes the lockfile and the `corepack` story in every doc |
| eslint, typescript-eslint, prettier, tslib, bootstrap, supertest, express-rate-limit, @types/node | — | latest minor | |

### F7 — Base images
| Image | Current | Target |
|---|---|---|
| node | 26-alpine | 26-alpine (no change; now LTS) |
| nginx | 1.31-alpine | 1.31-alpine (current mainline; rebuilt 2026-11-19) |
| mongo | 8.2 | **9.0** (F1) — three compose files + `manifest/database-deployment.yaml` |

### F8 — GitHub Actions
`setup-node` 7, `configure-pages` 6, `deploy-pages` 5, `upload-pages-artifact` 5,
`login-action` 4, `upload-artifact` 7, `build-push-action` 7. Read each major's notes.
`actionlint` before pushing — CI minutes are scarce.

### F9 — Docs and repo metadata
- Version strings: README (stack table + Mermaid), `docs/index.md`, `environment.ts`, plus every
  doc that names MongoDB 8.2 / Node 24 (`docs/*.md`, `api/README.md`, `frontend/README.md`),
  CLAUDE.md and `.claude/rules/versioning.md`.
- `docs/roadmap.md` — add this pass; record the Rapid Release lesson.
- `CHANGELOG.md` — new `3.0.0` entry (major: existing data volumes need a reset); the Mongo volume migration goes under **Breaking**.
- GitHub About description says "Node 24" and "MongoDB 8". Topics are at the 20-topic cap.
  No tool in this session can edit repo metadata — the exact text and a `gh` command are handed
  to the maintainer (see below).
- `docs/audit-2026-08.md` and `.claude/plans/2026-modernization.md` are historical records — leave
  their version numbers alone.

## Plan (one branch, ordered so each step is verifiable)

1. **Frontend**: `ng update @angular/core@22.3 @angular/cli@22.3`, then the ecosystem bumps, vitest 5,
   jsdom 31. Lint / build / test.
2. **API**: minor bumps, mongoose 9.12, dotenv 18 (after reading its changelog), vitest 5, drop
   `@types/bcryptjs`. Lint / build / test.
3. `pnpm audit` both workspaces. Anything still high/critical gets a targeted `pnpm.overrides`
   entry with a comment saying why, or is documented as dev-only and accepted.
4. **Images**: Mongo 9.0 in all three compose files and the k8s manifest. Node 26 in CI.
5. **Actions**: the seven majors; raise the Dependabot cap; `actionlint`.
6. **Docs**: version strings everywhere listed in F9, CHANGELOG, roadmap, CLAUDE.md, rules.
7. **`/verify` in full**, including `./scripts/setup.sh --reset` on a fresh volume, login, contact
   CRUD in a real browser (zoneless — unit tests do not catch repaint bugs), credential-log grep,
   and Mongo not reachable from the host.
8. Push the branch. Maintainer: open the PR, close the superseded Dependabot PRs after merge,
   update About/topics, tag `v3.0.0` so Docker Hub gets fresh images (`docker-compose.hub.yml`
   still serves the 8.2-era images until then).

## Repo About (for the maintainer)

Description:
> Production-ready MEAN stack reference: MongoDB 9, Express 5, Angular 22 (zoneless), Node 26 LTS —
> fully containerized with Docker Compose and Nginx. JWT auth, strict TypeScript end to end,
> lint/build/test green in CI, and a quick start that is verified before every release.

Topics (20 max — currently at the cap): drop `dockerfile` and `mean-docker-boilerplate` (low search
value, the latter duplicates `mean-boilerplate`); add `mongoose` and `angular-signals`.

```bash
gh repo edit nitin27may/mean-docker \
  --description "<text above>" \
  --remove-topic dockerfile --remove-topic mean-docker-boilerplate \
  --add-topic mongoose --add-topic angular-signals
```

## Deferred, with reasons
- **Angular 23** — not released yet. Next pass.
- **TypeScript 7** — blocked by Angular and typescript-eslint peer ranges.
- **pnpm 12** — package-manager major; take it in a pass of its own.
- **Docker Hub publish / release tag** — maintainer action; this session cannot push images.

## Outcome (2026-11-21)

Done on `claude/gifted-maxwell-5r4veb`. `/verify` run in full on the final tree:

| Check | Result |
|---|---|
| api: frozen install, lint, build, test | pass (11 tests) |
| frontend: frozen install, lint, build, test | pass (12 tests) |
| Images build (unmodified Dockerfiles) | pass — all three |
| Stack on a fresh volume | 4/4 healthy; `mongod` 9.0.8, Node 26 |
| Browser: login, create / edit / delete, toasts, zoneless repaint | pass, no page errors |
| Credentials in express logs | none |
| Mongo reachable from host | no |
| `actionlint` | clean |
| `pnpm audit` | api 2 moderate (accepted, see F3), frontend 0 |

Evidence gathered rather than assumed:
- An 8.2-created volume under `mongo:9.0` exits 62 with `UPGRADE PROBLEM: Found an invalid
  featureCompatibilityVersion document`. Quoted in the CHANGELOG and troubleshooting doc.
- `master`'s API (Mongoose 9.9.3, driver 7.5.0) connects, authenticates and reads contacts against
  `mongo:9.0`, so `docker-compose.hub.yml` keeps working before new images are published.

Released as **3.0.0**, not 2.1.0: an existing 2.0.x deployment crash-loops until its volume is
reset, which is breaking under the repo's SemVer policy.

Not verified here:
- `docker/build-push-action@v7`: release notes were not available, and it only runs on publish.
  Watch the first `Release` run.
- MongoDB 9.0 on Linux kernel 6.19+: this sandbox runs 6.18.
- `gitleaks`: not installed in this environment.

Sandbox-only workarounds that are **not** in the repo: base images pulled from `mirror.gcr.io`
(Docker Hub returned 429), and a local `node:26-alpine` that trusts the sandbox proxy CA.

Maintainer actions left:
1. Open the PR; make `verify (stack)` a required status check on `master` (F2a).
2. After merge, close #132 #135–#142 #144 #145 as superseded (Dependabot closes most itself).
3. Update the About text and topics (below).
4. Tag `v3.0.0` so Docker Hub gets Node 26 / Mongoose 9.12 images.
