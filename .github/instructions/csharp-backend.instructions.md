***

applyTo: "**/*.cs"  
description: "C# conventions for the MSTS Technical Vibecoding project — CQRS, MediatR, FluentValidation, security"

# Rules for C# code

## Creating a new Command/Query
1. Create a `record` implementing `IRequest<TResponse>`
2. Create a `Handler` implementing `IRequestHandler<TRequest, TResponse>`
3. Create a `Validator` inheriting from `AbstractValidator<T>` — REQUIRED
4. Use `CancellationToken` in all async methods

## Controllers
- The controller ONLY calls `_mediator.Send(command/query)` — no business logic or as little as possible
- Validation is automatic via FluentValidation, do not perform manual validation
- Every endpoint with data: `[Authorize]` attribute
- Extract userId from JWT: `User.FindFirst("id")?.Value`

## Security
- NEVER hardcode secrets (connection strings, JWT keys, API keys)
- NEVER build SQL manually — use EF Core LINQ
- NEVER return stack traces to the client
- ALWAYS validate input using FluentValidation
- ALWAYS check whether the user has access to the resource (authorization check in the handler)

## Entities
- Inherit from `AuditableEntity` for auditable tables
- Domain names in Polish (consistent with the existing codebase)
- Configure relationships using Fluent API in separate files `IEntityTypeConfiguration<T>`

***
