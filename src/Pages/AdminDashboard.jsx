import React, { useState, useEffect, useCallback } from "react";
import { Container, Table, Button, Form, Modal, InputGroup, Alert, Row, Col, Spinner } from "react-bootstrap";
import axios from "axios";
import AdminUsers from "./AdminUsers";
import "./AdminDashboard.css";
import AdminShops from "../Components/AdminShops"

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [changes, setChanges] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false); // Used for controlling the modal state
  const [newProduct, setNewProduct] = useState({ filename: "", price: "", imageFile: null });
  const [editableRows, setEditableRows] = useState({});
  const [alertMessage, setAlertMessage] = useState("");
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pendingDeletes, setPendingDeletes] = useState([]); // Store IDs of products to delete
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
const API_BASE_URL = "https://main-backend-9afm.onrender.com";


  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Fetching products...");
      const response = await axios.get(`${API_BASE_URL}/get_all_products`);
      console.log("API Response:", response);

      if (response.data && Array.isArray(response.data)) {
        console.log("Fetched products:", response.data);
        setProducts(response.data);
        setVisibleProducts(response.data.slice(0, 20)); 
      } else {
        console.warn("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const enableEditing = (index) => {
    setEditableRows((prev) => ({ ...prev, [index]: true }));
  };
  
  const handleEditChange = (index, key, value) => {
    setProducts((prev) =>
      prev.map((product, i) => (i === index ? { ...product, [key]: value } : product))
    );
  
    setChanges((prev) => ({
      ...prev,
      [index]: { ...products[index], id: products[index]._id, [key]: value },
    }));
  };

  const handleSave = async (index) => {
    if (!changes[index]) return;
  
    try {
      await axios.put(`${API_BASE_URL}/update_product`, changes[index], {
        headers: { "Content-Type": "application/json" },
      });
  
      setEditableRows((prev) => ({ ...prev, [index]: false }));
      setChanges((prev) => {
        const newChanges = { ...prev };
        delete newChanges[index];
        return newChanges;
      });
  
      fetchProducts(); // Refresh data
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };
  
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };
  

  const applyChanges = async () => {
    if (!Object.keys(changes).length && !pendingDeletes.length) {
      setAlertMessage("No changes to apply!");
      return;
    }
  
    try {
      console.log("Applying changes...", changes, pendingDeletes);
  
      // Update existing products
      await Promise.all(
        Object.values(changes).map((product) =>
          axios.put(`${API_BASE_URL}/update_product`, product, {
            headers: { "Content-Type": "application/json" },
          })
        )
      );
  
      // Delete pending products
      await Promise.all(
        pendingDeletes.map((productId) =>
          axios.delete(`${API_BASE_URL}/delete_product/${productId}`)
        )
      );
  
      setChanges({});
      setPendingDeletes([]); // Clear pending deletes after applying
      setAlertMessage("Changes applied successfully!");
      fetchProducts(); // Refresh product list
    } catch (error) {
      console.error("Error applying changes:", error);
      setAlertMessage("Failed to apply changes.");
    }
  };
  
  

  const handleDelete = (index, productId) => {
    setPendingDeletes((prev) => [...prev, productId]); // Mark product for deletion
    setProducts((prev) => prev.filter((_, i) => i !== index)); // Remove from UI
  };

  const handleAddProduct = async () => {
    if (!newProduct.imageFile || !newProduct.filename || !newProduct.price) {
      alert("Please fill all fields");
      return;
    }
  
    const formData = new FormData();
    formData.append("name", newProduct.filename); // Ensure name is used as filename
    formData.append("price", newProduct.price);
    formData.append("image", newProduct.imageFile);
  
    try {
      const response = await fetch(`${API_BASE_URL}/add_product`, {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setShowAddModal(false);
        setNewProduct({ filename: "", price: "", imageFile: null }); // Reset input fields
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product");
    }
};


  const filteredProducts = products
    .filter((product) => product.filename.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.filename.localeCompare(b.filename));

  const loadMoreProducts = () => {
    if (visibleProducts.length < filteredProducts.length) {
      setPage(page + 1);
      setVisibleProducts(filteredProducts.slice(0, page * 20));
    }
  };

  return (
    <>
    <Container className="mt-4">
      <h2 className="text-center">Admin Dashboard</h2>
      {alertMessage && (
        <Alert variant="success" onClose={() => setAlertMessage("")} dismissible>
          {alertMessage}
        </Alert>
      )}

      <Row className="mb-3 align-items-center">
        <Col xs={4}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search by Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control-sm adminw"
            />
            <Button variant="outline-secondary" onClick={() => setSearchQuery(searchQuery)} className="btn-sm">
              Search
            </Button>
          </InputGroup>
        </Col>
        <Col xs={4}>
        <Button
  variant="success"
  onClick={applyChanges}
  disabled={Object.keys(changes).length === 0 && pendingDeletes.length === 0} // Enable if changes or deletions exist
  className="w-100 btn-sm"
>
  Apply Changes
</Button>

        </Col>
        <Col xs={4}>
          <Button
            variant="primary"
            onClick={() => setShowAddModal(true)}  // Open the modal
            className="w-100 btn-sm"
          >
            Add Product
          </Button>
        </Col>
      </Row>

      {/* Modal for Adding Product */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFile">
              <Form.Label>Product Image</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setNewProduct({ ...newProduct, imageFile: e.target.files[0] })}
              />
            </Form.Group>
            <Form.Group controlId="formFilename">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                className="admin_add_width"
                value={newProduct.filename}
                onChange={(e) => setNewProduct({ ...newProduct, filename: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
              className="admin_add_width"
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddProduct}>
            Save Product
          </Button>
        </Modal.Footer>
      </Modal>

      <div style={{ height: "400px", overflowY: "auto" }} onScroll={loadMoreProducts}>
        <Table bordered hover responsive className="mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Name</th>
              <th>Price ($)</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center">
                  <Spinner animation="border" role="status" />
                </td>
              </tr>
            ) : (
              filteredProducts.slice(0, page * 20).map((product, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                  <img
  src={`${API_BASE_URL}/get_image/${encodeURIComponent(product.filename)}`}
  width="50"
  height="50"
  alt="Product"
  style={{ cursor: "pointer" }}
  onClick={() => handleImageClick(`${API_BASE_URL}/get_image/${encodeURIComponent(product.filename)}`)}
/>

                   
                  </td>
                  <td>
                    <Form.Control className="adminn"
                      type="text"
                      value={product.filename}
                      disabled={!editableRows[index]}
                      onChange={(e) => handleEditChange(index, "filename", e.target.value)}
                    />
                  </td>
                  <td>
                    <Form.Control className="adminp"
                      type="number"
                      value={product.price}
                      disabled={!editableRows[index]}
                      onChange={(e) => handleEditChange(index, "price", e.target.value)}
                    />
                  </td>
                  <td>
  {editableRows[index] ? (
    <Button variant="success" onClick={() => handleSave(index)} className="btn-sm">
      Save
    </Button>
  ) : (
    <Button variant="warning" onClick={() => enableEditing(index)} className="btn-sm">
      Edit
    </Button>
  )}
</td>

                  <td>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(index, product._id)}
                      className="btn-sm"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Product Image</Modal.Title>
  </Modal.Header>
  <Modal.Body className="text-center">
    <img src={selectedImage} alt="Enlarged Product" style={{ width: "100%", height: "auto" }} />
  </Modal.Body>
</Modal>

    </Container>
    <AdminUsers></AdminUsers>
    <AdminShops></AdminShops>
    </>
  );
};

export default AdminDashboard;