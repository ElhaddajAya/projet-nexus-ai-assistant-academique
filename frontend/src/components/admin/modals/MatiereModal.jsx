import { useState, useEffect } from "react";
import BaseModal, { Field, inputClass, selectClass } from "./BaseModal";

const MODULES = [
  "Génie Logiciel", "Intelligence Artificielle",
  "Algorithmique avancée", "Réseaux & Sécurité",
  "Développement Web & Mobile", "Béton armé",
];

export default function MatiereModal({ open, onClose, onSave, initial }) {
  const [nom,        setNom]        = useState("");
  const [module,     setModule]     = useState("");
  const [difficultes, setDiffs]     = useState("");

  useEffect(() => {
    if (initial) {
      setNom(initial.nom);
      setModule(initial.module);
      setDiffs(initial.difficultes || "");
    } else {
      setNom(""); setModule(""); setDiffs("");
    }
  }, [initial, open]);

  function handleSubmit() {
    if (!nom.trim() || !module) return;
    onSave({ ...initial, nom: nom.trim(), module, difficultes: difficultes.trim() });
  }

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={initial ? "Modifier la matière" : "Ajouter une matière"}
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
      <Field label="Nom de la matière">
        <input className={inputClass} value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex : Conception UML" />
      </Field>

      <Field label="Module">
        <select className={selectClass} value={module} onChange={(e) => setModule(e.target.value)}>
          <option value="" disabled>Choisir un module…</option>
          {MODULES.map((m) => <option key={m}>{m}</option>)}
        </select>
      </Field>

      <Field label="Difficultés" optional>
        <textarea
          className={`${inputClass} resize-none min-h-[80px] leading-relaxed`}
          value={difficultes}
          onChange={(e) => setDiffs(e.target.value)}
          placeholder={"Agrégation et composition\nDiagrammes de cas d'utilisation\nHéritage et polymorphisme"}
        />
        <span className="text-[11px] text-[#888]">Une difficulté par ligne</span>
      </Field>
    </BaseModal>
  );
}
