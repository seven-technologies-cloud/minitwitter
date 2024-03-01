import { useEffect, useState } from "react";
import { userService } from "../services/user";

export function useAuth() {
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user_logged");
    return storedUser ? JSON.parse(storedUser) : {};
  });

  useEffect(() => {
    // Se o usuário não está presente no localStorage, busca na API
    if (!user.id_user) {
      userService.getUserLoggedIn();
    }
  }, [user]);
  return { user };
}
