import styled from "styled-components";
import closeImg from "../../assets/icons/close.svg";

export const UsernameTitle = styled.h2`
  font-size: 32px;
  padding: 0 16px;
  margin-top: 16px;
  font-weight: 700;
  margin-bottom: 24px;

  span {
    color: var(--twitter);
  }
`;

export const UserPropertiesContainer = styled.div`
  display: grid;
  padding: 0 16px;
  grid-template-columns: repeat(4, 1fr);

  @media (max-width: 890px) {
    gap: 20px;
    grid-template-columns: repeat(2, 2fr);
  }
`;

export const UserPropertyItemWrapper = styled.div`
  h4 {
    font-size: 16px;
  }
  p {
    opacity: 0.6;
    font-size: 16px;
  }
`;

export const UserFeedTitle = styled.h3`
  padding: 0 16px;
  margin-top: 24px;

  span {
    color: var(--twitter);
  }
`;

export const CloseButton = styled.button`
  top: 32px;
  width: 16px;
  right: 32px;
  height: 16px;
  border: none;
  position: absolute;
  background: url(${closeImg}) no-repeat transparent;
`;

export const AddPostContainer = styled.div`
  padding: 0 16px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  padding-right: 16px;
  justify-content: flex-end;
`;
