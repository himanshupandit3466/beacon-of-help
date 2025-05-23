
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { RouteGuard } from '@/components/RouteGuard';
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signInWithEmailOTP, signInWithGoogle } = useAuth();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@') || !email.includes('.')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Send magic link to email
      await signInWithEmailOTP(email);
      
      setEmailSent(true);
      toast({
        title: "Email Sent",
        description: "We've sent a magic link to your email. Please check your inbox and spam folders.",
      });
    } catch (error) {
      // Error is handled in the signInWithEmailOTP function
      setEmailSent(false);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      // Error is handled in the signInWithGoogle function
    }
  };

  const resetForm = () => {
    setEmailSent(false);
    setEmail('');
  };

  return (
    <RouteGuard requireAuth={false}>
      <div className="flex flex-col h-screen p-6 bg-white">
        <div className="flex items-center justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
            <span className="text-2xl font-bold text-white">H</span>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome Back</h1>
        
        {emailSent ? (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Check Your Email</h2>
            <p className="text-muted-foreground mb-4">
              We've sent a magic link to <strong>{email}</strong>. 
              Click the link in the email to sign in.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              The link will expire in 10 minutes for security reasons.
            </p>
            <Button onClick={resetForm} variant="outline" className="w-full">
              Use a Different Email
            </Button>
          </div>
        ) : (
          <>
            <form onSubmit={handleEmailLogin} className="space-y-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input 
                    id="email"
                    type="email" 
                    placeholder="Enter your email address" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="pl-10"
                    autoComplete="email"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  We'll send you a magic link to sign in
                </p>
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Continue with Email'}
              </Button>
            </form>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleGoogleLogin} 
              className="w-full mb-6"
              disabled={loading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path 
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" 
                  fill="#4285F4" 
                />
                <path 
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" 
                  fill="#34A853" 
                />
                <path 
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" 
                  fill="#FBBC05" 
                />
                <path 
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" 
                  fill="#EA4335" 
                />
              </svg>
              Continue with Google
            </Button>
            
            <p className="text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <button 
                onClick={() => navigate('/signup')}
                className="text-secondary hover:underline font-medium"
                disabled={loading}
                type="button"
              >
                Create Account
              </button>
            </p>
          </>
        )}
      </div>
    </RouteGuard>
  );
};

export default Login;
