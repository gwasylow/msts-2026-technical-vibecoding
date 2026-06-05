# MSTSTechVibe.WebApp

Next.js frontend for MSTSTechVibe.

## Main Page Behavior

The home route renders a responsive countdown experience by calling the backend endpoint `GET /api/v1/countdown`.

- The headline shown above the timer is loaded from backend configuration.
- The countdown targets the backend-provided UTC deadline and displays months, days, hours, and seconds.
- After the deadline is reached, the UI shows `We are all good!`.

## Local Development

```bash
npm install
npm run dev
```

Set `NEXT_PUBLIC_API_BASE_URL` when the API is not running on `http://localhost:5137`.
