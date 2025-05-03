
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';

const HomeNav = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [isVolunteer, setIsVolunteer] = useState(false);
  
  useEffect(() => {
    if (profile?.is_volunteer) {
      setIsVolunteer(true);
    }
  }, [profile]);
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3">
      <div className="flex justify-around">
        <Button
          variant={!isVolunteer ? "default" : "outline"}
          className="flex-1 mr-2"
          onClick={() => navigate('/home')}
        >
          Need Help
        </Button>
        
        <Button
          variant={isVolunteer ? "default" : "outline"}
          className="flex-1 ml-2"
          onClick={() => {
            if (profile?.is_verified) {
              navigate('/volunteer');
            } else {
              navigate('/digilocker-verification', { state: { isVolunteer: true } });
            }
          }}
        >
          Volunteer
        </Button>
      </div>
    </div>
  );
};

export default HomeNav;
