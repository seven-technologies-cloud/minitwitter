import styled from "styled-components";

export const FeedContainer = styled.div`
  width: 872px;

  margin: 28px auto;

  @media (max-width: 890px) {
    width: 100%;
    padding: 0 16px 0 16px;
  }
`;

export const AddPostContainer = styled.div`
  background-color: white;

  padding: 16px;
  border-radius: 8px;
`;

export const PostsListContainer = styled.div`
  margin-top: 16px;
  border-radius: 8px;
  background-color: white;
`;

export const FeedHeaderContainer = styled.div`
  display: flex;
  padding: 0 16px;
  align-items: center;
  margin: 12px 0 12px 0;
  justify-content: space-between;
`;

export const FeedTitle = styled.h3`
  span {
    color: var(--twitter);
  }
`;
