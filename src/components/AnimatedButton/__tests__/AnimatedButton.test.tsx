import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, screen } from "@testing-library/react";
import AnimatedButton from "@/components/AnimatedButton";
import { renderWithProviders } from "@/test-utils";

describe("AnimatedButton", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("fires onPress, shows the active label, then completes", async () => {
    vi.useFakeTimers();
    const onPress = vi.fn();
    const onCompleted = vi.fn();
    renderWithProviders(
      <AnimatedButton
        idleLabel="COMPRAR"
        activeLabel="Adicionado!"
        duration={1000}
        onPress={onPress}
        onCompleted={onCompleted}
      />,
    );

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("COMPRAR");

    await act(async () => {
      fireEvent.click(button);
    });
    expect(onPress).toHaveBeenCalledTimes(1);
    // AnimatePresence keeps both labels mounted mid-transition, so assert
    // on textContent rather than the exact accessible name.
    expect(screen.getByRole("button")).toHaveTextContent("Adicionado!");

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(onCompleted).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button")).toHaveTextContent("COMPRAR");
  });

  it("ignores presses while active unless retrigger is set", async () => {
    vi.useFakeTimers();
    const onPress = vi.fn();
    renderWithProviders(
      <AnimatedButton
        idleLabel="COMPRAR"
        activeLabel="Adicionado!"
        duration={1000}
        onPress={onPress}
      />,
    );
    const button = screen.getByRole("button");
    await act(async () => {
      fireEvent.click(button);
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button"));
    });
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("re-fires onPress while active when retrigger is true", async () => {
    vi.useFakeTimers();
    const onPress = vi.fn();
    renderWithProviders(
      <AnimatedButton
        idleLabel="COMPRAR"
        activeLabel="Adicionado!"
        duration={1000}
        retrigger
        onPress={onPress}
      />,
    );
    await act(async () => {
      fireEvent.click(screen.getByRole("button"));
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button"));
    });
    expect(onPress).toHaveBeenCalledTimes(2);
  });
});
