import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AuthContext from "./helpers/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthContext>
    <App />
  </AuthContext>
);
