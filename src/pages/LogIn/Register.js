import React from "react";
// Formik and Yup related imports for form
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const Register = () => {
  let navigate = useNavigate();
  // initial values of formik
  const initialValues = {
    username: "",
    password: "",
  };
  // validation parameters of form
  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(64).required(),
    password: Yup.string().min(3).max(20).required(),
  });
  //Log In button
  const onSubmitRegisterButton = async (event) => {
    console.log(event);
    try {
      const response = await fetch(
        `https://posts-back-end.onrender.com/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: event.username,
            password: event.password,
          }),
          mode: "cors",
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        navigate("/login");
      } else {
        throw new Error("failed to fetch");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="pa2">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmitRegisterButton}
        >
          <Form className="formContainer">
            <label>Username :</label>
            <ErrorMessage name="username" component="span" />
            <Field
              autoComplete="off"
              id="inputCreatePost"
              name="username"
              placeholder="Username goes here"
            />

            <label>Password :</label>
            <ErrorMessage name="password" component="span" />
            <Field
              autoComplete="off"
              type="password"
              id="inputCreatePost"
              name="password"
              placeholder="Password goes here"
            />

            <button type="submit">Register</button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Register;
