import { useState } from "react";
import AdminTopbar from "../../components/admin/AdminTopbar";
import { RowActions } from "../../components/admin/RowActions";
import SearchInput from "../../components/admin/SearchInput";
import FiliereModal from "../../components/admin/modals/FiliereModal";

// ─── Mock data (à remplacer par appels API) ───────────────────────────────────
const INITIAL = [
  { _id: "1", nom: "Ingénierie Informatique et Réseaux", code: "4IIR", modules: 5, etudiants: 143 },
  { _id: "2", nom: "Génie Civil",                        code: "GC",   modules: 4, etudiants: 89  },
  { _id: "3", nom: "Génie Industriel",                   code: "GI",   modules: 4, etudiants: 76  },
  { _id: "4", nom: "Génie Électrique",                   code: "GE",   modules: 3, etudiants: 61  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FilieresPage() {
  const [data, setData]         = useState(INITIAL);
  const [search, setSearch]     = useState("");
  const [modalOpen, setModal]   = useState(false);
  const [editing, setEditing]   = useState(null); // null = add, obj = edit

  // Filter by search
  const filtered = data.filter((f) =>
    f.nom.toLowerCase().includes(search.toLowerCase()) ||
    f.code.toLowerCase().includes(search.toLowerCase())
  );

  // Save (add or edit)
  function handleSave(item) {
    if (editing) {
      setData((d) => d.map((f) => (f._id === item._id ? item : f)));
    } else {
      setData((d) => [...d, { ...item, _id: Date.now().toString(), modules: 0, etudiants: 0 }]);
    }
    setModal(false);
    setEditing(null);
  }

  // Delete
  function handleDelete(id) {
    if (confirm("Supprimer cette filière ?")) {
      setData((d) => d.filter((f) => f._id !== id));
    }
  }

  return (
    <>
      <AdminTopbar
        title="Filières"
        subtitle={`${data.length} filières configurées`}
      />

      <div className="p-7">
        <div className="border border-[#e8e8e8] rounded-xl overflow-hidden">

          {/* Card header */}
          <div className="px-[18px] py-3.5 border-b border-[#e8e8e8] flex items-center justify-between">
            <div>
              <h3 className="text-[13px] font-semibold">Toutes les filières</h3>
              <p className="text-[11px] text-[#888] mt-0.5">{filtered.length} résultat{filtered.length > 1 ? "s" : ""}</p>
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

          {/* Table */}
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#e8e8e8]">
                {["Nom de la filière", "Code", "Modules", "Étudiants", ""].map((h) => (
                  <th key={h} className="px-[18px] py-2.5 text-[11px] font-semibold text-[#888] text-left tracking-[0.3px]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-[13px] text-[#888]">
                    Aucune filière trouvée
                  </td>
                </tr>
              ) : (
                filtered.map((f) => (
                  <tr key={f._id} className="border-b border-[#e8e8e8] last:border-b-0 hover:bg-[#f9f9f9] transition-colors group">
                    <td className="px-[18px] py-3 text-[13px] font-medium">{f.nom}</td>
                    <td className="px-[18px] py-3 text-[12px] font-mono text-[#888]">{f.code}</td>
                    <td className="px-[18px] py-3 text-[12px] text-[#888]">{f.modules} modules</td>
                    <td className="px-[18px] py-3 text-[12px] text-[#888]">{f.etudiants}</td>
                    <td className="px-[18px] py-3">
                      <RowActions
                        onEdit={() => { setEditing(f); setModal(true); }}
                        onDelete={() => handleDelete(f._id)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <FiliereModal
        open={modalOpen}
        onClose={() => { setModal(false); setEditing(null); }}
        onSave={handleSave}
        initial={editing}
      />
    </>
  );
}
