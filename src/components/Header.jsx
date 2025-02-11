import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/userAuth.jsx";
import ThemeToggle from "./ThemeToggle";
import "../styling/Header.css";
import { useNavigate } from "react-router-dom";

function Header() {
  const { isLoggedIn, user, logout } = useAuth();
  const [logo, setLogo] = useState("/relay.png");

  useEffect(() => {
    const updateLogo = () => {
      const isDarkMode = document.body.classList.contains("dark-theme");
      setLogo(isDarkMode ? "/darkmoderelay.png" : "/relay.png");
    };

    updateLogo();
    const observer = new MutationObserver(updateLogo);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    if (document.body.classList.contains("dark-theme")) {
      setLogo("/darkmoderelay.png");
    }

    return () => observer.disconnect();
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <header>
      <div className="header-content">
        <div className="top-row">
          <img src={logo} alt="Relay News" className="header-logo" />
        </div>

        <div className="bottom-row">
          <nav className="navigation">
            <NavLink to="/articles">Home</NavLink>
            {isLoggedIn && (
              <>
                <NavLink to="/my-articles">My Articles</NavLink>
                <NavLink to="/post-article">Post Article</NavLink>
              </>
            )}
          </nav>
          <div className="header-right">
            <ThemeToggle />
            {isLoggedIn && (
              <div className="user-controls">
                {user && (
                  <div className="user-info">
                    <img
                      src={user.avatar_url}
                      alt="User avatar"
                      className="user-avatar"
                    />
                    <span className="username">{user.username}</span>
                  </div>
                )}
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
