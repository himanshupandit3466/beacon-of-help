
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

// Map emergency type IDs to their details
const emergencyMap: Record<string, { title: string; icon: string }> = {
  'accident': { title: 'Road Accident', icon: '🚗' },
  'blood': { title: 'Blood Requirement', icon: '🩸' },
  'unsafe': { title: 'Personal Safety Threat', icon: '🚨' },
  'fire': { title: 'Fire Emergency', icon: '🔥' },
  'medical': { title: 'Medical Emergency', icon: '💊' },
  'crime': { title: 'Crime Witness / Need Police', icon: '🚔' },
  'electric': { title: 'Electric Shock / Short Circuit', icon: '⚡' },
  'vehicle': { title: 'Vehicle Breakdown', icon: '🚙' },
  'disaster': { title: 'Natural Disaster', icon: '🌊' },
  'other': { title: 'Other Emergency', icon: '✍️' }
};

const EmergencyRequest = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const emergencyInfo = type ? emergencyMap[type] : { title: 'Emergency', icon: '🚨' };

  // Get user's location as soon as the component loads
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError('Unable to get your location. Please enable location services.');
          toast({
            title: "Location Error",
            description: "Unable to get your location. Please enable location services.",
            variant: "destructive"
          });
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
      toast({
        title: "Location Not Supported",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleSubmit = () => {
    if (!location) {
      toast({
        title: "Location Required",
        description: "We need your location to find help nearby",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Create a mock request ID
    const requestId = Math.random().toString(36).substring(2, 15);
    
    // In a real app, this would be sent to a server
    setTimeout(() => {
      // Store request details in local storage for demo
      const requestDetails = {
        id: requestId,
        type: type,
        title: emergencyInfo.title,
        location: location,
        description: description,
        status: 'searching',
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem(`helpin_request_${requestId}`, JSON.stringify(requestDetails));
      
      setIsSubmitting(false);
      toast({
        title: "Help Request Sent",
        description: "Searching for volunteers nearby"
      });
      
      navigate(`/request-tracking/${requestId}`);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="bg-primary text-white p-4 flex items-center">
        <button onClick={() => navigate('/emergency-selection')} className="mr-3">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center">
          <span className="text-2xl mr-2">{emergencyInfo.icon}</span>
          <h1 className="text-xl font-bold">{emergencyInfo.title}</h1>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-grow p-4">
        {locationError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700">{locationError}</p>
            <Button 
              variant="outline" 
              className="mt-2 w-full"
              onClick={() => window.location.reload()}
            >
              Retry Getting Location
            </Button>
          </div>
        ) : !location ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
              <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-24 bg-gray-200 rounded"></div>
            </div>
            <p className="mt-4 text-gray-500">Getting your location...</p>
          </div>
        ) : (
          <>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-green-800 mb-1">Location Found</h3>
              <p className="text-sm text-green-600">
                We've detected your current location. This will be shared with nearby volunteers.
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe your emergency (optional)
              </label>
              <Textarea
                placeholder="Provide any additional details about your emergency..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-32"
              />
              <p className="text-xs text-gray-500 mt-1">
                This information will help volunteers understand your situation better.
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-blue-800 mb-1">Who will be notified?</h3>
              <p className="text-sm text-blue-600">
                Verified volunteers within 5km of your location will receive your help request.
              </p>
            </div>
            
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? 'Sending Request...' : 'Send Help Request'}
            </Button>
          </>
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

export default EmergencyRequest;
