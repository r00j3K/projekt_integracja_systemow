import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export const ProtectedRoute = ({ elementIfAuthenticated, elementIfUnauthenticated }) => {
    const jwt = Cookies.get("jwt");
    return jwt ? elementIfAuthenticated : elementIfUnauthenticated;
};
