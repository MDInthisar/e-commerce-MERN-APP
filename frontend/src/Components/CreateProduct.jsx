import React, { useEffect, useRef, useState } from "react";
import Loader from './Loader'
import "./CreateProduct.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateProduct = () => {
  const token = localStorage.getItem("token");

  const [productName, setproductName] = useState("");
  const [productDescription, setproductDescription] = useState("");
  const [productPrice, setproductPrice] = useState();
  const [stock, setstock] = useState();
  const [productPhoto, setproductPhoto] = useState();

  const [loading, setloading] = useState(false)

  const notifyError = (e) => toast.error(e);
  const notifySuccess = (e) => toast.success(e);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true)

    if (
      productName &&
      productDescription &&
      productPrice &&
      productPhoto &&
      stock
    ) {
      const formdata = new FormData();
      formdata.append("productName", productName);
      formdata.append("productDescription", productDescription);
      formdata.append("productPhoto", productPhoto);
      formdata.append("productPrice", productPrice);
      formdata.append("stock", stock);

      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/user/createproduct`,
        formdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      notifySuccess(response.data.message);
      navigate("/");
    } else {
      notifyError("All feild requied");
    }
  };

  const openproductImage = useRef(null);

  const handleOpenproduct =  ()=>{
    openproductImage.current.click();
  }

  return (
    <>
    {loading?(
      <Loader/>
    ):(
      <div className="create-product">
      <div className="display">
        <div className="product">
          <div className="img">
            <img onClick={()=>handleOpenproduct()} style={{cursor:'pointer'}}
              src={
                productPhoto
                  ? URL.createObjectURL(productPhoto)
                  : "https://jaimaaroadlines.websites.co.in/dummytemplate/img/product-placeholder.png"
              }
              alt=""
            />
          </div>
          <h2 className="productName">
            {productName ? productName : "productName"}
          </h2>
          <h4 className="productDescription">
            {productDescription ? productDescription : "productDescription"}
          </h4>
          <h2 className="productPrice">
            ₹ {productPrice ? productPrice : "Amount"}
          </h2>
          <h2 className="stock">Total stock {stock ? stock : 0}</h2>
        </div>
        <form className="product-form" onSubmit={handleSubmit}>
          <h1 className="form-title">Create Product</h1>
          <input
            className="input-field"
            type="text"
            placeholder="productName"
            value={productName}
            onChange={(e) => setproductName(e.target.value)}
          />
          <textarea
            className="input-area"
            placeholder="description"
            value={productDescription}
            onChange={(e) => setproductDescription(e.target.value)}
          />
          <input
            className="input-field"
            type="text"
            placeholder="productPrice"
            value={productPrice}
            onChange={(e) => setproductPrice(e.target.value)}
          />
          <input
            className="input-field"
            type="number"
            placeholder="stock"
            value={stock}
            onChange={(e) => setstock(e.target.value)}
          />
          <input
            className="input-file"
            type="file"
            onChange={(e) => setproductPhoto(e.target.files[0])}
            style={{display:'none'}}
            ref={openproductImage}
          />
          <button className="submit-btn">Create Product</button>
        </form>
      </div>
    </div>
    )}

    </>
  );
};

export default CreateProduct;
