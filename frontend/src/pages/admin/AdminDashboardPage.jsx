import AdminTopbar from "../../components/admin/AdminTopbar";

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

// ─── Recent submissions table ─────────────────────────────────────────────────
const RECENT = [
  { nom: "Ayaa B.",    filiere: "4IIR", matiere: "Conception UML",   date: "06/03/2026" },
  { nom: "Youssef A.", filiere: "4IIR", matiere: "Machine Learning", date: "05/03/2026" },
  { nom: "Sara M.",    filiere: "GC",   matiere: "Béton armé",       date: "05/03/2026" },
  { nom: "Hamza K.",   filiere: "4IIR", matiere: "Réseaux TCP/IP",   date: "04/03/2026" },
  { nom: "Nadia R.",   filiere: "GI",   matiere: "Gestion de projet",date: "03/03/2026" },
];

// ─── Page ────────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  return (
    <>
      <AdminTopbar title="Dashboard" subtitle="Vue générale du système" />

      <div className="p-7 flex flex-col gap-6">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3.5">
          <StatCard num="4"  label="Filières"   tag="Actives" />
          <StatCard num="12" label="Modules"     tag="Configurés" />
          <StatCard num="28" label="Matières"    tag="Avec difficultés" />
          <StatCard num="34" label="Ressources"  tag="↑ +3 ce mois" />
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
                  <th key={h} className="px-[18px] py-2.5 text-[11px] font-semibold text-[#888] text-left tracking-[0.3px]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT.map((r, i) => (
                <tr key={i} className="border-b border-[#e8e8e8] last:border-b-0 hover:bg-[#f9f9f9] transition-colors group">
                  <td className="px-[18px] py-3 text-[13px] font-medium">{r.nom}</td>
                  <td className="px-[18px] py-3 text-[12px] text-[#888]">{r.filiere}</td>
                  <td className="px-[18px] py-3 text-[12px] text-[#888]">{r.matiere}</td>
                  <td className="px-[18px] py-3 text-[12px] font-mono text-[#888]">{r.date}</td>
                  <td className="px-[18px] py-3">
                    <span className="text-[11px] font-semibold text-[#22c55e]">✓ Généré</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </>
  );
}
