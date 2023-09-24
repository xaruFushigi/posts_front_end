// React
import React, { useContext } from "react";
// Dependencies
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import { Context } from "./helpers/AuthContext";
// CSS
import "./App.css";
import "tachyons";
// JS
import {
  Home,
  CreatePost,
  Post,
  LogIn,
  Register,
  NotFound,
  Profile,
  ChangePasswordOfUser,
} from "./pages";
function App() {
  const { loggedIn, onClickLogOutButton } = useContext(Context);

  return (
    <div className="App w-100">
      <Router>
        <div className="navbar">
          <div className="links">
            {!loggedIn.statusLoggedIn ? (
              <>
                <Link to="/login"> LogIn</Link>
                <Link to="/register"> Register New User </Link>
              </>
            ) : (
              <>
                <Link to="/"> Home</Link>
                <Link to="/createPost"> New Post</Link>

                <div className="loggedInContainer">
                  <Link className="mr2" to={`/profile/${loggedIn.id}`}>
                    Profile
                  </Link>
                  <button onClick={onClickLogOutButton}>LogOut</button>
                </div>
              </>
            )}
            {<h1>{loggedIn.username}</h1>}
          </div>
        </div>

        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/createPost" exact element={<CreatePost />} />
          <Route path="/post/:id" exact element={<Post />} />
          <Route path="/login" exact element={<LogIn />} />
          <Route path="/register" exact element={<Register />} />
          <Route path="*" exact element={<NotFound />} />
          <Route path="/profile/:profileId" exact element={<Profile />} />
          <Route
            path="/profile/changeProfilePassword"
            exact
            element={<ChangePasswordOfUser />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
