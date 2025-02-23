import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
    const navigate = useNavigate();

    const goHome = () => {
        navigate('/');
    };

    return (
        <div className="notfound-container">
            <h1>404</h1>
            <p>Oops! The page you're looking for doesn't exist.</p>
            <button onClick={goHome} className="home-button">
                Go to Home
            </button>
        </div>
    );
};

export default NotFound;
