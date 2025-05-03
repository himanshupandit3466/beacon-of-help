
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Trash2, Plus } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { EmergencyContact } from '@/types/request';
import { RouteGuard } from '@/components/RouteGuard';

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [searchRadius, setSearchRadius] = useState([5]); // km
  const [shareContactInfo, setShareContactInfo] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    phone_number: '',
    relationship: ''
  });
  
  // Fetch emergency contacts
  useEffect(() => {
    if (!user) return;
    
    const fetchContacts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('emergency_contacts')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        setEmergencyContacts(data as EmergencyContact[]);
      } catch (error: any) {
        console.error('Error fetching emergency contacts:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load emergency contacts",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchContacts();
  }, [user, toast]);
  
  const handleSave = () => {
    // In a real app, these settings would be saved to a database
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated"
    });
  };
  
  const handleAddContact = async () => {
    if (!user) return;
    
    if (!newContact.name || !newContact.phone_number) {
      toast({
        title: "Missing Information",
        description: "Please provide a name and phone number",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .insert({
          user_id: user.id,
          name: newContact.name,
          phone_number: newContact.phone_number,
          relationship: newContact.relationship || null
        })
        .select();
        
      if (error) throw error;
      
      setEmergencyContacts([...emergencyContacts, data[0] as EmergencyContact]);
      setNewContact({ name: '', phone_number: '', relationship: '' });
      setShowAddContact(false);
      
      toast({
        title: "Contact Added",
        description: "Emergency contact has been added successfully"
      });
    } catch (error: any) {
      console.error('Error adding emergency contact:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add emergency contact",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from('emergency_contacts')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setEmergencyContacts(emergencyContacts.filter(contact => contact.id !== id));
      
      toast({
        title: "Contact Removed",
        description: "Emergency contact has been removed"
      });
    } catch (error: any) {
      console.error('Error deleting emergency contact:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove emergency contact",
        variant: "destructive"
      });
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
          <h1 className="text-xl font-bold">Settings</h1>
        </div>
        
        {/* Settings sections */}
        <div className="flex-grow p-6 space-y-6 overflow-y-auto">
          {/* Emergency Contacts */}
          <div>
            <h2 className="text-lg font-medium mb-3">Emergency Contacts</h2>
            <div className="bg-white rounded-lg border mb-3">
              {loading ? (
                <div className="p-4 flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : emergencyContacts.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <p>No emergency contacts added yet</p>
                </div>
              ) : (
                <div className="divide-y">
                  {emergencyContacts.map((contact) => (
                    <div key={contact.id} className="p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{contact.name}</h3>
                        <p className="text-sm text-gray-500">{contact.phone_number}</p>
                        {contact.relationship && (
                          <span className="text-xs text-gray-500">{contact.relationship}</span>
                        )}
                      </div>
                      <button 
                        onClick={() => handleDeleteContact(contact.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {showAddContact ? (
              <div className="bg-white rounded-lg border p-4 mb-3">
                <h3 className="font-medium mb-3">Add Emergency Contact</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-700">Name</label>
                    <Input 
                      value={newContact.name}
                      onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">Phone Number</label>
                    <Input 
                      value={newContact.phone_number}
                      onChange={(e) => setNewContact({...newContact, phone_number: e.target.value})}
                      placeholder="Phone number"
                      type="tel"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">Relationship (Optional)</label>
                    <Input 
                      value={newContact.relationship}
                      onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
                      placeholder="e.g. Parent, Spouse, Friend"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setShowAddContact(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={handleAddContact}
                    >
                      Save Contact
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowAddContact(true)}
              >
                <Plus size={18} className="mr-2" />
                Add Emergency Contact
              </Button>
            )}
            
            <p className="text-xs text-gray-500 mt-2">
              These contacts will be notified with your location when you request emergency help
            </p>
          </div>
          
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
    </RouteGuard>
  );
};

export default Settings;
