import { z } from "zod";
import type { ApiProblem, CountdownResponse, CreateVibeMessageInput, HealthResponse, VibeMessage } from "@/lib/contracts";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5137";

export function getApiBaseUrl() {
  return baseUrl;
}

const createVibeMessageSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(1000),
});

async function parseJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

function getAuthorizationHeader(token?: string): Record<string, string> {
  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

function buildErrorMessage(status: number, problem?: ApiProblem) {
  if (status === 401) {
    return "The backend rejected the request. Supply a valid JWT for protected endpoints.";
  }

  return problem?.message ?? "The API request failed.";
}

export async function getHealthStatus() {
  try {
    const response = await fetch(`${baseUrl}/api/health`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        status: "offline",
        source: "fallback",
      };
    }

    const payload = await parseJson<HealthResponse>(response);

    return {
      status: payload.status,
      source: "live health endpoint",
      baseUrl,
    };
  } catch {
    return {
      status: "offline",
      source: "fallback",
      baseUrl,
    };
  }
}

export async function getCountdownConfig(): Promise<CountdownResponse> {
  const response = await fetch(`${baseUrl}/api/v1/countdown`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const problem = await response.json().catch(() => undefined);
    throw new Error(buildErrorMessage(response.status, problem));
  }

  return parseJson<CountdownResponse>(response);
}

export async function getVibeMessages(token: string) {
  const response = await fetch(`${baseUrl}/api/v1/vibe-messages`, {
    cache: "no-store",
    headers: {
      ...getAuthorizationHeader(token),
    },
  });

  if (!response.ok) {
    const problem = await response.json().catch(() => undefined);
    throw new Error(buildErrorMessage(response.status, problem));
  }

  return parseJson<VibeMessage[]>(response);
}

export async function createVibeMessage(input: CreateVibeMessageInput, token: string) {
  const payload = createVibeMessageSchema.parse(input);
  const response = await fetch(`${baseUrl}/api/v1/vibe-messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthorizationHeader(token),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const problem = await response.json().catch(() => undefined);
    throw new Error(buildErrorMessage(response.status, problem));
  }

  return parseJson<VibeMessage>(response);
}