import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Transition.css"; // Import CSS for animations
// import successImage from "../assets/success.jpg"; // Add a static image
import { useTranslation } from "react-i18next";
const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard/home after 3 seconds
    const timer = setTimeout(() => {
      navigate("/"); // Change route as needed
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);
  const { t } = useTranslation();
  return (
    <div className="payment-success-page">
      <div className="success-container">
        {/* <img src={successImage} alt="Payment Successful" className="success-image" /> */}
        <h2>{t("payment_successful")}!</h2>
        <p>{t("thank_you_payment")}. Redirecting...</p>
        <div className="loading-bar"></div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
