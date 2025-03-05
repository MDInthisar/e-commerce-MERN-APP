import axios from "axios";
import "./Home.css";
import Loader from './Loader';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Carousul from "./Carosul"; // Corrected import

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading
  const navigate = useNavigate();

  useEffect(() => {
    const allProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URL}/user/allproduct`
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); 
      }
    };

    allProducts();
  }, []);

  return (
    <>
      <div className="home">
        {loading ? (
          // Show loader when loading is true
          <Loader />
        ) : products.length <= 0 ? (
          <h1>No products available</h1>
        ) : (
          <div className="products-container">
            <Carousul />
            <div className="cardds">
              {products
                .slice()
                .reverse()
                .map((product) => (
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
          </div>
        )}
      </div>
    </>
  );
};

export default Home;