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
- `GET /api/v1/countdown` returns a configurable countdown headline and deadline.
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

Update JWT, CORS, and countdown settings in [src/MSTSTechVibe.Api/appsettings.json](src/MSTSTechVibe.Api/appsettings.json) before integrating a real identity provider or frontend deployment.

Countdown values are configured through:

- `Countdown:Headline`
- `Countdown:DeadlineUtc` (UTC ISO-8601 timestamp)

Set `NEXT_PUBLIC_API_BASE_URL` in the frontend environment when the API is not running on `http://localhost:5137`.

## Backend Containerization (Docker)

The backend API is containerized with a multi-stage Docker build at [src/MSTSTechVibe.Api/Dockerfile](src/MSTSTechVibe.Api/Dockerfile).

### Why this Docker image is production-ready

- Multi-stage build keeps the final runtime image small and excludes SDK/build tooling.
- `.dockerignore` reduces build context and keeps local artifacts out of the image.
- Container runs as a non-root user.
- Diagnostics are disabled in the runtime container (`DOTNET_EnableDiagnostics=0`).
- Health check is configured against `GET /api/health`.
- Runtime listens on port `8080`, aligned with common Azure container hosting defaults.

### Build and run locally

Build from the repository root so project references resolve correctly:

```bash
docker build \
	-f src/MSTSTechVibe.Api/Dockerfile \
	-t mststechvibe-api:local \
	.
```

Run with explicit configuration and secret values through environment variables:

```bash
docker run --rm -p 8080:8080 \
	-e ASPNETCORE_ENVIRONMENT=Production \
	-e Jwt__Issuer=MSTSTechVibe \
	-e Jwt__Audience=MSTSTechVibe.NextJs \
	-e Jwt__Key='replace-with-strong-secret-at-least-32-chars' \
	-e Cors__AllowedOrigins__0='https://your-frontend-host' \
	mststechvibe-api:local
```

### Azure readiness notes

- Keep secrets out of source control and inject them via Azure App Settings, Key Vault references, or Container Apps secrets.
- Keep `ASPNETCORE_ENVIRONMENT=Production` in cloud deployments.
- The app is reverse-proxy aware (`X-Forwarded-For`, `X-Forwarded-Proto`) and enforces HTTPS redirection and HSTS outside Development.
- Configure CORS to only trusted frontend origins for each environment.
