import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Loader2,
  Plus,
  Trash2,
  GripVertical,
  Check,
  X,
  MessageSquare,
  Upload,
  FileText,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Send,
  Users,
  MapPin,
  CalendarDays,
  CheckSquare,
  Wallet,
  FolderOpen,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import api from "../lib/api";
import ConfirmModal from "../components/ConfirmModal";

const API_BASE = "http://localhost:3000";

const getApiErrorMessage = (err, fallback) =>
  err?.response?.data?.message || err?.response?.data?.error || fallback;

const showApiError = (err, fallback = "Action failed") => {
  window.alert(getApiErrorMessage(err, fallback));
};

export default function TripDetail() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("itinerary");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [confirmDeleteTrip, setConfirmDeleteTrip] = useState(false);
  const [confirmLeaveTrip, setConfirmLeaveTrip] = useState(false);
  const [leavingTrip, setLeavingTrip] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const reload = useCallback(() => {
    api
      .get(`/trips/${tripId}`)
      .then(({ data }) => setTrip(data.trip ?? data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tripId]);

  useEffect(reload, [reload]);

  useEffect(() => {
    api
      .get("/profile")
      .then(({ data }) => setCurrentUserId((data.user ?? data)._id))
      .catch(() => {});
  }, []);

  const amOwner =
    trip?.members?.some(
      (m) =>
        m.role === "owner" &&
        currentUserId &&
        (m.user?._id || m.user)?.toString() === currentUserId,
    ) ?? false;
  const myMembership = trip?.members?.find(
    (m) => currentUserId && (m.user?._id || m.user)?.toString() === currentUserId,
  );
  const canLeaveTrip = Boolean(myMembership && myMembership.role !== "owner");

  const handleDeleteTrip = async () => {
    setDeleting(true);
    try {
      await api.delete(`/trips/${tripId}`);
      navigate("/my-trips");
    } catch {
      setDeleting(false);
      setConfirmDeleteTrip(false);
    }
  };

  const handleLeaveTrip = async () => {
    setLeavingTrip(true);
    try {
      await api.post(`/trips/${tripId}/leave`);
      navigate("/my-trips");
    } catch (err) {
      showApiError(err, "Failed to leave trip");
      setLeavingTrip(false);
      setConfirmLeaveTrip(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[var(--primary)]" size={32} />
      </div>
    );

  if (!trip)
    return (
      <p className="text-center mt-20 text-[var(--text-light)]">
        Trip not found.
      </p>
    );

  const tabs = [
    { key: "itinerary", label: "Itinerary", icon: CalendarDays },
    { key: "checklist", label: "Checklist", icon: CheckSquare },
    { key: "budget", label: "Budget", icon: Wallet },
    { key: "documents", label: "Documents", icon: FolderOpen },
    { key: "members", label: "Members", icon: Users },
  ];

  const statusColors = {
    planned: "bg-blue-100 text-blue-700",
    ongoing: "bg-green-100 text-green-700",
    completed: "bg-gray-100 text-gray-500",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 md:py-6">
      {/* Mobile sticky header */}
      <div className="sticky top-0 z-20 -mx-4 px-4 pt-2 pb-3 bg-[var(--background)] md:hidden">
        <div className="bg-white/60 backdrop-blur-xl border border-[var(--cards)] rounded-2xl px-4 py-3 shadow-sm shadow-black/5 space-y-2">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-xs text-[var(--text-light)] hover:text-[var(--text)] cursor-pointer"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <div className="flex items-center gap-2">
              <span
                className={`text-[9px] font-semibold px-2 py-0.5 rounded-full capitalize whitespace-nowrap ${
                  statusColors[trip.status] ?? statusColors.planned
                }`}
              >
                {trip.status}
              </span>
              {canLeaveTrip && (
                <button
                  type="button"
                  onClick={() => setConfirmLeaveTrip(true)}
                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 cursor-pointer"
                >
                  Leave
                </button>
              )}
              {amOwner && (
                <button
                  onClick={() => setConfirmDeleteTrip(true)}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
          <div>
            <h1 className="text-base font-bold text-[var(--text)] leading-tight line-clamp-1">
              {trip.title}
            </h1>
            <p className="text-[11px] text-[var(--text-light)] line-clamp-1">
              {trip.destinations?.join(", ")}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[var(--secondary)]/10 border border-[var(--cards)]/50 rounded-3xl p-4 md:p-6 space-y-4">
        {/* Desktop header card */}
        <div className="hidden md:block bg-white/60 backdrop-blur-xl border border-[var(--cards)] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-sm text-[var(--text-light)] hover:text-[var(--text)] cursor-pointer"
            >
              <ArrowLeft size={16} /> Back
            </button>
            {amOwner && (
              <button
                onClick={() => setConfirmDeleteTrip(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 cursor-pointer transition-colors"
              >
                <Trash2 size={14} /> Delete Trip
              </button>
            )}
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-[var(--text)]">
                {trip.title}
              </h1>
              <p className="text-sm text-[var(--text-light)] mt-1">
                {trip.destinations?.join(", ")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-semibold px-2.5 py-1 rounded-full capitalize whitespace-nowrap ${
                  statusColors[trip.status] ?? statusColors.planned
                }`}
              >
                {trip.status}
              </span>
              {canLeaveTrip && (
                <button
                  type="button"
                  onClick={() => setConfirmLeaveTrip(true)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 cursor-pointer"
                >
                  Leave Trip
                </button>
              )}
            </div>
          </div>
        </div>

        {confirmDeleteTrip && (
          <ConfirmModal
            title="Delete Trip?"
            message={`Are you sure you want to delete "${trip.title}"? This will permanently remove all itineraries, documents, and data. This cannot be undone.`}
            onConfirm={handleDeleteTrip}
            onCancel={() => setConfirmDeleteTrip(false)}
          />
        )}
        {confirmLeaveTrip && (
          <ConfirmModal
            title="Leave Trip?"
            message="You will be removed from this trip."
            confirmText={leavingTrip ? "Leaving..." : "Leave"}
            onConfirm={handleLeaveTrip}
            onCancel={() => setConfirmLeaveTrip(false)}
          />
        )}

        {/* Tabs — pill style */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all whitespace-nowrap shrink-0 ${
                tab === key
                  ? "bg-[var(--primary)] text-white shadow-sm"
                  : "bg-white/60 text-[var(--text-light)] hover:bg-[var(--cards)]/40 hover:text-[var(--text)]"
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        <div>
          {tab === "itinerary" && <ItineraryTab tripId={tripId} trip={trip} />}
          {tab === "checklist" && (
            <ChecklistTab
              tripId={tripId}
              checklist={trip.checklist}
              onUpdate={reload}
            />
          )}
          {tab === "budget" && <BudgetTab tripId={tripId} trip={trip} />}
          {tab === "documents" && <DocumentsTab tripId={tripId} />}
          {tab === "members" && (
            <MembersTab trip={trip} tripId={tripId} onUpdate={reload} />
          )}
        </div>
      </div>
    </div>
  );
}

function ItineraryTab({ tripId, trip }) {
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const maxDays = (() => {
    if (!trip?.startDate || !trip?.endDate) return Infinity;
    const s = new Date(trip.startDate);
    const e = new Date(trip.endDate);
    return Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
  })();
  const canAddDay = days.length < maxDays;

  const fetchDays = useCallback(() => {
    api
      .get(`/day-itineraries/trip/${tripId}`)
      .then(({ data }) =>
        setDays(
          (Array.isArray(data) ? data : []).sort(
            (a, b) => a.dayNumber - b.dayNumber,
          ),
        ),
      )
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tripId]);

  useEffect(fetchDays, [fetchDays]);

  const addDay = async () => {
    setCreating(true);
    try {
      const nextNum = days.length
        ? Math.max(...days.map((d) => d.dayNumber)) + 1
        : 1;
      await api.post(`/day-itineraries/trip/${tripId}`, { dayNumber: nextNum });
      fetchDays();
    } catch (err) {
      showApiError(err, "Failed to add day");
    }
    setCreating(false);
  };

  const deleteDay = async (dayId) => {
    try {
      await api.delete(`/day-itineraries/trip/${tripId}`, {
        data: { dayItineraryId: dayId },
      });
      fetchDays();
    } catch (err) {
      showApiError(err, "Failed to delete day");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4">
      {days.map((day) => (
        <DayCard
          key={day._id}
          day={day}
          tripId={tripId}
          trip={trip}
          onRefresh={fetchDays}
          onDelete={() =>
            setConfirmDelete({
              title: `Delete Day ${day.dayNumber}?`,
              message:
                "All activities and comments in this day will be removed.",
              action: () => {
                deleteDay(day._id);
                setConfirmDelete(null);
              },
            })
          }
        />
      ))}
      <button
        onClick={addDay}
        disabled={creating || !canAddDay}
        className="flex items-center gap-2 text-sm font-medium text-[var(--primary)] hover:underline cursor-pointer disabled:opacity-50 disabled:no-underline"
      >
        <Plus size={16} />
        {creating
          ? "Adding…"
          : !canAddDay
            ? `All ${maxDays} days added`
            : "Add Day"}
      </button>

      {confirmDelete && (
        <ConfirmModal
          title={confirmDelete.title}
          message={confirmDelete.message}
          onConfirm={confirmDelete.action}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

function DayCard({ day, tripId, trip, onRefresh, onDelete }) {
  const [open, setOpen] = useState(true);
  const [actForm, setActForm] = useState({ time: "", description: "" });
  const [adding, setAdding] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const addActivity = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await api.post(
        `/day-itineraries/trip/${tripId}/dayItinerary/${day._id}/activity`,
        { activity: actForm },
      );
      setActForm({ time: "", description: "" });
      onRefresh();
    } catch (err) {
      showApiError(err, "Failed to add activity");
    }
    setAdding(false);
  };

  const removeActivity = async (activityId) => {
    try {
      await api.delete(
        `/day-itineraries/trip/${tripId}/dayItinerary/${day._id}/activity`,
        { data: { activityId } },
      );
      onRefresh();
    } catch (err) {
      showApiError(err, "Failed to remove activity");
    }
  };

  const toggleComplete = async (act) => {
    try {
      await api.put(
        `/day-itineraries/trip/${tripId}/dayItinerary/${day._id}/activity`,
        { activityId: act._id, isCompleted: !act.isCompleted },
      );
      onRefresh();
    } catch (err) {
      showApiError(err, "Failed to update activity");
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = day.activities.findIndex((a) => a._id === active.id);
    const newIdx = day.activities.findIndex((a) => a._id === over.id);
    const reordered = arrayMove(day.activities, oldIdx, newIdx);
    try {
      await api.put(
        `/day-itineraries/trip/${tripId}/dayItinerary/${day._id}/activities/reorder`,
        { activityOrder: reordered.map((a) => a._id) },
      );
      onRefresh();
    } catch (err) {
      showApiError(err, "Failed to reorder activities");
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-[var(--cards)]/40 overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-3 bg-[var(--secondary)]/25 cursor-pointer"
        onClick={() => setOpen((p) => !p)}
      >
        <span className="font-semibold text-[var(--text)]">
          Day {day.dayNumber}
          {trip?.startDate && (
            <span className="ml-2 text-xs font-normal text-[var(--text-light)]">
              {new Date(
                new Date(trip.startDate).getTime() +
                  (day.dayNumber - 1) * 86400000,
              ).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </span>
          )}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 rounded hover:bg-red-50 text-red-500 cursor-pointer"
          >
            <Trash2 size={14} />
          </button>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {open && (
        <div className="p-4 space-y-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={day.activities.map((a) => a._id)}
              strategy={verticalListSortingStrategy}
            >
              {day.activities.map((act, idx) => (
                <SortableActivity
                  key={act._id}
                  act={act}
                  index={idx}
                  tripId={tripId}
                  dayId={day._id}
                  onToggle={() => toggleComplete(act)}
                  onRemove={() => removeActivity(act._id)}
                  onRefresh={onRefresh}
                />
              ))}
            </SortableContext>
          </DndContext>

          {day.activities.length === 0 && (
            <p className="text-xs text-[var(--text-light)] text-center py-2">
              No activities yet
            </p>
          )}

          <form onSubmit={addActivity} className="flex gap-2">
            <div className="relative w-28">
              <button
                type="button"
                onClick={() => setShowTimePicker((p) => !p)}
                className="w-full px-2 py-1.5 text-sm rounded-lg border border-[var(--cards)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-white/60 text-left cursor-pointer"
              >
                {actForm.time || "Time"}
              </button>
              {showTimePicker && (
                <div className="absolute bottom-full z-20 mb-1 w-full max-h-44 overflow-y-auto rounded-lg border border-[var(--cards)] bg-white shadow-lg">
                  {Array.from({ length: 48 }, (_, i) => {
                    const h = Math.floor(i / 2);
                    const m = i % 2 === 0 ? "00" : "30";
                    const ampm = h < 12 ? "AM" : "PM";
                    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
                    const label = `${h12}:${m} ${ampm}`;
                    return (
                      <div
                        key={i}
                        onClick={() => {
                          setActForm((p) => ({ ...p, time: label }));
                          setShowTimePicker(false);
                        }}
                        className={`px-2 py-1.5 text-sm cursor-pointer hover:bg-[var(--primary)]/10 ${actForm.time === label ? "bg-[var(--primary)]/15 font-medium" : ""}`}
                      >
                        {label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <input
              placeholder="Activity description"
              value={actForm.description}
              onChange={(e) =>
                setActForm((p) => ({ ...p, description: e.target.value }))
              }
              required
              className="flex-1 px-2 py-1.5 text-sm rounded-lg border border-[var(--cards)] bg-white/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
            <button
              type="submit"
              disabled={adding}
              className="px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 cursor-pointer"
            >
              <Plus size={16} />
            </button>
          </form>

          {/* Day-level comments */}
          <DayComments tripId={tripId} day={day} onRefresh={onRefresh} />
        </div>
      )}
    </div>
  );
}

function SortableActivity({
  act,
  index,
  tripId,
  dayId,
  onToggle,
  onRemove,
  onRefresh,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: act._id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const [showComments, setShowComments] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex flex-col rounded-xl p-3 ${index % 2 === 0 ? "bg-[var(--accent)]/10 border border-[var(--accent)]/20" : "bg-[var(--primary)]/10 border border-[var(--primary)]/20"}`}
    >
      <div className="flex items-center gap-2">
        <span
          {...attributes}
          {...listeners}
          className="cursor-grab text-[var(--text-light)]"
        >
          <GripVertical size={16} />
        </span>
        <button onClick={onToggle} className="cursor-pointer shrink-0">
          {act.isCompleted ? (
            <Check size={18} className="text-green-500" />
          ) : (
            <div className="w-[18px] h-[18px] rounded border border-[var(--cards)]" />
          )}
        </button>
        <span
          className={`flex-1 text-sm ${act.isCompleted ? "line-through text-[var(--text-light)]/60" : "text-[var(--text)]"}`}
        >
          {act.time && (
            <span className="text-[var(--primary)] font-medium mr-2">
              {act.time}
            </span>
          )}
          {act.description}
        </span>
        <button
          onClick={() => setShowComments((p) => !p)}
          className="p-1 rounded hover:bg-white cursor-pointer text-[var(--text-light)]"
          title="Comments"
        >
          <MessageSquare size={14} />
          {act.comments?.length > 0 && (
            <span className="text-[10px] ml-0.5">{act.comments.length}</span>
          )}
        </button>
        <button
          onClick={() => setConfirmDelete(true)}
          className="p-1 rounded hover:bg-red-50 text-red-400 cursor-pointer"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {showComments && (
        <ActivityComments
          tripId={tripId}
          dayId={dayId}
          activity={act}
          onRefresh={onRefresh}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Delete Activity?"
          message={`Remove "${act.description}"? This cannot be undone.`}
          onConfirm={() => {
            onRemove();
            setConfirmDelete(false);
          }}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  );
}

function ActivityComments({ tripId, dayId, activity, onRefresh }) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const addComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      await api.post(
        `/day-itineraries/trip/${tripId}/dayItinerary/${dayId}/activity/comment`,
        { activityId: activity._id, text },
      );
      setText("");
      onRefresh();
    } catch (err) {
      showApiError(err, "Failed to add comment");
    }
    setSending(false);
  };

  const removeComment = async (commentId) => {
    try {
      await api.delete(
        `/day-itineraries/trip/${tripId}/dayItinerary/${dayId}/activity/comment`,
        { data: { activityId: activity._id, commentId } },
      );
      onRefresh();
    } catch (err) {
      showApiError(err, "Failed to remove comment");
    }
  };

  return (
    <div className="mt-2 ml-8 space-y-1">
      {activity.comments?.map((c) => (
        <div
          key={c._id}
          className="flex items-start gap-2 text-xs text-[var(--text-light)]"
        >
          <span className="flex-1">{c.text}</span>
          <button
            onClick={() => removeComment(c._id)}
            className="shrink-0 text-red-400 hover:text-red-600 cursor-pointer"
          >
            <X size={12} />
          </button>
        </div>
      ))}
      <form onSubmit={addComment} className="flex gap-1">
        <input
          placeholder="Add comment…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 px-2 py-1 text-xs rounded border border-[var(--cards)] bg-white/60 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
        />
        <button
          type="submit"
          disabled={sending}
          className="p-1 rounded bg-[var(--accent)] text-white cursor-pointer disabled:opacity-50"
        >
          <Send size={12} />
        </button>
      </form>
    </div>
  );
}

function DayComments({ tripId, day, onRefresh }) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [show, setShow] = useState(false);

  const addComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      await api.post(
        `/day-itineraries/trip/${tripId}/dayItinerary/${day._id}/comment`,
        { text },
      );
      setText("");
      onRefresh();
    } catch (err) {
      showApiError(err, "Failed to add comment");
    }
    setSending(false);
  };

  const removeComment = async (commentId) => {
    try {
      await api.delete(
        `/day-itineraries/trip/${tripId}/dayItinerary/${day._id}/comment`,
        { data: { commentId } },
      );
      onRefresh();
    } catch (err) {
      showApiError(err, "Failed to remove comment");
    }
  };

  return (
    <div className="border-t border-[var(--cards)] pt-3 mt-2">
      <button
        onClick={() => setShow((p) => !p)}
        className="text-xs font-medium text-[var(--text-light)] flex items-center gap-1 cursor-pointer"
      >
        <MessageSquare size={13} /> Day comments ({day.comments?.length || 0})
      </button>
      {show && (
        <div className="mt-2 space-y-1">
          {day.comments?.map((c) => (
            <div
              key={c._id}
              className="flex items-start gap-2 text-xs text-[var(--text-light)]"
            >
              <span className="flex-1">{c.text}</span>
              <button
                onClick={() => removeComment(c._id)}
                className="shrink-0 text-red-400 hover:text-red-600 cursor-pointer"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <form onSubmit={addComment} className="flex gap-1">
            <input
              placeholder="Add comment…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 px-2 py-1 text-xs rounded border border-[var(--cards)] bg-white/60 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            />
            <button
              type="submit"
              disabled={sending}
              className="p-1 rounded bg-[var(--accent)] text-white cursor-pointer disabled:opacity-50"
            >
              <Send size={12} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function ChecklistTab({ tripId, checklist, onUpdate }) {
  const items = checklist ? Object.entries(checklist) : [];
  const [newItem, setNewItem] = useState("");
  const [adding, setAdding] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const addItem = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    setAdding(true);
    try {
      await api.post(`/trips/${tripId}/checklist`, {
        item: newItem,
        value: false,
      });
      setNewItem("");
      onUpdate();
    } catch (err) {
      showApiError(err, "Failed to add checklist item");
    }
    setAdding(false);
  };

  const toggleItem = async (key, currentVal) => {
    try {
      await api.put(`/trips/${tripId}/checklist/${encodeURIComponent(key)}`, {
        value: !currentVal,
      });
      onUpdate();
    } catch (err) {
      showApiError(err, "Failed to update checklist item");
    }
  };

  const removeItem = async (key) => {
    try {
      await api.delete(`/trips/${tripId}/checklist/${encodeURIComponent(key)}`);
      onUpdate();
    } catch (err) {
      showApiError(err, "Failed to remove checklist item");
    }
  };

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="text-sm text-[var(--text-light)] text-center py-6">
          No checklist items yet.
        </p>
      )}
      {items.map(([key, val], idx) => (
        <div
          key={key}
          className={`flex items-center gap-3 backdrop-blur-sm p-3 rounded-xl border ${idx % 2 === 0 ? "bg-[var(--accent)]/10 border-[var(--accent)]/20" : "bg-[var(--primary)]/10 border-[var(--primary)]/20"}`}
        >
          <button
            onClick={() => toggleItem(key, val)}
            className="cursor-pointer shrink-0"
          >
            {val ? (
              <Check size={18} className="text-green-500" />
            ) : (
              <div className="w-[18px] h-[18px] rounded border border-[var(--cards)]" />
            )}
          </button>
          <span
            className={`flex-1 text-sm ${val ? "line-through text-[var(--text-light)]/60" : "text-[var(--text)]"}`}
          >
            {key}
          </span>
          <button
            onClick={() =>
              setConfirmDelete({
                title: "Remove Item?",
                message: `Remove "${key}" from checklist?`,
                action: () => {
                  removeItem(key);
                  setConfirmDelete(null);
                },
              })
            }
            className="text-red-400 hover:text-red-600 cursor-pointer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <form onSubmit={addItem} className="flex gap-2">
        <input
          placeholder="New checklist item…"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          required
          className="flex-1 px-3 py-2 rounded-lg border border-[var(--cards)] text-sm bg-white/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
        <button
          type="submit"
          disabled={adding}
          className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 cursor-pointer"
        >
          Add
        </button>
      </form>

      {confirmDelete && (
        <ConfirmModal
          title={confirmDelete.title}
          message={confirmDelete.message}
          onConfirm={confirmDelete.action}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

function BudgetTab({ tripId, trip }) {
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expForm, setExpForm] = useState({ description: "", amount: "" });

  const fetchBudget = useCallback(() => {
    api
      .get(`/budget-trackers/trip/${tripId}`)
      .then(({ data }) => setBudget(data.budgetTracker ?? data))
      .catch(() => setBudget(null))
      .finally(() => setLoading(false));
  }, [tripId]);

  useEffect(fetchBudget, [fetchBudget]);

  const addExpense = async (e) => {
    e.preventDefault();
    try {
      if (!budget) {
        await api.post(`/budget-trackers/trip/${tripId}`, {});
      }
      await api.put(`/budget-trackers/trip/${tripId}`, {
        expense: {
          description: expForm.description,
          amount: Number(expForm.amount),
        },
      });
      setExpForm({ description: "", amount: "" });
      fetchBudget();
    } catch (err) {
      showApiError(err, "Failed to add expense");
    }
  };

  if (loading) return <Spinner />;

  const totalSpent = (budget?.expenses ?? []).reduce(
    (s, e) => s + (e.amount || 0),
    0,
  );
  const memberCount = trip?.members?.length || 1;
  const perPersonSpend = totalSpent / memberCount;

  return (
    <div className="space-y-4">
      {totalSpent > 0 && (
        <div className="flex gap-3">
          <StatCard
            label="Total Spent"
            value={`₹${totalSpent}`}
            variant="spent"
          />
          <StatCard
            label="Per Person"
            value={`₹${perPersonSpend.toFixed(2)}`}
            variant="remaining"
          />
        </div>
      )}

      <div className="space-y-2">
        {(budget?.expenses ?? []).map((ex, i) => (
          <div
            key={i}
            className={`flex items-center justify-between p-3 rounded-xl border text-sm ${
              i % 2 === 0
                ? "bg-[var(--accent)]/10 border-[var(--accent)]/20"
                : "bg-[var(--primary)]/10 border-[var(--primary)]/20"
            }`}
          >
            <span className="font-semibold text-[var(--text)]">
              ₹{ex.amount}
            </span>
            <span className="text-[var(--text-light)]">{ex.description}</span>
          </div>
        ))}
      </div>

      <form onSubmit={addExpense} className="flex gap-2">
        <input
          placeholder="Description"
          value={expForm.description}
          onChange={(e) =>
            setExpForm((p) => ({ ...p, description: e.target.value }))
          }
          required
          className="flex-1 px-3 py-2 text-sm rounded-lg border border-[var(--cards)] bg-white/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
        <input
          placeholder="₹ Amount"
          type="number"
          min={1}
          value={expForm.amount}
          onChange={(e) =>
            setExpForm((p) => ({ ...p, amount: e.target.value }))
          }
          required
          className="w-28 px-3 py-2 text-sm rounded-lg border border-[var(--cards)] bg-white/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 cursor-pointer"
        >
          Add
        </button>
      </form>
    </div>
  );
}

function StatCard({ label, value, highlight, variant }) {
  const variants = {
    budget: "bg-[var(--secondary)]/20 border-[var(--secondary)]/40",
    spent: "bg-[var(--accent)]/10 border-[var(--accent)]/30",
    remaining: highlight
      ? "bg-red-50 border-red-200"
      : "bg-[var(--primary)]/10 border-[var(--primary)]/30",
  };
  return (
    <div
      className={`flex-1 rounded-xl border p-4 text-center ${
        variants[variant] || "bg-white/60 border-[var(--cards)]/40"
      }`}
    >
      <p className="text-xs text-[var(--text-light)]">{label}</p>
      <p
        className={`text-lg font-bold ${highlight ? "text-red-500" : "text-[var(--text)]"}`}
      >
        {value}
      </p>
    </div>
  );
}

function DocumentsTab({ tripId }) {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchDocs = useCallback(() => {
    api
      .get(`/documents/trip/${tripId}`)
      .then(({ data }) => {
        const arr = Array.isArray(data)
          ? data
          : data.documents
            ? data.documents
            : [];
        setDocs(arr);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tripId]);

  useEffect(fetchDocs, [fetchDocs]);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("tripId", tripId);
    for (const f of files) formData.append("files", f);
    try {
      await api.post("/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchDocs();
    } catch (err) {
      showApiError(err, "Failed to upload files");
    }
    setUploading(false);
    e.target.value = "";
  };

  const deleteDoc = async (docId, fileId) => {
    try {
      await api.delete(`/documents/${docId}`, { data: { fileId } });
      fetchDocs();
    } catch (err) {
      showApiError(err, "Failed to delete file");
    }
  };

  const toggleVisibility = async (docId, fileId, visibility) => {
    try {
      await api.put(`/documents/${docId}/visibility`, { fileId, visibility });
      fetchDocs();
    } catch (err) {
      showApiError(err, "Failed to update visibility");
    }
  };

  const [confirmDelete, setConfirmDelete] = useState(null);

  if (loading) return <Spinner />;

  const allFiles = docs.flatMap((d) =>
    (d.files ?? []).map((f) => ({ ...f, docId: d._id })),
  );

  return (
    <div className="space-y-4">
      <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 cursor-pointer">
        <Upload size={16} />
        {uploading ? "Uploading…" : "Upload Files"}
        <input
          type="file"
          multiple
          onChange={handleUpload}
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx,.txt"
        />
      </label>

      {allFiles.length === 0 ? (
        <p className="text-sm text-[var(--text-light)] text-center py-6">
          No documents uploaded yet.
        </p>
      ) : (
        <div className="space-y-2">
          {allFiles.map((f) => (
            <div
              key={f._id}
              className="flex items-center justify-between bg-white/60 backdrop-blur-sm p-3 rounded-xl border border-[var(--cards)]/40 text-sm"
            >
              <a
                href={f.url.startsWith("http") ? f.url : `${API_BASE}/${f.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[var(--text)] hover:text-[var(--primary)] truncate"
              >
                <FileText size={16} />
                {f.filename}
              </a>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                {f.isOwn && (
                  <select
                    value={f.visibility || "private"}
                    onChange={(e) =>
                      toggleVisibility(f.docId, f._id, e.target.value)
                    }
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[var(--cards)] bg-white/70 text-[var(--text)] cursor-pointer"
                  >
                    <option value="private">Private</option>
                    <option value="everyone">Everyone</option>
                  </select>
                )}
                {!f.isOwn && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                    Shared
                  </span>
                )}
                {f.isOwn && (
                  <button
                    onClick={() =>
                      setConfirmDelete({
                        title: "Delete Document?",
                        message: `Remove "${f.filename}"? This cannot be undone.`,
                        action: () => {
                          deleteDoc(f.docId, f._id);
                          setConfirmDelete(null);
                        },
                      })
                    }
                    className="text-red-400 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmDelete && (
        <ConfirmModal
          title={confirmDelete.title}
          message={confirmDelete.message}
          onConfirm={confirmDelete.action}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

function MembersTab({ trip, tripId, onUpdate }) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [updatingRole, setUpdatingRole] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    api
      .get("/profile")
      .then(({ data }) => {
        const u = data.user ?? data;
        setCurrentUserId(u._id);
      })
      .catch(() => {});
  }, []);

  const amOwner = trip.members?.some(
    (m) =>
      m.role === "owner" &&
      currentUserId &&
      (m.user?._id || m.user)?.toString() === currentUserId,
  );
  const amOwnerOrEditor = trip.members?.some(
    (m) =>
      currentUserId &&
      (m.user?._id || m.user)?.toString() === currentUserId &&
      (m.role === "owner" || m.role === "editor"),
  );

  const handleInvite = async (e) => {
    e.preventDefault();
    setSending(true);
    setMsg(null);
    try {
      await api.post("/invites/send", { emailOrMobile: email, tripId });
      setEmail("");
      setMsg({ type: "success", text: "Invite sent!" });
    } catch (err) {
      setMsg({
        type: "error",
        text: err.response?.data?.error || "Failed to send invite",
      });
    } finally {
      setSending(false);
    }
  };

  const changeRole = async (memberId, newRole) => {
    setUpdatingRole(memberId);
    try {
      await api.put(`/trips/${tripId}/members/${memberId}/role`, {
        role: newRole,
      });
      onUpdate();
    } catch (err) {
      showApiError(err, "Failed to change role");
    }
    setUpdatingRole(null);
  };

  const removeMember = async (memberId) => {
    try {
      await api.delete(`/trips/${tripId}/members/${memberId}`);
      onUpdate();
    } catch (err) {
      showApiError(err, "Failed to remove member");
    }
  };

  const roleColors = {
    owner: "bg-[var(--primary)]/15 text-[var(--primary)]",
    editor: "bg-amber-100 text-amber-700",
    viewer: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {(trip.members ?? []).map((m, i) => {
          const memberId = (m.user?._id || m.user)?.toString();
          const isOwnerMember = m.role === "owner";
          return (
            <div
              key={m._id ?? i}
              className="flex items-center gap-3 bg-white/60 backdrop-blur-sm p-3 rounded-xl border border-[var(--cards)]/40"
            >
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)] font-bold text-sm shrink-0">
                {m.user?.name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--text)] truncate">
                  {m.user?.name ?? "Unknown"}
                </p>
                <p className="text-xs text-[var(--text-light)] truncate">
                  {m.user?.email ?? ""}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {m.user?.age !== undefined && m.user?.age !== null && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
                      Age {m.user.age}
                    </span>
                  )}
                  {m.user?.gender && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] capitalize">
                      {m.user.gender}
                    </span>
                  )}
                  {m.user?.location && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--secondary)]/20 text-[var(--text)]">
                      <MapPin size={11} />
                      {m.user.location}
                    </span>
                  )}
                </div>
              </div>

              {/* Role: if owner viewing non-owner → show dropdown */}
              {amOwner && !isOwnerMember ? (
                <div className="flex items-center gap-1.5">
                  <select
                    value={m.role}
                    onChange={(e) => changeRole(memberId, e.target.value)}
                    disabled={updatingRole === memberId}
                    className="text-xs font-medium px-2 py-1 rounded-lg border border-[var(--cards)] bg-white/60 focus:outline-none focus:ring-1 focus:ring-[var(--primary)] cursor-pointer disabled:opacity-50"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                  </select>
                  <button
                    onClick={() =>
                      setConfirmAction({
                        title: "Remove Member?",
                        message: `Remove ${m.user?.name ?? "this member"} from the trip?`,
                        action: () => {
                          removeMember(memberId);
                          setConfirmAction(null);
                        },
                      })
                    }
                    className="p-1 rounded hover:bg-red-50 text-red-400 hover:text-red-600 cursor-pointer"
                    title="Remove member"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                    roleColors[m.role] ?? roleColors.viewer
                  }`}
                >
                  {m.role}
                </span>
              )}
            </div>
          );
        })}
        {trip.members?.length === 0 && (
          <p className="text-sm text-[var(--text-light)] text-center py-6">
            No members yet.
          </p>
        )}
      </div>

      {/* Invite form */}
      {trip.type !== "solo" && amOwnerOrEditor && (
        <form
          onSubmit={handleInvite}
          className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-[var(--cards)]/40 space-y-3"
        >
          <p className="text-sm font-semibold text-[var(--text)]">
            Invite someone
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Email or mobile number"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-[var(--cards)] bg-white/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--text)]"
            />
            <button
              type="submit"
              disabled={sending}
              className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 cursor-pointer flex items-center gap-1"
            >
              <Send size={14} />
              {sending ? "Sending…" : "Invite"}
            </button>
          </div>
          {msg && (
            <p
              className={`text-xs ${
                msg.type === "success" ? "text-green-600" : "text-red-500"
              }`}
            >
              {msg.text}
            </p>
          )}
        </form>
      )}

      {confirmAction && (
        <ConfirmModal
          title={confirmAction.title}
          message={confirmAction.message}
          confirmText={confirmAction.confirmText}
          onConfirm={confirmAction.action}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="animate-spin text-[var(--primary)]" size={24} />
    </div>
  );
}
