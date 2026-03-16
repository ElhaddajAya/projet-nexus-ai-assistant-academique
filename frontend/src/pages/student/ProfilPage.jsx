import { useState, useEffect } from "react";
import StudentTopbar from "../../components/student/StudentTopbar";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

// ─── ProfilPage ───────────────────────────────────────────────────────────────
export default function ProfilPage() {
  const { user } = useAuth();

  // ── Filière chargée depuis l'API car user.filiereId est juste un ObjectId ──
  // Le Context ne stocke pas l'objet filière complet, seulement l'ID
  const [filiereNom, setFiliereNom] = useState("");

  useEffect(() => {
    // Si filiereId existe, on charge la filière pour avoir son nom
    if (user?.filiereId) {
      api
        .get("/filieres")
        .then((res) => {
          // Chercher la filière dont l'_id correspond au filiereId de l'user
          const found = res.data.find(
            (f) => f._id === user.filiereId || f._id === user.filiereId?._id,
          );
          if (found) {
            setFiliereNom(`${found.nom_filiere} · ${found.code_filiere}`);
          }
        })
        .catch(() => setFiliereNom("Non renseignée"));
    }
  }, [user?.filiereId]);

  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  // Initiales pour l'avatar
  const initiales = user
    ? `${user.prenom?.[0] ?? ""}${user.nom?.[0] ?? ""}`.toUpperCase()
    : "??";

  function handlePwChange(e) {
    setPwForm({ ...pwForm, [e.target.name]: e.target.value });
    setPwError("");
    setPwSuccess("");
  }

  async function handlePwSubmit(e) {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    if (pwForm.newPassword.length < 6) {
      return setPwError(
        "Le nouveau mot de passe doit contenir au moins 6 caractères",
      );
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      return setPwError("Les mots de passe ne correspondent pas");
    }

    setPwLoading(true);
    try {
      await api.put("/auth/change-password", {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwSuccess("Mot de passe modifié avec succès !");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPwError(
        err.response?.data?.message || "Erreur lors de la modification",
      );
    } finally {
      setPwLoading(false);
    }
  }

  return (
    <>
      <StudentTopbar
        title='Profil'
        subtitle='Vos informations personnelles'
      />

      {/* max-w plus large pour que la page respire bien */}
      <div className='p-7 flex flex-col gap-5'>
        {/* ── Carte avatar ── */}
        <div className='border border-[#e8e8e8] rounded-xl p-6 flex items-center gap-5 bg-white'>
          {/* Cercle initiales */}
          <div className='w-[56px] h-[56px] rounded-full bg-[#111] text-white text-[18px] font-bold flex items-center justify-center shrink-0 select-none'>
            {initiales}
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-[17px] font-semibold text-[#111]'>
              {user?.prenom} {user?.nom}
            </p>
            <p className='text-[13px] text-[#888] mt-0.5'>{user?.email}</p>
          </div>
          <span className='shrink-0 text-[11px] font-semibold text-[#22c55e] bg-[#f0fdf4] border border-[#bbf7d0] px-3 py-1 rounded-full'>
            Étudiant
          </span>
        </div>

        {/* ── Informations personnelles ── */}
        <div className='border border-[#e8e8e8] rounded-xl bg-white overflow-hidden'>
          <div className='px-6 py-4 border-b border-[#e8e8e8]'>
            <h3 className='text-[14px] font-semibold text-[#111]'>
              Informations personnelles
            </h3>
            <p className='text-[12px] text-[#888] mt-0.5'>
              Données de votre compte
            </p>
          </div>

          <div className='p-6 flex flex-col gap-5'>
            {/* Prénom + Nom côte à côte */}
            <div className='grid grid-cols-2 gap-5'>
              <InfoField
                label='Prénom'
                value={user?.prenom}
              />
              <InfoField
                label='Nom'
                value={user?.nom}
              />
            </div>
            <InfoField
              label='Email'
              value={user?.email}
            />
            {/* Filière — chargée depuis l'API, pas depuis le Context */}
            <InfoField
              label='Filière'
              value={
                filiereNom ||
                (user?.filiereId ? "Chargement…" : "Non renseignée")
              }
            />
            <InfoField
              label='Niveau'
              value={user?.niveau || "Non renseigné"}
            />
          </div>
        </div>

        {/* ── Modifier le mot de passe ── */}
        <div className='border border-[#e8e8e8] rounded-xl bg-white overflow-hidden'>
          <div className='px-6 py-4 border-b border-[#e8e8e8]'>
            <h3 className='text-[14px] font-semibold text-[#111]'>
              Modifier le mot de passe
            </h3>
            <p className='text-[12px] text-[#888] mt-0.5'>
              Choisissez un mot de passe sécurisé
            </p>
          </div>

          <form
            onSubmit={handlePwSubmit}
            className='p-6 flex flex-col gap-4'
          >
            {/* Message erreur */}
            {pwError && (
              <div className='flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-600 text-[13px] rounded-[10px] px-4 py-3'>
                <svg
                  width='15'
                  height='15'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  className='shrink-0'
                >
                  <circle
                    cx='12'
                    cy='12'
                    r='10'
                  />
                  <line
                    x1='12'
                    y1='8'
                    x2='12'
                    y2='12'
                  />
                  <line
                    x1='12'
                    y1='16'
                    x2='12.01'
                    y2='16'
                  />
                </svg>
                {pwError}
              </div>
            )}

            {/* Message succès */}
            {pwSuccess && (
              <div className='flex items-center gap-2.5 bg-[#f0fdf4] border border-[#bbf7d0] text-[#16a34a] text-[13px] rounded-[10px] px-4 py-3'>
                <svg
                  width='15'
                  height='15'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2.5'
                  className='shrink-0'
                >
                  <polyline points='20 6 9 17 4 12' />
                </svg>
                {pwSuccess}
              </div>
            )}

            <PwField
              label='Mot de passe actuel'
              name='currentPassword'
              value={pwForm.currentPassword}
              onChange={handlePwChange}
              placeholder='Votre mot de passe actuel'
            />
            <PwField
              label='Nouveau mot de passe'
              name='newPassword'
              value={pwForm.newPassword}
              onChange={handlePwChange}
              placeholder='Min. 6 caractères'
            />
            <PwField
              label='Confirmer le nouveau mot de passe'
              name='confirmPassword'
              value={pwForm.confirmPassword}
              onChange={handlePwChange}
              placeholder='Répétez le nouveau mot de passe'
            />

            <div className='flex justify-end pt-1'>
              <button
                type='submit'
                disabled={pwLoading}
                className='px-5 py-2.5 bg-[#111] text-white text-[13px] font-medium rounded-lg hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
              >
                {pwLoading ? (
                  <>
                    <div className='w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                    Modification…
                  </>
                ) : (
                  "Modifier le mot de passe"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// ─── Champ lecture seule ──────────────────────────────────────────────────────
function InfoField({ label, value }) {
  return (
    <div className='flex flex-col gap-2'>
      <label className='text-[11px] font-semibold text-[#888] uppercase tracking-[0.6px]'>
        {label}
      </label>
      <div className='text-[14px] text-[#111] font-medium border border-[#e8e8e8] rounded-[10px] px-4 py-3 bg-[#fafafa]'>
        {value || "—"}
      </div>
    </div>
  );
}

// ─── Champ mot de passe avec œil intégré ─────────────────────────────────────
// L'input et le bouton œil sont dans un flex wrapper qui gère le border
function PwField({ label, name, value, onChange, placeholder }) {
  const [show, setShow] = useState(false);

  return (
    <div className='flex flex-col gap-2'>
      <label className='text-[13px] font-semibold text-[#111]'>{label}</label>
      <div className='flex items-center border border-[#e8e8e8] rounded-[10px] bg-white focus-within:border-[#111] transition-colors'>
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className='flex-1 text-[14px] text-[#111] px-4 py-3 outline-none bg-transparent placeholder:text-[#ccc]'
        />
        <button
          type='button'
          onClick={() => setShow((s) => !s)}
          className='px-3.5 text-[#ccc] hover:text-[#888] transition-colors shrink-0'
          tabIndex={-1}
        >
          {show ? (
            <svg
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
            >
              <path d='M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94' />
              <path d='M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19' />
              <line
                x1='1'
                y1='1'
                x2='23'
                y2='23'
              />
            </svg>
          ) : (
            <svg
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
            >
              <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
              <circle
                cx='12'
                cy='12'
                r='3'
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
