import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import "./ResetPassword.css"
import { useTranslation } from "react-i18next";
const ResetPassword = () => {
  const { token } = useParams(); // Get token from URL
  const [email, setEmail] = useState("");
  const API_BASE_URL = "https://main-backend-9afm.onrender.com";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  // Validate Token
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/users/reset-password/${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Token is valid.") {
          setEmail(data.email);
        } else {
          setError(data.message);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("An error occurred while validating the token.");
        setLoading(false);
      });
  }, [token]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Password reset successful. Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch {
      setMessage("An error occurred. Please try again.");
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div className="reset-password-page">
      <div className="reset-password-container ">
        <h2>{t("reset_password")}</h2>
        {error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <>
            <p>{t("resetting password for")}: <b>{email}</b></p>
            <Form onSubmit={handleResetPassword}>
              <Form.Group controlId="newPassword">
          
                <Form.Control className="reset_width"
                  type="password"
          
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                 
                />
              </Form.Group>
              <Form.Group  controlId="confirmPassword">
                <Form.Label  >{t("confirm_password")}</Form.Label>
                <Form.Control 
            className="reset_width"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="success" type="submit">
              {t("reset_password")}
              </Button>
            </Form>
            {message && <Alert variant="info">{message}</Alert>}
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
