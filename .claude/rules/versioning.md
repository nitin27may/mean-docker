# Version strings must stay in sync

Version numbers for the stack are duplicated in three places. They drift, and when they drift the
README starts making claims the code does not support — which is the single most damaging failure
mode for a reference repo, because a visitor can disprove it in under a minute.

When bumping Angular, Express, Node, or MongoDB, update **all three** in the same commit:

1. `README.md` — the Tech Stack table and the Mermaid architecture diagram labels
2. `docs/index.md` — the "What You'll Learn" list
3. `frontend/src/environments/environment.ts` — the `angular`, `expressjs`, and `mongoDb` fields

Then add a `CHANGELOG.md` entry, and check `docs/roadmap.md` for anything that has gone stale.

## Pinning rules

- Base images are pinned (`node:26-alpine`, `nginx:1.31-alpine`, `mongo:9.0`).
  Never `:latest` — it makes the README's stated versions unverifiable.
- **MongoDB tracks majors, not Rapid Releases.** A Rapid Release (8.1, 8.2, 8.3 …) can reach end of
  life between two passes — 8.2 did. 8.0 is ruled out regardless: it will not start on Linux kernel
  6.19+ (SERVER-121912). A major bump is breaking for existing volumes; say so in the CHANGELOG.
- **Node tracks the Active LTS line**, even majors only. A Node major can change the toolchain, not
  just the runtime: Node 25+ dropped the bundled corepack, which broke every image build until the
  Dockerfiles installed it from npm.
- **Respect pnpm's `minimumReleaseAge`.** If an install wants to add a `minimumReleaseAgeExclude`
  entry, pin the previous release instead of accepting the exclusion.
- TypeScript tracks the range Angular supports, not npm `latest`. Angular pins a supported TS
  range and jumping ahead of it breaks the build.
- No release candidates or pre-releases as production dependencies. A pinned RC is what forced
  `--legacy-peer-deps` into the frontend image, which meant the committed lockfile was ignored and
  builds were not reproducible.
- Before an Angular major, check that every Angular-coupled dependency has a release for it.
  ngx-toastr did not have one for 22 and had to be replaced; finding that out early is much cheaper
  than finding it out mid-upgrade.
