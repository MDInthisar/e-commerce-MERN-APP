import React, {useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

import "./SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {
  const [name, setname] = useState("");
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [spass, setspass] = useState(false);
  const [role, setrole] = useState("");

  const notifyError = (e) => toast.error(e);
  const notifySuccess = (e) => toast.success(e);

  const navigate = useNavigate()

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !username ||
      !email ||
      !password ||
      !confirmPassword ||
      !role
    ) {
      return notifyError("All feilds requied");
    }

    if (password !== confirmPassword) {
      return notifyError("Password not matched");
    }

    if (!emailRegex.test(email)) return notifyError("Email not valid");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/auth/register`,
        { name, username, email, password, role },
        { withCredentials: true }
      );

      if(response.data.message){
        notifySuccess(response.data.message)
        navigate('/login');
      }else{
        notifyError(response.data.error)
      }
    } catch (error) {
      notifyError(error.message)
    }
  };

  return (
    <div className="s-container">
          <div className="signup-container">
      <h2>Sign Up</h2>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setname(e.target.value)}
          />
        </div>
  
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setusername(e.target.value)}
          />
        </div>
  
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
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
          />
          {spass?(
            <FaEyeSlash onClick={()=> setspass(false)} />
          ):(
            <FaEye onClick={()=> setspass(true)} />
          )}
        </div>
  
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setconfirmPassword(e.target.value)}
          />
        </div>
  
        <div className="role-container">
          <label>Role:</label>
          <div className="roles">
            <div className="role-item">
              <input
                type="radio"
                id="user"
                name="role"
                value="user"
                onClick={(e) => setrole(e.target.value)}
              />
              <label htmlFor="user">User</label>
            </div>
            <div className="role-item">
              <input
                type="radio"
                id="admin"
                name="role"
                value="admin"
                onClick={(e) => setrole(e.target.value)}
              />
              <label htmlFor="admin">Admin</label>
            </div>
          </div>
        </div>
  
        <button type="submit">Sign Up</button>
  
        <Link to="/forgotpassword">
          <span>Forgot password?</span>
        </Link>
      </form>
    </div>
    </div>
  );
  
};

export default Signup;
