import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./Cart.css";
import { useTranslation } from "react-i18next";
import VoiceButton from "../Components/VoiceButton";
const Cart = () => {
  const API_BASE_URL = "https://main-backend-9afm.onrender.com";

  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const removeFileExtension = (filename) => filename.replace(/\.[^/.]+$/, "");

  useEffect(() => {
    const storedCart = JSON.parse(Cookies.get("cart") || "[]");
    setCartItems(storedCart);
  }, []);

  const removeFromCart = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    Cookies.set("cart", JSON.stringify(updatedCart));
  };

  const updateQuantity = (index, increment) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = (updatedCart[index].quantity || 1) + increment;
    if (updatedCart[index].quantity < 1) return removeFromCart(index);
    setCartItems(updatedCart);
    Cookies.set("cart", JSON.stringify(updatedCart));
  };
  const { t } = useTranslation();
  const getTotalPrice = () => {
    return cartItems
      .reduce((total, item) => total + item.price * (item.quantity || 1), 0)
      .toFixed(2);
  };

  return (
    <Container className="cart-container">
      <div className="flexme">
        {/* Shopping Cart Section */}
        <Col md={8} className="cart-section">
          <h4>{t("shopping")} ({cartItems.length} {t("items")})</h4>
          <hr />
          {cartItems.length === 0 ? (
            <p>{t("your_cart_empty")}.</p>
          ) : (
            cartItems.map((item, index) => (
              <div key={index} className="cart-item  main_cart">
                
                <div className="img"  >
              
                <img
  src={`${API_BASE_URL}/api/get_image/${item.name.includes('.jpg') ? item.name : item.name + '.jpg'}`}
  alt={item.name}
  className="cart-image"
/><div md={4} className="name">{removeFileExtension(item.name)}</div>
                </div>
                
                <div className="itms">
                <div md={2} className="price">₹{item.price}</div>
                <Col md={2} className="d-flex align-items-center buton">
                  <Button variant="light" onClick={() => updateQuantity(index, -1)}>-</Button>
                  <span className="mx-2">{item.quantity || 1}</span>
                  <Button variant="light" onClick={() => updateQuantity(index, 1)}>+</Button>
                </Col>
                <Col md={2}>
                  <Button variant="danger" size="sm" onClick={() => removeFromCart(index)}>
                  {t("remove")}
                  </Button>
                
                </Col>
                </div>
              </div>
            ))
          )}
         
        </Col>

        {/* Order Summary Section */}
        <Col md={4} className="order-summary colourme">
  <h5>{t("order_summary")}</h5>
  <hr />

  {cartItems.length === 0 ? (
    <p>{t("your_cart_empty")}.</p>
  ) : (
    <>
      {/* Column Headers */}
      <div className="cart-item-header col">
        <Col md={6}><strong>{t("product")}</strong></Col>
        <Col md={3}><strong>{t("price")}</strong></Col>
        <Col md={3}><strong>{t("quantity")}</strong></Col>
      </div>
      <hr />

      {/* Cart Items with Bullet Points */}
      {cartItems.map((item, index) => (
     <div key={index} className="cart-item  cart_mob">
     <div md={6} className="w" >
        {removeFileExtension(item.name)}
     </div>
     <div md={3} className="w" >₹{item.price}</div>
     <div md={3} className="w">{item.quantity || 1}</div>
   </div>
      ))}
    </>
  )}

  <hr />
  <div className="pad">
  <p><strong>{t("total")}
  : ₹{getTotalPrice()}</strong></p>
  <Button
  variant="primary"
  className="w-100 proceedbtn mt-3"
  onClick={() => {
    const token = localStorage.getItem("token"); // Check if user is logged in
    if (token) {
      navigate("/Map"); // Proceed to payment page
    } else {
      navigate("/login"); // Redirect to login page
    }
  }}
>
{t("proceed_to_pay")}
</Button>

  </div>
</Col>

      </div>
      <div className="continue">
      <a href="/" className="continue-shopping">← {t("continue_shopping")}</a>

      </div>
     <VoiceButton></VoiceButton>
    </Container>
    
    
  );
};

export default Cart;
