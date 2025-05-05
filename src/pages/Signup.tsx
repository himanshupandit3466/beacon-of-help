
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { RouteGuard } from '@/components/RouteGuard';

const Signup = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signInWithGoogle, signInWithEmailOTP } = useAuth();

  const handlePhoneSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name",
        variant: "destructive"
      });
      return;
    }
    
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Format phone number with country code if not provided
      const formattedPhone = phoneNumber.startsWith('+') 
        ? phoneNumber 
        : `+91${phoneNumber}`; // Assuming India country code
      
      // Send OTP to phone number (not creating account yet)
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: {
          data: {
            full_name: name
          }
        }
      });
      
      if (error) throw error;
      
      // Store user data temporarily and navigate to DigiLocker verification
      localStorage.setItem('helpin_temp_user', JSON.stringify({ phoneNumber: formattedPhone, name }));
      
      toast({
        title: "OTP Sent",
        description: "Please check your phone for the OTP"
      });
      
      navigate('/verify-otp', { state: { phoneNumber: formattedPhone, name, isSignup: true } });
    } catch (error: any) {
      toast({
        title: "Signup Failed",
        description: error.message || "Failed to create account",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name",
        variant: "destructive"
      });
      return;
    }
    
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
      // Send magic link to email with user data
      await signInWithEmailOTP(email, {
        full_name: name
      });
      
      // Store user data temporarily
      localStorage.setItem('helpin_temp_user', JSON.stringify({ email, name }));
      
      toast({
        title: "Email Sent",
        description: "We've sent a magic link to your email. Please check your inbox."
      });
    } catch (error: any) {
      toast({
        title: "Signup Failed",
        description: error.message || "Failed to create account",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      toast({
        title: "Google Signup Failed",
        description: error.message || "Failed to sign up with Google",
        variant: "destructive"
      });
    }
  };

  return (
    <RouteGuard requireAuth={false}>
      <div className="flex flex-col h-screen p-6 bg-white">
        <div className="flex items-center justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
            <span className="text-2xl font-bold text-white">H</span>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
        
        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <Input 
              type="text" 
              placeholder="Enter your full name" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>
        
        <Tabs defaultValue="phone" className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="phone">Phone</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
          </TabsList>
          
          <TabsContent value="phone">
            <form onSubmit={handlePhoneSignup} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <Input 
                  type="tel" 
                  placeholder="Enter your phone number" 
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  disabled={loading}
                />
                <p className="text-xs text-gray-500">
                  We'll send you a verification code
                </p>
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Processing...' : 'Continue'}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="email">
            <form onSubmit={handleEmailSignup} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input 
                  type="email" 
                  placeholder="Enter your email address" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
                <p className="text-xs text-gray-500">
                  We'll send you a magic link
                </p>
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Processing...' : 'Continue'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          onClick={handleGoogleSignup} 
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
          Google
        </Button>
        
        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <button 
            onClick={() => navigate('/login')}
            className="text-secondary hover:underline font-medium"
            disabled={loading}
          >
            Login
          </button>
        </p>
      </div>
    </RouteGuard>
  );
};

export default Signup;
