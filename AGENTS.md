# Repository Guidelines

## General Instrctions
- Always create typescript files

## Project Structure & Module Organization
- Use `SPEC.md` as the source of truth for architecture and behavior.
- `app/` contains App Router routes:
  - public pages under `app/(public)/`
  - protected dashboard under `app/(protected)/dashboard/`
  - account API in `app/api/account/route.ts`
- Keep route handlers thin. Put logic in:
  - `features/account/` for schemas, domain types, mapping, and orchestration
  - `lib/salesforce/` for all `jsforce` access
  - `lib/auth/`, `lib/api/`, `lib/sentry/` for shared cross-cutting concerns
- UI components belong in `components/dashboard/`, `components/theme/`, and `components/ui/`.

## Build, Test, and Development Commands
- `npm run dev`: start local development server.
- `npm run build`: compile production build and catch build-time issues.
- `npm run start`: run built app locally.
- `npm run lint` / `npm run lint:fix`: run/fix ESLint issues.
- `npm run format` / `npm run format:check`: apply/check Prettier formatting.
- Minimum pre-PR check: `npm run lint && npm run format:check && npm run build`.

## Coding Style & Naming Conventions
- New feature code should be TypeScript (`.ts`/`.tsx`) per SPEC type-safety goals.
- Prettier config is canonical: 2 spaces, semicolons, double quotes, trailing commas (`es5`), width 100.
- Use `PascalCase` for components/types, `camelCase` for functions/variables.
- Keep framework file names standard (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts`).
- Validate external input with Zod before business logic.

## Testing Guidelines
- Required areas from SPEC:
  - unit: mapper, schema, and service branch logic
  - integration: `GET/PUT /api/account` success and error paths (`400/401/404/502`)
  - E2E: sign-in, dashboard load, edit/save flow, theme toggle, logout protection
- Prefer `*.test.ts` naming and colocate tests by feature/module.

## Security & Observability
- Never expose Salesforce credentials or connection details to client code.
- Enforce Clerk auth on `/dashboard` and `/api/account`.
- Keep secrets in `.env.local`; commit placeholders only in `.env.example`.
- Return sanitized API errors; send detailed diagnostics to Sentry.

## Commit & Pull Request Guidelines
- History currently has vague messages (for example, `changes made`); use clear imperative commits instead.
- Recommended format: `<type>: <summary>` (example: `feat: implement account profile DTO mapper`).
- PRs should include scope, why the change is needed, linked issue (if any), screenshots for UI updates, and local verification commands run.
