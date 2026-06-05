# MSTSTechVibe.WebApp

Next.js frontend for MSTSTechVibe.

## Main Page Behavior

The home route renders a responsive countdown experience by calling the backend endpoint `GET /api/v1/countdown`.

- The headline shown above the timer is loaded from backend configuration.
- The countdown targets the backend-provided UTC deadline and displays months, days, hours, and seconds.
- After the deadline is reached, the UI shows `We are all good!`.

## Local Development

```bash
npm install
npm run dev
```

Set `NEXT_PUBLIC_API_BASE_URL` when the API is not running on `http://localhost:5137`.

## Containerization (Docker)

Frontend containerization is configured in [Dockerfile](Dockerfile) with a multi-stage build for Next.js standalone output.

### Security and optimization highlights

- Multi-stage build separates dependency install, build, and runtime stages.
- Runtime image only includes the standalone server output and static assets.
- Container runs as a non-root user (`nextjs`).
- Next telemetry is disabled in build and runtime.
- Health check is configured for container orchestrators.

### Build image

```bash
docker build \
	--build-arg NEXT_PUBLIC_API_BASE_URL='https://your-backend-host' \
	-t mststechvibe-webapp:local \
	.
```

### Run image

```bash
docker run --rm -p 3000:3000 \
	-e NODE_ENV=production \
	-e NEXT_PUBLIC_API_BASE_URL='https://your-api-host' \
	mststechvibe-webapp:local
```

### Azure readiness notes

- Image listens on port `3000`, which maps cleanly to Azure Container Apps and Azure App Service for Containers.
- Keep runtime configuration in Azure environment settings, not in committed files.
- For public frontend config values, use only `NEXT_PUBLIC_*` variables.
- Build the image with `NEXT_PUBLIC_API_BASE_URL` so the browser bundle points at the deployed backend URL.
