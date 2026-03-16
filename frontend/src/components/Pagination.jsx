// ─── Pagination — composant réutilisable ─────────────────────────────────────
// Usage :
//   const { page, setPage, paginated, totalPages } = usePagination(data, 10);
//   <Pagination page={page} total={totalPages} onChange={setPage} />

import { useState } from "react";

// ─── Hook usePagination ───────────────────────────────────────────────────────
// Prend un tableau de données et un nombre d'items par page
// Retourne la page courante, le setter, les données paginées et le total de pages
export function usePagination(data, perPage = 10) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / perPage));

  // S'assurer que la page reste valide si les données changent (ex: filtre)
  const safePage = Math.min(page, totalPages);

  const paginated = data.slice((safePage - 1) * perPage, safePage * perPage);

  return { page: safePage, setPage, paginated, totalPages };
}

// ─── Composant Pagination ─────────────────────────────────────────────────────
export default function Pagination({ page, total, onChange }) {
  // Ne pas afficher si une seule page
  if (total <= 1) return null;

  // Générer les numéros de pages à afficher (max 5 autour de la page courante)
  function getPages() {
    const pages = [];
    const delta = 2; // pages avant et après la courante
    const left  = Math.max(1, page - delta);
    const right = Math.min(total, page + delta);

    // Première page
    if (left > 1) {
      pages.push(1);
      if (left > 2) pages.push("..."); // ellipsis
    }

    // Pages autour de la courante
    for (let i = left; i <= right; i++) pages.push(i);

    // Dernière page
    if (right < total) {
      if (right < total - 1) pages.push("..."); // ellipsis
      pages.push(total);
    }

    return pages;
  }

  return (
    <div className="flex items-center justify-between px-[18px] py-3 border-t border-[#e8e8e8]">
      {/* Info pages */}
      <span className="text-[11px] text-[#888]">
        Page {page} sur {total}
      </span>

      {/* Boutons */}
      <div className="flex items-center gap-1">
        {/* Précédent */}
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="w-7 h-7 flex items-center justify-center rounded-md border border-[#e8e8e8] text-[#888] hover:border-[#bbb] hover:text-[#111] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Numéros de pages */}
        {getPages().map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="w-7 h-7 flex items-center justify-center text-[12px] text-[#888]">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={`w-7 h-7 flex items-center justify-center rounded-md text-[12px] font-medium transition-all
                ${p === page
                  ? "bg-[#111] text-white border border-[#111]"
                  : "border border-[#e8e8e8] text-[#888] hover:border-[#bbb] hover:text-[#111]"
                }`}
            >
              {p}
            </button>
          )
        )}

        {/* Suivant */}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === total}
          className="w-7 h-7 flex items-center justify-center rounded-md border border-[#e8e8e8] text-[#888] hover:border-[#bbb] hover:text-[#111] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
