import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";
import { Modal, Button } from "react-bootstrap";
import "./Maps.css"
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Maps = () => {
  const [shops, setShops] = useState([]);
  const [userLocation, setUserLocation] = useState([18.5196, 73.9319]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const API_BASE_URL = "https://main-backend-9afm.onrender.com";
  const fetchShops = async (newSkip = 0) => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const response = await axios.get(
        `${API_BASE_URL}/shop/nearby?limit=5&skip=${newSkip}`
      );
      const newShops = response.data.data;

      if (newShops.length === 0) {
        setHasMore(false);
      }

      setShops((prevShops) => [
        ...prevShops,
        ...newShops.filter(
          (shop) =>
            !prevShops.some(
              (existingShop) => existingShop.shop_name === shop.shop_name
            )
        ),
      ]);

      setSkip(newSkip + 5);
    } catch (error) {
      console.log("Error fetching shops:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => console.log(error)
    );

    fetchShops(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to display star ratings
  const renderStars = (rating) => {
    return "⭐".repeat(rating);
  };

  return (
    <div className="container mt-4">
      {/* Map Section */}
      <div
        className="map-container mb-4"
        style={{ height: "450px", width: "90%", margin: "0 auto" }}
      >
        <MapContainer
          center={userLocation}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* User Marker */}
          <Marker
            position={userLocation}
            icon={L.icon({
              iconUrl:
                "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })}
          >
            <Popup>Your Location</Popup>
          </Marker>

          {/* Shop Markers */}
          {shops.map((shop, index) => (
            <Marker
              key={index}
              position={[parseFloat(shop.latitude), parseFloat(shop.longitude)]}
              icon={L.icon({
                iconUrl:
                  "https://cdn-icons-png.flaticon.com/512/1903/1903162.png",
                iconSize: [30, 30],
                iconAnchor: [15, 30],
              })}
            >
              <Popup>{shop.shop_name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Shop Details Section */}
      <div className="  mb-4 main_con">
        {shops.map((shop, index) => (
          <div
            key={index}
            className="col-md-12 mb-3"
            onClick={() => setSelectedShop(shop)}
            style={{ cursor: "pointer" }}
          >
            <div className="Mapcard shadow-sm p-3  con_content">
              <img 
                src={`${API_BASE_URL}/api/shop_image/${shop.shop_image?.split("/").pop()}`}
                alt={shop.shop_name}
                className="rounded image"
                style={{ width: "100px", height: "80px" }}
              />
              <div className="text">
                <h5 className="mb-1 f">{shop.shop_name}</h5>
            
                <p className="mb-1 f">
                {t("contact")}: {shop.contact_number}
                </p>
                <p className="mb-1 f">
                {t("timings")}:{shop.opening_time} -{" "}
                  {shop.closing_time}
                </p>
                <p className="mb-0 f">
                {t("rating")}: {renderStars(shop.rating)}
                </p>
                <p className="mb-1  f">
                {t("address")}: {shop.address}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Shop Details */}
      {selectedShop && (
        <Modal show={true} onHide={() => setSelectedShop(null)} centered 
         dialogClassName="custom-modal"
         className=""
        >
          <Modal.Header closeButton>
            <Modal.Title>{selectedShop.shop_name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
  <p><strong>{t("address")}:</strong> {selectedShop.address}</p>
  <p><strong>{t("contact")}:</strong> {selectedShop.contact_number}</p>
  <p><strong>{t("timings")}:</strong> {selectedShop.opening_time} - {selectedShop.closing_time}</p>
  <p><strong>{t("rating")}:</strong> {renderStars(selectedShop.rating)}</p>

  {/* Display Available Products */}
  <h5 className="mt-3">{t("product")}:</h5>
  <div className="product-grid">
    {selectedShop.items_available.map((productName, i) => {
      const cleanProductName = productName.trim();
      return (
        <div key={i} className="product-Mapcard">
     
          <p>{cleanProductName}</p>
        </div>
      );
    })}
  </div>
</Modal.Body>

          <Modal.Footer>
          <Button variant="success" onClick={() => navigate('/transition')}>
        {t("place_order")}
    </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Load More Button */}
      <div className="text-center mb-5">
        <button
          onClick={() => fetchShops(skip)}
          className="btn btn-success px-4 py-2"
          style={{ fontSize: "1.1rem" }}
          disabled={loading || !hasMore}
        >
          {loading ? "Loading..." : hasMore ? "Load More" : "No More Shops"}
        </button>
      </div>
    </div>
  );
};

export default Maps;
