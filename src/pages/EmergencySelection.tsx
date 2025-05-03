
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

// Define emergency types with their details
const emergencyTypes = [
  {
    id: 'accident',
    title: 'Road Accident',
    icon: '🚗',
    description: 'Car accident, motorcycle crash, or any road incident'
  },
  {
    id: 'blood',
    title: 'Blood Requirement',
    icon: '🩸',
    description: 'Urgent need for blood donation'
  },
  {
    id: 'unsafe',
    title: 'Personal Safety Threat',
    icon: '🚨',
    description: 'Feeling unsafe or threatened'
  },
  {
    id: 'fire',
    title: 'Fire Emergency',
    icon: '🔥',
    description: 'Fire in building, vehicle, or area'
  },
  {
    id: 'medical',
    title: 'Medical Emergency',
    icon: '💊',
    description: 'Medical crisis requiring immediate attention'
  },
  {
    id: 'crime',
    title: 'Crime Witness / Need Police',
    icon: '🚔',
    description: 'Witnessed a crime or need police assistance'
  },
  {
    id: 'electric',
    title: 'Electric Shock / Short Circuit',
    icon: '⚡',
    description: 'Electrical emergencies'
  },
  {
    id: 'vehicle',
    title: 'Vehicle Breakdown',
    icon: '🚙',
    description: 'Car or vehicle breakdown on road'
  },
  {
    id: 'disaster',
    title: 'Natural Disaster',
    icon: '🌊',
    description: 'Flood, earthquake, or other natural disaster'
  },
  {
    id: 'other',
    title: 'Other Emergency',
    icon: '✍️',
    description: 'Custom emergency not listed above'
  }
];

const EmergencySelection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleEmergencySelect = (type: string) => {
    navigate(`/emergency-request/${type}`);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="bg-primary text-white p-4 flex items-center">
        <button onClick={() => navigate('/home')} className="mr-3">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Select Emergency Type</h1>
      </div>
      
      {/* Content */}
      <div className="flex-grow p-4 overflow-y-auto">
        <p className="text-gray-500 mb-6">
          Please select the type of emergency to find appropriate help nearby
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          {emergencyTypes.map((emergency) => (
            <button 
              key={emergency.id}
              onClick={() => handleEmergencySelect(emergency.id)}
              className="flex flex-col items-center border rounded-lg p-4 transition-colors hover:bg-gray-50 active:bg-gray-100"
            >
              <span className="text-3xl mb-2">{emergency.icon}</span>
              <h3 className="font-medium text-center">{emergency.title}</h3>
              <p className="text-xs text-gray-500 text-center mt-1">
                {emergency.description}
              </p>
            </button>
          ))}
        </div>
      </div>
      
      {/* Footer Note */}
      <div className="bg-yellow-50 p-4 border-t border-yellow-100">
        <p className="text-sm text-yellow-700 text-center">
          <span className="font-bold">Important:</span> In critical emergencies, please also contact professional emergency services.
        </p>
      </div>
    </div>
  );
};

export default EmergencySelection;
