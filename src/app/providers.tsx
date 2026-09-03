"use client";

import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { MotionConfig } from "framer-motion";
import { getQueryClient } from "@/lib/react-query/get-query-client";
import StyledComponentsRegistry from "@/lib/styled-components/registry";
import { StoreProvider } from "@/store/store-provider";

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

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
