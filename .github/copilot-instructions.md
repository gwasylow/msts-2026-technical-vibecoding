# Copilot Instructions

- Keep changes minimal and focused on the user's request.
- Preserve the existing project structure and formatting.
- Prefer clear, straightforward Markdown when adding documentation.
- Update the README when setup or behavior changes, or when new instructions are added.
- Avoid adding dependencies or complexity unless they are clearly needed.
- Preserve the Onion Architecture boundaries: Domain -> Application -> Infrastructure -> API.
- Keep API controllers thin and place orchestration in MediatR handlers.
- When backend contracts change, keep the API payloads and frontend integration guidance aligned.
