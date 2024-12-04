import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';  

const ProtectedRoute = ({ element: Component }) => {
  const { token } = useContext(AuthContext);  

  return token ? <Component /> : <Navigate to="/" />;
};

export default ProtectedRoute;
