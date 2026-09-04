import type { ReactElement, ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { makeStore, type AppStore } from "@/store/store";
import type { Product } from "@/api";
import { addItem } from "@/store/cart-slice";

interface ExtendedRenderOptions extends Omit<RenderOptions, "wrapper"> {
  preloadedCart?: Product[];
  store?: AppStore;
}

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
      },
    },
  });
}

export function renderWithProviders(
  ui: ReactElement,
  { preloadedCart, store, ...renderOptions }: ExtendedRenderOptions = {},
) {
  const testStore = store ?? makeStore();

  if (preloadedCart) {
    for (const product of preloadedCart) {
      testStore.dispatch(addItem(product));
    }
  }

  const queryClient = createTestQueryClient();

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={testStore}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </Provider>
    );
  }

  return {
    store: testStore,
    queryClient,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

export { createTestQueryClient };
