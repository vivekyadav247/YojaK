import { useEffect, useState } from "react";
import { Plus, Loader2, Globe } from "lucide-react";
import api from "../lib/api";
import TripCard from "../components/TripCard";
import CreateTripModal from "../components/CreateTripModal";

export default function Home() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [joinMap, setJoinMap] = useState({});
  const [joinLoadingId, setJoinLoadingId] = useState(null);

  useEffect(() => {
    api
      .get("/trips")
      .then(({ data }) => {
        setTrips(data.trips ?? data ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading || profileLoaded) return;
    fetchProfileAndJoinData(trips);
  }, [loading, trips, profileLoaded]);

  const fetchProfileAndJoinData = async (tripList) => {
    try {
      const profileRes = await api.get("/profile");
      const u = profileRes.data.user ?? profileRes.data;
      const active = Boolean(u.isProfileComplete);
      setIsActive(active);

      const map = {};
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

      // Pending join statuses are useful only for active profiles.
      if (active) {
        const jrRes = await api.get("/join-requests/my");
        const requests = jrRes.data ?? [];
        requests.forEach((jr) => {
          const tid = jr.trip?._id || jr.trip;
          if (!map[tid]) map[tid] = jr.status;
        });
      }
      setJoinMap(map);
    } catch {
      setIsActive(false);
    } finally {
      setProfileLoaded(true);
    }
  };

  const handleCreateClick = () => {
    if (!profileLoaded || !isActive) return;
    setShowModal(true);
  };

  const handleJoinRequest = async (tripId) => {
    if (!profileLoaded || !isActive) {
      alert("Complete your profile to join public trips.");
      return;
    }
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
    <div className="max-w-6xl mx-auto px-4 py-4 md:py-6">
      {/* Mobile sticky header */}
      <div className="sticky top-0 z-20 -mx-4 px-4 pt-2 pb-3 bg-[var(--background)] md:hidden">
        <div className="bg-white/60 backdrop-blur-xl border border-[var(--cards)] rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm shadow-black/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/15 flex items-center justify-center">
              <Globe size={16} className="text-[var(--primary)]" />
            </div>
            <div>
              <h1 className="text-base font-bold text-[var(--text)] leading-tight">
                Public Trips
              </h1>
              <p className="text-[10px] text-[var(--text-light)]">
                {trips.length} {trips.length === 1 ? "trip" : "trips"}
              </p>
            </div>
          </div>
          <button
            onClick={handleCreateClick}
            disabled={!profileLoaded || !isActive}
            className="p-2.5 rounded-xl bg-[var(--accent)] text-white hover:opacity-90 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      <div className="bg-[var(--secondary)]/10 border border-[var(--cards)]/50 rounded-3xl p-4 md:p-6 space-y-4">
        {/* Desktop header card */}
        <div className="hidden md:flex bg-white/60 backdrop-blur-xl border border-[var(--cards)] rounded-2xl p-5 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/15 flex items-center justify-center">
              <Globe size={20} className="text-[var(--primary)]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--text)]">
                Public Trips
              </h1>
              <p className="text-xs text-[var(--text-light)]">
                {trips.length} {trips.length === 1 ? "trip" : "trips"} available
              </p>
            </div>
          </div>
          <button
            onClick={handleCreateClick}
            disabled={!profileLoaded || !isActive}
            title={
              !isActive
                ? "Complete your profile first"
                : "Create a new trip"
            }
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent)] text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            <Plus size={18} />
            Create Trip
          </button>
        </div>

        {profileLoaded && !isActive && (
          <p className="mb-4 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
            Complete your profile to create trips and join public trips.
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
                onJoinRequest={handleJoinRequest}
                joinDisabled={!profileLoaded || !isActive}
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
    </div>
  );
}
