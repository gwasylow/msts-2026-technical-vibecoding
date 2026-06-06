---
applyTo: "{infra/**/*.bicep,frontend/mststechvibe-webapp/Dockerfile,src/MSTSTechVibe.Api/Dockerfile,README.md}"
description: "Azure Container Apps deployment guidance for MSTSTechVibe, including Apple Silicon Docker build compatibility."
---

# Azure Container Apps Deployment Guidance

## Apple Silicon (Mac M1/M2/M3) Rule

- Always build container images for Azure as `linux/amd64`.
- Use `docker buildx build --platform linux/amd64` for both backend and frontend images.
- If Container Apps reports `no match for platform in manifest`, rebuild and repush with `linux/amd64`.

## Registry and Image Rules

- Run `az acr login --name <acr-name>` before using Buildx push.
- Prefer immutable tags (for example `20260606-amd64`) instead of relying on `latest` during incident recovery.
- Update Container Apps explicitly to the new tag with `az containerapp update --image ...`.

## Frontend Build Rule

- The frontend image must be built with `NEXT_PUBLIC_API_BASE_URL` set to the deployed backend HTTPS URL.
- Rebuild frontend whenever backend public URL changes.

## Verification Checklist

- Verify revision status and health with `az containerapp revision list`.
- Confirm ACR pull access for each system-assigned identity (`AcrPull` role on the registry scope).
- Validate live endpoints after rollout:
  - Backend: `/api/health`
  - Frontend: `/`