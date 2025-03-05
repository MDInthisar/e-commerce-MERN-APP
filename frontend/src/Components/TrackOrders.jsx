import React, { useEffect, useState } from "react";
import "./TrackOrders.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const TrackOrders = () => {
  const [orderss, setorderss] = useState([]);
  const token = localStorage.getItem("token");

  const notifyError = (e) => toast.error(e);
  const notifySuccess = (e) => toast.success(e);
  const navigate = useNavigate();

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

  const handleCancel = async (item) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_APP_BACKEND_URL}/user/usercancelproduct`,
        { orderId: item._id, item: item },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        const updatedOrder = orderss.map((order) => {
          if (order._id === item._id) {
            return { ...response.data.order };
          } else {
            return order;
          }
        });
        setorderss(updatedOrder);
        notifySuccess(response.data.message);
      } else {
        notifyError(response.data.error);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="track-orders-container">
      {orderss.length > 0 ? (
        orderss
          .slice()
          .reverse()
          .map((item, index) => (
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
                <strong>Order At:</strong>
                {new Date(item.createdAt).toUTCString()}
              </p>
              {item.orderStatus === "canceled" ? (
                <>
                  <p>
                    <strong style={{ color: "red" }}>Order Status: </strong>
                    <span style={{ color: "red" }}>{item.orderStatus}</span>
                  </p>
                  <p>
                    <strong style={{ color: "red" }}>Cancel At : </strong>
                    {new Date(item.canceledAt).toUTCString()}
                  </p>
                </>
              ) : (
                <p>
                  <strong style={{ color: "#4a9dff" }}>Order Status: </strong>
                  <span style={{ color: "#4a9dff" }}>{item.orderStatus}</span>
                </p>
              )}
              {item.message ? (
                <p>
                  <strong style={{color:'red'}}>Message : </strong>
                  <span>{item.message}</span>
                </p>
              ) : null}

              <h4>Products</h4>
              {item.orderStatus === "canceled" ? null : (
                <button
                  style={{ background: "crimson", width: "100%" }}
                  onClick={() => handleCancel(item)}
                >
                  cancal
                </button>
              )}
              {item.orderedProduct.map((product, prodIndex) => (
                <>
                  <div key={prodIndex} className="order-product">
                    <img
                      src={product.product.productPhoto}
                      alt={product.product.name}
                      className="order-product-image"
                    />
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
                </>
              ))}
            </div>
          ))
      ) : (
        <h1>No orders</h1>
      )}
    </div>
  );
};

export default TrackOrders;
