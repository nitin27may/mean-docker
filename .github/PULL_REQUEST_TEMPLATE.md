## What this changes

<!-- One or two sentences. What is different after this merges? -->

## Why

<!-- The problem being solved. Link the issue: Closes #123 -->

## How it was tested

<!-- Be specific. "Ran the stack and logged in" beats "tested locally". -->

- [ ] `pnpm run lint && pnpm run build && pnpm test` passes in `api/`
- [ ] `pnpm run lint && pnpm run build && pnpm test` passes in `frontend/`
- [ ] `docker compose -f docker-compose.nginx.yml up --build` comes up healthy
      and the app works at http://localhost

## Checklist

- [ ] Version strings stay in sync across `README.md`, `docs/index.md` and
      `frontend/src/environments/environment.ts` (only if versions changed)
- [ ] No secrets, tokens or connection strings are committed
- [ ] Documentation updated if behaviour changed
