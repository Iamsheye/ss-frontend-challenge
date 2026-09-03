"use client";

import Image from "next/image";
import type { Product } from "@/api";
import { useAppDispatch } from "@/store/hooks";
import { addItem } from "@/store/cart-slice";
import { Button } from "../Button";
import ProductCardStyles from "./ProductCardStyles";

export interface ProductCardProps {
  product: Product;
}

function formatPrice(price: string): string {
  const value = Number.parseFloat(price);
  if (Number.isNaN(value)) return price;
  if (Number.isInteger(value)) return `${value} ETH`;
  return `${value.toFixed(2)} ETH`;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch();

  const handleBuy = () => {
    dispatch(addItem(product));
  };

  return (
    <ProductCardStyles>
      <div className="product-image">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <span aria-hidden="true" className="product-image-fallback">
            {product.name.charAt(0)}
          </span>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-description">{product.description}</p>

        <div className="price-action">
          <div className="price">
            <Image
              height={24}
              width={24}
              alt="ETH Logo"
              src="/images/eth.png"
            />
            <span className="amount">{formatPrice(product.price)}</span>
          </div>

          <Button type="button" onClick={handleBuy}>
            COMPRAR
          </Button>
        </div>
      </div>
    </ProductCardStyles>
  );
};

export default ProductCard;
