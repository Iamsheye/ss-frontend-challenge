"use client";

import HeaderStyles, { CartLink } from "./HeaderStyles";
import { Logo, CartIcon } from "@/assets/icons";
import { useAppSelector } from "@/store/hooks";

const Header = () => {
  const cartCount = useAppSelector((state) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0),
  );

  return (
    <HeaderStyles>
      <nav>
        <Logo />

        <CartLink href="/">
          <CartIcon />

          <span className="cart-count">{cartCount}</span>
        </CartLink>
      </nav>
    </HeaderStyles>
  );
};

export default Header;
