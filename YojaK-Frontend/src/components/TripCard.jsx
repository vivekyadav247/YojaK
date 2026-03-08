import { Link } from "react-router-dom";
import {
  MapPin,
  Users,
  CalendarDays,
  UserPlus,
  Loader2,
  Check,
  Clock,
} from "lucide-react";

const statusColors = {
  planned: "bg-blue-100 text-blue-700",
  ongoing: "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-500",
};

export default function TripCard({
  trip,
  joinStatus,
  onJoinRequest,
  joinLoading,
}) {
  const fmt = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        })
      : "";

  const handleJoin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onJoinRequest) onJoinRequest(trip._id);
  };

  return (
    <Link
      to={`/trip/${trip._id}`}
      className="relative block bg-white/80 rounded-2xl shadow-sm border border-[var(--cards)]/40 hover:shadow-md transition-shadow p-3 sm:p-5"
    >
      {/* Mobile-only icon button — top-right corner */}
      {onJoinRequest && (
        <div className="absolute top-2.5 right-2.5 sm:hidden">
          {joinStatus === "accepted" ? (
            <span className="w-7 h-7 flex items-center justify-center rounded-full bg-green-50 text-green-600">
              <Check size={14} />
            </span>
          ) : joinStatus === "pending" ? (
            <span className="w-7 h-7 flex items-center justify-center rounded-full bg-amber-50 text-amber-600">
              <Clock size={14} />
            </span>
          ) : joinStatus === "member" ? (
            <span className="w-7 h-7 flex items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
              <Check size={14} />
            </span>
          ) : (
            <button
              onClick={handleJoin}
              disabled={joinLoading}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-[var(--primary)] text-white hover:opacity-90 disabled:opacity-50 cursor-pointer"
            >
              {joinLoading ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <UserPlus size={13} />
              )}
            </button>
          )}
        </div>
      )}

      <div className="flex items-start justify-between mb-1 sm:mb-2 pr-8 sm:pr-0">
        <h3 className="font-bold text-[var(--text)] text-sm sm:text-lg leading-snug line-clamp-1">
          {trip.title}
        </h3>
        <span
          className={`text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap ${statusColors[trip.status] ?? statusColors.planned}`}
        >
          {trip.status}
        </span>
      </div>

      <div className="flex items-center gap-1 text-xs sm:text-sm text-[var(--text-light)] mb-0.5 sm:mb-1">
        <MapPin size={12} className="shrink-0 sm:w-3.5 sm:h-3.5" />
        <span className="truncate">{trip.destinations?.join(", ")}</span>
      </div>

      <div className="flex items-center gap-1 text-xs sm:text-sm text-[var(--text-light)] mb-0.5 sm:mb-1">
        <CalendarDays size={12} className="shrink-0 sm:w-3.5 sm:h-3.5" />
        <span>
          {fmt(trip.startDate)} – {fmt(trip.endDate)}
        </span>
      </div>

      <div className="flex items-center gap-1 text-xs sm:text-sm text-[var(--text-light)]">
        <Users size={12} className="shrink-0 sm:w-3.5 sm:h-3.5" />
        <span>
          {trip.members?.length ?? 0} / {trip.limitofPeople}
        </span>
      </div>

      {/* Desktop join button — hidden on mobile */}
      {onJoinRequest && (
        <div className="hidden sm:block mt-3 pt-3 border-t border-[var(--cards)]">
          {joinStatus === "accepted" ? (
            <span className="flex items-center gap-1.5 text-xs font-medium text-green-600">
              <Check size={14} /> Joined
            </span>
          ) : joinStatus === "pending" ? (
            <span className="flex items-center gap-1.5 text-xs font-medium text-amber-600">
              <Clock size={14} /> Request Pending
            </span>
          ) : joinStatus === "member" ? (
            <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--primary)]">
              <Check size={14} /> Member
            </span>
          ) : (
            <button
              onClick={handleJoin}
              disabled={joinLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              {joinLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <UserPlus size={14} />
              )}
              Request to Join
            </button>
          )}
        </div>
      )}
    </Link>
  );
}
