---
applyTo: "frontend/mststechvibe-webapp/**/*.{ts,tsx}"
description: "Next.js frontend conventions for MSTSTechVibe when integrating with the backend API."
---

# Frontend Guidance

## API Integration

- Consume backend endpoints under `/api/v1/*` and keep request and response shapes aligned with the ASP.NET Core API.
- Use `NEXT_PUBLIC_API_BASE_URL` for the backend origin; do not hardcode localhost in production code.
- Centralize API calls in a shared client layer instead of scattering `fetch` calls across components.
- Treat backend validation errors as user-facing form feedback, not raw error dumps.
- Current screens should be built around `/api/v1/countdown` and authenticated `/api/v1/vibe-messages` flows.

## Next.js Patterns

- Prefer Server Components by default and move to Client Components only when interactivity requires it.
- Keep feature code grouped by route or domain area so it maps cleanly to backend features.
- Validate outgoing form data with Zod before sending commands to the API.
- Keep the App Router structure and component boundaries simple; avoid introducing client state unless the UI needs it.

## Authentication and Security

- Use secure cookies or a session-based approach for auth; do not store tokens in `localStorage`.
- Keep secrets out of client code and expose only `NEXT_PUBLIC_*` values when they are truly public.
- Assume the backend is the source of truth for authorization even if the UI hides protected actions.
- Rebuild the frontend image whenever the backend URL changes, because the public API base URL is baked into the build.

## UI Contracts

- Keep naming aligned with backend DTOs where that reduces mapping noise.
- Handle loading, empty, validation-error, and unauthorized states explicitly for each API-backed screen.