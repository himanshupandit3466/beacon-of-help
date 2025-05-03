
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [resendDisabled, setResendDisabled] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const { phoneNumber, name, isSignup } = location.state || {};
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          setResendDisabled(false);
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    
    // Allow only single digit
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Automatically focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = () => {
    const otpValue = otp.join('');
    
    if (otpValue.length !== 4) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 4-digit OTP",
        variant: "destructive"
      });
      return;
    }
    
    // For demo, any 4-digit OTP is considered valid
    toast({
      title: "OTP Verified",
      description: "Your phone number has been verified"
    });
    
    if (isSignup) {
      // Store user data temporarily and navigate to DigiLocker verification
      localStorage.setItem('helpin_temp_user', JSON.stringify({ phoneNumber, name }));
      navigate('/digilocker-verification');
    } else {
      // Simply log in the user
      localStorage.setItem('helpin_user', JSON.stringify({ phoneNumber }));
      navigate('/home');
    }
  };

  const handleResendOtp = () => {
    setOtp(['', '', '', '']);
    setTimer(30);
    setResendDisabled(true);
    
    toast({
      title: "OTP Resent",
      description: "A new OTP has been sent to your phone"
    });
  };

  return (
    <div className="flex flex-col h-screen p-6 bg-white">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Verify Phone Number</h1>
        <p className="text-center text-muted-foreground">
          Enter the 4-digit code sent to {phoneNumber}
        </p>
      </div>
      
      <div className="flex justify-center gap-3 mb-8">
        {[0, 1, 2, 3].map((index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={otp[index]}
            onChange={(e) => handleOtpChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-16 h-16 text-3xl text-center border rounded-lg"
            autoComplete="one-time-code"
          />
        ))}
      </div>
      
      <Button className="mb-6" onClick={handleVerify}>
        Verify OTP
      </Button>
      
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-2">
          {resendDisabled 
            ? `Resend code in ${timer} seconds` 
            : "Didn't receive the code?"}
        </p>
        <button 
          onClick={handleResendOtp}
          disabled={resendDisabled}
          className={`text-secondary font-medium ${resendDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:underline'}`}
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
};

export default VerifyOTP;
