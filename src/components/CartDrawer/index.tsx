"use client";

import { useEffect, useRef, type Ref } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { PanInfo } from "framer-motion";
import { ArrowLeft, Minus, Plus, Trash } from "@/assets/icons";
import { clearCart, removeItem, updateQuantity } from "@/store/cart-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Backdrop, Drawer } from "./CartDrawerStyles";
import AnimatedValue from "@/components/AnimatedNumber";
import CheckoutButton from "./CheckoutButton";

export interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

function formatPrice(price: string): string {
  const value = Number.parseFloat(price);
  if (Number.isNaN(value)) return price;
  if (Number.isInteger(value)) return `${value} ETH`;
  return `${value.toFixed(2)} ETH`;
}

function formatTotal(value: number): string {
  if (Number.isInteger(value)) return `${value} ETH`;
  return `${value.toFixed(2)} ETH`;
}

const DRAWER_TRANSITION = {
  type: "tween" as const,
  duration: 0.34,
  ease: [0.22, 1, 0.36, 1] as const,
};

const BACKDROP_TRANSITION = { duration: 0.25, ease: "easeOut" as const };

/**
 * Swipe-to-close predicate for the drawer drag gesture.
 *
 * Extracted as a pure exported handler factory so the thresholds
 * (`offset.x > 110 || velocity.x > 550`) are unit-testable without
 * simulating pointer drags in jsdom.
 */
export function createCartDragEndHandler(onClose: () => void) {
  return (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 110 || info.velocity.x > 550) onClose();
  };
}

const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const reduceMotion = useReducedMotion();
  const drawerRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    // Move focus inside the dialog on open (replaces `autoFocus` so the
    // focus-trap below has a deterministic starting point).
    closeButtonRef.current?.focus();

    const getFocusable = (): HTMLElement[] => {
      const root = drawerRef.current;
      if (!root) return [];
      const selectors =
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
      return Array.from(root.querySelectorAll<HTMLElement>(selectors)).filter(
        (el) => !el.hasAttribute("disabled") && el.tabIndex !== -1,
      );
    };

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = getFocusable();
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
      // Return focus to whatever opened the dialog.
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  const total = items.reduce((sum, item) => {
    const price = Number.parseFloat(item.product.price);
    return sum + (Number.isNaN(price) ? 0 : price * item.quantity);
  }, 0);

  const listVariants = reduceMotion
    ? { hidden: {}, show: {} }
    : {
        hidden: {},
        show: { transition: { staggerChildren: 0.055, delayChildren: 0.1 } },
      };

  const itemVariants = reduceMotion
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        hidden: { opacity: 0, y: 22, scale: 0.98 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { type: "spring" as const, stiffness: 380, damping: 32 },
        },
        exit: {
          opacity: 0,
          x: 72,
          scale: 0.97,
          transition: { duration: 0.22, ease: "easeIn" as const },
        },
      };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <Backdrop
            key="cart-backdrop"
            onClick={onClose}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={BACKDROP_TRANSITION}
          />
          <Drawer
            key="cart-drawer"
            id="cart-drawer"
            ref={drawerRef as Ref<HTMLElement>}
            role="dialog"
            aria-modal="true"
            aria-label="Mochila de Compras"
            initial={reduceMotion ? { opacity: 0 } : { x: "100%" }}
            animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { x: "100%" }}
            transition={reduceMotion ? { duration: 0.18 } : DRAWER_TRANSITION}
            drag={reduceMotion ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            dragMomentum={false}
            onDragEnd={createCartDragEndHandler(onClose)}
          >
            <div className="cart-header">
              <button
                ref={closeButtonRef}
                type="button"
                className="cart-back"
                onClick={onClose}
                aria-label="Voltar e fechar carrinho"
              >
                <ArrowLeft />
              </button>
              <h2 className="cart-title">Mochila de Compras</h2>
            </div>

            {items.length === 0 ? (
              <motion.div
                className="cart-empty"
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <p>Sua mochila está vazia.</p>
              </motion.div>
            ) : (
              <>
                <motion.div
                  className="cart-items"
                  variants={listVariants}
                  initial="hidden"
                  animate="show"
                >
                  <AnimatePresence initial={false}>
                    {items.map(({ product, quantity }) => (
                      <motion.div
                        key={product.id}
                        className="cart-item"
                        variants={itemVariants}
                        layout={!reduceMotion}
                        exit="exit"
                      >
                        <div className="cart-item-image">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              sizes="140px"
                            />
                          ) : (
                            <span
                              aria-hidden="true"
                              className="cart-item-fallback"
                            >
                              {product.name.charAt(0)}
                            </span>
                          )}
                        </div>

                        <div className="cart-item-info">
                          <div>
                            <h3 className="cart-item-name">{product.name}</h3>
                            <p className="cart-item-description">
                              {product.description}
                            </p>
                          </div>

                          <div className="cart-item-price">
                            <Image
                              height={24}
                              width={24}
                              alt=""
                              aria-hidden="true"
                              src="/images/eth.png"
                            />
                            <span className="amount">
                              {formatPrice(product.price)}
                            </span>
                          </div>

                          <div className="cart-item-bottom">
                            <div className="quantity">
                              <button
                                type="button"
                                className="quantity-btn"
                                aria-label={`Diminuir quantidade de ${product.name}`}
                                onClick={() =>
                                  dispatch(
                                    updateQuantity({
                                      id: product.id,
                                      quantity: quantity - 1,
                                    }),
                                  )
                                }
                              >
                                <Minus />
                              </button>
                              <AnimatedValue
                                value={quantity}
                                className="quantity-value"
                                ariaLabel={`Quantidade: ${quantity}`}
                                distance={10}
                              />
                              <button
                                type="button"
                                className="quantity-btn"
                                aria-label={`Aumentar quantidade de ${product.name}`}
                                onClick={() =>
                                  dispatch(
                                    updateQuantity({
                                      id: product.id,
                                      quantity: quantity + 1,
                                    }),
                                  )
                                }
                              >
                                <Plus />
                              </button>
                            </div>

                            <button
                              type="button"
                              className="remove-btn"
                              aria-label={`Remover ${product.name} do carrinho`}
                              onClick={() => dispatch(removeItem(product.id))}
                            >
                              <Trash />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                <motion.div
                  className="cart-footer"
                  initial={
                    reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }
                  }
                  animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  transition={
                    reduceMotion
                      ? { duration: 0.18 }
                      : {
                          type: "spring",
                          stiffness: 320,
                          damping: 30,
                          delay: 0.16,
                        }
                  }
                >
                  <div className="cart-total">
                    <p className="cart-total-label">Total</p>
                    <div className="cart-total-price">
                      <Image
                        height={28}
                        width={28}
                        alt=""
                        aria-hidden="true"
                        src="/images/eth.png"
                      />
                      <AnimatedValue
                        value={formatTotal(total)}
                        className="amount"
                        ariaLabel={`Total: ${formatTotal(total)}`}
                        distance={16}
                      />
                    </div>
                  </div>

                  <CheckoutButton onCompleted={() => dispatch(clearCart())} />
                </motion.div>
              </>
            )}
          </Drawer>
        </>
      ) : null}
    </AnimatePresence>
  );
};

export default CartDrawer;
