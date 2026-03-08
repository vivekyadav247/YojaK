import { useState } from "react";
import { X } from "lucide-react";
import api from "../lib/api";

export default function CreateTripModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    title: "",
    destinations: "",
    places: "",
    startDate: "",
    endDate: "",
    type: "public",
    limitofPeople: 10,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      [name]: value,
      ...(name === "type" && value === "solo" ? { limitofPeople: 1 } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        destinations: form.destinations
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        places: form.places
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        limitofPeople: Number(form.limitofPeople),
      };
      const { data } = await api.post("/trips", payload);
      onCreated?.(data.trip ?? data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--text-light)] hover:text-[var(--text)] cursor-pointer"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-[var(--text)] mb-4">
          Create a Trip
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
          />
          <InputField
            label="Destinations (comma-separated)"
            name="destinations"
            value={form.destinations}
            onChange={handleChange}
            placeholder="Goa, Manali"
          />
          <InputField
            label="Places to visit (comma-separated)"
            name="places"
            value={form.places}
            onChange={handleChange}
            placeholder="Baga Beach, Solang Valley"
          />
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Start Date"
              name="startDate"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={form.startDate}
              onChange={handleChange}
            />
            <InputField
              label="End Date"
              name="endDate"
              type="date"
              min={form.startDate || new Date().toISOString().split("T")[0]}
              value={form.endDate}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-[var(--text)]">
                Type
              </span>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2.5 rounded-lg border border-[var(--cards)] bg-white/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--text)]"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="solo">Solo</option>
              </select>
            </label>
            <InputField
              label="People Limit"
              name="limitofPeople"
              type="number"
              min={1}
              value={form.limitofPeople}
              onChange={handleChange}
              disabled={form.type === "solo"}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[var(--accent)] text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Creating…" : "Create Trip"}
          </button>
        </form>
      </div>
    </div>
  );
}

function InputField({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-[var(--text)]">{label}</span>
      <input
        required
        {...props}
        className="mt-1 w-full px-4 py-2.5 rounded-lg border border-[var(--cards)] bg-white/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--text)]"
      />
    </label>
  );
}
