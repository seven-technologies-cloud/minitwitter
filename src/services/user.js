import { localStorageKeys } from "../constants/local-storage-keys";
import { usersMock } from "../__mocks__/users";

export const userService = {
  populate() {
    const hasUsers = localStorage.getItem(localStorageKeys.USERS);
    if (hasUsers) return;

    localStorage.setItem(localStorageKeys.USERS, JSON.stringify(usersMock));
  },

  async getUserLoggedIn() {
    return new Promise((resolve) => {
      resolve({
        id: "797f6ce2-9f14-4c46-bf5e-05d446b34c84",
        name: "Lucas Polizeli",
        createdAt: 1652063207108,
        username: "lucas",
      });
    });
  },

  async getUserById({ id }) {
    return new Promise((resolve, reject) => {
      try {
        const responseFromAPI = localStorage.getItem(localStorageKeys.USERS);
        const userParsedToJSON = JSON.parse(responseFromAPI);

        const filteredUser = userParsedToJSON.find((user) => user.id === id);

        if (filteredUser) {
          resolve(filteredUser);
        } else {
          reject({ error: "User not found" });
        }
      } catch (error) {
        reject({ error: "Error to fetch data, try again later." });
      }
    });
  },
};
