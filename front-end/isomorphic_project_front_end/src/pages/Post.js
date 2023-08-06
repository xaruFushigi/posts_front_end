import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom"; //useParams is responsible for post id
import { Context } from "../helpers/AuthContext";

const Post = () => {
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [listOfComments, setListOfComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { getAccessToken, loggedIn } = useContext(Context);
  let navigate = useNavigate();
  // fetches selected post
  const fetchPostsById = async () => {
    const response = await fetch(
      `https://posts-back-end.onrender.com/posts/byPostId/${id}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
      }
    );
    if (response.ok) {
      const data = await response.json();
      setPostObject(data);
    } else {
      throw new Error("failed to fetch");
    }
  };
  // displays selected post's comments
  const fetchPostIdByComment = async () => {
    const response = await fetch(
      `https://posts-back-end.onrender.com/comments/${id}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
      }
    );
    if (response.ok) {
      const data = await response.json();
      setListOfComments(data);
    } else {
      throw new Error("failed to fetch");
    }
  };
  // Delete Post by Id
  const onCLickDeletePostById = async () => {
    const response = await fetch(
      `https://posts-back-end.onrender.com/posts/byId/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          accessToken: getAccessToken,
        },
        mode: "cors",
      }
    );
    if (response.ok) {
      const data = await response.json();
      alert(data.message);
      navigate("/");
    } else {
      throw new Error("error in delete process");
    }
  };
  // add comment(s) to the selected post
  const onClickAddComment = async () => {
    try {
      const response = await fetch(
        `https://posts-back-end.onrender.com/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accessToken: getAccessToken,
          },
          mode: "cors",
          body: JSON.stringify({
            commentBody: newComment,
            PostId: id, // from useParams
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        const commentToAdd = {
          commentBody: newComment,
          username: data.username,
          id: data.PostId,
        };
        setListOfComments([...listOfComments, commentToAdd]);
        setNewComment("");
      } else {
        const data = await response.json();
        console.log(data);
        alert(data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // delete user's comment
  const onClickDeleteCommentButton = async (event) => {
    const response = await fetch(
      `https://posts-back-end.onrender.com/comments/delete/${event}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          accessToken: getAccessToken,
        },
        mode: "cors",
      }
    );
    if (response.ok) {
      alert("comment has been deleted");
      setListOfComments(
        listOfComments.filter((val) => {
          return val.id !== event;
        })
      );
    }
  };
  // catches input value of comment input
  const onChangeUserCommentInput = (event) => {
    setNewComment(event.target.value);
  };
  // displays comments of the selected post
  const mapCommentsList = () => {
    return listOfComments.map((value, index) => {
      return (
        <div key={index} className="comment">
          <div> {value.commentBody} </div>
          <label className="b">username:{value.username}</label>
          {loggedIn.username === value.username && (
            <button onClick={() => onClickDeleteCommentButton(value.id)}>
              X
            </button>
          )}
        </div>
      );
    });
  };
  // edit title of the post
  const onClickEditPostTitle = async (title) => {
    if (title == "title") {
      let newTitle = prompt("Enter new Title: ");
      try {
        const response = await fetch(
          `https://posts-back-end.onrender.com/posts/updatePostTitle`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              accessToken: getAccessToken,
            },
            mode: "cors",
            body: JSON.stringify({
              newTitle: newTitle,
              postId: id,
            }),
          }
        );
        if (response.ok) {
          setPostObject({ ...postObject, title: newTitle }); // by setting new title to the state changes will be visible immidiately
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      throw new Error("error in changing title");
    }
  };
  // edit body of the post
  const onClickEditPostBody = async (body) => {
    if (body == "body") {
      let newBody = prompt("Enter new text: ");
      try {
        const response = await fetch(
          "https://posts-back-end.onrender.com/posts/updatePostBody",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              accessToken: getAccessToken,
            },
            mode: "cors",
            body: JSON.stringify({
              newBody: newBody,
              postId: id,
            }),
          }
        );
        if (response.ok) {
          setPostObject({ ...postObject, postText: newBody });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    // if not logged in then navigate to login page
    if (!getAccessToken) {
      navigate("/login");
    } else {
      fetchPostsById();
      fetchPostIdByComment();
    }
  }, []);

  return (
    <div className="postPage">
      Post{id}
      <div className="leftSide">
        <div className="post" id="individual">
          <div
            className="title"
            onClick={() => {
              if (loggedIn.username === postObject.username) {
                // if logged in username matches with username of creator of the post post can be edited
                onClickEditPostTitle("title");
              }
            }}
          >
            {postObject.title}
          </div>
          <div
            className="body"
            onClick={() => {
              if (loggedIn.username === postObject.username) {
                // if logged in username matches with username of creator of the post post can be edited
                onClickEditPostBody("body");
              }
            }}
          >
            {postObject.postText}
          </div>
          <div className="footer">
            {postObject.username}
            {loggedIn.username === postObject.username && (
              <button onClick={onCLickDeletePostById}> Delete Post</button>
            )}
          </div>
        </div>
      </div>
      <div className="rightSide">
        <div className="addCommentContainer">
          <input
            type="text"
            placeholder="Comment..."
            autoComplete="off"
            value={newComment}
            onChange={onChangeUserCommentInput}
          />
          <button onClick={onClickAddComment}> Add Comment</button>
        </div>

        <div className="listOfComments">{mapCommentsList()}</div>
      </div>
    </div>
  );
};

export default Post;
