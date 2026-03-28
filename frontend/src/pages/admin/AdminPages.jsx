// ─── ModulesPage ──────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import AdminTopbar from "../../components/admin/AdminTopbar";
import { RowActions } from "../../components/admin/RowActions";
import SearchInput from "../../components/admin/SearchInput";
import ModuleModal from "../../components/admin/modals/ModuleModal";
import Pagination, { usePagination } from "../../components/Pagination";
import api from "../../api/axios";

export function ModulesPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchModules = async () => {
    try {
      const res = await api.get("/modules");
      setData(res.data);
    } catch (err) {
      console.error("Erreur chargement modules :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchModules(); }, []);

  const filtered = data.filter(
    (m) =>
      (m.nom_module ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (m.id_filiere?.nom_filiere ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  // Pagination — reset à page 1 quand la recherche change
  const { page, setPage, paginated, totalPages } = usePagination(filtered, 8);
  useEffect(() => { setPage(1); }, [search]);

  async function handleSave(item) {
    try {
      if (editing) {
        await api.put(`/modules/${item._id}`, {
          nom_module: item.nom_module,
          semestre: item.semestre,
          id_filiere: item.id_filiere,
        });
      } else {
        await api.post("/modules", {
          nom_module: item.nom_module,
          semestre: item.semestre,
          id_filiere: item.id_filiere,
        });
      }
      setModal(false);
      setEditing(null);
      await fetchModules();
    } catch (err) {
      alert("Erreur : " + (err.response?.data?.message || err.message));
    }
  }

  async function handleDelete(id) {
    if (!confirm("Supprimer ce module ?")) return;
    try {
      await api.delete(`/modules/${id}`);
      await fetchModules();
    } catch (err) {
      alert("Erreur lors de la suppression : " + (err.response?.data?.message || err.message));
    }
  }

  return (
    <>
      <AdminTopbar title="Modules" subtitle={`${data.length} modules configurés`} />
      <div className="p-7">
        <div className="border border-[#e8e8e8] rounded-xl overflow-hidden">
          <div className="px-[18px] py-3.5 border-b border-[#e8e8e8] flex items-center justify-between">
            <div>
              <h3 className="text-[13px] font-semibold">Tous les modules</h3>
              <p className="text-[11px] text-[#888] mt-0.5">
                {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <SearchInput value={search} onChange={setSearch} />
              <button
                onClick={() => { setEditing(null); setModal(true); }}
                className="flex items-center gap-1.5 px-3.5 py-[7px] bg-[#111] text-white text-[12px] font-medium rounded-lg hover:bg-[#333] transition-colors"
              >
                + Ajouter
              </button>
            </div>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#e8e8e8]">
                {["Nom du module", "Filière", "Semestre", ""].map((h) => (
                  <th key={h} className="px-[18px] py-2.5 text-[11px] font-semibold text-[#888] text-left tracking-[0.3px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="text-center py-10">
                  <div className="w-6 h-6 border-2 border-[#e8e8e8] border-t-[#111] rounded-full animate-spin mx-auto" />
                </td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-10 text-[13px] text-[#888]">Aucun module trouvé</td></tr>
              ) : (
                paginated.map((m) => (
                  <tr key={m._id} className="border-b border-[#e8e8e8] last:border-b-0 hover:bg-[#f9f9f9] transition-colors group">
                    <td className="px-[18px] py-3 text-[13px] font-medium">{m.nom_module}</td>
                    <td className="px-[18px] py-3 text-[12px] text-[#888]">{m.id_filiere?.nom_filiere ?? "—"}</td>
                    <td className="px-[18px] py-3 text-[12px] font-mono text-[#888]">{m.semestre}</td>
                    <td className="px-[18px] py-3">
                      <RowActions
                        onEdit={() => { setEditing(m); setModal(true); }}
                        onDelete={() => handleDelete(m._id)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <Pagination page={page} total={totalPages} onChange={setPage} />
        </div>
      </div>
      <ModuleModal
        open={modalOpen}
        onClose={() => { setModal(false); setEditing(null); }}
        onSave={handleSave}
        initial={editing}
      />
    </>
  );
}

// ─── MatieresPage ─────────────────────────────────────────────────────────────
import MatiereModal from "../../components/admin/modals/MatiereModal";

export function MatieresPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchMatieres = async () => {
    try {
      const res = await api.get("/matieres");
      setData(res.data);
    } catch (err) {
      console.error("Erreur chargement matières :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMatieres(); }, []);

  const filtered = data.filter((m) =>
    (m.nom_matiere ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  // Pagination
  const { page, setPage, paginated, totalPages } = usePagination(filtered, 8);
  useEffect(() => { setPage(1); }, [search]);

  async function handleSave(item) {
    try {
      if (editing) {
        await api.put(`/matieres/${item._id}`, {
          nom_matiere: item.nom_matiere,
          moduleId: item.moduleId,
          difficultes: item.difficultes,
        });
      } else {
        await api.post("/matieres", {
          nom_matiere: item.nom_matiere,
          moduleId: item.moduleId,
          difficultes: item.difficultes,
        });
      }
      setModal(false);
      setEditing(null);
      await fetchMatieres();
    } catch (err) {
      alert("Erreur : " + (err.response?.data?.message || err.message));
    }
  }

  async function handleDelete(id) {
    if (!confirm("Supprimer cette matière ?")) return;
    try {
      await api.delete(`/matieres/${id}`);
      await fetchMatieres();
    } catch (err) {
      alert("Erreur lors de la suppression : " + (err.response?.data?.message || err.message));
    }
  }

  return (
    <>
      <AdminTopbar title="Matières" subtitle={`${data.length} matières configurées`} />
      <div className="p-7">
        <div className="border border-[#e8e8e8] rounded-xl overflow-hidden">
          <div className="px-[18px] py-3.5 border-b border-[#e8e8e8] flex items-center justify-between">
            <div>
              <h3 className="text-[13px] font-semibold">Toutes les matières</h3>
              <p className="text-[11px] text-[#888] mt-0.5">
                {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <SearchInput value={search} onChange={setSearch} />
              <button
                onClick={() => { setEditing(null); setModal(true); }}
                className="flex items-center gap-1.5 px-3.5 py-[7px] bg-[#111] text-white text-[12px] font-medium rounded-lg hover:bg-[#333] transition-colors"
              >
                + Ajouter
              </button>
            </div>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#e8e8e8]">
                {["Nom de la matière", "Difficultés", ""].map((h) => (
                  <th key={h} className="px-[18px] py-2.5 text-[11px] font-semibold text-[#888] text-left tracking-[0.3px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={3} className="text-center py-10">
                  <div className="w-6 h-6 border-2 border-[#e8e8e8] border-t-[#111] rounded-full animate-spin mx-auto" />
                </td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={3} className="text-center py-10 text-[13px] text-[#888]">Aucune matière trouvée</td></tr>
              ) : (
                paginated.map((m) => (
                  <tr key={m._id} className="border-b border-[#e8e8e8] last:border-b-0 hover:bg-[#f9f9f9] transition-colors group">
                    <td className="px-[18px] py-3 text-[13px] font-medium">{m.nom_matiere}</td>
                    <td className="px-[18px] py-3 text-[12px] text-[#888]">
                      {Array.isArray(m.difficultes) && m.difficultes.length > 0
                        ? `${m.difficultes.length} difficulté${m.difficultes.length > 1 ? "s" : ""}`
                        : "—"}
                    </td>
                    <td className="px-[18px] py-3">
                      <RowActions
                        onEdit={() => { setEditing(m); setModal(true); }}
                        onDelete={() => handleDelete(m._id)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <Pagination page={page} total={totalPages} onChange={setPage} />
        </div>
      </div>
      <MatiereModal
        open={modalOpen}
        onClose={() => { setModal(false); setEditing(null); }}
        onSave={handleSave}
        initial={editing}
      />
    </>
  );
}

// ─── RessourcesPage ───────────────────────────────────────────────────────────
import RessourceModal from "../../components/admin/modals/RessourceModal";

// Styles des badges par type
const TYPE_STYLES = {
  video:      { label: "Vidéo",    class: "bg-red-100 text-red-700"    },
  document:   { label: "Document", class: "bg-blue-100 text-blue-700"  },
  "TP/TD":    { label: "TP / TD",  class: "bg-amber-100 text-amber-700"},
  "site web": { label: "Site web", class: "bg-green-100 text-green-700"},
};

// Styles des badges par niveau
const NIVEAU_STYLES = {
  "1ère année": "bg-purple-100 text-purple-700",
  "2ème année": "bg-indigo-100 text-indigo-700",
  "3ème année": "bg-cyan-100 text-cyan-700",
  "4ème année": "bg-teal-100 text-teal-700",
  "5ème année": "bg-orange-100 text-orange-700",
};

// Petit composant de filtre pill
function FilterPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-[11px] font-medium border transition-all
        ${active
          ? "bg-[#111] text-white border-[#111]"
          : "border-[#e8e8e8] text-[#888] hover:border-[#bbb] hover:text-[#111]"
        }`}
    >
      {label}
    </button>
  );
}

export function RessourcesPage() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("Tous");
  const [filterNiveau, setFilterNiveau] = useState("Tous");
  const [modalOpen, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/ressources")
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Filtrage : recherche + type + niveau
  const filtered = data.filter((r) => {
    const matchSearch  = r.titre.toLowerCase().includes(search.toLowerCase());
    const matchType    = filterType === "Tous" || r.type === filterType;
    const matchNiveau  = filterNiveau === "Tous" || r.niveau === filterNiveau;
    return matchSearch && matchType && matchNiveau;
  });

  // Pagination — reset à page 1 quand un filtre change
  const { page, setPage, paginated, totalPages } = usePagination(filtered, 8);
  useEffect(() => { setPage(1); }, [search, filterType, filterNiveau]);

  async function handleSave(item) {
    try {
      if (editing) {
        const res = await api.put(`/ressources/${item._id}`, {
          titre: item.titre, description: item.description || "",
          lien: item.lien, type: item.type,
          matiereId: item.matiereId, filiereId: item.filiereId, niveau: item.niveau || "",
        });
        setData((d) => d.map((r) => (r._id === item._id ? res.data : r)));
      } else {
        const res = await api.post("/ressources", {
          titre: item.titre, description: item.description || "",
          lien: item.lien, type: item.type,
          matiereId: item.matiereId, filiereId: item.filiereId, niveau: item.niveau || "",
        });
        setData((d) => [...d, res.data]);
      }
      setModal(false);
      setEditing(null);
    } catch (err) {
      alert("Erreur : " + (err.response?.data?.message || err.message));
    }
  }

  async function handleDelete(id) {
    if (!confirm("Supprimer cette ressource ?")) return;
    try {
      await api.delete(`/ressources/${id}`);
      setData((d) => d.filter((r) => r._id !== id));
    } catch {
      alert("Erreur lors de la suppression");
    }
  }

  return (
    <>
      <AdminTopbar title="Ressources" subtitle={`${data.length} ressources disponibles`} />
      <div className="p-7">
        <div className="border border-[#e8e8e8] rounded-xl overflow-hidden">

          {/* ── Header : titre + search + bouton ── */}
          <div className="px-[18px] py-3.5 border-b border-[#e8e8e8] flex items-center justify-between">
            <div>
              <h3 className="text-[13px] font-semibold">Toutes les ressources</h3>
              <p className="text-[11px] text-[#888] mt-0.5">
                {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <SearchInput value={search} onChange={setSearch} />
              <button
                onClick={() => { setEditing(null); setModal(true); }}
                className="flex items-center gap-1.5 px-3.5 py-[7px] bg-[#111] text-white text-[12px] font-medium rounded-lg hover:bg-[#333] transition-colors"
              >
                + Ajouter
              </button>
            </div>
          </div>

          {/* ── Filtres Type + Niveau ── */}
          <div className="px-[18px] py-2.5 border-b border-[#e8e8e8] flex items-center gap-4 flex-wrap">
            {/* Filtre Type */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-[#888] mr-1">Type :</span>
              {["Tous", "document", "TP/TD", "video", "site web"].map((t) => (
                <FilterPill
                  key={t}
                  label={t === "document" ? "Document" : t === "TP/TD" ? "TP/TD" : t === "video" ? "Vidéo" : t === "site web" ? "Site web" : t}
                  active={filterType === t}
                  onClick={() => setFilterType(t)}
                />
              ))}
            </div>

            {/* Séparateur */}
            <div className="w-px h-4 bg-[#e8e8e8]" />

            {/* Filtre Niveau */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-[#888] mr-1">Niveau :</span>
              {["Tous", "1ère année", "2ème année", "3ème année", "4ème année", "5ème année"].map((n) => (
                <FilterPill
                  key={n}
                  label={n}
                  active={filterNiveau === n}
                  onClick={() => setFilterNiveau(n)}
                />
              ))}
            </div>
          </div>

          {/* ── Table ── */}
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#e8e8e8]">
                {["Titre", "Type", "Niveau", "Lien", ""].map((h) => (
                  <th key={h} className="px-[18px] py-2.5 text-[11px] font-semibold text-[#888] text-left tracking-[0.3px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-10">
                  <div className="w-6 h-6 border-2 border-[#e8e8e8] border-t-[#111] rounded-full animate-spin mx-auto" />
                </td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-[13px] text-[#888]">Aucune ressource trouvée</td></tr>
              ) : (
                paginated.map((r) => {
                  const t = TYPE_STYLES[r.type] || TYPE_STYLES["document"];
                  const niveauClass = NIVEAU_STYLES[r.niveau] || "bg-[#f0f0f0] text-[#888]";
                  return (
                    <tr key={r._id} className="border-b border-[#e8e8e8] last:border-b-0 hover:bg-[#f9f9f9] transition-colors group">
                      <td className="px-[18px] py-3 text-[13px] font-medium">{r.titre}</td>
                      <td className="px-[18px] py-3">
                        <span className={`text-[9px] font-bold px-2 py-1 rounded ${t.class}`}>{t.label}</span>
                      </td>
                      <td className="px-[18px] py-3">
                        {r.niveau
                          ? <span className={`text-[9px] font-bold px-2 py-1 rounded ${niveauClass}`}>{r.niveau}</span>
                          : <span className="text-[12px] text-[#ccc]">—</span>
                        }
                      </td>
                      <td className="px-[18px] py-3 text-[12px] font-mono text-[#888] max-w-[160px] truncate">{r.lien}</td>
                      <td className="px-[18px] py-3">
                        <RowActions
                          onEdit={() => { setEditing(r); setModal(true); }}
                          onDelete={() => handleDelete(r._id)}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          <Pagination page={page} total={totalPages} onChange={setPage} />
        </div>
      </div>
      <RessourceModal
        open={modalOpen}
        onClose={() => { setModal(false); setEditing(null); }}
        onSave={handleSave}
        initial={editing}
      />
    </>
  );
}

// ─── SoumissionsPage ──────────────────────────────────────────────────────────
export function SoumissionsPage() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/submissions/all")
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = data.filter((s) =>
    JSON.stringify(s).toLowerCase().includes(search.toLowerCase()),
  );

  // Pagination
  const { page, setPage, paginated, totalPages } = usePagination(filtered, 10);
  useEffect(() => { setPage(1); }, [search]);

  return (
    <>
      <AdminTopbar title="Soumissions" subtitle="Historique des analyses générées" />
      <div className="p-7">
        <div className="border border-[#e8e8e8] rounded-xl overflow-hidden">
          <div className="px-[18px] py-3.5 border-b border-[#e8e8e8] flex items-center justify-between">
            <div>
              <h3 className="text-[13px] font-semibold">Toutes les soumissions</h3>
              <p className="text-[11px] text-[#888] mt-0.5">
                {data.length} soumission{data.length > 1 ? "s" : ""} au total
              </p>
            </div>
            <SearchInput value={search} onChange={setSearch} />
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#e8e8e8]">
                {["Étudiant", "Filière", "Semestre", "Objectifs", "Date"].map((h) => (
                  <th key={h} className="px-[18px] py-2.5 text-[11px] font-semibold text-[#888] text-left tracking-[0.3px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-10">
                  <div className="w-6 h-6 border-2 border-[#e8e8e8] border-t-[#111] rounded-full animate-spin mx-auto" />
                </td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-[13px] text-[#888]">Aucune soumission trouvée</td></tr>
              ) : (
                paginated.map((s) => (
                  <tr key={s._id} className="border-b border-[#e8e8e8] last:border-b-0 hover:bg-[#f9f9f9] transition-colors">
                    <td className="px-[18px] py-3 text-[13px] font-medium">
                      {s.userId ? `${s.userId.prenom} ${s.userId.nom}` : "—"}
                    </td>
                    <td className="px-[18px] py-3 text-[12px] text-[#888]">
                      {s.filiereId?.nom_filiere || "—"}
                    </td>
                    <td className="px-[18px] py-3 text-[12px] text-[#888]">{s.semestre}</td>
                    <td className="px-[18px] py-3 text-[12px] text-[#888] max-w-[180px] truncate">
                      {Array.isArray(s.objectifs) ? s.objectifs.join(", ") : s.objectifs}
                    </td>
                    <td className="px-[18px] py-3 text-[12px] font-mono text-[#888]">
                      {new Date(s.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <Pagination page={page} total={totalPages} onChange={setPage} />
        </div>
      </div>
    </>
  );
}
