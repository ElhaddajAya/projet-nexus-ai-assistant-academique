import { useState, useEffect } from "react";
import BaseModal, { Field, inputClass, selectClass } from "./BaseModal";
import api from "../../../api/axios";

export default function MatiereModal({ open, onClose, onSave, initial }) {
  const [nom_matiere, setNom]    = useState("");
  const [moduleId,    setModule] = useState("");
  const [difficultes, setDiffs]  = useState("");

  // Vrais modules depuis l'API
  const [modules, setModules] = useState([]);

  useEffect(() => {
    api.get("/modules")
      .then((res) => setModules(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (initial) {
      setNom(initial.nom_matiere ?? "");
      // moduleId peut être un objet populé { _id, nom_module } ou un string _id
      setModule(initial.moduleId?._id ?? initial.moduleId ?? "");
      // difficultes est un array dans le backend, on l'affiche une par ligne
      setDiffs(
        Array.isArray(initial.difficultes)
          ? initial.difficultes.join("\n")
          : initial.difficultes || ""
      );
    } else {
      setNom(""); setModule(""); setDiffs("");
    }
  }, [initial, open]);

  function handleSubmit() {
    if (!nom_matiere.trim() || !moduleId) return;
    // difficultes : convertir le texte en array (une difficulté par ligne)
    const diffsArray = difficultes
      .split("\n")
      .map((d) => d.trim())
      .filter(Boolean);

    onSave({ ...initial, nom_matiere: nom_matiere.trim(), moduleId, difficultes: diffsArray });
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
        <input
          className={inputClass}
          value={nom_matiere}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Ex : Conception UML"
        />
      </Field>

      {/* Module — chargé depuis /api/modules */}
      <Field label="Module">
        <select
          className={selectClass}
          value={moduleId}
          onChange={(e) => setModule(e.target.value)}
        >
          <option value="" disabled>Choisir un module…</option>
          {modules.map((m) => (
            <option key={m._id} value={m._id}>
              {m.nom_module}
            </option>
          ))}
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