import styled from "styled-components";

const HeaderStyles = styled.header`
  border-bottom: 1px solid #ffffff36;
  padding: 24px 0;
  position: sticky;
  top: 0px;
  z-index: 5;
  background-color: var(--background);

  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    width: 95%;
    margin: 0 auto;

    @media (max-width: 768px) {
      width: 90%;
      margin: 0 16px;
    }
  }
`;

export const CartButton = styled.button`
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--color-white);
  font-family: var(--font-ibm);

  font-size: 1.25rem;
  line-height: 100%;
  letter-spacing: -0.29px;
  transition: transform 0.18s ease;

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.96);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
    border-radius: 4px;
  }

  .cart-count {
    display: inline-grid;
    min-width: 1.75ch;
    justify-items: center;
    align-items: center;
    overflow: hidden;
    font-variant-numeric: tabular-nums;
    will-change: transform;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover,
    &:active {
      transform: none;
    }
  }
`;

export default HeaderStyles;
