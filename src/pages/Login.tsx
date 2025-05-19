
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthCard from '@/components/auth/AuthCard';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Get the intended destination from location state, or default to "/"
  const from = location.state?.from?.pathname || '/';
  
  useEffect(() => {
    // If user is already authenticated, redirect to the intended destination
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleAuthSuccess = () => {
    // Navigate to the intended destination
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-crm-background-from to-crm-background-to">
      <AuthCard onSignInSuccess={handleAuthSuccess} />
    </div>
  );
};

export default Login;
