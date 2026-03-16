import { useState, useEffect } from "react";
import AdminTopbar from "../../components/admin/AdminTopbar";
import api from "../../api/axios"; // src/api/axios.js → depuis pages/admin/ : ../../api/axios

// ─── Stat card ───────────────────────────────────────────────────────────────
function StatCard({ num, label, tag }) {
  return (
    <div className="border border-[#e8e8e8] rounded-[10px] p-[18px] hover:border-[#ccc] hover:shadow-sm transition-all">
      <div className="text-[28px] font-bold font-mono leading-none mb-1">{num}</div>
      <div className="text-[12px] text-[#888] font-medium">{label}</div>
      <div className="mt-2.5 text-[11px] font-semibold text-[#22c55e]">{tag}</div>
    </div>
  );
}

// ─── Spinner ─────────────────────────────────────────────────────────────────
function Spinner({ cols }) {
  return (
    <tr>
      <td colSpan={cols} className="text-center py-10">
        <div className="w-6 h-6 border-2 border-[#e8e8e8] border-t-[#111] rounded-full animate-spin mx-auto" />
      </td>
    </tr>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  // ── Stats ──
  const [stats, setStats] = useState({
    filieres: 0,
    modules: 0,
    matieres: 0,
    ressources: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // ── Recent submissions ──
  const [recent, setRecent] = useState([]);
  const [recentLoading, setRecentLoading] = useState(true);

  // Charger les stats (filieres + modules + matieres + ressources en parallèle)
  useEffect(() => {
    Promise.all([
      api.get("/filieres"),
      api.get("/modules"),
      api.get("/matieres"),
      api.get("/ressources"),
    ])
      .then(([f, m, ma, r]) => {
        setStats({
          filieres: f.data.length,
          modules: m.data.length,
          matieres: ma.data.length,
          ressources: r.data.length,
        });
      })
      .catch(console.error)
      .finally(() => setStatsLoading(false));
  }, []);

  // Charger les 5 dernières soumissions
  useEffect(() => {
    api
      .get("/submissions/recent") // adapte l'endpoint si différent
      .then((res) => setRecent(res.data))
      .catch(console.error)
      .finally(() => setRecentLoading(false));
  }, []);

  return (
    <>
      <AdminTopbar title="Dashboard" subtitle="Vue générale du système" />

      <div className="p-7 flex flex-col gap-6">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3.5">
          {statsLoading ? (
            // Squelette pendant le chargement
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="border border-[#e8e8e8] rounded-[10px] p-[18px] animate-pulse"
              >
                <div className="h-7 w-12 bg-[#f0f0f0] rounded mb-2" />
                <div className="h-3 w-20 bg-[#f0f0f0] rounded mb-2" />
                <div className="h-3 w-14 bg-[#f0f0f0] rounded" />
              </div>
            ))
          ) : (
            <>
              <StatCard num={stats.filieres}  label="Filières"   tag="Actives" />
              <StatCard num={stats.modules}    label="Modules"    tag="Configurés" />
              <StatCard num={stats.matieres}   label="Matières"   tag="Avec difficultés" />
              <StatCard num={stats.ressources} label="Ressources" tag="↑ disponibles" />
            </>
          )}
        </div>

        {/* Recent submissions */}
        <div className="border border-[#e8e8e8] rounded-xl overflow-hidden">
          <div className="px-[18px] py-3.5 border-b border-[#e8e8e8]">
            <h3 className="text-[13px] font-semibold">Soumissions récentes</h3>
            <p className="text-[11px] text-[#888] mt-0.5">Les 5 dernières analyses générées</p>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#e8e8e8]">
                {["Étudiant", "Filière", "Matière", "Date", "Statut"].map((h) => (
                  <th
                    key={h}
                    className="px-[18px] py-2.5 text-[11px] font-semibold text-[#888] text-left tracking-[0.3px]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentLoading ? (
                <Spinner cols={5} />
              ) : recent.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-[13px] text-[#888]">
                    Aucune soumission récente
                  </td>
                </tr>
              ) : (
                recent.map((r, i) => (
                  <tr
                    key={r._id ?? i}
                    className="border-b border-[#e8e8e8] last:border-b-0 hover:bg-[#f9f9f9] transition-colors group"
                  >
                    {/* Adapte les champs selon la réponse réelle de ton API */}
                    <td className="px-[18px] py-3 text-[13px] font-medium">
                      {r.userId?.name ?? r.nom ?? "—"}
                    </td>
                    <td className="px-[18px] py-3 text-[12px] text-[#888]">
                      {r.filiereId?.code ?? r.filiere ?? "—"}
                    </td>
                    <td className="px-[18px] py-3 text-[12px] text-[#888]">
                      {r.matiereId?.nom ?? r.matiere ?? "—"}
                    </td>
                    <td className="px-[18px] py-3 text-[12px] font-mono text-[#888]">
                      {r.createdAt
                        ? new Date(r.createdAt).toLocaleDateString("fr-FR")
                        : r.date ?? "—"}
                    </td>
                    <td className="px-[18px] py-3">
                      <span className="text-[11px] font-semibold text-[#22c55e]">✓ Généré</span>
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
