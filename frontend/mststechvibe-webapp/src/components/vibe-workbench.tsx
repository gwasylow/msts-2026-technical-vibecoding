"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { createVibeMessage, getVibeMessages } from "@/lib/api";
import type { VibeMessage } from "@/lib/contracts";

const createMessageSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(120, "Title must be 120 characters or fewer."),
  description: z.string().trim().min(1, "Description is required.").max(1000, "Description must be 1000 characters or fewer."),
});

const initialMessages: VibeMessage[] = [];

export function VibeWorkbench() {
  const [token, setToken] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [messages, setMessages] = useState<VibeMessage[]>(initialMessages);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isLoadingList, startLoadingList] = useTransition();
  const [isCreating, startCreating] = useTransition();

  function requireToken() {
    if (token.trim()) {
      return true;
    }

    setFeedback("Add a bearer token in memory before calling protected endpoints.");
    return false;
  }

  function handleLoadMessages() {
    if (!requireToken()) {
      return;
    }

    setFeedback(null);
    startLoadingList(async () => {
      try {
        const response = await getVibeMessages(token.trim());
        setMessages(response);
        setFeedback(response.length === 0 ? "No vibe messages yet." : `Loaded ${response.length} message(s).`);
      } catch (error) {
        setFeedback(error instanceof Error ? error.message : "Unable to load vibe messages.");
      }
    });
  }

  function handleCreateMessage() {
    if (!requireToken()) {
      return;
    }

    const parsed = createMessageSchema.safeParse({
      title,
      description,
    });

    if (!parsed.success) {
      setValidationError(parsed.error.issues[0]?.message ?? "Invalid input.");
      return;
    }

    setValidationError(null);
    setFeedback(null);

    startCreating(async () => {
      try {
        const createdMessage = await createVibeMessage(parsed.data, token.trim());
        setMessages((currentMessages) => [createdMessage, ...currentMessages]);
        setTitle("");
        setDescription("");
        setFeedback("Created a new vibe message through the backend API.");
      } catch (error) {
        setFeedback(error instanceof Error ? error.message : "Unable to create the vibe message.");
      }
    });
  }

  return (
    <section id="workbench" className="section-grid scroll-mt-10 gap-5">
      <div className="glass-panel col-span-12 rounded-[1.75rem] p-6 md:col-span-5 md:p-7">
        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Protected API workbench</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Exercise the current CQRS endpoints from one screen.</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              The backend currently protects `GET /api/v1/vibe-messages` and `POST /api/v1/vibe-messages`. Until a real auth flow exists, this workbench keeps the bearer token only in component state.
            </p>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Bearer token</span>
            <textarea
              className="min-h-28 w-full rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm outline-none transition focus:border-[var(--accent-strong)]"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              placeholder="Paste a valid JWT here. It is kept only in memory for this session."
            />
          </label>

          <div className="grid gap-3 md:grid-cols-2">
            <button
              className="rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[var(--background)] transition disabled:opacity-60"
              onClick={handleLoadMessages}
              disabled={isLoadingList}
              type="button"
            >
              {isLoadingList ? "Loading..." : "Load vibe messages"}
            </button>
            <div className="rounded-[1.25rem] border border-dashed border-[var(--border)] px-4 py-3 text-sm text-[var(--muted)]">
              Current API base URL: <span className="font-semibold text-[var(--foreground)]">{process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5137"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel col-span-12 rounded-[1.75rem] p-6 md:col-span-7 md:p-7">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_1.15fr]">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Create command</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">Send a new message</h3>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium">Title</span>
              <input
                className="w-full rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm outline-none transition focus:border-[var(--accent-strong)]"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Ship the frontend vertical slice"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium">Description</span>
              <textarea
                className="min-h-36 w-full rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm outline-none transition focus:border-[var(--accent-strong)]"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe what changed and why the frontend needs it."
              />
            </label>

            {validationError ? <p className="text-sm font-medium text-[#9f3f1f]">{validationError}</p> : null}

            <button
              className="rounded-full bg-[var(--accent-strong)] px-5 py-3 text-sm font-semibold text-white transition disabled:opacity-60"
              onClick={handleCreateMessage}
              disabled={isCreating}
              type="button"
            >
              {isCreating ? "Creating..." : "Create vibe message"}
            </button>

            {feedback ? (
              <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--muted)]">
                {feedback}
              </div>
            ) : null}
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Query results</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">Protected vibe messages</h3>
            </div>

            <div className="space-y-3">
              {messages.length === 0 ? (
                <div className="rounded-[1.25rem] border border-dashed border-[var(--border)] px-4 py-6 text-sm leading-7 text-[var(--muted)]">
                  No messages loaded. Use the token field and fetch the list from the API.
                </div>
              ) : (
                messages.map((message) => (
                  <article key={message.id} className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-lg font-semibold tracking-tight">{message.title}</h4>
                        <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{message.description}</p>
                      </div>
                      <span className="rounded-full bg-[rgba(196,106,47,0.16)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                        {message.createdByUserId}
                      </span>
                    </div>
                    <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                      {new Date(message.createdAtUtc).toLocaleString()}
                    </p>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}