import { Suspense } from "react";
import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MainSection from "@/components/MainSection";
import { PRODUCTS_PAGE_SIZE } from "@/api";
import { infiniteProductsOptions } from "@/api/products/infinite-options";
import HomeClient from "./home-client";

export const metadata: Metadata = {
  title: "Starsoft — Marketplace de NFTs",
  description:
    "Explore e compre NFTs no marketplace Starsoft. Lista de produtos renderizada no servidor para carregamento rápido e SEO.",
};

const MAX_PREFETCH_PAGES = 5;

function parsePageParam(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(raw ?? "", 10);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.min(parsed, MAX_PREFETCH_PAGES);
}

interface HomePageProps {
  searchParams: Promise<{ page?: string | string[] }>;
}

/**
 * SSR home route.
 *
 * - Reads the useful list state (`?page=N`, number of loaded 8-item pages)
 *   from the URL so refreshes and shared links preserve list depth.
 * - Prefetches N pages on the server and hydrates the browser
 *   TanStack Query cache, so first paint already contains products (no
 *   client-side loading spinner for the initial view).
 * - Prefetch failures are swallowed on purpose: the client island below
 *   renders its own `isError` + retry UI.
 */
export default async function Home({ searchParams }: HomePageProps) {
  const resolved = await searchParams;
  const initialPageCount = parsePageParam(resolved?.page);

  const queryClient = new QueryClient();
  // `.catch()` swallows prefetch failures on purpose: the client island below
  // renders its own `isError` + retry UI.
  await queryClient
    .infiniteQuery({
      ...infiniteProductsOptions({
        sortBy: "id",
        orderBy: "ASC",
        rows: PRODUCTS_PAGE_SIZE,
      }),
      pages: initialPageCount,
    })
    .catch(() => {});

  return (
    <>
      <Header />
      <MainSection>
        <main>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<p role="status">Carregando produtos...</p>}>
              <HomeClient />
            </Suspense>
          </HydrationBoundary>
        </main>
      </MainSection>
      <Footer />
    </>
  );
}
