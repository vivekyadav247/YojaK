import { useEffect, useState } from "react";
import {
  Loader2,
  Send,
  CheckCircle,
  XCircle,
  Trash2,
  Mail,
  UserPlus,
  Inbox,
  ArrowUpRight,
  Users,
} from "lucide-react";
import api from "../lib/api";
import ConfirmModal from "../components/ConfirmModal";

export default function Invites() {
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("received");

  // Send invite form
  const [trips, setTrips] = useState([]);
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [tripId, setTripId] = useState("");
  const [sendLoading, setSendLoading] = useState(false);
  const [sendMsg, setSendMsg] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get("/invites/received"),
      api.get("/invites/sent"),
      api.get("/trips/trips"),
    ])
      .then(([r, s, t]) => {
        setReceived(r.data ?? []);
        setSent(s.data ?? []);
        const tripList = t.data.trips ?? t.data ?? [];
        setTrips(tripList);
        if (tripList.length) setTripId(tripList[0]._id);

        // Fetch join requests for each trip the user owns
        const ownedTrips = tripList.filter((tr) =>
          tr.members?.some((m) => m.role === "owner"),
        );
        if (ownedTrips.length) {
          Promise.all(
            ownedTrips.map((tr) => api.get(`/join-requests/trip/${tr._id}`)),
          )
            .then((results) => {
              const all = results.flatMap((res) => res.data ?? []);
              setJoinRequests(all);
            })
            .catch(() => {});
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const respond = async (inviteId, status) => {
    try {
      await api.put("/invites/respond", { inviteId, status });
      setReceived((prev) =>
        prev.map((inv) => (inv._id === inviteId ? { ...inv, status } : inv)),
      );
    } catch {}
  };

  const respondJoinReq = async (requestId, status) => {
    try {
      await api.put("/join-requests/respond", { requestId, status });
      setJoinRequests((prev) => prev.filter((jr) => jr._id !== requestId));
    } catch {}
  };

  const deleteInvite = async (inviteId) => {
    try {
      await api.delete(`/invites/${inviteId}`);
      setSent((prev) => prev.filter((inv) => inv._id !== inviteId));
    } catch {}
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!tripId) return;
    setSendLoading(true);
    setSendMsg(null);
    try {
      const { data } = await api.post("/invites/send", {
        emailOrMobile,
        tripId,
      });
      setSent((prev) => [data, ...prev]);
      setEmailOrMobile("");
      setSendMsg({ type: "success", text: "Invite sent!" });
    } catch (err) {
      setSendMsg({
        type: "error",
        text: err.response?.data?.error || "Failed to send invite",
      });
    } finally {
      setSendLoading(false);
    }
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
        <div className="bg-white/60 backdrop-blur-xl border border-[var(--cards)] rounded-2xl px-4 py-3 flex items-center gap-2.5 shadow-sm shadow-black/5">
          <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/15 flex items-center justify-center">
            <Mail size={16} className="text-[var(--primary)]" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[var(--text)] leading-tight">
              Invites
            </h1>
            <p className="text-[10px] text-[var(--text-light)]">
              {received.length} received &middot; {sent.length} sent
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[var(--secondary)]/10 border border-[var(--cards)]/50 rounded-3xl p-4 md:p-6 space-y-4">
        {/* Desktop header card */}
        <div className="hidden md:flex bg-white/60 backdrop-blur-xl border border-[var(--cards)] rounded-2xl p-5 items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/15 flex items-center justify-center">
            <Mail size={20} className="text-[var(--primary)]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--text)]">Invites</h1>
            <p className="text-xs text-[var(--text-light)]">
              {received.length} received &middot; {sent.length} sent
            </p>
          </div>
        </div>

        {/* Send invite form */}
        <form
          onSubmit={handleSend}
          className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-[var(--cards)]/40 space-y-3"
        >
          <p className="text-sm font-semibold text-[var(--text)] flex items-center gap-2">
            <Send size={16} /> Send an Invite
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Email or mobile number"
              value={emailOrMobile}
              onChange={(e) => setEmailOrMobile(e.target.value)}
              required
              className="sm:col-span-1 px-3 py-2.5 rounded-lg border border-[var(--cards)] text-sm bg-white/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
            <select
              value={tripId}
              onChange={(e) => setTripId(e.target.value)}
              className="sm:col-span-1 px-3 py-2.5 rounded-lg border border-[var(--cards)] text-sm bg-white/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              {trips.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.title}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={sendLoading || !trips.length}
              className="px-4 py-2.5 rounded-lg bg-[var(--accent)] text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 cursor-pointer"
            >
              {sendLoading ? "Sending…" : "Send"}
            </button>
          </div>
          {sendMsg && (
            <p
              className={`text-xs ${sendMsg.type === "success" ? "text-green-600" : "text-red-500"}`}
            >
              {sendMsg.text}
            </p>
          )}
        </form>

        {/* Tabs — pill style */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {[
            {
              key: "received",
              label: "Received",
              count: received.length,
              icon: Inbox,
            },
            {
              key: "sent",
              label: "Sent",
              count: sent.length,
              icon: ArrowUpRight,
            },
            {
              key: "joinRequests",
              label: "Join Requests",
              count: joinRequests.length,
              icon: Users,
            },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all whitespace-nowrap shrink-0 ${
                tab === t.key
                  ? "bg-[var(--primary)] text-white shadow-sm"
                  : "bg-white/60 text-[var(--text-light)] hover:bg-[var(--cards)]/40 hover:text-[var(--text)]"
              }`}
            >
              <t.icon size={15} />
              {t.label}
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  tab === t.key ? "bg-white/25" : "bg-[var(--cards)]/40"
                }`}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-3">
          {tab === "received" &&
            (received.length === 0 ? (
              <Empty text="No received invites" />
            ) : (
              received.map((inv) => (
                <InviteRow
                  key={inv._id}
                  inv={inv}
                  type="received"
                  onRespond={respond}
                />
              ))
            ))}
          {tab === "sent" &&
            (sent.length === 0 ? (
              <Empty text="No sent invites" />
            ) : (
              sent.map((inv) => (
                <InviteRow
                  key={inv._id}
                  inv={inv}
                  type="sent"
                  onDelete={deleteInvite}
                />
              ))
            ))}
          {tab === "joinRequests" &&
            (joinRequests.length === 0 ? (
              <Empty text="No pending join requests" />
            ) : (
              joinRequests.map((jr) => (
                <JoinRequestRow
                  key={jr._id}
                  jr={jr}
                  onRespond={respondJoinReq}
                />
              ))
            ))}
        </div>
      </div>
    </div>
  );
}

function InviteRow({ inv, type, onRespond, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(null);
  const person =
    type === "received"
      ? inv.sender?.name || inv.sender?.email || "Someone"
      : inv.receiver?.name || inv.receiver?.email || "Someone";

  const statusColors = {
    pending: "text-amber-600 bg-amber-50",
    accepted: "text-green-600 bg-green-50",
    rejected: "text-red-500 bg-red-50",
  };

  return (
    <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-[var(--cards)]/40">
      <div className="min-w-0">
        <p className="text-sm font-medium text-[var(--text)] truncate">
          <Mail size={14} className="inline mr-1" />
          {type === "received" ? `From ${person}` : `To ${person}`}
        </p>
        <p className="text-xs text-[var(--text-light)] truncate">
          Trip: {inv.trip?.title || inv.trip}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-3">
        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColors[inv.status] ?? ""}`}
        >
          {inv.status}
        </span>
        {type === "received" && inv.status === "pending" && (
          <>
            <button
              onClick={() => onRespond(inv._id, "accepted")}
              className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 cursor-pointer"
              title="Accept"
            >
              <CheckCircle size={18} />
            </button>
            <button
              onClick={() => onRespond(inv._id, "rejected")}
              className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 cursor-pointer"
              title="Reject"
            >
              <XCircle size={18} />
            </button>
          </>
        )}
        {type === "sent" && (
          <button
            onClick={() =>
              setConfirmDelete({
                title: "Delete Invite?",
                message: `Delete the invite sent to ${person}?`,
                action: () => {
                  onDelete(inv._id);
                  setConfirmDelete(null);
                },
              })
            }
            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 cursor-pointer"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

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

function Empty({ text }) {
  return (
    <p className="text-center text-sm text-[var(--text-light)] py-12">{text}</p>
  );
}

function JoinRequestRow({ jr, onRespond }) {
  const person = jr.sender?.name || jr.sender?.email || "Someone";

  return (
    <div className="flex items-center justify-between bg-white/80 p-4 rounded-xl border border-[var(--cards)]/40">
      <div className="min-w-0">
        <p className="text-sm font-medium text-[var(--text)] truncate">
          <UserPlus size={14} className="inline mr-1" />
          {person} wants to join
        </p>
        <p className="text-xs text-[var(--text-light)] truncate">
          Trip: {jr.trip?.title || jr.trip}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-3">
        <button
          onClick={() => onRespond(jr._id, "accepted")}
          className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 cursor-pointer"
          title="Accept"
        >
          <CheckCircle size={18} />
        </button>
        <button
          onClick={() => onRespond(jr._id, "rejected")}
          className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 cursor-pointer"
          title="Reject"
        >
          <XCircle size={18} />
        </button>
      </div>
    </div>
  );
}
