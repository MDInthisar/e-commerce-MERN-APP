import React, { useEffect, useState } from "react";
import "./Profile.css";
import Loader from "./Loader";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [userData, setuserData] = useState(null);
  const notifyError = (e) => toast.error(e);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  useEffect(() => {
    const userdata = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URL}/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          setuserData(response.data);
        } else {
          notifyError(response.data.error);
          return;
        }
      } catch (error) {
        notifyError(error.message);
      } finally{
        setloading(false)
      }
    };
    if (token) {
      userdata();
    }
  }, [token]);
  

  if (!userData) {
    return <Loader/>;
  }

  const handleEdit = () => {
    navigate("/editprofile", { state: userData });
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <img
            src={
              userData.profilePic
                ? userData.profilePic
                : "https://imgs.search.brave.com/sHfS5WDNtJlI9C_CT2YL2723HttEALNRtpekulPAD9Q/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA2LzMzLzU0Lzc4/LzM2MF9GXzYzMzU0/Nzg0Ml9BdWdZemV4/VHBNSjl6MVljcFRL/VUJvcUJGMENVQ2sx/MC5qcGc"
            }
            alt="Profile"
            className="profile-photo"
          />
          <div className="profile-info">
            <h1 className="profile-name">{userData.name}</h1>
            <p className="profile-username">@{userData.username}</p>
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-item">
            <label>Email:</label>
            <p>{userData.email}</p>
          </div>
          <div className="detail-item">
            <label>Phone No:</label>
            <p>{userData.address?.phonoNo || "N/A"}</p>
          </div>
          <div className="detail-item">
            <label>Door No:</label>
            <p>{userData.address?.doorNo || "N/A"}</p>
          </div>
          <div className="detail-item">
            <label>Street Name:</label>
            <p>{userData.address?.streetName || "N/A"}</p>
          </div>
          <div className="detail-item">
            <label>Pincode:</label>
            <p>{userData.address?.pincode || "N/A"}</p>
          </div>
        </div>

        <button className="edit-btn" onClick={handleEdit}>
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
