import { VibeWorkbench } from "@/components/vibe-workbench";
import { getApiBaseUrl, getHealthStatus } from "@/lib/api";

const capabilities = [
  {
    title: "Thin HTTP surface",
    description: "The ASP.NET Core API exposes a small controller layer while MediatR handlers coordinate the use cases."
  },
  {
    title: "Current integration path",
    description: "This frontend reads the public health endpoint on the server and lets you exercise protected vibe-message endpoints from a client workbench."
  },
  {
    title: "Next step ready",
    description: "When a real identity provider arrives, the workbench can swap the temporary token field for a secure session flow without changing the backend contracts."
  }
];

export default async function Home() {
  const health = await getHealthStatus();
  const swaggerUrl = `${getApiBaseUrl()}/swagger`;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 px-5 py-6 md:px-8 md:py-8">
      <section className="glass-panel overflow-hidden rounded-[2rem] p-6 md:p-10">
        <div className="section-grid items-end">
          <div className="col-span-12 space-y-6 md:col-span-7">
            <span className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
              MSTSTechVibe.WebApp
            </span>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold leading-none tracking-tight md:text-6xl">
                Frontend shell for the Onion backend, built to talk to the API that already exists.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[var(--muted)] md:text-lg">
                The home screen is server-rendered, the data workbench is client-side, and both are wired to the current ASP.NET Core endpoints instead of placeholder content.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                className="rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[var(--background)] transition-transform hover:-translate-y-0.5"
                href="#workbench"
              >
                Open API workbench
              </a>
              <a
                className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-5 py-3 text-sm font-semibold text-[var(--foreground)]"
                href={swaggerUrl}
                target="_blank"
                rel="noreferrer"
              >
                View Swagger
              </a>
            </div>
          </div>
          <div className="col-span-12 md:col-span-5">
            <div className="rounded-[1.75rem] bg-[linear-gradient(160deg,rgba(20,40,29,0.96),rgba(14,110,88,0.92))] p-6 text-[#f8f4ec] shadow-2xl">
              <p className="text-sm uppercase tracking-[0.24em] text-[#f0c7a7]">Backend pulse</p>
              <div className="mt-6 flex items-end justify-between gap-4">
                <div>
                  <p className="text-5xl font-semibold leading-none">{health.status}</p>
                  <p className="mt-2 text-sm text-[#d7eadf]">Fetched from `GET /api/health` during server render.</p>
                </div>
                <div className="rounded-full border border-white/15 px-3 py-2 text-xs uppercase tracking-[0.18em] text-[#d7eadf]">
                  {health.source}
                </div>
              </div>
              <p className="mt-5 text-xs uppercase tracking-[0.18em] text-[#d7eadf]">Base URL: {health.baseUrl}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-grid">
        {capabilities.map((capability, index) => (
          <article
            key={capability.title}
            className="glass-panel col-span-12 rounded-[1.5rem] p-5 md:col-span-4"
            style={{ animationDelay: `${index * 120}ms` }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">0{index + 1}</p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">{capability.title}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{capability.description}</p>
          </article>
        ))}
      </section>

      <VibeWorkbench />
    </main>
  );
}
