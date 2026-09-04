"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import HeaderStyles, { CartButton } from "./HeaderStyles";
import { Logo, CartIcon } from "@/assets/icons";
import { useAppSelector } from "@/store/hooks";

const CartDrawer = dynamic(() => import("@/components/CartDrawer"), {
  ssr: true,
});

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartCount = useAppSelector((state) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0),
  );

  return (
    <>
      <HeaderStyles>
        <nav>
          <Logo />

          <CartButton
            type="button"
            onClick={() => setIsCartOpen(true)}
            aria-label={`Abrir mochila de compras, ${cartCount} ${cartCount === 1 ? "item" : "itens"}`}
            aria-haspopup="dialog"
            aria-expanded={isCartOpen}
          >
            <CartIcon />

            <span className="cart-count">{cartCount}</span>
          </CartButton>
        </nav>
      </HeaderStyles>

      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;
