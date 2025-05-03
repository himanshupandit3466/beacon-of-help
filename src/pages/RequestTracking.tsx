
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, PhoneCall, MessageCircle } from "lucide-react";

// Mock volunteer data for the demo
const mockVolunteers = [
  {
    id: 'v1',
    name: 'Rahul Singh',
    distance: '1.2km away',
    eta: '5 mins',
    karma: 87,
    avatar: null
  },
  {
    id: 'v2',
    name: 'Priya Sharma',
    distance: '1.8km away',
    eta: '7 mins',
    karma: 124,
    avatar: null
  }
];

interface RequestDetails {
  id: string;
  type: string;
  title: string;
  location: { lat: number; lng: number };
  description: string;
  status: 'searching' | 'accepted' | 'completed' | 'canceled';
  createdAt: string;
  volunteer?: {
    id: string;
    name: string;
    distance: string;
    eta: string;
    karma: number;
    avatar: string | null;
  };
}

const RequestTracking = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [requestDetails, setRequestDetails] = useState<RequestDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!id) return;
    
    // In a real app, this would fetch from an API
    const storedRequest = localStorage.getItem(`helpin_request_${id}`);
    
    if (storedRequest) {
      setRequestDetails(JSON.parse(storedRequest));
    }
    
    setLoading(false);
    
    // Simulate volunteer accepting request after 5 seconds
    const timer = setTimeout(() => {
      if (storedRequest) {
        const updatedRequest = {
          ...JSON.parse(storedRequest),
          status: 'accepted',
          volunteer: mockVolunteers[0]
        };
        
        localStorage.setItem(`helpin_request_${id}`, JSON.stringify(updatedRequest));
        setRequestDetails(updatedRequest);
        
        toast({
          title: "Volunteer Found!",
          description: `${mockVolunteers[0].name} has accepted your request`
        });
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [id, toast]);

  const handleCancelRequest = () => {
    if (!requestDetails) return;
    
    const updatedRequest = {
      ...requestDetails,
      status: 'canceled'
    };
    
    localStorage.setItem(`helpin_request_${id}`, JSON.stringify(updatedRequest));
    setRequestDetails(updatedRequest);
    
    toast({
      title: "Request Canceled",
      description: "Your help request has been canceled"
    });
    
    // Navigate back to home after brief delay
    setTimeout(() => navigate('/home'), 1500);
  };

  const handleHelpReceived = () => {
    if (!requestDetails) return;
    
    const updatedRequest = {
      ...requestDetails,
      status: 'completed'
    };
    
    localStorage.setItem(`helpin_request_${id}`, JSON.stringify(updatedRequest));
    setRequestDetails(updatedRequest);
    
    toast({
      title: "Help Confirmed",
      description: "We're glad you received the help you needed"
    });
    
    // Navigate back to home after brief delay
    setTimeout(() => navigate('/home'), 1500);
  };

  const handleCall = () => {
    toast({
      title: "Calling Volunteer",
      description: "Your number is private and not shared"
    });
  };

  const handleMessage = () => {
    toast({
      title: "Messaging Volunteer",
      description: "Your number is private and not shared"
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-24 bg-gray-200 rounded"></div>
        </div>
        <p className="mt-4 text-gray-500">Loading request details...</p>
      </div>
    );
  }

  if (!requestDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white p-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold mb-2">Request Not Found</h2>
          <p className="text-gray-500">
            We couldn't find the help request you're looking for.
          </p>
        </div>
        <Button onClick={() => navigate('/home')}>
          Return to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="bg-primary text-white p-4 flex items-center">
        <button onClick={() => navigate('/home')} className="mr-3">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Help Request</h1>
      </div>
      
      {/* Status Bar */}
      <div className={`py-3 px-4 text-white text-center font-medium ${
        requestDetails.status === 'searching' ? 'bg-yellow-500' :
        requestDetails.status === 'accepted' ? 'bg-green-500' :
        requestDetails.status === 'completed' ? 'bg-blue-500' :
        'bg-gray-500'
      }`}>
        {requestDetails.status === 'searching' && 'Searching for volunteers...'}
        {requestDetails.status === 'accepted' && 'Volunteer is on the way!'}
        {requestDetails.status === 'completed' && 'Help request completed'}
        {requestDetails.status === 'canceled' && 'Help request canceled'}
      </div>
      
      {/* Content */}
      <div className="flex-grow p-4">
        {/* Emergency Type */}
        <div className="bg-gray-50 border rounded-lg p-4 mb-6">
          <div className="flex items-center mb-2">
            <h3 className="font-medium">{requestDetails.title}</h3>
          </div>
          {requestDetails.description && (
            <p className="text-sm text-gray-600">{requestDetails.description}</p>
          )}
        </div>
        
        {/* Volunteer Info (if assigned) */}
        {requestDetails.volunteer && requestDetails.status === 'accepted' && (
          <div className="border rounded-lg p-4 mb-6">
            <h3 className="font-medium mb-3">Your Volunteer</h3>
            
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                <span className="text-gray-500 font-medium">{requestDetails.volunteer.name.charAt(0)}</span>
              </div>
              <div>
                <h4 className="font-medium">{requestDetails.volunteer.name}</h4>
                <div className="flex items-center text-xs text-gray-500">
                  <span className="mr-2">{requestDetails.volunteer.distance}</span>
                  <span>•</span>
                  <span className="mx-2">ETA: {requestDetails.volunteer.eta}</span>
                  <span>•</span>
                  <span className="ml-2">{requestDetails.volunteer.karma} karma points</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="secondary" 
                className="flex-1"
                onClick={handleCall}
              >
                <PhoneCall size={16} className="mr-1" />
                Call
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleMessage}
              >
                <MessageCircle size={16} className="mr-1" />
                Message
              </Button>
            </div>
          </div>
        )}
        
        {/* Searching Status */}
        {requestDetails.status === 'searching' && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-pulse h-16 w-16 bg-yellow-200 rounded-full mb-4 flex items-center justify-center">
              <div className="h-10 w-10 bg-yellow-400 rounded-full"></div>
            </div>
            <h3 className="font-medium mb-1">Looking for nearby volunteers</h3>
            <p className="text-sm text-gray-500">
              We're notifying verified volunteers in your area
            </p>
          </div>
        )}
        
        {/* Action buttons based on status */}
        {requestDetails.status === 'searching' && (
          <Button 
            variant="outline" 
            className="w-full mb-4 border-red-300 text-red-600 hover:bg-red-50"
            onClick={handleCancelRequest}
          >
            Cancel Request
          </Button>
        )}
        
        {requestDetails.status === 'accepted' && (
          <Button 
            className="w-full mb-4 bg-green-500 hover:bg-green-600"
            onClick={handleHelpReceived}
          >
            I've Received Help
          </Button>
        )}
        
        {(requestDetails.status === 'completed' || requestDetails.status === 'canceled') && (
          <Button 
            className="w-full mb-4"
            onClick={() => navigate('/home')}
          >
            Return to Home
          </Button>
        )}
      </div>
      
      {/* Emergency Services Note */}
      <div className="bg-yellow-50 p-4 border-t border-yellow-100">
        <p className="text-sm text-yellow-700 text-center">
          <span className="font-bold">Remember:</span> For critical emergencies, please also contact professional emergency services.
        </p>
      </div>
    </div>
  );
};

export default RequestTracking;
