import { Routes, Route } from "react-router-dom";
import { useAuth, ClerkLoaded } from "@clerk/react";
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
      <div className="flex-1 order-2 relative">
        {/* Watermark logo */}
        <div
          className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <img
            src="/watermark.svg"
            alt=""
            className="w-[420px] h-[420px] opacity-60 select-none"
          />
        </div>
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/my-trips" element={<MyTrips />} />
            <Route path="/invites" element={<Invites />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/trip/:tripId" element={<TripDetail />} />
          </Routes>
        </div>
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
    </div>
  );
}
