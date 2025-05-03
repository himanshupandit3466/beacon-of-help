import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHelpRequestDetails } from '@/services/emergencyService';
import { RouteGuard } from '@/components/RouteGuard';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { RequestDetails } from '@/types/request';
import VolunteerRequestView from './VolunteerRequestView';

// This component now acts as a router between user view and volunteer view
const RequestTracking = () => {
  const { id } = useParams<{id: string}>();
  const [request, setRequest] = useState<RequestDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVolunteerView, setIsVolunteerView] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

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
      
      // Check if current user is the volunteer for this request
      if (details.volunteer?.id === user?.id) {
        setIsVolunteerView(true);
      }
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

  // If this is a volunteer viewing the request, show the volunteer view
  if (isVolunteerView) {
    return <VolunteerRequestView />;
  }

  // Otherwise, show the regular user view (original RequestTracking content)
  return (
    <RouteGuard>
      <div className="flex flex-col p-6 h-screen bg-white">
        <h1 className="text-2xl font-bold mb-6">Request Tracking</h1>
        
        {!request && (
          <div className="text-center py-10">
            <p>Request not found or has been removed.</p>
          </div>
        )}
        
        {request && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
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
              
              <div className="mb-4 pb-4 border-b">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Status:</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    request.status === 'searching' ? 'bg-blue-100 text-blue-800' :
                    request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    request.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {request.status === 'searching' ? 'Searching for help' :
                     request.status === 'accepted' ? 'Help is on the way' :
                     request.status === 'completed' ? 'Completed' :
                     'Canceled'}
                  </span>
                </div>
                
                <p className="text-gray-700">{request.description}</p>
              </div>
              
              {request.status === 'searching' && (
                <div className="bg-blue-50 p-4 rounded-md">
                  <h3 className="font-medium text-blue-800 mb-2">Looking for volunteers</h3>
                  <p className="text-sm text-blue-600">
                    We're searching for volunteers nearby. Please wait...
                  </p>
                  <div className="mt-3 flex justify-center">
                    <div className="animate-pulse flex space-x-4">
                      <div className="rounded-full bg-blue-200 h-3 w-3"></div>
                      <div className="rounded-full bg-blue-300 h-3 w-3"></div>
                      <div className="rounded-full bg-blue-400 h-3 w-3"></div>
                    </div>
                  </div>
                </div>
              )}
              
              {request.status === 'accepted' && request.volunteer && (
                <div className="bg-green-50 p-4 rounded-md">
                  <h3 className="font-medium text-green-800 mb-2">Help is on the way!</h3>
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 mr-3 overflow-hidden">
                      {request.volunteer.avatar ? (
                        <img 
                          src={request.volunteer.avatar} 
                          alt={request.volunteer.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary text-white text-lg font-bold">
                          {request.volunteer.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{request.volunteer.name}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-2">⭐ {request.volunteer.karma}</span>
                        <span>{request.volunteer.distance}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-green-600">
                    Estimated arrival: {request.volunteer.eta}
                  </p>
                </div>
              )}
              
              {request.status === 'completed' && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium text-gray-800 mb-2">Help completed</h3>
                  <p className="text-sm text-gray-600">
                    This request has been marked as completed.
                  </p>
                </div>
              )}
              
              {request.status === 'canceled' && (
                <div className="bg-red-50 p-4 rounded-md">
                  <h3 className="font-medium text-red-800 mb-2">Request canceled</h3>
                  <p className="text-sm text-red-600">
                    This help request has been canceled.
                  </p>
                </div>
              )}
            </div>
            
            <button
              onClick={() => navigate('/home')}
              className="w-full py-3 text-center text-primary font-medium"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </RouteGuard>
  );
};

export default RequestTracking;
