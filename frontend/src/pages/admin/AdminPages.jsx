// ─── ModulesPage ──────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import AdminTopbar from "../../components/admin/AdminTopbar";
import { RowActions } from "../../components/admin/RowActions";
import SearchInput from "../../components/admin/SearchInput";
import ModuleModal from "../../components/admin/modals/ModuleModal";
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

  useEffect(() => {
    fetchModules();
  }, []);

  // Backend populate: id_filiere → { _id, nom_filiere }
  const filtered = data.filter(
    (m) =>
      (m.nom_module ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (m.id_filiere?.nom_filiere ?? "")
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  async function handleSave(item) {
    try {
      if (editing) {
        // PUT /api/modules/:id — backend attend: nom_module, semestre, id_filiere
        await api.put(`/modules/${item._id}`, {
          nom_module: item.nom_module,
          semestre: item.semestre,
          id_filiere: item.id_filiere,
        });
      } else {
        // POST /api/modules — backend attend: nom_module, semestre, id_filiere
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
      alert(
        "Erreur lors de la suppression : " +
          (err.response?.data?.message || err.message),
      );
    }
  }

  return (
    <>
      <AdminTopbar
        title='Modules'
        subtitle={`${data.length} modules configurés`}
      />
      <div className='p-7'>
        <div className='border border-[#e8e8e8] rounded-xl overflow-hidden'>
          <div className='px-[18px] py-3.5 border-b border-[#e8e8e8] flex items-center justify-between'>
            <div>
              <h3 className='text-[13px] font-semibold'>Tous les modules</h3>
              <p className='text-[11px] text-[#888] mt-0.5'>
                {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
              </p>
            </div>
            <div className='flex items-center gap-2'>
              <SearchInput
                value={search}
                onChange={setSearch}
              />
              <button
                onClick={() => {
                  setEditing(null);
                  setModal(true);
                }}
                className='flex items-center gap-1.5 px-3.5 py-[7px] bg-[#111] text-white text-[12px] font-medium rounded-lg hover:bg-[#333] transition-colors'
              >
                + Ajouter
              </button>
            </div>
          </div>
          <table className='w-full border-collapse'>
            <thead>
              <tr className='border-b border-[#e8e8e8]'>
                {["Nom du module", "Filière", "Semestre", ""].map((h) => (
                  <th
                    key={h}
                    className='px-[18px] py-2.5 text-[11px] font-semibold text-[#888] text-left tracking-[0.3px]'
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className='text-center py-10'
                  >
                    <div className='w-6 h-6 border-2 border-[#e8e8e8] border-t-[#111] rounded-full animate-spin mx-auto' />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className='text-center py-10 text-[13px] text-[#888]'
                  >
                    Aucun module trouvé
                  </td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr
                    key={m._id}
                    className='border-b border-[#e8e8e8] last:border-b-0 hover:bg-[#f9f9f9] transition-colors group'
                  >
                    <td className='px-[18px] py-3 text-[13px] font-medium'>
                      {m.nom_module}
                    </td>
                    <td className='px-[18px] py-3 text-[12px] text-[#888]'>
                      {/* id_filiere est populé par le backend avec nom_filiere */}
                      {m.id_filiere?.nom_filiere ?? "—"}
                    </td>
                    <td className='px-[18px] py-3 text-[12px] font-mono text-[#888]'>
                      {m.semestre}
                    </td>
                    <td className='px-[18px] py-3'>
                      <RowActions
                        onEdit={() => {
                          setEditing(m);
                          setModal(true);
                        }}
                        onDelete={() => handleDelete(m._id)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ModuleModal
        open={modalOpen}
        onClose={() => {
          setModal(false);
          setEditing(null);
        }}
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

  useEffect(() => {
    fetchMatieres();
  }, []);

  const filtered = data.filter((m) =>
    (m.nom_matiere ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  async function handleSave(item) {
    try {
      if (editing) {
        // PUT /api/matieres/:id — backend attend: nom_matiere, moduleId, difficultes[]
        await api.put(`/matieres/${item._id}`, {
          nom_matiere: item.nom_matiere,
          moduleId: item.moduleId,
          difficultes: item.difficultes,
        });
      } else {
        // POST /api/matieres — backend attend: nom_matiere, moduleId, difficultes[]
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
      alert(
        "Erreur lors de la suppression : " +
          (err.response?.data?.message || err.message),
      );
    }
  }

  return (
    <>
      <AdminTopbar
        title='Matières'
        subtitle={`${data.length} matières configurées`}
      />
      <div className='p-7'>
        <div className='border border-[#e8e8e8] rounded-xl overflow-hidden'>
          <div className='px-[18px] py-3.5 border-b border-[#e8e8e8] flex items-center justify-between'>
            <div>
              <h3 className='text-[13px] font-semibold'>Toutes les matières</h3>
              <p className='text-[11px] text-[#888] mt-0.5'>
                {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
              </p>
            </div>
            <div className='flex items-center gap-2'>
              <SearchInput
                value={search}
                onChange={setSearch}
              />
              <button
                onClick={() => {
                  setEditing(null);
                  setModal(true);
                }}
                className='flex items-center gap-1.5 px-3.5 py-[7px] bg-[#111] text-white text-[12px] font-medium rounded-lg hover:bg-[#333] transition-colors'
              >
                + Ajouter
              </button>
            </div>
          </div>
          <table className='w-full border-collapse'>
            <thead>
              <tr className='border-b border-[#e8e8e8]'>
                {["Nom de la matière", "Difficultés", ""].map((h) => (
                  <th
                    key={h}
                    className='px-[18px] py-2.5 text-[11px] font-semibold text-[#888] text-left tracking-[0.3px]'
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={3}
                    className='text-center py-10'
                  >
                    <div className='w-6 h-6 border-2 border-[#e8e8e8] border-t-[#111] rounded-full animate-spin mx-auto' />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className='text-center py-10 text-[13px] text-[#888]'
                  >
                    Aucune matière trouvée
                  </td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr
                    key={m._id}
                    className='border-b border-[#e8e8e8] last:border-b-0 hover:bg-[#f9f9f9] transition-colors group'
                  >
                    <td className='px-[18px] py-3 text-[13px] font-medium'>
                      {m.nom_matiere}
                    </td>
                    <td className='px-[18px] py-3 text-[12px] text-[#888]'>
                      {/* difficultes est un array dans le backend */}
                      {Array.isArray(m.difficultes) && m.difficultes.length > 0
                        ? `${m.difficultes.length} difficulté${m.difficultes.length > 1 ? "s" : ""}`
                        : "—"}
                    </td>
                    <td className='px-[18px] py-3'>
                      <RowActions
                        onEdit={() => {
                          setEditing(m);
                          setModal(true);
                        }}
                        onDelete={() => handleDelete(m._id)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <MatiereModal
        open={modalOpen}
        onClose={() => {
          setModal(false);
          setEditing(null);
        }}
        onSave={handleSave}
        initial={editing}
      />
    </>
  );
}

// ─── RessourcesPage ─── CONNECTÉE AU BACKEND ──────────────────────────────────
import RessourceModal from "../../components/admin/modals/RessourceModal";

export function RessourcesPage() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const TYPE_STYLES = {
    video: { label: "Vidéo", class: "bg-red-100 text-red-700" },
    document: { label: "Document", class: "bg-blue-100 text-blue-700" },
    "TP/TD": { label: "TP / TD", class: "bg-amber-100 text-amber-700" },
    "site web": { label: "Site web", class: "bg-green-100 text-green-700" },
  };

  useEffect(() => {
    api
      .get("/ressources")
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = data.filter((r) =>
    r.titre.toLowerCase().includes(search.toLowerCase()),
  );

  async function handleSave(item) {
    try {
      if (editing) {
        const res = await api.put(`/ressources/${item._id}`, {
          titre: item.titre,
          description: item.description || "",
          lien: item.lien,
          type: item.type,
          matiereId: item.matiereId,
          filiereId: item.filiereId,
          niveau: item.niveau || "",
        });
        setData((d) => d.map((r) => (r._id === item._id ? res.data : r)));
      } else {
        const res = await api.post("/ressources", {
          titre: item.titre,
          description: item.description || "",
          lien: item.lien,
          type: item.type,
          matiereId: item.matiereId,
          filiereId: item.filiereId,
          niveau: item.niveau || "",
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
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  }

  return (
    <>
      <AdminTopbar
        title='Ressources'
        subtitle={`${data.length} ressources disponibles`}
      />
      <div className='p-7'>
        <div className='border border-[#e8e8e8] rounded-xl overflow-hidden'>
          <div className='px-[18px] py-3.5 border-b border-[#e8e8e8] flex items-center justify-between'>
            <div>
              <h3 className='text-[13px] font-semibold'>
                Toutes les ressources
              </h3>
              <p className='text-[11px] text-[#888] mt-0.5'>
                {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
              </p>
            </div>
            <div className='flex items-center gap-2'>
              <SearchInput
                value={search}
                onChange={setSearch}
              />
              <button
                onClick={() => {
                  setEditing(null);
                  setModal(true);
                }}
                className='flex items-center gap-1.5 px-3.5 py-[7px] bg-[#111] text-white text-[12px] font-medium rounded-lg hover:bg-[#333] transition-colors'
              >
                + Ajouter
              </button>
            </div>
          </div>
          <table className='w-full border-collapse'>
            <thead>
              <tr className='border-b border-[#e8e8e8]'>
                {["Titre", "Type", "Lien", ""].map((h) => (
                  <th
                    key={h}
                    className='px-[18px] py-2.5 text-[11px] font-semibold text-[#888] text-left tracking-[0.3px]'
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className='text-center py-10'
                  >
                    <div className='w-6 h-6 border-2 border-[#e8e8e8] border-t-[#111] rounded-full animate-spin mx-auto' />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className='text-center py-10 text-[13px] text-[#888]'
                  >
                    Aucune ressource trouvée
                  </td>
                </tr>
              ) : (
                filtered.map((r) => {
                  const t = TYPE_STYLES[r.type] || TYPE_STYLES["document"];
                  return (
                    <tr
                      key={r._id}
                      className='border-b border-[#e8e8e8] last:border-b-0 hover:bg-[#f9f9f9] transition-colors group'
                    >
                      <td className='px-[18px] py-3 text-[13px] font-medium'>
                        {r.titre}
                      </td>
                      <td className='px-[18px] py-3'>
                        <span
                          className={`text-[9px] font-bold px-2 py-1 rounded ${t.class}`}
                        >
                          {t.label}
                        </span>
                      </td>
                      <td className='px-[18px] py-3 text-[12px] font-mono text-[#888] max-w-[160px] truncate'>
                        {r.lien}
                      </td>
                      <td className='px-[18px] py-3'>
                        <RowActions
                          onEdit={() => {
                            setEditing(r);
                            setModal(true);
                          }}
                          onDelete={() => handleDelete(r._id)}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <RessourceModal
        open={modalOpen}
        onClose={() => {
          setModal(false);
          setEditing(null);
        }}
        onSave={handleSave}
        initial={editing}
      />
    </>
  );
}

// ─── SoumissionsPage ─── CONNECTÉE AU BACKEND ─────────────────────────────────
export function SoumissionsPage() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/submissions/recent")
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = data.filter((s) =>
    JSON.stringify(s).toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <AdminTopbar
        title='Soumissions'
        subtitle='Historique des analyses générées'
      />
      <div className='p-7'>
        <div className='border border-[#e8e8e8] rounded-xl overflow-hidden'>
          <div className='px-[18px] py-3.5 border-b border-[#e8e8e8] flex items-center justify-between'>
            <div>
              <h3 className='text-[13px] font-semibold'>
                Toutes les soumissions
              </h3>
              <p className='text-[11px] text-[#888] mt-0.5'>
                {data.length} soumission{data.length > 1 ? "s" : ""} au total
              </p>
            </div>
            <SearchInput
              value={search}
              onChange={setSearch}
            />
          </div>
          <table className='w-full border-collapse'>
            <thead>
              <tr className='border-b border-[#e8e8e8]'>
                {["Étudiant", "Filière", "Semestre", "Objectifs", "Date"].map(
                  (h) => (
                    <th
                      key={h}
                      className='px-[18px] py-2.5 text-[11px] font-semibold text-[#888] text-left tracking-[0.3px]'
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className='text-center py-10'
                  >
                    <div className='w-6 h-6 border-2 border-[#e8e8e8] border-t-[#111] rounded-full animate-spin mx-auto' />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className='text-center py-10 text-[13px] text-[#888]'
                  >
                    Aucune soumission trouvée
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr
                    key={s._id}
                    className='border-b border-[#e8e8e8] last:border-b-0 hover:bg-[#f9f9f9] transition-colors'
                  >
                    <td className='px-[18px] py-3 text-[13px] font-medium'>
                      {`${s.userId?.prenom} ${s.userId?.nom}` || "—"}
                    </td>
                    <td className='px-[18px] py-3 text-[13px] font-medium'>
                      {s.filiereId?.nom_filiere || "—"}
                    </td>
                    <td className='px-[18px] py-3 text-[12px] text-[#888]'>
                      {s.semestre}
                    </td>
                    <td className='px-[18px] py-3 text-[12px] text-[#888] max-w-[180px] truncate'>
                      {Array.isArray(s.objectifs)
                        ? s.objectifs.join(", ")
                        : s.objectifs}
                    </td>
                    <td className='px-[18px] py-3 text-[12px] font-mono text-[#888]'>
                      {new Date(s.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
