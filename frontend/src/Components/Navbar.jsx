import React, { useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import { isLoggedInContext } from "../contexts/isLoggedInContext";
import "./Navbar.css";

const Navbar = ({ isLoggedIn }) => {
  const { setlogoutmodel } = useContext(isLoggedInContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = localStorage.getItem("token");

  const generateButtons = () => {
    if (!token) {
      return (
        <>
          <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
            <button className="nav-btn">Sign Up</button>
          </Link>
          <Link to="/login" onClick={() => setIsMenuOpen(false)}>
            <button className="nav-btn">Login</button>
          </Link>
        </>
      );
    }

    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken.role === "admin") {
        return (
          <>
            <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
              <button className="nav-btn">Profile</button>
            </Link>
            <Link to="/createproduct" onClick={() => setIsMenuOpen(false)}>
              <button className="nav-btn">Create Product</button>
            </Link>
            <Link to="/adminproducts" onClick={() => setIsMenuOpen(false)}>
              <button className="nav-btn">Admin Products</button>
            </Link>
            <Link to="/admin-orders" onClick={() => setIsMenuOpen(false)}>
              <button className="nav-btn">Orders</button>
            </Link>
            <button 
              className="nav-btn logout" 
              onClick={() => {
                setlogoutmodel(true);
                setIsMenuOpen(false);
              }}
            >
              Logout
            </button>
          </>
        );
      }
      return (
        <>
          <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
            <button className="nav-btn">Profile</button>
          </Link>
          <Link to="/cart" onClick={() => setIsMenuOpen(false)}>
            <button className="nav-btn">Cart</button>
          </Link>
          <Link to="/track-order" onClick={() => setIsMenuOpen(false)}>
            <button className="nav-btn">Orders</button>
          </Link>
          <button 
            className="nav-btn logout" 
            onClick={() => {
              setlogoutmodel(true);
              setIsMenuOpen(false);
            }}
          >
            Logout
          </button>
        </>
      );
    } catch (error) {
      return (
        <>
          <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
            <button className="nav-btn">Sign Up</button>
          </Link>
          <Link to="/login" onClick={() => setIsMenuOpen(false)}>
            <button className="nav-btn">Login</button>
          </Link>
        </>
      );
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <img
          src="https://marketplace.canva.com/EAGQ1aYlOWs/1/0/1600w/canva-blue-colorful-illustrative-e-commerce-online-shop-logo-bHiX_0QpJxE.jpg"
          alt="Logo"
        />
      </Link>
      
      <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
        {generateButtons()}
      </div>

      <div 
        className="hamburger" 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle navigation"
      >
        ☰
      </div>
    </nav>
  );
};

export default Navbar;