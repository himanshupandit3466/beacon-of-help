
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePhoneLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive"
      });
      return;
    }
    // In a real app, you would make an API call to send OTP
    toast({
        title: "OTP Sent",
        description: "Please check your phone for the OTP"
    });
    navigate('/verify-otp', { state: { phoneNumber } });
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Required Fields",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate login success for demo
    localStorage.setItem('helpin_user', JSON.stringify({ email }));
    toast({
      title: "Login Successful",
      description: "Welcome back to Helpin!"
    });
    navigate('/home');
  };

  const handleGoogleLogin = () => {
    toast({
      title: "Google Login",
      description: "Google login will be implemented with Supabase integration"
    });
  };

  return (
    <div className="flex flex-col h-screen p-6 bg-white">
      <div className="flex items-center justify-center mb-8">
        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
          <span className="text-2xl font-bold text-white">H</span>
        </div>
      </div>
      
      <h1 className="text-2xl font-bold mb-6 text-center">Login to Helpin</h1>
      
      <Tabs defaultValue="phone" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="phone">Phone</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>
        
        <TabsContent value="phone">
          <form onSubmit={handlePhoneLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input 
                type="tel" 
                placeholder="Enter your phone number" 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            
            <Button type="submit" className="w-full">
              Send OTP
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="email">
          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input 
                type="email" 
                placeholder="Enter your email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Password</label>
                <a href="#" className="text-sm text-secondary hover:underline">
                  Forgot?
                </a>
              </div>
              <Input 
                type="password" 
                placeholder="Enter your password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </TabsContent>
      </Tabs>
      
      <div className="relative my-8">
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
        Don't have an account?{' '}
        <button 
          onClick={() => navigate('/signup')}
          className="text-secondary hover:underline font-medium"
        >
          Sign up
        </button>
      </p>
    </div>
  );
};

export default Login;
