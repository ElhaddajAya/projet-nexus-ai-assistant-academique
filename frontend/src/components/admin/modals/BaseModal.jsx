import { useEffect } from "react";

// ─── Base modal wrapper ───────────────────────────────────────────────────────
// Usage: wrap your modal content in this component
export default function BaseModal({ open, onClose, title, children, footer }) {

  // Close on Escape key
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    // Overlay
    <div
      className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center backdrop-blur-[2px]"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal card */}
      <div className="bg-white border border-[#e8e8e8] rounded-[14px] w-full max-w-[420px] overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-150">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8e8e8]">
          <h3 className="text-[14px] font-semibold text-[#111]">{title}</h3>
          <button
            onClick={onClose}
            className="w-[26px] h-[26px] rounded-md border border-[#e8e8e8] flex items-center justify-center text-[#888] hover:bg-[#f9f9f9] hover:text-[#111] transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 flex flex-col gap-3.5">
          {children}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 py-3.5 border-t border-[#e8e8e8]">
          {footer}
        </div>

      </div>
    </div>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────
export function Field({ label, optional, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold text-[#111]">
        {label}{" "}
        {optional && <span className="text-[#888] font-normal">(optionnel)</span>}
      </label>
      {children}
    </div>
  );
}

// ─── Shared input styles ──────────────────────────────────────────────────────
export const inputClass =
  "w-full text-[13px] text-[#111] border border-[#e8e8e8] rounded-[10px] px-3 py-2.5 outline-none bg-white focus:border-[#111] transition-colors placeholder:text-[#888] font-sans";

export const selectClass =
  inputClass +
  " appearance-none bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")] bg-no-repeat bg-[right_12px_center] pr-8 cursor-pointer";
