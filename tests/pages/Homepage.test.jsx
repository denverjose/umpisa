import { render, screen } from "@testing-library/react";
import LoginForm from "../../src/components/Auth/LoginForm";
import RegisterForm from "../../src/components/Auth/RegisterForm";

describe("App", () => {
  it("renders the Login and Register component", () => {
    render(
      <>
        <LoginForm />
        <RegisterForm />
      </>
    );

    screen.debug(); // prints out the jsx in the App component unto the command line
  });
});
