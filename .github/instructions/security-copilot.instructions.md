Here is the English translation of your Copilot Security Policy template.

***

applyTo: "**/*.{cs,ts,tsx,js,jsx,json,yml,yaml,sql,md}"  
description: "Global security rules for generated code (Copilot Security Policy)"

# Copilot Security Policy (Template)

## Purpose
- Enforce secure-by-default for all changes.
- Treat the backend as the source of truth for authorization and validation.
- Minimize the risk of data leakage and privilege escalation.

## Hard prohibitions (NEVER)
- Do not store secrets in code, repository files, logs, or comments.
- Do not add endpoints that return API keys, connection strings, or tokens.
- Do not rely on frontend-only authorization.
- Do not build SQL using string concatenation.
- Do not use `[AllowAnonymous]` for endpoints with user data without documented justification.

## Mandatory requirements (ALWAYS)
- Every endpoint with data: `[Authorize]` + resource access control if authentication is required.
- Every command/query must have a FluentValidation validator.
- Every resource operation: ownership check or role check in the handler (defense-in-depth).
- All async operations must accept a `CancellationToken`.
- Log security events (failed login, access denied, escalation attempts).
- Ensure both backend and frontend are secure; when analyzing, consider additional attack vectors not explicitly listed.

## AuthN/AuthZ
- JWT: validate issuer, audience, lifetime, and signing key.
- After logout, enforce token revocation on the API side.
- Compute roles and permissions on the backend (do not trust roles from the UI).
- For admin endpoints: role check at the controller level and additionally in the handler.

## Protection against IDOR
- Never trust `documentId`/`userId` from the request.
- On read and write, always verify that the logged-in user has access to the specific resource.
- For privileged operations, require explicit role checks (Admin/Architect).

## Validation and input data
- Validate format, range, length, and required fields on the backend.
- For filtering/listing: enforce limits (`take/pageSize`), positive IDs, safe sorting.
- Return safe error messages (no stack traces and no secrets).

## Frontend security baseline
- Tokens only via NextAuth/session cookies, no localStorage.
- The frontend may hide unauthorized actions, but the API must still enforce restrictions.
- Do not display raw backend errors to end users.

## Secrets and configuration
- Store secrets only in Azure App Service Configuration / user-secrets.
- Rotate secrets and keys after incidents.
- Keep only placeholders in appsettings, not production values.

## Rate limiting and abuse protection
- Protect login endpoints (`SendCode`, `Login`) with limits per IP and per email.
- Add lockout/backoff after multiple failed attempts.
- Limit payload size for upload/AI endpoints.

## HTTP and CORS
- Enforce HTTPS in production.
- CORS: whitelist only known origins, no wildcards with credentials.
- Set secure response headers (e.g., CSP, X-Content-Type-Options, Frame-Options/ancestors).

## Auditing and monitoring
- Log: who, when, which resource, which action, result.
- Monitor anomalies: login spikes, many 401/403 responses, unusual query patterns.
- Define a minimum set of alerts for critical endpoints.

## Pre-merge checklist
- Does the endpoint have `[Authorize]`?
- Does the handler include an ownership/role check?
- Is there a validator for the request?
- Are there no secret leaks in code/logs?
- Are limits and pagination safe?
- Are build and type checks passing?

## Project TODO (to be completed)
- [ ] Define security owners and response SLA.
- [ ] Add integration tests for 401/403/IDOR on key endpoints.
- [ ] Add rate limiting for AuthController.
- [ ] Add periodic review of unused endpoints.

***