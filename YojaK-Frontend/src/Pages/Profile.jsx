import { useEffect, useState } from "react";
import { useUser } from "@clerk/react";
import { Save, CheckCircle, AlertCircle, User } from "lucide-react";
import api from "../lib/api";

export default function Profile() {
  const { user: clerkUser } = useUser();
  const [form, setForm] = useState({
    name: "",
    mobileNumber: "",
    age: "",
    gender: "",
    location: "",
  });
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    const loadProfile = async () => {
      try {
        const { data } = await api.get("/profile");
        if (isCancelled) return;

        const u = data.user ?? data;
        setForm({
          name: u.name || clerkUser?.fullName || "",
          mobileNumber: u.mobileNumber || "",
          age: u.age ?? "",
          gender: u.gender || "",
          location: u.location || "",
        });
        setIsProfileComplete(Boolean(u.isProfileComplete));
      } catch (err) {
        if (isCancelled) return;

        setForm((prev) => ({
          ...prev,
          name: clerkUser?.fullName || prev.name,
        }));

        if (err.response?.status === 401) {
          setMsg({ type: "error", text: "Session expired. Please login again." });
        } else {
          setMsg({ type: "error", text: "Could not load profile." });
        }
      }
    };

    loadProfile();
    return () => {
      isCancelled = true;
    };
  }, [clerkUser?.fullName, clerkUser?.id]);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const { data } = await api.put("/profile", {
        name: form.name,
        mobileNumber: form.mobileNumber,
        age: Number(form.age),
        gender: form.gender,
        location: form.location,
      });
      setIsProfileComplete(data.user?.isProfileComplete ?? true);
      setMsg({ type: "success", text: "Profile updated!" });
    } catch (err) {
      setMsg({
        type: "error",
        text: err.response?.data?.message || "Update failed",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 md:py-6">
      {/* Mobile sticky header */}
      <div className="sticky top-0 z-20 -mx-4 px-4 pt-2 pb-3 bg-[var(--background)] md:hidden">
        <div className="bg-white/60 backdrop-blur-xl border border-[var(--cards)] rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm shadow-black/5">
          <img
            src={clerkUser?.imageUrl}
            alt="avatar"
            className="w-9 h-9 rounded-full object-cover border-2 border-[var(--primary)]/40"
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-[var(--text)] leading-tight truncate">
              {clerkUser?.fullName || "Profile"}
            </h1>
            <p className="text-[10px] text-[var(--text-light)] truncate">
              {clerkUser?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
          {isProfileComplete ? (
            <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700 whitespace-nowrap">
              <CheckCircle size={10} /> Complete
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 whitespace-nowrap">
              <AlertCircle size={10} /> Incomplete
            </span>
          )}
        </div>
      </div>

      <div className="bg-[var(--secondary)]/10 border border-[var(--cards)]/50 rounded-3xl p-4 md:p-6 space-y-4">
        {/* Desktop header card */}
        <div className="hidden md:flex bg-white/60 backdrop-blur-xl border border-[var(--cards)] rounded-2xl p-5 items-center gap-4">
          <img
            src={clerkUser?.imageUrl}
            alt="avatar"
            className="w-14 h-14 rounded-full object-cover border-2 border-[var(--primary)]/40"
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-[var(--text)] truncate">
              {clerkUser?.fullName || "Profile"}
            </h1>
            <p className="text-xs text-[var(--text-light)] truncate">
              {clerkUser?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
          {isProfileComplete ? (
            <span className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700 whitespace-nowrap">
              <CheckCircle size={12} /> Complete
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 whitespace-nowrap">
              <AlertCircle size={12} /> Incomplete
            </span>
          )}
        </div>

        {!isProfileComplete && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm">
            <AlertCircle size={18} />
            Complete all fields to unlock trip creation.
          </div>
        )}

        {/* Form card */}
        <div className="bg-white/60 backdrop-blur-xl border border-[var(--cards)] rounded-2xl p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
            <Field
              label="Mobile Number"
              name="mobileNumber"
              value={form.mobileNumber}
              onChange={handleChange}
              placeholder="10-digit number"
              pattern="\d{10}"
            />
            <Field
              label="Age"
              name="age"
              type="number"
              min={1}
              max={120}
              value={form.age}
              onChange={handleChange}
            />
            <label className="block">
              <span className="text-sm font-medium text-[var(--text)]">
                Gender
              </span>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2.5 rounded-lg border border-[var(--cards)]/50 bg-white/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--text)]"
              >
                <option value="" disabled>
                  Select gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </label>
            <Field
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
            />

            {msg && (
              <p
                className={`text-sm ${msg.type === "success" ? "text-green-600" : "text-red-500"}`}
              >
                {msg.text}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--accent)] text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer"
            >
              <Save size={18} />
              {saving ? "Saving…" : "Save Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-[var(--text)]">{label}</span>
      <input
        required
        {...props}
        className="mt-1 w-full px-4 py-2.5 rounded-lg border border-[var(--cards)]/50 bg-white/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--text)]"
      />
    </label>
  );
}
