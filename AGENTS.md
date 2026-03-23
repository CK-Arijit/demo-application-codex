# Repository Guidelines

## Project Structure & Module Organization
This repository is currently spec-first and contains:
- `SPEC.md`: authoritative functional and technical requirements.
- `README.md`: minimal project entrypoint.

When implementation starts, follow the structure defined in `SPEC.md` (Next.js App Router + TypeScript), with clear separation between UI (`app/`, `components/`), domain logic (`features/`), and integrations (`lib/`, especially `lib/salesforce/`). Keep API handlers thin and move business logic into services.

## Build, Test, and Development Commands
There is no app scaffold or `package.json` yet, so build/test scripts are not available.
Use these repository-level commands today:
- `git status` - inspect local changes before and after edits.
- `rg --files` - quickly list tracked source/docs files.
- `sed -n '1,200p' SPEC.md` - review requirements before coding.

After scaffolding, add and standardize:
- `npm run dev` (local app runtime)
- `npm run build` (production build)
- `npm run test` (unit/integration tests)
- `npm run lint` and `npm run format`

## Coding Style & Naming Conventions
- Language target: TypeScript with strict typing and runtime validation (Zod), per `SPEC.md`.
- Indentation: 2 spaces; prefer small, single-purpose modules.
- Naming: `kebab-case` for files, `PascalCase` for React components, `camelCase` for functions/variables, `UPPER_SNAKE_CASE` for env vars.
- Keep Salesforce access server-only and isolated in `lib/salesforce/*`.

## Testing Guidelines
No test framework is configured yet. When adding tests:
- Unit tests alongside modules or under `tests/` with mirrored structure.
- Test names should describe behavior (e.g., `account.service.test.ts`).
- Cover auth checks, API validation, Salesforce mapping, and error handling paths.

## Commit & Pull Request Guidelines
Current commit history uses short, imperative messages (`first commit`, `Spec file added`, `changes made`). Continue imperative style, but increase precision:
- Preferred format: `<type>: <summary>` (e.g., `feat: add account API contract types`).

PRs should include:
- What changed and why.
- Linked issue/spec section.
- Screenshots for UI changes.
- Notes on env/config updates and test coverage.

## Security & Configuration Tips
- Never commit secrets; use `.env.local` and keep a sanitized `.env.example`.
- Enforce authentication on protected routes and API endpoints.
- Log detailed failures only in secure observability tools; return sanitized user-facing errors.
