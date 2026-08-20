---
layout: default
title: Frontend Structure
parent: Architecture
nav_order: 2
---

# Angular Frontend Structure
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

## Directory Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── @core/                  # cross-cutting concerns, used by every feature
│   │   │   ├── components/
│   │   │   │   ├── notification/   # toast host, rendered once at the app root
│   │   │   │   └── validation/     # vendored error-tailor (see the note below)
│   │   │   ├── guards/             # authGuard
│   │   │   ├── interceptors/       # jwtToken, error
│   │   │   ├── layout/             # header, footer, layout shell
│   │   │   ├── models/             # User, NewUser, ProfileUpdate
│   │   │   └── services/           # UserService, NotificationService, ValidationService
│   │   ├── feature/
│   │   │   ├── contact/            # list, form, details, service, resolver, routes
│   │   │   └── user/               # login, register, profile, home
│   │   ├── app.component.ts        # router outlet + the toast host
│   │   ├── app.config.ts           # application providers
│   │   └── app.routes.ts           # top level routes, lazily loading each feature
│   ├── environments/
│   └── styles.css
├── eslint.config.js
├── angular.json
└── Dockerfile
```

`@core` is prefixed with `@` so it sorts to the top of the tree and reads
distinctly from a feature folder. There is no `shared/`: anything shared lives
in `@core`, and anything used by exactly one feature stays inside it.

## There Are No NgModules

The application is entirely standalone components. Each declares its own
`imports`, and routes lazy-load features with `loadChildren` pointing at a
route file rather than a module.

## Change Detection Is Zoneless

`app.config.ts` provides `provideZonelessChangeDetection()`, and `zone.js` is
not a dependency. This has one consequence worth internalising before writing a
component here:

**View state must live in a signal.** A `subscribe()` that assigns to a plain
class field updates the data and never repaints. Every component uses
`ChangeDetectionStrategy.OnPush` alongside signals.

```ts
// Correct — the view tracks the signal
allContacts = signal<Contact[]>([]);
this.contactService.getAll().subscribe({
    next: (data) => this.allContacts.set(data),
});

// Wrong under zoneless — the data changes, the screen does not
allContacts: Contact[] = [];
this.contactService.getAll().subscribe({
    next: (data) => (this.allContacts = data),
});
```

Derived state uses `computed()`, so paging and filtering in the contact list
recalculate without any manual change detection.

## Templates

Built-in control flow only — `@if`, `@for`, `@switch`. `*ngIf` and `*ngFor` are
lint errors. Note that `@if` does not narrow a signal call across the block, so
bind it once:

```html
@if (contact(); as contact) {
  {{ contact.firstName }}
}
```

## Forms

Reactive forms, typed with a `FormGroup<T>` interface per form, and every
control `nonNullable` so `getRawValue()` returns a real object rather than a
`Partial`. Validation messages are rendered by the error-tailor directives,
configured once in `app.config.ts`.

## Services and HTTP

Services use `inject()` rather than constructor parameters. Each one declares
the `ApiResponse<T>` envelope the API returns and maps to `data`, so components
never see the wrapper. The JWT interceptor attaches the token; the error
interceptor centralises failure handling.

## Notifications

`NotificationService` holds a signal of active toasts, and
`NotificationContainerComponent` renders them with ng-bootstrap's `NgbToast`.
Call `success()`, `error()` or `info()` from anywhere.

One trap, learned the hard way: do **not** bind `[class]` on a component host —
it replaces the classes the component sets on itself, which is how the toasts
once ended up in the DOM and invisible. Use `[class.name]` bindings.

## A Note on the Vendored Validation Code

`@core/components/validation` is a vendored copy of
[`@ngneat/error-tailor`](https://github.com/ngneat/error-tailor). It has scoped
ESLint exemptions so it stays diffable against upstream — its selectors bind to
Angular's own form directives and its input alias is part of the library's API.
Do not "fix" its naming.

## Testing

Vitest, via the Angular CLI's unit-test builder. Specs configure providers
explicitly with `provideZonelessChangeDetection()`, `provideRouter([])` and
`provideHttpClientTesting()`.

```bash
pnpm test
```
