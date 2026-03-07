import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentTopbar from "../../components/student/StudentTopbar";

// ─── Mock data (à remplacer par appels API) ───────────────────────────────────
const FILIERES  = ["4IIR", "GC", "GI", "GE"];
const NIVEAUX   = ["1ère année", "2ème année", "3ème année", "4ème année", "5ème année"];
const SEMESTRES = ["Semestre 1", "Semestre 2"];

const MODULES_BY_FILIERE = {
  "4IIR": [
    { id: "m1", nom: "Génie Logiciel",             sem: "S6" },
    { id: "m2", nom: "Intelligence Artificielle",  sem: "S6" },
    { id: "m3", nom: "Algorithmique avancée",       sem: "S5" },
    { id: "m4", nom: "Réseaux & Sécurité",         sem: "S5" },
    { id: "m5", nom: "Développement Web & Mobile", sem: "S6" },
  ],
  "GC":   [{ id:"m6", nom:"Béton armé", sem:"S5" }, { id:"m7", nom:"Hydraulique", sem:"S5" }],
  "GI":   [{ id:"m8", nom:"Gestion de projet", sem:"S6" }],
  "GE":   [{ id:"m9", nom:"Électronique de puissance", sem:"S5" }],
};

const MATIERES_BY_MODULE = {
  m1: ["Conception UML", "Design Patterns", "Architecture logicielle", "Tests & Qualité"],
  m2: ["Machine Learning", "Deep Learning", "NLP"],
  m3: ["Structures de données", "Graphes", "Complexité"],
  m4: ["Protocoles TCP/IP", "Sécurité réseau", "Administration Linux"],
  m5: ["React JS", "Node.js", "Développement mobile"],
  m6: ["Béton armé 1", "Béton armé 2"],
  m7: ["Hydraulique urbaine"],
  m8: ["Planification de projet"],
  m9: ["Convertisseurs de puissance"],
};

const DIFFICULTES_BY_MATIERE = {
  "Conception UML":       ["Agrégation et composition", "Diagrammes de cas d'utilisation", "Héritage et polymorphisme", "Multiplicités et cardinalités", "Diagrammes de séquence"],
  "Machine Learning":     ["Régression vs Classification", "Overfitting / Underfitting", "Choix du modèle", "Prétraitement des données", "Métriques d'évaluation"],
  "React JS":             ["useState / useEffect", "Props et composants", "Routing", "Appels API", "Gestion d'état global"],
  "Protocoles TCP/IP":    ["Adressage IP", "Subnetting", "Routage", "Protocoles applicatifs"],
  "Design Patterns":      ["Pattern Factory", "Pattern Observer", "Pattern Singleton", "Pattern Strategy"],
  "Structures de données":["Listes chaînées", "Arbres binaires", "Graphes", "Tables de hachage"],
};

const OBJECTIFS = [
  "Préparer les examens",
  "Préparer un stage",
  "Projet de fin d'études (PFE)",
  "Combler mes lacunes",
  "Améliorer ma note",
  "Approfondir mes connaissances",
];

// ─── Step dots ────────────────────────────────────────────────────────────────
function StepDots({ current, total }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors
          ${i + 1 < current ? "bg-[#22c55e]" : i + 1 === current ? "bg-[#111]" : "bg-[#e8e8e8]"}`}
        />
      ))}
    </div>
  );
}

// ─── Select field ─────────────────────────────────────────────────────────────
function SelectField({ label, value, onChange, options, placeholder, disabled }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold text-[#111]">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full text-[13px] text-[#111] border border-[#e8e8e8] rounded-[10px] px-3 py-2.5 outline-none bg-white focus:border-[#111] transition-colors font-sans appearance-none disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: "32px" }}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => (
          <option key={typeof o === "string" ? o : o.id} value={typeof o === "string" ? o : o.id}>
            {typeof o === "string" ? o : `${o.nom} — ${o.sem}`}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Choice card (radio) ──────────────────────────────────────────────────────
function ChoiceCard({ label, sub, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-3.5 py-3 border rounded-[10px] cursor-pointer transition-all select-none
        ${selected ? "border-[#111] bg-[#f9f9f9]" : "border-[#e8e8e8] hover:border-[#bbb] hover:bg-[#f9f9f9]"}`}
    >
      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
        ${selected ? "border-[#111] bg-[#111]" : "border-[#e8e8e8]"}`}>
        {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
      </div>
      <div>
        <strong className="block text-[13px] font-medium text-[#111]">{label}</strong>
        {sub && <span className="text-[11px] text-[#888]">{sub}</span>}
      </div>
    </div>
  );
}

// ─── Check card (checkbox) ────────────────────────────────────────────────────
function CheckCard({ label, checked, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-3.5 py-2.5 border rounded-[10px] cursor-pointer transition-all select-none
        ${checked ? "border-[#111] bg-[#f9f9f9]" : "border-[#e8e8e8] hover:border-[#bbb] hover:bg-[#f9f9f9]"}`}
    >
      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all
        ${checked ? "border-[#111] bg-[#111]" : "border-[#e8e8e8]"}`}>
        {checked && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      <span className="text-[13px] font-medium text-[#111]">{label}</span>
    </div>
  );
}

// ─── Nav buttons ──────────────────────────────────────────────────────────────
function NavButtons({ onPrev, onNext, nextLabel = "Suivant", nextGreen = false }) {
  return (
    <div className="flex justify-between items-center pt-2 border-t border-[#e8e8e8] mt-4">
      {onPrev ? (
        <button onClick={onPrev} className="flex items-center gap-1.5 px-4 py-2 border border-[#e8e8e8] rounded-lg text-[13px] font-medium text-[#888] hover:border-[#bbb] hover:text-[#111] transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Précédent
        </button>
      ) : <span />}
      <button onClick={onNext} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium transition-colors
        ${nextGreen ? "bg-[#22c55e] text-white hover:bg-[#16a34a]" : "bg-[#111] text-white hover:bg-[#333]"}`}>
        {nextLabel}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {nextGreen
            ? <polyline points="20 6 9 17 4 12"/>
            : <polyline points="9 18 15 12 9 6"/>}
        </svg>
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function QuestionnairePage() {
  const navigate = useNavigate();
  const [step,       setStep]       = useState(1);
  const [submitted,  setSubmitted]  = useState(false);
  const [loading,    setLoading]    = useState(false);

  // Form state
  const [filiere,    setFiliere]    = useState("");
  const [niveau,     setNiveau]     = useState("");
  const [semestre,   setSemestre]   = useState("");
  const [moduleId,   setModuleId]   = useState("");
  const [matiere,    setMatiere]    = useState("");
  const [diffs,      setDiffs]      = useState([]);
  const [diffLibre,  setDiffLibre]  = useState("");
  const [objectifs,  setObjectifs]  = useState([]);
  const [objLibre,   setObjLibre]   = useState("");

  const modules  = MODULES_BY_FILIERE[filiere] || [];
  const matieres = moduleId ? (MATIERES_BY_MODULE[moduleId] || []) : [];
  const diffList = matiere  ? (DIFFICULTES_BY_MATIERE[matiere] || []) : [];

  function toggleDiff(d) {
    setDiffs((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);
  }
  function toggleObj(o) {
    setObjectifs((prev) => prev.includes(o) ? prev.filter((x) => x !== o) : [...prev, o]);
  }

  function handleSubmit() {
    setLoading(true);
    // Simulate API call — replace with real axios call
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 2800);
  }

  const TOTAL = 5;
  const progress = (step / TOTAL) * 100;

  // ── Shared card wrapper ──
  const Card = ({ children }) => (
    <div className="w-full max-w-[500px] border border-[#e8e8e8] rounded-[14px] overflow-hidden bg-white">
      {/* Progress bar */}
      <div className="h-[3px] bg-[#e8e8e8]">
        <div className="h-full bg-[#22c55e] rounded-full transition-all duration-300" style={{ width: `${submitted ? 100 : progress}%` }} />
      </div>
      <div className="p-6">{children}</div>
    </div>
  );

  // ── Step header ──
  const Header = ({ title, desc }) => (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold text-[#888]">Étape {step} sur {TOTAL}</span>
        <StepDots current={step} total={TOTAL} />
      </div>
      <h2 className="text-[16px] font-semibold mb-1">{title}</h2>
      <p className="text-[12px] text-[#888] leading-relaxed">{desc}</p>
    </div>
  );

  return (
    <>
      <StudentTopbar title="Nouveau questionnaire" subtitle="Remplissez les étapes pour obtenir votre analyse" />

      <div className="flex-1 flex items-start justify-center p-10">

        {/* ── Success screen ── */}
        {submitted ? (
          <Card>
            <div className="flex flex-col items-center text-center gap-4 py-6">
              <div className="w-12 h-12 rounded-full bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <h2 className="text-[16px] font-semibold mb-1.5">Soumission envoyée !</h2>
                <p className="text-[12px] text-[#888] leading-relaxed max-w-[300px] mx-auto">
                  Gemini AI analyse votre profil et génère votre plan d'apprentissage personnalisé.
                </p>
              </div>
              <button
                onClick={() => navigate("/student/resultats/new")}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#111] text-white text-[13px] font-medium rounded-lg hover:bg-[#333] transition-colors"
              >
                Voir les résultats de l'analyse
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </Card>
        ) : loading ? (
          <Card>
            <div className="flex flex-col items-center text-center gap-4 py-8">
              <div className="w-10 h-10 border-2 border-[#e8e8e8] border-t-[#111] rounded-full animate-spin" />
              <p className="text-[13px] font-medium">Gemini AI génère votre analyse…</p>
              <p className="text-[11px] text-[#888]">Cela prend quelques secondes</p>
            </div>
          </Card>

        ) : step === 1 ? (
          // ── Step 1 : Filière / Niveau / Semestre ──
          <Card>
            <Header title="Votre parcours" desc="Sélectionnez votre filière, niveau et semestre actuel." />
            <div className="flex flex-col gap-3.5">
              <SelectField label="Filière" value={filiere} onChange={(v) => { setFiliere(v); setModuleId(""); setMatiere(""); }} options={FILIERES} placeholder="Choisir une filière…" />
              <div className="grid grid-cols-2 gap-3">
                <SelectField label="Niveau"    value={niveau}    onChange={setNiveau}    options={NIVEAUX}   placeholder="Année…"      />
                <SelectField label="Semestre"  value={semestre}  onChange={setSemestre}  options={SEMESTRES} placeholder="Semestre…"   />
              </div>
            </div>
            <NavButtons onNext={() => setStep(2)} />
          </Card>

        ) : step === 2 ? (
          // ── Step 2 : Module ──
          <Card>
            <Header title="Module concerné" desc="Choisissez le module dans lequel vous rencontrez des difficultés." />
            <div className="flex flex-col gap-2">
              {modules.length === 0
                ? <p className="text-[12px] text-[#888] text-center py-4">Sélectionnez d'abord une filière à l'étape précédente.</p>
                : modules.map((m) => (
                    <ChoiceCard key={m.id} label={m.nom} sub={`${filiere} · ${m.sem}`} selected={moduleId === m.id} onClick={() => { setModuleId(m.id); setMatiere(""); }} />
                  ))}
            </div>
            <NavButtons onPrev={() => setStep(1)} onNext={() => setStep(3)} />
          </Card>

        ) : step === 3 ? (
          // ── Step 3 : Matière ──
          <Card>
            <Header title="Matière concernée" desc="Sélectionnez la matière dans laquelle vous avez des difficultés." />
            <div className="flex flex-col gap-2">
              {matieres.length === 0
                ? <p className="text-[12px] text-[#888] text-center py-4">Sélectionnez d'abord un module à l'étape précédente.</p>
                : matieres.map((m) => (
                    <ChoiceCard key={m} label={m} selected={matiere === m} onClick={() => setMatiere(m)} />
                  ))}
            </div>
            <NavButtons onPrev={() => setStep(2)} onNext={() => setStep(4)} />
          </Card>

        ) : step === 4 ? (
          // ── Step 4 : Difficultés ──
          <Card>
            <Header title="Vos difficultés" desc="Cochez les notions qui vous posent problème. Vous pouvez en sélectionner plusieurs." />
            <div className="flex flex-col gap-2">
              {diffList.length === 0
                ? <p className="text-[12px] text-[#888] text-center py-4">Aucune difficulté listée pour cette matière.</p>
                : diffList.map((d) => (
                    <CheckCard key={d} label={d} checked={diffs.includes(d)} onClick={() => toggleDiff(d)} />
                  ))}
            </div>
            {/* Divider */}
            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px bg-[#e8e8e8]" />
              <span className="text-[11px] text-[#888]">autre</span>
              <div className="flex-1 h-px bg-[#e8e8e8]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold">Précisez <span className="font-normal text-[#888]">(optionnel)</span></label>
              <textarea
                value={diffLibre}
                onChange={(e) => setDiffLibre(e.target.value)}
                rows={3}
                placeholder="Ex : Je n'arrive pas à distinguer les relations entre classes…"
                className="w-full text-[13px] border border-[#e8e8e8] rounded-[10px] px-3 py-2.5 outline-none resize-none focus:border-[#111] transition-colors placeholder:text-[#888] leading-relaxed"
              />
            </div>
            <NavButtons onPrev={() => setStep(3)} onNext={() => setStep(5)} />
          </Card>

        ) : (
          // ── Step 5 : Objectifs ──
          <Card>
            <Header title="Vos objectifs" desc="Qu'est-ce qui vous motive à améliorer cette matière ?" />
            <div className="flex flex-wrap gap-2">
              {OBJECTIFS.map((o) => (
                <button
                  key={o}
                  onClick={() => toggleObj(o)}
                  className={`px-3.5 py-1.5 border rounded-full text-[12px] font-medium transition-all
                    ${objectifs.includes(o) ? "bg-[#111] text-white border-[#111]" : "border-[#e8e8e8] text-[#888] hover:border-[#bbb] hover:text-[#111]"}`}
                >
                  {o}
                </button>
              ))}
            </div>
            {/* Divider */}
            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px bg-[#e8e8e8]" />
              <span className="text-[11px] text-[#888]">ou</span>
              <div className="flex-1 h-px bg-[#e8e8e8]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold">Précisez <span className="font-normal text-[#888]">(optionnel)</span></label>
              <input
                type="text"
                value={objLibre}
                onChange={(e) => setObjLibre(e.target.value)}
                placeholder="Ex : Préparer un entretien technique…"
                className="w-full text-[13px] border border-[#e8e8e8] rounded-[10px] px-3 py-2.5 outline-none focus:border-[#111] transition-colors placeholder:text-[#888]"
              />
            </div>
            <NavButtons onPrev={() => setStep(4)} onNext={handleSubmit} nextLabel="Soumettre" nextGreen />
          </Card>
        )}

      </div>
    </>
  );
}
