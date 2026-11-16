import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import "./login.css"; // Linking CSS
import bgImage from "../assets/login.jpeg"; // 
// Background image
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const API_BASE_URL = "https://main-backend-9afm.onrender.com";

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token); // Store token
        localStorage.setItem("userEmail", email); // Store user email
        localStorage.setItem(`cart_${email}`, JSON.stringify([])); // Initialize user-specific cart
        setMessage(`Welcome, ${data.username}!`);
        navigate("/");
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (err) {
      setMessage(`Login failed: ${err.message || "An error occurred"}`);
    }
  };

  const handleGoogleLogin = async (response) => {
    const { credential } = response;
    try {
      const googleResponse = await fetch(`${API_BASE_URL}/users/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credential }),
      });
      const data = await googleResponse.json();
      if (googleResponse.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userEmail", data.email); // Store Google email
        localStorage.setItem(`cart_${data.email}`, JSON.stringify([]));
        setMessage(`Welcome, ${data.username}!`);
        navigate("/");
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (err) {
      setMessage(`Google login failed: ${err.message || "An error occurred"}`);
    }
  };
  const { t } = useTranslation();
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form login_size">
          <h2>{t("welcome_back")}!</h2>
          <p>{t("login_to_continue")}</p>
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="email">
              <Form.Label>{t("email_address")}</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>{t("password")}</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              
            </Form.Group>
            <div className="auth-links">
            <Link to="/ForgotPassword">{t("forgot_password")}?</Link>
            </div>
            <Button variant="success" type="submit" className="login-btn">
            {t("login")}
            </Button>
          </Form>
          <div className="separator">or</div>
          <GoogleLogin onSuccess={handleGoogleLogin} onFailure={handleGoogleLogin} className="google-btn" />
          {message && <p className="message">{message}</p>}
          <p className="signup-link">
          {t("new_user")}? <a href="/signup">Sign Up</a>
          </p>
        </div>
        <div className="login-image" style={{ backgroundImage: `url(${bgImage})` }}>
          <div className="overlay-text">"{t("trusted_platform")}! "</div>
        </div>
      </div>
    </div>
  );
};

export default Login;
