import { Route, Routes, useNavigate, Navigate, Router } from "react-router-dom";
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
import Homepage from "./components/Homepage";

function App() {
  const navigate = useNavigate();
  const { isLoggedIn, user, login, logout, addVotedArticles } = useAuth();
  return (
    <Router>
      <AuthContext.Provider
        value={{ isLoggedIn, user, login, logout, addVotedArticles }}
      >
        <div className="app">
          <Header />
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
              navigate("/");
            }}
          >
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/articles" element={<ArticlesList />} />
              <Route path="/articles/:id" element={<Article />} />
              <Route path="/my-articles" element={<UserArticles />} />
              <Route path="/post-article" element={<PostNewArticleForm />} />
            </Routes>
          </ErrorBoundary>
        </div>
      </AuthContext.Provider>
    </Router>
  );
}

export default App;
