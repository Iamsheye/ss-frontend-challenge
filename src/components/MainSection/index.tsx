import styled from "styled-components";

const MainSection = styled.div`
  width: 85%;
  margin: 0 auto;

  main {
    padding: 80px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 80px;

    @media (max-width: 768px) {
      padding: 40px 0;
      gap: 40px;
    }
  }

  .grid-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;

    @media (max-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    @media (max-width: 640px) {
      grid-template-columns: repeat(1, 1fr);
    }
  }

  .load-more {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    width: 100%;
    max-width: 328px;
  }

  @media (max-width: 768px) {
    width: calc(100% - 48px);
    margin: 0 24px;
  }
`;

export default MainSection;
