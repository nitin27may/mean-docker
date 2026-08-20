# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A containerized MEAN-stack contact management application — MongoDB, Express.js, Angular, Node.js,
all TypeScript, orchestrated with Docker Compose and fronted by Nginx. It is a reference/learning
repo: the value is in the structure being correct and current, not in the feature set. Roughly 118
stars and 71 forks depend on it being right.

The 2026 modernization pass is documented in `.claude/plans/2026-modernization.md` — read it for the
reasoning behind decisions that look arbitrary, and for the audit method to repeat next time.

## Working Artifacts Location

All working artifacts — **plans, rules, and repo memory** — live in the repo-local `.claude/`
folder only:

- `.claude/plans/` — implementation plans
- `.claude/rules/` — repo-specific rules
- `.claude/commands/` — `/verify`, `/bump-deps`, `/audit`
- `.claude/settings.json` — permission allowlist (never secrets)

Do not create a top-level `plans/` folder, and do not rely on a global `~/.claude`. Keeping these
under the repo-local `.claude/` means they are committed with the project and travel with it.

## Architecture

Nginx listens on `:80` and is the only port a user needs. It proxies `/api/*` to the Express
container and everything else to the Angular container, which is itself an Nginx serving a static
browser build. Express talks to MongoDB. **There is no SSR** — this is an Nginx-served SPA by
design, and the vestigial SSR files were removed in 2026.

| Request path | Routed to | Notes |
|---|---|---|
| `/*` | `angular:4000` | static SPA assets, `try_files` fallback to `index.html` |
| `/api/*` | `express:3000` | REST API |
| — | `database:27017` | MongoDB, reached only from Express |

Nginx config lives in two places and they are not the same file: `loadbalancer/nginx.conf` is the
gateway (listens on 8080 inside the container); `frontend/nginx.conf` is the static-file server
inside the Angular image (listens on 4000).

## Key Commands

Both workspaces use **pnpm** (`corepack enable` ships it with Node).

```bash
# Production-shaped: 4 containers behind Nginx. Everything on http://localhost
docker compose -f docker-compose.nginx.yml up --build

# Development: 3 containers, ports exposed individually (4000 / 3000 / 27017)
docker compose up --build

# Prebuilt images from Docker Hub — no local build. IMAGE_TAG pins a release.
docker compose -f docker-compose.hub.yml up

# Backend                                        # Frontend
cd api                                           cd frontend
pnpm install --frozen-lockfile                   pnpm install --frozen-lockfile
pnpm run lint && pnpm run build && pnpm test     pnpm run lint && pnpm run build && pnpm test
pnpm run dev:watch                               pnpm start
```

Seeded login: `nitin27may@gmail.com` / `P@ssword#321`. Swagger: `http://localhost:3000/api-docs`.

Run `/verify` before calling anything done. "Code written" is not "works".

## Environment Contract

Copy `.env.example` to `.env`, then **set a real `SECRET`** — the API refuses to boot otherwise.

| Variable | Consumed by | Notes |
|---|---|---|
| `SECRET` | `api/src/config/env.ts` | JWT signing key. Required: boot fails if unset, still the placeholder, or under 32 chars |
| `PORT` | `api/src/config/env.ts` | the port Express listens on inside its container |
| `EXPRESS_PORT` | `docker-compose.yml` | the **host** port the dev mode publishes the API on |
| `CORS_ORIGINS` | `api/src/config/env.ts` | comma-separated allowlist; empty means same-origin in production, permissive in development |
| `MONGO_DB_USERNAME` / `_PASSWORD` | Express + Mongo init | Mongo root creds and app user |
| `MONGO_DB_HOST` / `_PORT` / `_DATABASE` | `api/src/config/env.ts` | assembled into the connection URI |
| `MONGO_DB_PARAMETERS` | `api/src/config/env.ts` | must be `?authSource=admin` |
| `MONGODB_URI` | `api/src/config/env.ts` | optional; wins over the discrete vars, for managed MongoDB |
| `ID_PROJECT` | compose | container name prefix |
| `IMAGE_TAG` | `docker-compose.hub.yml` | pins the Docker Hub images; defaults to `latest` |

## Gotchas

- **The default branch is `master`, not `main`.** Any workflow you add must target `master`.
- **CI minutes are scarce.** Verify locally; do not push to see what happens. Publish workflows are
  gated on `github.repository` so forks do not burn their own minutes, arm64 builds run on native
  ARM runners rather than QEMU, and every workflow cancels superseded runs.
- **README badges resolve by workflow name** — "Angular Build", "Expressjs Build", "Nginx Build".
  Renaming a workflow breaks the badges silently.
- **MongoDB is pinned to `8.2`, not `8.0`.** 8.0 refuses to start on Linux kernel 6.19+
  (SERVER-121912), which rules it out on current distributions.
- **The frontend is zoneless.** State that the view depends on must live in a signal. A `subscribe()`
  that assigns to a plain field will update the data and never repaint. Unit tests do not catch this
  — drive the browser.
- **`[class]` on a component host replaces the classes the component sets itself.** This is how the
  toast ended up invisible; use `[class.foo]` bindings.
- **Mongo seeding runs once.** `mongo/init-db.d/init-mongo.sh` executes only against an empty data
  volume. To reseed: `docker compose -f <file> down -v` and bring the stack back up. Data lives in
  the `mongo-data` named volume, not a bind mount, so nothing root-owned lands in your working tree.
- **`docker-compose.hub.yml` pulls from Docker Hub**, and those images are only as fresh as the last
  successful CI publish. For anything version-sensitive, build locally.
- **Healthchecks use `127.0.0.1`, not `localhost`.** The nginx images listen on IPv4 only, and
  `localhost` resolves to `::1` first, which fails against a perfectly healthy container.
- **`api/src/config/env.ts` is the only place the Mongo URI is assembled.** It used to be built in
  three places. Keep it that way.
- **The vendored error-tailor copy** under `frontend/src/app/@core/components/validation` is a copy
  of `@ngneat/error-tailor`. It has scoped ESLint exemptions so it stays diffable against upstream —
  do not "fix" its selectors or input aliases.

## Keep These In Sync

Version strings are duplicated across three files and drift constantly. When bumping anything,
update all three in the same commit:

- `README.md` — Tech Stack table and the Mermaid architecture diagram labels
- `docs/index.md` — the "What You'll Learn" list
- `frontend/src/environments/environment.ts` — the `angular` / `expressjs` / `mongoDb` fields

Then add a `CHANGELOG.md` entry. See `.claude/rules/versioning.md`.

## Conventions

- **Angular**: standalone components, no NgModules. Reactive forms. Signals for component state.
  `ChangeDetectionStrategy.OnPush`. Built-in control flow (`@if` / `@for`), not `*ngIf` / `*ngFor`.
  Feature folders under `src/app/feature/`, shared concerns under `src/app/@core/`.
- **API**: layered as `routes → controllers → models`, with middleware in `src/middlewares/`.
  Swagger annotations live in JSDoc comments on the controllers and routes; the spec itself is
  assembled once in `src/config/swagger.ts`.
- **TypeScript is strict in both workspaces.** Do not reach for `any` or loosen a tsconfig to make
  an error go away.
- **Docker**: multi-stage builds, pinned base images, non-root user, `HEALTHCHECK` on every image.
- **Security**: never log a connection string or token. Never commit a secret — `.env` and
  `manifest/secret.yaml` are gitignored for that reason.
- Guard clauses and early returns over nested conditionals. Comments explain *why*, not *what*.
