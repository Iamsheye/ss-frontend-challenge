import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

// next/image → plain <img> stub (skips the Next optimizer + remotePatterns).
vi.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    fill,
    ...rest
  }: {
    src?: string;
    alt?: string;
    fill?: boolean;
    [key: string]: unknown;
  }) => {
    void fill;
    return React.createElement("img", {
      src: typeof src === "string" ? src : "",
      alt: alt ?? "",
      ...rest,
    });
  },
}));

// framer-motion: deterministic reduced-motion in jsdom.
vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("framer-motion")>();
  return {
    ...actual,
    useReducedMotion: () => true,
  };
});

// jsdom gaps used by styled-components / framer-motion.
if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

if (!window.ResizeObserver) {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  (window as unknown as Record<string, unknown>).ResizeObserver =
    ResizeObserver;
}

if (!window.IntersectionObserver) {
  class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  (window as unknown as Record<string, unknown>).IntersectionObserver =
    IntersectionObserver;
}
