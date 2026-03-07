import { useState, useEffect, useRef } from "react";
import BaseModal, { Field, inputClass, selectClass } from "./BaseModal";

// ─── Mock data — à remplacer par appels API ───────────────────────────────────
const FILIERES = ["4IIR", "GC", "GI", "GE"];
const NIVEAUX  = ["1ère année", "2ème année", "3ème année", "4ème année", "5ème année"];
const MATIERES_BY_FILIERE = {
  "4IIR": ["Conception UML", "Design Patterns", "Machine Learning", "Protocoles TCP/IP", "React JS", "Structures de données"],
  "GC":   ["Béton armé", "Résistance des matériaux", "Topographie", "Hydraulique"],
  "GI":   ["Gestion de projet", "Lean Manufacturing", "Logistique"],
  "GE":   ["Électronique de puissance", "Automatique", "Électrotechnique"],
};
const TYPES = [
  { value: "doc", label: "Document" },
  { value: "vid", label: "Vidéo"    },
  { value: "tp",  label: "TP / TD"  },
];

export default function RessourceModal({ open, onClose, onSave, initial }) {
  const [titre,   setTitre]   = useState("");
  const [type,    setType]    = useState("");
  const [filiere, setFiliere] = useState("");
  const [niveau,  setNiveau]  = useState("");
  const [matiere, setMatiere] = useState("");
  const [lien,    setLien]    = useState("");
  const [file,    setFile]    = useState(null);

  const fileRef = useRef(null);

  // Reset / populate form
  useEffect(() => {
    if (initial) {
      setTitre(initial.titre || "");
      setType(initial.type || "");
      setFiliere(initial.filiere || "");
      setNiveau(initial.niveau || "");
      setMatiere(initial.matiere || "");
      setLien(initial.lien || "");
      setFile(null);
    } else {
      setTitre(""); setType(""); setFiliere("");
      setNiveau(""); setMatiere(""); setLien(""); setFile(null);
    }
  }, [initial, open]);

  // Reset matière when filière changes
  function handleFiliereChange(val) {
    setFiliere(val);
    setMatiere("");
  }

  function handleSubmit() {
    if (!titre.trim() || !type || !filiere || !niveau || !matiere) return;
    onSave({ ...initial, titre: titre.trim(), type, filiere, niveau, matiere, lien, file });
  }

  // Available matieres based on selected filiere
  const matieres = filiere ? (MATIERES_BY_FILIERE[filiere] || []) : [];

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={initial ? "Modifier la ressource" : "Ajouter une ressource"}
      footer={
        <>
          <button onClick={onClose} className="px-3.5 py-[7px] rounded-lg border border-[#e8e8e8] text-[12px] font-medium text-[#888] hover:border-[#bbb] hover:text-[#111] transition-colors">
            Annuler
          </button>
          <button onClick={handleSubmit} className="px-3.5 py-[7px] rounded-lg bg-[#111] text-white text-[12px] font-medium hover:bg-[#333] transition-colors">
            Enregistrer
          </button>
        </>
      }
    >
      {/* Titre */}
      <Field label="Titre">
        <input className={inputClass} value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Ex : Cours UML – Conception OO" />
      </Field>

      {/* Type */}
      <Field label="Type">
        <select className={selectClass} value={type} onChange={(e) => setType(e.target.value)}>
          <option value="" disabled>Choisir…</option>
          {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </Field>

      {/* Filière + Niveau */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Filière">
          <select className={selectClass} value={filiere} onChange={(e) => handleFiliereChange(e.target.value)}>
            <option value="" disabled>Choisir…</option>
            {FILIERES.map((f) => <option key={f}>{f}</option>)}
          </select>
        </Field>
        <Field label="Niveau">
          <select className={selectClass} value={niveau} onChange={(e) => setNiveau(e.target.value)}>
            <option value="" disabled>Année…</option>
            {NIVEAUX.map((n) => <option key={n}>{n}</option>)}
          </select>
        </Field>
      </div>

      {/* Matière — dépend de la filière */}
      <Field label="Matière">
        <select
          className={selectClass}
          value={matiere}
          onChange={(e) => setMatiere(e.target.value)}
          disabled={!filiere}
        >
          <option value="" disabled>
            {filiere ? "Choisir une matière…" : "Sélectionnez d'abord une filière…"}
          </option>
          {matieres.map((m) => <option key={m}>{m}</option>)}
        </select>
      </Field>

      {/* Lien — visible seulement si type = vidéo */}
      {type === "vid" && (
        <Field label="Lien de la vidéo">
          <input
            className={inputClass}
            value={lien}
            onChange={(e) => setLien(e.target.value)}
            placeholder="https://youtube.com/…"
            type="url"
          />
        </Field>
      )}

      {/* Upload — visible si type = doc ou tp */}
      {(type === "doc" || type === "tp") && (
        <Field label="Fichier">
          <div
            onClick={() => fileRef.current?.click()}
            className={`border-[1.5px] border-dashed rounded-[10px] p-5 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all text-center
              ${file
                ? "border-[#22c55e] bg-[#f0fdf4] text-[#22c55e]"
                : "border-[#e8e8e8] text-[#888] hover:border-[#111] hover:text-[#111] hover:bg-[#f9f9f9]"
              }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span className="text-[13px] font-medium">
              {file ? file.name : "Cliquez pour uploader un fichier"}
            </span>
            <span className={`text-[11px] ${file ? "text-[#22c55e]/70" : "text-[#888]"}`}>
              {file ? "Fichier sélectionné" : "PDF, DOCX — max 10 Mo"}
            </span>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.docx,.doc"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </Field>
      )}

    </BaseModal>
  );
}
