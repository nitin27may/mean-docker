# Security Policy

## Supported Versions

This is a reference project rather than a deployed service, so security fixes
land on `master` and are published as a new release and set of Docker images.

| Version | Supported |
|---------|-----------|
| 2.x     | Yes       |
| 1.x     | No        |

Docker Hub images are tagged with the release version alongside `latest`. Pin a
version rather than tracking `latest` if you build on this.

## Reporting a Vulnerability

Report privately through GitHub Security Advisories:
[Report a vulnerability](https://github.com/nitin27may/mean-docker/security/advisories/new).

Please do not open a public issue for a vulnerability.

Expect an acknowledgement within a week. This project is maintained in spare
time, so a fix may take longer, and the acknowledgement will say so honestly
rather than leaving you guessing.

Useful things to include: what an attacker can do, the steps to reproduce it,
and which deployment mode you were running (`docker-compose.yml`,
`docker-compose.nginx.yml`, `docker-compose.hub.yml`, or Kubernetes).

## Before You Deploy This

The defaults here are shaped for a local demo. If you put it in front of real
users:

- **Generate a real `SECRET`** — `openssl rand -base64 48`. The API refuses to
  start on the `.env.example` placeholder, deliberately.
- **Change the MongoDB credentials** in `.env`. The committed values are demo
  values and are public.
- **Change the seeded account.** `mongo/init-db.d/init-mongo.sh` creates a user
  whose password is in this repository.
- **Set `CORS_ORIGINS`** to the origins you actually serve. It falls back to
  same-origin in production and permissive in development.
- **Terminate TLS** in front of Nginx. Nothing here serves HTTPS.
- **Use a real secret store** for Kubernetes — `manifest/secret.example.yaml`
  is a template, not a secret manager.

## What Is Already Handled

- JWT signing key required at boot; no insecure fallback.
- Tokens are accepted from the `Authorization: Bearer` header only.
- Helmet security headers, and rate limiting that is tighter on the
  authenticate route.
- Containers run as non-root with healthchecks.
- Credentials are never logged; the Mongo connection string is redacted.
- In the Nginx mode, only port 80 is published — the database is not reachable
  from the host.
