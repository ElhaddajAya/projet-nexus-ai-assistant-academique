import { useState, useEffect } from "react";
import StudentTopbar from "../../components/student/StudentTopbar";
import Pagination, { usePagination } from "../../components/Pagination";
import api from "../../api/axios";

const TYPE_STYLE = {
  video:      { label: "Vidéo",     cls: "bg-red-100 text-red-700",     tag: "VID" },
  document:   { label: "Document",  cls: "bg-blue-100 text-blue-700",   tag: "DOC" },
  "TP/TD":    { label: "TP / TD",   cls: "bg-amber-100 text-amber-700", tag: "TP"  },
  "site web": { label: "Site web",  cls: "bg-green-100 text-green-700", tag: "WEB" },
};

const TYPE_FILTERS = ["Tout", "Document", "Vidéo", "TP / TD", "Site web"];

export default function RessourcesStudentPage() {
  const [ressources, setRessources]       = useState([]);
  const [matieres, setMatieres]           = useState([]);
  const [search, setSearch]               = useState("");
  const [filterType, setFilterType]       = useState("Tout");
  const [filterMatiere, setFilterMatiere] = useState("Toutes");
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    // Charger ressources + matières en parallèle
    Promise.all([
      api.get("/ressources"),
      api.get("/matieres"),
    ])
      .then(([resR, resM]) => {
        setRessources(resR.data);
        setMatieres(resM.data);
      })
      .catch((err) => console.error("Erreur chargement :", err))
      .finally(() => setLoading(false));
  }, []);

  // Filtrage combiné : search + type + matière
  const filtered = ressources.filter((r) => {
    const t = TYPE_STYLE[r.type] || {};
    const matchSearch  = r.titre.toLowerCase().includes(search.toLowerCase()) ||
                         (r.description || "").toLowerCase().includes(search.toLowerCase());
    const matchType    = filterType === "Tout" || t.label === filterType;
    // matiereId peut être un string ou un objet selon le populate
    const rMatiereId   = typeof r.matiereId === "object" ? r.matiereId?._id : r.matiereId;
    const matchMatiere = filterMatiere === "Toutes" || rMatiereId === filterMatiere;
    return matchSearch && matchType && matchMatiere;
  });

  // Pagination — 12 cartes par page, reset quand un filtre change
  const { page, setPage, paginated, totalPages } = usePagination(filtered, 12);
  useEffect(() => { setPage(1); }, [search, filterType, filterMatiere]);
  const matieresAvecRessources = matieres.filter((m) =>
    ressources.some((r) => {
      const rMatiereId = typeof r.matiereId === "object" ? r.matiereId?._id : r.matiereId;
      return rMatiereId === m._id;
    })
  );

  return (
    <>
      <StudentTopbar
        title="Ressources"
        subtitle="Toutes les ressources pédagogiques disponibles"
      />
      <div className="p-7 flex flex-col gap-5">

        {/* ── Barre search + filtre type ── */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Recherche */}
          <div className="flex items-center gap-2 border border-[#e8e8e8] rounded-[10px] px-3 py-[7px] focus-within:border-[#111] transition-colors">
            <svg className="w-3.5 h-3.5 text-[#888] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une ressource…"
              className="outline-none border-none bg-transparent text-[13px] text-[#111] placeholder:text-[#888] w-52"
            />
          </div>

          {/* Filtre type */}
          <div className="flex gap-1.5 flex-wrap">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium border transition-all
                  ${filterType === f
                    ? "bg-[#111] text-white border-[#111]"
                    : "border-[#e8e8e8] text-[#888] hover:border-[#bbb] hover:text-[#111]"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Compteur */}
          <span className="ml-auto text-[12px] text-[#888]">
            {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
          </span>
        </div>

        {/* ── Filtre par matière ── */}
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-[#888]">Matière :</span>
          <select
            value={filterMatiere}
            onChange={(e) => setFilterMatiere(e.target.value)}
            className="text-[12px] text-[#111] border border-[#e8e8e8] rounded-[10px] px-3 py-2 outline-none bg-white focus:border-[#111] transition-colors cursor-pointer appearance-none pr-7"
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 10px center",
            }}
          >
            <option value="Toutes">Toutes les matières</option>
            {matieresAvecRessources.map((m) => (
              <option key={m._id} value={m._id}>
                {m.nom_matiere}
              </option>
            ))}
          </select>

          {/* Bouton reset — visible seulement si une matière est sélectionnée */}
          {filterMatiere !== "Toutes" && (
            <button
              onClick={() => setFilterMatiere("Toutes")}
              className="text-[11px] text-[#888] hover:text-[#111] transition-colors px-2 py-1 rounded-lg border border-[#e8e8e8] hover:border-[#bbb]"
            >
              ✕ Réinitialiser
            </button>
          )}
        </div>

        {/* ── Contenu ── */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#e8e8e8] border-t-[#111] rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-[13px] text-[#888]">
            Aucune ressource trouvée
          </div>
        ) : (
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
          >
            {paginated.map((r) => {
              const t = TYPE_STYLE[r.type] || TYPE_STYLE["document"];
              return (
                <a
                  key={r._id}
                  href={r.lien}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-[#e8e8e8] rounded-xl p-4 flex flex-col gap-3 hover:border-[#ccc] hover:shadow-sm transition-all no-underline group"
                >
                  <div className="flex items-start justify-between">
                    <span className={`text-[9px] font-bold px-2 py-1 rounded ${t.cls}`}>
                      {t.tag}
                    </span>
                    <svg
                      className="w-3.5 h-3.5 text-[#ccc] group-hover:text-[#888] transition-colors shrink-0"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    >
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#111] leading-snug">
                      {r.titre}
                    </p>
                    {r.description && (
                      <p className="text-[11px] text-[#888] mt-1">{r.description}</p>
                    )}
                  </div>
                  <p className="text-[11px] text-[#888] mt-auto truncate">{r.lien}</p>
                </a>
              );
            })}
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && filtered.length > 0 && (
          <div className="border border-[#e8e8e8] rounded-xl overflow-hidden">
            <Pagination page={page} total={totalPages} onChange={setPage} />
          </div>
        )}
      </div>
    </>
  );
}
