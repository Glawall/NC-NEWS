import { useContext } from "react";
import { AuthContext } from "../context/auth-context";
import Login from "./Login";
import ArticlesList from "./ArticlesList";
import "../styling/Homepage.css";

function Homepage() {
  const { isLoggedIn } = useContext(AuthContext);

  if (isLoggedIn) {
    return <ArticlesList />;
  }

  return (
    <div className="homepage">
      <div className="welcome-section">
        <h1>Welcome to Relay - pass it on!</h1>
        <p>
          Relay News is a web application built using React.js. It provides
          users with a platform to browse articles, view profiles, and interact
          with a community. Users can log in to access personalized features
          such as commenting on articles and voting.
        </p>
        <p>
          Please select a mock user to login, and please be aware it may take a
          few seconds to load.
        </p>
      </div>
      <Login />
    </div>
  );
}

export default Homepage;
