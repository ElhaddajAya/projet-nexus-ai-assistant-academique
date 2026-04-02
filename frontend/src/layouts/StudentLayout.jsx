import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ─── Composant logo boussole OrientAI ────────────────────────────────────────
// Remplace l'ancien badge vert "EMSI" par le symbole SVG de la boussole
function CompassLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="72" fill="none" stroke="#22c55e" strokeWidth="2.5"/>
      <circle cx="100" cy="100" r="56" fill="#22c55e" opacity="0.08"/>
      <polygon points="100,40 88,100 100,88 112,100" fill="#22c55e"/>
      <polygon points="100,160 88,100 100,112 112,100" fill="#22c55e" opacity="0.3"/>
      <circle cx="100" cy="100" r="6" fill="#22c55e"/>
      <line x1="100" y1="28" x2="100" y2="38" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/>
      <line x1="100" y1="162" x2="100" y2="172" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/>
      <line x1="172" y1="100" x2="162" y2="100" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/>
      <line x1="28" y1="100" x2="38" y2="100" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="136" cy="61" r="4.5" fill="#22c55e"/>
      <circle cx="148" cy="73" r="2.5" fill="#22c55e" opacity="0.55"/>
      <circle cx="142" cy="51" r="2.5" fill="#22c55e" opacity="0.35"/>
    </svg>
  );
}

const NAV_ITEMS = [
  {
    label: "Navigation",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        path: "/student",
        icon: (
          <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-[15px] h-[15px]'>
            <rect x='3' y='3' width='7' height='7' rx='1'/>
            <rect x='14' y='3' width='7' height='7' rx='1'/>
            <rect x='3' y='14' width='7' height='7' rx='1'/>
            <rect x='14' y='14' width='7' height='7' rx='1'/>
          </svg>
        ),
      },
      {
        id: "resultats",
        label: "Mes résultats",
        path: "/student/resultats",
        icon: (
          <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-[15px] h-[15px]'>
            <polyline points='22 12 18 12 15 21 9 3 6 12 2 12'/>
          </svg>
        ),
      },
      {
        id: "ressources",
        label: "Ressources",
        path: "/student/ressources",
        icon: (
          <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-[15px] h-[15px]'>
            <path d='M4 19.5A2.5 2.5 0 016.5 17H20'/>
            <path d='M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z'/>
          </svg>
        ),
      },
    ],
  },
  {
    label: "Compte",
    items: [
      {
        id: "profil",
        label: "Profil",
        path: "/student/profil",
        icon: (
          <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-[15px] h-[15px]'>
            <circle cx='12' cy='8' r='4'/>
            <path d='M20 21a8 8 0 10-16 0'/>
          </svg>
        ),
      },
    ],
  },
];

export default function StudentLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initiales = user
    ? `${user.prenom?.[0] ?? ""}${user.nom?.[0] ?? ""}`.toUpperCase()
    : "??";

  const displayName = user ? `${user.prenom} ${user.nom}` : "Étudiant";
  const displaySub = user?.semestre ? `Semestre ${user.semestre}` : "Étudiant";

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className='flex min-h-screen bg-white text-[#111] font-sans text-sm'>
      <aside className='w-[220px] min-h-screen border-r border-[#e8e8e8] flex flex-col py-5 fixed inset-y-0 left-0 bg-white z-10'>
        {/* Logo — boussole SVG + nom OrientAI */}
        <div className='flex items-center gap-2.5 px-4 pb-5 border-b border-[#e8e8e8]'>
          <CompassLogo />
          <div>
            <strong className='block text-[13px] font-semibold'>OrientAI</strong>
            <small className='text-[11px] text-[#888]'>Assistant académique</small>
          </div>
        </div>

        {/* Nav */}
        <nav className='flex-1 px-2.5 py-4 flex flex-col gap-0.5'>
          {NAV_ITEMS.map((group) => (
            <div key={group.label}>
              <p className='text-[10px] font-semibold text-[#888] uppercase tracking-[0.8px] px-2 pt-2.5 pb-1.5'>
                {group.label}
              </p>
              {group.items.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  end={item.path === "/student"}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-2.5 py-2 rounded-[10px] text-[13px] font-medium transition-all duration-100 no-underline
                    ${isActive ? "bg-[#111] text-white" : "text-[#888] hover:bg-[#f9f9f9] hover:text-[#111]"}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className={isActive ? "text-white" : "text-[#888]"}>
                        {item.icon}
                      </span>
                      {item.label}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer — vrai nom utilisateur */}
        <div className='px-2.5 pt-3.5 border-t border-[#e8e8e8]'>
          <div className='flex items-center gap-2.5 p-2 rounded-[10px]'>
            <div className='w-[30px] h-[30px] rounded-full bg-[#111] text-white text-[11px] font-semibold flex items-center justify-center shrink-0'>
              {initiales}
            </div>
            <div className='flex-1 min-w-0'>
              <strong className='block text-[12px] font-semibold truncate'>{displayName}</strong>
              <small className='text-[11px] text-[#888]'>{displaySub}</small>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className='mt-1 w-full flex items-center gap-2 px-2 py-1.5 rounded-[10px] text-[12px] text-[#888] hover:bg-[#f9f9f9] hover:text-red-500 transition-colors'
          >
            <svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
              <path d='M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4'/>
              <polyline points='16 17 21 12 16 7'/>
              <line x1='21' y1='12' x2='9' y2='12'/>
            </svg>
            Déconnexion
          </button>
        </div>
      </aside>

      <main className='ml-[220px] flex-1 flex flex-col'>
        <Outlet />
      </main>
    </div>
  );
}
