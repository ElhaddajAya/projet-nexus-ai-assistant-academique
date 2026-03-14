import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation locale
    if (form.password.length < 6) {
      return setError("Le mot de passe doit contenir au moins 6 caractères");
    }
    if (form.password !== form.confirmPassword) {
      return setError("Les mots de passe ne correspondent pas");
    }

    setLoading(true);
    try {
      await api.post("/auth/register", {
        prenom: form.prenom,
        nom: form.nom,
        email: form.email,
        password: form.password,
        role: "student",
      });

      // Rediriger vers login avec message de succès
      navigate("/login", {
        state: { success: "Compte créé ! Vous pouvez vous connecter." },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-[#f9f9f9] flex items-center justify-center px-4'>
      <div className='w-full max-w-md bg-white border border-[#e8e8e8] rounded-[14px] p-8'>
        {/* Logo */}
        <div className='flex justify-center mb-6'>
          <div className='w-12 h-12 bg-[#22c55e] rounded-[10px] flex items-center justify-center'>
            <span className='text-white font-bold text-lg'>EMSI</span>
          </div>
        </div>

        <h1 className='text-[#111] text-2xl font-bold text-center mb-1'>
          Créer un compte
        </h1>
        <p className='text-[#888] text-sm text-center mb-6'>
          Rejoignez OrientAI — EMSI
        </p>

        {/* Message d'erreur */}
        {error && (
          <div className='bg-red-50 border border-red-200 text-red-600 text-sm rounded-[10px] px-4 py-3 mb-4'>
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className='space-y-4'
        >
          {/* Prénom + Nom côte à côte */}
          <div className='flex gap-3'>
            <div className='flex-1'>
              <label className='block text-sm font-medium text-[#111] mb-1'>
                Prénom
              </label>
              <input
                type='text'
                name='prenom'
                value={form.prenom}
                onChange={handleChange}
                placeholder='Prenom'
                required
                className='w-full border border-[#e8e8e8] rounded-[10px] px-4 py-2.5 text-sm text-[#111] outline-none focus:border-[#22c55e] transition-colors'
              />
            </div>
            <div className='flex-1'>
              <label className='block text-sm font-medium text-[#111] mb-1'>
                Nom
              </label>
              <input
                type='text'
                name='nom'
                value={form.nom}
                onChange={handleChange}
                placeholder='Nom'
                required
                className='w-full border border-[#e8e8e8] rounded-[10px] px-4 py-2.5 text-sm text-[#111] outline-none focus:border-[#22c55e] transition-colors'
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className='block text-sm font-medium text-[#111] mb-1'>
              Email
            </label>
            <input
              type='email'
              name='email'
              value={form.email}
              onChange={handleChange}
              placeholder='votre@email.com'
              required
              className='w-full border border-[#e8e8e8] rounded-[10px] px-4 py-2.5 text-sm text-[#111] outline-none focus:border-[#22c55e] transition-colors'
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label className='block text-sm font-medium text-[#111] mb-1'>
              Mot de passe
            </label>
            <input
              type='password'
              name='password'
              value={form.password}
              onChange={handleChange}
              placeholder='Min. 6 caractères'
              required
              className='w-full border border-[#e8e8e8] rounded-[10px] px-4 py-2.5 text-sm text-[#111] outline-none focus:border-[#22c55e] transition-colors'
            />
          </div>

          {/* Confirmer mot de passe */}
          <div>
            <label className='block text-sm font-medium text-[#111] mb-1'>
              Confirmer le mot de passe
            </label>
            <input
              type='password'
              name='confirmPassword'
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder='••••••••'
              required
              className='w-full border border-[#e8e8e8] rounded-[10px] px-4 py-2.5 text-sm text-[#111] outline-none focus:border-[#22c55e] transition-colors'
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold rounded-[10px] py-2.5 text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed'
          >
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        <p className='text-center text-sm text-[#888] mt-6'>
          Déjà un compte ?{" "}
          <Link
            to='/login'
            className='text-[#22c55e] font-medium hover:underline'
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
