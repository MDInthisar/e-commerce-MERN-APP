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
import NotFound from "./Components/NotFound.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

const App = () => {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [logoutmodel, setlogoutmodel] = useState(false);

  return (
    <>
      <BrowserRouter>
        <GoogleOAuthProvider
          clientId={import.meta.env.VITE_APP_GOOGLE_CLIENT_ID}
        >
          <isLoggedInContext.Provider
            value={{ isLoggedIn, setisLoggedIn, setlogoutmodel, logoutmodel }}
          >
            <ToastContainer
              position="top-center" // Set the position to the top of the screen
              autoClose={5000} // Close the toast after 5 seconds (optional)
              hideProgressBar={false} // Show the progress bar (optional)
              newestOnTop={true} // Show newest toast on top (optional)
              closeOnClick // Close the toast when clicked
              rtl={false} // Set Right to Left direction (optional)
              pauseOnFocusLoss={true} // Disable pausing on focus loss (optional)
              pauseOnHover={true} // Pause the timer on hover
              theme="dark" // Apply dark theme
            />

            <Navbar isLoggedIn={isLoggedIn} />
            <Routes>
              <Route path="*" element={<NotFound />} />
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
              <Route
                path="/track-order"
                element={
                  <UserProtectedRoute>
                    <TrackOrders />
                  </UserProtectedRoute>
                }
              />

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
              <Route
                path="/admin-orders"
                element={
                  <ProtectedRoute>
                    <AdminOrders />
                  </ProtectedRoute>
                }
              />
            </Routes>
            {logoutmodel && <Logout />}
          </isLoggedInContext.Provider>
        </GoogleOAuthProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
