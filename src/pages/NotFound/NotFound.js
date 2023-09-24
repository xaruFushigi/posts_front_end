import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div>
      <h1>Page Not Found :/</h1>
      <h3>Try these link:</h3>
      <div className="flex flex-column">
        <Link to="/login"> LogIn</Link>
        <Link to="/register"> Register New User </Link>
      </div>
    </div>
  );
};

export default NotFound;
