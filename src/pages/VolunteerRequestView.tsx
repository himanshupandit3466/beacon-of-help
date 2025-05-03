
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { RouteGuard } from '@/components/RouteGuard';
import { getHelpRequestDetails } from '@/services/emergencyService';
import { completeHelpRequest } from '@/services/volunteerService';
import { RequestDetails } from '@/types/request';
import { MapPin, Phone, MessageSquare, CheckCircle } from "lucide-react";

const VolunteerRequestView = () => {
  const { id } = useParams<{id: string}>();
  const [request, setRequest] = useState<RequestDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      fetchRequestDetails();
    }
  }, [id]);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      const details = await getHelpRequestDetails(id!);
      setRequest(details);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch request details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRequest = async () => {
    if (!id || !request || request.status === 'completed') return;
    
    try {
      setCompleting(true);
      await completeHelpRequest(id);
      
      toast({
        title: "Help Completed",
        description: "Thank you for helping! You've earned karma points."
      });
      
      // Refresh request details
      await fetchRequestDetails();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete the request",
        variant: "destructive"
      });
    } finally {
      setCompleting(false);
    }
  };

  const handleCall = () => {
    // In a real app, this would initiate a call through a proxy service
    toast({
      title: "Calling",
      description: "Connecting to requester via secure line...",
    });
  };

  const handleMessage = () => {
    // In a real app, this would open a messaging interface
    toast({
      title: "Messaging",
      description: "Opening secure messaging channel...",
    });
  };

  const handleNavigate = () => {
    // In a real app, open maps with directions
    if (request?.location) {
      const { lat, lng } = request.location;
      // Open Google Maps with directions
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    }
  };

  if (loading) {
    return (
      <RouteGuard>
        <div className="flex flex-col items-center justify-center h-screen p-6 bg-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4">Loading request details...</p>
        </div>
      </RouteGuard>
    );
  }

  if (!request) {
    return (
      <RouteGuard>
        <div className="flex flex-col items-center justify-center h-screen p-6 bg-white">
          <h1 className="text-2xl font-bold mb-4">Request Not Found</h1>
          <p className="mb-6">The emergency request you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/volunteer')}>
            Back to Dashboard
          </Button>
        </div>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard>
      <div className="flex flex-col p-6 min-h-screen bg-white">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Emergency Help</h1>
          <Badge variant={
            request.status === 'searching' ? 'default' : 
            request.status === 'completed' ? 'secondary' : 
            'outline'
          }>
            {request.status === 'searching' ? 'Active' : 
             request.status === 'completed' ? 'Completed' :
             'Accepted'}
          </Badge>
        </div>
        
        <Card className="p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="text-3xl mr-3">
              {request.type === 'accident' ? '🚗' :
               request.type === 'blood' ? '🩸' :
               request.type === 'unsafe' ? '🚨' :
               request.type === 'fire' ? '🔥' :
               request.type === 'medical' ? '💊' :
               request.type === 'vehicle' ? '🚙' :
               request.type === 'disaster' ? '🌊' : '✍️'}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{request.title}</h2>
              <p className="text-sm text-gray-500">
                {new Date(request.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          
          <p className="mb-4">{request.description || "No additional details provided."}</p>
          
          <div className="flex items-center text-sm text-blue-600 mb-4">
            <MapPin className="h-4 w-4 mr-1" />
            <button 
              onClick={handleNavigate}
              className="underline"
            >
              Navigate to requester's location
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button 
              variant="outline" 
              className="flex items-center justify-center" 
              onClick={handleCall}
            >
              <Phone className="mr-2 h-4 w-4" />
              Call
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center justify-center"
              onClick={handleMessage}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Message
            </Button>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md mb-6">
            <h3 className="font-medium text-blue-800 mb-2">Privacy Note</h3>
            <p className="text-sm text-blue-600">
              All communication is secured and anonymized. The requester's personal details are protected.
            </p>
          </div>
          
          {request.status === 'accepted' && (
            <Button 
              className="w-full flex items-center justify-center" 
              onClick={handleCompleteRequest}
              disabled={completing}
            >
              {completing ? 'Completing...' : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark Help as Completed
                </>
              )}
            </Button>
          )}
          
          {request.status === 'completed' && (
            <div className="bg-green-50 p-4 rounded-md">
              <h3 className="font-medium text-green-800 mb-2 flex items-center">
                <CheckCircle className="mr-2 h-4 w-4" />
                Help Completed
              </h3>
              <p className="text-sm text-green-600">
                Thank you for your help! You've earned 10 karma points.
              </p>
            </div>
          )}
        </Card>
        
        <Button variant="outline" onClick={() => navigate('/volunteer')}>
          Back to Dashboard
        </Button>
      </div>
    </RouteGuard>
  );
};

export default VolunteerRequestView;
