import React, { useState, useEffect } from "react";
import { Card, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./Buy.css";

import { useTranslation } from "react-i18next";
const Buy = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(Cookies.get("cart") || "[]");
    setCartItems(storedCart);
  }, []);

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  const handlePurchase = () => {
    alert("Purchase successful!");
    Cookies.remove("cart"); // Clear cart after purchase
    setCartItems([]);
    navigate("/confirmation");
  };
  const { t } = useTranslation();
  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Order Summary</h2>
      {cartItems.length === 0 ? (
        <Alert variant="warning" className="text-center">
         {t("no_items_to_purchase")}
        </Alert>
      ) : (
        <>
          <Row>
            {cartItems.map((item, index) => (
              <Col md={6} lg={4} key={index} className="mb-3">
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>{t("price")}: ₹{item.price}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-4">
            <h4>Total: ₹{getTotalPrice()} (Including Taxes)</h4>
            <Button variant="primary" onClick={handlePurchase}>{t("proceed_to_pay")}</Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default Buy;