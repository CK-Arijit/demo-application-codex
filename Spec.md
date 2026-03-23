# Fullstack Web Application Specification

## 1. Overview

### 1.1 Objective
Build a secure, responsive, type-safe fullstack web application where authenticated users can view and edit their Salesforce-linked account details from a protected dashboard.

### 1.2 Core User Journey
1. User authenticates with Clerk.
2. User is redirected to `/dashboard` (protected route).
3. Backend resolves Clerk user email.
4. Backend queries Salesforce via `jsforce` using an Integration User.
5. Account data is rendered in the dashboard.
6. User updates fields and submits changes.
7. Backend updates Salesforce and returns fresh account data.
8. UI reflects updates immediately.
9. User can log out at any time.

### 1.3 Tech Stack
- Framework: Next.js (App Router)
- Language: TypeScript
- Runtime: Node.js runtime (for API routes that use `jsforce`)
- Authentication: Clerk
- UI: Tailwind CSS + Shadcn UI
- Backend Data Source: Salesforce via `jsforce`
- Error Monitoring: Sentry

---

## 2. Functional Requirements

### 2.1 Authentication
- Clerk must be used for login/logout.
- Unauthenticated users must not access protected routes.
- `/dashboard` is protected.
- Successful login should route users to `/dashboard`.
- Logout action must terminate session and route to public page (e.g., `/sign-in` or `/`).

### 2.2 Dashboard
- Route: `/dashboard`
- Display and allow editing of the following account fields:
  - First Name
  - Last Name
  - Email
  - Phone
  - Address
- Form must support validation and clear inline error messages.
- Save action must persist to Salesforce via backend API.
- Updated values should be shown immediately after successful save.

### 2.3 Salesforce Integration
- Use Salesforce Integration User credentials from secure environment variables.
- Use `jsforce` for all Salesforce communication.
- Link user identity through email:
  - Get authenticated Clerk user email.
  - Query Salesforce Contact by email.
  - Resolve linked Account from Contact.
  - Read/update the relevant fields on Account (and Contact if needed per mapping).
- Never expose Salesforce credentials or query details to client-side code.

### 2.4 Edit and Update Behavior
- User can edit values on dashboard form.
- Updates are submitted through `PUT /api/account`.
- API applies partial updates (only submitted fields).
- UI refreshes from API response after successful update.
- Display success confirmation (toast/inline status).

### 2.5 API Layer
Secure server-side API endpoints:
- `GET /api/account`
  - Returns account details for authenticated user.
- `PUT /api/account`
  - Accepts validated updates for authenticated user.
  - Writes to Salesforce and returns updated data.

Constraints:
- API routes must enforce authentication.
- Salesforce communication must happen only on server-side.
- API must return sanitized errors.

### 2.6 Error Handling
- Frontend runtime errors must be captured by Sentry.
- Backend/API errors must also be captured by Sentry.
- User-facing errors must be generic, non-sensitive.
- Detailed diagnostics should exist only in logs/Sentry.

### 2.7 UI/UX
- Use Tailwind CSS + Shadcn UI components.
- Clean, modern, responsive dashboard layout.
- Color palette:
  - Primary: `#032d60`
  - Secondary: `#0a9dda`
  - Neutral: white and black
- Support light and dark themes.
- Default theme: light.
- Provide explicit theme toggle in UI.

---

## 3. Non-Functional Requirements

### 3.1 Security
- Environment variables for secrets only; no hardcoded secrets.
- All Salesforce credentials must remain server-only.
- Validate and sanitize all API inputs.
- Enforce auth checks for all protected API routes/pages.

### 3.2 Scalability and Maintainability
- Clear separation: UI, domain/business logic, integrations, API contracts.
- Modular, scalable folder structure.
- Reusable abstractions for Salesforce queries and transformations.

### 3.3 Type Safety
- Full TypeScript coverage for:
  - API request/response contracts
  - Form schemas
  - Salesforce DTO mapping
  - Shared domain models
- Runtime validation for external input (e.g., Zod).

### 3.4 Reliability and Observability
- Sentry integrated in client and server.
- Structured error boundaries for UI and route handlers.
- Fail gracefully during Salesforce outages.

---

## 4. Recommended Next.js App Router Folder Structure

```text
.
├── app/
│   ├── (public)/
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── page.tsx
│   ├── (protected)/
│   │   └── dashboard/
│   │       ├── page.tsx
│   │       ├── loading.tsx
│   │       └── error.tsx
│   ├── api/
│   │   └── account/
│   │       └── route.ts
│   ├── layout.tsx
│   ├── error.tsx
│   └── globals.css
├── components/
│   ├── dashboard/
│   │   ├── account-form.tsx
│   │   ├── account-header.tsx
│   │   └── account-skeleton.tsx
│   ├── theme/
│   │   └── theme-toggle.tsx
│   └── ui/                      # shadcn generated components
├── features/
│   └── account/
│       ├── account.service.ts   # business orchestration for account fetch/update
│       ├── account.mapper.ts    # SFDC -> UI/domain mapping
│       ├── account.types.ts
│       └── account.schema.ts    # zod schemas
├── lib/
│   ├── auth/
│   │   └── clerk.ts
│   ├── salesforce/
│   │   ├── connection.ts
│   │   ├── contact.repository.ts
│   │   ├── account.repository.ts
│   │   └── queries.ts
│   ├── sentry/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── edge.ts
│   ├── api/
│   │   ├── responses.ts
│   │   └── errors.ts
│   └── utils/
│       └── logger.ts
├── middleware.ts                # Clerk route protection
├── sentry.client.config.ts
├── sentry.server.config.ts
├── sentry.edge.config.ts
├── env/
│   ├── client.ts
│   └── server.ts
├── types/
│   └── api.ts
├── .env.local
├── .env.example
└── Spec.md
```

Notes:
- Keep API handlers thin; move integration and business rules into `features/` and `lib/`.
- Keep all Salesforce access in `lib/salesforce/*` only.

---

## 5. Authentication and Authorization Design

### 5.1 Clerk Integration
- Add Clerk middleware in `middleware.ts`.
- Configure route matcher so `/dashboard` and `/api/account` require auth.
- Use Clerk server helpers in route handlers and server components to get the authenticated user.

### 5.2 Protected Route Rules
- If unauthenticated:
  - Page routes redirect to sign-in.
  - API routes return `401 Unauthorized`.
- If authenticated but no matching Salesforce record:
  - Return `404` with safe message, e.g., `Account not found`.

### 5.3 Logout
- Use Clerk’s sign-out method in dashboard header/user menu.
- Redirect to public route after sign-out.

---

## 6. Salesforce Integration Specification

### 6.1 Connection
- Use `jsforce.Connection` initialized with env credentials.
- Recommended auth: OAuth2 username-password flow for integration user (or JWT flow if available in org policy).
- Reuse connection per request lifecycle; avoid exposing connection object to client.

### 6.2 Identity Mapping Logic
1. Read primary email from Clerk user.
2. Query Salesforce Contact by email (case-insensitive handling if needed).
3. Read `Contact.AccountId`.
4. Query Account by `AccountId`.
5. Build response DTO for UI.

### 6.3 Field Mapping (Recommended)
Because requested UI fields include person-level and account-level data, use explicit mapping:
- `firstName` -> `Contact.FirstName`
- `lastName` -> `Contact.LastName`
- `email` -> `Contact.Email`
- `phone` -> prefer `Contact.Phone`; fallback `Account.Phone` for display
- `address` -> combined account address string (from billing fields) or dedicated custom field

If Person Accounts are enabled in org, mapping may differ; document with a config flag in implementation.

### 6.4 Update Strategy
- Validate payload (Zod) and allow partial updates only.
- Split update payload by entity:
  - Contact fields update `Contact` record.
  - Account fields update `Account` record.
- Execute updates transactionally where possible; otherwise perform sequential updates with robust failure handling and clear status.

---

## 7. API Contract

### 7.1 `GET /api/account`

Auth:
- Required (Clerk session)

Response `200`:

```json
{
  "data": {
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane@example.com",
    "phone": "+1 555-0100",
    "address": "1 Market St, San Francisco, CA 94105"
  }
}
```

Errors:
- `401` unauthenticated
- `404` no linked contact/account
- `502` Salesforce unavailable
- `500` internal error

### 7.2 `PUT /api/account`

Auth:
- Required (Clerk session)

Request body (partial allowed):

```json
{
  "firstName": "Jane",
  "phone": "+1 555-0111",
  "address": "10 Main St, New York, NY 10001"
}
```

Validation:
- `firstName`, `lastName`: non-empty strings, max length defined
- `email`: valid email
- `phone`: normalized string format
- `address`: bounded text length

Response `200`:

```json
{
  "data": {
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane@example.com",
    "phone": "+1 555-0111",
    "address": "10 Main St, New York, NY 10001"
  }
}
```

Errors:
- `400` validation failed
- `401` unauthenticated
- `404` no linked contact/account
- `409` update conflict (optional)
- `502` Salesforce unavailable
- `500` internal error

### 7.3 Error Response Shape

```json
{
  "error": {
    "code": "ACCOUNT_FETCH_FAILED",
    "message": "Unable to fetch account details right now."
  }
}
```

Rules:
- No stack traces in response.
- Internal IDs and detailed exception messages only in logs/Sentry.

---

## 8. Frontend Dashboard Specification

### 8.1 Page Composition
- Header section with app title, theme toggle, user menu/logout.
- Main card with account form.
- Save button with loading state.
- Optional cancel/reset button.

### 8.2 UX States
- Loading: skeleton placeholders.
- Success: toast/banner confirmation.
- Field validation errors: inline under fields.
- API failure: generic alert/toast with retry option.
- Disabled submit unless form dirty and valid.

### 8.3 Responsiveness
- Mobile-first layout.
- Single-column form on small screens.
- Improved spacing and grouped rows on larger screens.

### 8.4 Theming
- Implement CSS variables for semantic tokens:
  - `--color-primary: #032d60`
  - `--color-secondary: #0a9dda`
  - light/dark neutral tokens
- Use `next-themes` with class strategy.
- Default initial theme set to light.

---

## 9. Data Flow

### 9.1 End-to-End Flow
1. User authenticates via Clerk.
2. Clerk session grants access to protected `/dashboard`.
3. Dashboard requests `GET /api/account`.
4. API validates session and extracts Clerk email.
5. Backend queries Salesforce using Integration User via `jsforce`.
6. Contact by email is resolved; linked Account fetched.
7. API returns normalized account DTO.
8. UI renders details in form.
9. User edits and submits form to `PUT /api/account`.
10. API validates payload, updates Salesforce, and returns refreshed DTO.
11. UI updates immediately with returned data.
12. User can logout through Clerk.

### 9.2 Data Ownership
- Clerk: identity and session.
- Salesforce: source of truth for business/account profile data.
- Next.js API: secure orchestration and transformation layer.
- Frontend: presentation and optimistic interaction only.

---

## 10. Edge Cases and Handling

### 10.1 Salesforce API Failure
- Symptoms: timeout, auth failure, rate limits, transient errors.
- Handling:
  - Return `502` with generic message.
  - Log full error to Sentry with request context.
  - Show non-sensitive retry message on UI.

### 10.2 Unauthorized Access
- Page request without session: redirect to sign-in.
- API request without session: `401`.
- Never leak whether a specific email exists in Salesforce for unauthenticated users.

### 10.3 Partial Updates
- Support sparse payload updates.
- Only update provided fields.
- Preserve existing Salesforce values for omitted fields.
- Return full normalized record after update.

### 10.4 Missing Salesforce Records
- Authenticated user email not found in Contact:
  - Return `404` with safe message.
  - Log with warning-level context in Sentry.

### 10.5 Concurrent Updates
- Last-write-wins default behavior (unless org policy requires stricter concurrency).
- Optionally use `LastModifiedDate` guard for conflict detection.

---

## 11. Security and Environment Variables

### 11.1 Required Environment Variables

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard

# Salesforce
SALESFORCE_LOGIN_URL=https://login.salesforce.com
SALESFORCE_CLIENT_ID=
SALESFORCE_CLIENT_SECRET=
SALESFORCE_USERNAME=
SALESFORCE_PASSWORD=
SALESFORCE_SECURITY_TOKEN=

# Sentry
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_DSN=
SENTRY_AUTH_TOKEN=

# App
NODE_ENV=development
```

### 11.2 Secret Management Rules
- Keep secrets in `.env.local` (ignored in git).
- Maintain `.env.example` with placeholder keys only.
- Access server secrets only from server modules.
- Validate env at startup using a typed schema.

---

## 12. Error Monitoring (Sentry)

### 12.1 Frontend
- Initialize Sentry client config.
- Capture unhandled runtime exceptions and rejected promises.
- Attach user/session-safe metadata (no sensitive payload data).

### 12.2 Backend
- Initialize Sentry server config.
- Capture route-handler exceptions.
- Tag errors by endpoint (`/api/account`) and operation (`fetch`, `update`).

### 12.3 Privacy
- Scrub PII where possible.
- Do not send secrets, auth headers, or raw credentials in events.

---

## 13. Validation and Type Contracts

### 13.1 Domain Types (Example)

```ts
export type AccountProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
};

export type AccountUpdateInput = Partial<AccountProfile>;
```

### 13.2 Runtime Validation
- Use Zod schema for `PUT /api/account` input.
- Validate string lengths, format, and emptiness constraints.
- Return standardized validation errors (`400`).

---

## 14. Performance and Reliability Considerations

- Keep Salesforce query fields minimal.
- Avoid unnecessary round-trips; batch data retrieval when possible.
- Add request-level timeout handling for Salesforce calls.
- Consider in-memory short-lived caching for read-heavy scenarios (optional future enhancement).

---

## 15. Testing Strategy

### 15.1 Unit Tests
- Mapper tests: Salesforce DTO -> domain model.
- Schema tests: payload validation edge cases.
- Service tests: success and failure branches.

### 15.2 Integration Tests
- API route tests for:
  - authenticated success
  - unauthenticated `401`
  - not found `404`
  - Salesforce failure `502`
  - partial update behavior

### 15.3 E2E Tests
- Sign-in -> dashboard load.
- Edit and save account fields.
- Theme toggle persistence and rendering.
- Logout and route protection behavior.

---

## 16. Implementation Milestones

1. Initialize Next.js app with Tailwind + Shadcn + TypeScript.
2. Integrate Clerk auth and route protection.
3. Build dashboard UI and form state/validation.
4. Implement Salesforce connection layer with `jsforce`.
5. Implement `GET /api/account` and `PUT /api/account`.
6. Add Sentry client/server integration.
7. Add dark/light theme toggle (default light).
8. Complete tests and harden edge-case handling.

---

## 17. Acceptance Criteria

- Users can authenticate via Clerk and access `/dashboard` only when signed in.
- `/dashboard` displays mapped Salesforce account/contact details.
- Users can edit and save required fields.
- `GET /api/account` and `PUT /api/account` are authenticated and server-only for Salesforce calls.
- Frontend and backend errors are visible in Sentry.
- UI is responsive, uses required color palette, and supports light/dark theme with light default.
- Partial updates work without overwriting unspecified fields.
- Sensitive data is never exposed in client responses.

