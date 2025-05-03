
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, User } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // In a real app, this would come from an authenticated user session
  const user = JSON.parse(localStorage.getItem('helpin_user') || '{}');
  
  const handleLogout = () => {
    localStorage.removeItem('helpin_user');
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully"
    });
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white p-4 flex items-center">
        <button onClick={() => navigate('/home')} className="mr-3">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Profile</h1>
      </div>
      
      {/* Profile section */}
      <div className="p-6">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <User size={40} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-bold">{user.name || 'User'}</h2>
          <p className="text-gray-500">{user.phoneNumber || user.email || 'No contact info'}</p>
          <div className="mt-2 px-3 py-1 bg-green-100 rounded-full text-xs text-green-700 font-medium">
            ID Verified
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center border">
            <h3 className="text-2xl font-bold text-primary">0</h3>
            <p className="text-sm text-gray-500">Help Requests</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border">
            <h3 className="text-2xl font-bold text-secondary">0</h3>
            <p className="text-sm text-gray-500">Karma Points</p>
          </div>
        </div>
        
        {/* Emergency Contacts */}
        <div className="bg-white rounded-lg p-4 mb-6 border">
          <h3 className="font-medium mb-3">Emergency Contacts</h3>
          <p className="text-sm text-gray-500 mb-3">
            Add contacts who will be notified when you request help
          </p>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => toast({ title: "Coming Soon", description: "This feature will be available in the next update" })}
          >
            Add Emergency Contact
          </Button>
        </div>
        
        {/* Account Actions */}
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/settings')}
          >
            Settings
          </Button>
          <Button 
            variant="outline" 
            className="w-full border-red-300 text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
