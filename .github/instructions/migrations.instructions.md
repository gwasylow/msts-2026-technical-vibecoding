Here is the English translation of your EF Core migrations guidelines.

***

applyTo: "Wingsit.ArchiBuildSync.Persistance/Migrations/**"  
description: "Rules for EF Core migrations — security, naming conventions"

# Rules for EF Core migrations

## Creating a migration
```bash
dotnet ef migrations add <MigrationName> \
  --project Wingsit.ArchiBuildSync.Persistance \
  --startup-project Wingsit.ArchiBuildSync.API
```

## Conventions
- Migration names: PascalCase describing the change (e.g., `AddUserProfileTable`, `FixForeignKeyColumnNames`)
- NEVER manually edit generated migrations without a good reason
- NEVER delete migrations that have already been applied in production
- Before creating a migration, ensure that the Fluent API configuration is complete
- Never delete the database without asking for approval

***

Would you like me to add examples of good and bad migration practices for your team?