import { apiFetch } from "../client";
import { PRODUCTS_PAGE_SIZE } from "../config";
import type { GetProductsParams, Product, ProductsResponse } from "./types";

export interface ProductsPage extends ProductsResponse {
  /** 1-based page that produced this payload. */
  page: number;
  rows: number;
}

export async function fetchProducts(
  params: GetProductsParams = {},
): Promise<ProductsPage> {
  const {
    page = 1,
    rows = PRODUCTS_PAGE_SIZE,
    sortBy = "id",
    orderBy = "ASC",
  } = params;

  const data = await apiFetch<ProductsResponse>("/products", {
    searchParams: { page, rows, sortBy, orderBy },
  });

  const products: Product[] = Array.isArray(data.products) ? data.products : [];

  return {
    products,
    count: data.count ?? 0,
    page,
    rows,
  };
}

export { PRODUCTS_PAGE_SIZE };
export type { GetProductsParams };
