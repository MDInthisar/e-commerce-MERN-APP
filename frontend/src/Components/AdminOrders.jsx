import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./AdminOrders.css";

const AdminOrders = () => {
  const [adminOrders, setadminOrders] = useState([]);
  const [message, setmessage] = useState("");
  const notifyError = (e) => toast.error(e);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    try {
      const adminorders = async () => {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URL}/user/bookedproduct`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200 || response.data.message) {
          setadminOrders(response.data);
          setmessage(response.data.message);
        } else {
          notifyError(response.data.error);
        }
      };
      adminorders();
    } catch (error) {
      notifyError(error.message);
    }
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
      if(response.status === 200){
        const updatedOrder = adminOrders.map((order)=>{
          if(order._id === item._id){
            return {...response.data.order}
          }else{
            return order;
          }
        });
        setadminOrders(updatedOrder)
       notifySuccess(response.data.message)
      }else{
        notifyError(response.data.error)
      }
    } catch (error) {
      notifyError(error.message)
    }
  };


  return (
    <>
      <div className="admin-orders-container">
        {adminOrders.length > 0 ? (
          adminOrders
            .slice()
            .reverse()
            .map((item, index) => (
              <div key={index} className="order-card">
                <h3>Address Details</h3>
                <p>
                  <strong>Customer Name:</strong> {item.orderedUser.name}
                </p>
                <p>
                  <strong>Door No:</strong> {item.shippingAddress.doorNo}
                </p>
                <p>
                  <strong>Street Name:</strong>
                  {item.shippingAddress.streetName}
                </p>
                <p>
                  <strong>Pincode:</strong> {item.shippingAddress.pincode}
                </p>
                <p>
                  <strong>PhonoNo:</strong> {item.shippingAddress.phonoNo}
                </p>
                <p>
                  <strong>Order At:</strong>
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
                {item.orderStatus === "canceled" ? (
                  <>
                    <p>
                      <strong style={{color:'red'}}>Order Status: </strong> 
                      <span style={{color:'red'}}>{item.orderStatus}</span>
                    </p>
                    <p>
                      <strong style={{color:'red'}}>canceled At:</strong>
                      {new Date(item.canceledAt).toUTCString()}
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <strong style={{color: '#4a9dff'}}>Order Status:</strong> {item.orderStatus}
                    </p>
                  </>
                )}
                {item.message ? (
                <p>
                  <strong style={{color:'red'}}>Message : </strong>
                  <span>{item.message}</span>
                </p>
              ) : null}

                <h4>Products</h4>
                {
              item.orderStatus === 'canceled'?null:(
                <button
                style={{ background: "crimson", width: "100%" }}
                onClick={() => handleCancel(item)}
              >
                Admin cancel
              </button>
              )
             }
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
          <h1>{message}</h1>
        )}
      </div>
    </>
  );
};

export default AdminOrders;
