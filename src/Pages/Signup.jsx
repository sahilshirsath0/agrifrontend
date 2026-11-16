import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Signup.css"; // Ensure CSS file is linked
import { useTranslation } from "react-i18next";
const Signup = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
const API_BASE_URL = "https://main-backend-9afm.onrender.com";
  
const handleSignup = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    setMessage("Passwords do not match!");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(`${API_BASE_URL}/users/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } else {
      setMessage(`Error: ${data.message}`);
    }
  } catch (err) {
    setMessage(`Signup failed: ${err.message || "An error occurred"}`);
  } finally {
    setLoading(false);
  }
};

  const { t } = useTranslation();
  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2>{t("agro_basket_signup")}</h2>
        <p>{t("join_platform")}!</p>

        <Form onSubmit={handleSignup}>
          <Form.Group controlId="name">
            <Form.Label>{t("full_name")}</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setName(e.target.value)}
              className="fixwidth"
              required
            />
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label>{t("email_address")}</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="fixwidth"
            />
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>{t("password")}</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="fixwidth"
              required
            />
          </Form.Group>

          <Form.Group controlId="confirmPassword">
            <Form.Label>{t("confirm_password")}</Form.Label>
            <Form.Control
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="fixwidth"
              required
            />
          </Form.Group>

          <Button
  variant="success"
  type="submit"
  className="signup-btn"
  disabled={loading}
>
  {loading ? "Loading..." : t("sign_up")}
</Button>
        </Form>

        {message && <p className="message">{message}</p>}

        <p className="login-link">
        {t("already_have_account")}? <a href="/login">{t("login")}</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
