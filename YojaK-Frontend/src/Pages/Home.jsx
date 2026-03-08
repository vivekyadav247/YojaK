import { useEffect, useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import api from "../lib/api";
import TripCard from "../components/TripCard";
import CreateTripModal from "../components/CreateTripModal";

export default function Home() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [profileComplete, setProfileComplete] = useState(true);
  const [joinMap, setJoinMap] = useState({}); // tripId -> "pending" | "accepted" | "member"
  const [joinLoadingId, setJoinLoadingId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get("/trips"),
      api.get("/profile"),
      api.get("/join-requests/my"),
    ])
      .then(([tripsRes, profileRes, jrRes]) => {
        const tripList = tripsRes.data.trips ?? tripsRes.data ?? [];
        setTrips(tripList);

        const u = profileRes.data.user ?? profileRes.data;
        setProfileComplete(u.isProfileComplete);
        setCurrentUserId(u._id);

        // Build join status map
        const map = {};
        // Mark trips where user is already a member
        tripList.forEach((t) => {
          if (
            t.members?.some(
              (m) =>
                (m.user?._id || m.user) === u._id ||
                (m.user?._id || m.user)?.toString?.() === u._id?.toString?.(),
            )
          ) {
            map[t._id] = "member";
          }
        });
        // Overlay join request statuses
        const requests = jrRes.data ?? [];
        requests.forEach((jr) => {
          const tid = jr.trip?._id || jr.trip;
          if (!map[tid]) map[tid] = jr.status; // pending or accepted
        });
        setJoinMap(map);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleJoinRequest = async (tripId) => {
    setJoinLoadingId(tripId);
    try {
      await api.post("/join-requests/send", { tripId });
      setJoinMap((prev) => ({ ...prev, [tripId]: "pending" }));
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to send request";
      alert(msg);
    } finally {
      setJoinLoadingId(null);
    }
  };

  const handleCreated = (trip) => {
    setTrips((prev) => [trip, ...prev]);
    setJoinMap((prev) => ({ ...prev, [trip._id]: "member" }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[var(--primary)]" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--text)]">Public Trips</h1>
        <button
          onClick={() => setShowModal(true)}
          disabled={!profileComplete}
          title={
            !profileComplete
              ? "Complete your profile first"
              : "Create a new trip"
          }
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent)] text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          <Plus size={18} />
          Create Trip
        </button>
      </div>

      {!profileComplete && (
        <p className="mb-4 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
          Complete your profile to create trips.
        </p>
      )}

      {trips.length === 0 ? (
        <p className="text-center text-[var(--text-light)] mt-20">
          No public trips yet. Be the first to create one!
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((t) => (
            <TripCard
              key={t._id}
              trip={t}
              joinStatus={joinMap[t._id]}
              onJoinRequest={profileComplete ? handleJoinRequest : undefined}
              joinLoading={joinLoadingId === t._id}
            />
          ))}
        </div>
      )}

      {showModal && (
        <CreateTripModal
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}
