import styled from "styled-components";

const ProductCardStyles = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px 20px;
  background-color: var(--foreground);
  border-radius: var(--radius-md);
  box-shadow: 0px 1px 2px 0px #0000001a;

  .product-image {
    width: 100%;
    height: 258px;
    background-color: #22232c;
    border-radius: var(--radius-md);
    display: grid;
    place-items: center;
    position: relative;
    overflow: hidden;

    img {
      object-fit: cover;
    }

    .product-image-fallback {
      font-size: 3rem;
      font-weight: 600;
      color: var(--color-white);
    }
  }

  .product-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: auto;
  }

  .product-title {
    font-size: 1.125rem;
    font-weight: 500;
    line-height: 140%;
    letter-spacing: 0%;
  }

  .product-brand {
    font-weight: 400;
    font-size: 0.75rem;
    line-height: 100%;
    opacity: 0.7;
  }

  .product-description {
    font-weight: 300;
    font-size: 0.75rem;
    line-height: 100%;
  }

  .price-action {
    padding-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .price {
    display: flex;
    align-items: center;
    gap: 8px;

    & .amount {
      font-weight: 600;
      font-size: 1.25rem;
      line-height: 110%;
    }
  }
`;

export default ProductCardStyles;
