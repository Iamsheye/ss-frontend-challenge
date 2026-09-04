import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductCard from "@/components/ProductCard";
import { renderWithProviders } from "@/test-utils";
import {
  mockProductA,
  mockProductB,
  mockProductNoImage,
} from "@/__mocks__/products";

describe("ProductCard", () => {
  it("renders name, description and integer price", () => {
    renderWithProviders(<ProductCard product={mockProductA} />);
    expect(screen.getByText("Neon Ape #1")).toBeInTheDocument();
    expect(
      screen.getByText("A neon ape from the Starsoft collection."),
    ).toBeInTheDocument();
    expect(screen.getByText("20 ETH")).toBeInTheDocument();
  });

  it("formats float prices to 2 decimals", () => {
    renderWithProviders(<ProductCard product={mockProductNoImage} />);
    expect(screen.getByText("0.50 ETH")).toBeInTheDocument();
  });

  it("formats whole-number float strings without decimals", () => {
    renderWithProviders(<ProductCard product={mockProductB} />);
    // "182.00000000" → 182 → "182 ETH"
    expect(screen.getByText("182 ETH")).toBeInTheDocument();
  });

  it("renders an image fallback when the product has no image", () => {
    renderWithProviders(<ProductCard product={mockProductNoImage} />);
    expect(screen.getByText("G")).toBeInTheDocument();
  });

  it("dispatches addItem when COMPRAR is clicked", async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(
      <ProductCard product={mockProductA} />,
    );

    await user.click(screen.getByRole("button", { name: "COMPRAR" }));
    expect(store.getState().cart.items).toHaveLength(1);
    expect(store.getState().cart.items[0].product.id).toBe(1);

    // Rapid second click adds again (retrigger behaviour).
    await user.click(screen.getByRole("button", { name: /adicionado/i }));
    expect(store.getState().cart.items[0].quantity).toBe(2);
  });
});
