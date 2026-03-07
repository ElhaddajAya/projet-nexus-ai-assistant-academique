// ─── Pencil icon ─────────────────────────────────────────────────────────────
export function IconEdit({ onClick }) {
  return (
    <button
      onClick={onClick}
      title="Modifier"
      className="w-7 h-7 flex items-center justify-center rounded-md border border-[#e8e8e8] bg-white text-[#888] hover:border-[#bbb] hover:text-[#111] hover:bg-[#f9f9f9] transition-all"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    </button>
  );
}

// ─── Trash icon ──────────────────────────────────────────────────────────────
export function IconDelete({ onClick }) {
  return (
    <button
      onClick={onClick}
      title="Supprimer"
      className="w-7 h-7 flex items-center justify-center rounded-md border border-[#e8e8e8] bg-white text-[#888] hover:border-[#fca5a5] hover:text-red-600 hover:bg-red-50 transition-all"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
      </svg>
    </button>
  );
}

// ─── Row actions wrapper ──────────────────────────────────────────────────────
export function RowActions({ onEdit, onDelete }) {
  return (
    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
      <IconEdit onClick={onEdit} />
      <IconDelete onClick={onDelete} />
    </div>
  );
}
