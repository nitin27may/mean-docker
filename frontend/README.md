# Frontend (Angular)

The Angular single-page application for the MEAN Stack Contacts system. It is
built to static files and served by Nginx — there is no server-side rendering.

For the architectural view, see the
[frontend structure guide](https://nitinksingh.com/mean-docker/angular-frontend-structure.html).

## Stack

| | |
|---|---|
| Angular | 22, standalone components, no NgModules |
| Change detection | Zoneless (`provideZonelessChangeDetection`), `zone.js` not installed |
| State | Signals, with `computed()` for derived values |
| Templates | Built-in control flow (`@if` / `@for`) |
| UI | Bootstrap 5 + ng-bootstrap 21 |
| Forms | Reactive, typed `FormGroup<T>`, error-tailor for messages |
| TypeScript | 6, strict |
| Tests | Vitest |
| Lint | ESLint + angular-eslint, including template accessibility rules |
| Package manager | pnpm 11 |

## Getting Started

Prerequisites: Node 24+ and pnpm 11 (`corepack enable` ships it with Node).

```bash
pnpm install

# dev server against a running API, proxied via proxy.conf.json
pnpm run serve

# dev server without the proxy
pnpm start
```

The app runs at `http://localhost:4200`. `pnpm run serve` proxies `/api` to
`http://localhost:3000`, so start the API first — or just run the whole stack
with Docker from the repository root, which is usually easier.

## Scripts

| Command | What it does |
|---|---|
| `pnpm start` | Dev server |
| `pnpm run serve` | Dev server with the API proxy |
| `pnpm run build` | Production build into `dist/contacts/browser` |
| `pnpm test` | Vitest |
| `pnpm run lint` | ESLint over TypeScript and templates |

## Project Layout

```
src/app/
├── @core/          # cross-cutting: guards, interceptors, layout, models, services
└── feature/        # contact/ and user/, each lazily loaded with its own routes
```

`@core` holds anything used by more than one feature. There is no `shared/`
folder — that split never survives contact with a real codebase.

## Things To Know Before Changing Code

**Zoneless means view state lives in a signal.** A `subscribe()` that assigns
to a plain field will update the data and never repaint the screen. Unit tests
will not catch it, so exercise the UI in a browser.

**Do not bind `[class]` on a component host.** It replaces the classes the
component sets on itself. Use `[class.name]` bindings. This is exactly how the
toast notifications once ended up rendered but invisible.

**`@if` does not narrow a signal call.** Bind it once with `as`:

```html
@if (contact(); as contact) { {{ contact.firstName }} }
```

**`@core/components/validation` is vendored third-party code** (a copy of
`@ngneat/error-tailor`) with scoped lint exemptions, kept diffable against
upstream. Leave its selectors and input aliases alone.

## Configuration

`src/environments/environment.ts` holds the API endpoint and the version
strings shown in the UI footer:

```ts
export const environment = {
    production: false,
    apiEndpoint: '/api',
    angular: 'Angular 22',
    bootstrap: 'Bootstrap 5',
    expressjs: 'Express.js 5',
    mongoDb: 'MongoDB 8.2',
};
```

`apiEndpoint` is rewritten at image build time from the `API_URL` build
argument — `/api` behind the Nginx gateway, or an absolute URL when the API is
published separately. The version strings must stay in sync with `README.md`
and `docs/index.md`; see `.claude/rules/versioning.md`.

## Authentication Flow

1. The login form posts to `/api/user/authenticate`.
2. On success the JWT is stored in `localStorage` under `currentUser`.
3. `jwtInterceptor` attaches it as `Authorization: Bearer <token>` to every
   subsequent request. The API accepts tokens **only** from that header.
4. `authGuard` blocks protected routes when no token is present.
5. Logging out clears the entry and redirects to the login page.

## Docker

The image is a two-stage build: Node compiles the bundle, then
`nginx:1.29-alpine` serves it as an unprivileged user on port 4000, with a
healthcheck. The Dockerfile in this directory is the source of truth — see the
[Docker guide](https://nitinksingh.com/mean-docker/docker-guide.html) for a
walkthrough.

```bash
docker build -t mean-angular .
```
