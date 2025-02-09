import React, { useEffect, useState } from "react";
import "./TrackOrders.css";
import axios from "axios";

const TrackOrders = () => {
  const [orderss, setorderss] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const orders = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/user/trackorder`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setorderss(response.data);
    };
    orders();
  }, []);  

  return (
    <div className="track-orders-container">
      { orderss.length>0?
      orderss.map((item, index) => (
        <div key={index} className="order-card">
          <h3>Address Details</h3>
          <p>
            <strong>Door No:</strong> {item.shippingAddress.doorNo}
          </p>
          <p>
            <strong>Street Name:</strong> {item.shippingAddress.streetName}
          </p>
          <p>
            <strong>Pincode:</strong> {item.shippingAddress.pincode}
          </p>
          <p>
            <strong>PhonoNo:</strong> {item.shippingAddress.phonoNo}
          </p>
          <p>
            <strong>Order At:</strong> {new Date(item.createdAt).toLocaleDateString()}
          </p>

          <h4>Products</h4>
          {item.orderedProduct.map((product, prodIndex) => (
            <div key={prodIndex} className="order-product">
              <img src={product.product.productPhoto} alt={product.product.name} className="order-product-image" />
              <div className="order-product-details">
                <h5>{product.product.productName}</h5>
                <p>{product.product.productDescription}</p>
                <p>
                  <strong>Price:</strong> {product.product.productPrice}
                </p>
                <p>
                  <strong>Quantity:</strong> {product.quantity}
                </p>
                <p>
                  <strong>Total amount:</strong> {item.totalAmount}
                </p>
              </div>
            </div>
          ))}
        </div>
      )):<h1>No orders</h1>}
    </div>
  );
};

export default TrackOrders;
