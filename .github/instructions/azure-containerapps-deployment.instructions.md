---
applyTo: "{infra/**/*.bicep,frontend/mststechvibe-webapp/Dockerfile,src/MSTSTechVibe.Api/Dockerfile,README.md}"
description: "Azure Container Apps deployment guidance for MSTSTechVibe, including Apple Silicon Docker build compatibility."
---

# Azure Container Apps Deployment Guidance

## Project Deployment Target

- Azure subscription: `WINGSIT-SZYBKAWZ` (`b3247f11-a0cc-40f6-8840-f33ae901f278`).
- Resource group: `rg-pl-msts2026-techvibecoding-prod`.
- Region: West Europe.
- Frontend Container App: `web-techvibecoding-frontend`.
- Backend Container App: `web-techvibecoding-backend-api`.
- Azure Container Registry: `acr6s744plg3iyv2.azurecr.io` (registry name `acr6s744plg3iyv2`).
- Frontend repository: `frontend-webapp`; backend repository: `backend-api`.
- Frontend URL: `https://web-techvibecoding-frontend.politesmoke-07ebf21c.westeurope.azurecontainerapps.io`.
- Backend URL: `https://web-techvibecoding-backend-api.politesmoke-07ebf21c.westeurope.azurecontainerapps.io`.

## Standard Frontend Deployment

Run these commands from `frontend/mststechvibe-webapp`. Replace `<tag>` with an immutable tag in the `YYYYMMDD-HHmm-amd64` format.

```bash
az acr build \
  --registry acr6s744plg3iyv2 \
  --image frontend-webapp:<tag> \
  --build-arg NEXT_PUBLIC_API_BASE_URL='https://web-techvibecoding-backend-api.politesmoke-07ebf21c.westeurope.azurecontainerapps.io' \
  --file Dockerfile \
  .

az containerapp update \
  --name web-techvibecoding-frontend \
  --resource-group rg-pl-msts2026-techvibecoding-prod \
  --image acr6s744plg3iyv2.azurecr.io/frontend-webapp:<tag>
```

- The standard local flow is `az acr login --name acr6s744plg3iyv2` followed by `docker buildx build --platform linux/amd64 ... --push`.
- Use `az acr build` when Docker Desktop is unavailable; the remote ACR build avoids dependency on the local Docker daemon.
- `NEXT_PUBLIC_API_BASE_URL` is baked into the Next.js bundle during the image build. Rebuild the frontend when the backend URL changes.

## Apple Silicon (Mac M1/M2/M3) Rule

- Always build container images for Azure as `linux/amd64`.
- Use `docker buildx build --platform linux/amd64` for both backend and frontend images.
- If Container Apps reports `no match for platform in manifest`, rebuild and repush with `linux/amd64`.
- The backend image listens on port 8080 and the frontend image listens on port 3000.

## Registry and Image Rules

- Run `az acr login --name <acr-name>` before using Buildx push.
- Prefer immutable tags (for example `20260606-amd64`) instead of relying on `latest` during incident recovery.
- The template defaults to `backend-api` and `frontend-webapp` repositories in the created ACR.
- Update Container Apps explicitly to the new tag with `az containerapp update --image ...`.

## Frontend Build Rule

- The frontend image must be built with `NEXT_PUBLIC_API_BASE_URL` set to the deployed backend HTTPS URL.
- Rebuild frontend whenever backend public URL changes.
- The frontend build arg is baked into the client bundle, so the runtime container cannot correct a stale value.

## Verification Checklist

- Verify revision status and health with `az containerapp revision list`.
- Confirm ACR pull access for each system-assigned identity (`AcrPull` role on the registry scope).
- Validate live endpoints after rollout:
  - Backend: `/api/health`
  - Frontend: `/`