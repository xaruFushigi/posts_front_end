import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; //responsible for user id
import { Context } from "../../helpers/AuthContext";
// like and unlike button icons
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";

const Profile = () => {
  // query parameter for user id to send to back-end
  let { profileId } = useParams();
  //
  let navigate = useNavigate();
  //state
  const [profileInfo, setProfileInfo] = useState("");
  const [listOfPostsOfProfile, setListOfPostsOfProfile] = useState([]);
  const [listOfLikedPosts, setListOfLikedPosts] = useState([]);
  // Context
  const { getAccessToken, loggedIn } = useContext(Context);
  // fetching user's data for requested profile
  const fetchUserByIdForProfilePage = async () => {
    try {
      const response = await fetch(
        `https://posts-back-end.onrender.com/auth/profile/byId/${profileId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setProfileInfo(data.profileInfo);
      } else {
        throw new Error("error in fetching User profile data");
      }
    } catch (error) {
      console.log(error);
    }
  };
  // fetches user's posts
  const fetchUserPostsByIdForProfilePage = async () => {
    try {
      const response = await fetch(
        `https://posts-back-end.onrender.com/byProfileId/${profileId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          mode: "cors",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setListOfPostsOfProfile(data);
      } else {
        throw new Error("failed to fetch posts of slected profile");
      }
    } catch (error) {
      console.log(error);
    }
  };
  // displays user's posts
  const mapListOfPostsOfSelectedProfile = () => {
    return listOfPostsOfProfile.map((value, index) => {
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
            <div className="username">{value.username}</div>

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
      const response = await fetch("https://posts-back-end.onrender.com/like", {
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
        setListOfPostsOfProfile(
          listOfPostsOfProfile.map((post) => {
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
  // Change password button
  const onClickChangePasswordButton = async () => {
    await navigate("/profile/changeProfilePassword");
  };
  useEffect(() => {
    fetchUserByIdForProfilePage();
    fetchUserPostsByIdForProfilePage();
  }, []);

  return (
    <div className="profilePageContainer flex flex-row">
      <div className="basicInfo leftSide flex flex-column items-start pt4">
        <div className="flex flex-row">
          <h1>Username: {profileInfo.username}</h1>
          {loggedIn.username === profileInfo.username && (
            <button className="mt4" onClick={onClickChangePasswordButton}>
              Change Password
            </button>
          )}
        </div>

        <div>
          <h2>Joined date : {profileInfo.createdAt}</h2>
        </div>
      </div>

      <div className="rightSide">
        <div className="listOfPosts">{mapListOfPostsOfSelectedProfile()}</div>
      </div>
    </div>
  );
};

export default Profile;
