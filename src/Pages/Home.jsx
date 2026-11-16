import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProductCard from "../Components/ProductCard";
import "./Home.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { useTranslation } from "react-i18next";
// Import images
import image1 from "../assets/image2.jpg";
import image2 from "../assets/image1.jpg";
import image3 from "../assets/image3.jpg";
import VoiceButton from "../Components/VoiceButton";

const Home = ({ handleProductAction }) => {
  const [products, setProducts] = useState([]);
  const API_BASE_URL = "https://main-backend-9afm.onrender.com";
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 30;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  fetch(`${API_BASE_URL}/api/get_all_products`)
    .then((response) => response.json())
    .then((data) => setProducts(data))
    .catch((error) => console.error("Error fetching products:", error))
    .finally(() => setLoading(false));
}, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );
  const { t } = useTranslation();
  return (
    <div className="maincontainer">
      {/* Carousel Section */}
      <div className="maincarousal">
        <div
          id="carouselExampleCaptions"
          className="carousel slide maincorsal"
          data-bs-ride="carousel"
        >
          {/* Indicators */}
          <div className="carousel-indicators">
            {[image1, image2, image3].map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide-to={index}
                className={index === 0 ? "active" : ""}
                aria-label={`Slide ${index + 1}`}
              ></button>
            ))}
          </div>

          {/* Carousel Items */}
          <div className="carousel-inner">
            {[image1, image2, image3].map((image, index) => (
              <div
                key={index}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
              >
                <img
                  src={image}
                  className="d-block w-100 imgwith"
                  alt={`Slide ${index + 1}`}
                />
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            className="carousel-control-prev next"
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next prev"
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      {/* Product Cards Section */}

      {/* Product Cards Section */}

{loading ? (
  <p className="text-center mt-4">Loading...</p>
) : (
  <div className="flex flex-wrap justify-center gap product-container">
    {currentProducts.map((product) => (
      <div
        key={product._id}
        className="w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2"
      >
        <ProductCard
          title={product.filename}
          handleProductAction={handleProductAction}
          image={product.image}
          price={product.price}
        />
      </div>
    ))}
  </div>
)}

      <VoiceButton></VoiceButton>

      {/* Pagination Section */}
      <div className="pagination-container">
        <button
          id="camera-button"
          onClick={() => {
            console.log("Camera Button Clicked!");
            setCurrentPage((prev) => Math.max(prev - 1, 1));
          }}
          disabled={currentPage === 1}
        >
          {t("previous")}
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              indexOfLastProduct < products.length ? prev + 1 : prev,
            )
          }
          disabled={indexOfLastProduct >= products.length}
        >
          {t("next")}
        </button>
      </div>
    </div>
  );
};

export default Home;
