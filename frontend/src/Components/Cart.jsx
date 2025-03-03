import React, { useEffect, useState } from "react";
import "./Cart.css";
import Loader from './Loader'
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const token = localStorage.getItem("token");
  const [carts, setcarts] = useState([]);
  const [total, settotal] = useState(0);
  const [openBuy, setopenBuy] = useState(false);

  const [loading, setloading] = useState(false)

  const notifyError = (e) => toast.error(e);
  const notifySuccess = (e) => toast.success(e);

  const navigate = useNavigate();

  useEffect(() => {
    const allcarts = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/user/allcarts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setcarts(response.data.carts);
      settotal(response.data.total);
    };
    allcarts();
  }, []);

  const handleDeleteCart = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_APP_BACKEND_URL}/user/removecart/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        notifySuccess(response.data.message);
        const updatedcarts = carts.filter((cart) => cart.product._id !== id);
        setcarts(updatedcarts);
        const updatedTotal = updatedcarts.reduce((total, curr) => {
          return total + curr.product.productPrice * curr.quantity;          
        }, 0);
        settotal(updatedTotal);
      } else {
        notifyError(response.data.error);
      }
    } catch (error) {
      notifyError(error.message);
    }
  };

  const handleBuy = async () => {
    try {
      setloading(true)
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/user/orderproduct`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        notifySuccess(response.data.message);
        navigate("/");
      } else {
        notifyError(response.data.error);
      }
    } catch (error) {
      notifyError(error.message);
    } finally{
      setloading(false)
    }
  };

  const handleUPIPayment = async () => {
    try {
      // Step 1: Get order ID and Razorpay key from backend
      const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/user/upiproduct`,{total},{
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
      if(response.status === 200){
        
        const { order, key } = response.data;
  
        // Step 2: Open Razorpay payment box
        const options = {
          key: key, // Use the key fetched from the backend
          amount: order.amount,
          currency: order.currency,
          order_id: order.id,
          name: "E-commerce Inthisar",
          handler: function (paymentResponse) {
            fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/user/verifyupi`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
               },
              body: JSON.stringify(paymentResponse),
            })
            .then(response => response.json())
            .then(data => {
              console.log(data);
              
              if (data.message) {
                notifySuccess(data.message);
                navigate('/')
              } else {
                notifyError('Payment Verification k Failed');
              }
            })
            .catch(error => {
             notifyError('Error verifying payment');
            });
          }
          
          
        };
        if (window.Razorpay) {
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          notifyError("Payment failed.m Please try again.");
        }
      }else{
        notifyError(response.data.message)
      }
    } catch (error) {
      notifyError("Payment failed.o Please try again.");
    }
  };
  

  return (
    <>
    {
      loading?(
        <Loader/>
      ):(
        <div className="allcarts">
        <h3>Cart</h3>
        <div className="carts">
          {carts.length > 0 ? (
            carts.slice().reverse().map((data, i) => (
              <div className="cart" key={i}>
                <div className="proimg">
                  <img
                    src={data.product.productPhoto}
                    alt={data.product.productName}
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigate(`/product-details/${data.product._id}`)
                    }
                  />
                </div>
                <div className="proname">
                  <p>{data.product.productName}</p>
                </div>
                <div className="proqunatity">
                  <p>Quantity : {data.quantity}</p>
                </div>
                <div className="proprice">
                  <p>Price : ₹ {data.product.productPrice}</p>
                </div>
                <div className="date">
                  <p>Date : {new Date(data.createdAt).toLocaleDateString()}</p>
                </div>
                <button onClick={() => handleDeleteCart(data.product._id)}>
                  <FaTrash />
                </button>
              </div>
            ))
          ) : (
            <h1>no cart</h1>
          )}
        </div>
        <div className="total">
          <div className="amount">
            <p>Amount</p>
            <p>₹ {total}</p>
            <div className="buttons">
            <button style={{marginRight: '1vw'}} onClick={()=> handleUPIPayment()}>UPI</button>
            <button onClick={() => setopenBuy(true)}>Buy</button>
            </div>
          </div>
        </div>
        {openBuy && (
          <div className="openbuy" onClick={() => setopenBuy(false)}>
            <div className="buymodel">
              <h1>COD avalable</h1>
              <div className="btns">
                <button onClick={() => handleBuy()}>Buy</button>
                <button onClick={() => setopenBuy(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
      )
    }

    </>
  );
};

export default Cart;
