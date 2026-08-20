---
layout: default
title: Roadmap
nav_order: 9
---

# Roadmap
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

# Development Roadmap

Undated on purpose. This repo gets a maintenance pass roughly twice a year, and
the previous quarterly roadmap had lapsed by two quarters before anyone noticed
— which is worse than having no roadmap at all.

## Completed

### TypeScript migration (2024)
- Express.js API fully converted to TypeScript
- Interfaces for models and controllers
- Swagger documentation for API endpoints

### Angular 21 upgrade (2025)
- Upgraded to Angular 21 and updated dependencies
- Removed SSR in favour of a static build served by Nginx
- Improved the Docker build configuration

### 2026 modernization pass
- Angular 22 with zoneless change detection and signals
- Express 5, Mongoose 9, Node 24, MongoDB 8.2
- `strict: true` across both workspaces
- ESLint and Vitest wired up and passing in `api/` and `frontend/`
- pnpm replaces npm in both workspaces
- Working CI with PR checks, multi-arch image publishing and semver tags
- Security: required JWT secret, bearer-only auth, Helmet, rate limiting,
  non-root containers, no credentials in logs or committed manifests

## Planned

### Testing
- End-to-end tests (Playwright) covering login and contact CRUD
- Coverage reporting in CI

### Access control
- Role model (admin, manager, user) with role-based navigation
- Granular permissions enforced on both ends
- OAuth 2.0 providers and refresh-token rotation

### Performance and operations
- Redis for session storage and response caching
- Helm chart alongside the raw Kubernetes manifests
- Prometheus metrics and structured request logging

## Not planned

- **Server-side rendering.** The architecture is an Nginx-served SPA; the
  vestigial SSR files were removed in the 2026 pass.
- **Replacing Bootstrap with Angular Material.** Previously listed, now
  dropped: ng-bootstrap covers what this app needs and a rewrite would not
  teach anything the repo is trying to demonstrate.

---
