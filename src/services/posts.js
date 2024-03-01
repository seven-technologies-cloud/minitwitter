import { localStorageKeys } from "../constants/local-storage-keys";
import { v4 as uuidv4 } from "uuid";
import { postsMock } from "../__mocks__/posts";
import { userService } from "./user";
import { postType } from "../constants/post-type";
import { dateFormatter } from "../utils/date";
import { api } from "../api/axios";
import {format } from "date-fns"

export const postsService = {
  populate() {
    const hasPosts = localStorage.getItem(localStorageKeys.POSTS);
    if (hasPosts) return;

    localStorage.setItem(localStorageKeys.POSTS, JSON.stringify(postsMock));
  },

  async getAllPosts() {
    try {
      const res = await api.get('/post')
      const posts = res.data
      console.log(posts)
      return posts
    } catch (error) {
      console.log(error)      
    }
  },

  async getPostsByUserId({ userId }) {
    try {
      const res = await api.get(`post?user_id=${userId}`)
      return res.data
    } catch (error) {
      console.log(error)
    }

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
    const currentDate = new Date()
    const formatedDateTime = format(currentDate, "yyyy-MM-dd HH:mm:ss")
      const postsWithNewPost ={
        id_post: uuidv4(),
        post: postText,
        date_time: formatedDateTime,
        user_id: userId,
      }
      try {
        const res = await api.post('/post', postsWithNewPost)
        return res
      } catch (error) {
        console.log(error)
      }
  },

  async deletePost({postId}) {
    try {
      const res = await api.delete(`post/${postId}`)
      return res
    } catch (error) {
      console.log(error)
      return error
    }
  }

};
