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
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
      {/* Header card */}
      <div className="bg-white/60 backdrop-blur-sm border border-[var(--cards)] rounded-2xl p-5 flex items-center gap-3">
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
  );
}
