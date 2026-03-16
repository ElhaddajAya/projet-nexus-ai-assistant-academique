import { useState, useEffect } from "react";
import AdminTopbar from "../../components/admin/AdminTopbar";
import { RowActions } from "../../components/admin/RowActions";
import SearchInput from "../../components/admin/SearchInput";
import FiliereModal from "../../components/admin/modals/FiliereModal";
import Pagination, { usePagination } from "../../components/Pagination";
import api from "../../api/axios";

export default function FilieresPage() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [modalOpen, setModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchFilieres = async () => {
    try {
      const res = await api.get("/filieres");
      setData(res.data);
    } catch (err) {
      console.error("Erreur chargement filières :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFilieres(); }, []);

  const filtered = data.filter((f) =>
    (f.nom_filiere  ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (f.code_filiere ?? "").toLowerCase().includes(search.toLowerCase())
  );

  // Pagination — reset à la page 1 quand la recherche change
  const { page, setPage, paginated, totalPages } = usePagination(filtered, 8);
  useEffect(() => { setPage(1); }, [search]);

  async function handleSave(item) {
    try {
      if (editing) {
        await api.put(`/filieres/${item._id}`, {
          nom_filiere:  item.nom_filiere,
          code_filiere: item.code_filiere,
        });
      } else {
        await api.post("/filieres", {
          nom_filiere:  item.nom_filiere,
          code_filiere: item.code_filiere,
        });
      }
      setModal(false);
      setEditing(null);
      await fetchFilieres();
    } catch (err) {
      alert("Erreur : " + (err.response?.data?.message || err.message));
    }
  }

  async function handleDelete(id) {
    if (!confirm("Supprimer cette filière ?")) return;
    try {
      await api.delete(`/filieres/${id}`);
      await fetchFilieres();
    } catch (err) {
      alert("Erreur lors de la suppression : " + (err.response?.data?.message || err.message));
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
          <div className="px-[18px] py-3.5 border-b border-[#e8e8e8] flex items-center justify-between">
            <div>
              <h3 className="text-[13px] font-semibold">Toutes les filières</h3>
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
                {["Nom de la filière", "Code", ""].map((h) => (
                  <th key={h} className="px-[18px] py-2.5 text-[11px] font-semibold text-[#888] text-left tracking-[0.3px]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="text-center py-10">
                    <div className="w-6 h-6 border-2 border-[#e8e8e8] border-t-[#111] rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-10 text-[13px] text-[#888]">
                    Aucune filière trouvée
                  </td>
                </tr>
              ) : (
                paginated.map((f) => (
                  <tr key={f._id} className="border-b border-[#e8e8e8] last:border-b-0 hover:bg-[#f9f9f9] transition-colors group">
                    <td className="px-[18px] py-3 text-[13px] font-medium">{f.nom_filiere}</td>
                    <td className="px-[18px] py-3 text-[12px] font-mono text-[#888]">{f.code_filiere}</td>
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

          {/* Pagination */}
          <Pagination page={page} total={totalPages} onChange={setPage} />
        </div>
      </div>

      <FiliereModal
        open={modalOpen}
        onClose={() => { setModal(false); setEditing(null); }}
        onSave={handleSave}
        initial={editing}
      />
    </>
  );
}
