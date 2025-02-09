import React, { useState } from "react";
import "./ForgotPassword.css"; // Import the CSS file for styling
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setemail] = useState("");

  const notifyError = (e) => toast.error(e);
  const notifySuccess = (e) => toast.success(e);

  const navigate = useNavigate();

  const handleSubmit = async () => {
   
    try {

        if(!email) return notifyError("email requied")
        const response = await axios.post(
            `${import.meta.env.VITE_APP_BACKEND_URL}/auth/forgotpassword`,
            { email },
            { withCredentials: true }
          );
          if(response.data.message){
            notifySuccess(response.data.message);
            navigate('/resetpassword')
          }else{
            notifyError(response.data.error)
          }

    } catch (error) {
        notifyError(error.message)
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2>Forgot Password</h2>
        <p>Please enter your email to reset your password.</p>
        <input
          type="email"
          placeholder="Enter your email"
          className="email-input"
          value={email}
          onChange={(e) => setemail(e.target.value)}
        />
        <button className="reset-button" onClick={() => handleSubmit()}>
          Genrate OTP
        </button>
      <Link to='/login'><span>Login</span></Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
