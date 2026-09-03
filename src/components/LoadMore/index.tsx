"use client";

import styled, { keyframes } from "styled-components";
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

const Spinner = styled.span`
  width: 20px;
  height: 20px;
  border-radius: var(--radius-full);
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: var(--color-white);
  animation: ${spin} 0.7s linear infinite;
  flex-shrink: 0;
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
    transition: width 0.3s ease-in-out;
  }
`;

const LoadMoreButton = styled(DarkButton)<{ $isDone?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  &:disabled {
    cursor: default;
    opacity: ${({ $isDone }) => ($isDone ? 1 : 0.85)};
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

  const label = isDone
    ? "Você já viu tudo"
    : isFetchingNextPage
      ? "Carregando..."
      : "Carregar mais";

  return (
    <LoadMoreWrapper className="load-more">
      <ProgressBar
        isDone={isDone}
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
        {label}
      </LoadMoreButton>
    </LoadMoreWrapper>
  );
};

export default LoadMore;
export { ProgressBar, Spinner };
