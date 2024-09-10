import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../context/auth-context";
import "../styling/Header.css";

const Login = () => {
  const { isLoggedIn, user, login, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const { isLoading, sendRequest, error } = useHttpClient();
  const [currentSelectedUser, setCurrentSelectedUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { users } = await sendRequest(
          `https://glawall-nc-backend-project.onrender.com/api/users`
        );
        if (!isLoading) {
          setUsers(users);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, [sendRequest]);

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
