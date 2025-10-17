import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !user) {
    // Redirect to login but save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!requireAuth && user) {
    // If user is logged in but accessing public route like login/register
    // Redirect to dashboard or the original location they were trying to access
    const redirectTo = location?.state?.from?.pathname || '/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;