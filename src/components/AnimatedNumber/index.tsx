"use client";

import { useState } from "react";
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
  const [prevValue, setPrevValue] = useState<string | number>(value);
  const [direction, setDirection] = useState(1);

  if (prevValue !== value) {
    setPrevValue(value);
    if (typeof value === "number" && typeof prevValue === "number") {
      setDirection(value >= prevValue ? 1 : -1);
    } else {
      setDirection(1);
    }
  }

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
          aria-hidden={false}
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
