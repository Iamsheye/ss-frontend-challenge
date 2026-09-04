import { describe, expect, it } from "vitest";
import { infiniteProductsOptions } from "@/api/products/infinite-options";
import type { ProductsPage } from "@/api/products";
import { mockProductA, mockProductB } from "@/__mocks__/products";

function makePage(overrides: Partial<ProductsPage> = {}): ProductsPage {
  return {
    products: [mockProductA, mockProductB],
    count: 20,
    page: 1,
    rows: 8,
    ...overrides,
  };
}

describe("infiniteProductsOptions", () => {
  it("uses shared defaults (id/ASC/8) in the query key", () => {
    const options = infiniteProductsOptions();
    expect(options.queryKey).toEqual([
      "products",
      "list",
      "infinite",
      { sortBy: "id", orderBy: "ASC", rows: 8 },
    ]);
    expect(options.initialPageParam).toBe(1);
  });

  it("honours custom filters in the query key", () => {
    const options = infiniteProductsOptions({
      sortBy: "price",
      orderBy: "DESC",
      rows: 4,
    });
    expect(options.queryKey).toContainEqual({
      sortBy: "price",
      orderBy: "DESC",
      rows: 4,
    });
  });

  it("returns undefined when everything is loaded (loadedSoFar >= count)", () => {
    const options = infiniteProductsOptions();
    const getNext = options.getNextPageParam!;
    const fullPage = makePage({
      products: new Array(8).fill(mockProductA),
      count: 8,
    });
    expect(getNext(fullPage, [fullPage], 1, [1])).toBeUndefined();
  });

  it("returns undefined on a short (trailing) page", () => {
    const options = infiniteProductsOptions();
    const getNext = options.getNextPageParam!;
    const shortPage = makePage({ products: [mockProductA], count: 100 });
    expect(getNext(shortPage, [shortPage], 1, [1])).toBeUndefined();
  });

  it("returns lastPageParam + 1 while more pages remain", () => {
    const options = infiniteProductsOptions();
    const getNext = options.getNextPageParam!;
    const page = makePage({
      products: new Array(8).fill(mockProductA),
      count: 24,
    });
    expect(getNext(page, [page], 1, [1])).toBe(2);
    expect(getNext(page, [page, page], 2, [1, 2])).toBe(3);
  });
});
