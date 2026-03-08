import { useEffect, useState } from "react";
import { Loader2, Map } from "lucide-react";
import api from "../lib/api";
import TripCard from "../components/TripCard";

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/trips/trips")
      .then(({ data }) => setTrips(data.trips ?? data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[var(--primary)]" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 md:py-6">
      {/* Mobile sticky header */}
      <div className="sticky top-0 z-20 -mx-4 px-4 pt-2 pb-3 bg-[var(--background)] md:hidden">
        <div className="bg-white/60 backdrop-blur-xl border border-[var(--cards)] rounded-2xl px-4 py-3 flex items-center gap-2.5 shadow-sm shadow-black/5">
          <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/15 flex items-center justify-center">
            <Map size={16} className="text-[var(--primary)]" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[var(--text)] leading-tight">
              My Trips
            </h1>
            <p className="text-[10px] text-[var(--text-light)]">
              {trips.length} {trips.length === 1 ? "trip" : "trips"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[var(--secondary)]/10 border border-[var(--cards)]/50 rounded-3xl p-4 md:p-6 space-y-4">
        {/* Desktop header card */}
        <div className="hidden md:flex bg-white/60 backdrop-blur-xl border border-[var(--cards)] rounded-2xl p-5 items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/15 flex items-center justify-center">
            <Map size={20} className="text-[var(--primary)]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--text)]">My Trips</h1>
            <p className="text-xs text-[var(--text-light)]">
              {trips.length} {trips.length === 1 ? "trip" : "trips"}
            </p>
          </div>
        </div>

        {trips.length === 0 ? (
          <p className="text-center text-[var(--text-light)] mt-20">
            You haven't joined or created any trips yet.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((t) => (
              <TripCard key={t._id} trip={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
