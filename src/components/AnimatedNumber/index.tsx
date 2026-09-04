"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export interface AnimatedValueProps {
  value: string | number;
  className?: string;
  /** Accessible label for the live region. Defaults to the visible value. */
  ariaLabel?: string;
  /** Slide distance in px. Defaults to 14. */
  distance?: number;
}

/**
 * Rolling text/number transition for values that change in place
 * (cart badge, quantity stepper, cart total).
 *
 * - Old value slides/fades out while the new one slides/fades in from the
 *   same direction-aware offset, stacked in one grid cell so surrounding
 *   layout never jumps.
 * - Numeric changes infer direction (increment slides up, decrement slides
 *   down); string changes default to sliding up.
 * - Collapses to a plain crossfade when the user prefers reduced motion.
 */
const AnimatedValue = ({
  value,
  className,
  ariaLabel,
  distance = 14,
}: AnimatedValueProps) => {
  const reduceMotion = useReducedMotion();
  const [direction, setDirection] = useState(1);
  const prevRef = useRef<string | number>(value);

  // Derive slide direction in an effect instead of setting state during
  // render (React docs "adjust state during render" pattern). This keeps the
  // update out of the render phase and safe under Concurrent Mode.
  useEffect(() => {
    const prev = prevRef.current;
    if (prev !== value) {
      if (typeof value === "number" && typeof prev === "number") {
        setDirection(value >= prev ? 1 : -1);
      } else {
        setDirection(1);
      }
      prevRef.current = value;
    }
  }, [value]);

  const text = String(value);

  if (reduceMotion) {
    return (
      <span
        className={className}
        aria-live="polite"
        aria-atomic="true"
        aria-label={ariaLabel}
      >
        {text}
      </span>
    );
  }

  return (
    <span
      className={className}
      aria-live="polite"
      aria-atomic="true"
      aria-label={ariaLabel ?? (typeof value === "number" ? text : undefined)}
      style={{
        display: "inline-grid",
        overflow: "hidden",
        justifyItems: "center",
        alignItems: "center",
        verticalAlign: "bottom",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={text}
          aria-hidden="true"
          initial={{ y: direction * distance, opacity: 0, filter: "blur(3px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: direction * -distance, opacity: 0, filter: "blur(3px)" }}
          transition={{
            type: "spring",
            stiffness: 550,
            damping: 38,
            mass: 0.8,
          }}
          style={{
            gridArea: "1 / 1",
            whiteSpace: "nowrap",
            willChange: "transform, opacity, filter",
          }}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default AnimatedValue;
