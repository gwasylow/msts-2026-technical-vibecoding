# MSTSTechVibe WebApp Guidance

- Follow the frontend conventions in [.github/instructions/frontend-react.instructions.md](../../.github/instructions/frontend-react.instructions.md).
- Prefer Server Components by default and use Client Components only when interaction requires them.
- Call the backend through `NEXT_PUBLIC_API_BASE_URL`; do not hardcode localhost into production code.
- Keep forms and payloads validated with Zod before sending API requests.
- Treat backend authorization as the source of truth and do not store auth tokens in `localStorage`.
- Use `npm run build` and `npm run lint` before considering a frontend change complete.
