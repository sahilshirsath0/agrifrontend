import React, { useState, useEffect, useCallback  } from "react";
import axios from "axios";
import ProductCard from "../Components/ProductCard";
import { Button, Form, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Recommend.css";
import { useLocation } from "react-router-dom";
const soilTypes = ["Sandy", "Loamy", "Black", "Red", "Clayey"];
const cropTypes = ["Barley", "Oil seeds", "Ground Nuts", "Millets", "Rice", "Wheat", "Cotton", "Sugarcane", "Maize", "Pulses"];
import { useTranslation } from "react-i18next";
import VoiceButton from "../Components/VoiceButton";
const Recommend = ({ handleProductAction }) => {
const MAIN_API_URL = "https://main-backend-9afm.onrender.com";
const FERTILIZER_API_URL = "https://fertilizer-module.onrender.com";
const PESTICIDE_API_URL = "https://pesticide-module.onrender.com";
  const [formData, setFormData] = useState({
    "Soil Type": "",
    "Crop Type": "",
    "Temperature": "",
    "Humidity": "",
    "Moisture": "",
    "Nitrogen": "",
    "Phosphorus": "",
    "Potassium": "",
  });
  const { t } = useTranslation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); 
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pesticideResult, setPesticideResult] = useState(null);
  const [image, setImage] = useState(null);
  const [prices, setPrices] = useState({});
  const location = useLocation();
  // On mount, check token and retrieve saved recommendations.
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      const savedFertilizer = localStorage.getItem("recommendedFertilizer");
      const savedPesticide = localStorage.getItem("recommendedPesticide");

      if (savedFertilizer) setResult(JSON.parse(savedFertilizer));
      if (savedPesticide) setPesticideResult(JSON.parse(savedPesticide));
 // Detect mobile devices
    }
  }, [token, navigate]);

  useEffect(() => {
    if (location.state?.openCamera) {
      openCamera(); // Call your existing function to open the camera
    }
  }, [location]);
  // When result or pesticideResult changes (including on reload), fetch prices.
  useEffect(() => {
    if (result && result.fertilizer) {
      getPriceAndUpdateState(result.fertilizer);
    }
    if (pesticideResult && pesticideResult.recommended_pesticides) {
      pesticideResult.recommended_pesticides.split(", ").forEach((pesticide) => {
        getPriceAndUpdateState(pesticide);
      });
    }
    // We intentionally omit getPriceAndUpdateState from dependency to avoid repeated calls.
     
  }, [result, pesticideResult]);

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

 
const handleSubmit = async (e) => {
  e.preventDefault();

  const { "Soil Type": soilType, "Crop Type": cropType } = formData;

  if (!soilType || !cropType) {
    alert("Soil Type and Crop Type are required.");
    return;
  }

  setLoading(true);

  try {
    try {
      const { data: fertilizerData } = await axios.post(
        `${FERTILIZER_API_URL}/api/fertilizer/predict_fertilizer`,
        formData
      );

      setResult(fertilizerData);
      localStorage.setItem("recommendedFertilizer", JSON.stringify(fertilizerData));

      if (fertilizerData.fertilizer) {
        getPriceAndUpdateState(fertilizerData.fertilizer);
      }
    } catch (error) {
      console.error("Error fetching fertilizer recommendation:", error);
      setResult({ error: "Failed to get fertilizer recommendation" });
    }

    if (image) {
      await processPesticideRecommendation(image);
    }
  } finally {
    setLoading(false);
  }
};


  const processPesticideRecommendation = async (image) => {
    const imageFormData = new FormData();
    imageFormData.append("file", image);
  
    try {
      const { data: pesticideData } = await axios.post(
  `${PESTICIDE_API_URL}/api/disease/predict`,
  imageFormData
);
  
      setPesticideResult(pesticideData);
      localStorage.setItem("recommendedPesticide", JSON.stringify(pesticideData));
  
      if (pesticideData.recommended_pesticides) {
        const pesticideList = pesticideData.recommended_pesticides.split(", ");
  
        console.log("🔍 Fetching prices for:", pesticideList);
  
        // Fetch prices for all pesticides in parallel
        const priceResponses = await Promise.all(
          pesticideList.map(async (pesticide) => {
            try {
              const { data } = await axios.get(`${MAIN_API_URL}/get_price/${pesticide}.jpg`);
              console.log(`✅ Price fetched for ${pesticide}: ${data}`);
              return { [pesticide]: data || 400 }; // Default to 400 if no price is returned
            } catch (error) {
              console.error(`❌ Error fetching price for ${pesticide}:`, error);
              return { [pesticide]: 500 }; // Default to 500 on error
            }
          })
        );
  
        // Merge all price updates into the state at once
        const updatedPrices = Object.assign({}, ...priceResponses);
        console.log("📊 Final price mapping:", updatedPrices);
  
        setPrices((prevPrices) => ({ ...prevPrices, ...updatedPrices }));
      }
    } catch (error) {
      console.error("❌ Error fetching pesticide recommendation:", error);
      setPesticideResult({ error: "Failed to get pesticide recommendation" });
    }
  };
  
  const openCamera = useCallback(() => {
    const inputElement = document.createElement("input");
    inputElement.type = "file";
    inputElement.accept = "image/*";
    inputElement.capture = "environment"; // Forces back camera on mobile
    inputElement.style.display = "none";
  
    inputElement.onchange = (event) => {
      handleImageChange(event);
    };
  
    document.body.appendChild(inputElement);
    inputElement.click();
    document.body.removeChild(inputElement);
  }, []);
  


  
  
  
  

  // const openCamera = () => {
  //   const inputElement = document.createElement("input");
  //   inputElement.type = "file";
  //   inputElement.accept = "image/*";
  //   inputElement.capture = "environment"; // Uses the back camera
  //   inputElement.style.display = "none";
  
  //   inputElement.onchange = (event) => {
  //     handleImageChange(event);
  //   };
  
  //   document.body.appendChild(inputElement);
  //   inputElement.click();
  //   document.body.removeChild(inputElement);
  // };
  
  
  // Renamed fetchPrice to getPriceAndUpdateState for clarity.
  const getPriceAndUpdateState = async (filename) => {
    try {
      const { data } = await axios.get(`${MAIN_API_URL}/get_price/${filename}.jpg`);
      setPrices((prevPrices) => ({
        ...prevPrices,
        [filename]: data || 400, // Default price if no data is returned
      }));
    } catch (error) {
      console.error(`Error fetching price for ${filename}:`, error);
      setPrices((prevPrices) => ({
        ...prevPrices,
        [filename]: 500, // Default price on error
      }));
    }
  };
  

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
  
      // Validate file type (only images allowed)
      if (!selectedImage.type.startsWith("image/")) {
        alert("❌ Please select a valid image file.");
        return;
      }
  
      setImage(selectedImage);
    }
  };
  

  return (
    <Container className="mt-4 main">
      <h2 className="text-center text-success mb-4">
      {t("best_fertilizer_pesticide")}
      </h2>

      <Card className="p-4 op border-success">
        <Form onSubmit={handleSubmit}>
          <Row>
        
            <Col md={6}>
              <Form.Group >
                <Form.Label >{t("soil type")}:</Form.Label>
                <Form.Select    className="inside_recommend" name="Soil Type" value={formData["Soil Type"]} onChange={handleChange} required>
                  <option value="">{t("select soil type")}</option>
                  {soilTypes.map((type) => (
                    <option key={type} value={type}>
                      {t(`${type}`)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>{t("crop type")}:</Form.Label>
                <Form.Select    className="inside_recommend" name="Crop Type" value={formData["Crop Type"]} onChange={handleChange} required>
                  <option value="">{t("select crop type")}</option>
                  {cropTypes.map((type) => (
                    <option key={type} value={type}>
                          {t(`${type}`)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          
          </Row>

          <Row className="mt-3">
            {["Temperature", "Humidity", "Moisture", "Nitrogen", "Phosphorus", "Potassium"].map((field) => (
              <Col md={4} key={field}>
                <Form.Group>
                  <Form.Label >{t(`${field}`)}:</Form.Label>
                  <Form.Control
                  className="inside_recommend"
                    type="number"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={t(`enter_${field.toLowerCase()}`)}

                  />
                </Form.Group>
              </Col>
            ))}
          </Row>

          <Row className="mt-3">
  <Col>



    {/* Choose from Files Button */}
    <Form.Control
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      id="fileInput"
      style={{ display: "none" }} // Hide the default input
    />
    <Button 
      variant="outline-success alone" 
      className="me-2" 
      id="file-button"
      onClick={() => document.getElementById("fileInput").click()}
    >
      📁 {t("choose_from_files")}
    </Button>



    {/* Open Camera Button */}
    <Button 
      variant="success" 
      className="camera-button-inside"
      onClick={() => openCamera()}
    >
      📷 {t("open_camera")}
    </Button>
  </Col>
</Row>

<div
  style={{
    backgroundColor: "#fff8e1",
    color: "#795548",
    border: "1px solid #ffcc80",
    borderRadius: "8px",
    padding: "12px 16px",
    marginTop: "10px",
    fontSize: "14px",
    fontWeight: "500",
    textAlign: "center"
  }}
>
  ⚠️ Please upload only images of crops or plant leaves.
  Images of people, objects, roads, or other unrelated subjects
  are not supported.
</div>


          <Button
  variant="success"
  type="submit"
  className="mt-3 w-100"
  id="recommend-button"
  disabled={loading}
>
  {loading ? "Loading..." : t("get_recommendation")}
</Button>
        </Form>
      </Card>



<div className="cards">
      {(result?.fertilizer || pesticideResult?.recommended_pesticides) && (
        <div className="product-list">
          {result?.fertilizer && (
            <ProductCard
              title={result.fertilizer}
              image={`${result.fertilizer}.jpg`}
              price={prices[result.fertilizer]}
            />
          )}
          {pesticideResult?.recommended_pesticides?.split(", ").map((pesticide, index) => (
  <ProductCard
    key={index}
    title={pesticide}
    image={`${pesticide}.jpg`}
    price={prices[pesticide] !== undefined ? prices[pesticide] : "Fetching..."}  
    handleProductAction={handleProductAction}     
  />
))}

        </div>
      )}
      </div>
      <VoiceButton formData={formData} setFormData={setFormData} ></VoiceButton>
    </Container>
  );
};

export default Recommend;
