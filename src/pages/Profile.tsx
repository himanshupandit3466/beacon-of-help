
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, User } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { RouteGuard } from '@/components/RouteGuard';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, signOut } = useAuth();
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      // Error handling is in the signOut function
    }
  };

  return (
    <RouteGuard>
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
            {profile?.photo_url ? (
              <img 
                src={profile.photo_url} 
                alt={profile.full_name || 'User'} 
                className="w-24 h-24 rounded-full object-cover mb-4"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <User size={40} className="text-gray-400" />
              </div>
            )}
            <h2 className="text-xl font-bold">{profile?.full_name || user?.email?.split('@')[0] || 'User'}</h2>
            <p className="text-gray-500">{user?.phone || user?.email || 'No contact info'}</p>
            {profile?.is_verified && (
              <div className="mt-2 px-3 py-1 bg-green-100 rounded-full text-xs text-green-700 font-medium">
                ID Verified
              </div>
            )}
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
          
          {/* Account information */}
          <div className="bg-white rounded-lg p-4 mb-6 border">
            <h3 className="font-medium mb-3">Account Information</h3>
            <div className="space-y-3 text-sm">
              {profile?.full_name && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Name</span>
                  <span>{profile.full_name}</span>
                </div>
              )}
              {user?.phone && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone</span>
                  <span>{user.phone}</span>
                </div>
              )}
              {user?.email && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Email</span>
                  <span>{user.email}</span>
                </div>
              )}
              {profile?.dob && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Date of Birth</span>
                  <span>{new Date(profile.dob).toLocaleDateString()}</span>
                </div>
              )}
              {profile?.aadhaar_number && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Aadhaar</span>
                  <span>XXXX-XXXX-{profile.aadhaar_number.slice(-4)}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Emergency Contacts */}
          <div className="bg-white rounded-lg p-4 mb-6 border">
            <h3 className="font-medium mb-3">Emergency Contacts</h3>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/settings')}
            >
              Manage Emergency Contacts
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
    </RouteGuard>
  );
};

export default Profile;
