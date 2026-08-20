# mean-docker — Audit Report & Remediation Plan

_Audited 2026-08-20 against `master@4b80f31`. Tracking issue: see the repo's open issues. Work branch: `chore/2026-modernization`._

## Context

This repo has 118 stars and 71 forks but has had **zero commits since 2025-12-06** — 8.5 months idle. It is not a candidate for archiving: forks are still being created (most recently 2026-06), so it is demonstrably still load-bearing for people. The maintenance target is a semi-annual dependency pass, and this audit is the first one.

This audit goes deeper than dependency drift. **The repo is currently broken in ways a new visitor hits within the first five minutes**, and the README makes claims the code no longer backs. That is the real problem: a reference repo whose entire value proposition is "this is how you do it correctly" is failing its own premise.

Audit performed read-only against the GitHub API and `raw.githubusercontent.com` at `master@4b80f31` on 2026-08-20. Every version number, HTTP status code, and workflow conclusion cited below was checked live on that date, not recalled.

**Intended outcome:** a repo that (a) works when a stranger runs the documented quick-start, (b) tells the truth in its README, (c) has green badges and live CI, (d) is current on Angular 22 / Node 24 / Mongo 8, and (e) carries `CLAUDE.md` + `.claude/` so any coding agent pointed at it is productive immediately.

---

## Part 1 — Audit Findings

Severity: **P0** = broken or misleading for users today · **P1** = currency/credibility · **P2** = polish.

### 1.1 CI/CD is dead (P0)

Every workflow run since 2025-12-06 shows `cancelled`. Root cause: all three build workflows declare `runs-on: Ubuntu-20.04`, a runner GitHub retired in 2025.

| File | Problem |
|---|---|
| `.github/workflows/angular-build-and-push.yml` | `Ubuntu-20.04` (retired) · `actions/checkout@v2` · `setup-qemu-action@v1` · `setup-buildx-action@v1` · `login-action@v1` · `build-push-action@v2` |
| `.github/workflows/express-build-and-push.yml` | identical set |
| `.github/workflows/nginx-build-and-push.yml` | identical set |
| `.github/workflows/jekyll-gh-pages.yml` | triggers on `branches: [ main ]` — **default branch is `master`**, so the docs site has never auto-deployed on push; only `workflow_dispatch` works |

Knock-on effects:
- **The three README badges are the first thing on the landing page and they are red.**
- Docker Hub images (`nitin27may/mean-angular`, `mean-expressjs`, `mean-nginx`) last pushed **2025-04-08** — 16 months stale, Angular 19-era. `docker-compose.hub.yml` pulls `:latest`, so the "fastest start" path serves software two major Angular versions behind the source tree.
- All three Hub repos have **only a `latest` tag**. No semver, nothing pinnable.
- Run history shows a `Mongo Build` workflow that no longer exists in the tree — orphaned.
- **No PR-triggered CI at all.** Nothing builds, lints, or tests a pull request. For a repo with 71 forks, an incoming PR gets zero automated feedback.
- No `dependabot.yml`, despite a `dependencies` label already existing in the repo.

### 1.2 Configuration defects (P0)

These are copy/paste bugs that ship in the documented quick-start path.

| Location | Defect |
|---|---|
| `docker-compose.yml`, `docker-compose.nginx.yml`, `docker-compose.hub.yml` | `EXPRESS_PORT=${MONGO_DB_DATABASE}` — the port variable is assigned the **database name**. Present in all three files. |
| `docker-compose.hub.yml` | `MONGO_DB_PARAMETERS=${MONGO_DB_PORT}` — auth params become `27017`, so the connection string loses `?authSource=admin` and Mongo auth breaks on the Hub path. |
| `api/src/server.ts` | Reads `process.env.PORT`. Compose passes `EXPRESS_PORT`. **`EXPRESS_PORT` is never read by anything.** |
| `.env.example` | Ships `BASE_HREF=/contacts/` with a comment explaining it. Nothing consumes it — `frontend/Dockerfile` dropped the `BASE_HREF` arg; only the orphaned root `dockerfile` still has it. Setting it silently does nothing. |
| `docker-compose*.yml` | Uses legacy `links:` instead of `depends_on:` + networks. Deprecated in Compose v2. |
| all compose files | MongoDB `27017` published to the host **including in the nginx "production" mode** — which directly contradicts `docs/index.md`'s claim: *"Enhanced Security: Internal services remain isolated from direct external access."* |
| all compose files | `image: mongo:latest` — unpinned, and the README/`environment.ts` both claim "MongoDB 7.0". Whatever users get, it is not 7.0. |
| `docker-compose.yml` | `NODE_ENV=dev` set on the Angular container, which is an **nginx** container. Meaningless. |
| `api/docker-compose.yml` | Orphan file. Obsolete `version: '3.8'` key, the entire `api` service commented out, mounts `./init-db` and `./mongo` — **neither path exists under `api/`**. Pure confusion for anyone exploring the folder. |
| root `dockerfile` (lowercase) | Orphan. Referenced by no compose file. Uses `node:20-alpine` (**Node 20 went EOL April 2026**), the old `dist/contacts/browser` SSR-era layout, and contains smart quotes (`'builder'`) in comments. |

### 1.3 Security (P0)

| Issue | Detail |
|---|---|
| Credential logging | `api/src/server.ts:33` does `console.log(MONGODB_URI)` — **prints the Mongo password to stdout on every boot**. `api/src/config/database.ts:7` logs it a second time. |
| Silent insecure JWT fallback | `api/src/config/env.ts` → `secret: process.env.SECRET \|\| 'default-secret-for-jwt'`. Combined with the documented `cp .env.example .env` quick-start (which ships `SECRET=your-jwt-secret-key`), **every deployment that follows the README runs on a publicly-known signing key.** No fail-fast. |
| Token in query string | `api/src/middlewares/auth.middleware.ts` accepts `req.query.token`. JWTs leak into access logs, browser history, and `Referer` headers. |
| Wide-open CORS | `app.use(cors())` with no origin allowlist. |
| No hardening middleware | No `helmet`, no rate limiting on `/api/users/authenticate`, no request validation. |
| Containers run as root | No `USER` directive in `api/Dockerfile`, `frontend/Dockerfile`, `loadbalancer/Dockerfile`, or the root `dockerfile`. Container-hardening basics that a reference repo should be modelling. |
| No health checks | No `HEALTHCHECK` in any Dockerfile; no `healthcheck:`/`depends_on: condition:` in any compose file. Express starts before Mongo is ready and just logs a connection error rather than retrying. |
| No resource limits | `manifest/*.yaml` K8s deployments have no `resources.requests`/`limits`. |

### 1.4 Dependency & image currency (P1)

Checked against the npm registry on 2026-08-20.

**Frontend** (`frontend/package.json`)

| Package | Current | Latest | Note |
|---|---|---|---|
| `@angular/*` | 21.0.3 | **22.1.3** | one major behind |
| `@angular/cli` | 21.0.2 | 22.1.5 | |
| `@ng-bootstrap/ng-bootstrap` | **20.0.0-rc.0** | 21.0.0 | **a release candidate is pinned as a production dep** — this is almost certainly why `frontend/Dockerfile` needs `--legacy-peer-deps` |
| `ngx-toastr` | 19.1.0 | 20.0.5 | |
| `@fortawesome/fontawesome-free` | 6.5.2 | 7.3.1 | major behind |
| `@types/node` | 22.10.2 | 26.2.0 | |
| `bootstrap` | 5.3.2 | 5.3.8 | |
| `prettier` | 3.3.0 | 3.9.6 | |
| `prettier-plugin-organize-imports` / `-tailwindcss` | 3.2.4 / 0.6.1 | — | **the Tailwind plugin is installed in a Bootstrap project.** Dead dependency. |
| `express`, `@angular/ssr`, `@angular/platform-server` | present | — | **dead weight — see §1.5** |

**Backend** (`api/package.json`)

| Package | Current | Latest | Note |
|---|---|---|---|
| `express` | 4.21.2 | **5.2.1** | major behind — and the *frontend* already carries Express 5, so the repo ships both majors |
| `mongoose` | 8.10.0 | **9.9.3** | major behind |
| `dotenv` | 16.3.1 | 17.4.2 | major behind |
| `@types/express` | 4.17.25 | — | must move with Express 5 |
| `jest` | **not installed** | — | `"test": "jest"` — **`npm test` fails immediately** |
| `eslint` / `@typescript-eslint/*` | **not installed** | — | `"lint": "eslint . --ext .ts"` — **`npm run lint` fails immediately**. `api/.eslintrc` is also the legacy format; ESLint 9 requires flat config (`eslint.config.js`) |

Do **not** blindly take `typescript@7.0.2` — Angular 22 pins a supported TS range. Track Angular's constraint, not `latest`.

**Base images**

| Image | Current | Should be |
|---|---|---|
| `api/Dockerfile`, `frontend/Dockerfile` | `node:22-alpine` | `node:24-alpine` (Node 24 is Active LTS; 22 is in maintenance) |
| root `dockerfile` | `node:20-alpine` | **Node 20 is EOL** — delete the file |
| `loadbalancer/Dockerfile` | `nginx` (unpinned, not alpine) | `nginx:1.29-alpine` |
| `frontend/Dockerfile` stage 2 | `nginx:alpine` | pin the minor |
| all compose | `mongo:latest` | `mongo:8.0` |

**Syntax/tooling drift**

- `FROM node:22-alpine as builder` — lowercase `as` triggers a BuildKit `StageNameCasing` warning. Use `AS`.
- `RUN npm ci --production` in `api/Dockerfile` — deprecated flag; use `npm ci --omit=dev`.
- `frontend/Dockerfile` uses `npm install --legacy-peer-deps` instead of `npm ci`, so **the committed `package-lock.json` is not honoured** and builds are not reproducible.
- `api/tsconfig.json`: `target: "es2016"`, `moduleResolution: "node"` — ancient for a Node 22/24 runtime.

### 1.5 README claims the code does not support (P0 — credibility)

This is the most damaging category. Each of these is something a visitor can disprove in under a minute.

| Claim | Where | Reality |
|---|---|---|
| **"Angular SSR"** | GitHub repo description, `docs/index.md` | `frontend/angular.json` has **no `server`, `ssr`, or `prerender` config whatsoever**. `frontend/Dockerfile` builds browser-only and serves via nginx. `server.ts`, `main.server.ts`, `app.config.server.ts` are dead files. `"serve:ssr:contacts": "node dist/contacts/server/server.mjs"` points at an artifact that is **never produced**. `provideClientHydration()` in `app.config.ts` hydrates nothing. |
| **"Angular 19"** | `docs/index.md` "What You'll Learn" | Repo is on 21. The README says 21, the docs site says 19. |
| **"MongoDB 7.0"** | README Tech Stack, `environment.ts` | Compose pulls `mongo:latest` (8.x). |
| **"Express.js 4.21"** | `environment.ts` | True for the API, but the frontend ships Express 5 — two majors in one repo. |
| **"TypeScript throughout the entire stack"** | README Overview | `api/tsconfig.json` has `strict: false` **and** `noImplicitAny: false`. Frontend is littered with `any` (`allContacts = signal<any[]>([])`, `contactToDelete: any`, `data.sort((a: any, b: any) => ...)`). |
| **"Enhanced Security: internal services remain isolated"** | `docs/index.md` | `27017:27017` is published to the host in the nginx production compose file. |
| **"Roadmap 2026: Q1 Testing & Quality, Q2 UI Modernization"** | README + `docs/roadmap.md` | It is **August 2026** with zero commits since December 2025. Q1 and Q2 shipped nothing. A dated roadmap that has visibly lapsed is worse than no roadmap. |

### 1.6 Documentation & links (P1)

- **Broken on the live docs site** (`https://nitinksingh.com/mean-docker/`, which the `nitin27may.github.io` URL 301s to):
  - `architecture.html` → **404**, but `docs/index.md` links to it. `docs/architecture.md` sets `has_children: true` + `permalink: /docs/architecture`, so the file exists but not at the linked URL.
  - `../api/README.html` → **404** (linked from `docs/index.md`)
  - `../frontend/README.html` → **404** (linked from `docs/index.md`)
  - `../loadbalancer/README.html` → **404** (linked from `docs/index.md`)
  - Cause: the Jekyll build uses `source: ./docs`, so nothing outside `docs/` is ever published. These four links can never resolve as written.
- `CONTRIBUTING.md` links `docs/local-devlopment.html` — a `.html` link inside a GitHub-rendered markdown file. **Broken on GitHub.** Should be `.md`.
- `docs/local-devlopment.md` — **filename is misspelled** ("devlopment"). Renaming breaks inbound links; needs a Jekyll `redirect_from`.
- README's **"View Demo" link points to `http://localhost`** — the second link on the landing page and it is meaningless to a visitor. Should point to the docs site or be removed.
- `docs/_config.yml` footer: `Copyright © 2025`.
- Repo `homepage` is set to `nitin27may.github.io/mean-docker/` but that 301s to `nitinksingh.com/mean-docker/`. Set the canonical directly.
- `has_wiki: true` — an empty wiki tab competing with the docs site.

**On README length:** at 8.3 KB the README is **not** too long — the ratio to the docs site is about right. The problems are structural, not volumetric: heavy raw-HTML `<table>`/`<td>` blocks that render inconsistently outside github.com and extract poorly for the AI coding assistants that increasingly surface repos like this one, plus a "Getting Started" that omits the `docker-compose.hub.yml` fast path entirely. Trim the HTML tables, not the content.

### 1.7 Open-source health (P1)

GitHub community profile score: **71%**.

| Present | Missing |
|---|---|
| `LICENSE` (MIT), `README.md`, `CONTRIBUTING.md`, `.github/ISSUE_TEMPLATE/{bug_report,feature_request}.md`, `.github/FUNDING.yml`, 10 labels, Discussions on | `SECURITY.md`, `CODE_OF_CONDUCT.md`, `.github/PULL_REQUEST_TEMPLATE.md`, `CODEOWNERS`, `CHANGELOG.md`, `.github/dependabot.yml` |

- **Releases: exactly one (`v1.0.0`), one tag.** For 71 forks and 118 stars there is no versioned artifact anyone can pin or cite. Docker Hub has no version tags either.
- Labels are the stock GitHub set plus `WIP` and `dependencies`. Nothing domain-specific (`area: frontend`, `area: api`, `area: docker`, `area: docs`) — so `good first issue` cannot be scoped, which is the single cheapest way to convert a 71-fork audience into contributors.
- Zero open issues, zero open PRs. Nothing for an interested visitor to pick up.
- The Angular 21 upgrade was landed by the **GitHub Copilot coding agent** (branch `copilot/update-angular-21-and-packages`, PRs #94/#95) — worth knowing, because that is where several of the half-finished states above (SSR files left behind, RC dependency, stale docs) came from.

### 1.8 Code quality & testing (P2)

- `.spec.ts` files exist (`app.component`, `layout.component`, `contact-list/details/form`, `register`) but **nothing runs them** — no CI step, and the API has no test runner installed at all.
- Angular 21 defaults new projects to **Vitest**; this repo is still on Karma + Jasmine.
- Still uses `provideZoneChangeDetection` — **zoneless has been stable since Angular v20**. For a repo selling "modern practices," this is the most visible miss.
- `console.log(data)` left in `contact-list.component.ts:47`.
- `frontend/` has **no ESLint config at all**.
- `angular.json` commits a `cli.analytics` UUID (`d893c76f-…`) — should be `false` so forks do not inherit your analytics identity.
- `api/src/config/database.ts` exports `connectDB()` that **nothing calls** — `server.ts` does its own inline `mongoose.connect`. Two sources of truth, one dead.
- `loadbalancer/nginx.conf`: duplicate `server_name` directives (second silently overrides the first), `resolver` inside `location` blocks while also using static `upstream` blocks (contradictory — upstreams resolve once at startup), no `X-Forwarded-For`/`X-Forwarded-Proto`, no WebSocket upgrade headers, no gzip, no `client_max_body_size`. The `EXPOSE` comment says port 8080 while the directive says 80.
- Root `.gitignore` is 3 lines (`data`, `mongo/db`, `.env`) with no `node_modules` — it works only because `api/` and `frontend/` carry their own.

---

## Part 2 — Remediation Plan

Sequenced so that **the repo is never left more broken than it started**. Phases 1–2 are independently shippable and deliver most of the visitor-facing value.

### Phase 0 — Land the plan publicly (do this now; code work starts tomorrow)

The point of this phase is that anyone landing on the repo tomorrow can see that it is being actively worked, what is being fixed, and where. Nothing is fixed in this phase — only the tracking scaffolding and the plan itself are committed.

**0.1 Clone and branch**

```bash
git clone https://github.com/nitin27may/mean-docker.git
cd mean-docker
git checkout -b chore/2026-modernization
```

**0.2 Open the tracking issue** (`gh issue create`, labels `enhancement` + `help wanted`)

Title: **`2026 modernization: fix broken CI, config defects, and dependency drift`**

Body: the condensed audit — the four P0 clusters (dead CI, config defects, security, README claims that the code does not support), a phase checklist with a task line per PR, a note that the work happens on `chore/2026-modernization`, and an explicit invitation to comment or pick up a phase. Link the full audit at `.claude/plans/`. Keep the phase checklist as GitHub task-list checkboxes so progress is visible from the issue without opening a PR.

Then open the sub-issues for the `good first issue` candidates from §1.8 (stray `console.log`, `cli.analytics: false`, the dead `connectDB()`, the nginx `EXPOSE 8080` comment) and link them to the tracker. Right now there are zero open issues, so a 71-fork audience has no entry point for contributing.

**0.3 Commit the plan and agent config into the repo**

All working artifacts live in a repo-local `.claude/` — never scattered in the repo root, never only in a developer's global `~/.claude` — so they are committed with the project and travel with it:

```
mean-docker/
├── CLAUDE.md                       # root instructions file
└── .claude/
    ├── settings.json
    ├── plans/
    │   └── 2026-modernization.md   # Parts 1 + 2 of this document
    ├── commands/
    ├── agents/
    └── rules/
```

Write `CLAUDE.md` (contents specified in Phase 4 below), including a "Working Artifacts Location" section so future sessions know where plans and rules belong.

**0.4 Push and open a draft PR**

```bash
git push -u origin chore/2026-modernization
gh pr create --draft --title "2026 modernization" --body "Tracks #<issue>. Plan: .claude/plans/2026-modernization.md"
```

A draft PR from day one means the branch is discoverable from the repo's PR tab, not just the branch list, and every subsequent phase PR can target it or reference it.

**0.5 Baseline capture** (before touching any code, tomorrow)

`cp .env.example .env && docker compose -f docker-compose.nginx.yml up --build` — record exactly what breaks and paste it into the tracking issue. That baseline is the regression reference for every later phase, and it publicly documents the starting state.

---

### Phase 1 — Stop the bleeding (P0)

**PR 1 — Fix CI and unblock the badges**

- All three build workflows: `Ubuntu-20.04` → `ubuntu-latest`; `checkout@v2` → `@v5`; `setup-qemu-action@v1` → `@v3`; `setup-buildx-action@v1` → `@v3`; `login-action@v1` → `@v3`; `build-push-action@v2` → `@v6`.
- Drop the unused `secrets: GIT_AUTH_TOKEN=${{ secrets.MYTOKEN }}` block — nothing in any Dockerfile consumes it.
- Tag strategy: publish `:latest`, `:${{ github.ref_name }}`, and `:sha-${{ github.sha }}` instead of `:latest` alone.
- `jekyll-gh-pages.yml`: `branches: [ main ]` → `branches: [ master ]`. **This is a one-word fix that resurrects the entire docs site's auto-deploy.**
- New `.github/workflows/ci.yml`, triggered on `pull_request` + `push: master`: matrix over `api/` and `frontend/` running `npm ci`, `npm run lint`, `npm run build`, `npm test`, plus a `docker compose -f docker-compose.nginx.yml build` smoke job. Gate this PR on the lint/test scripts actually existing (Phase 3) — until then scope `ci.yml` to build-only and add lint/test in Phase 3.
- New `.github/dependabot.yml`: weekly `npm` (`/api`, `/frontend`), `docker`, and `github-actions` ecosystems, grouped minor+patch, `dependencies` label.

*Verify:* push the branch, confirm all workflows go green in the Actions tab, confirm the three README badges render green.

**PR 2 — Fix the configuration defects**

- All three compose files: `EXPRESS_PORT=${MONGO_DB_DATABASE}` → `PORT=${EXPRESS_PORT:-3000}` (matching what `api/src/server.ts` actually reads); add `EXPRESS_PORT=3000` to `.env.example`.
- `docker-compose.hub.yml`: `MONGO_DB_PARAMETERS=${MONGO_DB_PORT}` → `${MONGO_DB_PARAMETERS}`.
- Replace `links:` with `depends_on:` + an explicit `networks:` block across all three files.
- `docker-compose.nginx.yml`: **remove the `27017:27017` host publish** — that is what makes the "single entry point" claim true.
- Pin `mongo:latest` → `mongo:8.0` everywhere; update the README and `environment.ts` to say 8.0.
- **Delete** the root `dockerfile` (orphan, Node 20 EOL) and `api/docker-compose.yml` (orphan, broken paths).
- Remove `BASE_HREF` from `.env.example`, or re-wire it into `frontend/Dockerfile` — decide one; do not leave a documented variable that does nothing.
- Add `healthcheck:` to the mongo and express services and `depends_on: { condition: service_healthy }` so Express waits for Mongo.

**PR 3 — Security**

- `api/src/server.ts`: delete `console.log(MONGODB_URI)`. `api/src/config/database.ts`: delete the URI log. Log a redacted host/db only.
- `api/src/config/env.ts`: **fail fast** — if `process.env.SECRET` is unset or equals the `.env.example` placeholder, `throw` on boot with a clear message. Remove the `'default-secret-for-jwt'` fallback entirely.
- `.env.example`: replace `SECRET=your-jwt-secret-key` with a comment showing `openssl rand -base64 48`, and mirror that in the README quick-start so `cp .env.example .env` no longer yields a working-but-insecure default.
- `auth.middleware.ts`: **remove the `req.query.token` branch.** `Authorization: Bearer` only.
- Add `helmet` and `express-rate-limit` (tighter limit on the authenticate route); replace bare `cors()` with an origin allowlist read from env.
- Add non-root `USER` to `api/Dockerfile`, `frontend/Dockerfile`, `loadbalancer/Dockerfile`; add `HEALTHCHECK` to each.
- Add `resources.requests`/`limits` to every `manifest/*-deployment.yaml`.

**PR 4 — Make the README true**

Every item here is either "fix the code" or "fix the claim." Pick one per row; do not leave both.

- **SSR:** decide. Either (a) restore it properly — add `server`/`ssr`/`outputMode` to `angular.json`, build the server bundle, run it in the container — or (b) **delete `frontend/server.ts`, `main.server.ts`, `app.config.server.ts`, `app.config.ts`'s `provideClientHydration()`, the `serve:ssr:contacts` script, and the `@angular/ssr` / `@angular/platform-server` / `express` deps**, then strike "Angular SSR" from the GitHub description and `docs/index.md`. *Recommendation: (b).* The nginx-served SPA is the architecture the compose files, the docs, and the diagrams all describe; SSR is vestigial and adds three unused runtime dependencies.
- `docs/index.md`: "Angular 19" → "Angular 22".
- README "View Demo → http://localhost" → point at `https://nitinksingh.com/mean-docker/`.
- **Replace the dated "Roadmap 2026" with an undated "Planned / Not planned" section.** A quarterly roadmap on a semi-annually-maintained repo will lapse again by definition. Same edit in `docs/roadmap.md`.
- Convert the raw-HTML `<table>`/`<td>` blocks (Tech Stack, Deployment Modes, Features) to plain markdown tables — better rendering off-GitHub and better extraction by AI coding assistants.
- Add a short "looking for the .NET equivalent?" note near the top pointing at [`clean-architecture-docker-dotnet-angular`](https://github.com/nitin27may/clean-architecture-docker-dotnet-angular), so visitors who want the modern .NET/Angular reference land in the right place.
- Add the `docker-compose.hub.yml` fast path to Getting Started — it is the fastest start and the README never mentions it.

---

### Phase 2 — Documentation & OSS health (P1)

**PR 5 — Fix every broken link**

- `docs/index.md`: remove or re-target the four dead links (`architecture.html`, `../api/README.html`, `../frontend/README.html`, `../loadbalancer/README.html`). Either move the three component READMEs into `docs/` as Jekyll pages, or link them to their `github.com/.../blob/master/...` URLs.
- Fix `docs/architecture.md`'s `permalink` / `has_children` so `architecture.html` resolves.
- `CONTRIBUTING.md`: `docs/local-devlopment.html` → `docs/local-devlopment.md`.
- Rename `docs/local-devlopment.md` → `docs/local-development.md` with `redirect_from: /local-devlopment.html` in the front matter.
- `docs/_config.yml`: footer `2025` → `2026`; set `url` to the canonical `nitinksingh.com` domain.
- Update the repo `homepage` field to the canonical URL. Turn off the empty wiki.
- After merging, re-run the link sweep from §1.6 and confirm every path returns 200.

**PR 6 — Community health files**

- `SECURITY.md` — supported versions, private reporting via GitHub Security Advisories, response expectation.
- `CODE_OF_CONDUCT.md` — Contributor Covenant 2.1.
- `.github/PULL_REQUEST_TEMPLATE.md` — description, linked issue, testing performed, checklist.
- `CODEOWNERS` — `* @nitin27may`.
- `CHANGELOG.md` — Keep a Changelog format, backfilled from the v1.0.0 tag forward.
- Enable GitHub private vulnerability reporting + secret scanning in repo settings.
- Add scoped labels: `area: frontend`, `area: api`, `area: docker`, `area: docs`, `area: ci`.
- **Cut a `v2.0.0` release** once Phase 3 lands, with Docker Hub images tagged `2.0.0` alongside `latest`. This is the single highest-leverage gap: 71 forks currently have nothing to pin.
- File 3–5 genuinely scoped `good first issue`s from the P2 backlog (§1.8) so the fork audience has an entry point.

---

### Phase 3 — Modernization (P1)

**PR 7 — Backend**

- `express` 4.21 → **5.2**, `@types/express` to match. Express 5 changes error handling for async middleware, `req.query` is now a getter, and wildcard route syntax changed — walk `api/src/routes/api.routes.ts` and both controllers.
- `mongoose` 8.10 → **9.9**. Review `api/src/models/{user,contact}.ts` for removed callback-style APIs and `strictQuery` default changes.
- `dotenv` 16 → 17.
- `api/tsconfig.json`: `target: es2016` → `ES2023`, `moduleResolution: node` → `node16`/`bundler`, and **turn on `strict: true` + `noImplicitAny: true`** — this is what makes the README's "TypeScript throughout" claim honest. Expect a meaningful round of type fixes; that work *is* the deliverable.
- **Install what the scripts already promise:** add `jest` + `ts-jest` (or `vitest` — matching the frontend choice below is simpler) so `npm test` works; add `eslint` + `@typescript-eslint/*` and migrate `api/.eslintrc` → flat-config `eslint.config.js` so `npm run lint` works.
- Delete the unused `api/src/config/database.ts`, or refactor `server.ts` to call `connectDB()` — one source of truth.
- `api/Dockerfile`: `node:22-alpine` → `node:24-alpine`; `as` → `AS`; `npm ci --production` → `npm ci --omit=dev`.

**PR 8 — Frontend: Angular 22 + zoneless + Vitest**

- `ng update @angular/core@22 @angular/cli@22`. Let the CLI schematics run; do not hand-edit versions.
- `@ng-bootstrap/ng-bootstrap` **20.0.0-rc.0 → 21.0.0 stable** — this is what should let `frontend/Dockerfile` drop `--legacy-peer-deps` and switch `npm install` → `npm ci` for reproducible builds. Verify that before closing the PR.
- `ngx-toastr` 19 → 20; `@fortawesome/fontawesome-free` 6 → 7 (icon-name changes — sweep the templates); `bootstrap` → 5.3.8; `@types/node` → 26; `prettier` → 3.9.
- **Remove `prettier-plugin-tailwindcss`** — there is no Tailwind in this project.
- **Zoneless:** `provideZoneChangeDetection({ eventCoalescing: true })` → `provideZonelessChangeDetection()`; drop `zone.js` from `angular.json` polyfills and from `package.json`. Components already use `ChangeDetectionStrategy.OnPush` and signals (`contact-list.component.ts`), so the surface is small — but audit every `subscribe()` that mutates state outside a signal.
- **Vitest:** migrate the `test` target from `@angular-devkit/build-angular:karma` to the Vitest builder; drop `karma*` and `jasmine*` devDependencies; port the six existing `.spec.ts` files.
- Add ESLint to `frontend/` (`ng add @angular-eslint/schematics`).
- Set `angular.json` → `cli.analytics: false`.
- Type the `any`s in `contact-list.component.ts` and friends against the existing `contact.interface.ts`; delete the stray `console.log(data)`.
- `frontend/Dockerfile`: `node:22-alpine` → `node:24-alpine`; `as` → `AS`; pin `nginx:alpine` → `nginx:1.29-alpine`.
- Keep TypeScript at whatever range Angular 22 supports. **Do not jump to TS 7.**

**PR 9 — Nginx**

- `loadbalancer/nginx.conf`: remove the duplicate `server_name`; drop the contradictory `resolver`-plus-static-`upstream` combination (pick Docker DNS resolution *or* static upstreams); add `X-Forwarded-For` / `X-Forwarded-Proto` / `X-Real-IP`; add WebSocket `Upgrade`/`Connection` headers; add `gzip on` and `client_max_body_size`; fix the stale port-8080 comment.
- `loadbalancer/Dockerfile`: `FROM nginx` → `FROM nginx:1.29-alpine`; add non-root `USER` and `HEALTHCHECK`.

---

### Phase 4 — Agent tooling (new files)

Root `CLAUDE.md` + a repo-local `.claude/` holding `agents/`, `plans/`, `rules/`, and `settings.json`. Most of this is created in Phase 0; Phase 4 fills in the parts that depend on the post-modernization command set.

#### 4.1 Official Anthropic skills and plugins

Verified against the live marketplaces on 2026-08-20. Both are real and installable; neither needs vendoring into the repo.

| Source | What it is |
|---|---|
| `anthropics/claude-code` → marketplace `claude-code-plugins` | 13 official plugins incl. `code-review`, `pr-review-toolkit`, `commit-commands`, `security-guidance`, `feature-dev`, `hookify`, `plugin-dev` |
| `anthropics/skills` → marketplaces `example-skills`, `document-skills`, `claude-api` | 19 official skills incl. `webapp-testing`, `frontend-design`, `mcp-builder`, `skill-creator` |

Worth adopting for this repo specifically:

- **`security-guidance`** — a hook that warns on edits touching auth, secrets, and credential handling. Given §1.3 (secret logging, JWT fallback, query-param tokens), this is the one that maps most directly onto how this repo actually failed.
- **`pr-review-toolkit`** / **`code-review`** — 71 forks and no PR automation today. Pairs with the `ci.yml` from Phase 1.
- **`webapp-testing`** (from `anthropics/skills`) — browser-driven verification of the Angular UI. It is the honest way to validate the zoneless migration in Phase 3 PR 8, where the failure mode is "the UI silently stops updating."

**Important distinction:** plugins install into a developer's *own* Claude Code (`/plugin marketplace add anthropics/claude-code`, then `/plugin install <name>`) — they are **not** committed to the repo. So the deliverable here is **documentation, not configuration**: a short "Working with AI coding agents" section in `CONTRIBUTING.md` listing the recommended plugins and the one-line install commands. Do not attempt to vendor or auto-install them; that would be presumptuous in a public repo with 71 forks.

#### 4.2 Project-scoped MCP (`.mcp.json` at repo root)

`.mcp.json` **is** committed and **is** shared with everyone who clones — Claude Code reads it and prompts each user for approval before starting any server. That makes it genuinely useful and worth being conservative about.

| Server | Package | Why |
|---|---|---|
| `chrome-devtools-mcp` | `chrome-devtools-mcp@1.7` | Drive the running app at `localhost` — verify login, contact CRUD, and pagination after the zoneless migration. Also covers the global "re-verify visually" rule. |
| `mongodb-mcp-server` | `mongodb-mcp-server@2.1` | Inspect the seeded `contact_db` directly, which is how you confirm the `init-mongo.sh` seeding and the Mongoose 9 upgrade in Phase 3 PR 7. |

Rules for this file, given it ships to the public:
- **No secrets, no connection strings.** The Mongo server's URI comes from the developer's local `.env` via `${MONGO_DB_...}` expansion, never a literal — consistent with the global workflow rule.
- Only `npx`-launched, well-known, first-party packages. A `.mcp.json` in a public repo is an execution surface; every entry must be defensible on its own.
- Pin major versions rather than floating `@latest`, for the same reason the base images get pinned in Phase 1.
- Do **not** add a GitHub MCP server here — it is already available user-scoped and duplicating it just creates a second auth prompt.

Document the file in `CONTRIBUTING.md`: what each server does, that approval is prompted, and that it is entirely optional to accept.

#### 4.3 Repo files

**`CLAUDE.md`** at repo root:
- Stack and versions (post-Phase-3), with an explicit "keep these in sync" note listing `README.md`, `docs/index.md`, and `frontend/src/environments/environment.ts` — the three places version strings drift.
- The env-var contract: every variable in `.env.example`, which service reads it, and **which code path actually consumes it** (the `PORT` vs `EXPRESS_PORT` confusion is exactly what this section prevents recurring).
- Commands: build, test, lint, and each of the three compose modes with what each exposes.
- Architecture in one paragraph + the request-routing table.
- **Gotchas**, carried forward from this audit: default branch is `master` not `main` (workflows must target `master`); `docker-compose.hub.yml` serves prebuilt images that are only as fresh as the last CI publish; Mongo seed data lives in `mongo/init-db.d/init-mongo.sh` and only runs on an empty `mongo/db` volume — `rm -rf mongo/db` to reseed.

Plus a **"Working Artifacts Location"** section: memory, rules, and plans live in the repo-local `.claude/` only — not the repo root, not a global `~/.claude` — so they are committed with the project and travel with it.

**`.claude/`** (tracked in git):
- `settings.json` — permission allowlist for the routine read-only commands (`docker compose ps/logs`, `npm run *`, `git status/diff`).
- `plans/2026-modernization.md` — this document (created in Phase 0). Sub-plans go under `plans/`.
- `rules/` — repo-specific rules, starting with the version-string sync rule from `CLAUDE.md`.
- `agents/` — a small set scoped to this stack: `explorer`, `planner`, `test-runner`, `code-auditor`, `architecture-reviewer`.
- `commands/verify.md` — the full chain: `npm ci && npm run lint && npm run build && npm test` in both `api/` and `frontend/`, then `docker compose -f docker-compose.nginx.yml build`.
- `commands/bump-deps.md` — the semi-annual routine: check npm latest for both manifests, check base-image currency, run `ng update`, re-run `/verify`, update the version strings in the three sync-sensitive files above.
- `commands/audit.md` — re-run this audit's checks (badge status, broken-link sweep, Docker Hub tag freshness, npm drift) so the next pass is mechanical.
- Add `.claude/settings.local.json` to `.gitignore`.

**`.mcp.json`** at repo root — per §4.2.

**`docs/audit-2026-08.md`** — Part 1 of this document, published as a Jekyll page. It doubles as a transparency signal for contributors and as the baseline for the next audit.

---

## Critical files

| File | Phase |
|---|---|
| `.github/workflows/{angular,express,nginx}-build-and-push.yml` | 1 |
| `.github/workflows/jekyll-gh-pages.yml` (`main` → `master`) | 1 |
| `.github/workflows/ci.yml`, `.github/dependabot.yml` (new) | 1 |
| `docker-compose.yml`, `docker-compose.nginx.yml`, `docker-compose.hub.yml` | 1 |
| `api/src/{server.ts, config/env.ts, config/database.ts, middlewares/auth.middleware.ts}` | 1, 3 |
| `.env.example`, `README.md`, `docs/index.md` | 1, 2 |
| `dockerfile`, `api/docker-compose.yml` (**delete both**) | 1 |
| `docs/_config.yml`, `docs/architecture.md`, `docs/local-devlopment.md`, `CONTRIBUTING.md` | 2 |
| `SECURITY.md`, `CODE_OF_CONDUCT.md`, `.github/PULL_REQUEST_TEMPLATE.md`, `CODEOWNERS`, `CHANGELOG.md` (new) | 2 |
| `api/{package.json, tsconfig.json, Dockerfile, .eslintrc → eslint.config.js}` | 3 |
| `frontend/{package.json, angular.json, Dockerfile, src/app/app.config.ts}` | 3 |
| `frontend/{server.ts, main.server.ts, src/app/app.config.server.ts}` (**delete** if SSR option b) | 1 |
| `loadbalancer/{nginx.conf, Dockerfile}` | 3 |
| `manifest/*-deployment.yaml` | 1 |
| `CLAUDE.md`, `.claude/{settings.json, plans/, rules/, agents/, commands/}` (new) | **0** and 4 |
| `.mcp.json` (new), `CONTRIBUTING.md` "Working with AI coding agents" section | 4 |
| `docs/audit-2026-08.md` (new) | 4 |

---

## Verification

**Per phase — the quick start must work from a cold clone.** This is the acceptance test that matters, because it is the one every visitor runs:

```bash
rm -rf mongo/db && cp .env.example .env
# edit .env: set SECRET per the new instructions
docker compose -f docker-compose.nginx.yml up --build
```
Then: `http://localhost` loads → login with the seeded account → contact list renders with 5 seeded contacts → create/edit/delete a contact → `curl http://localhost/api/...` returns JSON → `http://localhost:3000/api-docs` serves Swagger. Confirm `docker compose logs express | grep -i mongodb://` returns **nothing** (Phase 1 PR 3). Confirm `curl -s localhost:27017` fails from the host under `docker-compose.nginx.yml`.

Repeat for `docker compose up` (dev, ports 4000/3000) and `docker compose -f docker-compose.hub.yml up` — the last one only after Phase 1 PR 1 has republished the images.

**Phase 1:** all four workflows green in the Actions tab; three README badges rendering green; `https://nitinksingh.com/mean-docker/` rebuilds on a push to `master`; fresh Docker Hub tags with a semver alongside `latest`.

**Phase 2:** re-run the §1.6 link sweep — every path 200. GitHub community profile score reaches 100%.

**Phase 3:** `npm ci && npm run lint && npm run build && npm test` passes in **both** `api/` and `frontend/` (all four commands — none of them work today). Zoneless: exercise every route and confirm the UI updates, with particular attention to `contact-list` pagination/filter and the toastr notifications, since those are the most likely zoneless regressions. Frontend build succeeds **without** `--legacy-peer-deps`.

**Phase 0:** the branch exists on the remote, the tracking issue renders its phase checklist correctly, the draft PR links to both the issue and `.claude/plans/2026-modernization.md`, and the plan file is readable on github.com. `git log --oneline origin/master..chore/2026-modernization` shows only the plan/CLAUDE.md commit — **no code changes**.

**Phase 4:** run `/verify` from a clean clone using only `CLAUDE.md` as the guide and confirm it succeeds with no outside knowledge. Accept the `.mcp.json` prompt in a fresh session and confirm both servers start and that neither required a secret from the file.

**Cross-cutting:** run `gitleaks detect` over the full history before cutting `v2.0.0` — the repo is 8 years old and has logged a credential-bearing connection string to stdout for some of that time.
