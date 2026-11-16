import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import axios from "axios";

const soilTypes = [
  { label: "Sandy", value: "Sandy" },
  { label: "Loamy", value: "Loamy" },
  { label: "Black", value: "Black" },
  { label: "Red", value: "Red" },
  { label: "Clayey", value: "Clayey" },
];

const cropTypes = [
  { label: "Barley", value: "Barley" },
  { label: "Oil seeds", value: "Oil seeds" },
  { label: "Ground Nuts", value: "Ground Nuts" },
  { label: "Millets", value: "Millets" },
  { label: "Rice", value: "Rice" },
  { label: "Wheat", value: "Wheat" },
  { label: "Cotton", value: "Cotton" },
  { label: "Sugarcane", value: "Sugarcane" },
  { label: "Maize", value: "Maize" },
  { label: "Pulses", value: "Pulses" },
];

const Recommendation = () => {
  const [formData, setFormData] = useState({
    soilType: null,
    cropType: null,
    temperature: "",
    humidity: "",
    moisture: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
  });
  const [result, setResult] = useState(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
const API_BASE_URL = "https://fertilizer-module.onrender.com";

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/fertilizer/predict`, {
        "Soil Type": formData.soilType?.value || "Sandy",
        "Crop Type": formData.cropType?.value || "Rice",
        Temperature: formData.temperature || 25,
        Humidity: formData.humidity || 50,
        Moisture: formData.moisture || 30,
        Nitrogen: formData.nitrogen || 10,
        Phosphorus: formData.phosphorus || 10,
        Potassium: formData.potassium || 10,
      });
      setResult(response.data.fertilizer);
    } catch (error) {
      console.error("Error fetching fertilizer prediction", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <Card className="w-full max-w-2xl p-6 bg-white shadow-lg rounded-2xl">
        <CardContent className="flex flex-col space-y-4">
          <h2 className="text-2xl font-semibold">Fertilizer Recommendation</h2>

          <Select
            options={soilTypes}
            placeholder="Select Soil Type"
            onChange={(selected) => handleChange("soilType", selected)}
            isSearchable
          />

          <Select
            options={cropTypes}
            placeholder="Select Crop Type"
            onChange={(selected) => handleChange("cropType", selected)}
            isSearchable
          />

          <Input
            placeholder="Temperature (°C)"
            type="number"
            onChange={(e) => handleChange("temperature", e.target.value)}
          />

          <Input
            placeholder="Humidity (%)"
            type="number"
            onChange={(e) => handleChange("humidity", e.target.value)}
          />

          <Input
            placeholder="Moisture (%)"
            type="number"
            onChange={(e) => handleChange("moisture", e.target.value)}
          />

          <Input
            placeholder="Nitrogen (mg/kg)"
            type="number"
            onChange={(e) => handleChange("nitrogen", e.target.value)}
          />

          <Input
            placeholder="Phosphorus (mg/kg)"
            type="number"
            onChange={(e) => handleChange("phosphorus", e.target.value)}
          />

          <Input
            placeholder="Potassium (mg/kg)"
            type="number"
            onChange={(e) => handleChange("potassium", e.target.value)}
          />

          <Button onClick={handleSubmit} className="w-full text-lg">
            Predict Fertilizer
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="mt-6 p-4 bg-white shadow-md rounded-xl">
          <h3 className="text-lg font-medium">
            Recommended Fertilizer: {result}
          </h3>
          {/* Placeholder for Image & Details Rendering */}
        </div>
      )}
    </div>
  );
};

export default Recommendation;
