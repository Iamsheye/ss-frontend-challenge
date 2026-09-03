"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LoadMore from "@/components/LoadMore";
import MainSection from "@/components/MainSection";
import ProductCard from "@/components/ProductCard";
import { useInfiniteProducts } from "@/api/products/use-infinite-products";

export default function Home() {
  const {
    products,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
    error,
    refetch,
  } = useInfiniteProducts();

  return (
    <>
      <Header />
      <MainSection>
        <main>
          {isPending ? (
            <p role="status">Carregando produtos...</p>
          ) : isError ? (
            <div>
              <p role="alert">
                Não foi possível carregar os produtos
                {error instanceof Error ? `: ${error.message}` : "."}
              </p>
              <button type="button" onClick={() => refetch()}>
                Tentar novamente
              </button>
            </div>
          ) : products.length === 0 ? (
            <p>Nenhum produto encontrado.</p>
          ) : (
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
              />
            </>
          )}
        </main>
      </MainSection>
      <Footer />
    </>
  );
}
