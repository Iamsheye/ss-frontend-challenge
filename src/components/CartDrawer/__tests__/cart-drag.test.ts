import { describe, expect, it, vi } from "vitest";
import type { PanInfo } from "framer-motion";
import { createCartDragEndHandler } from "@/components/CartDrawer";

function panInfo(offsetX: number, velocityX: number): PanInfo {
  return {
    offset: { x: offsetX, y: 0 },
    velocity: { x: velocityX, y: 0 },
  } as PanInfo;
}

describe("createCartDragEndHandler", () => {
  it("closes on a long horizontal swipe", () => {
    const onClose = vi.fn();
    createCartDragEndHandler(onClose)({} as PointerEvent, panInfo(111, 0));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on a fast flick", () => {
    const onClose = vi.fn();
    createCartDragEndHandler(onClose)({} as PointerEvent, panInfo(0, 551));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("stays open below both thresholds (boundaries are exclusive)", () => {
    const onClose = vi.fn();
    const handler = createCartDragEndHandler(onClose);
    handler({} as PointerEvent, panInfo(110, 550));
    handler({} as PointerEvent, panInfo(0, 0));
    handler({} as PointerEvent, panInfo(-200, -1000));
    expect(onClose).not.toHaveBeenCalled();
  });
});
