# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A containerized MEAN-stack contact management application — MongoDB, Express.js, Angular, Node.js,
all TypeScript, orchestrated with Docker Compose and fronted by Nginx. It is a reference/learning
repo: the value is in the structure being correct and current, not in the feature set.

**Status:** a 2026 modernization pass is in flight on `chore/2026-modernization`. Read
`.claude/plans/2026-modernization.md` before making changes — it documents defects that are known
and already scheduled, so you do not need to re-discover or independently "fix" them out of order.

## Working Artifacts Location

All working artifacts — **plans, rules, and repo memory** — live in the repo-local `.claude/`
folder only:

- `.claude/plans/` — implementation plans (`2026-modernization.md` is the current master plan)
- `.claude/rules/` — repo-specific rules
- `.claude/commands/` — slash commands (`/verify`, `/bump-deps`, `/audit`)
- `.claude/agents/` — repo-scoped subagent definitions

Do not create a top-level `plans/` folder, and do not rely on a global `~/.claude`. Keeping these
under the repo-local `.claude/` means they are committed with the project and travel with it.

## Architecture

Nginx listens on `:80` and is the only port a user needs. It proxies `/api/*` to the Express
container and everything else to the Angular container, which is itself an Nginx serving a static
browser build. Express talks to MongoDB. There is no SSR despite some leftover files suggesting
otherwise — see Gotchas.

| Request path | Routed to | Notes |
|---|---|---|
| `/*` | `angular:4000` | static SPA assets, `try_files` fallback to `index.html` |
| `/api/*` | `express:3000` | REST API |
| — | `database:27017` | MongoDB, reached only from Express |

Nginx config lives in two places and they are not the same file: `loadbalancer/nginx.conf` is the
gateway; `frontend/nginx.conf` is the static-file server inside the Angular image.

## Key Commands

```bash
# Production-shaped: 4 containers behind Nginx. Everything on http://localhost
docker compose -f docker-compose.nginx.yml up --build

# Development: 3 containers, ports exposed individually (4000 / 3000 / 27017)
docker compose up --build

# Prebuilt images from Docker Hub — no local build
docker compose -f docker-compose.hub.yml up

# Backend
cd api && npm ci && npm run build && npm start     # dev: npm run dev:watch
# Frontend
cd frontend && npm ci && npm start                  # ng serve on :4200
```

Seeded login: `nitin27may@gmail.com` / `P@ssword#321`. Swagger: `http://localhost:3000/api-docs`.

## Environment Contract

Copy `.env.example` to `.env`. Which variable is actually read by which code path matters here,
because several are wired inconsistently today:

| Variable | Consumed by | Notes |
|---|---|---|
| `SECRET` | `api/src/config/env.ts` | JWT signing key |
| `MONGO_DB_USERNAME` / `_PASSWORD` | Express + Mongo init | Mongo root creds and app user |
| `MONGO_DB_HOST` / `_PORT` / `_DATABASE` | `api/src/server.ts` | assembled into the connection URI |
| `MONGO_DB_PARAMETERS` | `api/src/server.ts` | must be `?authSource=admin` |
| `PORT` | `api/src/server.ts` | the Express port that is actually read |
| `ID_PROJECT` | compose | container name prefix |
| `EXPRESS_PORT` | **nothing** | set in compose, read nowhere — see Gotchas |
| `BASE_HREF` | **nothing** | documented in `.env.example`, consumed nowhere |

## Gotchas

Read these before debugging something that looks broken — several are known and already tracked.

- **The default branch is `master`, not `main`.** Any workflow you add must target `master`.
  `.github/workflows/jekyll-gh-pages.yml` currently targets `main`, which is why the docs site
  does not auto-deploy.
- **CI is currently red.** All three Docker build workflows declare `runs-on: Ubuntu-20.04`, a
  runner GitHub retired. Every run since 2025-12-06 is `cancelled`, and the README badges are red
  as a result.
- **There is no SSR.** `frontend/server.ts`, `main.server.ts`, and `app.config.server.ts` exist and
  `package.json` has a `serve:ssr:contacts` script, but `angular.json` has no `server`/`ssr`
  target, so the server bundle is never built. Do not assume SSR works because those files are there.
- **`EXPRESS_PORT` vs `PORT`.** Compose sets `EXPRESS_PORT` (to the wrong value — the database
  name). `api/src/server.ts` reads `PORT`. The API works only because it falls back to `3000`.
- **Mongo seeding runs once.** `mongo/init-db.d/init-mongo.sh` executes only against an empty data
  volume. To reseed: `rm -rf mongo/db` and bring the stack back up.
- **`docker-compose.hub.yml` pulls `:latest` from Docker Hub**, and those images are only as fresh
  as the last successful CI publish — currently 2025-04, well behind this source tree. For anything
  version-sensitive, build locally instead.
- **`api/tsconfig.json` has `strict: false` and `noImplicitAny: false`.** Type errors you would
  expect the compiler to catch will not surface.
- **Two orphan files**: the root `dockerfile` (lowercase) and `api/docker-compose.yml` are
  referenced by nothing and describe layouts that no longer exist. Ignore them; they are scheduled
  for deletion.

## Keep These In Sync

Version strings are duplicated across three files and drift constantly. When bumping anything,
update all three:

- `README.md` — Tech Stack table and the architecture diagram labels
- `docs/index.md` — the "What You'll Learn" list
- `frontend/src/environments/environment.ts` — the `angular` / `expressjs` / `mongoDb` fields

## Conventions

- **Angular**: standalone components, no NgModules. Reactive forms. Signals for component state.
  `ChangeDetectionStrategy.OnPush`. Feature folders under `src/app/feature/`, shared concerns under
  `src/app/@core/`.
- **API**: layered as `routes → controllers → models`, with middleware in `src/middlewares/`.
  Swagger annotations live in JSDoc comments on the controllers.
- **Docker**: multi-stage builds, pinned base images, non-root user, `HEALTHCHECK` on every image.
- Guard clauses and early returns over nested conditionals. Comments explain *why*, not *what*.
