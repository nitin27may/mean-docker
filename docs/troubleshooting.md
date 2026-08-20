---
layout: default
title: Troubleshooting
nav_order: 8
---

# Troubleshooting
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

Every failure listed here has actually happened to someone running this repo.
If you hit something that is not here, please
[open an issue](https://github.com/nitin27may/mean-docker/issues/new?template=bug_report.md) —
a first-run failure that is not documented is a bug in the documentation.

---

## The API container exits immediately

```
Error: SECRET is missing or still set to the .env.example placeholder.
Generate one with:  openssl rand -base64 48
```

**This is intentional.** The API refuses to start without a real JWT signing
key, because the old fallback was a value published in this repository — every
deployment that followed the README shared a signing key that anyone could look
up.

```bash
sed -i "s|^SECRET=.*|SECRET=$(openssl rand -base64 48)|" .env
docker compose -f docker-compose.nginx.yml up -d
```

The key must be at least 32 characters.

---

## MongoDB will not start

```
MongoDB cannot start: Linux kernel versions 6.19 and newer has a known
incompatibility with this version of MongoDB.
```

MongoDB 8.0 does not run on Linux kernel 6.19 or newer
([SERVER-121912](https://jira.mongodb.org/browse/SERVER-121912)). This repo
pins `mongo:8.2` for exactly that reason. If you see this, something is pulling
an older tag — check for a local override:

```bash
grep -rn "image: mongo" docker-compose*.yml     # should all say 8.2
docker compose -f docker-compose.nginx.yml pull database
uname -r                                         # your kernel version
```

---

## "Port is already allocated"

```
Bind for 0.0.0.0:3000 failed: port is already allocated
```

Something else on your machine already owns that port. Find it, or move ours:

```bash
ss -tlnp | grep -E ':(80|3000|4000|27017)\b'
```

The dev compose file reads the host API port from `.env`, so you can change it
without editing any compose file:

```bash
echo "EXPRESS_PORT=3100" >> .env
```

For port 80 in the Nginx modes, edit the `ports:` mapping — change `80:8080` to
`8081:8080` and use `http://localhost:8081`.

---

## Login fails with the seeded account

The seed script runs **only against an empty data volume**. If you changed the
credentials in `.env` after the first start, MongoDB still has the old ones, and
the API is now authenticating with the new ones.

```bash
docker compose -f docker-compose.nginx.yml down -v
docker compose -f docker-compose.nginx.yml up --build
```

`down -v` drops the `mongo-data` volume, which is what triggers reseeding.
Seeded login: `nitin27may@gmail.com` / `P@ssword#321`.

---

## The contact list is empty but the API returns data

Check the browser console and the network tab first. Two likely causes:

1. **The token is missing or expired.** Log out and back in. The API accepts
   tokens only from the `Authorization: Bearer` header — if you are testing with
   `?token=`, that stopped working deliberately.
2. **The UI is not repainting.** The frontend is zoneless, so view state has to
   live in a signal. If you changed a component to assign to a plain field, the
   data updates and the screen does not. See the
   [frontend structure guide](angular-frontend-structure.html).

---

## `429 Too Many Requests` when logging in

The authenticate route allows 10 attempts per 15 minutes per IP. Testing login
failures in a loop will hit it. Wait it out, or restart the API container to
reset the counter:

```bash
docker compose -f docker-compose.nginx.yml restart express
```

---

## A container is marked unhealthy but the service works

If you added a healthcheck, make sure it targets `127.0.0.1` and not
`localhost`. The Nginx-based images listen on IPv4 only, and `localhost`
resolves to `::1` first — so the check fails against a perfectly healthy
container.

```bash
docker inspect --format '{{json .State.Health}}' mean_angular | jq
```

---

## `pnpm install` fails with ERR_PNPM_IGNORED_BUILDS

pnpm blocks dependency install scripts by default. Each workspace declares its
policy in `pnpm-workspace.yaml` — `frontend/` allows the four packages that
unpack build binaries, `api/` declines the one analytics package. If you add a
dependency that needs its install script, add it there rather than approving it
interactively, so CI and Docker builds behave the same way.

---

## The frontend build fails after changing dependencies

```bash
cd frontend && pnpm install --frozen-lockfile
```

If that errors, `package.json` and `pnpm-lock.yaml` have diverged. Run
`pnpm install` to update the lockfile and **commit it** — the Docker build and
CI both use `--frozen-lockfile` and will fail rather than silently resolving
something different.

---

## Changes to the frontend do not appear

The Angular image is a production build; it does not hot-reload. Either rebuild:

```bash
docker compose -f docker-compose.nginx.yml up -d --build angular
```

or run the dev server directly, which does hot-reload:

```bash
cd frontend && pnpm run serve       # http://localhost:4200, proxies /api to :3000
```

---

## Everything is broken and I want to start over

```bash
docker compose -f docker-compose.nginx.yml down -v --remove-orphans
docker compose -f docker-compose.nginx.yml up --build
```

This drops the database volume, so you get freshly seeded data. Nothing in your
working tree is touched — the database lives in a named volume, not a bind
mount.

---

## Verifying a Change Properly

Before opening a PR:

```bash
cd api      && pnpm run lint && pnpm run build && pnpm test
cd frontend && pnpm run lint && pnpm run build && pnpm test
docker compose -f docker-compose.nginx.yml up --build
```

Then actually use the app: log in, create a contact, edit it, delete it. The
unit tests will not tell you the UI stopped repainting.
