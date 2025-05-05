import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Extract hash parameters for OTP verification
        const hashParams = new URLSearchParams(location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');
        
        // If we have tokens in the URL hash, set the session
        if (accessToken && refreshToken && type === 'recovery') {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          
          if (error) {
            setError(error.message);
            toast({
              title: 'Authentication Error',
              description: error.message,
              variant: 'destructive',
            });
            return;
          }
          
          if (data?.session) {
            toast({
              title: 'Success',
              description: 'You have been successfully authenticated',
            });
            navigate('/home');
            return;
          }
        }
        
        // Otherwise, check for active session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setError(error.message);
          toast({
            title: 'Authentication Error',
            description: error.message,
            variant: 'destructive',
          });
          return;
        }
        
        if (data?.session) {
          toast({
            title: 'Success',
            description: 'You have been successfully authenticated',
          });
          navigate('/home');
        } else {
          // If no session, might be an issue with the callback
          setError('Authentication failed. Please try again.');
          navigate('/login');
        }
      } catch (err: any) {
        setError(err.message || 'Authentication failed');
        toast({
          title: 'Error',
          description: err.message || 'Authentication failed',
          variant: 'destructive',
        });
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate, location, toast]);

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6 bg-white">
      {loading ? (
        <div className="text-center">
          <div className="w-16 h-16 mb-4 rounded-full border-t-4 border-b-4 border-primary animate-spin mx-auto"></div>
          <h2 className="text-xl font-semibold mb-2">Authenticating...</h2>
          <p className="text-muted-foreground">Please wait while we complete your authentication</p>
        </div>
      ) : error ? (
        <div className="text-center">
          <div className="w-16 h-16 mb-4 flex items-center justify-center mx-auto">
            <span className="text-destructive text-4xl">❌</span>
          </div>
          <h2 className="text-xl font-semibold mb-2">Authentication Failed</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={() => navigate('/login')}
            className="text-primary hover:underline"
          >
            Return to Login
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default AuthCallback;
