
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { verifyWithDigiLocker, saveDigiLockerData } from '@/services/digilockerService';
import { useAuth } from '@/contexts/AuthContext';
import { RouteGuard } from '@/components/RouteGuard';

const DigiLockerVerification = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, updateProfile } = useAuth();
  
  const [aadhaar, setAadhaar] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [userData, setUserData] = useState<{
    full_name: string;
    dob: string;
    aadhaar_number: string;
  } | null>(null);

  const handleVerify = async () => {
    if (!aadhaar || aadhaar.length !== 12 || !/^\d+$/.test(aadhaar)) {
      toast({
        title: "Invalid Aadhaar Number",
        description: "Please enter a valid 12-digit Aadhaar number",
        variant: "destructive"
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in before verification",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    setVerifying(true);
    
    try {
      // In a real app, this would actually verify with DigiLocker API
      const digiLockerData = await verifyWithDigiLocker(aadhaar);
      
      setUserData({
        full_name: digiLockerData.full_name || 'User',
        dob: digiLockerData.dob || '1990-01-01',
        aadhaar_number: aadhaar,
      });
      
      setVerified(true);
      
      toast({
        title: "Verification Successful",
        description: "Your identity has been verified"
      });
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Failed to verify your identity",
        variant: "destructive"
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleContinue = async () => {
    if (!user || !userData) return;
    
    try {
      // Save profile data to Supabase
      await updateProfile({
        full_name: userData.full_name,
        dob: userData.dob,
        aadhaar_number: userData.aadhaar_number,
        is_verified: true
      });
      
      toast({
        title: "Profile Updated",
        description: "Your verified profile has been saved"
      });
      
      // Navigate to home page
      navigate('/home');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save profile data",
        variant: "destructive"
      });
    }
  };

  return (
    <RouteGuard requireAuth={true}>
      <div className="flex flex-col h-screen bg-white">
        {/* Header */}
        <div className="bg-primary text-white p-4 flex items-center">
          <button onClick={() => navigate('/signup')} className="mr-3">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">DigiLocker Verification</h1>
        </div>
        
        {/* Content */}
        <div className="flex-grow p-6">
          {!verified ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Identity Verification</h2>
                <p className="text-gray-500 mb-6">
                  Please enter your Aadhaar number to verify your identity. This helps us ensure the safety and trust of our community.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Aadhaar Number
                  </label>
                  <Input 
                    type="text"
                    inputMode="numeric"
                    placeholder="12-digit Aadhaar number"
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, '').slice(0, 12))}
                    className="text-center tracking-widest text-lg"
                    maxLength={12}
                  />
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={handleVerify}
                  disabled={verifying || aadhaar.length !== 12}
                >
                  {verifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify & Continue'
                  )}
                </Button>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-medium text-blue-800 mb-2">Why we need verification</h3>
                <ul className="text-sm text-blue-700 space-y-1 list-disc pl-4">
                  <li>To ensure safety of all users</li>
                  <li>To prevent misuse of the platform</li>
                  <li>To build a trusted community of helpers</li>
                </ul>
              </div>
              
              <p className="text-xs text-center text-gray-500">
                Your Aadhaar details are secure and encrypted. We comply with all privacy regulations and do not share your information with third parties.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-12 w-12 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Verification Complete</h2>
                <p className="text-gray-500 mb-6">
                  Your identity has been verified successfully. Please review your details below.
                </p>
              </div>
              
              <div className="bg-white rounded-lg border p-4 space-y-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                  <p className="font-medium">{userData?.full_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
                  <p className="font-medium">{userData?.dob}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Aadhaar Number</h3>
                  <p className="font-medium">XXXX-XXXX-{aadhaar.slice(-4)}</p>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex items-center">
                  <div className="bg-green-400 rounded-full p-1 mr-2">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-sm font-medium text-green-800">
                    Verified by DigiLocker
                  </p>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleContinue}
              >
                Continue
              </Button>
              
              <p className="text-xs text-center text-gray-500">
                By continuing, you agree that these details will be used to create your verified profile on Helpin.
              </p>
            </div>
          )}
        </div>
      </div>
    </RouteGuard>
  );
};

export default DigiLockerVerification;
