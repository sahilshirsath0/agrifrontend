import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useTranslation } from "react-i18next";
// Fix Leaflet's missing marker issue
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const NearbyShops = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyShops, setNearbyShops] = useState([]);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (showMap) {
      // Get user location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);

          // Fetch nearby shops
          fetchNearbyShops(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, [showMap]);

  // Fetch nearby shops using Overpass API (OpenStreetMap)
  const fetchNearbyShops = async (lat, lon) => {
    const radius = 2000; // Search radius in meters (2km)
    const query = `
      [out:json];
      (
        node["shop"="supermarket"](around:${radius},${lat},${lon});
        node["shop"="convenience"](around:${radius},${lat},${lon});
        node["shop"="chemist"](around:${radius},${lat},${lon});
        node["shop"="agricultural"](around:${radius},${lat},${lon});
      );
      out;
    `;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.elements) {
        const shops = data.elements.map((shop) => ({
          id: shop.id,
          lat: shop.lat,
          lon: shop.lon,
          name: shop.tags.name || "Unknown Shop",
          type: shop.tags.shop || "Shop",
        }));
        setNearbyShops(shops);
      }
    } catch (error) {
      console.error("Error fetching nearby shops:", error);
    }
  };
  const { t } = useTranslation();
  return (
    <div>
      <button
        onClick={() => setShowMap(true)}
        style={{
          padding: "10px 20px",
          background: "#28a745",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px",
          marginBottom: "10px",
        }}
      >
        Show Nearby Shops
      </button>

      {showMap && userLocation && (
        <div
          style={{
            width: "100%",
            height: "400px",
            border: "2px solid #ccc",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <MapContainer
            center={userLocation}
            zoom={14}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* User location marker */}
            <Marker position={userLocation} icon={defaultIcon}>
              <Popup>{t("you_are_here")}</Popup>
            </Marker>

            {/* Nearby shops markers */}
            {nearbyShops.map((shop) => (
              <Marker key={shop.id} position={[shop.lat, shop.lon]} icon={defaultIcon}>
                <Popup>
                  <strong>{shop.name}</strong> <br />
                  {t("type")}: {shop.type}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default NearbyShops;
