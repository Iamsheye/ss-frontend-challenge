"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import {
  infiniteProductsOptions,
  INFINITE_PRODUCTS_INITIAL_PAGE,
  type InfiniteProductsFilters,
} from "./infinite-options";

export { INFINITE_PRODUCTS_INITIAL_PAGE };
export type UseInfiniteProductsOptions = InfiniteProductsFilters;

export function useInfiniteProducts(options: UseInfiniteProductsOptions = {}) {
  const query = useInfiniteQuery(infiniteProductsOptions(options));

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
