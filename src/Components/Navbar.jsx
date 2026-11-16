import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import logo from "../assets/agro.jpg"; // Logo import
import "./Navbar.css"; // CSS file
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

const AppNavbar = ({ isSidebarOpen }) => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("token"); // Check if user is logged in
  const { t, i18n } = useTranslation(); // Initialize translation hook
  const [selectedLang, setSelectedLang] = useState(i18n.language || "en"); // Set default language

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.clear(); // Clear local storage
    Cookies.remove("cart"); // Remove cart data
    navigate("/login"); // Redirect to login page
    window.location.reload();
  };

  // Change language function
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("selectedLanguage", lang); // Store preference
    setSelectedLang(lang);
  };

  // Open Camera Function for Fertilizer Recommendation
  const openCamera = () => {
    navigate("/recommend", { state: { openCamera: true } });
  };

  return (
    <Navbar expand="lg" className={`custom-navbar ${isSidebarOpen ? "shifted" : ""}`}>
      <Container>
        {/* Logo & Brand Name */}
        <Navbar.Brand as={Link} to="/" className="brand-logo">
          <img src={logo} alt="Agro Basket Logo" className="nav-logo" />
          {t("agro_basket_app")}
        </Navbar.Brand>

        {/* Mobile Toggle */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Right-aligned Nav Items */}
          <Nav className="ms-auto nav-icons">
            {/* Cart Icon */}
            <Nav.Link as={Link} to="/cart" className="nav-icon">
              <FaShoppingCart /> {t("cart")}
            </Nav.Link>

            {/* Open Camera Button */}
            <div className="navOpenCamera">
              <Button variant="success" id="camera-button" className="font" onClick={openCamera}>
                <span className="font_nav">📷 {t("open_camera")}</span>
              </Button>
            </div>

            {/* Language Switcher */}
            <div className="language-switcher">
              <Button variant={selectedLang === "en" ? "primary" : "light"} onClick={() => changeLanguage("en")}>
                English
              </Button>
              <Button variant={selectedLang === "hi" ? "primary" : "light"} onClick={() => changeLanguage("hi")}>
                हिन्दी
              </Button>
              <Button variant={selectedLang === "mr" ? "primary" : "light"} onClick={() => changeLanguage("mr")}>
                मराठी
              </Button>
            </div>

            {/* Login / Logout Button */}
            {isLoggedIn ? (
              <Button onClick={handleLogout} className="nav-button ms-3" variant="danger">
                <FaUser /> {t("logout")}
              </Button>
            ) : (
              <Button as={Link} to="/login" className="nav-button ms-3">
                <FaUser /> {t("login")}
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
