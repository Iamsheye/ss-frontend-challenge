"use client";

import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  AnimatePresence,
  motion,
  useAnimation,
  useReducedMotion,
} from "framer-motion";
import type { MouseEventHandler } from "react";

const StyledAnimatedButton = styled(motion.button)<{
  $active: boolean;
  $activeBackground: string;
}>`
  background-color: var(--color-primary);
  color: var(--color-white);
  padding: 16px 0;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  box-shadow: 0px 50px 100px -20px #32325d40;

  font-weight: 600;
  font-size: 1rem;
  line-height: 140%;

  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  padding-left: 16px;
  padding-right: 16px;
  transition: background-color 0.28s ease;

  ${({ $active, $activeBackground }) =>
    $active &&
    `
    background-color: ${$activeBackground};
  `}

  &:disabled {
    cursor: default;
  }

  &:focus-visible {
    outline: 2px solid var(--color-white);
    outline-offset: 2px;
  }

  .action-feedback-viewport {
    display: grid;
    justify-items: center;
    align-items: center;
    overflow: hidden;
    max-width: 100%;
  }

  .action-feedback-label {
    grid-area: 1 / 1;
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    will-change: transform, opacity, filter;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: background-color 0.15s ease;
  }
`;

export interface AnimatedButtonProps {
  idleLabel: string;
  activeLabel: string;
  activeBackground?: string;
  duration?: number;
  /**
   * When true, pressing while active re-fires onPress and restarts the
   * timer instead of ignoring the press (e.g. add-to-cart, where rapid
   * clicks should keep adding items).
   */
  retrigger?: boolean;
  onPress?: () => void;
  /** Called when the active duration elapses, inside the timeout callback. */
  onCompleted?: () => void;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const LABEL_TRANSITION = {
  type: "spring" as const,
  stiffness: 550,
  damping: 38,
  mass: 0.8,
};

const AnimatedButton = ({
  idleLabel,
  activeLabel,
  activeBackground = "#22c55e",
  duration = 2200,
  retrigger = false,
  onPress,
  onCompleted,
  className,
  onClick,
}: AnimatedButtonProps) => {
  const [isActive, setIsActive] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const controls = useAnimation();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handlePress: MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (isActive && !retrigger) return;
    setIsActive(true);
    onPress?.();
    if (!reduceMotion) {
      controls.start({
        scale: [1, 1.045, 1],
        transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
      });
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsActive(false);
      onCompleted?.();
    }, duration);
  };

  return (
    <StyledAnimatedButton
      type="button"
      $active={isActive}
      $activeBackground={activeBackground}
      onClick={handlePress}
      className={className}
      animate={controls}
      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
      whileHover={reduceMotion || isActive ? undefined : { scale: 1.015 }}
    >
      <span className="action-feedback-viewport" aria-live="polite">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={isActive ? "active" : "idle"}
            className="action-feedback-label"
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { y: 18, opacity: 0, filter: "blur(4px)", scale: 0.96 }
            }
            animate={
              reduceMotion
                ? { opacity: 1 }
                : { y: 0, opacity: 1, filter: "blur(0px)", scale: 1 }
            }
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { y: -18, opacity: 0, filter: "blur(4px)", scale: 0.96 }
            }
            transition={reduceMotion ? { duration: 0.15 } : LABEL_TRANSITION}
          >
            {isActive ? activeLabel : idleLabel}
          </motion.span>
        </AnimatePresence>
      </span>
    </StyledAnimatedButton>
  );
};

export default AnimatedButton;
