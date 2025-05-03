
import { supabase } from '@/integrations/supabase/client';
import { RequestDetails, RequestStatus } from '@/types/request';

// Get nearby emergency requests
export const getNearbyRequests = async (maxDistance: number = 5): Promise<RequestDetails[]> => {
  const user = (await supabase.auth.getUser()).data.user;
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  // Get user's last location from profile
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('last_location')
    .eq('id', user.id)
    .single();
  
  if (profileError) {
    throw new Error('Failed to fetch user location');
  }
  
  // Get emergency requests within maxDistance km
  const { data, error } = await supabase
    .from('help_requests')
    .select(`
      id,
      type,
      description,
      location,
      status,
      created_at,
      accepted_by,
      (SELECT count(*) FROM help_request_acceptances WHERE help_request_id = help_requests.id) as accepted_count
    `)
    .eq('status', 'searching')
    .not('user_id', 'eq', user.id) // Exclude user's own requests
    .order('created_at', { ascending: false });
    
  if (error) {
    throw new Error(error.message);
  }
  
  // Get emergency title from type
  const emergencyTypes: Record<string, { title: string; icon: string }> = {
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
  
  // Transform response into RequestDetails format
  const requests: RequestDetails[] = data?.map(item => {
    // Parse location from PostgreSQL POINT format if it's a string
    let location = { lat: 0, lng: 0 };
    if (typeof item.location === 'string') {
      const locationMatch = item.location.match(/\((.+),(.+)\)/);
      if (locationMatch) {
        location = { 
          lng: parseFloat(locationMatch[1]), 
          lat: parseFloat(locationMatch[2]) 
        };
      }
    }
    
    // Calculate distance - in a real app, use a proper distance calculation
    // For demo, generate a random distance between 0.1 and maxDistance km
    const distance = `${(Math.random() * (maxDistance - 0.1) + 0.1).toFixed(1)} km away`;
    
    const title = emergencyTypes[item.type]?.title || 'Emergency';
    
    return {
      id: item.id,
      type: item.type,
      title,
      location,
      description: item.description || '',
      createdAt: item.created_at,
      status: item.status as RequestStatus,
      distance,
      accepted_count: item.accepted_count || 0
    };
  }) || [];
  
  return requests;
};

// Accept a help request
export const acceptHelpRequest = async (requestId: string): Promise<void> => {
  const user = (await supabase.auth.getUser()).data.user;
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  // Start a transaction to update help request and store acceptance
  const { error: updateError } = await supabase
    .from('help_requests')
    .update({ 
      status: 'accepted' as RequestStatus,
      accepted_by: user.id,
      accepted_at: new Date().toISOString()
    })
    .eq('id', requestId)
    .eq('status', 'searching');
    
  if (updateError) {
    throw new Error(updateError.message);
  }
  
  // Record the acceptance in help_request_acceptances table
  const { error: acceptError } = await supabase
    .from('help_request_acceptances')
    .insert({
      help_request_id: requestId,
      volunteer_id: user.id,
      accepted_at: new Date().toISOString()
    });
    
  if (acceptError) {
    console.error('Failed to record acceptance', acceptError);
    // Continue anyway, the primary update succeeded
  }
};

// Complete a help request and earn karma points
export const completeHelpRequest = async (requestId: string): Promise<void> => {
  const user = (await supabase.auth.getUser()).data.user;
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  // Update help request status to completed
  const { error: updateError } = await supabase
    .from('help_requests')
    .update({ 
      status: 'completed' as RequestStatus
    })
    .eq('id', requestId)
    .eq('accepted_by', user.id);
    
  if (updateError) {
    throw new Error(updateError.message);
  }
  
  // Award karma points to the volunteer
  const karmaPoints = 10; // Default karma points per help
  
  // Update volunteer's karma points
  const { error: karmaError } = await supabase.rpc('increment_karma_points', {
    user_id: user.id,
    points: karmaPoints
  });
  
  if (karmaError) {
    console.error('Failed to update karma points', karmaError);
    // Continue anyway, the request was still completed
  }
};
