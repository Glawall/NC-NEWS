import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import { AuthContext } from "./context/auth-context";
import { useAuth } from "./hooks/userAuth.jsx";
import { ErrorBoundary } from "react-error-boundary";
import "./App.css";
import Header from "./components/Header";
import UserArticles from "./components/UserArticles";
import ArticlesList from "./components/ArticlesList";
import Article from "./components/Article";
import Login from "./components/Login";
import PostNewArticleForm from "./components/PostNewArticleForm";
import ErrorFallback from "../src/util/ErrorFallback";

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
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Navigate to="/articles" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/articles" element={<ArticlesList />} />
          <Route path="/articles/:id" element={<Article />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/my-articles"
            element={
              isLoggedIn ? <UserArticles /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/post-article"
            element={
              isLoggedIn ? (
                <PostNewArticleForm />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </ErrorBoundary>
    </AuthContext.Provider>
  );
}

export default App;
