---
description: Re-run the 2026 audit's checks so the next pass is mechanical
---

The full audit lives in `.claude/plans/2026-modernization.md`. This re-runs its
mechanical checks. Report what actually changed, not what should be true.

## CI and badges

```bash
gh run list --repo nitin27may/mean-docker --limit 10
```

Every workflow should be green. The three README badges resolve by workflow
**name** ("Angular Build", "Expressjs Build", "Nginx Build") — renaming a
workflow silently breaks them.

## Docker Hub freshness

Confirm the three images (`mean-angular`, `mean-expressjs`, `mean-nginx`) have
a recent push and carry a semver tag, not just `latest`. Images that lag the
source tree make `docker-compose.hub.yml` serve something other than this repo.

## Dependency drift

```bash
cd api && pnpm outdated; cd ../frontend && pnpm outdated
```

Flag any pre-release pinned as a production dependency — that is what forced
`--legacy-peer-deps` last time.

## Link sweep

Check every link in `README.md`, `docs/index.md` and `CONTRIBUTING.md` returns
200. Two traps, both of which have bitten before:

- Jekyll builds only `./docs`, so nothing outside it can ever be published.
- `.html` links inside markdown break when GitHub renders the file.

## Claims vs code

Verify each of these against the source, not memory:

- Angular version: `frontend/package.json` vs `README.md` vs `docs/index.md`
  vs `frontend/src/environments/environment.ts`
- MongoDB version: the compose files vs the README
- `strict` is still `true` in both `tsconfig.json` files
- The roadmap has not lapsed into describing a past that never happened

## Security

```bash
gitleaks detect --no-git
docker compose -f docker-compose.nginx.yml logs express | grep -iE "mongodb://[^ ]*:[^ ]*@"
```

The second must return nothing. Also confirm the API still refuses to boot with
the `.env.example` placeholder `SECRET`.
