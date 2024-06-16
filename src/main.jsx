import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./store/auth-context";
import { ProfileContextProvider } from "./store/profile-context";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <ProfileContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ProfileContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
