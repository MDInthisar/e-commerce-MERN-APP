import React, { useRef, useState } from 'react';
import './EditProfile.css';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from './Loader';

const EditProfile = () => {
    const token = localStorage.getItem('token');
    const location = useLocation();
    const { state: userData } = location;  
    const navigate = useNavigate();

    const editprofilepic = useRef(null);

    const openprofilepic = ()=>{
      editprofilepic.current.click()
    }

    

    const notifyError = (e) => toast.error(e);
    const notifySuccess = (e) => toast.success(e);

    const [profilePic, setprofilePic] = useState(userData.profilePic || null)
    const [name, setname] = useState(userData.name || '')
    const [username, setusername] = useState(userData.username || 'N/A')
    const [streetName, setstreetName] = useState(userData.address?.streetName || 'N/A')
    const [doorNo, setdoorNo] = useState(userData.address?.doorNo || 'N/A')
    const [pincode, setpincode] = useState(userData.address?.pincode || 'N/A');
    const [phonoNo, setphonoNo] = useState(userData.address?.phonoNo || 'N/A');

    const [loading, setloading] = useState(false)

    const handleSubmit = async (e)=>{
        e.preventDefault()
        setloading(true)

        try {
          const formdata = new FormData();
        formdata.append('profilepic', profilePic)
        formdata.append('name', name)
        formdata.append('username', username)
        formdata.append('streetName', streetName)
        formdata.append('doorNo', doorNo)
        formdata.append('pincode', pincode);
        formdata.append('phonoNo', phonoNo);

        const response = await axios.put(`${import.meta.env.VITE_APP_BACKEND_URL}/user/profileupdate`, formdata, {
            headers:{
                "Content-Type":'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        })
        if(response.status === 200){
            notifySuccess(response.data.message)
            navigate('/profile')
        }else{
            notifyError(response.data.error)
        }
        } catch (error) {
          notifyError(error.message)
        } finally{
          setloading(false)
        }
    }
    

  return (
    <>
    {
      loading?(
        <Loader/>
      ):(
        <div className="edit-profile-container">
        <h2>Edit Your Profile</h2>
        <form onSubmit={null} className="edit-profile-form">
          <div className="form-section">
            {/* Profile Image Section */}
            <div className="profile-image-section">
              <label htmlFor="profileImage">Profile Image</label>
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                accept="image/*"
                style={{display:'none'}}
                ref={editprofilepic}
                onChange={(e)=>setprofilePic(e.target.files[0])}
              />
              {profilePic ? (
                <img
                  src={userData.profilePic || URL.createObjectURL(profilePic)}
                  alt="Profile Preview"
                  className="profile-image-preview"
                  onClick={()=>openprofilepic()}
                  style={{cursor:'pointer'}}
                />
              ):<img
              src={userData.profilePic || "https://imgs.search.brave.com/sHfS5WDNtJlI9C_CT2YL2723HttEALNRtpekulPAD9Q/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA2LzMzLzU0Lzc4/LzM2MF9GXzYzMzU0/Nzg0Ml9BdWdZemV4/VHBNSjl6MVljcFRL/VUJvcUJGMENVQ2sx/MC5qcGc"}
              alt="Profile Preview"
              className="profile-image-preview"
              onClick={()=>openprofilepic()}
              style={{cursor:'pointer'}}
  
            /> }
            </div>
          </div>
  
          {/* Form Fields */}
          <div className="form-fields-section">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e)=> setusername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>
  
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e)=>setname(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
  
            <div className="form-group">
              <label htmlFor="streetName">PhonoNo</label>
              <input
                type="text"
                id="phonoNo"
                name="phonoNo"
                value={phonoNo}
                onChange={(e)=>setphonoNo(e.target.value)}
                placeholder="Enter your street name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="streetName">Street Name</label>
              <input
                type="text"
                id="streetName"
                name="streetName"
                value={streetName}
                onChange={(e)=>setstreetName(e.target.value)}
                placeholder="Enter your street name"
              />
            </div>
  
            <div className="form-group">
              <label htmlFor="doorNo">Door No</label>
              <input
                type="text"
                id="doorNo"
                name="doorNo"
                value={doorNo}
                onChange={(e)=>setdoorNo(e.target.value)}
                placeholder="Enter your door number"
              />
            </div>
  
            <div className="form-group">
              <label htmlFor="pincode">Pincode</label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={pincode}
                onChange={(e)=>setpincode(e.target.value)}
                placeholder="Enter your pincode"
              />
            </div>
  
            <button type="submit" className="submit-btn" onClick={handleSubmit}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
      )
    }
    </>

  );
};

export default EditProfile;
