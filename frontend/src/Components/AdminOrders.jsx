import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './AdminOrders.css'

const AdminOrders = () => {
    const [adminOrders, setadminOrders] = useState([]);
    const [message, setmessage] = useState('');
    const notifyError = (e) => toast.error(e);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const adminorders = async ()=>{
                const token = localStorage.getItem('token')
                const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/user/bookedproduct`, {
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                });
                if(response.status === 200 || response.data.message){
                    setadminOrders(response.data)
                    setmessage(response.data.message)
                }else{
                    notifyError(response.data.error)
                }
            }
            adminorders()
        } catch (error) {
            notifyError(error.message)
        }
    }, [])    
    return (
        <div className="admin-orders-container">
          { adminOrders.length>0?
          adminOrders.map((item, index) => (
            <div key={index} className="order-card">
              <h3>Address Details</h3>
              <p>
                <strong>Customer Name:</strong> {item.orderedUser.name}
              </p>
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
          )):<h1>{message}</h1>}
        </div>
      );
}

export default AdminOrders