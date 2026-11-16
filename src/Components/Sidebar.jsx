import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaLightbulb, FaBars, FaTimes } from "react-icons/fa";
import "./Sidebar.css";
import { useTranslation } from "react-i18next";
const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate(); // ✅ Move inside the component

  const openCamera = () => {
    navigate("/recommend", { state: { openCamera: true } });
  };
  const { t } = useTranslation();

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button className="toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar Container */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <ul>
          <li>
            <Link to="/cart">
              <FaShoppingCart /> {t("my_cart")}
            </Link>
          </li>
          <li>
            <button className="sidebarbtn" onClick={openCamera}>
              📷 {t("open_camera")}
            </button>
          </li>
          <li>
            <Link to="/recommend">
              <FaLightbulb /> {t("recommend_best_product")}
            </Link>
          </li>
          <li>
          <Link to="map">
   {t("open_map")}
</Link>


          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
