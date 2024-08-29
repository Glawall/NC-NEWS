import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth-context";
import "./Header.css";

function Header() {
  const { user, isLoggedIn } = useContext(AuthContext);
  if (!isLoggedIn) {
    return null;
  }
  return (
    <header>
      <h1>NC News </h1>
      <div className="navigation">
        <Link to="/profile"> My Profile</Link>
        <Link to="/articles">Articles</Link>
        <Link to="/userArticles">My Articles</Link>
      </div>
      <img className="user-avatar" src={user.avatar_url} alt="user avatar" />
    </header>
  );
}

export default Header;
