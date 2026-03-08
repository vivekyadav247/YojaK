import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
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
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[var(--text)] mb-6">
        My Trips
      </h1>

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
