import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google"; // Import GoogleOAuthProvider
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap
import "./i18n";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="564836411990-f4mmim1rievspf4sssh2kvfomn0ge3c3.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
