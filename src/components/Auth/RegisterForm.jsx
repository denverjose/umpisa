import React from 'react';
import Card from "../UI/Card";
import LoadingSpinner from "../UI/LoadingSpinner";
import classes from "./RegisterForm.module.css";
import useInput from "../../hooks/use-input";
import picture from '../../assets/defaultPicture.png'

const RegisterForm = (props) => {
  const isEmail = (value) => value.includes("@");
  const isNameValid = (value) =>
    value.trim().length >= 2 && value.trim().length <= 400;
  const isPassword = (value) => value.trim().length >= 6;
  const isConfirmPassword = (value) => value === passwordValue;

  const {
    value: firstNameValue,
    isValid: firstNameIsValid,
    hasError: firstNameHasError,
    valueChangeHandler: firstNameChangeHandler,
    inputBlurHandler: firstNameBlurHandler,
  } = useInput(isNameValid);
  const {
    value: lastNameValue,
    isValid: lastNameIsValid,
    hasError: lastNameHasError,
    valueChangeHandler: lastNameChangeHandler,
    inputBlurHandler: lastNameBlurHandler,
  } = useInput(isNameValid);
  const {
    value: emailValue,
    isValid: emailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
  } = useInput(isEmail);
  const {
    value: passwordValue,
    isValid: passwordIsValid,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
  } = useInput(isPassword);
  const {
    value: confirmPasswordValue,
    isValid: confirmPasswordIsValid,
    hasError: confirmPasswordHasError,
    valueChangeHandler: confirmPasswordChangeHandler,
    inputBlurHandler: confirmPasswordBlurHandler,
  } = useInput(isConfirmPassword);

  let formIsValid = false;

  if (
    firstNameIsValid &&
    lastNameIsValid &&
    emailIsValid &&
    passwordIsValid &&
    confirmPasswordIsValid
  ) {
    formIsValid = true;
  }

  const registrationHandler = (event) => {
    event.preventDefault();
    props.register({
      firstName:
        firstNameValue.charAt(0).toUpperCase() + firstNameValue.slice(1),
      lastName: lastNameValue.charAt(0).toUpperCase() + lastNameValue.slice(1),
      profilePicture: picture,
      email: emailValue,
      password: passwordValue,
    });
  };

  const firstNameClasses = firstNameHasError ? "invalid" : "control";
  const lastNameClasses = lastNameHasError ? "invalid" : "control";
  const emailClasses = emailHasError ? "invalid" : "control";
  const passwordClasses = passwordHasError ? "invalid" : "control";
  const confirmPasswordClasses = confirmPasswordHasError ? "invalid" : "control";

  return (
    <>
    
      <Card className={classes.auth}>
        <h1>Register</h1>
        <form onSubmit={registrationHandler} onFocus={props.formFocusedHandler}>
          <div className={classes[firstNameClasses]}>
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              autoComplete="off"
              value={firstNameValue}
              onChange={firstNameChangeHandler}
              onBlur={firstNameBlurHandler}
            />
          </div>
          <div className={classes[lastNameClasses]}>
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              id="lastName"
              autoComplete="off"
              value={lastNameValue}
              onChange={lastNameChangeHandler}
              onBlur={lastNameBlurHandler}
            />
          </div>
          <div className={classes[emailClasses]}>
            <label htmlFor="email">Your Email:</label>
            <input
              type="email"
              id="email"
              autoComplete="off"
              value={emailValue}
              onChange={emailChangeHandler}
              onBlur={emailBlurHandler}
            />
          </div>
          <div className={classes[passwordClasses]}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              autoComplete="off"
              value={passwordValue}
              onChange={passwordChangeHandler}
              onBlur={passwordBlurHandler}
            />
          </div>
          <div className={classes[confirmPasswordClasses]}>
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              autoComplete="off"
              value={confirmPasswordValue}
              onChange={confirmPasswordChangeHandler}
              onBlur={confirmPasswordBlurHandler}
            />
          </div>
          <div className={classes.actions}>
            {!props.isLoading && (
              <button
                disabled={!formIsValid}
                onClick={props.finishEnteringHandler}
              >
                Register Account
              </button>
            )}
            {props.isLoading && <LoadingSpinner />}
            <button
              type="button"
              className={classes.toggle}
              onClick={props.switchAuthModeHandler}
            >
              Already have an account? Sign in here!
            </button>
          </div>
        </form>
      </Card>
    </>
  );
};

export default RegisterForm;
