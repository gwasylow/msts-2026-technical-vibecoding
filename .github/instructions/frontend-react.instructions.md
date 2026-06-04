<!-- Here is the English translation of your frontend conventions document.

***

applyTo: "Wingsit.ArchiBuildSync.WebApp/**/*.{ts,tsx}"  
description: "Next.js/React conventions for the ArchiBuildSync project — forms, fetching, security"

# Rules for Frontend code (Next.js)

## Data fetching
- Use the `useRequest` hook from `hooks/useRequest.ts` for API communication
- Define endpoints in `api/apiRequests.ts` as an enum
- JWT Bearer token is automatically attached from the NextAuth session

## Forms
- React Hook Form + Zod schema + `@hookform/resolvers/zod`
- Zod validation is REQUIRED for every form

## Components
- Folder per feature in `components/`
- Styling: Tailwind CSS, clsx + tailwind-merge for dynamic classes
- Icons: Lucide React or RemixIcon
- Charts: Recharts + Tremor

## Security
- NEVER store tokens in localStorage — NextAuth session is the only source
- NEVER include secrets in client-side code (only `NEXT_PUBLIC_*` for public variables)
- Validate input data with a Zod schema BEFORE sending to the API
- Protected routes: `middleware.ts` checks session for `/dashboard/*` and `/dashboard-wz/*`

## i18n
- Translations in `lang/` — use `useTranslations()` from next-intl
- Add new keys to ALL language files
- If you add a message in the frontend, it must have a translation

***

Do you want me to merge both backend and frontend conventions into a single unified project guideline document? -->