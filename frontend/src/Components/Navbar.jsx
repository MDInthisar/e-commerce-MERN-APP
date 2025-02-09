import React, { useContext } from "react";
import { jwtDecode } from "jwt-decode";
import "./Navbar.css"; // Import the CSS file
import { Link, Links } from "react-router-dom";
import { isLoggedInContext } from "../contexts/isLoggedInContext";

const Navbar = ({ isLoggedIn }) => {
  const { setlogoutmodel } = useContext(isLoggedInContext);

  const shownav = () => {
    const token = localStorage.getItem("token");

    if (!token || typeof token !== "string") {
      return (
        <nav>
          <Link to="/">
            <div className="logo">
              <img
                src="https://marketplace.canva.com/EAGQ1aYlOWs/1/0/1600w/canva-blue-colorful-illustrative-e-commerce-online-shop-logo-bHiX_0QpJxE.jpg"
                alt="Logo"
              />
            </div>
          </Link>
          <div className="btn">
            <Link to="/signup">
              <button className="signup">signup</button>
            </Link>
            <Link to="/login">
              <button className="login">login</button>
            </Link>
          </div>
        </nav>
      );
    }

    try {
      if (isLoggedIn || token) {
        const decodedToken = jwtDecode(token);

        if (decodedToken.role === "admin") {
          return (
            <nav>
              <Link to="/">
                <div className="logo">
                  <img
                    src="https://marketplace.canva.com/EAGQ1aYlOWs/1/0/1600w/canva-blue-colorful-illustrative-e-commerce-online-shop-logo-bHiX_0QpJxE.jpg"
                    alt="Logo"
                  />
                </div>
              </Link>
              <div className="btn">
                <Link to="/profile">
                  <button className="profile">profile</button>
                </Link>
                <Link to="/createproduct">
                  <button className="createproduct">Create Product</button>
                </Link>
                <Link to="/adminproducts">
                  <button className="adminproducts">Admin Products</button>
                </Link>
                <Link to='/admin-orders'>
                <button className="ordersproducts">Orders Product</button>
                </Link>
                <button className="logout" onClick={() => setlogoutmodel(true)}>
                  Logout
                </button>
              </div>
            </nav>
          );
        } else if (decodedToken.role === "user") {
          return (
            <nav>
              <Link to="/">
                <div className="logo">
                  <img
                    src="https://marketplace.canva.com/EAGQ1aYlOWs/1/0/1600w/canva-blue-colorful-illustrative-e-commerce-online-shop-logo-bHiX_0QpJxE.jpg"
                    alt="Logo"
                  />
                </div>
              </Link>
              <div className="btn">
                <Link to="/profile">
                  <button className="profile">profile</button>
                </Link>
                <Link to='/cart'>
                <button className="cart">cart</button> 
                </Link>
                <Link to='/track-order'><button className="orders">orders</button></Link>
                <button className="logout" onClick={() => setlogoutmodel(true)}>
                  Logout
                </button>
              </div>
            </nav>
          );
        }
      }
    } catch (error) {
      return (
        <nav>
          <Link to="/">
            <div className="logo">
              <img
                src="https://marketplace.canva.com/EAGQ1aYlOWs/1/0/1600w/canva-blue-colorful-illustrative-e-commerce-online-shop-logo-bHiX_0QpJxE.jpg"
                alt="Logo"
              />
            </div>
          </Link>
          <div className="btn">
            <Link to="/signup">
              <button className="signup">signup</button>
            </Link>
            <Link to="/login">
              <button className="login">login</button>
            </Link>
          </div>
        </nav>
      );
    }
  };

  return <>{shownav()}</>;
};

export default Navbar;
