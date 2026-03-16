import { useState, useEffect } from "react";
import BaseModal, { Field, inputClass } from "./BaseModal";

export default function FiliereModal({ open, onClose, onSave, initial }) {
  const [nom_filiere,  setNom]  = useState("");
  const [code_filiere, setCode] = useState("");

  useEffect(() => {
    if (initial) {
      setNom(initial.nom_filiere  ?? "");
      setCode(initial.code_filiere ?? "");
    } else {
      setNom(""); setCode("");
    }
  }, [initial, open]);

  function handleSubmit() {
    if (!nom_filiere.trim() || !code_filiere.trim()) return;
    onSave({
      ...initial,
      nom_filiere:  nom_filiere.trim(),
      code_filiere: code_filiere.trim().toUpperCase(),
    });
  }

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={initial ? "Modifier la filière" : "Ajouter une filière"}
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
      <Field label="Nom de la filière">
        <input
          className={inputClass}
          value={nom_filiere}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Ex : Génie Informatique"
        />
      </Field>
      <Field label="Code">
        <input
          className={inputClass}
          value={code_filiere}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Ex : GIN"
          maxLength={6}
        />
      </Field>
    </BaseModal>
  );
}