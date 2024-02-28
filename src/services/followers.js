import { localStorageKeys } from "../constants/local-storage-keys";
import { followersMock } from "../__mocks__/followers";

export const followersService = {
  populate() {
    const hasFollowers = localStorage.getItem(localStorageKeys.FOLLOWERS);
    if (hasFollowers) return;

    localStorage.setItem(
      localStorageKeys.FOLLOWERS,
      JSON.stringify(followersMock)
    );
  },

  async isFollowing({ followerUserId, userIdToCheck }) {
    return new Promise((resolve, reject) => {
      try {
        const followersFromAPI = localStorage.getItem(
          localStorageKeys.FOLLOWERS
        );
        const followersParsedToJSON = JSON.parse(followersFromAPI);

        const isFollowing = followersParsedToJSON.filter(
          (follower) =>
            follower.followerUserId === followerUserId &&
            follower.followingUserId === userIdToCheck
        );

        resolve(Boolean(isFollowing.length));
      } catch (error) {
        reject({ error: "Error to fetch data, try again later." });
      }
    });
  },

  async getUserFollowers({ userId }) {
    return new Promise((resolve, reject) => {
      followersService.populate();

      try {
        const followersFromAPI = localStorage.getItem(
          localStorageKeys.FOLLOWERS
        );
        const followersParsedToJSON = JSON.parse(followersFromAPI);

        const userFollowers = followersParsedToJSON.filter(
          (follower) => follower.followingUserId === userId
        );

        resolve(userFollowers);
      } catch (error) {
        reject({ error: "Error to fetch data, try again later." });
      }
    });
  },

  async getWhoUserFollows({ userId }) {
    return new Promise((resolve, reject) => {
      followersService.populate();

      try {
        const followsFromAPI = localStorage.getItem(localStorageKeys.FOLLOWERS);
        const followsParsedToJSON = JSON.parse(followsFromAPI);

        const userFollows = followsParsedToJSON.filter(
          (follower) => follower.followerUserId === userId
        );

        resolve(userFollows);
      } catch (error) {
        reject({ error: "Error to fetch data, try again later." });
      }
    });
  },

  async follow({ followerUserId, userIdToFollow }) {
    return new Promise((resolve, reject) => {
      followersService.populate();

      try {
        const followersFromAPI = localStorage.getItem(
          localStorageKeys.FOLLOWERS
        );

        const followersParsedToJSON = JSON.parse(followersFromAPI);

        const followersWithNewFollower = [
          { followerUserId, followingUserId: userIdToFollow },
          ...followersParsedToJSON,
        ];

        localStorage.setItem(
          localStorageKeys.FOLLOWERS,
          JSON.stringify(followersWithNewFollower)
        );

        resolve();
      } catch (error) {
        reject({ error: "Error to follow, try again later." });
      }
    });
  },

  async unfollow({ followerUserId, userIdToUnfollow }) {
    return new Promise((resolve, reject) => {
      followersService.populate();

      try {
        const followersFromAPI = localStorage.getItem(
          localStorageKeys.FOLLOWERS
        );

        const followersParsedToJSON = JSON.parse(followersFromAPI);

        const followersWithoutUnfollowedUser = followersParsedToJSON.filter(
          (follower) =>
            follower.followerUserId !== followerUserId &&
            follower.followingUserId !== userIdToUnfollow
        );

        localStorage.setItem(
          localStorageKeys.FOLLOWERS,
          JSON.stringify(followersWithoutUnfollowedUser)
        );

        resolve();
      } catch (error) {
        reject({ error: "Error to unfollow, try again later." });
      }
    });
  },
};
