import { useState, useEffect } from "react";
import BaseModal, { Field, inputClass, selectClass } from "./BaseModal";
import api from "../../../api/axios";

const TYPES = [
  { value: "video", label: "Vidéo" },
  { value: "document", label: "Document" },
  { value: "TP/TD", label: "TP / TD" },
  { value: "site web", label: "Site web" },
];

const NIVEAUX = [
  "1ère année",
  "2ème année",
  "3ème année",
  "4ème année",
  "5ème année",
];

export default function RessourceModal({ open, onClose, onSave, initial }) {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [filiereId, setFiliereId] = useState("");
  const [niveau, setNiveau] = useState("");
  const [matiereId, setMatiereId] = useState("");
  const [lien, setLien] = useState("");

  const [filieres, setFilieres] = useState([]);
  const [matieres, setMatieres] = useState([]);

  // Charger les filières une seule fois au montage
  useEffect(() => {
    api
      .get("/filieres")
      .then((res) => setFilieres(res.data))
      .catch(console.error);
  }, []);

  // Charger les matières quand la filière change
  useEffect(() => {
    if (!filiereId) {
      setMatieres([]);
      return;
    }
    api
      .get("/matieres")
      .then((res) => setMatieres(res.data))
      .catch(console.error);
  }, [filiereId]);

  // Pré-remplir si édition, vider si ajout
  useEffect(() => {
    if (initial) {
      setTitre(initial.titre || "");
      setDescription(initial.description || "");
      setType(initial.type || "");
      setFiliereId(initial.filiereId?._id || initial.filiereId || "");
      setNiveau(initial.niveau || "");
      setMatiereId(initial.matiereId?._id || initial.matiereId || "");
      setLien(initial.lien || "");
    } else {
      setTitre("");
      setDescription("");
      setType("");
      setFiliereId("");
      setNiveau("");
      setMatiereId("");
      setLien("");
    }
  }, [initial, open]);

  function handleSubmit() {
    if (
      !titre.trim() ||
      !description.trim() ||
      !type ||
      !filiereId ||
      !matiereId
    )
      return;
    onSave({
      ...initial,
      titre: titre.trim(),
      description: description.trim(),
      type,
      filiereId,
      niveau,
      matiereId,
      lien,
    });
  }

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={initial ? "Modifier la ressource" : "Ajouter une ressource"}
      footer={
        <>
          <button
            onClick={onClose}
            className='px-3.5 py-[7px] rounded-lg border border-[#e8e8e8] text-[12px] font-medium text-[#888] hover:border-[#bbb] hover:text-[#111] transition-colors'
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className='px-3.5 py-[7px] rounded-lg bg-[#111] text-white text-[12px] font-medium hover:bg-[#333] transition-colors'
          >
            Enregistrer
          </button>
        </>
      }
    >
      {/* Titre */}
      <Field label='Titre'>
        <input
          className={inputClass}
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          placeholder='Ex : Cours UML – Conception OO'
        />
      </Field>

      {/* Description */}
      <Field label='Description'>
        <textarea
          className={`${inputClass} h-[100px] resize-none`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder='Décrivez précisément le contenu : notions couvertes, chapitres, concepts clés. Ex : Cours couvrant Retrofit, les appels asynchrones avec enqueue(), la gestion des erreurs réseau et les timeouts sous Android.'
        />
        <span className='text-[11px] text-[#888]'>
          Une description précise améliore la qualité des recommandations de
          l'IA
        </span>
      </Field>

      {/* Type */}
      <Field label='Type'>
        <select
          className={selectClass}
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option
            value=''
            disabled
          >
            Choisir…
          </option>
          {TYPES.map((t) => (
            <option
              key={t.value}
              value={t.value}
            >
              {t.label}
            </option>
          ))}
        </select>
      </Field>

      {/* Filière + Niveau */}
      <div className='grid grid-cols-2 gap-3'>
        <Field label='Filière'>
          <select
            className={selectClass}
            value={filiereId}
            onChange={(e) => {
              setFiliereId(e.target.value);
              setMatiereId("");
            }}
          >
            <option
              value=''
              disabled
            >
              Choisir…
            </option>
            {filieres.map((f) => (
              <option
                key={f._id}
                value={f._id}
              >
                {f.nom_filiere}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label='Niveau'
          optional
        >
          <select
            className={selectClass}
            value={niveau}
            onChange={(e) => setNiveau(e.target.value)}
          >
            <option
              value=''
              disabled
            >
              Année…
            </option>
            {NIVEAUX.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </Field>
      </div>

      {/* Matière — dépend de la filière */}
      <Field label='Matière'>
        <select
          className={selectClass}
          value={matiereId}
          onChange={(e) => setMatiereId(e.target.value)}
          disabled={!filiereId}
        >
          <option
            value=''
            disabled
          >
            {filiereId
              ? "Choisir une matière…"
              : "Sélectionnez d'abord une filière…"}
          </option>
          {matieres.map((m) => (
            <option
              key={m._id}
              value={m._id}
            >
              {m.nom_matiere}
            </option>
          ))}
        </select>
      </Field>

      {/* Lien */}
      <Field label='Lien'>
        <input
          className={inputClass}
          value={lien}
          onChange={(e) => setLien(e.target.value)}
          placeholder='https://…'
          type='url'
        />
      </Field>
    </BaseModal>
  );
}
