import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import Home from "./pages/Home";
import Cart from "./Pages/Cart";

import Login from "./Pages/login";
import Signup from "./Pages/Signup";
import Recommend from "./Pages/Recommend";
import Payment from "./Pages/Payment";
import Cookies from "js-cookie";
import Footer from "./Components/Footer";
import Maps from "./Components/Maps";
import ResetPassword from "./Pages/ResetPassword";
import ForgotPassword from "./Pages/ForgotPassword";
import AdminDashboard from "./Pages/AdminDashboard"
import Transition from "./Pages/Transition"
const isAdmin = true; // Placeholder for authentication logic

const ProtectedRoute = ({ element }) => {
  return isAdmin ? element : <Navigate to="/login" />;
};

const handleProductAction = (action, product) => {
  let cart = JSON.parse(Cookies.get("cart") || "[]");
  if (action === "add") {
    cart.push(product);
  }
  Cookies.set("cart", JSON.stringify(cart));
  console.log("Updated Cart:", cart);
};

const AppLayout = () => {
  const location = useLocation();
  const hideElements = location.pathname === "/login"; // Hide navbar, sidebar, footer on login page

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {!hideElements && <Navbar isSidebarOpen={isSidebarOpen} />}
      <div className="app-container">
        {!hideElements && <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />}
        <div className={`content ${isSidebarOpen ? "content-shifted" : ""}`}>
          <Routes>
            <Route path="/" element={<Home handleProductAction={handleProductAction} />} />
            <Route path="/cart" element={<Cart />} />
          
          
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/recommend" element={<Recommend handleProductAction={handleProductAction} />} />
            <Route path="/Payment" element={<Payment />} />
            <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} />} />
            <Route path="/map" element={<Maps />} />
            <Route path="/Sidebar" element={<Sidebar />} />

            <Route path="ForgotPassword" element={<ForgotPassword></ForgotPassword>}/>
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/Transition" element={<Transition />} />

          </Routes>
        </div>
      </div>
      {!hideElements && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

export default App;
