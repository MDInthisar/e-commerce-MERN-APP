import React, { useContext } from "react";
import { isLoggedInContext } from "../contexts/isLoggedInContext";

import './Logout.css'
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { setlogoutmodel } = useContext(isLoggedInContext);
  const navigate = useNavigate()
  return (
    <>
      <div className="logoutContainer" onClick={()=> setlogoutmodel(false)}>
        <div className="logoutcard">
          <h1>Confirm Logout</h1>
          <p>Are you sure you want to log out?</p>
          <div className="btn">
            <button onClick={()=>{
                localStorage.clear();
                setlogoutmodel(false);
                navigate('/login')
            }}>Logout</button>
            <button onClick={()=>{setlogoutmodel(false)}}>cancel</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Logout;
