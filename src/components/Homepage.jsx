import Login from "./Login";
import { AuthContext } from "../context/auth-context";
import { useContext } from "react";
import "../App.css";
import ArticlesList from "./ArticlesList";

function Homepage() {
  const { isLoggedIn } = useContext(AuthContext);
  if (!isLoggedIn) {
    return (
      <section>
        <div id="homepage">
          <h2>NC News</h2>
          <p>
            Please log in below! Please be patient as your first time may take a
            short while to load as it accesses the back-end API after a
            spindown.{" "}
          </p>
        </div>
        <br></br>
        <div className="log-in">{!isLoggedIn ? <Login /> : null}</div>
      </section>
    );
  }
  return <ArticlesList />;
}

export default Homepage;
