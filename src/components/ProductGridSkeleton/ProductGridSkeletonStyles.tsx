import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.45;
  }
`;

const ProductGridSkeletonStyles = styled.div`
  width: 100%;

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .skeleton-card {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 24px 20px;
    background-color: var(--foreground);
    border-radius: var(--radius-md);
    box-shadow: 0px 1px 2px 0px #0000001a;
  }

  .skeleton-image,
  .skeleton-line,
  .skeleton-price,
  .skeleton-button {
    background-color: #22232c;
    animation: ${pulse} 1.4s ease-in-out infinite;
  }

  .skeleton-image {
    width: 100%;
    height: 258px;
    border-radius: var(--radius-md);
  }

  .skeleton-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .skeleton-line {
    height: 14px;
    border-radius: var(--radius-full);

    &.title {
      width: 68%;
      height: 20px;
    }

    &.desc {
      width: 100%;
      height: 12px;
    }

    &.short {
      width: 42%;
    }
  }

  .skeleton-price {
    width: 96px;
    height: 24px;
    margin-top: 16px;
    border-radius: var(--radius-full);
  }

  .skeleton-button {
    width: 100%;
    height: 52px;
    margin-top: 8px;
    border-radius: var(--radius-md);
  }

  @media (prefers-reduced-motion: reduce) {
    .skeleton-image,
    .skeleton-line,
    .skeleton-price,
    .skeleton-button {
      animation: none;
    }
  }
`;

export default ProductGridSkeletonStyles;
