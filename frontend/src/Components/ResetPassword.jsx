import React, { useState } from "react";
import "./ResetPassword.css"; // Import the CSS file for styling
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [otp, setotp] = useState("");
  const [newpassword, setnewpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");

  const notifyError = (e) => toast.error(e);
  const notifySuccess = (e) => toast.success(e);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/auth/resetpassword`,
        { otp, newpassword },
        { withCredentials: true }
      );

      if(response.data.message){
        notifySuccess(response.data.message);
        navigate('/login')
      }else{
        notifyError(response.data.error);
        navigate('/forgotpassword')
      }
    } catch (error) {
        notifyError(error.message)
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <h2>Reset Your Password</h2>
        <p>
          Please enter the OTP sent to your email, and then set your new
          password.
        </p>

        <div className="otp-container">
          <label htmlFor="otp">OTP</label>
          <input
            type="text"
            id="otp"
            placeholder="Enter OTP"
            className="input-field"
            value={otp}
            onChange={(e) => setotp(e.target.value)}
          />
        </div>

        <div className="password-container">
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter new password"
            className="input-field"
            value={newpassword}
            onChange={(e) => setnewpassword(e.target.value)}
          />
        </div>

        <div className="password-container">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            placeholder="Confirm your new password"
            className="input-field"
            value={confirmPassword}
            onChange={(e) => setconfirmPassword(e.target.value)}
          />
        </div>

        <button className="reset-button" onClick={() => handleSubmit()}>
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
