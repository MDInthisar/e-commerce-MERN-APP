import React, { useEffect, useState } from 'react';
import { data, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios, { all } from 'axios';
import {FaEdit, FaTrash} from 'react-icons/fa'
import Loader from './Loader';

import './AdminProducts.css'

const Adminproducts = () => {
  const [allproducts, setallproducts] = useState([]);
  const [loading, setloading] = useState(true)
  const token = localStorage.getItem('token');

  const notifyError = (e) => toast.error(e);
  const notifySuccess = (e) => toast.success(e);

  const navigate = useNavigate();

  useEffect(() => {
    const adminproducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URL}/user/adminproducts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setallproducts(response.data);
        }
      } catch (error) {
        notifyError(error.message);
      }finally{
        setloading(false)
      }
    };
    adminproducts();
  }, []);

  const handleEdit = (id)=>{
    navigate('/editproduct', {state: {id}})
  }

  const handleDelete = async (id)=>{
    const response = await axios.delete(`${import.meta.env.VITE_APP_BACKEND_URL}/user/deleteproduct/${id}`,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if(response.status === 200){
        notifySuccess(response.data.message)
        const nproduct = allproducts.filter((data)=> data._id !== id);
        setallproducts(nproduct)
    }else{
        notifyError(response.data.error)
    }

  }

return (
  <>
  {
    loading?<Loader/>:(
      <div className="admin-products-container">
      <h2>Admin Products</h2>
      <div className="products-grid">
        {allproducts.length > 0 ? (
          allproducts.map((product) => (
            <div className="product-card" key={product._id}>
              <div className="product-image">
                <img
                  src={product.productPhoto}
                  alt={product.productName}
                />
              </div>
              <div className="product-details">
                <div className="product-actions">
                  <FaEdit onClick={() => handleEdit(product._id)} />
                  <FaTrash onClick={() => handleDelete(product._id)} />
                </div>
                <h3>{product.productName}</h3>
                <p className="description">{product.productDescription}</p>
                <p>
                  Price: <span>₹{product.productPrice}</span>
                </p>
                <p>
                  Stock: <span>{product.stock}</span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-products">No products found</p>
        )}
      </div>
    </div>
    )
  }
  </>

);

};

export default Adminproducts;
