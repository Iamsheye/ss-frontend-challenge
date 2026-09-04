import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/config", () => ({
  API_BASE_URL: "https://example.com/api/v1",
  PRODUCTS_PAGE_SIZE: 8,
}));

import { ApiError, apiFetch } from "@/api/client";

function jsonResponse(body: unknown, init: ResponseInit = { status: 200 }) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: { "Content-Type": "application/json" },
  });
}

describe("apiFetch", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("prefixes the base URL and returns parsed JSON", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse({ products: [], count: 0 }));
    vi.stubGlobal("fetch", fetchMock);

    const data = await apiFetch<{ count: number }>("/products", {
      searchParams: { page: 1, rows: 8, sortBy: "id", orderBy: "ASC" },
    });

    expect(data).toEqual({ products: [], count: 0 });
    const url = new URL(fetchMock.mock.calls[0][0] as string);
    expect(`${url.origin}${url.pathname}`).toBe(
      "https://example.com/api/v1/products",
    );
    expect(url.searchParams.get("page")).toBe("1");
    expect(url.searchParams.get("rows")).toBe("8");
  });

  it("skips undefined search params", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ ok: true }));
    vi.stubGlobal("fetch", fetchMock);

    await apiFetch("/products", {
      searchParams: { page: 1, rows: undefined },
    });

    const url = new URL(fetchMock.mock.calls[0][0] as string);
    expect(url.searchParams.has("rows")).toBe(false);
    expect(url.searchParams.get("page")).toBe("1");
  });

  it("throws ApiError with status + payload on non-2xx JSON errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(jsonResponse({ message: "boom" }, { status: 500 })),
    );

    const error = await apiFetch("/products").catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(500);
    expect((error as ApiError).payload).toEqual({ message: "boom" });
  });

  it("throws ApiError with text payload when the body is not JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("oops", { status: 404 })),
    );

    const error = await apiFetch("/products").catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(404);
  });
});
