import { useState, useEffect, useCallback } from "react";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = useCallback((user) => {
    const userJSON = JSON.stringify(user);
    localStorage.setItem("user", userJSON);
    setUser(user);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser({});
  }, []);

  const addVotedArticles = useCallback((article_id, vote) => {
    const userLocal = JSON.parse(localStorage.getItem("user"));
    if (userLocal) {
      userLocal.votedArticle = {
        ...userLocal.votedArticle,
        [article_id]: vote,
      };
      setUser(userLocal);

      const userJSON = JSON.stringify(userLocal);
      localStorage.setItem("user", userJSON);
    }
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUser(user);
      setIsLoggedIn(true);
    }
  }, []);

  return {
    isLoggedIn,
    login,
    logout,
    user,
    addVotedArticles,
  };
};
