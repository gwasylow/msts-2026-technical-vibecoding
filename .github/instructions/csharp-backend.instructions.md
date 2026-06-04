---
applyTo: "src/**/*.cs"
description: "C# conventions for MSTSTechVibe backend code using Onion Architecture, CQRS, MediatR, and FluentValidation."
---

# C# Backend Guidance

## Architecture

- Keep dependencies one-way: Domain is independent, Application depends on Domain, Infrastructure depends on Application and Domain, API depends on Application and Infrastructure.
- Put request models, handlers, validators, and interfaces in Application.
- Keep framework-specific adapters in Infrastructure.

## CQRS and MediatR

- Model commands and queries as `record` types implementing `IRequest<TResponse>`.
- Create one handler per request using `IRequestHandler<TRequest, TResponse>`.
- Add a FluentValidation validator for every command and query.
- Pass `CancellationToken` through every async call.

## API Controllers

- Keep controllers thin: accept HTTP input, call `_mediator.Send(...)`, and shape HTTP responses.
- Put orchestration, authorization checks, and business rules in handlers.
- Use `[Authorize]` on endpoints that return or mutate protected data.

## Contracts and Naming

- Use the `MSTSTechVibe.*` namespace hierarchy consistently.
- Keep request and response payloads stable and predictable for the Next.js client.
- Prefer explicit DTOs over exposing domain entities directly from the API.

## Security and Reliability

- Do not hardcode real secrets in source-controlled configuration.
- Do not return stack traces or internal exception details to clients.
- Prefer safe defaults such as validated input, authenticated access, and bounded payload sizes.
