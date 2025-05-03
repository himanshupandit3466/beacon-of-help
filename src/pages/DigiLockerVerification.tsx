
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const DigiLockerVerification = () => {
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleVerifyWithDigiLocker = () => {
    setVerifying(true);
    
    // Simulate DigiLocker verification process
    setTimeout(() => {
      setVerifying(false);
      
      // Get temp user data
      const tempUserData = JSON.parse(localStorage.getItem('helpin_temp_user') || '{}');
      
      // Create verified user
      const userData = {
        ...tempUserData,
        isVerified: true,
        verifiedAt: new Date().toISOString()
      };
      
      localStorage.setItem('helpin_user', JSON.stringify(userData));
      localStorage.removeItem('helpin_temp_user');
      
      toast({
        title: "Verification Complete",
        description: "Your identity has been verified successfully"
      });
      
      navigate('/home');
    }, 3000);
  };

  return (
    <div className="flex flex-col h-screen p-6 bg-white">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-2xl font-bold mb-2">ID Verification Required</h1>
        <p className="text-center text-muted-foreground mb-4">
          To ensure safety and trust within our community, we require verification via DigiLocker
        </p>
      </div>
      
      <div className="bg-gray-50 border rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Why verify with DigiLocker?</h2>
        
        <ul className="space-y-3">
          <li className="flex items-start">
            <div className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm">Ensures all community members are real and verified</p>
          </li>
          <li className="flex items-start">
            <div className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm">Creates a safe environment for emergency help</p>
          </li>
          <li className="flex items-start">
            <div className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm">Prevents misuse of the platform</p>
          </li>
        </ul>
      </div>
      
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8">
        <p className="text-sm text-blue-700">
          <span className="font-semibold">Your privacy:</span> We only verify your identity. Your ID documents won't be stored on our servers.
        </p>
      </div>
      
      <Button 
        onClick={handleVerifyWithDigiLocker} 
        className="bg-secondary hover:bg-secondary/90 mb-4"
        disabled={verifying}
      >
        {verifying ? 'Connecting to DigiLocker...' : 'Connect with DigiLocker'}
      </Button>
      
      <p className="text-center text-sm text-gray-500">
        By proceeding, you agree to DigiLocker's terms and allow Helpin to verify your identity using DigiLocker.
      </p>
    </div>
  );
};

export default DigiLockerVerification;
