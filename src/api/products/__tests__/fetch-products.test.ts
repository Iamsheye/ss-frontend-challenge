import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/config", () => ({
  API_BASE_URL: "https://example.com/api/v1",
  PRODUCTS_PAGE_SIZE: 8,
}));

import { fetchProducts } from "@/api/products";
import { mockProductA } from "@/__mocks__/products";

function jsonResponse(body: unknown, init: ResponseInit = { status: 200 }) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: { "Content-Type": "application/json" },
  });
}

describe("fetchProducts", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("maps ProductsResponse to a ProductsPage with page/rows echo", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse({ products: [mockProductA], count: 42 }));
    vi.stubGlobal("fetch", fetchMock);

    const page = await fetchProducts({
      page: 2,
      rows: 8,
      sortBy: "id",
      orderBy: "ASC",
    });

    expect(page).toEqual({
      products: [mockProductA],
      count: 42,
      page: 2,
      rows: 8,
    });
    const url = new URL(fetchMock.mock.calls[0][0] as string);
    expect(url.searchParams.get("page")).toBe("2");
    expect(url.searchParams.get("sortBy")).toBe("id");
  });

  it("uses defaults (page 1, 8 rows, id/ASC) when called bare", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse({ products: [], count: 0 }));
    vi.stubGlobal("fetch", fetchMock);

    const page = await fetchProducts();

    expect(page.page).toBe(1);
    expect(page.rows).toBe(8);
    const url = new URL(fetchMock.mock.calls[0][0] as string);
    expect(url.searchParams.get("orderBy")).toBe("ASC");
  });

  it("falls back to [] / 0 for malformed payloads", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ products: null })),
    );

    const page = await fetchProducts();
    expect(page.products).toEqual([]);
    expect(page.count).toBe(0);
  });

  it("propagates API errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(jsonResponse({ message: "nope" }, { status: 500 })),
    );

    await expect(fetchProducts()).rejects.toThrow(/failed with status 500/);
  });
});
