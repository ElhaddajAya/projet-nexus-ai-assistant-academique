// ─── ModulesPage ──────────────────────────────────────────────────────────────
import { useState } from "react";
import AdminTopbar from "../../components/admin/AdminTopbar";
import { RowActions } from "../../components/admin/RowActions";
import SearchInput from "../../components/admin/SearchInput";
import ModuleModal from "../../components/admin/modals/ModuleModal";

const INIT_MODULES = [
  { _id:"1", nom:"Génie Logiciel",              filiere:"4IIR", semestre:"S6", matieres:4 },
  { _id:"2", nom:"Intelligence Artificielle",   filiere:"4IIR", semestre:"S6", matieres:3 },
  { _id:"3", nom:"Algorithmique avancée",        filiere:"4IIR", semestre:"S5", matieres:3 },
  { _id:"4", nom:"Réseaux & Sécurité",          filiere:"4IIR", semestre:"S5", matieres:3 },
  { _id:"5", nom:"Développement Web & Mobile",  filiere:"4IIR", semestre:"S6", matieres:3 },
  { _id:"6", nom:"Béton armé",                  filiere:"GC",   semestre:"S5", matieres:2 },
];

export function ModulesPage() {
  const [data, setData]       = useState(INIT_MODULES);
  const [search, setSearch]   = useState("");
  const [modalOpen, setModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const filtered = data.filter((m) =>
    m.nom.toLowerCase().includes(search.toLowerCase()) ||
    m.filiere.toLowerCase().includes(search.toLowerCase())
  );

  function handleSave(item) {
    if (editing) setData((d) => d.map((m) => (m._id === item._id ? item : m)));
    else setData((d) => [...d, { ...item, _id: Date.now().toString(), matieres: 0 }]);
    setModal(false); setEditing(null);
  }

  function handleDelete(id) {
    if (confirm("Supprimer ce module ?")) setData((d) => d.filter((m) => m._id !== id));
  }

  return (
    <>
      <AdminTopbar title="Modules" subtitle={`${data.length} modules configurés`} />
      <div className="p-7">
        <div className="border border-[#e8e8e8] rounded-xl overflow-hidden">
          <div className="px-[18px] py-3.5 border-b border-[#e8e8e8] flex items-center justify-between">
            <div>
              <h3 className="text-[13px] font-semibold">Tous les modules</h3>
              <p className="text-[11px] text-[#888] mt-0.5">{filtered.length} résultat{filtered.length > 1 ? "s" : ""}</p>
            </div>
            <div className="flex items-center gap-2">
              <SearchInput value={search} onChange={setSearch} />
              <button onClick={() => { setEditing(null); setModal(true); }} className="flex items-center gap-1.5 px-3.5 py-[7px] bg-[#111] text-white text-[12px] font-medium rounded-lg hover:bg-[#333] transition-colors">
                + Ajouter
              </button>
            </div>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#e8e8e8]">
                {["Nom du module","Filière","Semestre","Matières",""].map((h) => (
                  <th key={h} className="px-[18px] py-2.5 text-[11px] font-semibold text-[#888] text-left tracking-[0.3px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-[13px] text-[#888]">Aucun module trouvé</td></tr>
              ) : filtered.map((m) => (
                <tr key={m._id} className="border-b border-[#e8e8e8] last:border-b-0 hover:bg-[#f9f9f9] transition-colors group">
                  <td className="px-[18px] py-3 text-[13px] font-medium">{m.nom}</td>
                  <td className="px-[18px] py-3 text-[12px] text-[#888]">{m.filiere}</td>
                  <td className="px-[18px] py-3 text-[12px] font-mono text-[#888]">{m.semestre}</td>
                  <td className="px-[18px] py-3 text-[12px] text-[#888]">{m.matieres} matières</td>
                  <td className="px-[18px] py-3">
                    <RowActions onEdit={() => { setEditing(m); setModal(true); }} onDelete={() => handleDelete(m._id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ModuleModal open={modalOpen} onClose={() => { setModal(false); setEditing(null); }} onSave={handleSave} initial={editing} />
    </>
  );
}

// ─── MatieresPage ─────────────────────────────────────────────────────────────
import MatiereModal from "../../components/admin/modals/MatiereModal";

const INIT_MATIERES = [
  { _id:"1", nom:"Conception UML",      module:"Génie Logiciel",            difficultes:"5 difficultés", ressources:3 },
  { _id:"2", nom:"Design Patterns",     module:"Génie Logiciel",            difficultes:"4 difficultés", ressources:2 },
  { _id:"3", nom:"Machine Learning",    module:"Intelligence Artificielle",  difficultes:"6 difficultés", ressources:4 },
  { _id:"4", nom:"Protocoles TCP/IP",   module:"Réseaux & Sécurité",        difficultes:"4 difficultés", ressources:2 },
  { _id:"5", nom:"React JS",            module:"Développement Web & Mobile", difficultes:"5 difficultés", ressources:3 },
  { _id:"6", nom:"Structures de données",module:"Algorithmique avancée",    difficultes:"3 difficultés", ressources:2 },
];

export function MatieresPage() {
  const [data, setData]       = useState(INIT_MATIERES);
  const [search, setSearch]   = useState("");
  const [modalOpen, setModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const filtered = data.filter((m) =>
    m.nom.toLowerCase().includes(search.toLowerCase()) ||
    m.module.toLowerCase().includes(search.toLowerCase())
  );

  function handleSave(item) {
    if (editing) setData((d) => d.map((m) => (m._id === item._id ? item : m)));
    else setData((d) => [...d, { ...item, _id: Date.now().toString(), ressources: 0 }]);
    setModal(false); setEditing(null);
  }

  function handleDelete(id) {
    if (confirm("Supprimer cette matière ?")) setData((d) => d.filter((m) => m._id !== id));
  }

  return (
    <>
      <AdminTopbar title="Matières" subtitle={`${data.length} matières configurées`} />
      <div className="p-7">
        <div className="border border-[#e8e8e8] rounded-xl overflow-hidden">
          <div className="px-[18px] py-3.5 border-b border-[#e8e8e8] flex items-center justify-between">
            <div>
              <h3 className="text-[13px] font-semibold">Toutes les matières</h3>
              <p className="text-[11px] text-[#888] mt-0.5">{filtered.length} résultat{filtered.length > 1 ? "s" : ""}</p>
            </div>
            <div className="flex items-center gap-2">
              <SearchInput value={search} onChange={setSearch} />
              <button onClick={() => { setEditing(null); setModal(true); }} className="flex items-center gap-1.5 px-3.5 py-[7px] bg-[#111] text-white text-[12px] font-medium rounded-lg hover:bg-[#333] transition-colors">
                + Ajouter
              </button>
            </div>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#e8e8e8]">
                {["Nom de la matière","Module","Difficultés","Ressources",""].map((h) => (
                  <th key={h} className="px-[18px] py-2.5 text-[11px] font-semibold text-[#888] text-left tracking-[0.3px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-[13px] text-[#888]">Aucune matière trouvée</td></tr>
              ) : filtered.map((m) => (
                <tr key={m._id} className="border-b border-[#e8e8e8] last:border-b-0 hover:bg-[#f9f9f9] transition-colors group">
                  <td className="px-[18px] py-3 text-[13px] font-medium">{m.nom}</td>
                  <td className="px-[18px] py-3 text-[12px] text-[#888]">{m.module}</td>
                  <td className="px-[18px] py-3 text-[12px] text-[#888]">{m.difficultes}</td>
                  <td className="px-[18px] py-3 text-[12px] text-[#888]">{m.ressources} ressources</td>
                  <td className="px-[18px] py-3">
                    <RowActions onEdit={() => { setEditing(m); setModal(true); }} onDelete={() => handleDelete(m._id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <MatiereModal open={modalOpen} onClose={() => { setModal(false); setEditing(null); }} onSave={handleSave} initial={editing} />
    </>
  );
}

// ─── RessourcesPage ───────────────────────────────────────────────────────────
import RessourceModal from "../../components/admin/modals/RessourceModal";

const TYPE_STYLES = {
  doc: { label: "Document", class: "bg-blue-100 text-blue-700" },
  vid: { label: "Vidéo",    class: "bg-red-100 text-red-700"   },
  tp:  { label: "TP / TD",  class: "bg-amber-100 text-amber-700"},
};

const INIT_RESSOURCES = [
  { _id:"1", titre:"Cours UML – Conception OO",  type:"doc", matiere:"Conception UML",  lien:"emsi.ma/uml.pdf"    },
  { _id:"2", titre:"UML – Héritage et composition",type:"vid",matiere:"Conception UML", lien:"youtube.com/…"      },
  { _id:"3", titre:"TP noté – Cas d'utilisation",type:"tp",  matiere:"Conception UML",  lien:"emsi.ma/tp-uml.pdf" },
  { _id:"4", titre:"Machine Learning – SVM",      type:"doc", matiere:"Machine Learning",lien:"emsi.ma/svm.pdf"   },
  { _id:"5", titre:"useState et useEffect",        type:"vid", matiere:"React JS",       lien:"youtube.com/…"     },
  { _id:"6", titre:"TP Réseaux – Subnetting",     type:"tp",  matiere:"Protocoles TCP/IP",lien:"emsi.ma/tp-net.pdf"},
];

export function RessourcesPage() {
  const [data, setData]       = useState(INIT_RESSOURCES);
  const [search, setSearch]   = useState("");
  const [modalOpen, setModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const filtered = data.filter((r) =>
    r.titre.toLowerCase().includes(search.toLowerCase()) ||
    r.matiere.toLowerCase().includes(search.toLowerCase())
  );

  function handleSave(item) {
    if (editing) setData((d) => d.map((r) => (r._id === item._id ? item : r)));
    else setData((d) => [...d, { ...item, _id: Date.now().toString() }]);
    setModal(false); setEditing(null);
  }

  function handleDelete(id) {
    if (confirm("Supprimer cette ressource ?")) setData((d) => d.filter((r) => r._id !== id));
  }

  return (
    <>
      <AdminTopbar title="Ressources" subtitle={`${data.length} ressources disponibles`} />
      <div className="p-7">
        <div className="border border-[#e8e8e8] rounded-xl overflow-hidden">
          <div className="px-[18px] py-3.5 border-b border-[#e8e8e8] flex items-center justify-between">
            <div>
              <h3 className="text-[13px] font-semibold">Toutes les ressources</h3>
              <p className="text-[11px] text-[#888] mt-0.5">{filtered.length} résultat{filtered.length > 1 ? "s" : ""}</p>
            </div>
            <div className="flex items-center gap-2">
              <SearchInput value={search} onChange={setSearch} />
              <button onClick={() => { setEditing(null); setModal(true); }} className="flex items-center gap-1.5 px-3.5 py-[7px] bg-[#111] text-white text-[12px] font-medium rounded-lg hover:bg-[#333] transition-colors">
                + Ajouter
              </button>
            </div>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#e8e8e8]">
                {["Titre","Type","Matière","Lien",""].map((h) => (
                  <th key={h} className="px-[18px] py-2.5 text-[11px] font-semibold text-[#888] text-left tracking-[0.3px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-[13px] text-[#888]">Aucune ressource trouvée</td></tr>
              ) : filtered.map((r) => {
                const t = TYPE_STYLES[r.type] || TYPE_STYLES.doc;
                return (
                  <tr key={r._id} className="border-b border-[#e8e8e8] last:border-b-0 hover:bg-[#f9f9f9] transition-colors group">
                    <td className="px-[18px] py-3 text-[13px] font-medium">{r.titre}</td>
                    <td className="px-[18px] py-3">
                      <span className={`text-[9px] font-bold px-2 py-1 rounded ${t.class}`}>{t.label}</span>
                    </td>
                    <td className="px-[18px] py-3 text-[12px] text-[#888]">{r.matiere}</td>
                    <td className="px-[18px] py-3 text-[12px] font-mono text-[#888] max-w-[160px] truncate">{r.lien}</td>
                    <td className="px-[18px] py-3">
                      <RowActions onEdit={() => { setEditing(r); setModal(true); }} onDelete={() => handleDelete(r._id)} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <RessourceModal open={modalOpen} onClose={() => { setModal(false); setEditing(null); }} onSave={handleSave} initial={editing} />
    </>
  );
}

// ─── SoumissionsPage ──────────────────────────────────────────────────────────
export function SoumissionsPage() {
  const [search, setSearch] = useState("");
  const DATA = [
    { nom:"Ayaa B.",    filiere:"4IIR · S6", matiere:"Conception UML",    objectif:"Préparer un stage", date:"06/03/2026" },
    { nom:"Youssef A.", filiere:"4IIR · S6", matiere:"Machine Learning",  objectif:"Examens",           date:"05/03/2026" },
    { nom:"Sara M.",    filiere:"GC · S5",   matiere:"Béton armé",        objectif:"Combler les lacunes",date:"05/03/2026" },
    { nom:"Hamza K.",   filiere:"4IIR · S5", matiere:"Réseaux TCP/IP",    objectif:"PFE",               date:"04/03/2026" },
    { nom:"Nadia R.",   filiere:"GI · S6",   matiere:"Gestion de projet", objectif:"Améliorer la note", date:"03/03/2026" },
  ];
  const filtered = DATA.filter((s) =>
    s.nom.toLowerCase().includes(search.toLowerCase()) ||
    s.matiere.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <>
      <AdminTopbar title="Soumissions" subtitle="Historique des analyses générées" />
      <div className="p-7">
        <div className="border border-[#e8e8e8] rounded-xl overflow-hidden">
          <div className="px-[18px] py-3.5 border-b border-[#e8e8e8] flex items-center justify-between">
            <div>
              <h3 className="text-[13px] font-semibold">Toutes les soumissions</h3>
              <p className="text-[11px] text-[#888] mt-0.5">87 analyses générées au total</p>
            </div>
            <SearchInput value={search} onChange={setSearch} />
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#e8e8e8]">
                {["Étudiant","Filière","Matière","Objectif","Date"].map((h) => (
                  <th key={h} className="px-[18px] py-2.5 text-[11px] font-semibold text-[#888] text-left tracking-[0.3px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={i} className="border-b border-[#e8e8e8] last:border-b-0 hover:bg-[#f9f9f9] transition-colors group">
                  <td className="px-[18px] py-3 text-[13px] font-medium">{s.nom}</td>
                  <td className="px-[18px] py-3 text-[12px] text-[#888]">{s.filiere}</td>
                  <td className="px-[18px] py-3 text-[12px] text-[#888]">{s.matiere}</td>
                  <td className="px-[18px] py-3 text-[12px] text-[#888]">{s.objectif}</td>
                  <td className="px-[18px] py-3 text-[12px] font-mono text-[#888]">{s.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
