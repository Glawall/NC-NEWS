import { useContext } from "react";
import { AuthContext } from "../context/auth-context";
import Login from "./Login";
import "../styling/Homepage.css";
import ArticlesList from "./ArticlesList";

function Homepage() {
  const { isLoggedIn } = useContext(AuthContext);

  if (isLoggedIn) {
    return <ArticlesList />;
  }

  return (
    <div className="homepage">
      <div className="welcome-section">
        <h1>Welcome to Relay News</h1>
        <p>Your source for community-driven news and discussions</p>
      </div>
      <Login />
    </div>
  );
}

export default Homepage;
