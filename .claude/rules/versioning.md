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

- Base images are pinned to a minor (`node:24-alpine`, `nginx:1.29-alpine`, `mongo:8.2`).
  Never `:latest` — it makes the README's stated versions unverifiable.
- **MongoDB stays at 8.2 or newer.** 8.0 will not start on Linux kernel 6.19+ (SERVER-121912).
- TypeScript tracks the range Angular supports, not npm `latest`. Angular pins a supported TS
  range and jumping ahead of it breaks the build.
- No release candidates or pre-releases as production dependencies. A pinned RC is what forced
  `--legacy-peer-deps` into the frontend image, which meant the committed lockfile was ignored and
  builds were not reproducible.
- Before an Angular major, check that every Angular-coupled dependency has a release for it.
  ngx-toastr did not have one for 22 and had to be replaced; finding that out early is much cheaper
  than finding it out mid-upgrade.
