import { Route, Routes, useNavigate } from "react-router-dom";
import { AuthContext } from "./context/auth-context";
import { useAuth } from "./hooks/userAuth.jsx";
import { ErrorBoundary } from "react-error-boundary";
import ProtectedRoute from "./components/ProtectedRoute";
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
            <Route
              path="/articles"
              element={
                <ProtectedRoute>
                  <ArticlesList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/articles/:id"
              element={
                <ProtectedRoute>
                  <Article />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-articles"
              element={
                <ProtectedRoute>
                  <UserArticles />
                </ProtectedRoute>
              }
            />
            <Route
              path="/post-article"
              element={
                <ProtectedRoute>
                  <PostNewArticleForm />
                </ProtectedRoute>
              }
            />
          </Routes>
        </ErrorBoundary>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
