import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdminShops.css";


const AdminShops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(null);
  const [editedShop, setEditedShop] = useState({});
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [show, setShow] = useState(false);
  const API_BASE_URL = "https://main-backend-9afm.onrender.com";
  const [shopData, setShopData] = useState({
      name: '',
      items_available: '',
      latitude: '',
      longitude: '',
      rating: '',
      address: '',
      contact: '',
      opening_time: '',
      closing_time: '',
      image: null
  });

  const closeAddShopModal = () => setShow(false);
  const openAddShopModal = () => setShow(true);

  const handleAddChange = (e) => {
      const { name, value } = e.target;
      setShopData({ ...shopData, [name]: value });
  };

  const handleFileChange = (e) => {
      setShopData({ ...shopData, image: e.target.files[0] });
  };

  const submitShopDetails = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    Object.keys(shopData).forEach((key) => {
        formData.append(key, shopData[key]);
    });

    try {
        const response = await fetch(`${API_BASE_URL}/api/shops/add`, {
            method: "POST",
            body: formData,
        });

        const result = await response.json();
        if (response.ok) {
            alert("Shop added successfully!");
            closeAddShopModal();
            setShopData({
                shop_name: '',
                items_available: '',
                latitude: '',
                longitude: '',
                rating: '',
                address: '',
                contact: '',
                opening_time: '',
                closing_time: '',
                shop_image: null
            });
        } else {
            alert("Error: " + result.error);
        }
    } catch (error) {
        console.error("Error adding shop:", error);
        alert("Failed to add shop.");
    }
};

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/shop`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setShops(response.data);
        } else {
          setShops([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching shops:", error);
        setShops([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
    setShowImageModal(true);
  };

  const handleEdit = (shop) => {
    if (!shop._id) {
      console.error("Error: shop._id is missing in handleEdit");
      return;
    }
    setEditMode(shop._id);
    setEditedShop({ ...shop });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedShop((prev) => ({ ...prev, [name]: value }));
  };

  const applyChanges = () => {
    if (!editedShop._id) {
      console.error("Error: Shop ID is missing before sending request", editedShop);
      return;
    }

    const updatedShop = {
      shop_id: editedShop._id,
      shop_name: editedShop.shop_name,
      latitude: editedShop.latitude,
      longitude: editedShop.longitude,
      rating: editedShop.rating,
      address: editedShop.address,
      contact_number: editedShop.contact_number,
      opening_time: editedShop.opening_time,
      items_available: Array.isArray(editedShop.items_available)
        ? editedShop.items_available
        : editedShop.items_available?.split(", ") || [], // Handle string input
    };

    console.log("Sending update request with data:", updatedShop);

    axios
      .put(`${API_BASE_URL}/api/update_shop`, updatedShop, {
        headers: { "Content-Type": "application/json" },
      })
      .then(() => {
        console.log("Shop updated successfully!");

        // 🔄 **Re-fetch updated shops**
        axios
          .get(`${API_BASE_URL}/api/shop`)
          .then((response) => {
            if (Array.isArray(response.data)) {
              setShops(response.data);
            } else {
              setShops([]);
            }
          })
          .catch((error) => {
            console.error("Error fetching updated shops:", error);
          });

        setEditMode(null); // Exit edit mode
      })
      .catch((error) => console.error("Error updating shop:", error));
  };

  
const handleDelete = async (shopId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this shop?"
  );

  if (!confirmDelete) return;

  try {
    await axios.delete(`${API_BASE_URL}/api/shop/${shopId}`);

    console.log("Shop deleted successfully!");

    const response = await axios.get(`${API_BASE_URL}/api/shop`);

    if (Array.isArray(response.data)) {
      setShops(response.data);
    } else {
      setShops([]);
    }
  } catch (error) {
    console.error(
      "Error deleting shop:",
      error.response?.status,
      error.response?.data || error.message
    );
  }
};


  return (
    <div className="container  mt-4">
      <h3 className="text-center">Manage Shops</h3>
      <div className="table-responsive shop_con">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Shop Image</th>
              <th>Shop Name</th>
              <th>Items Available</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Rating</th>
              <th>Address</th>
              <th>Contact</th>
              <th>Opening Time</th>
              <th>Actions</th> {/* Only Actions column here */}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="text-center">Loading...</td> {/* Adjusted to 10 columns */}
              </tr>
            ) : shops.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center">No Shops Available</td> {/* Adjusted to 10 columns */}
              </tr>
            ) : (
              shops.map((shop) => (
                <tr key={shop._id}>
                  <td>
                    <img
                      src={`${API_BASE_URL}/api/shop_image/${shop.shop_image?.split("/").pop()}`}
                      alt={shop.shop_name}
                      style={{ width: "100px", height: "100px", objectFit: "cover", cursor: "pointer" }}
                      onClick={() =>
                        handleImageClick(`${API_BASE_URL}/api/shop_image/${shop.shop_image?.split("/").pop()}`)
                      }
                    />
                  </td>
                  <td>
                    {editMode === shop._id ? (
                      <input
                        type="text"
                        name="shop_name"
                        value={editedShop.shop_name || ""}
                        onChange={handleChange}
                      />
                    ) : (
                      shop.shop_name
                    )}
                  </td>
                  <td>
                    {editMode === shop._id ? (
                      <input
                        type="text"
                        name="items_available"
                        value={Array.isArray(editedShop.items_available) ? editedShop.items_available.join(", ") : ""}
                        onChange={(e) =>
                          setEditedShop({ ...editedShop, items_available: e.target.value.split(", ") })
                        }
                      />
                    ) : (
                      Array.isArray(shop.items_available) ? shop.items_available.join(", ") : shop.items_available || "N/A"
                    )}
                  </td>
                  <td>{editMode === shop._id ? <input type="number" name="latitude" value={editedShop.latitude || ""} onChange={handleChange} /> : shop.latitude}</td>
                  <td>{editMode === shop._id ? <input type="number" name="longitude" value={editedShop.longitude || ""} onChange={handleChange} /> : shop.longitude}</td>
                  <td>{editMode === shop._id ? <input type="number" name="rating" min="1" max="5" value={editedShop.rating || ""} onChange={handleChange} /> : "⭐".repeat(shop.rating)}</td>
                  <td>{editMode === shop._id ? <input type="text" name="address" value={editedShop.address || ""} onChange={handleChange} /> : shop.address}</td>
                  <td>{editMode === shop._id ? <input type="text" name="contact_number" value={editedShop.contact_number || ""} onChange={handleChange} /> : shop.contact_number}</td>
                  <td>{editMode === shop._id ? <input type="text" name="opening_time" value={editedShop.opening_time || ""} onChange={handleChange} /> : shop.opening_time}</td>
                  <td>
                    {editMode === shop._id ? (
                      <button className="btn btn-success btn-sm" onClick={applyChanges}>Apply Changes</button>
                    ) : (
                      <button className="btn btn-warning btn-sm me-1" onClick={() => handleEdit(shop)}>Edit</button>
                    )}
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(shop._id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Image Modal */}
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered>
        <Modal.Body className="d-flex justify-content-center align-items-center">
          <img
            src={selectedImage}
            alt="Shop Preview"
            style={{
              width: "100%",
              height: "100%",
              maxWidth: "95vw",
              maxHeight: "90vh",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
        </Modal.Body>
      </Modal>
      <div>
            <Button variant="primary" onClick={openAddShopModal} className="mb-3">
                Add Shop
            </Button>

            <Modal show={show} onHide={closeAddShopModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Shop</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={submitShopDetails} >
                        <Form.Group>
                            <Form.Label>Shop Name</Form.Label>
                            <Form.Control className="admin_add_shop" type="text" name="name" value={shopData.name} onChange={handleAddChange} required />
                        </Form.Group>
                        
                        <Form.Group>
                            <Form.Label>Items Available (comma separated)</Form.Label>
                            <Form.Control className="admin_add_shop" type="text" name="items_available" value={shopData.items_available} onChange={handleAddChange} required />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Latitude</Form.Label>
                            <Form.Control type="text" className="admin_add_shop" name="latitude" value={shopData.latitude} onChange={handleAddChange} required />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Longitude</Form.Label>
                            <Form.Control type="text" className="admin_add_shop" name="longitude" value={shopData.longitude} onChange={handleAddChange} required />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Rating (1-5)</Form.Label>
                            <Form.Control type="number" className="admin_add_shop" name="rating" value={shopData.rating} onChange={handleAddChange} min="1" max="5" required />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Address</Form.Label>
                            <Form.Control type="text" className="admin_add_shop" name="address" value={shopData.address} onChange={handleAddChange} required />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Contact Number</Form.Label>
                            <Form.Control type="text" className="admin_add_shop" name="contact" value={shopData.contact} onChange={handleAddChange} required />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Opening Time</Form.Label>
                            <Form.Control type="time" className="admin_add_shop" name="opening_time" value={shopData.opening_time} onChange={handleAddChange} required />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Closing Time</Form.Label>
                            <Form.Control type="time" className="admin_add_shop" name="closing_time" value={shopData.closing_time} onChange={handleAddChange} required />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Shop Image</Form.Label>
                            <Form.Control type="file" name="image" onChange={handleFileChange} required />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="mt-3">
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>




    </div>

    
  );
};

export default AdminShops;
