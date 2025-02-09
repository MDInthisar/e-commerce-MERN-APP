import { jwtDecode } from 'jwt-decode';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    try {
      // Decode the token and check its validity
      const decodedToken = jwtDecode(token);
      const valid = decodedToken.role === 'user' || decodedToken.role === 'admin';

      if (valid) {
        navigate('/');
      } else {
        return children;
      }
    } catch (error) {
      // Handle any errors from jwtDecode (e.g., invalid token format)
      console.error('Invalid token:', error);
      navigate('/login');
    }
  }, [navigate, children]);

  // If there is no valid token, render the children
  return children;
};

export default AuthRoute;
