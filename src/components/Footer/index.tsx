"use client";

import styled from "styled-components";

const FooterStyles = styled.footer`
  padding: 25px 0;
  margin: 0 12px;
  color: #ffffff70;
  font-size: 0.875rem;
  line-height: 1.625rem;
  letter-spacing: 2px;
  text-align: center;
  font-family: var(--font-ibm);
`;

const Footer = () => {
  return <FooterStyles>STARSOFT © TODOS OS DIREITOS RESERVADOS</FooterStyles>;
};

export default Footer;
