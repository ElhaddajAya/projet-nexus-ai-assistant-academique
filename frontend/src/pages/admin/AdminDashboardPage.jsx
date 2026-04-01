import { useState, useEffect } from "react";
import AdminTopbar from "../../components/admin/AdminTopbar";
import api from "../../api/axios";

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

// ─── Barre de progression horizontale ────────────────────────────────────────
function BarItem({ label, count, max, color = "#22c55e" }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      {/* Label */}
      <span className="text-[12px] text-[#444] w-48 shrink-0 truncate" title={label}>
        {label}
      </span>
      {/* Barre */}
      <div className="flex-1 h-[6px] bg-[#f0f0f0] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      {/* Compteur */}
      <span className="text-[11px] font-mono font-semibold text-[#888] w-8 text-right shrink-0">
        {count}
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {

  // ── Stats contenu ──
  const [stats, setStats] = useState({ filieres: 0, modules: 0, matieres: 0, ressources: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  // ── Soumissions ──
  const [recent, setRecent]           = useState([]);
  const [allSubs, setAllSubs]         = useState([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const [statsSubLoading, setStatsSubLoading] = useState(true);

  // Charger stats contenu
  useEffect(() => {
    Promise.all([
      api.get("/filieres"),
      api.get("/modules"),
      api.get("/matieres"),
      api.get("/ressources"),
    ])
      .then(([f, m, ma, r]) => {
        setStats({ filieres: f.data.length, modules: m.data.length, matieres: ma.data.length, ressources: r.data.length });
      })
      .catch(console.error)
      .finally(() => setStatsLoading(false));
  }, []);

  // Charger soumissions récentes
  useEffect(() => {
    api.get("/submissions/recent")
      .then((res) => setRecent(res.data))
      .catch(console.error)
      .finally(() => setRecentLoading(false));
  }, []);

  // Charger TOUTES les soumissions pour les stats
  useEffect(() => {
    api.get("/submissions/all")
      .then((res) => setAllSubs(res.data))
      .catch(console.error)
      .finally(() => setStatsSubLoading(false));
  }, []);

  // ── Calculs agrégés à partir de toutes les soumissions ──────────────────────

  // Top 5 difficultés les plus déclarées
  const topDifficultes = (() => {
    const counts = {};
    allSubs.forEach((s) => {
      (s.difficultes || []).forEach((d) => {
        counts[d] = (counts[d] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  })();

  // Top 5 matières les plus soumises
  const topMatieres = (() => {
    const counts = {};
    allSubs.forEach((s) => {
      const nom = s.matiereId?.nom_matiere;
      if (nom) counts[nom] = (counts[nom] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  })();

  // Répartition par filière
  const parFiliere = (() => {
    const counts = {};
    allSubs.forEach((s) => {
      const nom = s.filiereId?.code_filiere || s.filiereId?.nom_filiere;
      if (nom) counts[nom] = (counts[nom] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  })();

  const maxDiff    = topDifficultes[0]?.[1] || 1;
  const maxMat     = topMatieres[0]?.[1] || 1;
  const maxFiliere = parFiliere[0]?.[1] || 1;

  return (
    <>
      <AdminTopbar title="Dashboard" subtitle="Vue générale du système" />

      <div className="p-7 flex flex-col gap-6">

        {/* ── Stats contenu ── */}
        <div className="grid grid-cols-4 gap-3.5">
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border border-[#e8e8e8] rounded-[10px] p-[18px] animate-pulse">
                <div className="h-7 w-12 bg-[#f0f0f0] rounded mb-2" />
                <div className="h-3 w-20 bg-[#f0f0f0] rounded mb-2" />
                <div className="h-3 w-14 bg-[#f0f0f0] rounded" />
              </div>
            ))
          ) : (
            <>
              <StatCard num={stats.filieres}  label="Filières"   tag="Actives" />
              <StatCard num={stats.modules}   label="Modules"    tag="Configurés" />
              <StatCard num={stats.matieres}  label="Matières"   tag="Avec difficultés" />
              <StatCard num={stats.ressources}label="Ressources" tag="↑ disponibles" />
            </>
          )}
        </div>

        {/* ── Analyse des difficultés — 3 blocs côte à côte ── */}
        <div className="grid grid-cols-3 gap-3.5">

          {/* Top difficultés */}
          <div className="border border-[#e8e8e8] rounded-xl overflow-hidden">
            <div className="px-[18px] py-3.5 border-b border-[#e8e8e8]">
              <h3 className="text-[13px] font-semibold">Top difficultés déclarées</h3>
              <p className="text-[11px] text-[#888] mt-0.5">
                {statsSubLoading ? "Chargement…" : `Sur ${allSubs.length} soumissions`}
              </p>
            </div>
            <div className="p-[18px] flex flex-col gap-3.5">
              {statsSubLoading ? (
                <div className="flex justify-center py-6">
                  <div className="w-5 h-5 border-2 border-[#e8e8e8] border-t-[#111] rounded-full animate-spin" />
                </div>
              ) : topDifficultes.length === 0 ? (
                <p className="text-[12px] text-[#888] text-center py-4">Aucune donnée</p>
              ) : (
                topDifficultes.map(([label, count]) => (
                  <BarItem key={label} label={label} count={count} max={maxDiff} color="#22c55e" />
                ))
              )}
            </div>
          </div>

          {/* Top matières */}
          <div className="border border-[#e8e8e8] rounded-xl overflow-hidden">
            <div className="px-[18px] py-3.5 border-b border-[#e8e8e8]">
              <h3 className="text-[13px] font-semibold">Matières les plus consultées</h3>
              <p className="text-[11px] text-[#888] mt-0.5">Par nombre de soumissions</p>
            </div>
            <div className="p-[18px] flex flex-col gap-3.5">
              {statsSubLoading ? (
                <div className="flex justify-center py-6">
                  <div className="w-5 h-5 border-2 border-[#e8e8e8] border-t-[#111] rounded-full animate-spin" />
                </div>
              ) : topMatieres.length === 0 ? (
                <p className="text-[12px] text-[#888] text-center py-4">Aucune donnée</p>
              ) : (
                topMatieres.map(([label, count]) => (
                  <BarItem key={label} label={label} count={count} max={maxMat} color="#6366f1" />
                ))
              )}
            </div>
          </div>

          {/* Répartition par filière */}
          <div className="border border-[#e8e8e8] rounded-xl overflow-hidden">
            <div className="px-[18px] py-3.5 border-b border-[#e8e8e8]">
              <h3 className="text-[13px] font-semibold">Répartition par filière</h3>
              <p className="text-[11px] text-[#888] mt-0.5">Soumissions par filière</p>
            </div>
            <div className="p-[18px] flex flex-col gap-3.5">
              {statsSubLoading ? (
                <div className="flex justify-center py-6">
                  <div className="w-5 h-5 border-2 border-[#e8e8e8] border-t-[#111] rounded-full animate-spin" />
                </div>
              ) : parFiliere.length === 0 ? (
                <p className="text-[12px] text-[#888] text-center py-4">Aucune donnée</p>
              ) : (
                parFiliere.map(([label, count]) => (
                  <BarItem key={label} label={label} count={count} max={maxFiliere} color="#f59e0b" />
                ))
              )}
            </div>
          </div>

        </div>

        {/* ── Soumissions récentes ── */}
        <div className="border border-[#e8e8e8] rounded-xl overflow-hidden">
          <div className="px-[18px] py-3.5 border-b border-[#e8e8e8]">
            <h3 className="text-[13px] font-semibold">Soumissions récentes</h3>
            <p className="text-[11px] text-[#888] mt-0.5">Les 10 dernières analyses générées</p>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#e8e8e8]">
                {["Étudiant", "Filière", "Matière", "Date", "Statut"].map((h) => (
                  <th key={h} className="px-[18px] py-2.5 text-[11px] font-semibold text-[#888] text-left tracking-[0.3px]">
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
                  <tr key={r._id ?? i} className="border-b border-[#e8e8e8] last:border-b-0 hover:bg-[#f9f9f9] transition-colors">
                    <td className="px-[18px] py-3 text-[13px] font-medium">
                      {r.userId ? `${r.userId.prenom} ${r.userId.nom}` : "—"}
                    </td>
                    <td className="px-[18px] py-3 text-[12px] text-[#888]">
                      {r.filiereId?.code_filiere ?? "—"}
                    </td>
                    <td className="px-[18px] py-3 text-[12px] text-[#888]">
                      {r.matiereId?.nom_matiere ?? "—"}
                    </td>
                    <td className="px-[18px] py-3 text-[12px] font-mono text-[#888]">
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString("fr-FR") : "—"}
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
