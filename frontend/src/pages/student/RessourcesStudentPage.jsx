import { useState, useEffect } from "react";
import StudentTopbar from "../../components/student/StudentTopbar";
import api from "../../api/axios";

const TYPE_STYLE = {
  video: { label: "Vidéo", cls: "bg-red-100 text-red-700", tag: "VID" },
  document: { label: "Document", cls: "bg-blue-100 text-blue-700", tag: "DOC" },
  "TP/TD": { label: "TP / TD", cls: "bg-amber-100 text-amber-700", tag: "TP" },
  "site web": {
    label: "Site web",
    cls: "bg-green-100 text-green-700",
    tag: "WEB",
  },
};

const FILTERS = ["Tout", "Document", "Vidéo", "TP / TD", "Site web"];

export default function RessourcesStudentPage() {
  const [ressources, setRessources] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tout");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/ressources")
      .then((res) => setRessources(res.data))
      .catch((err) => console.error("Erreur chargement ressources :", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = ressources.filter((r) => {
    const t = TYPE_STYLE[r.type] || {};
    const matchSearch =
      r.titre.toLowerCase().includes(search.toLowerCase()) ||
      (r.description || "").toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "Tout" || t.label === filter;
    return matchSearch && matchFilter;
  });

  return (
    <>
      <StudentTopbar
        title='Ressources'
        subtitle='Toutes les ressources pédagogiques disponibles'
      />
      <div className='p-7 flex flex-col gap-5'>
        {/* Barre de filtres */}
        <div className='flex items-center gap-3 flex-wrap'>
          <div className='flex items-center gap-2 border border-[#e8e8e8] rounded-[10px] px-3 py-[7px] focus-within:border-[#111] transition-colors'>
            <svg
              className='w-3.5 h-3.5 text-[#888] shrink-0'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
            >
              <circle
                cx='11'
                cy='11'
                r='8'
              />
              <line
                x1='21'
                y1='21'
                x2='16.65'
                y2='16.65'
              />
            </svg>
            <input
              type='text'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Rechercher une ressource…'
              className='outline-none border-none bg-transparent text-[13px] text-[#111] placeholder:text-[#888] w-52'
            />
          </div>
          <div className='flex gap-1.5'>
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium border transition-all
                  ${
                    filter === f
                      ? "bg-[#111] text-white border-[#111]"
                      : "border-[#e8e8e8] text-[#888] hover:border-[#bbb] hover:text-[#111]"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
          <span className='ml-auto text-[12px] text-[#888]'>
            {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
          </span>
        </div>

        {/* Contenu */}
        {loading ? (
          <div className='flex justify-center py-16'>
            <div className='w-8 h-8 border-2 border-[#e8e8e8] border-t-[#111] rounded-full animate-spin' />
          </div>
        ) : filtered.length === 0 ? (
          <div className='text-center py-16 text-[13px] text-[#888]'>
            Aucune ressource trouvée
          </div>
        ) : (
          <div
            className='grid gap-4'
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            }}
          >
            {filtered.map((r) => {
              const t = TYPE_STYLE[r.type] || TYPE_STYLE["document"];
              return (
                <a
                  key={r._id}
                  href={r.lien}
                  target='_blank'
                  rel='noreferrer'
                  className='border border-[#e8e8e8] rounded-xl p-4 flex flex-col gap-3 hover:border-[#ccc] hover:shadow-sm transition-all no-underline group'
                >
                  <div className='flex items-start justify-between'>
                    <span
                      className={`text-[9px] font-bold px-2 py-1 rounded ${t.cls}`}
                    >
                      {t.tag}
                    </span>
                    <svg
                      className='w-3.5 h-3.5 text-[#ccc] group-hover:text-[#888] transition-colors shrink-0'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                    >
                      <path d='M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6' />
                      <polyline points='15 3 21 3 21 9' />
                      <line
                        x1='10'
                        y1='14'
                        x2='21'
                        y2='3'
                      />
                    </svg>
                  </div>
                  <div>
                    <p className='text-[13px] font-semibold text-[#111] leading-snug'>
                      {r.titre}
                    </p>
                    {r.description && (
                      <p className='text-[11px] text-[#888] mt-1'>
                        {r.description}
                      </p>
                    )}
                  </div>
                  <p className='text-[11px] text-[#888] mt-auto truncate'>
                    {r.lien}
                  </p>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
