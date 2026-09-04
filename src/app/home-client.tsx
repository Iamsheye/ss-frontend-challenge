"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useInfiniteProducts } from "@/api/products/use-infinite-products";
import LoadMore from "@/components/LoadMore";
import ProductCard from "@/components/ProductCard";
import ProductGridSkeleton from "@/components/ProductGridSkeleton";

/**
 * Client island for the SSR home route.
 *
 * Reads the server-hydrated infinite query (first paint already has products)
 * and keeps owning pagination in the browser. The loaded list depth is mirrored
 * to `?page=N` via `router.replace` (shallow, no scroll reset) so a refresh or
 * shared URL restores how many pages were visible.
 */
export default function HomeClient() {
  const {
    products,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
    error,
    refetch,
    data,
    totalCount,
  } = useInfiniteProducts();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const loadedPages = data?.pages.length ?? 1;

  useEffect(() => {
    if (isPending || isError) return;

    const current = searchParams.get("page");
    const currentCount = current ? Number.parseInt(current, 10) : 1;

    if (loadedPages <= 1) {
      if (current !== null) {
        const next = new URLSearchParams(searchParams.toString());
        next.delete("page");
        const qs = next.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, {
          scroll: false,
        });
      }
      return;
    }

    if (currentCount !== loadedPages) {
      const next = new URLSearchParams(searchParams.toString());
      next.set("page", String(loadedPages));
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    }
  }, [loadedPages, isPending, isError, pathname, router, searchParams]);

  if (isPending) {
    return <ProductGridSkeleton />;
  }

  if (isError) {
    return (
      <div>
        <p role="alert">
          Não foi possível carregar os produtos
          {error instanceof Error ? `: ${error.message}` : "."}
        </p>
        <button type="button" onClick={() => refetch()}>
          Tentar novamente
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return <p>Nenhum produto encontrado.</p>;
  }

  return (
    <>
      <div className="grid-container">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <LoadMore
        hasNextPage={hasNextPage ?? false}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={() => fetchNextPage()}
        loadedCount={products.length}
        totalCount={totalCount}
      />
    </>
  );
}
