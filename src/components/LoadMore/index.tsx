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
  /** Number of products currently rendered. Used for real progress. */
  loadedCount: number;
  /** Server-side total (`count`). Used for real progress. */
  totalCount: number;
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
  $isDone: boolean;
  $isLoading?: boolean;
  $progress: number;
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
    width: ${({ $progress }) => $progress}%;
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
    opacity: ${({ $isDone, $isLoading }) => (!$isDone && $isLoading ? 1 : 0)};
    animation: ${({ $isDone, $isLoading }) =>
      !$isDone && $isLoading ? barShimmer : "none"};
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

const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

/**
 * `.load-more` pagination footer.
 *
 * - Clicking the button fetches the next 8 products; while fetching a
 *   spinner replaces the label.
 * - When `hasNextPage` is `false` the label becomes "Você já viu tudo"
 *   and `ProgressBar` flips to `isDone`.
 * - Progress is determinate: `(loadedCount / totalCount) * 100`, capped at
 *   99% until `isDone` so the bar never claims completion early.
 */
const LoadMore = ({
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  loadedCount,
  totalCount,
}: LoadMoreProps) => {
  const isDone = !hasNextPage;
  const reduceMotion = useReducedMotion();

  const safeTotal =
    Number.isFinite(totalCount) && totalCount > 0 ? totalCount : 0;
  const safeLoaded =
    Number.isFinite(loadedCount) && loadedCount > 0 ? loadedCount : 0;
  const progress = isDone
    ? 100
    : safeTotal > 0
      ? Math.min(99, Math.max(0, Math.round((safeLoaded / safeTotal) * 100)))
      : 0;
  const valueText = isDone
    ? `Todos os ${safeTotal} produtos carregados`
    : safeTotal > 0
      ? `${safeLoaded} de ${safeTotal} produtos carregados`
      : "Carregando produtos";

  const label = isDone
    ? "Você já viu tudo"
    : isFetchingNextPage
      ? "Carregando..."
      : "Carregar mais";

  return (
    <LoadMoreWrapper className="load-more">
      <ProgressBar
        $isDone={isDone}
        $isLoading={isFetchingNextPage}
        $progress={progress}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={valueText}
        aria-label="Progresso do carregamento de produtos"
      />
      <VisuallyHidden role="status" aria-live="polite">
        {isFetchingNextPage ? "Carregando mais produtos…" : valueText}
      </VisuallyHidden>
      <LoadMoreButton
        type="button"
        onClick={onLoadMore}
        disabled={isFetchingNextPage || isDone}
        $isDone={isDone}
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
