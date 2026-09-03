import { QueryClient } from "@tanstack/react-query";

let browserQueryClient: QueryClient | undefined;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

export function getQueryClient() {
  // Keep server requests isolated and preserve the browser cache across renders.
  // See https://nextjs.org/docs/app/guides/client-side-data-fetching/tanstack-query
  if (typeof window === "undefined") return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
