import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "@/components/Header";
import { renderWithProviders } from "@/test-utils";
import { mockProductA } from "@/__mocks__/products";

// requestAnimationFrame is used for focus-return on drawer close.
if (!globalThis.requestAnimationFrame) {
  globalThis.requestAnimationFrame = (cb: FrameRequestCallback) => {
    cb(0);
    return 0;
  };
}

describe("Header", () => {
  it("shows 0 itens and opens the drawer on click", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Header />);

    const trigger = screen.getByRole("button", {
      name: "Abrir mochila de compras, 0 itens",
    });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("0")).toBeInTheDocument();

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    // CartDrawer is next/dynamic (ssr:false) — resolves async.
    expect(await screen.findByRole("dialog")).toHaveAccessibleName(
      "Mochila de Compras",
    );
  });

  it("sums quantities and uses the singular label for 1 item", () => {
    renderWithProviders(<Header />, { preloadedCart: [mockProductA] });
    expect(
      screen.getByRole("button", {
        name: "Abrir mochila de compras, 1 item",
      }),
    ).toBeInTheDocument();
  });

  it("closes the drawer via Escape", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Header />, { preloadedCart: [mockProductA] });
    await user.click(screen.getByRole("button", { name: /abrir mochila/i }));
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(
      screen.getByRole("button", { name: /abrir mochila/i }),
    ).toHaveAttribute("aria-expanded", "false");
    // AnimatePresence plays an exit animation, so the dialog may linger
    // briefly — `waitFor` passes whether it is already gone or still exiting.
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
