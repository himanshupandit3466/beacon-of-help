import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RouteGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export const RouteGuard = ({ children, requireAuth = true }: RouteGuardProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // Redirect to login if authentication is required but user is not logged in
        navigate('/login');
      } else if (!requireAuth && user) {
        // Redirect to home if user is already logged in and tries to access login/signup pages
        navigate('/home');
      }
    }
  }, [user, loading, navigate, requireAuth]);

  // Show nothing while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If requireAuth is true and user is not logged in, or if requireAuth is false and user is logged in
  // The useEffect will handle redirect, so we don't need to render anything here
  
  // Otherwise, render children
  return <>{children}</>;
};
