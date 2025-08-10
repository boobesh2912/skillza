import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from './AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  // If there is a user, render the child component (e.g., DashboardPage)
  // Otherwise, redirect to the login page ("/")
  return user ? children : <Navigate to="/" />;
};

export default PrivateRoute;