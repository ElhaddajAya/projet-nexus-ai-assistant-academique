import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StudentTopbar from "../../components/student/StudentTopbar";
import api from "../../api/axios";

// ─── Styles des types de ressources ──────────────────────────────────────────
const TYPE_STYLE = {
  doc: { label: "DOC", cls: "bg-blue-100 text-blue-700" },
  vid: { label: "VID", cls: "bg-red-100 text-red-700" },
  video: { label: "VID", cls: "bg-red-100 text-red-700" },
  "TP/TD": { label: "TP/TD", cls: "bg-green-100 text-green-700" },
  document: { label: "DOC", cls: "bg-blue-100 text-blue-700" },
  "site web": { label: "WEB", cls: "bg-yellow-100 text-yellow-700" },
};

// ─── Helper : formater une date ISO en DD/MM/YYYY ─────────────────────────────
function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR");
}

// ─── Spinner de chargement ────────────────────────────────────────────────────
function Spinner() {
  return (
    <div className='flex items-center justify-center py-20'>
      <div className='w-8 h-8 border-2 border-[#e8e8e8] border-t-[#111] rounded-full animate-spin' />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// COMPOSANT 1 — Liste de toutes les analyses de l'étudiant
// Route : /student/resultats
// ═════════════════════════════════════════════════════════════════════════════
export function ResultatsListPage() {
  const navigate = useNavigate();

  // Liste des submissions avec leur recommendation associée
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Récupérer toutes les submissions de l'étudiant connecté
        const { data: submissions } = await api.get("/submissions/me");

        // 2. Pour chaque submission, récupérer la recommendation associée
        //    On fait les appels en parallèle avec Promise.all pour aller plus vite
        const enriched = await Promise.all(
          submissions.map(async (sub) => {
            try {
              const { data: reco } = await api.get(
                `/recommendations/${sub._id}`,
              );
              return { submission: sub, recommendation: reco };
            } catch {
              // Si pas encore de recommendation pour cette submission
              return { submission: sub, recommendation: null };
            }
          }),
        );

        setItems(enriched);
      } catch (err) {
        setError("Impossible de charger vos analyses.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <StudentTopbar
        title='Mes résultats'
        subtitle='Historique de vos analyses'
      />
      <div className='p-7'>
        <div className='border border-[#e8e8e8] rounded-xl overflow-hidden'>
          <div className='px-[18px] py-3.5 border-b border-[#e8e8e8]'>
            <h3 className='text-[13px] font-semibold'>Toutes vos analyses</h3>
            <p className='text-[11px] text-[#888] mt-0.5'>
              {loading
                ? "Chargement…"
                : `${items.length} analyse${items.length > 1 ? "s" : ""} générée${items.length > 1 ? "s" : ""}`}
            </p>
          </div>

          {/* États de chargement / erreur / vide */}
          {loading ? (
            <Spinner />
          ) : error ? (
            <div className='text-center py-10 text-[13px] text-red-500'>
              {error}
            </div>
          ) : items.length === 0 ? (
            <div className='flex flex-col items-center gap-3 py-16 text-center'>
              <p className='text-[13px] text-[#888]'>
                Aucune analyse pour l'instant.
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
              {items.map(({ submission, recommendation }) => (
                <div
                  key={submission._id}
                  onClick={() =>
                    navigate(`/student/resultats/${submission._id}`)
                  }
                  className='flex items-center justify-between px-[18px] py-4 hover:bg-[#f9f9f9] cursor-pointer transition-colors group'
                >
                  <div>
                    {/* Nom de la matière — on affiche l'ID si pas encore populé */}
                    <p className='text-[13px] font-semibold'>
                      {submission.matiereId?.nom_matiere || "Matière"}
                    </p>
                    <p className='text-[11px] text-[#888] mt-0.5'>
                      {submission.moduleId?.nom_module || "Module"} ·{" "}
                      {submission.filiereId?.nom_filiere || "Filière"} ·{" "}
                      {submission.semestre}
                    </p>
                  </div>
                  <div className='flex items-center gap-3'>
                    <span className='text-[11px] font-mono text-[#888]'>
                      {formatDate(submission.createdAt)}
                    </span>
                    {/* Badge statut */}
                    {recommendation ? (
                      <span className='text-[11px] font-semibold text-[#22c55e] bg-[#f0fdf4] border border-[#bbf7d0] px-2 py-0.5 rounded-full'>
                        ✓ Analysé
                      </span>
                    ) : (
                      <span className='text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full'>
                        En attente
                      </span>
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
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// COMPOSANT 2 — Détail d'une analyse + chat Groq
// Route : /student/resultats/:id  (id = submissionId)
// ═════════════════════════════════════════════════════════════════════════════
export function ResultatDetailPage() {
  const { id: submissionId } = useParams(); // :id = submissionId
  const navigate = useNavigate();

  // ── Données chargées depuis l'API ──
  const [submission, setSubmission] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ── Chat ──
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Ref pour scroller automatiquement vers le bas du chat
  const chatEndRef = useRef(null);

  // ── Charger submission + recommendation au montage ──
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger la submission
        const { data: sub } = await api.get(`/submissions/${submissionId}`);
        setSubmission(sub);

        // Charger la recommendation (contient aussi le chat_history)
        const { data: reco } = await api.get(
          `/recommendations/${submissionId}`,
        );
        setRecommendation(reco);

        // Restaurer le chat_history existant depuis la DB
        if (reco.chat_history && reco.chat_history.length > 0) {
          setMessages(
            reco.chat_history.map((msg) => ({
              role: msg.role,
              text: msg.message,
            })),
          );
        }
      } catch (err) {
        setError("Impossible de charger cette analyse.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [submissionId]);

  // ── Scroller vers le bas après chaque nouveau message ──
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Envoyer une question au chat Groq ──
  async function sendQuestion(q) {
    if (!q.trim() || chatLoading) return;

    // Ajouter le message user immédiatement (UX fluide)
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setQuestion("");
    setChatLoading(true);

    try {
      // POST /api/recommendations/ask — sauvegarde aussi dans DB
      const { data } = await api.post("/recommendations/ask", {
        submissionId,
        question: q,
      });
      setMessages((prev) => [...prev, { role: "ai", text: data.answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Désolé, je n'ai pas pu répondre. Réessayez dans quelques instants.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  // ── États de chargement / erreur ──
  if (loading) {
    return (
      <>
        <StudentTopbar
          title='Analyse'
          subtitle='Chargement en cours…'
        />
        <Spinner />
      </>
    );
  }

  if (error || !recommendation) {
    return (
      <>
        <StudentTopbar
          title='Analyse'
          subtitle=''
        />
        <div className='flex flex-col items-center gap-3 py-20 text-center'>
          <p className='text-[13px] text-red-500'>
            {error || "Analyse introuvable."}
          </p>
          <button
            onClick={() => navigate("/student/resultats")}
            className='px-4 py-2 border border-[#e8e8e8] rounded-lg text-[12px] text-[#888] hover:border-[#bbb] hover:text-[#111] transition-colors'
          >
            Retour à mes résultats
          </button>
        </div>
      </>
    );
  }

  // Suggestions de questions pour le chat
  const SUGGESTIONS = [
    "Comment améliorer mon plan de travail ?",
    "Explique-moi la première étape",
    "Quelles ressources prioriser ?",
  ];

  return (
    <>
      <StudentTopbar
        title={submission?.matiereId?.nom_matiere || "Analyse"}
        subtitle={`${submission?.filiereId?.nom_filiere || ""} › ${submission?.semestre || ""} › ${submission?.moduleId?.nom_module || ""}`}
        actions={
          <button
            onClick={() => navigate("/student/resultats")}
            className='flex items-center gap-1.5 px-3 py-1.5 border border-[#e8e8e8] rounded-lg text-[12px] font-medium text-[#888] hover:border-[#bbb] hover:text-[#111] transition-colors'
          >
            <svg
              width='13'
              height='13'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
            >
              <polyline points='15 18 9 12 15 6' />
            </svg>
            Retour
          </button>
        }
      />

      <div className='p-7 flex flex-col gap-5 w-full'>
        {/* ── Breadcrumb + date ── */}
        <div className='flex items-center gap-2 flex-wrap'>
          {[
            submission?.filiereId?.nom_filiere,
            submission?.semestre,
            submission?.moduleId?.nom_module,
            submission?.matiereId?.nom_matiere,
          ]
            .filter(Boolean)
            .map((c, i, arr) => (
              <span
                key={i}
                className='flex items-center gap-1'
              >
                <span className='text-[12px] text-[#888]'>{c}</span>
                {i < arr.length - 1 && (
                  <span className='text-[#ccc] text-[10px]'>›</span>
                )}
              </span>
            ))}
          <span className='ml-auto text-[11px] font-mono text-[#888]'>
            {formatDate(recommendation.createdAt)}
          </span>
        </div>

        {/* ── Analyse du profil ── */}
        <div className='border border-[#e8e8e8] rounded-xl p-5'>
          <div className='flex items-center gap-2 mb-3'>
            <h3 className='text-[13px] font-semibold'>Analyse du profil</h3>
            <span className='text-[10px] font-semibold text-[#888] bg-[#f9f9f9] border border-[#e8e8e8] px-2 py-0.5 rounded-full'>
              Groq AI
            </span>
          </div>
          <p className='text-[13px] text-[#444] leading-relaxed'>
            {recommendation.analyse}
          </p>
          <div className='mt-3 p-3 bg-[#f9f9f9] border border-[#e8e8e8] rounded-lg text-[12px] text-[#888] leading-relaxed'>
            💡 Cette analyse est basée sur vos réponses et les ressources
            configurées par votre administration.
          </div>
        </div>

        {/* ── Conseils IA ── */}
        {recommendation.conseils_ia?.length > 0 && (
          <div className='border border-[#e8e8e8] rounded-xl p-5'>
            <h3 className='text-[13px] font-semibold mb-3'>
              Conseils personnalisés
            </h3>
            <ul className='flex flex-col gap-2'>
              {recommendation.conseils_ia.map((conseil, i) => (
                <li
                  key={i}
                  className='flex gap-2.5 text-[13px] text-[#444] leading-relaxed'
                >
                  <span className='text-[#22c55e] font-bold shrink-0 mt-0.5'>
                    ✓
                  </span>
                  {conseil}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Plan de travail ── */}
        <div className='border border-[#e8e8e8] rounded-xl p-5'>
          <h3 className='text-[13px] font-semibold mb-4'>
            Plan d'apprentissage
          </h3>
          <div className='flex flex-col gap-3'>
            {recommendation.plan_travail.map((p) => (
              <div
                key={p.step}
                className='flex gap-3.5'
              >
                <div className='w-6 h-6 rounded-full bg-[#111] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5'>
                  {p.step}
                </div>
                <div>
                  <div className='flex items-center gap-2'>
                    <strong className='text-[13px] font-semibold'>
                      {p.titre}
                    </strong>
                    <span className='text-[10px] font-mono text-[#888] bg-[#f9f9f9] border border-[#e8e8e8] px-1.5 py-0.5 rounded'>
                      {p.duree}
                    </span>
                  </div>
                  <p className='text-[12px] text-[#888] mt-0.5 leading-relaxed'>
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Ressources recommandées ── */}
        {recommendation.ressources_recommandees?.length > 0 && (
          <div className='border border-[#e8e8e8] rounded-xl p-5'>
            <h3 className='text-[13px] font-semibold mb-3'>
              Ressources recommandées
            </h3>
            <div className='flex flex-col gap-2'>
              {recommendation.ressources_recommandees.map((res, i) => {
                const t = TYPE_STYLE[res.type] || TYPE_STYLE.doc;
                return (
                  <a
                    key={i}
                    href={res.lien}
                    target='_blank'
                    rel='noreferrer'
                    className='flex items-center gap-3 p-3 border border-[#e8e8e8] rounded-lg hover:bg-[#f9f9f9] transition-colors no-underline group'
                  >
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${t.cls}`}
                    >
                      {t.label}
                    </span>
                    <div className='flex-1'>
                      <p className='text-[13px] font-medium text-[#111]'>
                        {res.titre}
                      </p>
                      <p className='text-[11px] text-[#888] truncate'>
                        {res.lien}
                      </p>
                    </div>
                    <svg
                      width='13'
                      height='13'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='#ccc'
                      strokeWidth='2'
                      className='group-hover:stroke-[#888] transition-colors shrink-0'
                    >
                      <path d='M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6' />
                      <polyline points='15 3 21 3 21 9' />
                      <line
                        x1='10'
                        y1='14'
                        x2='21'
                        y2='3'
                      />
                    </svg>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Chat Groq AI ── */}
        <div className='border border-[#e8e8e8] rounded-xl overflow-hidden'>
          <div className='px-5 py-3.5 border-b border-[#e8e8e8]'>
            <h3 className='text-[13px] font-semibold'>
              Poser une question à Groq AI
            </h3>
            <p className='text-[11px] text-[#888] mt-0.5'>
              Les réponses sont basées sur votre profil et votre plan
            </p>
          </div>

          {/* Zone messages */}
          {messages.length > 0 && (
            <div className='p-4 flex flex-col gap-3 max-h-[300px] overflow-y-auto'>
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 rounded-xl text-[13px] leading-relaxed
                      ${
                        m.role === "user"
                          ? "bg-[#111] text-white rounded-br-sm"
                          : "bg-[#f9f9f9] border border-[#e8e8e8] text-[#111] rounded-bl-sm"
                      }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {/* Indicateur "en train de répondre" */}
              {chatLoading && (
                <div className='flex justify-start'>
                  <div className='bg-[#f9f9f9] border border-[#e8e8e8] px-3.5 py-2.5 rounded-xl rounded-bl-sm'>
                    <div className='flex gap-1'>
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className='w-1.5 h-1.5 rounded-full bg-[#888] animate-bounce'
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {/* Anchor pour scroll automatique */}
              <div ref={chatEndRef} />
            </div>
          )}

          {/* Suggestions — affichées seulement si aucun message encore ── */}
          {messages.length === 0 && (
            <div className='px-4 pt-4 flex flex-wrap gap-2'>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendQuestion(s)}
                  className='px-3 py-1.5 border border-[#e8e8e8] rounded-full text-[11px] font-medium text-[#888] hover:border-[#bbb] hover:text-[#111] transition-colors'
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input message */}
          <div className='p-4 flex gap-2'>
            <input
              type='text'
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendQuestion(question)}
              placeholder='Posez votre question…'
              className='flex-1 text-[13px] border border-[#e8e8e8] rounded-lg px-3 py-2.5 outline-none focus:border-[#111] transition-colors placeholder:text-[#888]'
            />
            <button
              onClick={() => sendQuestion(question)}
              disabled={!question.trim() || chatLoading}
              className='px-4 py-2.5 bg-[#111] text-white text-[12px] font-medium rounded-lg hover:bg-[#333] transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
            >
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
