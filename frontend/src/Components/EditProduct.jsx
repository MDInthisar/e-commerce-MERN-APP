import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./EditProduct.css";
import Loader from './Loader'

const EditProduct = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const { id } = location.state;
  const [product, setProduct] = useState(null);  // Correct initial state

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [stock, setStock] = useState("");
  const [productPhoto, setProductPhoto] = useState(null); // Handle file input

  const [loading, setloading] = useState(false)

  const notifyError = (e) => toast.error(e);
  const notifySuccess = (e) => toast.success(e);

  const navigate = useNavigate();

  // Fetch product details
  useEffect(() => {
    const singleProduct = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URL}/user/product/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          const productData = response.data;
          setProduct(productData); 

          // Initialize form fields with product data
          setProductName(productData.productName);
          setProductDescription(productData.productDescription);
          setProductPrice(productData.productPrice);
          setStock(productData.stock);
        } else {
          notifyError("Failed to fetch product details");
        }
      } catch (error) {
        notifyError(error.message);
      }
    };
    singleProduct();
  }, [id, token]);  // Include id and token in dependency array

  // Handle form submission
  const handleEdit = async (e) => {
    e.preventDefault();
    setloading(true)
  
    const formdata = new FormData();
    formdata.append('productName', productName)
    formdata.append('productDescription', productDescription);
    formdata.append('productPrice', productPrice)
    formdata.append('stock', stock)
  
    // Only append productPhoto if a new file has been uploaded
    if (productPhoto) {
      formdata.append('productPhoto', productPhoto);
    }
  
    try {
      const response = await axios.put(`${import.meta.env.VITE_APP_BACKEND_URL}/user/editproduct/${id}`, formdata, {
        headers:{
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        }, withCredentials: true
      });
  
      if (response.status === 200) {
        notifySuccess("Product updated successfully");
        navigate("/");  // Navigate to a different page after successful update
      }
    } catch (error) {
      notifyError(error.response?.data?.message || "Something went wrong");
    }
  };

  const openImage = useRef(null);
  const handleImage = ()=>{
    openImage.current.click()

  }
  

  // Ensure product data is available before rendering
  if (!product) {
    return <p>Loading product...</p>;
  }

  return (
    <>
    {
      loading?(
        <Loader/>
      ):(
        <div className="edit-product">
        <div className="display">
          <div className="product">
            <div className="img">
              <img
                src={
                  productPhoto
                    ? URL.createObjectURL(productPhoto)
                    : product.productPhoto // Use optional chaining to prevent errors
                }
                alt="Product"
                onClick={()=> handleImage()}
                style={{cursor:'pointer'}}
              />
            </div>
            <h2 className="productName">
              {productName || product.productName} {/* Show form value or product data */}
            </h2>
            <h4 className="productDescription">
              {productDescription || product.productDescription}
            </h4>
            <h2 className="productPrice">
              ₹ {productPrice || product.productPrice}
            </h2>
            <h2 className="stock">
              stock : {stock || product.stock}
            </h2>
          </div>
  
          {/* Form to edit product */}
          <form className="product-form" onSubmit={handleEdit}>
            <h1 className="form-title">Edit Product</h1>
            <input
              className="input-field"
              type="text"
              value={productName} // Pre-fill with current product name
              onChange={(e) => setProductName(e.target.value)}
            />
            <textarea
              className="input-area"
              value={productDescription} // Pre-fill with current description
              onChange={(e) => setProductDescription(e.target.value)}
            />
            <input
              className="input-field"
              type="number"
              value={productPrice} // Pre-fill with current price
              onChange={(e) => setProductPrice(e.target.value)}
            />
            <input
              className="input-field"
              type="number"
              value={stock} // Pre-fill with current stock
              onChange={(e) => setStock(e.target.value)}
            />
            <input
              ref={openImage}
              className="input-file"
              type="file"
              accept="image/*"  // Accept only image files
              onChange={(e) => setProductPhoto(e.target.files[0])}
              style={{display:'none'}}
            />
            <button className="submit-btn">Edit Product</button>
          </form>
        </div>
      </div>
      )
    }
    </>

  );
};

export default EditProduct;
