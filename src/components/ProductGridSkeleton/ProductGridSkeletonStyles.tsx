import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
`;

const cardIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(14px) scale(0.99);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
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
    animation: ${cardIn} 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
    animation-delay: var(--skeleton-delay, 0s);
  }

  .skeleton-image,
  .skeleton-line,
  .skeleton-price,
  .skeleton-button {
    background: linear-gradient(
      100deg,
      #22232c 30%,
      #35363f 46%,
      #2b2c36 54%,
      #22232c 70%
    );
    background-size: 200% 100%;
    animation: ${shimmer} 1.7s linear infinite;
    animation-delay: var(--skeleton-delay, 0s);
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
    .skeleton-card {
      animation: none;
    }

    .skeleton-image,
    .skeleton-line,
    .skeleton-price,
    .skeleton-button {
      animation: none;
      background: #22232c;
    }
  }
`;

export default ProductGridSkeletonStyles;
