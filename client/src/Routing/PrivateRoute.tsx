import React from "react";
import { Navigate } from "react-router-dom";

// Check authentication, e.g., by checking for a token in localStorage
const isAuthenticated = () => {
  return Boolean(localStorage.getItem("token")); // Replace 'token' with your storage key
};

// PrivateRoute component that wraps around protected routes
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return isAuthenticated() ? (
    <>{children} {/* Render the child component if authenticated */}</>
  ) : (
    <Navigate to="/login" /> // Redirect to login if not authenticated
  );
};

export default PrivateRoute;
