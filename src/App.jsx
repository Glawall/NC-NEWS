import { Route, Routes, useNavigate } from "react-router-dom";
import { AuthContext } from "./context/auth-context";
import { useAuth } from "./hooks/userAuth";
import { ErrorBoundary } from "react-error-boundary";

import "./App.css";
import Header from "./components/Header";
import UserArticles from "./components/UserArticles";
import ArticlesList from "./components/ArticlesList";
import Article from "./components/Article";
import Login from "./components/Login";
import Profile from "./components/Profile";

import ErrorFallback from "../src/util/ErrorFallback";
import Homepage from "./components/Homepage";

function App() {
  const navigate = useNavigate();
  const { isLoggedIn, user, login, logout, addVotedArticles } = useAuth();
  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, login, logout, addVotedArticles }}
    >
      <Header />
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          navigate("/");
        }}
      >
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/articles" element={<ArticlesList />} />
          <Route path="/articles/:article_id" element={<Article />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/userArticles" element={<UserArticles />} />
        </Routes>
      </ErrorBoundary>
    </AuthContext.Provider>
  );
}

export default App;
