import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLinkedin, FaGlobe } from "react-icons/fa";
import "./Footer.css";
import { useTranslation } from "react-i18next";
const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo and Company Name */}
        <div className="footer-brand">
          <img src="src\assets\images.jpeg" alt="AgriShop Logo" className="footer-logo" />
          <h2>AgroShop</h2>
        </div>

        {/* Footer Links */}
        <div className="footer-links">
          <div className="footer-column">
            <h6>{t("full_name")}</h6>
            <a href="">AgroShop App</a>
            <a href="#">{t("find_products")}</a>
          </div>
          <div className="footer-column">
            <h6>{t("for_agro_retailers")}</h6>
            <a href="#">{t("partner_app")}</a>
            <a href="#">{t("quality_check")}</a>
          </div>
          <div className="footer-column">
            <h6>{t("for_businesses")}</h6>
            <a href="#">{t("api_solutions")}</a>
            <a href="#">{t("market_insight")}</a>
          </div>
          <div className="footer-column">
            <h6>{t("company")}y</h6>
            <a href="#">{t("job_offers")}</a>
            <a href="#">Press & Media</a>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="social-icons">
          <a href="#"><FaInstagram /></a>
          <a href="#"><FaYoutube /></a>
          <a href="#"><FaFacebook /></a>
          <a href="#"><FaTwitter /></a>
          <a href="#"><FaLinkedin /></a>
        </div>

        {/* Google Play Button */}
        <div className="footer-playstore">
          <img src="src\assets\google.png" alt="Get it on Google Play" />
        </div>

        {/* Language Selector */}
        <div className="footer-language">
          <button className="lang-btn">
            <FaGlobe /> En
          </button>
        </div>
      </div>

      {/* Bottom Footer Links */}
      <div className="footer-bottom">
        <p>© 2025 AgriShop</p>
        
        <a href="#">{t("privacy_notice")}</a>
        <a href="#">{t("terms_of_use")}</a>
        <a href="#">{t("manage_cookies")}</a>
        <a href="#">{t("sitemap")}</a>
      </div>
    </footer>
  );
};

export default Footer;
