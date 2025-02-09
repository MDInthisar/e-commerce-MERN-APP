import {jwtDecode} from 'jwt-decode';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children }) => {
    const notifyError = (e) => toast.error(e);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const decodedToken = jwtDecode(token);
            if (decodedToken.role !== 'admin') {
                notifyError('Not authorized');
                navigate('/');
                return;
            }
        } catch (error) {
            notifyError('Invalid token');
            navigate('/login');
        }
    });

    return children;
};

export default ProtectedRoute;