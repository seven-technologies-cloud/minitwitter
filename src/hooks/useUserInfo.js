import { useCallback, useEffect, useState } from "react";
import { followersService } from "../services/followers";
import { postsService } from "../services/posts";
import { userService } from "../services/user";
import { useAuth } from "./useAuth";

export function useUserInfo({ userToGetInfoId }) {
  const { user } = useAuth();

  const [selectedUser, setSelectedUser] = useState({});
  const [postsAmount, setPostsAmount] = useState(0);

  const [userFollowers, setUserFollowers] = useState(0);
  const [userFollows, setWhoUserFollows] = useState(0);

  const [isLoggedInUserFollowing, setIsLoggedInUserFollowing] = useState(false);

  const getUser = useCallback(async () => {
    const user = await userService.getUserById({ id: userToGetInfoId });
    setSelectedUser(user);
  }, [userToGetInfoId]);

  const getAmountOfFollowers = useCallback(async () => {
    const followers = await followersService.getUserFollowers({
      userId: userToGetInfoId,
    });

    setUserFollowers(followers.length);
  }, [userToGetInfoId]);

  const getAmountOfFollowings = useCallback(async () => {
    const follows = await followersService.getWhoUserFollows({
      userId: userToGetInfoId,
    });

    setWhoUserFollows(follows.length);
  }, [userToGetInfoId]);

  const getAmountOfPostsByUserId = useCallback(async () => {
    const postsAmount = await postsService.getPostsByUserId({
      userId: userToGetInfoId,
    });

    setPostsAmount(postsAmount.length);
  }, [userToGetInfoId]);

  const verifyIfIsLoggedInUserFollowing = useCallback(async () => {
    const isFollowing = await followersService.isFollowing({
      followerUserId: user.id,
      userIdToCheck: userToGetInfoId,
    });

    setIsLoggedInUserFollowing(isFollowing);
  }, [user.id, userToGetInfoId]);

  useEffect(() => {
    getUser();

    getAmountOfFollowers();
    getAmountOfFollowings();

    verifyIfIsLoggedInUserFollowing();

    getAmountOfPostsByUserId();
  }, [
    user,
    getUser,
    getAmountOfFollowers,
    getAmountOfFollowings,
    getAmountOfPostsByUserId,
    verifyIfIsLoggedInUserFollowing,
  ]);

  async function followOrUnfollowUser() {
    if (isLoggedInUserFollowing) {
      await followersService.unfollow({
        followerUserId: user.id,
        userIdToUnfollow: userToGetInfoId,
      });

      setIsLoggedInUserFollowing(false);
    } else {
      await followersService.follow({
        followerUserId: user.id,
        userIdToFollow: userToGetInfoId,
      });

      setIsLoggedInUserFollowing(true);
    }

    await getAmountOfFollowers();
  }

  return {
    postsAmount,
    userFollows,
    selectedUser,
    userFollowers,
    loggedInUser: user,
    followOrUnfollowUser,
    isLoggedInUserFollowing,
  };
}
