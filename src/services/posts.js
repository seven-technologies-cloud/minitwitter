import { localStorageKeys } from "../constants/local-storage-keys";
import { v4 as uuidv4 } from "uuid";
import { postsMock } from "../__mocks__/posts";
import { userService } from "./user";
import { postType } from "../constants/post-type";
import { dateFormatter } from "../utils/date";

export const postsService = {
  populate() {
    const hasPosts = localStorage.getItem(localStorageKeys.POSTS);
    if (hasPosts) return;

    localStorage.setItem(localStorageKeys.POSTS, JSON.stringify(postsMock));
  },

  async getAllPosts() {
    return new Promise((resolve, reject) => {
      postsService.populate();
      userService.populate();

      try {
        const postsFromAPI = localStorage.getItem(localStorageKeys.POSTS);
        const postsParsedToJSON = JSON.parse(postsFromAPI);

        resolve(postsParsedToJSON);
      } catch (error) {
        reject({ error: "Error to fetch data, try again later." });
      }
    });
  },

  async getPostsByUserId({ userId }) {
    return new Promise((resolve, reject) => {
      try {
        const postsFromAPI = localStorage.getItem(localStorageKeys.POSTS);
        const postsParsedToJSON = JSON.parse(postsFromAPI);

        const postsByUserId = postsParsedToJSON.filter(
          (currentPost) => currentPost.createdBy.id === userId
        );

        resolve(postsByUserId);
      } catch (error) {
        reject({ error: "Error to fetch data, try again later." });
      }
    });
  },

  async createQuote({ postId, userId, quoteText }) {
    const allPosts = await postsService.getAllPosts();
    const user = await userService.getUserById({ id: userId });

    return new Promise((resolve, reject) => {
      try {
        const postToQuote = allPosts.find((post) => post.id === postId);

        const postsWithNewPost = [
          {
            id: uuidv4(),
            author: user,
            text: quoteText,
            createdBy: user,
            type: postType.QUOTE,
            createdAt: new Date().getTime(),
            quote: {
              text: postToQuote.text,
              author: postToQuote.createdBy,
            },
          },
          ...allPosts,
        ];

        localStorage.setItem(
          localStorageKeys.POSTS,
          JSON.stringify(postsWithNewPost)
        );

        resolve();
      } catch (error) {
        reject({ error: "Error to add post, try again later." });
      }
    });
  },

  async createRepost({ postId, userId }) {
    const allPosts = await postsService.getAllPosts();
    const user = await userService.getUserById({ id: userId });

    return new Promise((resolve, reject) => {
      try {
        const postToRepost = allPosts.find((post) => post.id === postId);

        const postsWithNewPost = [
          {
            id: uuidv4(),
            createdBy: user,
            type: postType.REPOST,
            text: postToRepost.text,
            author: postToRepost.createdBy,
            createdAt: new Date().getTime(),
          },
          ...allPosts,
        ];

        localStorage.setItem(
          localStorageKeys.POSTS,
          JSON.stringify(postsWithNewPost)
        );

        resolve();
      } catch (error) {
        reject({ error: "Error to add post, try again later." });
      }
    });
  },

  async isUserAllowedToPost({ userId }) {
    const userPosts = await postsService.getPostsByUserId({ userId });
    const currentDate = dateFormatter(new Date().getTime());

    return new Promise((resolve, reject) => {
      try {
        const postsPostedOnCurrentDate = userPosts.filter(
          (currentUserPost) =>
            dateFormatter(currentUserPost.createdAt) === currentDate
        );

        if (postsPostedOnCurrentDate.length >= 5) {
          resolve(false);
        } else {
          resolve(true);
        }
      } catch (error) {
        reject({ error: "Error to fetch data, try again later." });
      }
    });
  },

  async createPost({ userId, postText }) {
    const allPosts = await postsService.getAllPosts();
    const user = await userService.getUserById({ id: userId });

    return new Promise((resolve, reject) => {
      try {
        const postsWithNewPost = [
          {
            id: uuidv4(),
            type: "post",
            author: user,
            text: postText,
            createdBy: user,
            createdAt: new Date().getTime(),
          },
          ...allPosts,
        ];

        localStorage.setItem(
          localStorageKeys.POSTS,
          JSON.stringify(postsWithNewPost)
        );

        resolve();
      } catch (error) {
        reject({ error: "Error to add post, try again later." });
      }
    });
  },
};
