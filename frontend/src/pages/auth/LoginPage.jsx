import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      // Stocker dans le Context (qui sync localStorage automatiquement)
      login(res.data);

      // Rediriger selon le rôle
      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/student");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-[#f9f9f9] flex items-center justify-center px-4'>
      <div className='w-full max-w-md bg-white border border-[#e8e8e8] rounded-[14px] p-8'>
        {/* Logo */}
        <div className='flex justify-center'>
          <svg
            width='100'
            height='100'
            viewBox='0 0 200 200'
            xmlns='http://www.w3.org/2000/svg'
          >
            <circle
              cx='100'
              cy='100'
              r='72'
              fill='none'
              stroke='#22c55e'
              strokeWidth='2.5'
            />
            <circle
              cx='100'
              cy='100'
              r='56'
              fill='#22c55e'
              opacity='0.08'
            />
            <polygon
              points='100,40 88,100 100,88 112,100'
              fill='#22c55e'
            />
            <polygon
              points='100,160 88,100 100,112 112,100'
              fill='#22c55e'
              opacity='0.3'
            />
            <circle
              cx='100'
              cy='100'
              r='6'
              fill='#22c55e'
            />
            <line
              x1='100'
              y1='28'
              x2='100'
              y2='38'
              stroke='#22c55e'
              strokeWidth='2'
              strokeLinecap='round'
            />
            <line
              x1='100'
              y1='162'
              x2='100'
              y2='172'
              stroke='#22c55e'
              strokeWidth='2'
              strokeLinecap='round'
            />
            <line
              x1='172'
              y1='100'
              x2='162'
              y2='100'
              stroke='#22c55e'
              strokeWidth='2'
              strokeLinecap='round'
            />
            <line
              x1='28'
              y1='100'
              x2='38'
              y2='100'
              stroke='#22c55e'
              strokeWidth='2'
              strokeLinecap='round'
            />
            <circle
              cx='136'
              cy='61'
              r='4.5'
              fill='#22c55e'
            />
            <circle
              cx='148'
              cy='73'
              r='2.5'
              fill='#22c55e'
              opacity='0.55'
            />
            <circle
              cx='142'
              cy='51'
              r='2.5'
              fill='#22c55e'
              opacity='0.35'
            />
          </svg>
        </div>

        <h1 className='text-[#111] text-2xl font-bold text-center mb-1'>
          Connexion
        </h1>
        <p className='text-[#888] text-sm text-center mb-6'>
          Accédez à votre espace OrientAI
        </p>

        {error && (
          <div className='bg-red-50 border border-red-200 text-red-600 text-sm rounded-[10px] px-4 py-3 mb-4'>
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className='space-y-4'
        >
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
          <div>
            <label className='block text-sm font-medium text-[#111] mb-1'>
              Mot de passe
            </label>
            <input
              type='password'
              name='password'
              value={form.password}
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
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className='text-center text-sm text-[#888] mt-6'>
          Pas encore de compte ?{" "}
          <Link
            to='/register'
            className='text-[#22c55e] font-medium hover:underline'
          >
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
