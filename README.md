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

## Azure Container Apps Deployment

The Azure deployment now uses Container Apps instead of App Service. The main template is [infra/containerapps.bicep](infra/containerapps.bicep).

### What the template creates

- A Basic Azure Container Registry for the backend and frontend images.
- A Log Analytics workspace for the Container Apps environment.
- A Container Apps managed environment.
- Two external Container Apps with HTTPS ingress:
  - [web-techvibecoding-backend-api](infra/containerapps.bicep)
  - [web-techvibecoding-frontend](infra/containerapps.bicep)

### Why this is the minimum viable Azure option

- Container Apps uses consumption-style billing instead of dedicating a VM-based App Service plan.
- That avoids the App Service quota blocker that affected this subscription.
- The template keeps the app external, HTTPS-only, and image-based while using the smallest practical CPU and memory footprint.

### Build and push images

Deploy the infra first, then push the images to the created registry. The frontend image must be built with the backend FQDN baked in.

```bash
az deployment group create \
	--resource-group rg-pl-msts2026-techvibecoding-prod \
	--template-file infra/containerapps.bicep
```

```bash
az acr login --name <acr-name>

docker build -f src/MSTSTechVibe.Api/Dockerfile -t <acr-login-server>/backend-api:latest .
docker push <acr-login-server>/backend-api:latest

docker build \
	--build-arg NEXT_PUBLIC_API_BASE_URL='https://<backend-fqdn>' \
	-f frontend/mststechvibe-webapp/Dockerfile \
	-t <acr-login-server>/frontend-webapp:latest \
	frontend/mststechvibe-webapp
docker push <acr-login-server>/frontend-webapp:latest
```

### Runtime notes

- Keep secrets out of source control and inject them through Azure environment settings or Key Vault-backed configuration.
- The backend stays reverse-proxy aware and continues to enforce secure defaults.
- The frontend image must be rebuilt if the backend URL changes, because the client bundle bakes `NEXT_PUBLIC_API_BASE_URL` at build time.
