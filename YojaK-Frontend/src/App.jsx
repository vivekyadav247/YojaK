import { Routes, Route } from "react-router-dom";
import { useAuth, ClerkLoaded } from "@clerk/react";
import { Analytics } from "@vercel/analytics/react";
import AuthProvider from "./lib/AuthProvider";
import Landing from "./Pages/Landing";
import Home from "./Pages/Home";
import MyTrips from "./Pages/MyTrips";
import Invites from "./Pages/Invites";
import Profile from "./Pages/Profile";
import TripDetail from "./Pages/TripDetail";
import Navbar from "./components/Navbar";

function AuthGate() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <Routes>
        <Route path="*" element={<Landing />} />
      </Routes>
    );
  }

  return (
    <AuthProvider>
      <Navbar />
      <div className="flex-1 order-2">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/my-trips" element={<MyTrips />} />
          <Route path="/invites" element={<Invites />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/trip/:tripId" element={<TripDetail />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <ClerkLoaded>
        <AuthGate />
      </ClerkLoaded>
      <Analytics />
    </div>
  );
}
