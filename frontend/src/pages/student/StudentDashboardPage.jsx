import { useNavigate } from "react-router-dom";
import StudentTopbar from "../../components/student/StudentTopbar";
import StatCard from "../../components/student/StatCard";

// ─── Mock data ────────────────────────────────────────────────────────────────
const RECENT_ANALYSES = [
  {
    id: "1",
    matiere: "Conception UML",
    module: "Génie Logiciel",
    date: "06/03/2026",
    score: 72,
  },
  {
    id: "2",
    matiere: "Machine Learning",
    module: "Intelligence Artificielle",
    date: "02/03/2026",
    score: 58,
  },
  {
    id: "3",
    matiere: "React JS",
    module: "Développement Web",
    date: "24/02/2026",
    score: 85,
  },
];

const PROGRESSION = [
  { matiere: "Conception UML", pct: 72 },
  { matiere: "Machine Learning", pct: 58 },
  { matiere: "React JS", pct: 85 },
  { matiere: "Réseaux TCP/IP", pct: 64 },
];

// Steps for the questionnaire guide
const STEPS = [
  { num: 1, label: "Filière, niveau & semestre", done: true },
  { num: 2, label: "Module concerné", done: true },
  { num: 3, label: "Matière concernée", done: true },
  { num: 4, label: "Vos difficultés", done: false },
  { num: 5, label: "Vos objectifs", done: false },
];

const QUICK_ACTIONS = [
  {
    label: "Nouveau questionnaire",
    icon: "📋",
    path: "/student/questionnaire",
  },
  { label: "Mes résultats", icon: "📊", path: "/student/resultats" },
  { label: "Ressources", icon: "📚", path: "/student/ressources" },
  { label: "Mon profil", icon: "👤", path: "/student/profil" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function StudentDashboardPage() {
  const navigate = useNavigate();

  return (
    <>
      <StudentTopbar
        title='Dashboard'
        subtitle='Bienvenue sur OrientAI'
      />

      <div className='p-7 flex flex-col gap-6'>
        {/* ── Welcome banner ── */}
        <div className='border border-[#e8e8e8] rounded-xl p-5 flex items-center justify-between'>
          <div className='flex flex-col gap-1.5'>
            <div className='flex items-center gap-2'>
              <h2 className='text-[16px] font-semibold'>Bonjour, Ayaa 👋</h2>
              {/* Groq AI active chip */}
              <span className='flex items-center gap-1 text-[10px] font-semibold text-[#22c55e] bg-[#f0fdf4] border border-[#bbf7d0] px-2 py-0.5 rounded-full'>
                <span className='w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse inline-block'></span>
                Groq AI actif
              </span>
            </div>
            <p className='text-[12px] text-[#888] max-w-md'>
              Identifiez vos difficultés académiques et obtenez un plan
              d'apprentissage personnalisé.
            </p>
          </div>
          <div className='flex gap-2'>
            <button
              onClick={() => navigate("/student/questionnaire")}
              className='px-4 py-2 bg-[#111] text-white text-[12px] font-medium rounded-lg hover:bg-[#333] transition-colors'
            >
              Nouvelle analyse
            </button>
            <button
              onClick={() => navigate("/student/resultats")}
              className='px-4 py-2 border border-[#e8e8e8] text-[#888] text-[12px] font-medium rounded-lg hover:border-[#bbb] hover:text-[#111] transition-colors'
            >
              Voir mes résultats
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className='grid grid-cols-4 gap-3.5'>
          <StatCard
            num='3'
            label='Analyses réalisées'
            tag='Ce mois'
          />
          <StatCard
            num='12'
            label='Ressources recommandées'
            tag='Disponibles'
          />
          <StatCard
            num='2'
            label='Objectifs en cours'
            tag='Actifs'
          />
          <StatCard
            num='72%'
            label='Score moyen'
            tag='↑ +8% ce mois'
          />
        </div>

        {/* ── Une colonne ── */}
        <div className='grid grid-cols-1'>
          <div className='flex flex-col gap-5'>
            {/* Recent analyses */}
            <div className='border border-[#e8e8e8] rounded-xl overflow-hidden'>
              <div className='px-[18px] py-3.5 border-b border-[#e8e8e8] flex items-center justify-between'>
                <div>
                  <h3 className='text-[13px] font-semibold'>
                    Analyses récentes
                  </h3>
                  <p className='text-[11px] text-[#888] mt-0.5'>
                    Vos dernières soumissions
                  </p>
                </div>
                <button
                  onClick={() => navigate("/student/resultats")}
                  className='text-[11px] font-medium text-[#888] hover:text-[#111] transition-colors'
                >
                  Voir tout →
                </button>
              </div>
              <div className='divide-y divide-[#e8e8e8]'>
                {RECENT_ANALYSES.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => navigate(`/student/resultats/${a.id}`)}
                    className='flex items-center justify-between px-[18px] py-3.5 hover:bg-[#f9f9f9] cursor-pointer transition-colors group'
                  >
                    <div>
                      <p className='text-[13px] font-medium'>{a.matiere}</p>
                      <p className='text-[11px] text-[#888] mt-0.5'>
                        {a.module}
                      </p>
                    </div>
                    <div className='flex items-center gap-3'>
                      <span className='text-[11px] font-mono text-[#888]'>
                        {a.date}
                      </span>
                      {/* Score badge */}
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full
                        ${
                          a.score >= 75
                            ? "bg-[#f0fdf4] text-[#22c55e]"
                            : a.score >= 55
                              ? "bg-amber-50 text-amber-600"
                              : "bg-red-50 text-red-500"
                        }`}
                      >
                        {a.score}%
                      </span>
                      <svg
                        className='w-3.5 h-3.5 text-[#ccc] group-hover:text-[#888] transition-colors'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                      >
                        <polyline points='9 18 15 12 9 6' />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
