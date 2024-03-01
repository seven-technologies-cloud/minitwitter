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

import { memo, useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { api } from "../../api/axios";
import { Button } from "../Button";

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
  type = "post"
  const { user } = useAuth();
  const { createRepost, setSelectedPostToQuote,deletePost } = usePosts();
  const [userPost, setUserPost]= useState()
  const prevAuthors = useRef(new Set());

  useEffect(()=>{
   const getUserPost = async () => {
     try {
      const {data} = await api.get(`user/${author}`)
      setUserPost(data[0])
      // Adiciona o ID ao Set de IDs previamente carregados
      prevAuthors.current.add(author);
     } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
     } 
    }
    getUserPost()
  },[author])


  function handleOnClickOverUserProfile() {
    onProfileClick(author);
  }

  function handleOnClickOverWhoReposted() {
    onProfileClick(createdBy);
  }

  function handleOnClicDeletePost() {
    deletePost(postId)
  }

  return (
    <PostCardContainer>
      {type === postType.REPOST && (
        <RepostText>
          ↓ reposted by
          <span onClick={handleOnClickOverWhoReposted}>
            @{userPost?.username}
          </span>
        </RepostText>
      )}

      {author && (
        <UserNameTextButton onClick={handleOnClickOverUserProfile}>
          @{userPost?.username}
        </UserNameTextButton>
      )}
      {author && (
        userPost?.id_user === user?.id_user && (
          <Button onClick={handleOnClicDeletePost} text={"DeletePost "}/>
        )
      )}

      {text && <PostText>{text}</PostText>}

      {type === postType.QUOTE && (
        <QuoteTextContainer>
          <UserNameTextButton disabled>
            @{quoteUser?.username}
          </UserNameTextButton>

          <PostText>{quoteText}</PostText>
        </QuoteTextContainer>
      )}

      {type === postType.POST && createdBy !== user?.id_user && (
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
