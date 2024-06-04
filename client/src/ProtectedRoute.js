// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import Cookies from 'js-cookie';
//
// export const ProtectedRoute = ({ elementIfAuthenticated, elementIfUnauthenticated }) => {
//     const jwt = Cookies.get("jwt");
//     return jwt ? elementIfAuthenticated : elementIfUnauthenticated;
// };

import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

export const ProtectedRoute = ({ elementIfAuthenticated, elementIfUnauthenticated }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const jwt = Cookies.get("jwt");

    useEffect(() => {
        const validateToken = async () => {
            try {
                const response = await axios.post('http://localhost:8080/api/users/validation', {}, {
                    withCredentials: true // Umożliwia wysyłanie cookies w zapytaniach
                });
                if (response.status === 200) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                setIsAuthenticated(false);
            }
        };

        if (jwt) {
            validateToken();
        } else {
            setIsAuthenticated(false);
        }
    }, [jwt]);

    if (isAuthenticated === null) {
        return <div>Loading...</div>; // Możesz dodać loader podczas sprawdzania walidacji
    }

    return isAuthenticated ? elementIfAuthenticated : elementIfUnauthenticated
};
