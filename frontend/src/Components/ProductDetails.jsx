import axios from 'axios';
import React, { useEffect, useState } from 'react'
import './ProductDetails.css'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProductDetails = () => {
    const token = localStorage.getItem('token')
    const {id} = useParams();
    const [productdetail, setproductdetail] = useState()
    const [cartcount, setcartcount] = useState(0)

    const notifyError = (e) => toast.error(e);
    const notifySuccess = (e) => toast.success(e);
  
    const navigate = useNavigate();

    useEffect(() => {

        const viewProduct = async ()=>{
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/user/product/${id}`, {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });            
            setproductdetail(response.data);
            
        }
        viewProduct()
    }, [])

    if(!productdetail){
        return <h1>no product</h1>
    }
    
    const handleToCart = async (productID, quantity)=>{
       if(cartcount === 0) return notifyError('Please select quantity')

        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/user/addtocart`, {productID, quantity}, {
                headers:{
                    Authorization : `Bearer ${token}`
                }
            });
    
            if(response.status === 200){
                 notifySuccess(response.data.message)
                 navigate('/')
                 return
            }else{
                return notifyError(response.data.error);
            }
        } catch (error) {
            notifyError(error.message);
            return;
        }
    }
    
  return (
    <>
    <div className="productdetails">
        <div className="splits">
            <div className="img">``
                <img src={productdetail.productPhoto} alt="" />
            </div>
        </div>
        <div className="details">
            <div className="name"><p>{productdetail.productName}</p></div>
            <div className="description"><p>{productdetail.productDescription
            }</p></div>
            <div className="pstock">
            <div className="price"><p>Total : {productdetail.productPrice}</p></div>
            <div className="stock"><p>Stocks : {productdetail.stock}</p></div>
            </div>
            <div className="btns">
                <button onClick={()=>handleToCart(productdetail._id, cartcount)}>Add to Cart</button>
                <button>Buy now</button>
                <button onClick={()=> setcartcount(cartcount+1)}>{cartcount}</button>
            </div>
        </div>
    </div>
    </>
  )
}

export default ProductDetails