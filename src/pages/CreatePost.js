import React, { useEffect, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Context } from "../helpers/AuthContext";

const CreatePost = () => {
  const { getAccessToken } = useContext(Context);
  let navigate = useNavigate();
  // initial values of formik
  const initialValues = {
    title: "",
    postText: "",
  };
  // validation parameters of form
  const validationSchema = Yup.object().shape({
    title: Yup.string().min(3).max(64).required("Title is mandatory"),
    postText: Yup.string().required(),
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch(
        "https://posts-back-end.onrender.com/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accessToken: getAccessToken,
          },
          body: JSON.stringify({
            title: data.title,
            postText: data.postText,
            username: data.username,
          }),
          mode: "cors",
        }
      );
      if (response.ok) {
        navigate("/");
      } else {
        throw new Error("failed to fetch");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // if not logged in then navigate to login page
    if (!getAccessToken) {
      navigate("/login");
    }
  });

  return (
    <div className="createPostPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label> Title: </label>
          <ErrorMessage name="title" component="span" />
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="title"
            placeholder="(Ex. Title...)"
          />

          <label> Post: </label>
          <ErrorMessage name="postText" component="span" />
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="postText"
            placeholder="(Ex. Post...)"
          />

          <button type="submit"> Create Post </button>
        </Form>
      </Formik>
    </div>
  );
};

export default CreatePost;
