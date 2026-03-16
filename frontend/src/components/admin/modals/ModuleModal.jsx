import { useState, useEffect } from "react";
import BaseModal, { Field, inputClass, selectClass } from "./BaseModal";
import api from "../../../api/axios";

const SEMESTRES = ["S1", "S2", "S3", "S4", "S5", "S6"];

export default function ModuleModal({ open, onClose, onSave, initial }) {
  const [nom,      setNom]      = useState("");
  const [filiere,  setFiliere]  = useState("");
  const [semestre, setSemestre] = useState("");

  // ── Vraies filières depuis l'API ─────────────────────────────────────────────
  const [filieres, setFilieres] = useState([]);

  useEffect(() => {
    api
      .get("/filieres")
      .then((res) => setFilieres(res.data))
      .catch(console.error);
  }, []); // chargé une seule fois au montage

  // ── Pré-remplir si édition, vider si ajout ───────────────────────────────────
  useEffect(() => {
    if (initial) {
      setNom(initial.nom);
      // Supporte objet populé { _id, nom } ou string simple
      setFiliere(initial.filiere?._id ?? initial.filiere ?? "");
      setSemestre(initial.semestre);
    } else {
      setNom(""); setFiliere(""); setSemestre("");
    }
  }, [initial, open]);

  function handleSubmit() {
    if (!nom.trim() || !filiere || !semestre) return;
    onSave({ ...initial, nom: nom.trim(), filiere, semestre });
  }

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={initial ? "Modifier le module" : "Ajouter un module"}
      footer={
        <>
          <button
            onClick={onClose}
            className="px-3.5 py-[7px] rounded-lg border border-[#e8e8e8] text-[12px] font-medium text-[#888] hover:border-[#bbb] hover:text-[#111] transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="px-3.5 py-[7px] rounded-lg bg-[#111] text-white text-[12px] font-medium hover:bg-[#333] transition-colors"
          >
            Enregistrer
          </button>
        </>
      }
    >
      <Field label="Nom du module">
        <input
          className={inputClass}
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Ex : Intelligence Artificielle"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        {/* Filière — chargée depuis /api/filieres */}
        <Field label="Filière">
          <select
            className={selectClass}
            value={filiere}
            onChange={(e) => setFiliere(e.target.value)}
          >
            <option value="" disabled>Choisir…</option>
            {filieres.map((f) => (
              <option key={f._id} value={f._id}>
                {f.code ?? f.nom_filiere}
              </option>
            ))}
          </select>
        </Field>

        {/* Semestre — liste fixe */}
        <Field label="Semestre">
          <select
            className={selectClass}
            value={semestre}
            onChange={(e) => setSemestre(e.target.value)}
          >
            <option value="" disabled>Choisir…</option>
            {SEMESTRES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
      </div>
    </BaseModal>
  );
}
