"use client";

import styled from "styled-components";
import AnimatedButton from "../AnimatedButton";

const StyledCheckoutButton = styled(AnimatedButton)`
  width: 100%;
  min-height: 72px;
  font-family: var(--font-lato);
  font-size: 1rem;
  font-weight: 700;
  line-height: 140%;

  @media (max-width: 640px) {
    min-height: 64px;
  }
`;

export interface CheckoutButtonProps {
  idleLabel?: string;
  successLabel?: string;
  duration?: number;
  onCheckout?: () => void;
  onCompleted?: () => void;
}

const CheckoutButton = ({
  idleLabel = "FINALIZAR COMPRA",
  successLabel = "COMPRA FINALIZADA!",
  duration = 2200,
  onCheckout,
  onCompleted,
}: CheckoutButtonProps) => {
  return (
    <StyledCheckoutButton
      idleLabel={idleLabel}
      activeLabel={successLabel}
      activeBackground="#22c55e"
      duration={duration}
      onPress={onCheckout}
      onCompleted={onCompleted}
    />
  );
};

export default CheckoutButton;
