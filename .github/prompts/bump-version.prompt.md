Here is the English translation:

***

description: "Bump application version (API + Frontend) before deployment"

# Bump Version

Increase the version of the MSTS Technical Vibecoding project. Default type: **patch**.

## Parameters

The user can specify the type: `patch`, `minor`, or `major`.

- **patch**: `1.0.0` → `1.0.1` (bug fixes, small improvements)  
- **minor**: `1.0.0` → `1.1.0` (new features)  
- **major**: `1.0.0` → `2.0.0` (breaking changes)

## Files to update

### 1. API (.NET)

File: `src/MSTSTechVibe.Api/MSTSTechVibe.Api.csproj`

Update the `<Version>X.Y.Z</Version>` value in `<PropertyGroup>` according to the bump type.

### 2. Frontend (Next.js)

File: `frontend/mststechvibe-webapp/package.json`

Update the `"version": "X.Y.Z"` field according to the bump type.

## Rules

- Bump both versions (API and Frontend) **at the same time** to the same value, unless the user specifies otherwise.  
- Before making changes, display the current versions and the new version for confirmation.  
- After the change, display a summary: `API: X.Y.Z → A.B.C`, `Frontend: X.Y.Z → A.B.C`.