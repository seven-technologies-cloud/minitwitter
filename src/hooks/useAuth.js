import { useEffect, useState } from "react";
import { userService } from "../services/user";

export function useAuth() {
  const [user, setUser] = useState({});

  useEffect(() => {
    getUserLoggedInOnLoad();
  }, []);

  async function getUserLoggedInOnLoad() {
    const userLoggedIn = await userService.getUserLoggedIn();
    setUser(userLoggedIn);
  }

  return { user };
}
