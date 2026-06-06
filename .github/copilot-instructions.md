# Copilot Instructions

- Keep changes minimal and focused on the user's request.
- Preserve the existing project structure and formatting.
- Prefer clear, straightforward Markdown when adding documentation.
- Update the README when setup or behavior changes, or when custom instructions are updated in a way that affects setup, routes, or deployment.
- Avoid adding dependencies or complexity unless they are clearly needed.
- Preserve the Onion Architecture boundaries: Domain -> Application -> Infrastructure -> API.
- Keep API controllers thin and place orchestration in MediatR handlers.
- The solution is a .NET 9 backend plus a Next.js 16 frontend in frontend/mststechvibe-webapp.
- Verify backend changes with dotnet build MSTSTechVibe.sln and dotnet test MSTSTechVibe.sln --no-build.
- Verify frontend changes with cd frontend/mststechvibe-webapp && npm run build && npm run lint.
- Current public API routes include /api/health and /api/v1/*.
- When backend contracts change, keep the API payloads, frontend guidance, and README aligned.
