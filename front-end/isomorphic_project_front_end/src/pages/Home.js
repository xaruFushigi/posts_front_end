import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Context } from "../helpers/AuthContext";
// like and unlike button icons
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";

const Home = () => {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [listOfLikedPosts, setListOfLikedPosts] = useState([]);
  const { getAccessToken } = useContext(Context);
  let navigate = useNavigate();
  // fetching all posts in the database
  const fetchAllPosts = async () => {
    try {
      const response = await fetch("http://localhost:10000/posts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accessToken: getAccessToken,
        },
        mode: "cors",
      });
      if (response.ok) {
        const data = await response.json();
        setListOfPosts(data.listOfPosts);
        setListOfLikedPosts(
          data.likedPosts.map((like) => {
            return like.PostId;
          })
        );
      } else {
        throw new Error("failed to fetch");
      }
    } catch (error) {
      console.log(error);
    }
  };
  // mapping over posts to display
  const mapOfListOfPostsTitle = () => {
    return listOfPosts.map((value, index) => {
      return (
        <div key={index} className="post">
          <div className="title">{value.title}</div>
          <div
            className="body"
            onClick={() => {
              navigate(`/post/${value.id}`); // navigate to selected post's individual page with comments section
            }}
          >
            {value.postText}
          </div>
          <div className="footer">
            <div className="username">
              {" "}
              <Link to={`/profile/${value.UserId}`}>{value.username}</Link>{" "}
            </div>
            <div className="buttons">
              {listOfLikedPosts.includes(value.id) ? (
                <ThumbUpAltIcon
                  onClick={() => onClickLikeButton(value.id)}
                  className="likeBttn"
                />
              ) : (
                <ThumbDownAltIcon
                  onClick={() => onClickLikeButton(value.id)}
                  className="likeBttn"
                />
              )}
              <label>{value.Likes.length}</label>
            </div>
          </div>
        </div>
      );
    });
  };
  // Like button on post
  const onClickLikeButton = async (postId) => {
    try {
      const response = await fetch("http://localhost:10000/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accessToken: getAccessToken,
        },
        mode: "cors",
        body: JSON.stringify({
          PostId: postId,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setListOfPosts(
          listOfPosts.map((post) => {
            if (post.id === postId) {
              // if the post Id that being liked matches post Id in the database
              // make the post exactly like before, but modifying Likes field
              // in Likes field keeping same array but adding zero at the end
              if (data.liked) {
                // if post has not been liked before add 1
                return { ...post, Likes: [...post.Likes, 0] }; // return modified version
              } else {
                // if post has been liked before
                const likeArray = post.Likes; // get Likes array
                likeArray.pop(); // remove last item
                return { ...post, Likes: likeArray }; // return modified version
              }
            } else {
              return post;
            }
          })
        );

        // if (!listOfLikedPosts.includes(postId)) {
        //   setListOfLikedPosts(
        //     listOfLikedPosts.filter((id) => {
        //       return id != postId;
        //     })
        //   );
        // } else {
        //   setListOfLikedPosts([...listOfLikedPosts, postId]);
        // }

        // to update liked and unliked icon on posts
        setListOfLikedPosts((prevLikedPosts) =>
          data.liked
            ? [...prevLikedPosts, postId]
            : prevLikedPosts.filter((id) => id !== postId)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // if not logged in then navigate to login page
    if (!getAccessToken) {
      // someone can fake accessToken with this way of handling of check
      navigate("/login");
    } else {
      fetchAllPosts();
    }
  }, []);

  return (
    <div>
      <div className="">{mapOfListOfPostsTitle()}</div>
    </div>
  );
};

export default Home;
