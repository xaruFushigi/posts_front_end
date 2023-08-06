import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../helpers/AuthContext";

const LogIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loggedIn, setLoggedIn } = useContext(Context);
  //
  const navigate = useNavigate();

  // catches value of username input value
  const onChangeUsernameValue = (event) => {
    setUsername(event.target.value);
  };
  // catches value of password input value
  const onChangePasswordValue = (event) => {
    setPassword(event.target.value);
  };
  // sends username and password input to back-end
  const onClickLogInButton = async () => {
    try {
      const response = await fetch("http://localhost:10000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
        mode: "cors",
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("accessToken", data.accessToken);
        setLoggedIn({
          username: data.username,
          id: data.id,
          statusLoggedIn: true,
        });
        navigate("/"); // redirect to Home route
      } else {
        const data = await response.json();
        setLoggedIn({ ...loggedIn, statusLoggedIn: false });
        alert(data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="loginContainer">
      <input type="text" onChange={onChangeUsernameValue} />
      <input type="password" onChange={onChangePasswordValue} />

      <button onClick={onClickLogInButton}>Log In</button>
    </div>
  );
};

export default LogIn;
