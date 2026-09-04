"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import HeaderStyles, { CartButton } from "./HeaderStyles";
import { Logo, CartIcon } from "@/assets/icons";
import { useAppSelector } from "@/store/hooks";
import AnimatedValue from "@/components/AnimatedNumber";

const CartDrawer = dynamic(() => import("@/components/CartDrawer"), {
  ssr: false,
  loading: () => null,
});

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const cartCount = useAppSelector((state) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0),
  );
  const reduceMotion = useReducedMotion();

  const handleClose = useCallback(() => {
    setIsCartOpen(false);
    // Return keyboard focus to the trigger so focus is not lost on the
    // `document.body` after the dialog closes.
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  return (
    <>
      <HeaderStyles>
        <nav>
          <Logo />

          <CartButton
            ref={triggerRef}
            type="button"
            onClick={() => setIsCartOpen(true)}
            aria-label={`Abrir mochila de compras, ${cartCount} ${cartCount === 1 ? "item" : "itens"}`}
            aria-haspopup="dialog"
            aria-expanded={isCartOpen}
            aria-controls="cart-drawer"
          >
            <CartIcon />

            <motion.span
              key={reduceMotion ? "static" : cartCount}
              className="cart-count"
              initial={reduceMotion ? false : { scale: 0.45 }}
              animate={{ scale: 1 }}
              transition={
                reduceMotion
                  ? undefined
                  : { type: "spring", stiffness: 550, damping: 22 }
              }
            >
              <AnimatedValue
                value={cartCount}
                ariaLabel={`${cartCount} ${cartCount === 1 ? "item" : "itens"}`}
                distance={10}
              />
            </motion.span>
          </CartButton>
        </nav>
      </HeaderStyles>

      <CartDrawer open={isCartOpen} onClose={handleClose} />
    </>
  );
};

export default Header;
