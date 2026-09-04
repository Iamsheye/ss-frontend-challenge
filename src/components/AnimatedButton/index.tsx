"use client";

import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../Button";

const StyledAnimatedButton = styled(Button)<{
  $active: boolean;
  $activeBackground: string;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;

  ${({ $active, $activeBackground }) =>
    $active &&
    `
    background-color: ${$activeBackground};
    animation: action-feedback-pop 0.45s ease;
  `}

  ${({ $active }) =>
    !$active &&
    `
    &:active {
      transform: scale(0.98);
    }
  `}

  .action-feedback-label {
    display: inline-block;
    will-change: transform, opacity;
  }

  @keyframes action-feedback-pop {
    0% {
      transform: scale(1);
    }
    40% {
      transform: scale(1.04);
    }
    100% {
      transform: scale(1);
    }
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
}

const AnimatedButton = ({
  idleLabel,
  activeLabel,
  activeBackground = "#22c55e",
  duration = 2200,
  retrigger = false,
  onPress,
  onCompleted,
  className,
}: AnimatedButtonProps) => {
  const [isActive, setIsActive] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handlePress = () => {
    if (isActive && !retrigger) return;
    setIsActive(true);
    onPress?.();
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
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isActive ? "active" : "idle"}
          className="action-feedback-label"
          aria-live="polite"
          initial={{ y: 14, opacity: 0, scale: 0.92 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -14, opacity: 0, scale: 0.92 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 32,
          }}
        >
          {isActive ? activeLabel : idleLabel}
        </motion.span>
      </AnimatePresence>
    </StyledAnimatedButton>
  );
};

export default AnimatedButton;
