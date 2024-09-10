import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";

const Profile = () => {
  const { isLoggedIn, user, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate("/");
  };
  return isLoggedIn ? (
    <div>
      <div className="user-card">
        <h2> Welcome {user.name}!</h2>
        <img src={user.avatar_url} alt="user avatar" />
      </div>
      <br></br>
      <button onClick={logout}> Logout</button>
    </div>
  ) : (
    <section>
      <h2> Please log in to continue!</h2>
      <div>
        <button onClick={handleLoginClick}>Sign In</button>
      </div>
    </section>
  );
};

export default Profile;
