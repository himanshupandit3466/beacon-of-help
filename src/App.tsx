
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import SplashScreen from "./pages/SplashScreen";
import TermsConditions from "./pages/TermsConditions";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyOTP from "./pages/VerifyOTP";
import DigiLockerVerification from "./pages/DigiLockerVerification";
import Home from "./pages/Home";
import EmergencySelection from "./pages/EmergencySelection";
import EmergencyRequest from "./pages/EmergencyRequest";
import RequestTracking from "./pages/RequestTracking";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import VolunteerDashboard from "./pages/VolunteerDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/terms" element={<TermsConditions />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/digilocker-verification" element={<DigiLockerVerification />} />
            <Route path="/home" element={<Home />} />
            <Route path="/emergency-selection" element={<EmergencySelection />} />
            <Route path="/emergency-request/:type" element={<EmergencyRequest />} />
            <Route path="/request-tracking/:id" element={<RequestTracking />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/volunteer" element={<VolunteerDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
