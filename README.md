# MSTSTechVibe

MSTSTechVibe is a full-stack solution with a .NET 9 backend organized in a classic Onion Architecture and a Next.js frontend. The backend uses CQRS with MediatR and FluentValidation, and the frontend is prepared to talk to the current ASP.NET Core API.

## Solution Structure

- [MSTSTechVibe.sln](MSTSTechVibe.sln)
- [src/MSTSTechVibe.Domain](src/MSTSTechVibe.Domain)
- [src/MSTSTechVibe.Application](src/MSTSTechVibe.Application)
- [src/MSTSTechVibe.Infrastructure](src/MSTSTechVibe.Infrastructure)
- [src/MSTSTechVibe.Api](src/MSTSTechVibe.Api)
- [tests/MSTSTechVibe.Application.Tests](tests/MSTSTechVibe.Application.Tests)
- [frontend/mststechvibe-webapp](frontend/mststechvibe-webapp)
- [.github/copilot-instructions.md](.github/copilot-instructions.md)
- [.github/instructions](.github/instructions)

## Architecture

- Domain contains core entities and business primitives.
- Application contains CQRS requests, handlers, validators, and interfaces.
- Infrastructure contains framework adapters such as repository and user-context implementations.
- API exposes controller-based endpoints, JWT authentication, Swagger, and CORS for a Next.js client.
- Frontend contains the Next.js web application, shared API client utilities, and the UI surface for backend integration.

## API Surface

- `GET /api/health` is available for liveness checks.
- `GET /api/v1/vibe-messages` returns vibe messages for authenticated users.
- `POST /api/v1/vibe-messages` creates a new vibe message for authenticated users.

## Local Development

```bash
dotnet build MSTSTechVibe.sln
dotnet test MSTSTechVibe.sln
dotnet run --project src/MSTSTechVibe.Api/MSTSTechVibe.Api.csproj
```

```bash
cd frontend/mststechvibe-webapp
npm install
npm run dev
```

Update the JWT and CORS settings in [src/MSTSTechVibe.Api/appsettings.json](src/MSTSTechVibe.Api/appsettings.json) before integrating a real identity provider or frontend deployment.

Set `NEXT_PUBLIC_API_BASE_URL` in the frontend environment when the API is not running on `http://localhost:5137`.
