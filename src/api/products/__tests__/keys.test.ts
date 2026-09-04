import { describe, expect, it } from "vitest";
import { productKeys } from "@/api/products/keys";

describe("productKeys", () => {
  it("exposes a stable root key", () => {
    expect(productKeys.all).toEqual(["products"]);
  });

  it("builds list keys under the root", () => {
    expect(productKeys.lists()).toEqual(["products", "list"]);
  });

  it("builds infinite keys with filters", () => {
    expect(
      productKeys.infinite({ sortBy: "id", orderBy: "ASC", rows: 8 }),
    ).toEqual([
      "products",
      "list",
      "infinite",
      { sortBy: "id", orderBy: "ASC", rows: 8 },
    ]);
  });

  it("produces distinct keys per filter set", () => {
    expect(
      productKeys.infinite({ sortBy: "id", orderBy: "ASC", rows: 8 }),
    ).not.toEqual(
      productKeys.infinite({ sortBy: "price", orderBy: "DESC", rows: 8 }),
    );
  });
});
