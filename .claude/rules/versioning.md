# Version strings must stay in sync

Version numbers for the stack are duplicated in three places. They drift, and when they drift the
README starts making claims the code does not support — which is the single most damaging failure
mode for a reference repo.

When bumping Angular, Express, Node, or MongoDB, update **all three** in the same commit:

1. `README.md` — the Tech Stack table and the Mermaid architecture diagram labels
2. `docs/index.md` — the "What You'll Learn" list
3. `frontend/src/environments/environment.ts` — the `angular`, `expressjs`, and `mongoDb` fields

Also check `docs/roadmap.md` for a "Completed Milestones" entry that has gone stale.

## Pinning rules

- Base images are pinned to a minor (`node:24-alpine`, `nginx:1.29-alpine`, `mongo:8.0`).
  Never `:latest` — it makes the README's stated versions unverifiable.
- TypeScript tracks the range Angular supports, not npm `latest`. Angular pins a supported TS
  range and jumping ahead of it breaks the build.
- No release candidates or pre-releases as production dependencies.
