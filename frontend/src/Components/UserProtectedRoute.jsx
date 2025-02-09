import { jwtDecode } from 'jwt-decode';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const notifyError = (e) => toast.error(e);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return navigate('/login'); 
    }

    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken.role === 'user') {
        return; 
      } else {
        notifyError('Only user access');
        navigate('/'); 
      }
    } catch (error) {
      notifyError(error.message);
      navigate('/login'); // Redirect to login if error occurs during decoding
    }

  }); 

  return children   
};

export default UserProtectedRoute;
