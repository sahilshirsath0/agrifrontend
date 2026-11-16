
import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./ForgetPassword.css";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
  const API_BASE_URL = "https://main-backend-9afm.onrender.com";

  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/users/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to generate reset code.");
        return;
      }

      setResetCode(data.reset_code || "");
      setMessage(
        `Your password reset code is: ${data.reset_code}. It expires in ${
          data.expires_in_minutes || 10
        } minutes.`
      );
      setStep(2);
    } catch (err) {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/users/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            reset_code: resetCode,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to reset password.");
        return;
      }

      setMessage("Password reset successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <h2>{t("forgot_password")}</h2>

        {step === 1 && (
          <>
            <p>Enter your registered email to generate a reset code.</p>

            <Form onSubmit={handleForgotPassword}>
              <Form.Group controlId="email" className="mb-3">
                <Form.Label>{t("email_address")}</Form.Label>
                <Form.Control
                  className="forgot_input"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? "Generating code..." : "Generate Reset Code"}
              </Button>
            </Form>
          </>
        )}

        {step === 2 && (
          <>
            <p>
              Enter the reset code shown below and choose your new password.
            </p>

            {resetCode && (
              <Alert variant="info">
                <strong>Your demo reset code:</strong>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    letterSpacing: "4px",
                    marginTop: "8px",
                  }}
                >
                  {resetCode}
                </div>
                <small>This code expires in 10 minutes.</small>
              </Alert>
            )}

            <Form onSubmit={handleResetPassword}>
              <Form.Group controlId="resetCode" className="mb-3">
                <Form.Label>Reset Code</Form.Label>
                <Form.Control
                  className="forgot_input"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  value={resetCode}
                  onChange={(e) =>
                    setResetCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  required
                />
              </Form.Group>

              <Form.Group controlId="newPassword" className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  className="forgot_input"
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </Form.Group>

              <Form.Group controlId="confirmPassword" className="mb-3">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control
                  className="forgot_input"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? "Resetting Password..." : "Reset Password"}
              </Button>
            </Form>
          </>
        )}

        {message && <Alert variant="success" className="mt-3">{message}</Alert>}
        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      </div>
    </div>
  );
};

export default ForgotPassword;
