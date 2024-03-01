import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { postsService } from "../services/posts";
import { useAuth } from "./useAuth";

const PostsContext = createContext({});

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([]);

  const [selectedPostToQuote, setSelectedPostToQuote] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const allPosts = await postsService.getAllPosts();
    setPosts(allPosts);
  }

  async function isUserAbleToPost() {
    const isUserAllowedToPost = await postsService.isUserAllowedToPost({
      userId: user.id_user,
    });

    if (!isUserAllowedToPost) {
      toast.error("You have reached the posts limit per day.");

      return;
    }

    return true;
  }

  async function createPost({ postText }) {
    const userAllowedToPost = await isUserAbleToPost();
    if (!userAllowedToPost) return;

    const successfullyPosted = await postsService.createPost({
      postText,
      userId: user.id_user,
    });

    if (successfullyPosted?.error) {
      toast.error(successfullyPosted?.error);
      return;
    }

    toast.success("Successfully posted!");

    await fetchPosts();
  }

  async function deletePost(postId) { 
    const successfullyDeleted = await postsService.deletePost({ postId});
    if (successfullyDeleted?.message) {
      toast.error(successfullyDeleted?.message);
      return;
    }
    
    toast.success("Successfully deleted!");
    await fetchPosts();
  }

  async function createQuote({ postId, quoteText }) {
    const userAllowedToPost = await isUserAbleToPost();
    if (!userAllowedToPost) return;

    const successfullyQuoted = await postsService.createQuote({
      postId,
      quoteText,
      userId: user.id_user,
    });

    if (successfullyQuoted?.error) {
      toast.error(successfullyQuoted?.error);

      return;
    }

    toast.success("Successfully posted!");

    setSelectedPostToQuote(null);
    await fetchPosts();
  }

  async function createRepost({ postId }) {
    const userAllowedToPost = await isUserAbleToPost();
    if (!userAllowedToPost) return;

    const successfullyReposted = await postsService.createRepost({
      postId,
      userId: user.id_user,
    });

    if (successfullyReposted?.error) {
      toast.error(successfullyReposted?.error);

      return;
    }

    toast.success("Successfully reposted!");
    await fetchPosts();
  }

  return (
    <PostsContext.Provider
      value={{
        posts,
        createPost,
        createQuote,
        createRepost,
        selectedPostToQuote,
        setSelectedPostToQuote,
        deletePost
      }}
    >
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostsContext);

  return context;
}
