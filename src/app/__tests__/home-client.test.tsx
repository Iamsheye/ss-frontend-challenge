import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomeClient from "@/app/home-client";
import { renderWithProviders } from "@/test-utils";
import { mockProductA, mockProductB } from "@/__mocks__/products";

const fetchNextPage = vi.fn();
const refetch = vi.fn();
const replace = vi.fn();

vi.mock("@/api/products/use-infinite-products", () => ({
  useInfiniteProducts: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
  usePathname: () => "/",
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

import { useInfiniteProducts } from "@/api/products/use-infinite-products";
import { useSearchParams } from "next/navigation";

const mockedUseInfiniteProducts = vi.mocked(useInfiniteProducts);
const mockedUseSearchParams = vi.mocked(useSearchParams);

function mockSuccess() {
  mockedUseInfiniteProducts.mockReturnValue({
    products: [mockProductA, mockProductB],
    fetchNextPage,
    hasNextPage: true,
    isFetchingNextPage: false,
    isPending: false,
    isError: false,
    error: null,
    refetch,
    data: { pages: [{ products: [mockProductA, mockProductB], count: 20 }] },
    totalCount: 20,
  } as unknown as ReturnType<typeof useInfiniteProducts>);
}

describe("HomeClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseSearchParams.mockReturnValue(
      new URLSearchParams() as ReturnType<typeof useSearchParams>,
    );
  });

  it("shows the skeleton while pending", () => {
    mockedUseInfiniteProducts.mockReturnValue({
      products: [],
      isPending: true,
      isError: false,
      data: undefined,
    } as unknown as ReturnType<typeof useInfiniteProducts>);
    renderWithProviders(<HomeClient />);
    expect(screen.getByRole("status")).toHaveAccessibleName(
      "Carregando produtos",
    );
  });

  it("shows error + retry", async () => {
    const user = userEvent.setup();
    mockedUseInfiniteProducts.mockReturnValue({
      products: [],
      isPending: false,
      isError: true,
      error: new Error("offline"),
      refetch,
    } as unknown as ReturnType<typeof useInfiniteProducts>);
    renderWithProviders(<HomeClient />);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Não foi possível carregar os produtos",
    );
    await user.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("shows the empty state", () => {
    mockedUseInfiniteProducts.mockReturnValue({
      products: [],
      isPending: false,
      isError: false,
      data: { pages: [] },
      totalCount: 0,
    } as unknown as ReturnType<typeof useInfiniteProducts>);
    renderWithProviders(<HomeClient />);
    expect(screen.getByText("Nenhum produto encontrado.")).toBeInTheDocument();
  });

  it("renders the grid + LoadMore and fetches the next page", async () => {
    const user = userEvent.setup();
    mockSuccess();
    renderWithProviders(<HomeClient />);
    expect(screen.getByText("Neon Ape #1")).toBeInTheDocument();
    expect(screen.getByText("Pixel Punk #2")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Carregar mais" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Carregar mais" }));
    expect(fetchNextPage).toHaveBeenCalledTimes(1);
  });

  it("mirrors loaded depth to ?page=N", async () => {
    mockedUseInfiniteProducts.mockReturnValue({
      products: [mockProductA, mockProductB],
      fetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: false,
      isPending: false,
      isError: false,
      error: null,
      refetch,
      data: {
        pages: [
          { products: [mockProductA], count: 20 },
          { products: [mockProductB], count: 20 },
        ],
      },
      totalCount: 20,
    } as unknown as ReturnType<typeof useInfiniteProducts>);
    renderWithProviders(<HomeClient />);
    expect(await screen.findByText("Neon Ape #1")).toBeInTheDocument();
    expect(replace).toHaveBeenCalledWith("/?page=2", { scroll: false });
  });

  it("removes ?page=N when back to a single page", () => {
    mockedUseSearchParams.mockReturnValue(
      new URLSearchParams("page=3") as ReturnType<typeof useSearchParams>,
    );
    mockedUseInfiniteProducts.mockReturnValue({
      products: [mockProductA],
      fetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: false,
      isPending: false,
      isError: false,
      error: null,
      refetch,
      data: { pages: [{ products: [mockProductA], count: 20 }] },
      totalCount: 20,
    } as unknown as ReturnType<typeof useInfiniteProducts>);
    renderWithProviders(<HomeClient />);
    expect(screen.getByText("Neon Ape #1")).toBeInTheDocument();
    expect(replace).toHaveBeenCalledWith("/", { scroll: false });
  });
});
