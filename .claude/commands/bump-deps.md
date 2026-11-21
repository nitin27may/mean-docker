---
description: The semi-annual dependency pass
---

This repo is maintained roughly twice a year. This is that pass.

## 1. See what has moved

```bash
cd api && pnpm outdated; cd ../frontend && pnpm outdated
```

Also check base image currency: `node`, `nginx` and `mongo` tags in
`api/Dockerfile`, `frontend/Dockerfile`, `loadbalancer/Dockerfile` and the
three compose files.

## 2. Angular first, via the CLI

```bash
cd frontend
pnpm dlx @angular/cli@latest update @angular/core@<next> @angular/cli@<next>
```

Let the schematics run. Do not hand-edit Angular versions in `package.json`.

Then check the ecosystem packages, because they lag Angular majors and will
block the upgrade: `@ng-bootstrap/ng-bootstrap` tracks Angular closely, and
anything that does not have a release for the new major needs a decision
before you go further, not after.

**TypeScript follows Angular's supported range, not npm `latest`.**

## 3. Backend

```bash
cd api && pnpm update --latest
```

Read the changelog for any major. Express and Mongoose majors both change
runtime behaviour that the type checker will not catch.

## 4. Sync the version strings

Three files drift, and when they drift the README starts making claims the code
does not support:

- `README.md` — tech stack table and the Mermaid diagram labels
- `docs/index.md` — the "What You'll Learn" list
- `frontend/src/environments/environment.ts`

Also update `CHANGELOG.md` and check `docs/roadmap.md` for entries that have
gone stale.

## 5. Verify

Run `/verify` in full. A dependency bump that has not had the stack brought up
is not finished.

## Traps found in the 2026-11 pass

- **Build every image after a base-image bump.** Dependabot moved Node 24 → 26 and the images
  stopped building — Node 25+ does not bundle corepack. Lint and unit tests cannot see this.
- **Check MongoDB's lifecycle, not just Docker Hub tags.** A Rapid Release can be end of life while
  its tag still exists. Look at the tag's `last_updated`: a tag that has not been rebuilt in months
  is not receiving security patches.
- **A MongoDB major is a data migration.** Test the old volume under the new image before writing
  the CHANGELOG, and say what users must do.
- **Respect pnpm's `minimumReleaseAge`.** If `pnpm add` offers a `minimumReleaseAgeExclude` entry,
  pin the previous release instead.
- **Vitest 5 makes `vite` a peer.** Declare it explicitly, or pnpm keeps a stale auto-installed copy
  that `pnpm update` will not move.
- **Read the open Dependabot PRs, not just `pnpm outdated`.** Count them against each ecosystem's
  `open-pull-requests-limit`; a full queue hides newer majors entirely.
