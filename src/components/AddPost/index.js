import { useEffect, useState } from "react";
import { postType } from "../../constants/post-type";
import { usePosts } from "../../hooks/usePosts";
import { Button } from "../Button";
import { PostCard } from "../PostCard";
import { TextArea } from "../TextArea";
import {
  AddPostTitle,
  ButtonContainer,
  PostCardContainer,
  QuoteInfoText,
} from "./styles";

export function AddPost() {
  const { createPost, createQuote, selectedPostToQuote } = usePosts();

  useEffect(() => {
    if (!selectedPostToQuote) return;

    window.scrollTo(0, 0);
  }, [selectedPostToQuote]);

  const [postText, setPostText] = useState("");

  function handleOnChangeTextArea(event) {
    setPostText(event.target.value);
  }

  async function handleOnClickToPost() {
    if (selectedPostToQuote) {
      await createQuote({
        postId: selectedPostToQuote.id,
        quoteText: postText,
      });
    } else {
      await createPost({ postText });
    }

    setPostText("");
  }

  return (
    <div>
      <AddPostTitle>what do you want to post?</AddPostTitle>

      <TextArea value={postText} onChange={handleOnChangeTextArea} />

      <ButtonContainer>
        <Button text="Post" onClick={handleOnClickToPost} />
      </ButtonContainer>

      {selectedPostToQuote && (
        <>
          <QuoteInfoText>Comment something about the post below:</QuoteInfoText>
          <PostCardContainer>
            <PostCard
              type={postType.QUOTE}
              postId={selectedPostToQuote.id}
              quoteText={selectedPostToQuote.text}
              quoteUser={selectedPostToQuote.author}
              createdBy={selectedPostToQuote.createdBy}
            />
          </PostCardContainer>
        </>
      )}
    </div>
  );
}
