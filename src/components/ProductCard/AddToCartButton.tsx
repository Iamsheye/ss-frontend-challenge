"use client";

import type { Product } from "@/api";
import { addItem } from "@/store/cart-slice";
import { useAppDispatch } from "@/store/hooks";
import AnimatedButton from "../AnimatedButton";

export interface AddToCartButtonProps {
  product: Product;
  duration?: number;
}

const AddToCartButton = ({
  product,
  duration = 2200,
}: AddToCartButtonProps) => {
  const dispatch = useAppDispatch();

  return (
    <AnimatedButton
      idleLabel="COMPRAR"
      activeLabel="Adicionado ao carrinho"
      activeBackground="#494949"
      duration={duration}
      retrigger
      onPress={() => dispatch(addItem(product))}
    />
  );
};

export default AddToCartButton;
