import { useState, useCallback } from "react";

export const useAuth = () => {
  const STORAGE_KEY = "relay_news_user_data";
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    return storedUser ? true : false;
  });
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = useCallback((user) => {
    const userJSON = JSON.stringify(user);
    localStorage.setItem(STORAGE_KEY, userJSON);
    setUser(user);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setIsLoggedIn(false);
    setUser(null);
  }, []);

  const addVotedArticles = useCallback((article_id, vote) => {
    const userLocal = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (userLocal) {
      userLocal.votedArticle = {
        ...userLocal.votedArticle,
        [article_id]: vote,
      };
      setUser(userLocal);

      const userJSON = JSON.stringify(userLocal);
      localStorage.setItem(STORAGE_KEY, userJSON);
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
