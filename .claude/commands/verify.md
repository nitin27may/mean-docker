---
description: Run the full definition-of-done chain for this repo
---

Run every check before claiming work is complete. Report failures with their
actual output; do not summarize a failure as a success.

## 1. Backend

```bash
cd api
pnpm install --frozen-lockfile
pnpm run lint
pnpm run build
pnpm test
```

## 2. Frontend

```bash
cd frontend
pnpm install --frozen-lockfile
pnpm run lint
pnpm run build
pnpm test
```

## 3. Images build

```bash
docker compose -f docker-compose.nginx.yml build
```

## 4. The stack actually works

This is the check that matters — it is the one every visitor runs.

```bash
cp .env.example .env
sed -i "s|^SECRET=.*|SECRET=$(openssl rand -base64 48)|" .env
docker compose -f docker-compose.nginx.yml up -d --build
```

Then confirm:

- All four containers reach `healthy` (`docker compose -f docker-compose.nginx.yml ps`).
- `http://localhost` serves the app, and logging in with
  `nitin27may@gmail.com` / `P@ssword#321` lands on the contact list.
- Creating, editing and deleting a contact each work and raise a toast.
- `docker compose -f docker-compose.nginx.yml logs express | grep -i "mongodb://.*:.*@"` returns nothing.
- `curl -s -m 3 localhost:27017` fails — Mongo must not be reachable from the host in this mode.

## 5. Workflows

```bash
actionlint
```

If `actionlint` is not installed, at minimum parse every file under
`.github/workflows/` as YAML. CI minutes on this repo are scarce, so workflow
mistakes are expensive to discover by pushing.
