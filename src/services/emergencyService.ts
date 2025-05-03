
import { supabase } from '@/integrations/supabase/client';
import { Location, RequestDetails } from '@/types/request';

// Create a new help request
export const createHelpRequest = async (
  type: string,
  location: Location,
  description?: string
): Promise<RequestDetails> => {
  const user = (await supabase.auth.getUser()).data.user;
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  // Convert the location to PostgreSQL POINT format
  const pointLocation = `(${location.lng},${location.lat})`;
  
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
  
  const title = emergencyTypes[type]?.title || 'Emergency';
  
  const { data, error } = await supabase
    .from('help_requests')
    .insert({
      user_id: user.id,
      type,
      description,
      location: pointLocation,
      status: 'searching'
    })
    .select()
    .single();
    
  if (error) {
    throw new Error(error.message);
  }
  
  // Convert to RequestDetails format
  const requestDetails: RequestDetails = {
    id: data.id,
    type: data.type,
    title,
    location,
    description: data.description || '',
    createdAt: data.created_at,
    status: data.status,
  };
  
  // Notify emergency contacts (would be implemented in a real app)
  try {
    await notifyEmergencyContacts(user.id, requestDetails);
  } catch (e) {
    console.error('Failed to notify emergency contacts:', e);
    // Continue with the request even if notification fails
  }
  
  return requestDetails;
};

// Get help request details
export const getHelpRequestDetails = async (requestId: string): Promise<RequestDetails> => {
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
      profiles:accepted_by(full_name, photo_url)
    `)
    .eq('id', requestId)
    .single();
    
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
  
  const title = emergencyTypes[data.type]?.title || 'Emergency';
  
  // Parse location from PostgreSQL POINT format
  const locationMatch = data.location.match(/\((.+),(.+)\)/);
  const location = locationMatch 
    ? { lng: parseFloat(locationMatch[1]), lat: parseFloat(locationMatch[2]) } 
    : { lat: 0, lng: 0 };
  
  // Create volunteer data if request was accepted
  let volunteer = undefined;
  if (data.accepted_by && data.profiles) {
    volunteer = {
      id: data.accepted_by,
      name: data.profiles.full_name || 'Volunteer',
      distance: '1.2 km away', // Would be calculated in a real app
      eta: '5 minutes', // Would be calculated in a real app
      karma: 120, // Would be fetched in a real app
      avatar: data.profiles.photo_url
    };
  }
  
  return {
    id: data.id,
    type: data.type,
    title,
    location,
    description: data.description || '',
    createdAt: data.created_at,
    status: data.status,
    volunteer
  };
};

// Update help request status
export const updateHelpRequestStatus = async (
  requestId: string, 
  status: 'searching' | 'accepted' | 'completed' | 'canceled'
): Promise<void> => {
  const { error } = await supabase
    .from('help_requests')
    .update({ status })
    .eq('id', requestId);
    
  if (error) {
    throw new Error(error.message);
  }
};

// Volunteer accepting a help request
export const acceptHelpRequest = async (requestId: string): Promise<void> => {
  const user = (await supabase.auth.getUser()).data.user;
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const { error } = await supabase
    .from('help_requests')
    .update({ 
      status: 'accepted',
      accepted_by: user.id,
      accepted_at: new Date().toISOString()
    })
    .eq('id', requestId);
    
  if (error) {
    throw new Error(error.message);
  }
};

// Mock function to simulate notifying emergency contacts
// In a real app, this would integrate with SMS/WhatsApp APIs
const notifyEmergencyContacts = async (userId: string, requestDetails: RequestDetails): Promise<void> => {
  // Get user's emergency contacts
  const { data: contacts, error } = await supabase
    .from('emergency_contacts')
    .select('*')
    .eq('user_id', userId);
    
  if (error) {
    throw new Error(error.message);
  }
  
  if (!contacts || contacts.length === 0) {
    console.log('No emergency contacts found for user');
    return;
  }
  
  // In a real app, this would send SMS/WhatsApp messages
  console.log(`Would send emergency notifications to ${contacts.length} contacts`);
  console.log('Emergency details:', requestDetails);
  
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  return;
};
