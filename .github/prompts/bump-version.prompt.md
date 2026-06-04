<!-- ---
description: "Podbij wersję aplikacji (API + Frontend) przed deployem"
---

# Bump Version

Podbij wersję projektu MSTS Technical Vibecoding. Domyślny typ: **patch**.

## Parametry

Użytkownik może podać typ: `patch`, `minor` lub `major`.

- **patch**: `1.0.0` → `1.0.1` (bugfix, drobne poprawki)
- **minor**: `1.0.0` → `1.1.0` (nowe funkcjonalności)
- **major**: `1.0.0` → `2.0.0` (breaking changes)

## Pliki do zmiany

### 1. API (.NET)

Plik: `Wingsit.MSTSTechnicalVibecoding.API/Wingsit.MSTSTechnicalVibecoding.WebAPI.csproj`

Zmień wartość `<Version>X.Y.Z</Version>` w `<PropertyGroup>` zgodnie z typem bump.

### 2. Frontend (Next.js)

Plik: `Wingsit.MSTSTechnicalVibecoding.WebApp/package.json`

Zmień wartość pola `"version": "X.Y.Z"` zgodnie z typem bump.

## Zasady

- Obie wersje (API i Frontend) podbijaj **jednocześnie** do tej samej wartości, chyba że użytkownik poprosi inaczej.
- Przed zmianą wyświetl obecne wersje i nową wersję do potwierdzenia.
- Po zmianie wyświetl podsumowanie: `API: X.Y.Z → A.B.C`, `Frontend: X.Y.Z → A.B.C`. -->
