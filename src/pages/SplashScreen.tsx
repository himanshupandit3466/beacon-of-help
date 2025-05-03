
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

const SplashScreen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has accepted terms before
    const hasAcceptedTerms = localStorage.getItem('helpin_terms_accepted');
    
    // After 2 seconds, navigate to terms or home
    const timer = setTimeout(() => {
      if (hasAcceptedTerms === 'true') {
        // Check if user is logged in
        const isLoggedIn = localStorage.getItem('helpin_user');
        if (isLoggedIn) {
          navigate('/home');
        } else {
          navigate('/login');
        }
      } else {
        navigate('/terms');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="w-32 h-32 mb-8 rounded-full bg-primary flex items-center justify-center animate-pulse-glow">
        <span className="text-4xl font-bold text-white">H</span>
      </div>
      <h1 className="text-4xl font-bold mb-2">Helpin</h1>
      <p className="text-md text-muted-foreground">Emergency Peer-to-Peer Help</p>
    </div>
  );
};

export default SplashScreen;
