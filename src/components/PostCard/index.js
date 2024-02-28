import {
  ActionTextButton,
  ActionTextButtonsContainer,
  PostCardContainer,
  PostText,
  QuoteTextContainer,
  RepostText,
  UserNameTextButton,
} from "./styles";

import { postType } from "../../constants/post-type";
import { usePosts } from "../../hooks/usePosts";
import { useAuth } from "../../hooks/useAuth";

import { memo } from "react";

function PostCardComponent({
  type,
  text,
  author,
  postId,
  createdBy,
  quoteUser,
  quoteText,
  onProfileClick,
}) {
  const { user } = useAuth();
  const { createRepost, setSelectedPostToQuote } = usePosts();

  function handleOnClickOverUserProfile() {
    onProfileClick(author.id);
  }

  function handleOnClickOverWhoReposted() {
    onProfileClick(createdBy.id);
  }

  return (
    <PostCardContainer>
      {type === postType.REPOST && (
        <RepostText>
          ↓ reposted by
          <span onClick={handleOnClickOverWhoReposted}>
            @{createdBy.username}
          </span>
        </RepostText>
      )}

      {author && (
        <UserNameTextButton onClick={handleOnClickOverUserProfile}>
          @{author.username}
        </UserNameTextButton>
      )}

      {text && <PostText>{text}</PostText>}

      {type === postType.QUOTE && (
        <QuoteTextContainer>
          <UserNameTextButton disabled>
            @{quoteUser.username}
          </UserNameTextButton>

          <PostText>{quoteText}</PostText>
        </QuoteTextContainer>
      )}

      {type === postType.POST && createdBy.id !== user.id && (
        <ActionTextButtonsContainer>
          <ActionTextButton onClick={() => createRepost({ postId })}>
            repost
          </ActionTextButton>

          <ActionTextButton
            onClick={() =>
              setSelectedPostToQuote({
                type,
                text,
                author,
                createdBy,
                id: postId,
              })
            }
          >
            quote
          </ActionTextButton>
        </ActionTextButtonsContainer>
      )}
    </PostCardContainer>
  );
}

export const PostCard = memo(PostCardComponent);
