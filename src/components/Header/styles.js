import styled from "styled-components";

export const HeaderContainer = styled.header`
  width: 100%;
  height: 80px;

  padding: 16px 0;

  display: flex;
  justify-content: center;

  background-color: white;
`;

export const LogoText = styled.h1`
  cursor: pointer;

  span {
    color: var(--twitter);
  }
`;
