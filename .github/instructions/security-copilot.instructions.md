---
applyTo: "**/*.{cs,ts,tsx,js,jsx,json,yml,yaml,sql,md}"
description: "Secure-by-default guidance for MSTSTechVibe backend, frontend integration, and configuration changes."
---

# Security Guidance

## Core Rules

- Treat the backend as the source of truth for authorization and validation.
- Do not store secrets, tokens, connection strings, or signing keys in source-controlled files.
- Keep only placeholder values in appsettings files and use secure environment-based configuration for real deployments.

## Backend Expectations

- Protect data endpoints with authentication and perform defense-in-depth checks in handlers when access depends on the current user.
- Add a FluentValidation validator for every command and query.
- Return safe error payloads without stack traces or internal details.
- Do not build SQL with string concatenation.

## Frontend Expectations

- Do not rely on the Next.js client to enforce permissions.
- Do not store auth tokens in `localStorage`.
- Avoid surfacing raw backend exceptions directly in the UI.

## HTTP and Configuration

- Keep CORS restricted to known frontend origins.
- Validate JWT issuer, audience, lifetime, and signing key.
- Enforce HTTPS and stricter headers in production deployments.

## Review Checklist

- Are secrets still placeholders in checked-in configuration?
- Does each protected endpoint require authentication?
- Does each request type have validation?
- Are error responses safe for clients?