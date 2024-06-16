import { useState, useEffect } from "react";
import RegisterForm from "../components/Auth/RegisterForm";
import LoginForm from "../components/Auth/LoginForm";
import useHttp from "../hooks/use-http";
import { addUser, authLogin } from "../lib/api";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [err, setErr] = useState(null);
  const [isEntering, setIsEntering] = useState(false);
  const { sendRequest: requestRegister, status } = useHttp(addUser);
  const { sendRequest: requestLogin, loginStatus, error } = useHttp(authLogin);

  useEffect(() => {
    if (status === "completed") {
      setIsLogin(true);
    }
  }, [status]);

  useEffect(() => {
    if (error) {
      setErr(error);
    }
  }, [error]);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
    setErr(null);
  };

  const registerHandler = (quoteData) => {
    requestRegister(quoteData);
  };
  const loginHandler = (requestData) => {
    setErr(null);
    requestLogin(requestData);
  };

  const finishEnteringHandler = () => {
    setIsEntering(false);
  };

  const formFocusedHandler = () => {
    setIsEntering(true);
  };

  return (
    <>
      {isLogin ? (
        <LoginForm
          login={loginHandler}
          switchAuthModeHandler={switchAuthModeHandler}
          isLoading={loginStatus === "pending"}
          error={err}
          isEntering={isEntering}
          formFocusedHandler={formFocusedHandler}
          finishEnteringHandler={finishEnteringHandler}
        />
      ) : (
        <RegisterForm
          register={registerHandler}
          switchAuthModeHandler={switchAuthModeHandler}
          isLoading={status === "pending"}
          isEntering={isEntering}
          formFocusedHandler={formFocusedHandler}
          finishEnteringHandler={finishEnteringHandler}
        />
      )}
    </>
  );
};

export default LoginPage;
