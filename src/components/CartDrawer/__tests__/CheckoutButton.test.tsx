import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, screen } from "@testing-library/react";
import CheckoutButton from "@/components/CartDrawer/CheckoutButton";
import { renderWithProviders } from "@/test-utils";

describe("CheckoutButton", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("plays the success label then calls onCompleted", async () => {
    vi.useFakeTimers();
    const onCompleted = vi.fn();
    renderWithProviders(
      <CheckoutButton duration={500} onCompleted={onCompleted} />,
    );

    expect(screen.getByRole("button")).toHaveTextContent("FINALIZAR COMPRA");

    await act(async () => {
      fireEvent.click(screen.getByRole("button"));
    });
    expect(screen.getByRole("button")).toHaveTextContent("COMPRA FINALIZADA!");

    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    expect(onCompleted).toHaveBeenCalledTimes(1);
  });
});
