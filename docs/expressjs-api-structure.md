---
layout: default
title: Backend Structure
parent: Architecture
nav_order: 1
---

# Express.js API Structure
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

## Directory Structure

```
api/
├── src/
│   ├── config/
│   │   ├── database.ts        # connectDB() — the only place a connection is opened
│   │   ├── env.ts             # config + validation; the only place the Mongo URI is assembled
│   │   └── swagger.ts         # the OpenAPI spec
│   ├── controllers/
│   │   ├── ContactController.ts
│   │   └── UserController.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts   # JWT verification, Bearer header only
│   │   └── error.middleware.ts  # notFound + the shared error shape
│   ├── models/
│   │   ├── contact.ts         # Mongoose schema + IContact
│   │   └── user.ts            # Mongoose schema + IUser
│   ├── routes/
│   │   └── api.routes.ts      # every route, with its Swagger annotations
│   └── server.ts              # middleware wiring and startup
├── eslint.config.mjs
├── vitest.config.mts
├── tsconfig.json              # strict: true
└── Dockerfile
```

There is deliberately no `services/` layer. With two models and CRUD on both, it
would be indirection without a payoff — the controllers talk to the models
directly. Add one when there is business logic that needs somewhere to live.

## Request Path

```
routes -> middleware (auth, rate limit) -> controller -> Mongoose model -> MongoDB
```

Anything that does not match a route falls through to `notFound`, and every
error funnels through one handler, so failures come back in the same JSON shape
as successes.

## Endpoints

All are prefixed with `/api`. Everything except authentication and user
creation requires `Authorization: Bearer <token>`.

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `POST` | `/user/authenticate` | No | Log in. Rate limited to 10 attempts per 15 minutes |
| `POST` | `/users` | No | Register |
| `GET` | `/users` | Yes | List users |
| `GET` `PUT` `DELETE` | `/user/:user_id` | Yes | Read, update, delete a user |
| `PUT` | `/user/changepassword/:user_id` | Yes | Change a password |
| `GET` `POST` | `/contacts` | Yes | List and create contacts |
| `GET` `PUT` `DELETE` | `/contact/:contact_id` | Yes | Read, update, delete a contact |

Note the singular/plural split: collections are `/users` and `/contacts`, single
records are `/user/:id` and `/contact/:id`. Outside `/api`, `GET /health`
reports 503 while MongoDB is disconnected and backs the container healthchecks.

Interactive docs are served from Swagger at `http://localhost:3000/api-docs` in
development mode. The annotations live in JSDoc comments on the routes.

## Response Shape

Every response uses the same envelope, which is why the frontend can type it
once as `ApiResponse<T>`:

```json
{ "status": "success", "message": "Contacts retrieved successfully", "data": [] }
```

## Configuration

`src/config/env.ts` is the single source of truth. It validates on import, so
misconfiguration fails at boot rather than on the first request:

- `SECRET` is required. No fallback — an absent or placeholder value stops the
  process with an explanation.
- The MongoDB URI is assembled in one place, and `MONGODB_URI` overrides it for
  managed databases.
- Connection strings are logged with credentials stripped.
