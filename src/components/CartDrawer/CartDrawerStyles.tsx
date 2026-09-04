import styled from "styled-components";

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 40;
`;

export const Drawer = styled.aside`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 520px;
  max-width: 520px;
  z-index: 50;
  background: var(--background);
  box-shadow: -29px 0px 9.8px 0px rgba(0, 0, 0, 0.1);
  border-radius: 4px 0 0 4px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 640px) {
    width: 100%;
    max-width: 100%;
    border-radius: 0;
  }

  .cart-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 28px 30px 20px;
    flex-shrink: 0;
  }

  .cart-back {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    background: transparent;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    color: var(--color-primary);
    background: #373737;

    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }

    svg {
      width: 30px;
      height: 30px;
    }
  }

  .cart-title {
    font-size: 1.5rem;
    font-weight: 500;
    line-height: 110%;
    color: var(--color-white);
    margin: 0;
  }

  .cart-items {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 8px 30px 20px;
  }

  .cart-item {
    display: flex;
    align-items: center;
    gap: 20px;
    background: #2b2b2b;
    border-radius: var(--radius-md);
    padding: 16px 20px;
    flex-shrink: 0;
  }

  .cart-item-image {
    width: 140px;
    height: 140px;
    flex-shrink: 0;
    background: #22232c;
    border-radius: var(--radius-md);
    position: relative;
    overflow: hidden;
    display: grid;
    place-items: center;

    img {
      object-fit: cover;
    }

    .cart-item-fallback {
      font-size: 2.5rem;
      font-weight: 600;
      color: var(--color-white);
    }
  }

  .cart-item-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 12px;
    padding: 4px 0;
  }

  .cart-item-name {
    font-size: 1.125rem;
    font-weight: 500;
    line-height: 140%;
    color: var(--color-white);
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .cart-item-description {
    font-weight: 300;
    font-size: 0.75rem;
    line-height: 1;
    color: var(--color-silver);
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .cart-item-price {
    display: flex;
    align-items: center;
    gap: 8px;

    .amount {
      font-weight: 600;
      font-size: 1.25rem;
      line-height: 110%;
      color: #f0f0f0;
    }
  }

  .cart-item-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .quantity {
    width: 104px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px;
    background: var(--background);
    border-radius: var(--radius-md);
    flex-shrink: 0;
  }

  .quantity-btn {
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    background: transparent;
    border: none;
    border-radius: 4px;
    color: var(--color-white);
    cursor: pointer;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.7;
    }

    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 1px;
    }
  }

  .quantity-value {
    font-family: "Inter", sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 20px;
    color: var(--color-white);
    min-width: 20px;
    text-align: center;
  }

  .remove-btn {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    background: var(--color-primary);
    border: none;
    border-radius: 50%;
    color: var(--color-white);
    cursor: pointer;
    transition:
      color 0.2s ease,
      background 0.2s ease;

    &:hover {
      color: #ff6b6b;
      background: rgba(255, 255, 255, 0.06);
    }

    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 1px;
    }
  }

  .cart-footer {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px 30px 28px;
  }

  .cart-total {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .cart-total-label {
    font-weight: 700;
    font-size: 1.5rem;
    line-height: 26px;
    letter-spacing: -0.04em;
    text-transform: uppercase;
    color: var(--color-white);
    margin: 0;
  }

  .cart-total-price {
    display: flex;
    align-items: center;
    gap: 10px;

    .amount {
      font-weight: 600;
      font-size: 1.5rem;
      line-height: 110%;
      color: #f0f0f0;
    }
  }

  .cart-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 40px 30px;
    text-align: center;
    color: #cccccc;
    font-weight: 300;
  }

  @media (max-width: 640px) {
    .cart-header {
      padding: 20px 16px 16px;
    }

    .cart-items {
      padding: 8px 16px 16px;
      gap: 16px;
    }

    .cart-item {
      padding: 14px 16px;
      gap: 14px;
    }

    .cart-item-image {
      width: 104px;
      height: 104px;
    }

    .cart-item-name {
      font-size: 1rem;
    }

    .cart-item-price .amount {
      font-size: 1.125rem;
    }

    .quantity {
      width: 104px;
      height: 42px;
    }

    .cart-footer {
      padding: 16px 16px 20px;
    }
  }
`;
