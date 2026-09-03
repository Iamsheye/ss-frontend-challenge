import { API_BASE_URL } from "./config";

export class ApiError extends Error {
  status: number;
  payload?: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  searchParams?: Record<string, string | number | boolean | undefined>;
}

/**
 * Minimal fetch wrapper scoped to the challenge API.
 *
 * - Prefixes every request with `NEXT_PUBLIC_API_BASE_URL`.
 * - Serialises `searchParams` (skipping `undefined` values).
 * - Throws an `ApiError` on non-2xx responses.
 */
export async function apiFetch<T>(
  path: string,
  { searchParams, ...init }: ApiFetchOptions = {},
): Promise<T> {
  if (!API_BASE_URL) {
    throw new ApiError("Missing NEXT_PUBLIC_API_BASE_URL env variable.", 500);
  }

  const url = new URL(`${API_BASE_URL}${path}`);

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url.toString(), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  if (!response.ok) {
    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      payload = await response.text().catch(() => undefined);
    }
    throw new ApiError(
      `GET ${path} failed with status ${response.status}.`,
      response.status,
      payload,
    );
  }

  return response.json() as Promise<T>;
}
