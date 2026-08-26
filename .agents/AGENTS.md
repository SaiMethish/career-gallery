# AGENTS.md — Job Portal Angular Frontend

This file governs how any AI coding agent (Antigravity) should work in this repository. The backend (Spring Boot + PostgreSQL) is already implemented and exposes REST APIs — this repo is Angular frontend only. Read this fully before generating or modifying code. If a request conflicts with this file, follow this file and flag the conflict.

---

## 1. Project Summary

- **Frontend:** Angular (standalone components), PrimeNG, NgRx
- **Backend:** Already built, consumed as REST API (do not modify backend; treat its contracts as fixed — confirm actual endpoint shapes from the existing backend/Swagger/OpenAPI docs before building against them, never assume)
- **Auth:** JWT issued by backend, RBAC enforced server-side too — frontend must mirror it (guards, interceptors, UI gating)
- **Design source:** Stitch (via Stitch MCP) — every screen must match the Stitch spec exactly in spacing, typography, color tokens, and component states. Never freehand a layout when a Stitch frame exists for it.

---

## 2. Build Order (STRICT — do not skip ahead)

Build in this order. Do not start on feature pages until Phase 0–2 are fully done, tested, and working end-to-end against the real backend.

### Phase 0 — Project Scaffolding
- Angular workspace, standalone components, strict TypeScript mode (`strict: true`)
- Environment config (`environment.ts` / `environment.prod.ts`) with backend API base URL
- Linting: ESLint + Prettier, pre-commit hook if possible
- Core folder structure in place (§3) before any feature code is written
- Confirm and document the actual backend API contracts (auth endpoints, response shapes, error shapes) before writing services against them

### Phase 1 — Token & Session Management
- `AuthService`: login, logout, refresh, current-user state (NgRx `auth` feature state)
- Access token storage strategy — confirm against how the backend issues tokens (httpOnly cookie vs. response body) and document the decision; do not silently assume localStorage
- Silent refresh flow: refresh endpoint call, token rotation handling, concurrent-request queuing during refresh (don't fire multiple parallel refresh calls)
- Session expiry handling: auto-logout on refresh failure, redirect to login, preserve intended destination URL for post-login redirect
- Idle/logout handling (manual logout clears store + tokens + redirects)

### Phase 2 — RBAC & Interceptors
- Functional route guards: `authGuard` (must be logged in), `roleGuard` (must have required role(s) — read from route data)
- `authInterceptor` — attaches JWT to outgoing requests
- `errorInterceptor` — normalizes API errors into one consistent shape app-wide, handles 401 (attempt refresh → retry original request → logout if refresh fails), handles 403 (redirect to "not authorized" page), surfaces 5xx as generic toast
- Role-based structural directive (e.g. `*appHasRole="['ADMIN','EMPLOYER']"`) for conditional rendering in templates
- Central `ApiError` model + toast/notification service wired to the interceptor
- Verify RBAC end-to-end: log in as each role, confirm guards + directives + API calls behave correctly before moving on

### Phase 3 — Baseline Shell & Design System Wiring
- Role-specific layout shells (candidate shell, employer shell, admin shell) matching Stitch frames — header, sidebar/nav, footer
- Single theming file (SCSS variables or CSS custom properties) mapped from Stitch design tokens — components consume tokens, never hardcode colors/spacing
- PrimeNG theme customized to match Stitch, set up once
- Shared/reusable components built once, before any feature page needs them: toast/notification, modal/dialog, confirm-dialog, loading-spinner/skeleton, empty-state, pagination, form-field wrapper (label + error message pattern)
- Global loading indicator (via interceptor) if the design calls for one

### Phase 4 — Feature Pages (component by component)
Only after Phases 0–3 are complete and verified. Build one page/feature at a time — fully wired (UI + NgRx state + real API calls, no leftover mocks) — before starting the next. Suggested order:
1. Auth pages: login, register, forgot/reset password
2. Candidate: profile, resume upload, job search/listing, job detail, applications tracker
3. Employer: company profile, post job, manage jobs, applicant review
4. Admin: user management, job moderation, dashboards

For each page:
1. Pull the exact frame from Stitch MCP first.
2. Confirm the component breakdown (smart vs. dumb components) before implementing.
3. Confirm which backend endpoint(s) it needs and their exact request/response shape.
4. Implement, wire to store, test against the real backend.
5. Check off against the Definition of Done (§7) before moving to the next page.

---

## 3. Angular Architecture Rules

- **Standalone components only** — no NgModules unless a third-party library forces it.
- **Feature-based folder structure:**
  ```
  src/app/
    core/              # singleton services, guards, interceptors, models (shared app-wide)
      auth/
      interceptors/
      guards/
      models/
    shared/            # dumb/presentational reusable components, pipes, directives
      components/
      directives/
      pipes/
    layout/            # shells, nav, header, footer per role
    features/
      auth/
      candidate/
        profile/
        job-search/
        applications/
      employer/
        job-posting/
        applicants/
      admin/
    state/             # NgRx root store setup only
  ```
- **Component types are explicit:**
  - *Smart/container components*: inject services/store, live in `features/`
  - *Dumb/presentational components*: `@Input`/`@Output` only, no service injection, live in `shared/`
- One component = one responsibility. If a template exceeds ~150 lines or the component does more than one job, split it.
- **NgRx** per feature: `actions`, `reducer`, `effects`, `selectors`, `state` live inside that feature's folder. Only truly cross-cutting state (`auth`, `currentUser`) lives at root/core level.
- Use `inject()` function-style DI, not constructor injection, in standalone components.
- Reactive forms only for anything beyond a single field — no template-driven forms.
- Strongly type everything — no `any`. DTOs/interfaces in `core/models` must mirror the backend's real response shapes exactly.
- Lazy-load every feature route (`loadComponent` / `loadChildren`).
- Unsubscribe discipline: use `async` pipe or `takeUntilDestroyed()` — no manual subscriptions left dangling.

---

## 4. Code Quality Standards (non-negotiable)

- Meaningful names — no `data1`, `temp`, `obj`. Names describe intent, not type.
- Small functions/methods — single responsibility, ideally under ~30 lines.
- No commented-out dead code left in commits.
- Every component/service gets a short doc comment on its class explaining purpose — not restating the name.
- No magic strings/numbers — use enums/constants for roles, status values, route paths.
- Consistent naming: `camelCase` (variables/methods), `PascalCase` (classes/components), `kebab-case` (file names, routes), `UPPER_SNAKE_CASE` (constants/enums).
- No `console.log` left in committed code.
- Every new component/service ships with at least one unit test (Jasmine/Karma or Jest) covering its core logic before it's marked done.
- Accessibility basics: semantic HTML, `alt` text, keyboard-navigable interactive elements, label-input association in forms.

---

## 5. Stitch Design Integration Rules

- Before building any screen, pull the corresponding frame via Stitch MCP and extract: color tokens, spacing scale, typography, component states (default/hover/disabled/error/loading/empty).
- Map Stitch tokens into the single theming file (§3, Phase 3) — components consume tokens, never hardcode hex/px values inline.
- If a Stitch frame doesn't exist yet for a screen, do not guess — flag it and ask, or build to the closest existing pattern and mark it for design review.
- Match spacing, alignment, and responsive breakpoints exactly, not approximately.

---

## 6. API Integration Discipline

- One `*.service.ts` per feature/resource wrapping all HTTP calls for that resource — components never call `HttpClient` directly.
- Confirm the real backend response shape (including error responses) before writing a service method — don't assume a shape and adjust later.
- Keep a running reference doc (e.g. `API_CONTRACTS.md`) of endpoints actually used: method, path, request/response shape, required role. Update it as each feature is built.
- Handle loading / success / error / empty states explicitly in every data-driven component — no silent failures.

---

## 7. Definition of Done (per feature/page)

- Component structure follows §3 (smart/dumb split, correct folder, standalone)
- Matches Stitch design exactly (§5)
- Wired to the real backend (no leftover mock data)
- Role-gated correctly where applicable (guard + directive, verified by logging in as each relevant role)
- Loading / error / empty states handled and visible to the user
- Errors surfaced via the shared interceptor + toast pattern, not ad hoc `alert()`/console logs
- At least one unit test present and passing
- No lint errors, no `any`, no console.log, no dangling subscriptions

---

## 8. What the Agent Should Do at Each Step

1. State which phase/page is being worked on before generating code.
2. For non-trivial features, confirm the component breakdown before writing full implementation.
3. Search the codebase for an existing shared component/service before creating a new one.
4. Confirm the real backend contract for an endpoint before coding against it — don't invent a shape.
5. After implementing a page, note any Stitch design deviations and why.
6. Don't introduce a new library or pattern (state approach, HTTP wrapper, CSS approach) without checking it's not already established here or elsewhere in the codebase.