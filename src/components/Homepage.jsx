import { useContext, useEffect } from "react";
import { AuthContext } from "../context/auth-context";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import "../styling/Homepage.css";

function Homepage() {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/articles");
    }
  }, []);

  return (
    <div className="homepage">
      <div className="welcome-section">
        <h1>Welcome to Relay - pass it on!</h1>
        <p>
          Relay is a web application built using React.js. It provides users
          with a platform to browse articles, view profiles, and interact with a
          community. Users can log in to access personalized features such as
          commenting on articles and voting.
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
