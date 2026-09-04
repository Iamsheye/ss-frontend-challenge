import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils";
import LoadMore from "@/components/LoadMore";

const baseProps = {
  hasNextPage: true,
  isFetchingNextPage: false,
  onLoadMore: () => {},
  loadedCount: 8,
  totalCount: 20,
};

describe("LoadMore", () => {
  it("renders determinate progress (8/20 → 40%)", () => {
    renderWithProviders(<LoadMore {...baseProps} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "40");
    expect(bar).toHaveAttribute(
      "aria-valuetext",
      "8 de 20 produtos carregados",
    );
    expect(screen.getByRole("button", { name: "Carregar mais" })).toBeEnabled();
  });

  it("caps progress at 99% until done", () => {
    renderWithProviders(
      <LoadMore {...baseProps} loadedCount={20} totalCount={20} />,
    );
    // hasNextPage=true so not done → capped at 99.
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "99",
    );
  });

  it("shows the done state when hasNextPage is false", () => {
    renderWithProviders(
      <LoadMore {...baseProps} hasNextPage={false} loadedCount={20} />,
    );
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "100");
    expect(bar).toHaveAttribute(
      "aria-valuetext",
      "Todos os 20 produtos carregados",
    );
    const button = screen.getByRole("button", {
      name: "Você já viu tudo",
    });
    expect(button).toBeDisabled();
  });

  it("shows a spinner and disables the button while fetching", () => {
    renderWithProviders(<LoadMore {...baseProps} isFetchingNextPage />);
    expect(
      screen.getByRole("status", { name: "Carregando" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /carregando/i })).toBeDisabled();
  });

  it("calls onLoadMore when clicked", async () => {
    const user = userEvent.setup();
    const onLoadMore = vi.fn();
    renderWithProviders(<LoadMore {...baseProps} onLoadMore={onLoadMore} />);
    await user.click(screen.getByRole("button", { name: "Carregar mais" }));
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });
});
