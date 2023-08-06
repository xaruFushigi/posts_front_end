import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Context } from "../../helpers/AuthContext";

const ChangePasswordOfUser = () => {
  const { loggedIn, getAccessToken } = useContext(Context);
  const [
    errorMessagePasswordMismatchOnChange,
    setErrorMessagePasswordMismatchOnChange,
  ] = useState("");
  let navigate = useNavigate();
  // initial values of formik
  const initialValues = {
    oldPassword: "",
    newPassword: "",
  };
  // validation parameters of form
  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string()
      .min(3)
      .max(64)
      .required("Old Password cannot be blank"),
    newPassword: Yup.string()
      .min(3)
      .max(64)
      .required("New Password cannot be blank"),
  });
  // submit new password to the database
  const onSubmit = async (data) => {
    try {
      const response = await fetch(
        `http://localhost:10000/auth/changePassword`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            accessToken: getAccessToken,
          },
          mode: "cors",
          body: JSON.stringify({
            oldPassword: data.oldPassword,
            newPassword: data.newPassword,
            userId: loggedIn.id,
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        navigate(`/profile/${loggedIn.id}`);
      } else {
        const data = await response.json();
        setErrorMessagePasswordMismatchOnChange(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <h1 className="ml3">Change Password</h1>
      <div className="createPostPage">
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form className="formContainer">
            <label>Old Password:</label>

            {!errorMessagePasswordMismatchOnChange.error ? (
              <ErrorMessage name="oldPassword" />
            ) : (
              <span> Old Password Mismatch </span>
            )}
            {errorMessagePasswordMismatchOnChange.same && (
              <span>{errorMessagePasswordMismatchOnChange.message}</span>
            )}
            <Field
              autoComplete="off"
              id="inputCreatePost"
              name="oldPassword"
              placeholder="Old Password"
              type="password"
            />

            <label> New Password: </label>
            <ErrorMessage name="newPassword" component="span" />
            <Field
              autoComplete="off"
              id="inputCreatePost"
              name="newPassword"
              placeholder="New Password"
              type="password"
            />

            <button type="submit"> Change Password </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default ChangePasswordOfUser;
