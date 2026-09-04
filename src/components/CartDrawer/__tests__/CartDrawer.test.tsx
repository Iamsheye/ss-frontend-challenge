import { describe, expect, it, vi } from "vitest";
import { act, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CartDrawer from "@/components/CartDrawer";
import { renderWithProviders } from "@/test-utils";
import { mockProductA, mockProductB } from "@/__mocks__/products";

describe("CartDrawer", () => {
  it("renders nothing when closed", () => {
    renderWithProviders(<CartDrawer open={false} onClose={() => {}} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows the empty state", () => {
    renderWithProviders(<CartDrawer open onClose={() => {}} />);
    expect(screen.getByRole("dialog")).toHaveAccessibleName(
      "Mochila de Compras",
    );
    expect(screen.getByText("Sua mochila está vazia.")).toBeInTheDocument();
  });

  it("renders items, quantities and the total", () => {
    renderWithProviders(<CartDrawer open onClose={() => {}} />, {
      preloadedCart: [mockProductA, mockProductB],
    });
    expect(screen.getByText("Neon Ape #1")).toBeInTheDocument();
    expect(screen.getByText("Pixel Punk #2")).toBeInTheDocument();
    // 20 + 182 = 202 ETH
    expect(screen.getByText("202 ETH")).toBeInTheDocument();
  });

  it("increments quantity with the + button", async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(
      <CartDrawer open onClose={() => {}} />,
      {
        preloadedCart: [mockProductA],
      },
    );
    await user.click(
      screen.getByRole("button", {
        name: "Aumentar quantidade de Neon Ape #1",
      }),
    );
    expect(store.getState().cart.items[0].quantity).toBe(2);
  });

  it("decrementing to 0 removes the item", async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(
      <CartDrawer open onClose={() => {}} />,
      {
        preloadedCart: [mockProductA],
      },
    );
    await user.click(
      screen.getByRole("button", {
        name: "Diminuir quantidade de Neon Ape #1",
      }),
    );
    expect(store.getState().cart.items).toEqual([]);
    expect(screen.getByText("Sua mochila está vazia.")).toBeInTheDocument();
  });

  it("removes an item with the trash button", async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(
      <CartDrawer open onClose={() => {}} />,
      {
        preloadedCart: [mockProductA, mockProductB],
      },
    );
    await user.click(
      screen.getByRole("button", { name: "Remover Neon Ape #1 do carrinho" }),
    );
    expect(store.getState().cart.items).toHaveLength(1);
    expect(store.getState().cart.items[0].product.id).toBe(mockProductB.id);
  });

  it("calls onClose on Escape and on the back button", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProviders(<CartDrawer open onClose={onClose} />, {
      preloadedCart: [mockProductA],
    });
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);

    await user.click(
      screen.getByRole("button", { name: "Voltar e fechar carrinho" }),
    );
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("wraps Tab from the last focusable element to the first", () => {
    renderWithProviders(<CartDrawer open onClose={() => {}} />, {
      preloadedCart: [mockProductA],
    });
    const buttons = screen.getAllByRole("button");
    const first = buttons[0];
    const last = buttons[buttons.length - 1];

    last.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(first);
  });

  it("wraps Shift+Tab from the first focusable element to the last", () => {
    renderWithProviders(<CartDrawer open onClose={() => {}} />, {
      preloadedCart: [mockProductA],
    });
    const buttons = screen.getAllByRole("button");
    const first = buttons[0];
    const last = buttons[buttons.length - 1];

    first.focus();
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(last);
  });

  it("checkout plays success and clears the cart", async () => {
    vi.useFakeTimers();
    try {
      const { store } = renderWithProviders(
        <CartDrawer open onClose={() => {}} />,
        { preloadedCart: [mockProductA] },
      );

      await act(async () => {
        fireEvent.click(
          screen.getByRole("button", { name: "FINALIZAR COMPRA" }),
        );
      });
      expect(
        screen.getByRole("button", { name: /finalizar compra/i }),
      ).toHaveTextContent("COMPRA FINALIZADA!");

      await act(async () => {
        vi.advanceTimersByTime(2200);
      });
      expect(store.getState().cart.items).toEqual([]);
      expect(screen.getByText("Sua mochila está vazia.")).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
});
