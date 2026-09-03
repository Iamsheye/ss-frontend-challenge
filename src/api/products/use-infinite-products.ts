"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import {
  fetchProducts,
  PRODUCTS_PAGE_SIZE,
  type ProductOrderBy,
  type ProductSortBy,
} from "@/api";
import { productKeys } from "./keys";

export interface UseInfiniteProductsOptions {
  sortBy?: ProductSortBy;
  orderBy?: ProductOrderBy;
  rows?: number;
}

export const INFINITE_PRODUCTS_INITIAL_PAGE = 1;

/**
 * Infinite `GET /products` query — exactly `rows` (default 8) items per page.
 *
 * Exposes the flattened `products` list plus `totalCount` so UI components
 * (grid, `.load-more` / `ProgressBar`) can derive `hasNextPage` without
 * reaching into `data.pages`.
 */
export function useInfiniteProducts(options: UseInfiniteProductsOptions = {}) {
  const { sortBy = "id", orderBy = "ASC", rows = PRODUCTS_PAGE_SIZE } = options;

  const query = useInfiniteQuery({
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

  const products = (query.data?.pages ?? []).flatMap((page) => page.products);
  const totalCount = query.data?.pages[0]?.count ?? 0;

  return {
    ...query,
    products,
    totalCount,
    isListEmpty: !query.isPending && products.length === 0,
    /** `true` once every server-side product has been loaded. */
    isExhausted: !query.isPending && products.length > 0 && !query.hasNextPage,
  };
}

export type UseInfiniteProductsReturn = ReturnType<typeof useInfiniteProducts>;
