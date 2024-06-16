import { useRef, useContext, useState, useEffect } from "react";
import LoadingSpinner from "../UI/LoadingSpinner";
import AuthContext from "../../store/auth-context";
import classes from "./LoginForm.module.css";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const LoginForm = (props) => {
  const [isError, setIsError] = useState(false); // State to control modal visibility
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    if (props.error) {
      setIsError(true);
    }
  }, [props.login, props.error]);

  const loginHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    props.login({
      email: enteredEmail,
      password: enteredPassword,
      method: authCtx.login,
    });
  };

  const closeModal = () => {
    setIsError(false);
  };

  return (
    <section className={classes.auth}>
      {props.error && (
        <Modal
          open={isError}
          onClose={closeModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>{props.error}</Box>
        </Modal>
      )}

      {!props.isLoading && (
        <>
          <h1>Login</h1>
          <form onSubmit={loginHandler} onFocus={props.formFocusedHandler}>
            <div className={classes.control}>
              <label htmlFor="email">Your Email</label>
              <input
                type="email"
                autoComplete="off"
                id="email"
                ref={emailInputRef}
                required
              />
            </div>
            <div className={classes.control}>
              <label htmlFor="password">Your Password</label>
              <input
                type="password"
                id="password"
                ref={passwordInputRef}
                required
                autoComplete="off"
              />
            </div>
            <div className={classes.actions}>
              <button onClick={props.finishEnteringHandler}>Log in</button>
              <button
                type="button"
                className={classes.toggle}
                onClick={props.switchAuthModeHandler}
              >
                Don't have an account? Sign up here!
              </button>
            </div>
          </form>
        </>
      )}
      {props.isLoading && <LoadingSpinner />}
    </section>
  );
};

export default LoginForm;
