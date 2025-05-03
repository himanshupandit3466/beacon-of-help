
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { RouteGuard } from '@/components/RouteGuard';
import { getNearbyRequests, acceptHelpRequest } from '@/services/volunteerService';
import { RequestDetails, RequestStatus } from '@/types/request';
import { MapPin, Clock, AlertCircle } from "lucide-react";

const VolunteerDashboard = () => {
  const [requests, setRequests] = useState<RequestDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile } = useAuth();

  useEffect(() => {
    fetchNearbyRequests();

    // Set up polling for real-time updates
    const interval = setInterval(fetchNearbyRequests, 30000); // Poll every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const fetchNearbyRequests = async () => {
    if (!profile?.is_verified) return;
    
    try {
      setLoading(true);
      const nearbyRequests = await getNearbyRequests();
      setRequests(nearbyRequests);
    } catch (error: any) {
      toast({
        title: "Failed to fetch requests",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      setAcceptingId(requestId);
      await acceptHelpRequest(requestId);
      
      toast({
        title: "Request Accepted",
        description: "You have accepted this help request"
      });
      
      // Navigate to request tracking page
      navigate(`/request-tracking/${requestId}`);
    } catch (error: any) {
      toast({
        title: "Failed to accept request",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setAcceptingId(null);
    }
  };

  const getEmergencyTypeIcon = (type: string) => {
    switch (type) {
      case 'accident': return '🚗';
      case 'blood': return '🩸';
      case 'unsafe': return '🚨';
      case 'fire': return '🔥';
      case 'medical': return '💊';
      case 'vehicle': return '🚙';
      case 'disaster': return '🌊';
      default: return '✍️';
    }
  };

  // If user is not verified, show verification request
  if (!profile?.is_verified) {
    return (
      <RouteGuard>
        <div className="flex flex-col p-6 h-screen bg-white">
          <h1 className="text-2xl font-bold mb-6">Volunteer Dashboard</h1>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Verification Required</CardTitle>
              <CardDescription>
                You need to complete verification to become a volunteer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Please complete DigiLocker verification to start volunteering and help others in emergency situations.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate('/digilocker-verification')} className="w-full">
                Complete Verification
              </Button>
            </CardFooter>
          </Card>
        </div>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard>
      <div className="flex flex-col p-6 h-screen bg-white">
        <h1 className="text-2xl font-bold mb-6">Volunteer Dashboard</h1>
        
        {profile.karma_points !== undefined && (
          <div className="bg-primary/10 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="bg-primary/20 rounded-full p-2 mr-3">
                <span className="text-xl">⭐</span>
              </div>
              <div>
                <p className="text-sm font-medium">Your Karma Points</p>
                <p className="text-2xl font-bold">{profile.karma_points}</p>
              </div>
            </div>
          </div>
        )}
        
        <h2 className="text-lg font-medium mb-4">Nearby Emergency Requests</h2>
        
        {loading && requests.length === 0 && (
          <div className="flex justify-center my-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}
        
        {!loading && requests.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            <AlertCircle className="mx-auto h-12 w-12 mb-2 opacity-50" />
            <p>No emergency requests nearby at the moment</p>
          </div>
        )}
        
        <div className="space-y-4">
          {requests.map(request => (
            <Card key={request.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{getEmergencyTypeIcon(request.type)}</span>
                    <CardTitle>{request.title}</CardTitle>
                  </div>
                  <Badge variant={request.status === 'searching' ? 'default' : 'secondary'}>
                    {request.status === 'searching' ? 'Active' : 'Accepted'}
                  </Badge>
                </div>
                <CardDescription className="flex items-center mt-1">
                  <MapPin className="h-3.5 w-3.5 mr-1" /> {request.distance || "Calculating distance..."}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm mb-2">{request.description || "No additional details provided."}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>
                    Requested {new Date(request.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleAcceptRequest(request.id)}
                  disabled={request.status !== 'searching' || acceptingId === request.id}
                >
                  {acceptingId === request.id 
                    ? 'Accepting...' 
                    : request.status === 'searching' 
                      ? 'Accept Request' 
                      : `Accepted by ${request.accepted_count || 1} volunteer${request.accepted_count !== 1 ? 's' : ''}`
                  }
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </RouteGuard>
  );
};

export default VolunteerDashboard;
