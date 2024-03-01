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
      userId: user.id_user,
    });

    setUserFollows(userFollows?.map((userFollow) => userFollow.followingUserId));
  }, [user.id_user]);

  const returnPostsFiltered = useCallback(() => {
    const isOnlyFollowingPostsFilter =
      filterMode === validRoutes.FILTER_FOLLOWING;

    if (isOnlyFollowingPostsFilter) {
      return posts.filter((currentPost) => {
        return (
          userFollows.indexOf(currentPost?.user_id) > -1 && currentPost
        );
      });
    }

    if (!userIdToFilterPosts) return posts;

    return posts.filter(
      (currentPost) => currentPost?.user_id === userIdToFilterPosts
    );
  }, [filterMode, posts, userFollows, userIdToFilterPosts]);

  useEffect(() => {
    getUserFollows();
  }, [getUserFollows]);

  return (
    <>
      {returnPostsFiltered()?.map((currentPost, index) => (
        <div key={currentPost?.id_post}>
          <PostCard
            postId={currentPost?.id_post}
            type={currentPost?.type}
            text={currentPost?.post}
            author={currentPost?.user_id}
            onProfileClick={onProfileClick}
            createdBy={currentPost?.user_id}
            quoteText={currentPost?.post}
            quoteUser={currentPost?.quote?.author}
          />

          {index !== posts.length && <Divider />}
        </div>
      ))}
    </>
  );
}
