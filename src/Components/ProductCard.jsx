import React from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";
import { useTranslation } from "react-i18next";

const API_BASE_URL = "https://main-backend-9afm.onrender.com";

const ProductCard = ({ title, image, price, handleProductAction }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const removeFileExtension = (filename) =>
    filename ? filename.replace(/\.[^/.]+$/, "") : "";

  const filename = image || title;

  const imageURL = filename
    ? `${API_BASE_URL}/api/get_image/${encodeURIComponent(filename)}`
    : "";

  const convertToDevanagari = (num) =>
    String(num ?? "").replace(/\d/g, (d) => "०१२३४५६७८९"[d]);

  const displayPrice =
    i18n.language === "hi" || i18n.language === "mr"
      ? convertToDevanagari(price)
      : price;

  return (
    <Card className="product-card colorme">
      <Card.Img
        variant="top"
        src={imageURL}
        className="product-image"
        alt={removeFileExtension(title)}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.style.display = "none";
        }}
      />

      <Card.Body className="align-items-center colorme">
        <Card.Title className="product-title">
          <p className="title">{removeFileExtension(title)}</p>
        </Card.Title>

        <Card.Text className="product-price price">
          {t("price")}: ₹{displayPrice}
        </Card.Text>

        <div className="button-container">
          <Button
            variant="primary"
            className="cart-btn"
            onClick={() => {
              handleProductAction("add", {
                name: title,
                price,
                image: imageURL,
              });
              navigate("/Cart");
            }}
          >
            <span className="font">{t("add_to_cart")}</span>
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
