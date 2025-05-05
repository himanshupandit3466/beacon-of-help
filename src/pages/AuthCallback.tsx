
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const AuthCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Extract URL parameters and hash fragments
        const searchParams = new URLSearchParams(location.search);
        let hashParams: URLSearchParams | null = null;
        
        // Check if we have a hash fragment and parse it
        if (location.hash && location.hash.length > 1) {
          hashParams = new URLSearchParams(location.hash.substring(1));
        }
        
        // Handle error in URL parameters (from # or ?)
        const errorType = searchParams.get('error') || (hashParams && hashParams.get('error'));
        const errorDescription = searchParams.get('error_description') || (hashParams && hashParams.get('error_description'));
        
        if (errorType) {
          let errorMessage = errorDescription || 'Authentication failed';
          
          if (errorType === 'access_denied' && errorDescription?.includes('expired')) {
            errorMessage = 'The magic link has expired. Please request a new one.';
          }
          
          setError(errorMessage);
          toast({
            title: 'Authentication Error',
            description: errorMessage,
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }
        
        // Handle hash parameters for token exchange
        if (hashParams) {
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          const type = hashParams.get('type');
          
          // If we have tokens in the URL hash, set the session
          if (accessToken && refreshToken) {
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            
            if (error) throw error;
            
            if (data?.session) {
              toast({
                title: 'Success',
                description: 'You have been successfully authenticated',
              });
              navigate('/home');
              return;
            }
          }
        }
        
        // Fallback: Check for an active session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
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
          <Button 
            onClick={() => navigate('/login')}
            className="text-primary"
          >
            Return to Login
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default AuthCallback;
