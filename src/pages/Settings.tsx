
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [searchRadius, setSearchRadius] = useState([5]); // km
  const [shareContactInfo, setShareContactInfo] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  const handleSave = () => {
    // In a real app, these settings would be saved to a database
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated"
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white p-4 flex items-center">
        <button onClick={() => navigate('/home')} className="mr-3">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Settings</h1>
      </div>
      
      {/* Settings sections */}
      <div className="flex-grow p-6 space-y-6 overflow-y-auto">
        {/* Notifications */}
        <div>
          <h2 className="text-lg font-medium mb-3">Notifications</h2>
          <div className="bg-white rounded-lg border divide-y">
            <div className="flex items-center justify-between p-4">
              <div>
                <h3 className="font-medium">Emergency Alerts</h3>
                <p className="text-sm text-gray-500">Nearby emergency requests</p>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <h3 className="font-medium">App Updates</h3>
                <p className="text-sm text-gray-500">New features and improvements</p>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
          </div>
        </div>
        
        {/* Location */}
        <div>
          <h2 className="text-lg font-medium mb-3">Location</h2>
          <div className="bg-white rounded-lg border divide-y">
            <div className="flex items-center justify-between p-4">
              <div>
                <h3 className="font-medium">Location Services</h3>
                <p className="text-sm text-gray-500">Allow app to access your location</p>
              </div>
              <Switch
                checked={locationServices}
                onCheckedChange={setLocationServices}
              />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Search Radius</h3>
                <span className="text-sm font-medium">{searchRadius[0]} km</span>
              </div>
              <Slider
                value={searchRadius}
                onValueChange={setSearchRadius}
                max={20}
                min={1}
                step={1}
              />
              <p className="text-xs text-gray-500 mt-2">
                Volunteers within this radius will be notified of your emergency
              </p>
            </div>
          </div>
        </div>
        
        {/* Privacy */}
        <div>
          <h2 className="text-lg font-medium mb-3">Privacy</h2>
          <div className="bg-white rounded-lg border divide-y">
            <div className="flex items-center justify-between p-4">
              <div>
                <h3 className="font-medium">Share Contact Info</h3>
                <p className="text-sm text-gray-500">Allow volunteers to see your phone number</p>
              </div>
              <Switch
                checked={shareContactInfo}
                onCheckedChange={setShareContactInfo}
              />
            </div>
          </div>
        </div>
        
        {/* Appearance */}
        <div>
          <h2 className="text-lg font-medium mb-3">Appearance</h2>
          <div className="bg-white rounded-lg border divide-y">
            <div className="flex items-center justify-between p-4">
              <div>
                <h3 className="font-medium">Dark Mode</h3>
                <p className="text-sm text-gray-500">Use dark theme</p>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
          </div>
        </div>
        
        {/* About */}
        <div>
          <h2 className="text-lg font-medium mb-3">About</h2>
          <div className="bg-white rounded-lg border">
            <div className="p-4">
              <h3 className="font-medium mb-1">Helpin</h3>
              <p className="text-sm text-gray-500 mb-2">Version 1.0.0</p>
              <p className="text-sm text-gray-500">
                Emergency Peer-to-Peer Help Platform
              </p>
            </div>
          </div>
        </div>
        
        <div className="h-8"></div> {/* Bottom spacing */}
      </div>
    </div>
  );
};

export default Settings;
