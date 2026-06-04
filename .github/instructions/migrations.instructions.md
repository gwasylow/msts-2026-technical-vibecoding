---
applyTo: "src/MSTSTechVibe.Infrastructure/Migrations/**"
description: "EF Core migration guidance for MSTSTechVibe when persistence is introduced."
---

# Migration Guidance

- Use `MSTSTechVibe.Infrastructure` as the migrations project and `MSTSTechVibe.Api` as the startup project.
- Name migrations in PascalCase with the intent of the schema change.
- Do not edit generated migrations manually unless the generated SQL is incorrect or incomplete.
- Do not delete migrations that may already be applied in shared environments.
- Before adding a migration, make sure the entity and configuration changes are complete.

```bash
dotnet ef migrations add <MigrationName> \
  --project src/MSTSTechVibe.Infrastructure \
  --startup-project src/MSTSTechVibe.Api
```