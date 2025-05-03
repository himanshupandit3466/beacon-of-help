
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, PhoneCall, MessageCircle, Check, X } from "lucide-react";
import { RequestDetails, RequestStatus } from '@/types/request';
import { getHelpRequestDetails, updateHelpRequestStatus } from '@/services/emergencyService';
import { RouteGuard } from '@/components/RouteGuard';

const RequestTracking = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [request, setRequest] = useState<RequestDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch request details from Supabase
    const fetchRequestDetails = async () => {
      if (!id) return;
      
      try {
        const requestDetails = await getHelpRequestDetails(id);
        setRequest(requestDetails);
      } catch (error: any) {
        console.error('Error fetching request details:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load request details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchRequestDetails();
    
    // Poll for updates every 5 seconds
    const intervalId = setInterval(fetchRequestDetails, 5000);
    
    // For demo, simulate a volunteer accepting the request after 8 seconds
    const timer = setTimeout(() => {
      if (request?.status === 'searching') {
        // This is a temporary simulation - in a real app, this would happen
        // when a volunteer actually accepts the request
        simulateVolunteerAccept();
      }
    }, 8000);
    
    return () => {
      clearInterval(intervalId);
      clearTimeout(timer);
    };
  }, [id, toast]);
  
  const simulateVolunteerAccept = async () => {
    if (request && id) {
      try {
        // In a real app, this would be done by the volunteer
        // This is just for demo purposes
        const updatedRequest = await getHelpRequestDetails(id);
        if (updatedRequest.status === 'searching') {
          // Update the request with a mock volunteer
          const mockVolunteer = {
            id: 'v1',
            name: 'Rahul Sharma',
            distance: '1.2 km away',
            eta: '5 minutes',
            karma: 120,
            avatar: null
          };
          
          const simulatedAcceptedRequest = {
            ...updatedRequest,
            status: 'accepted' as RequestStatus,
            volunteer: mockVolunteer
          };
          
          setRequest(simulatedAcceptedRequest);
          
          // In a real app, this would be updated by the volunteer's action
          // This is just for demo purposes
          await updateHelpRequestStatus(id, 'accepted');
          
          toast({
            title: "Volunteer Found!",
            description: "Rahul has accepted your request and is on the way."
          });
        }
      } catch (error) {
        console.error('Error simulating volunteer accept:', error);
      }
    }
  };
  
  const handleCancelRequest = async () => {
    if (request && id) {
      try {
        await updateHelpRequestStatus(id, 'canceled');
        
        setRequest({
          ...request,
          status: 'canceled'
        });
        
        toast({
          title: "Request Canceled",
          description: "Your help request has been canceled."
        });
        
        // Navigate back after a short delay
        setTimeout(() => {
          navigate('/home');
        }, 2000);
      } catch (error: any) {
        console.error('Error canceling request:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to cancel request",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleCompleteRequest = async () => {
    if (request && id) {
      try {
        await updateHelpRequestStatus(id, 'completed');
        
        setRequest({
          ...request,
          status: 'completed'
        });
        
        toast({
          title: "Request Completed",
          description: "Thank you for using Helpin!"
        });
        
        // Navigate back after a short delay
        setTimeout(() => {
          navigate('/home');
        }, 2000);
      } catch (error: any) {
        console.error('Error completing request:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to complete request",
          variant: "destructive"
        });
      }
    }
  };
  
  if (loading) {
    return (
      <RouteGuard>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </RouteGuard>
    );
  }
  
  if (!request) {
    return (
      <RouteGuard>
        <div className="flex flex-col items-center justify-center h-screen p-6">
          <h1 className="text-2xl font-bold mb-4">Request Not Found</h1>
          <p className="text-gray-500 mb-6">The request you're looking for doesn't exist or has expired.</p>
          <Button onClick={() => navigate('/home')}>Go Home</Button>
        </div>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard>
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-primary text-white p-4 flex items-center">
          <button onClick={() => navigate('/home')} className="mr-3">
            <ArrowLeft size={24} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold">Help Request</h1>
            <span className="text-sm opacity-80">{request.title}</span>
          </div>
        </div>
        
        {/* Status */}
        <div className={`p-4 ${
          request.status === 'searching' ? 'bg-yellow-50 border-b border-yellow-100' :
          request.status === 'accepted' ? 'bg-green-50 border-b border-green-100' :
          request.status === 'completed' ? 'bg-blue-50 border-b border-blue-100' :
          'bg-red-50 border-b border-red-100'
        }`}>
          <div className="flex items-center">
            <span className={`w-3 h-3 rounded-full mr-2 ${
              request.status === 'searching' ? 'bg-yellow-400 animate-pulse' :
              request.status === 'accepted' ? 'bg-green-500' :
              request.status === 'completed' ? 'bg-blue-500' :
              'bg-red-500'
            }`}></span>
            <span className="font-medium">
              {request.status === 'searching' ? 'Searching for volunteers...' :
               request.status === 'accepted' ? 'Volunteer found! Help is on the way.' :
               request.status === 'completed' ? 'Request completed' :
               'Request canceled'}
            </span>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-grow p-4 overflow-y-auto">
          {/* Request Details */}
          <div className="bg-white rounded-lg border p-4 mb-4">
            <h2 className="font-semibold mb-2">Request Details</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-500">Type:</div>
              <div>{request.title}</div>
              
              <div className="text-gray-500">Time:</div>
              <div>{new Date(request.createdAt).toLocaleTimeString()}</div>
              
              <div className="text-gray-500">Location:</div>
              <div>Near your current position</div>
              
              {request.description && (
                <>
                  <div className="text-gray-500 col-span-2 mt-2">Description:</div>
                  <div className="col-span-2 bg-gray-50 p-2 rounded">{request.description}</div>
                </>
              )}
            </div>
          </div>
          
          {/* Volunteer Details - Only shown when a volunteer has accepted */}
          {request.status === 'accepted' && request.volunteer && (
            <div className="bg-white rounded-lg border p-4 mb-4 animate-fadeIn">
              <h2 className="font-semibold mb-4">Volunteer Details</h2>
              
              <div className="flex items-center mb-4">
                {request.volunteer.avatar ? (
                  <img 
                    src={request.volunteer.avatar} 
                    alt={request.volunteer.name} 
                    className="w-16 h-16 rounded-full mr-4 object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <span className="text-xl font-bold text-primary">
                      {request.volunteer.name.charAt(0)}
                    </span>
                  </div>
                )}
                
                <div>
                  <h3 className="font-medium">{request.volunteer.name}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded mr-2">
                      {request.volunteer.karma} karma
                    </span>
                    <span>Verified Volunteer</span>
                  </div>
                  <div className="flex mt-1 space-x-4">
                    <div className="text-xs text-gray-500">{request.volunteer.distance}</div>
                    <div className="text-xs text-gray-500">ETA: {request.volunteer.eta}</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center"
                  onClick={() => toast({ title: "Feature Coming Soon", description: "Call functionality will be available in the next update" })}
                >
                  <PhoneCall size={16} className="mr-2" />
                  Call
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center"
                  onClick={() => toast({ title: "Feature Coming Soon", description: "Messaging functionality will be available in the next update" })}
                >
                  <MessageCircle size={16} className="mr-2" />
                  Message
                </Button>
              </div>
            </div>
          )}
          
          {/* Status Timeline - for future implementation */}
          {request.status === 'accepted' && (
            <div className="bg-white rounded-lg border p-4 mb-4">
              <h2 className="font-semibold mb-3">Status Updates</h2>
              <div className="space-y-4">
                <div className="flex">
                  <div className="mr-4 relative">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <div className="absolute top-4 bottom-0 left-2 -ml-px w-0.5 bg-gray-200"></div>
                  </div>
                  <div>
                    <p className="font-medium">Request Sent</p>
                    <p className="text-sm text-gray-500">{new Date(request.createdAt).toLocaleTimeString()}</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 relative">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <div className="absolute top-4 bottom-0 left-2 -ml-px w-0.5 bg-gray-200"></div>
                  </div>
                  <div>
                    <p className="font-medium">Volunteer Accepted</p>
                    <p className="text-sm text-gray-500">{new Date(new Date(request.createdAt).getTime() + 8000).toLocaleTimeString()}</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4">
                    <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Help Completed</p>
                    <p className="text-sm text-gray-500">Pending...</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Actions Footer */}
        <div className="p-4 bg-white border-t">
          {request.status === 'searching' && (
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleCancelRequest}
            >
              <X size={18} className="mr-2" />
              Cancel Request
            </Button>
          )}
          
          {request.status === 'accepted' && (
            <Button 
              className="w-full" 
              onClick={handleCompleteRequest}
            >
              <Check size={18} className="mr-2" />
              Mark as Completed
            </Button>
          )}
          
          {(request.status === 'completed' || request.status === 'canceled') && (
            <Button 
              className="w-full" 
              onClick={() => navigate('/home')}
            >
              Return to Home
            </Button>
          )}
        </div>
      </div>
    </RouteGuard>
  );
};

export default RequestTracking;
