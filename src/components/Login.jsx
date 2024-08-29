import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../context/auth-context";
import "./Header.css";

const Login = () => {
  const { isLoggedIn, user, login, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const { isLoading, sendRequest, error } = useHttpClient();
  const [currentSelectedUser, setCurrentSelectedUser] = useState("");
  const navigate = useNavigate();

  function fetchUsers() {
    axios
      .get(`https://glawall-nc-backend-project.onrender.com/api/users`)
      .then((response) => {
        console.log(response.data.users);
        setUsers(response.data.users);
        return response.data.users;
      });
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleClick = () => {
    setCurrentUser("");
    navigate("/Homepage");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentUser = users.find((user) => {
      return user.username === currentSelectedUser;
    });
    if (currentUser) {
      login(currentUser);
      navigate("/articles");
    }
  };

  const handleChange = (event) => {
    const username = event.target.value;
    setCurrentSelectedUser(username);
  };
  return (
    <section className="login-container">
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <select onChange={handleChange} name="" id="user-select">
            <option value="">Please choose a user</option>
            {users.map(({ username }) => {
              return (
                <option key={username} value={username}>
                  {username}
                </option>
              );
            })}
          </select>
          <br></br>
          <div className="login-buttons">
            <button disabled={!currentSelectedUser}>Sign in</button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
