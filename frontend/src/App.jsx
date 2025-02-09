import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { isLoggedInContext } from "./contexts/isLoggedInContext";

import Home from "./Components/Home";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import Navbar from "./Components/Navbar";
import Logout from "./Components/Logout";
import ForgotPassword from "./Components/ForgotPassword";
import ResetPassword from "./Components/ResetPassword";
import CreateProduct from "./Components/CreateProduct";
// import AuthRoute from "./Components/authRoute";
import ProtectedRoute from "./Components/ProtectedRoute";
import Adminproducts from "./Components/AdminProducts";
import EditProduct from "./Components/EditProduct";
import Profile from "./Components/Profile";
import EditProfile from "./Components/EditProfile";
import ProductDetails from "./Components/ProductDetails";
import Cart from "./Components/Cart";
import UserProtectedRoute from "./Components/UserProtectedRoute";
import TrackOrders from "./Components/TrackOrders";
import AdminOrders from "./Components/AdminOrders";

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
