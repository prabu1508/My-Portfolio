import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAuthToken } from '../../services/authService';

const PrivateRoute = ({ children }) => {
  const token = getAuthToken();
  
  return token ? children : <Navigate to="/admin/login" />;
};

export default PrivateRoute;

