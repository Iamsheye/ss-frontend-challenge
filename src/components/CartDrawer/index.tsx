"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, Minus, Plus, Trash } from "@/assets/icons";
import { clearCart, removeItem, updateQuantity } from "@/store/cart-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Backdrop, Drawer } from "./CartDrawerStyles";
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

const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const total = items.reduce((sum, item) => {
    const price = Number.parseFloat(item.product.price);
    return sum + (Number.isNaN(price) ? 0 : price * item.quantity);
  }, 0);

  return (
    <>
      <Backdrop onClick={onClose} aria-hidden="true" />
      <Drawer role="dialog" aria-modal="true" aria-label="Mochila de Compras">
        <div className="cart-header">
          <button
            type="button"
            className="cart-back"
            onClick={onClose}
            aria-label="Voltar e fechar carrinho"
            autoFocus
          >
            <ArrowLeft />
          </button>
          <h2 className="cart-title">Mochila de Compras</h2>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <p>Sua mochila está vazia.</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="cart-item">
                  <div className="cart-item-image">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="140px"
                      />
                    ) : (
                      <span aria-hidden="true" className="cart-item-fallback">
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
                        <span
                          className="quantity-value"
                          aria-live="polite"
                          aria-label={`Quantidade: ${quantity}`}
                        >
                          {quantity}
                        </span>
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
                </div>
              ))}
            </div>

            <div className="cart-footer">
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
                  <span className="amount">{formatTotal(total)}</span>
                </div>
              </div>

              <CheckoutButton onCompleted={() => dispatch(clearCart())} />
            </div>
          </>
        )}
      </Drawer>
    </>
  );
};

export default CartDrawer;
