// ─── ModulesPage ──────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import AdminTopbar from "../../components/admin/AdminTopbar";
import { RowActions } from "../../components/admin/RowActions";
import SearchInput from "../../components/admin/SearchInput";
import ModuleModal from "../../components/admin/modals/ModuleModal";
import api from "../../api/axios";

<<<<<<< HEAD
export function ModulesPage() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [modalOpen, setModal] = useState(false);
  const [editing, setEditing] = useState(null);

  // ── Charger tous les modules ─────────────────────────────────────────────────
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
      (m.nom ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (m.filiere?.nom_filiere ?? m.filiere?.nom ?? m.filiere ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  // ── Ajouter ou modifier ──────────────────────────────────────────────────────
  async function handleSave(item) {
    try {
      if (editing) {
        await api.put(`/modules/${item._id}`, {
          nom:      item.nom,
          semestre: item.semestre,
          filiere:  item.filiere,
        });
      } else {
        await api.post("/modules", {
          nom:      item.nom,
          semestre: item.semestre,
          filiere:  item.filiere,
        });
      }
      setModal(false);
      setEditing(null);
      await fetchModules();
    } catch (err) {
      alert("Erreur : " + (err.response?.data?.message || err.message));
    }
  }

  // ── Supprimer ────────────────────────────────────────────────────────────────
  async function handleDelete(id) {
    if (!confirm("Supprimer ce module ?")) return;
    try {
      await api.delete(`/modules/${id}`);
      await fetchModules();
    } catch (err) {
      alert("Erreur lors de la suppression : " + (err.response?.data?.message || err.message));
    }
=======
const INIT_MODULES = [
  {
    _id: "1",
    nom: "Génie Logiciel",
    filiere: "4IIR",
    semestre: "S6",
    matieres: 4,
  },
  {
    _id: "2",
    nom: "Intelligence Artificielle",
    filiere: "4IIR",
    semestre: "S6",
    matieres: 3,
  },
  {
    _id: "3",
    nom: "Algorithmique avancée",
    filiere: "4IIR",
    semestre: "S5",
    matieres: 3,
  },
  {
    _id: "4",
    nom: "Réseaux & Sécurité",
    filiere: "4IIR",
    semestre: "S5",
    matieres: 3,
  },
  {
    _id: "5",
    nom: "Développement Web & Mobile",
    filiere: "4IIR",
    semestre: "S6",
    matieres: 3,
  },
  { _id: "6", nom: "Béton armé", filiere: "GC", semestre: "S5", matieres: 2 },
];

export function ModulesPage() {
  const [data, setData] = useState(INIT_MODULES);
  const [search, setSearch] = useState("");
  const [modalOpen, setModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const filtered = data.filter(
    (m) =>
      m.nom.toLowerCase().includes(search.toLowerCase()) ||
      m.filiere.toLowerCase().includes(search.toLowerCase()),
  );

  function handleSave(item) {
    if (editing) setData((d) => d.map((m) => (m._id === item._id ? item : m)));
    else
      setData((d) => [
        ...d,
        { ...item, _id: Date.now().toString(), matieres: 0 },
      ]);
    setModal(false);
    setEditing(null);
  }

  function handleDelete(id) {
    if (confirm("Supprimer ce module ?"))
      setData((d) => d.filter((m) => m._id !== id));
>>>>>>> 1c627926790ba9575b87fe06b33482a4d21d8693
  }

  return (
    <>
<<<<<<< HEAD
      <AdminTopbar title='Modules' subtitle={`${data.length} modules configurés`} />
=======
      <AdminTopbar
        title='Modules'
        subtitle={`${data.length} modules configurés`}
      />
>>>>>>> 1c627926790ba9575b87fe06b33482a4d21d8693
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
<<<<<<< HEAD
              <SearchInput value={search} onChange={setSearch} />
              <button
                onClick={() => { setEditing(null); setModal(true); }}
=======
              <SearchInput
                value={search}
                onChange={setSearch}
              />
              <button
                onClick={() => {
                  setEditing(null);
                  setModal(true);
                }}
>>>>>>> 1c627926790ba9575b87fe06b33482a4d21d8693
                className='flex items-center gap-1.5 px-3.5 py-[7px] bg-[#111] text-white text-[12px] font-medium rounded-lg hover:bg-[#333] transition-colors'
              >
                + Ajouter
              </button>
            </div>
          </div>
          <table className='w-full border-collapse'>
            <thead>
              <tr className='border-b border-[#e8e8e8]'>
<<<<<<< HEAD
                {["Nom du module", "Filière", "Semestre", "Matières", ""].map((h) => (
                  <th key={h} className='px-[18px] py-2.5 text-[11px] font-semibold text-[#888] text-left tracking-[0.3px]'>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className='text-center py-10'>
                  <div className='w-6 h-6 border-2 border-[#e8e8e8] border-t-[#111] rounded-full animate-spin mx-auto' />
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className='text-center py-10 text-[13px] text-[#888]'>Aucun module trouvé</td></tr>
              ) : (
                filtered.map((m) => (
                  <tr key={m._id} className='border-b border-[#e8e8e8] last:border-b-0 hover:bg-[#f9f9f9] transition-colors group'>
                    <td className='px-[18px] py-3 text-[13px] font-medium'>{m.nom}</td>
                    <td className='px-[18px] py-3 text-[12px] text-[#888]'>
                      {m.filiere?.nom_filiere ?? m.filiere?.nom ?? m.filiere ?? "—"}
                    </td>
                    <td className='px-[18px] py-3 text-[12px] font-mono text-[#888]'>{m.semestre}</td>
                    <td className='px-[18px] py-3 text-[12px] text-[#888]'>{m.matieres ?? 0} matières</td>
                    <td className='px-[18px] py-3'>
                      <RowActions
                        onEdit={() => { setEditing(m); setModal(true); }}
=======
                {["Nom du module", "Filière", "Semestre", "Matières", ""].map(
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
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
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
                      {m.nom}
                    </td>
                    <td className='px-[18px] py-3 text-[12px] text-[#888]'>
                      {m.filiere}
                    </td>
                    <td className='px-[18px] py-3 text-[12px] font-mono text-[#888]'>
                      {m.semestre}
                    </td>
                    <td className='px-[18px] py-3 text-[12px] text-[#888]'>
                      {m.matieres} matières
                    </td>
                    <td className='px-[18px] py-3'>
                      <RowActions
                        onEdit={() => {
                          setEditing(m);
                          setModal(true);
                        }}
>>>>>>> 1c627926790ba9575b87fe06b33482a4d21d8693
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
<<<<<<< HEAD
        onClose={() => { setModal(false); setEditing(null); }}
=======
        onClose={() => {
          setModal(false);
          setEditing(null);
        }}
>>>>>>> 1c627926790ba9575b87fe06b33482a4d21d8693
        onSave={handleSave}
        initial={editing}
      />
    </>
  );
}

// ─── MatieresPage ─────────────────────────────────────────────────────────────
import MatiereModal from "../../components/admin/modals/MatiereModal";

<<<<<<< HEAD
export function MatieresPage() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [modalOpen, setModal] = useState(false);
  const [editing, setEditing] = useState(null);

  // ── Charger toutes les matières ──────────────────────────────────────────────
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

  const filtered = data.filter(
    (m) =>
      (m.nom_matiere ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (m.module?.nom ?? m.module ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  // ── Ajouter ou modifier ──────────────────────────────────────────────────────
  async function handleSave(item) {
    try {
      if (editing) {
        await api.put(`/matieres/${item._id}`, {
          nom_matiere: item.nom_matiere,
          module:      item.module,
        });
      } else {
        await api.post("/matieres", {
          nom_matiere: item.nom_matiere,
          module:      item.module,
        });
      }
      setModal(false);
      setEditing(null);
      await fetchMatieres();
    } catch (err) {
      alert("Erreur : " + (err.response?.data?.message || err.message));
    }
  }

  // ── Supprimer ────────────────────────────────────────────────────────────────
  async function handleDelete(id) {
    if (!confirm("Supprimer cette matière ?")) return;
    try {
      await api.delete(`/matieres/${id}`);
      await fetchMatieres();
    } catch (err) {
      alert("Erreur lors de la suppression : " + (err.response?.data?.message || err.message));
    }
=======
const INIT_MATIERES = [
  {
    _id: "1",
    nom: "Conception UML",
    module: "Génie Logiciel",
    difficultes: "5 difficultés",
    ressources: 3,
  },
  {
    _id: "2",
    nom: "Design Patterns",
    module: "Génie Logiciel",
    difficultes: "4 difficultés",
    ressources: 2,
  },
  {
    _id: "3",
    nom: "Machine Learning",
    module: "Intelligence Artificielle",
    difficultes: "6 difficultés",
    ressources: 4,
  },
  {
    _id: "4",
    nom: "Protocoles TCP/IP",
    module: "Réseaux & Sécurité",
    difficultes: "4 difficultés",
    ressources: 2,
  },
  {
    _id: "5",
    nom: "React JS",
    module: "Développement Web & Mobile",
    difficultes: "5 difficultés",
    ressources: 3,
  },
  {
    _id: "6",
    nom: "Structures de données",
    module: "Algorithmique avancée",
    difficultes: "3 difficultés",
    ressources: 2,
  },
];

export function MatieresPage() {
  const [data, setData] = useState(INIT_MATIERES);
  const [search, setSearch] = useState("");
  const [modalOpen, setModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const filtered = data.filter(
    (m) =>
      m.nom.toLowerCase().includes(search.toLowerCase()) ||
      m.module.toLowerCase().includes(search.toLowerCase()),
  );

  function handleSave(item) {
    if (editing) setData((d) => d.map((m) => (m._id === item._id ? item : m)));
    else
      setData((d) => [
        ...d,
        { ...item, _id: Date.now().toString(), ressources: 0 },
      ]);
    setModal(false);
    setEditing(null);
  }

  function handleDelete(id) {
    if (confirm("Supprimer cette matière ?"))
      setData((d) => d.filter((m) => m._id !== id));
>>>>>>> 1c627926790ba9575b87fe06b33482a4d21d8693
  }

  return (
    <>
<<<<<<< HEAD
      <AdminTopbar title='Matières' subtitle={`${data.length} matières configurées`} />
=======
      <AdminTopbar
        title='Matières'
        subtitle={`${data.length} matières configurées`}
      />
>>>>>>> 1c627926790ba9575b87fe06b33482a4d21d8693
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
<<<<<<< HEAD
              <SearchInput value={search} onChange={setSearch} />
              <button
                onClick={() => { setEditing(null); setModal(true); }}
=======
              <SearchInput
                value={search}
                onChange={setSearch}
              />
              <button
                onClick={() => {
                  setEditing(null);
                  setModal(true);
                }}
>>>>>>> 1c627926790ba9575b87fe06b33482a4d21d8693
                className='flex items-center gap-1.5 px-3.5 py-[7px] bg-[#111] text-white text-[12px] font-medium rounded-lg hover:bg-[#333] transition-colors'
              >
                + Ajouter
              </button>
            </div>
          </div>
          <table className='w-full border-collapse'>
            <thead>
              <tr className='border-b border-[#e8e8e8]'>
<<<<<<< HEAD
                {["Nom de la matière", "Module", "Difficultés", "Ressources", ""].map((h) => (
                  <th key={h} className='px-[18px] py-2.5 text-[11px] font-semibold text-[#888] text-left tracking-[0.3px]'>{h}</th>
=======
                {[
                  "Nom de la matière",
                  "Module",
                  "Difficultés",
                  "Ressources",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className='px-[18px] py-2.5 text-[11px] font-semibold text-[#888] text-left tracking-[0.3px]'
                  >
                    {h}
                  </th>
>>>>>>> 1c627926790ba9575b87fe06b33482a4d21d8693
                ))}
              </tr>
            </thead>
            <tbody>
<<<<<<< HEAD
              {loading ? (
                <tr><td colSpan={5} className='text-center py-10'>
                  <div className='w-6 h-6 border-2 border-[#e8e8e8] border-t-[#111] rounded-full animate-spin mx-auto' />
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className='text-center py-10 text-[13px] text-[#888]'>Aucune matière trouvée</td></tr>
              ) : (
                filtered.map((m) => (
                  <tr key={m._id} className='border-b border-[#e8e8e8] last:border-b-0 hover:bg-[#f9f9f9] transition-colors group'>
                    <td className='px-[18px] py-3 text-[13px] font-medium'>{m.nom_matiere}</td>
                    <td className='px-[18px] py-3 text-[12px] text-[#888]'>
                      {m.module?.nom ?? m.module ?? "—"}
                    </td>
                    <td className='px-[18px] py-3 text-[12px] text-[#888]'>{m.difficultes ?? "—"}</td>
                    <td className='px-[18px] py-3 text-[12px] text-[#888]'>{m.ressources ?? 0} ressources</td>
                    <td className='px-[18px] py-3'>
                      <RowActions
                        onEdit={() => { setEditing(m); setModal(true); }}
=======
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
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
                      {m.nom}
                    </td>
                    <td className='px-[18px] py-3 text-[12px] text-[#888]'>
                      {m.module}
                    </td>
                    <td className='px-[18px] py-3 text-[12px] text-[#888]'>
                      {m.difficultes}
                    </td>
                    <td className='px-[18px] py-3 text-[12px] text-[#888]'>
                      {m.ressources} ressources
                    </td>
                    <td className='px-[18px] py-3'>
                      <RowActions
                        onEdit={() => {
                          setEditing(m);
                          setModal(true);
                        }}
>>>>>>> 1c627926790ba9575b87fe06b33482a4d21d8693
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
<<<<<<< HEAD
        onClose={() => { setModal(false); setEditing(null); }}
=======
        onClose={() => {
          setModal(false);
          setEditing(null);
        }}
>>>>>>> 1c627926790ba9575b87fe06b33482a4d21d8693
        onSave={handleSave}
        initial={editing}
      />
    </>
  );
}

// ─── RessourcesPage ─── CONNECTÉE AU BACKEND ──────────────────────────────────
import RessourceModal from "../../components/admin/modals/RessourceModal";

export function RessourcesPage() {
<<<<<<< HEAD
  const [data, setData]       = useState([]);
  const [search, setSearch]   = useState("");
=======
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
>>>>>>> 1c627926790ba9575b87fe06b33482a4d21d8693
  const [modalOpen, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const TYPE_STYLES = {
<<<<<<< HEAD
    video:      { label: "Vidéo",    class: "bg-red-100 text-red-700"    },
    document:   { label: "Document", class: "bg-blue-100 text-blue-700"  },
    "TP/TD":    { label: "TP / TD",  class: "bg-amber-100 text-amber-700"},
    "site web": { label: "Site web", class: "bg-green-100 text-green-700"},
=======
    video: { label: "Vidéo", class: "bg-red-100 text-red-700" },
    document: { label: "Document", class: "bg-blue-100 text-blue-700" },
    "TP/TD": { label: "TP / TD", class: "bg-amber-100 text-amber-700" },
    "site web": { label: "Site web", class: "bg-green-100 text-green-700" },
>>>>>>> 1c627926790ba9575b87fe06b33482a4d21d8693
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
<<<<<<< HEAD
          titre: item.titre, description: item.description || "",
          lien: item.lien, type: item.type,
          matiereId: item.matiereId, filiereId: item.filiereId, niveau: item.niveau || "",
=======
          titre: item.titre,
          description: item.description || "",
          lien: item.lien,
          type: item.type,
          matiereId: item.matiereId,
          filiereId: item.filiereId,
          niveau: item.niveau || "",
>>>>>>> 1c627926790ba9575b87fe06b33482a4d21d8693
        });
        setData((d) => d.map((r) => (r._id === item._id ? res.data : r)));
      } else {
        const res = await api.post("/ressources", {
<<<<<<< HEAD
          titre: item.titre, description: item.description || "",
          lien: item.lien, type: item.type,
          matiereId: item.matiereId, filiereId: item.filiereId, niveau: item.niveau || "",
=======
          titre: item.titre,
          description: item.description || "",
          lien: item.lien,
          type: item.type,
          matiereId: item.matiereId,
          filiereId: item.filiereId,
          niveau: item.niveau || "",
>>>>>>> 1c627926790ba9575b87fe06b33482a4d21d8693
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
<<<<<<< HEAD
      <AdminTopbar title='Ressources' subtitle={`${data.length} ressources disponibles`} />
=======
      <AdminTopbar
        title='Ressources'
        subtitle={`${data.length} ressources disponibles`}
      />
>>>>>>> 1c627926790ba9575b87fe06b33482a4d21d8693
      <div className='p-7'>
        <div className='border border-[#e8e8e8] rounded-xl overflow-hidden'>
          <div className='px-[18px] py-3.5 border-b border-[#e8e8e8] flex items-center justify-between'>
            <div>
<<<<<<< HEAD
              <h3 className='text-[13px] font-semibold'>Toutes les ressources</h3>
=======
              <h3 className='text-[13px] font-semibold'>
                Toutes les ressources
              </h3>
>>>>>>> 1c627926790ba9575b87fe06b33482a4d21d8693
              <p className='text-[11px] text-[#888] mt-0.5'>
                {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
              </p>
            </div>
            <div className='flex items-center gap-2'>
<<<<<<< HEAD
              <SearchInput value={search} onChange={setSearch} />
              <button
                onClick={() => { setEditing(null); setModal(true); }}
=======
              <SearchInput
                value={search}
                onChange={setSearch}
              />
              <button
                onClick={() => {
                  setEditing(null);
                  setModal(true);
                }}
>>>>>>> 1c627926790ba9575b87fe06b33482a4d21d8693
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
<<<<<<< HEAD
                  <th key={h} className='px-[18px] py-2.5 text-[11px] font-semibold text-[#888] text-left tracking-[0.3px]'>{h}</th>
=======
                  <th
                    key={h}
                    className='px-[18px] py-2.5 text-[11px] font-semibold text-[#888] text-left tracking-[0.3px]'
                  >
                    {h}
                  </th>
>>>>>>> 1c627926790ba9575b87fe06b33482a4d21d8693
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
<<<<<<< HEAD
                <tr><td colSpan={4} className='text-center py-10'>
                  <div className='w-6 h-6 border-2 border-[#e8e8e8] border-t-[#111] rounded-full animate-spin mx-auto' />
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className='text-center py-10 text-[13px] text-[#888]'>Aucune ressource trouvée</td></tr>
=======
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
>>>>>>> 1c627926790ba9575b87fe06b33482a4d21d8693
              ) : (
                filtered.map((r) => {
                  const t = TYPE_STYLES[r.type] || TYPE_STYLES["document"];
                  return (
<<<<<<< HEAD
                    <tr key={r._id} className='border-b border-[#e8e8e8] last:border-b-0 hover:bg-[#f9f9f9] transition-colors group'>
                      <td className='px-[18px] py-3 text-[13px] font-medium'>{r.titre}</td>
                      <td className='px-[18px] py-3'>
                        <span className={`text-[9px] font-bold px-2 py-1 rounded ${t.class}`}>{t.label}</span>
                      </td>
                      <td className='px-[18px] py-3 text-[12px] font-mono text-[#888] max-w-[160px] truncate'>{r.lien}</td>
                      <td className='px-[18px] py-3'>
                        <RowActions
                          onEdit={() => { setEditing(r); setModal(true); }}
=======
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
>>>>>>> 1c627926790ba9575b87fe06b33482a4d21d8693
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
<<<<<<< HEAD
  const [data, setData]       = useState([]);
  const [search, setSearch]   = useState("");
=======
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
>>>>>>> 1c627926790ba9575b87fe06b33482a4d21d8693
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/submissions/me")
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = data.filter((s) =>
    JSON.stringify(s).toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
<<<<<<< HEAD
      <AdminTopbar title='Soumissions' subtitle='Historique des analyses générées' />
=======
      <AdminTopbar
        title='Soumissions'
        subtitle='Historique des analyses générées'
      />
>>>>>>> 1c627926790ba9575b87fe06b33482a4d21d8693
      <div className='p-7'>
        <div className='border border-[#e8e8e8] rounded-xl overflow-hidden'>
          <div className='px-[18px] py-3.5 border-b border-[#e8e8e8] flex items-center justify-between'>
            <div>
<<<<<<< HEAD
              <h3 className='text-[13px] font-semibold'>Toutes les soumissions</h3>
=======
              <h3 className='text-[13px] font-semibold'>
                Toutes les soumissions
              </h3>
>>>>>>> 1c627926790ba9575b87fe06b33482a4d21d8693
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
<<<<<<< HEAD
                {["Filière", "Semestre", "Difficultés", "Objectifs", "Date"].map((h) => (
                  <th key={h} className='px-[18px] py-2.5 text-[11px] font-semibold text-[#888] text-left tracking-[0.3px]'>{h}</th>
=======
                {[
                  "Filière",
                  "Semestre",
                  "Difficultés",
                  "Objectifs",
                  "Date",
                ].map((h) => (
                  <th
                    key={h}
                    className='px-[18px] py-2.5 text-[11px] font-semibold text-[#888] text-left tracking-[0.3px]'
                  >
                    {h}
                  </th>
>>>>>>> 1c627926790ba9575b87fe06b33482a4d21d8693
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
<<<<<<< HEAD
                <tr><td colSpan={5} className='text-center py-10'>
                  <div className='w-6 h-6 border-2 border-[#e8e8e8] border-t-[#111] rounded-full animate-spin mx-auto' />
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className='text-center py-10 text-[13px] text-[#888]'>Aucune soumission trouvée</td></tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s._id} className='border-b border-[#e8e8e8] last:border-b-0 hover:bg-[#f9f9f9] transition-colors'>
                    <td className='px-[18px] py-3 text-[13px] font-medium'>{s.filiereId?.nom_filiere || "—"}</td>
                    <td className='px-[18px] py-3 text-[12px] text-[#888]'>{s.semestre}</td>
                    <td className='px-[18px] py-3 text-[12px] text-[#888] max-w-[180px] truncate'>
                      {Array.isArray(s.difficultes) ? s.difficultes.join(", ") : s.difficultes}
                    </td>
                    <td className='px-[18px] py-3 text-[12px] text-[#888] max-w-[180px] truncate'>
                      {Array.isArray(s.objectifs) ? s.objectifs.join(", ") : s.objectifs}
=======
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
                      {s.filiereId?.nom_filiere || "—"}
                    </td>
                    <td className='px-[18px] py-3 text-[12px] text-[#888]'>
                      {s.semestre}
                    </td>
                    <td className='px-[18px] py-3 text-[12px] text-[#888] max-w-[180px] truncate'>
                      {Array.isArray(s.difficultes)
                        ? s.difficultes.join(", ")
                        : s.difficultes}
                    </td>
                    <td className='px-[18px] py-3 text-[12px] text-[#888] max-w-[180px] truncate'>
                      {Array.isArray(s.objectifs)
                        ? s.objectifs.join(", ")
                        : s.objectifs}
>>>>>>> 1c627926790ba9575b87fe06b33482a4d21d8693
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
