import { CountdownDisplay } from "@/components/countdown-display";
import { getApiBaseUrl, getCountdownConfig } from "@/lib/api";

export default async function Home() {
  const baseUrl = getApiBaseUrl();
  const countdown = await getCountdownConfig().catch(() => null);

  return (
    <main className="countdown-shell">
      <div className="countdown-glow countdown-glow-left" aria-hidden="true" />
      <div className="countdown-glow countdown-glow-right" aria-hidden="true" />
      {countdown ? (
        <CountdownDisplay headline={countdown.headline} deadlineUtc={countdown.deadlineUtc} />
      ) : (
        <section className="countdown-panel mx-auto w-full max-w-4xl rounded-[2rem] p-6 text-center md:p-10">
          <p className="countdown-kicker">Countdown unavailable</p>
          <h1 className="mt-4 text-balance text-2xl font-semibold tracking-tight text-[var(--countdown-text)] md:text-4xl">
            Unable to load countdown settings from the backend.
          </h1>
          <p className="mt-5 text-sm text-[var(--countdown-muted)] md:text-base">
            Verify the API is running and reachable at {baseUrl}/api/v1/countdown.
          </p>
        </section>
      )}
    </main>
  );
}
