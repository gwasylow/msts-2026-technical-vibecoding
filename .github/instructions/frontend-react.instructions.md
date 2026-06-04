---
applyTo: "frontend/mststechvibe-webapp/**/*.{ts,tsx}"
description: "Next.js frontend conventions for MSTSTechVibe when integrating with the backend API."
---

# Frontend Guidance

## API Integration

- Consume backend endpoints under `/api/v1/*` and keep request and response shapes aligned with the ASP.NET Core API.
- Centralize API calls in a shared client layer instead of scattering `fetch` calls across components.
- Treat backend validation errors as user-facing form feedback, not raw error dumps.

## Next.js Patterns

- Prefer Server Components by default and move to Client Components only when interactivity requires it.
- Keep feature code grouped by route or domain area so it maps cleanly to backend features.
- Validate outgoing form data with Zod before sending commands to the API.

## Authentication and Security

- Use secure cookies or a session-based approach for auth; do not store tokens in `localStorage`.
- Keep secrets out of client code and expose only `NEXT_PUBLIC_*` values when they are truly public.
- Assume the backend is the source of truth for authorization even if the UI hides protected actions.

## UI Contracts

- Keep naming aligned with backend DTOs where that reduces mapping noise.
- Handle loading, empty, validation-error, and unauthorized states explicitly for each API-backed screen.