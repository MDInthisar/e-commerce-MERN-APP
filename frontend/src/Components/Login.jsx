import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import {isLoggedInContext} from '../contexts/isLoggedInContext'
import {GoogleLogin} from '@react-oauth/google'
import {jwtDecode} from "jwt-decode";

import "./Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {

  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [spass, setspass] = useState(false)

  const {setisLoggedIn} = useContext(isLoggedInContext)

  const notifyError = (e) => toast.error(e);
  const notifySuccess = (e) => toast.success(e);

  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (!username || !password) return notifyError('All feilds requied');

    try{
      const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/auth/login`, {username, password}, {withCredentials:true});
      if(response.data.message){
        localStorage.setItem('token', response.data.token);
        notifySuccess(response.data.message);
        setisLoggedIn(true)
        navigate('/')
      }
      else{
        notifyError(response.data.error)
        navigate('/signup')
      }
    }catch(error){
      notifyError(error.message)
    }
  };

  const handleGoogleLogin = async (credencialResponse)=>{
    const decode = jwtDecode(credencialResponse.credential);
    const { email, email_verified, name, picture} = decode;
    const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/auth/googlelogin`,{
      email,
      email_verified,
      name,
      picture,
      clientID: credencialResponse.clientId,
    });
    setisLoggedIn(true)
    localStorage.setItem('token', response.data.token);
    notifySuccess(response.data.message);
    navigate('/')
  }

  return (
    <div className="l-container">
          <div className="login-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setusername(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            type={spass? 'text': 'password'}
            id="password"
            name="password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
          />{
            spass?(
              <FaEyeSlash onClick={()=>setspass(false)} />
            ):(
              <FaEye onClick={()=>setspass(true)}/>
            )
          }
          
        </div>

        <button type="submit">Login</button>
        <GoogleLogin onSuccess={(credencialResponse)=>{
          handleGoogleLogin(credencialResponse)
        }} />
      </form>
      <Link to='/forgotpassword'><span>forgot password</span></Link>
    </div>
    </div>
  );
};

export default Login;