import axios from "axios";
import "./Home.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [products, setproducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const allproducts = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/user/allproduct`
      );
      setproducts(response.data);
    };

    allproducts();
  }, []);

  return (
    <>
      {products.length <= 0 ? (
        <h1>No products available</h1>
      ) : (
        <div className="products-container">
          {products.map((product) => (
            <div
              className="card"
              key={product._id}
              onClick={() => navigate(`/product-details/${product._id}`)}
            >
              <div className="home-img">
                <img
                  src={product.productPhoto} // Replace with your image property
                  alt={product.productName}
                  className="card-img"
                />
              </div>
              <div className="card-details">
                <h3 className="card-name">{product.productName}</h3>
                <p className="card-price">${product.productPrice}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Home;
