import styled from "styled-components";

const Button = styled.button`
  background-color: var(--color-primary);
  color: var(--color-white);
  padding: 16px 0;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  box-shadow: 0px 50px 100px -20px #32325d40;

  font-weight: 600;
  font-size: 1rem;
  line-height: 140%;
`;

const DarkButton = styled(Button)`
  width: 100%;
  background-color: var(--color-charcoal);
  color: var(--color-white);

  font-size: 1.25rem;
  line-height: 1.625rem;
`;

export { Button, DarkButton };
