// ─── Search input used in table headers ──────────────────────────────────────
export default function SearchInput({ value, onChange, placeholder = "Rechercher…" }) {
  return (
    <div className="flex items-center gap-2 border border-[#e8e8e8] rounded-[10px] px-3 py-[7px] focus-within:border-[#111] transition-colors">
      <svg className="w-3.5 h-3.5 text-[#888] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="outline-none border-none bg-transparent text-[13px] text-[#111] placeholder:text-[#888] w-44"
      />
    </div>
  );
}
