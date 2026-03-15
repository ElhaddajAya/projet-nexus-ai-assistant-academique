import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudentTopbar from "../../components/student/StudentTopbar";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

// ─── Helper : formater une date ISO ──────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR");
}

// ─── Stat card avec barre de progression optionnelle ─────────────────────────
function StatCard({ icon, label, value, sub, progress }) {
  return (
    <div className='border border-[#e8e8e8] rounded-[10px] p-[18px] hover:border-[#ccc] hover:shadow-sm transition-all flex flex-col gap-2'>
      <div className='flex items-center justify-between'>
        <span className='text-[18px]'>{icon}</span>
        <span className='text-[24px] font-bold font-mono text-[#111]'>
          {value}
        </span>
      </div>
      <div>
        <p className='text-[12px] font-semibold text-[#111]'>{label}</p>
        {sub && <p className='text-[11px] text-[#888] mt-0.5'>{sub}</p>}
      </div>
      {/* Barre de progression — affichée seulement pour les stats avec score */}
      {progress !== undefined && (
        <div className='h-[3px] bg-[#e8e8e8] rounded-full mt-1'>
          <div
            className={`h-full rounded-full transition-all duration-500
              ${progress >= 75 ? "bg-[#22c55e]" : progress >= 50 ? "bg-amber-400" : "bg-red-400"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function StudentDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [submissions, setSubmissions] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // 1. Charger les submissions
        const { data: subs } = await api.get("/submissions/me");
        setSubmissions(subs);

        // 2. Charger les recommendations pour avoir les note_progression
        const recos = await Promise.all(
          subs.map(async (sub) => {
            try {
              const { data } = await api.get(`/recommendations/${sub._id}`);
              return data;
            } catch {
              return null;
            }
          }),
        );
        setRecommendations(recos.filter(Boolean));
      } catch {
        setSubmissions([]);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ── Calcul des stats ──
  const totalAnalyses = submissions.length;

  // Matières uniques travaillées
  const matieresUniques = new Set(
    submissions.map((s) => s.matiereId?._id).filter(Boolean),
  ).size;

  // Notes de progression disponibles
  const notes = recommendations
    .map((r) => r.note_progression)
    .filter((n) => typeof n === "number");

  const scoreMoyen =
    notes.length > 0
      ? Math.round(notes.reduce((a, b) => a + b, 0) / notes.length)
      : null;

  const meilleurScore = notes.length > 0 ? Math.max(...notes) : null;

  // Les 3 dernières submissions
  const recent = submissions.slice(0, 3);

  return (
    <>
      <StudentTopbar
        title='Dashboard'
        subtitle='Bienvenue sur OrientAI'
      />

      <div className='p-7 flex flex-col gap-6'>
        {/* ── Bannière de bienvenue ── */}
        <div className='border border-[#e8e8e8] rounded-xl p-5 flex items-center justify-between'>
          <div className='flex flex-col gap-1.5'>
            <div className='flex items-center gap-2'>
              <h2 className='text-[16px] font-semibold'>
                Bonjour, {user?.prenom} 👋
              </h2>
              <span className='flex items-center gap-1 text-[10px] font-semibold text-[#22c55e] bg-[#f0fdf4] border border-[#bbf7d0] px-2 py-0.5 rounded-full'>
                <span className='w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse inline-block' />
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

        {/* ── Stats réelles ── */}
        <div className='grid grid-cols-4 gap-3.5'>
          <StatCard
            icon='📋'
            label='Analyses réalisées'
            value={loading ? "…" : totalAnalyses}
            sub='Questionnaires soumis'
          />
          <StatCard
            icon='📚'
            label='Matières travaillées'
            value={loading ? "…" : matieresUniques}
            sub='Matières uniques'
          />
          <StatCard
            icon='⭐'
            label='Score moyen'
            value={
              loading ? "…" : scoreMoyen !== null ? `${scoreMoyen}/100` : "—"
            }
            sub={
              scoreMoyen !== null
                ? "Niveau estimé par Groq AI"
                : "Pas encore d'analyse"
            }
            progress={scoreMoyen}
          />
          <StatCard
            icon='🏆'
            label='Meilleur score'
            value={
              loading
                ? "…"
                : meilleurScore !== null
                  ? `${meilleurScore}/100`
                  : "—"
            }
            sub={
              meilleurScore !== null
                ? "Ton meilleur résultat"
                : "Pas encore d'analyse"
            }
            progress={meilleurScore}
          />
        </div>

        {/* ── Analyses récentes ── */}
        <div className='border border-[#e8e8e8] rounded-xl overflow-hidden'>
          <div className='px-[18px] py-3.5 border-b border-[#e8e8e8] flex items-center justify-between'>
            <div>
              <h3 className='text-[13px] font-semibold'>Analyses récentes</h3>
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

          {loading ? (
            <div className='flex items-center justify-center py-10 gap-2 text-[13px] text-[#888]'>
              <div className='w-4 h-4 border-2 border-[#e8e8e8] border-t-[#111] rounded-full animate-spin' />
              Chargement…
            </div>
          ) : recent.length === 0 ? (
            <div className='flex flex-col items-center gap-3 py-10 text-center'>
              <p className='text-[13px] text-[#888]'>
                Vous n'avez pas encore d'analyses.
              </p>
              <button
                onClick={() => navigate("/student/questionnaire")}
                className='px-4 py-2 bg-[#111] text-white text-[12px] font-medium rounded-lg hover:bg-[#333] transition-colors'
              >
                Faire mon premier questionnaire
              </button>
            </div>
          ) : (
            <div className='divide-y divide-[#e8e8e8]'>
              {recent.map((sub) => {
                // Trouver la recommendation correspondante pour afficher le score
                const reco = recommendations.find(
                  (r) =>
                    r.submissionId === sub._id ||
                    r.submissionId?.$oid === sub._id,
                );
                const note = reco?.note_progression;

                return (
                  <div
                    key={sub._id}
                    onClick={() => navigate(`/student/resultats/${sub._id}`)}
                    className='flex items-center justify-between px-[18px] py-3.5 hover:bg-[#f9f9f9] cursor-pointer transition-colors group'
                  >
                    <div>
                      <p className='text-[13px] font-medium'>
                        {sub.matiereId?.nom_matiere || "Matière"}
                      </p>
                      <p className='text-[11px] text-[#888] mt-0.5'>
                        {sub.moduleId?.nom_module || "Module"} · {sub.semestre}
                      </p>
                    </div>
                    <div className='flex items-center gap-3'>
                      <span className='text-[11px] font-mono text-[#888]'>
                        {formatDate(sub.createdAt)}
                      </span>
                      {/* Badge score — affiché seulement si la recommendation existe */}
                      {note !== undefined && note !== null ? (
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full
                          ${
                            note >= 75
                              ? "bg-[#f0fdf4] text-[#22c55e]"
                              : note >= 50
                                ? "bg-amber-50 text-amber-600"
                                : "bg-red-50 text-red-500"
                          }`}
                        >
                          {note}/100
                        </span>
                      ) : (
                        <span className='text-[11px] text-[#ccc]'>—</span>
                      )}
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
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
