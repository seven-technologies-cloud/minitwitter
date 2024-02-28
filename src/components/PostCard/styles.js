import styled from "styled-components";

export const PostCardContainer = styled.div`
  padding: 16px;
`;

export const UserNameTextButton = styled.button`
  font-size: 18px;
  font-weight: 700;

  background-color: transparent;
  border: none;

  color: var(--dark-gray);

  &:hover {
    text-decoration: ${({ disabled }) => (disabled ? "none" : "underline")};
    cursor: ${({ disabled }) => (disabled ? "unset" : "pointer")};
  }
`;

export const PostText = styled.p`
  margin-top: 16px;
`;

export const RepostText = styled.h3`
  font-size: 16px;
  margin-bottom: 8px;
  padding-bottom: 8px;
  color: var(--dark-gray);

  span {
    color: var(--twitter);
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const QuoteTextContainer = styled.div`
  padding-left: 16px;
  margin-top: 16px;

  border-left: 2px solid var(--medium-gray);
`;

export const ActionTextButton = styled.button`
  font-size: 16px;

  background-color: transparent;
  font-weight: 700;
  border: none;

  &:hover {
    color: var(--twitter);
    text-decoration: underline;
  }

  &:last-child {
    padding-left: 8px;
    border-left: 2px solid var(--medium-gray);
  }
`;

export const ActionTextButtonsContainer = styled.div`
  gap: 8px;
  margin-top: 16px;

  display: flex;
`;
