import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// This component protects certain routes from unauthenticated access
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="loading-spinner">Loading...</div>; 
  }

  if (!user) {
    return <Navigate to="/login" replace />; // Here redirect to login if not authenticated
  }

  return children;
};

export default ProtectedRoute;
