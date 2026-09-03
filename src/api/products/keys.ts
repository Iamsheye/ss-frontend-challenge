import type { ProductOrderBy, ProductSortBy } from "@/api";

/**
 * Centralised query-key factory for the products domain.
 * Keeps keys stable and makes invalidation/prefetching trivial:
 * `queryClient.invalidateQueries({ queryKey: productKeys.all })`.
 */
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  infinite: (filters: {
    sortBy: ProductSortBy;
    orderBy: ProductOrderBy;
    rows: number;
  }) => [...productKeys.lists(), "infinite", filters] as const,
} as const;
