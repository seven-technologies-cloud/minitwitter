import { localStorageKeys } from "../constants/local-storage-keys";
import { usersMock } from "../__mocks__/users";
import { api } from "../api/axios";

export const userService = {
  populate() {
    const hasUsers = localStorage.getItem(localStorageKeys.USERS);
    if (hasUsers) return;

    localStorage.setItem(localStorageKeys.USERS, JSON.stringify(usersMock));
  },

  async getUserLoggedIn() {            
      const {data} = await api.get(`user?id_user=${process.env.REACT_APP_LOGGED_USER_ID }`);   
      localStorage.setItem("user_logged", JSON.stringify(data[0]));    
  },

  async getUserById({ id }) {
    try {
      const {data} = await api.get(`user?id_user=${id}`)
      return data[0]
    } catch (error) {
      console.log(error)
    }
  },
};
