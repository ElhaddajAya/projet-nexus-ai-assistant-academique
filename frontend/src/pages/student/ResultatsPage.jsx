import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StudentTopbar from "../../components/student/StudentTopbar";

// ─── Mock data ─────────────────────────────────────────────────────────────────
const RESULTATS = [
  {
    id: "1",
    matiere: "Conception UML",
    module: "Génie Logiciel",
    filiere: "4IIR",
    semestre: "S6",
    date: "06/03/2026",
    score: 72,
    analyse:
      "Votre profil révèle des lacunes principalement au niveau des relations entre classes, notamment l'agrégation et la composition. Vous maîtrisez les bases de la notation UML mais rencontrez des difficultés à modéliser des cas d'utilisation complexes avec des relations d'inclusion et d'extension.",
    plan: [
      {
        step: 1,
        titre: "Révision des relations UML",
        duree: "Jours 1–2",
        desc: "Revoir agrégation, composition, héritage avec des exemples concrets.",
      },
      {
        step: 2,
        titre: "Diagrammes de cas d'utilisation",
        duree: "Jours 3–4",
        desc: "Pratiquer les inclusions, extensions et généralisations.",
      },
      {
        step: 3,
        titre: "Exercices pratiques",
        duree: "Jours 5–6",
        desc: "Réaliser les TP notés pour consolider les acquis.",
      },
      {
        step: 4,
        titre: "Révision finale",
        duree: "Jour 7",
        desc: "Mini-examen blanc + correction.",
      },
    ],
    ressources: [
      { titre: "Cours UML – Conception OO", type: "doc", source: "EMSI" },
      {
        titre: "UML – Héritage et composition",
        type: "vid",
        source: "YouTube",
      },
      { titre: "TP noté – Cas d'utilisation", type: "tp", source: "EMSI" },
    ],
  },
  {
    id: "2",
    matiere: "Machine Learning",
    module: "Intelligence Artificielle",
    filiere: "4IIR",
    semestre: "S6",
    date: "02/03/2026",
    score: 58,
    analyse:
      "Votre niveau actuel montre une bonne compréhension des algorithmes de base mais des difficultés à choisir le bon modèle selon le contexte et à interpréter les métriques d'évaluation.",
    plan: [
      {
        step: 1,
        titre: "Fondamentaux du ML",
        duree: "Jours 1–3",
        desc: "Régression, classification, clustering.",
      },
      {
        step: 2,
        titre: "Métriques d'évaluation",
        duree: "Jours 4–5",
        desc: "Accuracy, precision, recall, F1-score.",
      },
      {
        step: 3,
        titre: "Sélection de modèles",
        duree: "Jours 6–7",
        desc: "Critères de choix selon le problème.",
      },
      {
        step: 4,
        titre: "Projets pratiques",
        duree: "Jours 8–10",
        desc: "Application sur datasets réels.",
      },
    ],
    ressources: [
      { titre: "ML – Introduction SVM", type: "doc", source: "EMSI" },
      { titre: "ML Course – Andrew Ng", type: "vid", source: "Coursera" },
    ],
  },
];

const TYPE_STYLE = {
  doc: { label: "DOC", cls: "bg-blue-100 text-blue-700" },
  vid: { label: "VID", cls: "bg-red-100 text-red-700" },
  tp: { label: "TP", cls: "bg-amber-100 text-amber-700" },
};

// ─── Results list ──────────────────────────────────────────────────────────────
export function ResultatsListPage() {
  const navigate = useNavigate();
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
              {RESULTATS.length} analyses générées
            </p>
          </div>
          <div className='divide-y divide-[#e8e8e8]'>
            {RESULTATS.map((r) => (
              <div
                key={r.id}
                onClick={() => navigate(`/student/resultats/${r.id}`)}
                className='flex items-center justify-between px-[18px] py-4 hover:bg-[#f9f9f9] cursor-pointer transition-colors group'
              >
                <div>
                  <p className='text-[13px] font-semibold'>{r.matiere}</p>
                  <p className='text-[11px] text-[#888] mt-0.5'>
                    {r.module} · {r.filiere} · {r.semestre}
                  </p>
                </div>
                <div className='flex items-center gap-3'>
                  <span className='text-[11px] font-mono text-[#888]'>
                    {r.date}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full
                    ${r.score >= 75 ? "bg-[#f0fdf4] text-[#22c55e]" : r.score >= 55 ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-500"}`}
                  >
                    {r.score}%
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
    </>
  );
}

// ─── Result detail + chat ──────────────────────────────────────────────────────
export function ResultatDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const r = RESULTATS.find((x) => x.id === id) || RESULTATS[0];

  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const SUGGESTIONS = [
    "Expliquez-moi l'agrégation vs composition",
    "Donnez-moi un exercice pratique",
    "Comment préparer l'examen ?",
  ];

  // async function sendQuestion(q) {
  //   if (!q.trim()) return;
  //   const userMsg = { role: "user", text: q };
  //   setMessages((m) => [...m, userMsg]);
  //   setQuestion("");
  //   setChatLoading(true);
  //   // TODO: remplacer par vrai appel API → POST /api/recommendations/ask
  //   setTimeout(() => {
  //     setMessages((m) => [...m, {
  //       role: "ai",
  //       text: `Basé sur votre profil en ${r.matiere}, voici ma réponse : cette notion est fondamentale pour maîtriser le reste du module. Je vous recommande de commencer par les ressources listées ci-dessus avant de tenter les exercices pratiques.`,
  //     }]);
  //     setChatLoading(false);
  //   }, 1500);
  // }

  async function sendQuestion(q) {
    if (!q.trim()) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setQuestion("");
    setChatLoading(true);

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "http://localhost:5000/api/recommendations/ask",
        { submissionId: r.submissionId, question: q },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMessages((m) => [...m, { role: "ai", text: data.answer }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text: "Désolé, je n'ai pas pu répondre. Réessayez dans quelques instants.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  return (
    <>
      <StudentTopbar
        title={r.matiere}
        subtitle={`${r.filiere} › ${r.semestre} › ${r.module}`}
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

      <div className='p-7 flex flex-col gap-5 max-w-[780px]'>
        {/* Context strip */}
        <div className='flex items-center gap-2 flex-wrap'>
          {[r.filiere, r.semestre, r.module, r.matiere].map((c, i) => (
            <span
              key={i}
              className='flex items-center gap-1'
            >
              <span className='text-[12px] text-[#888]'>{c}</span>
              {i < 3 && <span className='text-[#ccc] text-[10px]'>›</span>}
            </span>
          ))}
          <span className='ml-auto text-[11px] font-mono text-[#888]'>
            {r.date}
          </span>
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full
            ${r.score >= 75 ? "bg-[#f0fdf4] text-[#22c55e]" : r.score >= 55 ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-500"}`}
          >
            {r.score}%
          </span>
        </div>

        {/* Analyse */}
        <div className='border border-[#e8e8e8] rounded-xl p-5'>
          <div className='flex items-center gap-2 mb-3'>
            <h3 className='text-[13px] font-semibold'>Analyse du profil</h3>
            <span className='text-[10px] font-semibold text-[#888] bg-[#f9f9f9] border border-[#e8e8e8] px-2 py-0.5 rounded-full'>
              Groq AI
            </span>
          </div>
          <p className='text-[13px] text-[#444] leading-relaxed'>{r.analyse}</p>
          <div className='mt-3 p-3 bg-[#f9f9f9] border border-[#e8e8e8] rounded-lg text-[12px] text-[#888] leading-relaxed'>
            💡 Cette analyse est basée uniquement sur vos réponses et les
            ressources configurées par votre administration.
          </div>
        </div>

        {/* Plan */}
        <div className='border border-[#e8e8e8] rounded-xl p-5'>
          <h3 className='text-[13px] font-semibold mb-4'>
            Plan d'apprentissage
          </h3>
          <div className='flex flex-col gap-3'>
            {r.plan.map((p) => (
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

        {/* Ressources */}
        <div className='border border-[#e8e8e8] rounded-xl p-5'>
          <h3 className='text-[13px] font-semibold mb-3'>
            Ressources recommandées
          </h3>
          <div className='flex flex-col gap-2'>
            {r.ressources.map((res, i) => {
              const t = TYPE_STYLE[res.type];
              return (
                <div
                  key={i}
                  className='flex items-center gap-3 p-3 border border-[#e8e8e8] rounded-lg hover:bg-[#f9f9f9] transition-colors cursor-pointer'
                >
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${t.cls}`}
                  >
                    {t.label}
                  </span>
                  <div className='flex-1'>
                    <p className='text-[13px] font-medium'>{res.titre}</p>
                    <p className='text-[11px] text-[#888]'>{res.source}</p>
                  </div>
                  <svg
                    width='13'
                    height='13'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='#ccc'
                    strokeWidth='2'
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
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat zone */}
        <div className='border border-[#e8e8e8] rounded-xl overflow-hidden'>
          <div className='px-5 py-3.5 border-b border-[#e8e8e8]'>
            <h3 className='text-[13px] font-semibold'>
              Poser une question à Groq AI
            </h3>
            <p className='text-[11px] text-[#888] mt-0.5'>
              Les réponses sont basées sur votre profil et vos ressources
            </p>
          </div>

          {/* Messages */}
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
            </div>
          )}

          {/* Suggestion chips */}
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

          {/* Input */}
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
