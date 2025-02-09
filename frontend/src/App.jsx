import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { isLoggedInContext } from "./contexts/isLoggedInContext";

import Home from "./Components/Home.jsx";
import Signup from "./Components/SignUp.jsx";
import Login from "./Components/Login.jsx";
import Navbar from "./Components/Navbar.jsx";
import Logout from "./Components/Logout.jsx";
import ForgotPassword from "./Components/ForgotPassword.jsx";
import ResetPassword from "./Components/ResetPassword.jsx";
import CreateProduct from "./Components/CreateProduct.jsx";
// import AuthRoute from "./Components/authRoute";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import Adminproducts from "./Components/AdminProducts.jsx";
import EditProduct from "./Components/EditProduct.jsx";
import Profile from "./Components/Profile.jsx";
import EditProfile from "./Components/EditProfile.jsx";
import ProductDetails from "./Components/ProductDetails.jsx";
import Cart from "./Components/Cart.jsx";
import UserProtectedRoute from "./Components/UserProtectedRoute.jsx";
import TrackOrders from "./Components/TrackOrders.jsx";
import AdminOrders from "./Components/AdminOrders.jsx";

const App = () => {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [logoutmodel, setlogoutmodel] = useState(false);

  return (
    <>
      <BrowserRouter>
        <isLoggedInContext.Provider
          value={{ isLoggedIn, setisLoggedIn, setlogoutmodel, logoutmodel }}
        >
          <ToastContainer theme="dark" />
          <Navbar isLoggedIn={isLoggedIn} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/product-details/:id"
              element={
                <UserProtectedRoute>
                  <ProductDetails />
                </UserProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <UserProtectedRoute>
                  <Cart />
                </UserProtectedRoute>
              }
            />
            <Route path="/track-order" element={
              <UserProtectedRoute>
                <TrackOrders/>
              </UserProtectedRoute>}  />

            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/resetpassword" element={<ResetPassword />} />

            <Route path="/profile" element={<Profile />} />
            <Route path="/editprofile" element={<EditProfile />} />

            {/* admin routes */}
            <Route
              path="/createproduct"
              element={
                <ProtectedRoute>
                  <CreateProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/adminproducts"
              element={
                <ProtectedRoute>
                  <Adminproducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editproduct"
              element={
                <ProtectedRoute>
                  <EditProduct />
                </ProtectedRoute>
              }
            />
            <Route path="/admin-orders" element={
              <ProtectedRoute>
                <AdminOrders/>
              </ProtectedRoute>
            }  />
          </Routes>
          {logoutmodel && <Logout />}
        </isLoggedInContext.Provider>
      </BrowserRouter>
    </>
  );
};

export default App;
