
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

const TermsConditions = () => {
  const [accepted, setAccepted] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAccept = () => {
    if (accepted) {
      localStorage.setItem('helpin_terms_accepted', 'true');
      toast({
        title: "Terms & Conditions Accepted",
        description: "Thank you for accepting our terms and conditions."
      });
      navigate('/login');
    } else {
      toast({
        title: "Required",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col h-screen p-6 bg-white">
      <h1 className="text-2xl font-bold mb-4 text-center">Terms & Conditions</h1>
      
      <ScrollArea className="flex-grow mb-6 border rounded-lg p-4">
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Welcome to Helpin</h2>
          
          <p>By using the Helpin app, you agree to the following terms and conditions:</p>
          
          <h3 className="font-semibold mt-4">1. User Verification</h3>
          <p>All users must complete identity verification via DigiLocker to use the platform. This helps ensure the safety and security of all users.</p>
          
          <h3 className="font-semibold mt-4">2. Emergency Assistance</h3>
          <p>While Helpin provides a platform to connect people in emergencies with volunteers, it is not a replacement for professional emergency services. In critical situations, please contact emergency services (like 911, 112, etc.) first.</p>
          
          <h3 className="font-semibold mt-4">3. Privacy & Data</h3>
          <p>We take your privacy seriously. Location data is only shared when you actively request help or volunteer to help someone. Phone numbers are never directly shared between users.</p>
          
          <h3 className="font-semibold mt-4">4. User Conduct</h3>
          <p>Users must not misuse the platform by creating false emergencies. Such actions may result in permanent account termination and potential legal action.</p>
          
          <h3 className="font-semibold mt-4">5. Safety Guidelines</h3>
          <p>Volunteers should only accept requests they feel comfortable and capable of handling. Never put yourself in danger to help others.</p>
          
          <h3 className="font-semibold mt-4">6. Karma Point System</h3>
          <p>The karma point system is designed to recognize helpful actions, but does not constitute any monetary value or entitlement.</p>
          
          <h3 className="font-semibold mt-4">7. Limitation of Liability</h3>
          <p>Helpin is not liable for any injuries, damages, or losses that occur while using our platform. Users engage with each other at their own risk.</p>
        </div>
      </ScrollArea>
      
      <div className="flex items-center space-x-2 mb-6">
        <Checkbox id="terms" checked={accepted} onCheckedChange={(checked) => setAccepted(!!checked)} />
        <label htmlFor="terms" className="text-sm font-medium leading-none">
          I have read and accept the Terms & Conditions
        </label>
      </div>
      
      <div className="flex space-x-4">
        <Button variant="outline" className="w-1/2" onClick={() => navigate('/')}>
          Cancel
        </Button>
        <Button className="w-1/2" onClick={handleAccept} disabled={!accepted}>
          Accept & Continue
        </Button>
      </div>
    </div>
  );
};

export default TermsConditions;
