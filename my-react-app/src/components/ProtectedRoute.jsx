import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const validateAuth = async () => {
      try {
        // Check if user is authenticated
        if (!authService.isAuthenticated()) {
          setIsValid(false);
          setLoading(false);
          return;
        }

        // Validate token with backend
        const validation = await authService.validateToken();
        
        if (validation.valid) {
          // Check role if required
          if (requiredRole) {
            const userRole = authService.getUserRole();
            if (userRole !== requiredRole) {
              setIsValid(false);
              setLoading(false);
              return;
            }
          }
          
          setIsValid(true);
          
          // Setup token refresh if not already done
          authService.setupTokenRefresh();
        } else {
          // Token is invalid, clear auth data
          authService.clearAuth();
          setIsValid(false);
        }
      } catch (error) {
        console.error('Auth validation error:', error);
        // On error, try to refresh token
        try {
          await authService.refreshToken();
          setIsValid(true);
          authService.setupTokenRefresh();
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          authService.clearAuth();
          setIsValid(false);
        }
      } finally {
        setLoading(false);
      }
    };

    validateAuth();
  }, [requiredRole, location.pathname]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isValid) {
    // If user was authenticated but doesn't have required role, show unauthorized
    if (authService.isAuthenticated() && requiredRole) {
      return (
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
          <div className="text-center">
            <h2>Access Denied</h2>
            <p>You don't have permission to access this page.</p>
            <button 
              className="btn btn-primary" 
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }
    
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
