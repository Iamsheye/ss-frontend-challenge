import { infiniteQueryOptions } from "@tanstack/react-query";
import { fetchProducts, PRODUCTS_PAGE_SIZE } from "./index";
import { productKeys } from "./keys";
import type { ProductOrderBy, ProductSortBy } from "./types";

export const INFINITE_PRODUCTS_INITIAL_PAGE = 1;

export interface InfiniteProductsFilters {
  sortBy?: ProductSortBy;
  orderBy?: ProductOrderBy;
  rows?: number;
}

/**
 * Shared infinite-query contract for `GET /products`.
 *
 * Used by both the server prefetch (`src/app/page.tsx`) and the client hook
 * (`use-infinite-products.ts`) so the dehydrated SSR state always matches the
 * browser query key. Keep `queryKey`, `queryFn` and `staleTime` in sync here —
 * do not duplicate them at call sites.
 */
export function infiniteProductsOptions(filters: InfiniteProductsFilters = {}) {
  const { sortBy = "id", orderBy = "ASC", rows = PRODUCTS_PAGE_SIZE } = filters;

  return infiniteQueryOptions({
    queryKey: productKeys.infinite({ sortBy, orderBy, rows }),
    queryFn: ({ pageParam }) =>
      fetchProducts({ page: pageParam, rows, sortBy, orderBy }),
    initialPageParam: INFINITE_PRODUCTS_INITIAL_PAGE,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const loadedSoFar = allPages.reduce(
        (total, page) => total + page.products.length,
        0,
      );
      // `count` is the server-side total; an empty/short page also ends the list.
      if (loadedSoFar >= lastPage.count) return undefined;
      if (lastPage.products.length < lastPage.rows) return undefined;
      return lastPageParam + 1;
    },
    staleTime: 60 * 1000,
  });
}
