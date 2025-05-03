
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/request';

// Mock function to simulate DigiLocker verification
// In a real app, this would integrate with the DigiLocker API
export const verifyWithDigiLocker = async (aadhaarNumber: string, isVolunteer: boolean = false): Promise<Partial<Profile>> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  // Mock data - in a real app, this would come from DigiLocker
  const mockData: Partial<Profile> = {
    full_name: `User ${Math.floor(Math.random() * 1000)}`,
    dob: new Date(1990, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    aadhaar_number: aadhaarNumber,
    photo_url: null,
    is_verified: true,
    is_volunteer: isVolunteer,
    karma_points: isVolunteer ? 0 : undefined
  };
  
  return mockData;
};

// Save DigiLocker data to user profile
export const saveDigiLockerData = async (userId: string, profileData: Partial<Profile>) => {
  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      ...profileData
    });
    
  if (error) {
    throw new Error(error.message);
  }
  
  return true;
};
