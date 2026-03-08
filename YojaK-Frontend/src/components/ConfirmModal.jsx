import { X } from "lucide-react";

export default function ConfirmModal({
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}) {
  const btnColors =
    variant === "danger"
      ? "bg-red-500 hover:bg-red-600 text-white"
      : "bg-[var(--primary)] hover:opacity-90 text-white";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold text-[var(--text)]">{title}</h3>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg hover:bg-gray-100 text-[var(--text-light)] cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        <p className="text-sm text-[var(--text-light)]">{message}</p>
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-medium text-[var(--text-light)] hover:bg-gray-100 cursor-pointer transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-colors ${btnColors}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
