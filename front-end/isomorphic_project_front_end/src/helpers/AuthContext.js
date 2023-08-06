import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Context = createContext();

const AuthContext = (props) => {
  // initial values of logged in state
  const [loggedIn, setLoggedIn] = useState({
    username: "",
    id: 0,
    statusLoggedIn: false,
  });
  // get from localStorage access token value
  const getAccessToken = localStorage.getItem("accessToken");
  // LogOut Button
  const onClickLogOutButton = () => {
    localStorage.removeItem("accessToken");
    setLoggedIn({ username: "", id: 0, statusLoggedIn: false });
    window.open("/login", "_self");
  };
  // retrieve from back-end accessToken's validateToken to avoid fake accessToken
  const fetchValidToken = async () => {
    try {
      const response = await fetch("http://localhost:10000/auth/validToken", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accessToken: getAccessToken,
        },
        mode: "cors",
      });
      if (response.ok) {
        const data = await response.json();
        setLoggedIn({
          username: data.username,
          accessToken: data.accessToken,
          id: data.id,
          statusLoggedIn: true,
        });
      } else {
        setLoggedIn({
          username: "",
          id: 0,
          statusLoggedIn: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  // by doing so logged in state will be preserved even after refreshing web page
  const checkLogInState = () => {
    if (getAccessToken) {
      setLoggedIn({ ...loggedIn, statusLoggedIn: true });
    } else {
      setLoggedIn({ ...loggedIn, statusLoggedIn: false });
    }
  };

  useEffect(() => {
    fetchValidToken();
    checkLogInState();
  }, []);

  const contextValues = {
    loggedIn,
    setLoggedIn,
    getAccessToken,
    onClickLogOutButton,
  };
  return (
    <div>
      <Context.Provider value={contextValues}>
        {props.children}
      </Context.Provider>
    </div>
  );
};

export default AuthContext;
