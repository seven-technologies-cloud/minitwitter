import { useCallback, useEffect, useState } from "react";
import { validRoutes } from "../../constants/valid-routes";
import { useAuth } from "../../hooks/useAuth";
import { usePosts } from "../../hooks/usePosts";
import { followersService } from "../../services/followers";
import { PostCard } from "../PostCard";
import { Divider } from "./styles";

export function PostsList({ onProfileClick, userIdToFilterPosts, filterMode }) {
  const { user } = useAuth();
  const { posts } = usePosts();

  const [userFollows, setUserFollows] = useState([]);

  const getUserFollows = useCallback(async () => {
    const userFollows = await followersService.getWhoUserFollows({
      userId: user.id,
    });

    setUserFollows(userFollows.map((userFollow) => userFollow.followingUserId));
  }, [user.id]);

  const returnPostsFiltered = useCallback(() => {
    const isOnlyFollowingPostsFilter =
      filterMode === validRoutes.FILTER_FOLLOWING;

    if (isOnlyFollowingPostsFilter) {
      return posts.filter((currentPost) => {
        return (
          userFollows.indexOf(currentPost.createdBy.id) > -1 && currentPost
        );
      });
    }

    if (!userIdToFilterPosts) return posts;

    return posts.filter(
      (currentPost) => currentPost.createdBy.id === userIdToFilterPosts
    );
  }, [filterMode, posts, userFollows, userIdToFilterPosts]);

  useEffect(() => {
    getUserFollows();
  }, [getUserFollows]);

  return (
    <>
      {returnPostsFiltered().map((currentPost, index) => (
        <div key={currentPost.id}>
          <PostCard
            postId={currentPost.id}
            type={currentPost.type}
            text={currentPost.text}
            author={currentPost.author}
            onProfileClick={onProfileClick}
            createdBy={currentPost.createdBy}
            quoteText={currentPost?.quote?.text}
            quoteUser={currentPost?.quote?.author}
          />

          {index !== posts.length && <Divider />}
        </div>
      ))}
    </>
  );
}
