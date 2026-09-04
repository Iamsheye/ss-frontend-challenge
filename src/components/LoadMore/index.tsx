"use client";

import styled, { keyframes } from "styled-components";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { DarkButton } from "../Button";

export interface LoadMoreProps {
  /** `false` once every server-side product has been loaded. */
  hasNextPage: boolean;
  /** `true` while the next 8-product page is being fetched. */
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const barShimmer = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(250%);
  }
`;

const Spinner = styled.span`
  width: 20px;
  height: 20px;
  border-radius: var(--radius-full);
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: var(--color-white);
  animation: ${spin} 0.7s linear infinite;
  flex-shrink: 0;

  @media (prefers-reduced-motion: reduce) {
    animation-duration: 1.4s;
  }
`;

const LoadMoreWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
  max-width: 328px;
`;

interface ProgressProps {
  isDone: boolean;
  isLoading?: boolean;
}

const ProgressBar = styled.div<ProgressProps>`
  width: 100%;
  height: 10px;
  background-color: var(--color-charcoal);
  border-radius: var(--radius-md);
  position: relative;
  overflow: hidden;

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    width: ${({ isDone }) => (isDone ? "100%" : "50%")};
    height: 100%;
    background-color: var(--color-primary);
    border-radius: var(--radius-md);
    transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    width: 40%;
    background: linear-gradient(
      100deg,
      transparent 0%,
      rgba(255, 255, 255, 0.35) 50%,
      transparent 100%
    );
    opacity: ${({ isDone, isLoading }) => (!isDone && isLoading ? 1 : 0)};
    animation: ${({ isDone, isLoading }) =>
      !isDone && isLoading ? barShimmer : "none"};
    animation-duration: 1.2s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    transition: opacity 0.3s ease;
  }

  @media (prefers-reduced-motion: reduce) {
    &::before {
      transition: none;
    }

    &::after {
      animation: none;
      opacity: 0;
    }
  }
`;

const LoadMoreButton = styled(DarkButton)<{ $isDone?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  overflow: hidden;
  transition:
    transform 0.18s ease,
    opacity 0.25s ease,
    background-color 0.25s ease;

  &:not(:disabled):hover {
    transform: translateY(-1px);
  }

  &:not(:disabled):active {
    transform: scale(0.97);
  }

  &:disabled {
    cursor: default;
    opacity: ${({ $isDone }) => ($isDone ? 1 : 0.85)};
  }

  .load-more-viewport {
    display: grid;
    justify-items: center;
    align-items: center;
    overflow: hidden;
  }

  .load-more-label {
    grid-area: 1 / 1;
    white-space: nowrap;
    will-change: transform, opacity;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: opacity 0.2s ease;

    &:not(:disabled):hover,
    &:not(:disabled):active {
      transform: none;
    }
  }
`;

/**
 * `.load-more` pagination footer.
 *
 * - Clicking the button fetches the next 8 products; while fetching a
 *   spinner replaces the label.
 * - When `hasNextPage` is `false` the label becomes "Você já viu tudo"
 *   and `ProgressBar` flips to `isDone`.
 */
const LoadMore = ({
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: LoadMoreProps) => {
  const isDone = !hasNextPage;
  const reduceMotion = useReducedMotion();

  const label = isDone
    ? "Você já viu tudo"
    : isFetchingNextPage
      ? "Carregando..."
      : "Carregar mais";

  return (
    <LoadMoreWrapper className="load-more">
      <ProgressBar
        isDone={isDone}
        isLoading={isFetchingNextPage}
        role="progressbar"
        aria-valuenow={isDone ? 100 : 50}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={
          isDone ? "Todos os produtos carregados" : "Carregando produtos"
        }
      />
      <LoadMoreButton
        type="button"
        onClick={onLoadMore}
        disabled={isFetchingNextPage || isDone}
        $isDone={isDone}
        aria-live="polite"
      >
        {isFetchingNextPage ? (
          <Spinner role="status" aria-label="Carregando" />
        ) : null}
        <span className="load-more-viewport">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={label}
              className="load-more-label"
              initial={reduceMotion ? { opacity: 0 } : { y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { y: -12, opacity: 0 }}
              transition={
                reduceMotion
                  ? { duration: 0.15 }
                  : { type: "spring", stiffness: 550, damping: 38 }
              }
              style={{ gridArea: "1 / 1" }}
            >
              {label}
            </motion.span>
          </AnimatePresence>
        </span>
      </LoadMoreButton>
    </LoadMoreWrapper>
  );
};

export default LoadMore;
export { ProgressBar, Spinner };
