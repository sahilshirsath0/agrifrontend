import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Payment = ({ orderDetails }) => {
  const navigate = useNavigate();
const API_BASE_URL = "https://main-backend-9afm.onrender.com";
  useEffect(() => {
    if (!orderDetails) {
      navigate("/"); // Redirect to home if no order details
    }
  }, [orderDetails, navigate]);

  const handlePayment = async () => {
    try {
      // Step 1: Create order from backend
      const { data } = await axios.post(`${API_BASE_URL}/api/payment/create`, {
        amount: orderDetails.amount,
        currency: "INR",
      });

      const options = {
        key: "YOUR_RAZORPAY_KEY", // Add your Razorpay Key
        amount: data.amount,
        currency: "INR",
        name: "Plant Care Store",
        description: "Purchase of agricultural products",
        order_id: data.id,
        handler: async function (response) {
          const verifyRes = await axios.post("/api/payment/verify", {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyRes.data.success) {
            alert("Payment Successful! Redirecting to tracking...");
            navigate(`/order-tracking/${data.orderId}`);
          } else {
            alert("Payment Failed. Please try again.");
          }
        },
        prefill: {
          name: "John Doe",
          email: "john@example.com",
          contact: "9876543210",
        },
        theme: {
          color: "#28a745",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment failed. Try again.");
    }
  };

  return (
    <div className="container text-center mt-5">
      <h2>Complete Your Payment</h2>
      <p>Amount: ₹{orderDetails.amount}</p>
      <button className="btn btn-success" onClick={handlePayment}>
        Pay Now
      </button>
    </div>
  );
};

export default Payment;
