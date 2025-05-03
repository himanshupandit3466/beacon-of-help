
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User, Settings, HelpCircle } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userName, setUserName] = useState(() => {
    const user = JSON.parse(localStorage.getItem('helpin_user') || '{}');
    return user.name || 'User';
  });

  const handleEmergencyHelp = () => {
    navigate('/emergency-selection');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-3">
            <span className="text-sm font-bold text-white">H</span>
          </div>
          <h1 className="font-bold text-lg">Helpin</h1>
        </div>
        <div className="flex space-x-4">
          <button onClick={handleSettingsClick} className="text-gray-600">
            <Settings size={20} />
          </button>
          <button onClick={handleProfileClick} className="text-gray-600">
            <User size={20} />
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Welcome, {userName}</h2>
          <p className="text-gray-500">
            Need emergency assistance? Press the help button below.
          </p>
        </div>
        
        {/* Emergency help button */}
        <button 
          onClick={handleEmergencyHelp}
          className="help-button w-48 h-48 mb-8 flex items-center justify-center"
        >
          <HelpCircle size={64} />
        </button>
        
        <p className="text-sm text-gray-500 text-center max-w-xs">
          Pressing this button will let you select the type of emergency and connect you with nearby verified volunteers.
        </p>
      </div>
      
      {/* Information cards */}
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-lg p-4 border">
          <h3 className="font-medium mb-2">Your Safety First</h3>
          <p className="text-sm text-gray-500">
            While waiting for help from volunteers, please call professional emergency services if the situation is critical.
          </p>
        </div>
        
        <div className="bg-white rounded-lg p-4 border">
          <h3 className="font-medium mb-2">Be a Volunteer</h3>
          <p className="text-sm text-gray-500">
            You can also help others in need and earn karma points.
          </p>
          <Button 
            variant="outline" 
            className="mt-2 w-full"
            onClick={() => toast({ title: "Coming Soon", description: "Volunteer mode will be available in the next update" })}
          >
            Switch to Volunteer Mode
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
