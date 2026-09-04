"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "framer-motion";
import { getQueryClient } from "@/lib/react-query/get-query-client";
import StyledComponentsRegistry from "@/lib/styled-components/registry";
import { StoreProvider } from "@/store/store-provider";

const ReactQueryDevtools = dynamic(
  () =>
    import("@tanstack/react-query-devtools").then(
      (mod) => mod.ReactQueryDevtools,
    ),
  { ssr: false },
);

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => getQueryClient());

  return (
    <StyledComponentsRegistry>
      <StoreProvider>
        <QueryClientProvider client={queryClient}>
          <MotionConfig reducedMotion="user">
            {children}
            {process.env.NODE_ENV === "development" ? (
              <ReactQueryDevtools initialIsOpen={false} />
            ) : null}
          </MotionConfig>
        </QueryClientProvider>
      </StoreProvider>
    </StyledComponentsRegistry>
  );
}
