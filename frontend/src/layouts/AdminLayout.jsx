import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  {
    label: "Vue générale",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        path: "/admin",
        count: null,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[15px] h-[15px]">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "Contenu",
    items: [
      {
        id: "filieres",
        label: "Filières",
        path: "/admin/filieres",
        count: null,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[15px] h-[15px]">
            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
          </svg>
        ),
      },
      {
        id: "modules",
        label: "Modules",
        path: "/admin/modules",
        count: null,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[15px] h-[15px]">
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
          </svg>
        ),
      },
      {
        id: "matieres",
        label: "Matières",
        path: "/admin/matieres",
        count: null,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[15px] h-[15px]">
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
          </svg>
        ),
      },
      {
        id: "ressources",
        label: "Ressources",
        path: "/admin/ressources",
        count: null,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[15px] h-[15px]">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "Activité",
    items: [
      {
        id: "soumissions",
        label: "Soumissions",
        path: "/admin/soumissions",
        count: null,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[15px] h-[15px]">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        ),
      },
    ],
  },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initiales = user
    ? `${user.prenom?.[0] ?? ""}${user.nom?.[0] ?? ""}`.toUpperCase()
    : "AD";

  const displayName = user ? `${user.prenom} ${user.nom}` : "Administrateur";

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen bg-white text-[#111] font-sans text-sm">
      <aside className="w-[220px] min-h-screen border-r border-[#e8e8e8] flex flex-col py-5 fixed inset-y-0 left-0 bg-white z-10">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 pb-5 border-b border-[#e8e8e8]">
          <div className="w-8 h-8 bg-[#22c55e] rounded-lg flex items-center justify-center text-[10px] font-bold text-white tracking-tight">
            EMSI
          </div>
          <div>
            <strong className="block text-[13px] font-semibold">OrientAI</strong>
            <small className="text-[11px] text-[#888]">Administration</small>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2.5 py-4 flex flex-col gap-0.5">
          {NAV_ITEMS.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.8px] px-2 pt-2.5 pb-1.5">
                {group.label}
              </p>
              {group.items.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  end={item.path === "/admin"}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-2.5 py-2 rounded-[10px] text-[13px] font-medium transition-all duration-100 no-underline
                    ${isActive ? "bg-[#111] text-white" : "text-[#888] hover:bg-[#f9f9f9] hover:text-[#111]"}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className={isActive ? "text-white" : "text-[#888]"}>{item.icon}</span>
                      {item.label}
                      {item.count !== null && (
                        <span className={`ml-auto text-[11px] font-semibold font-mono ${isActive ? "text-white/50" : "text-[#888]"}`}>
                          {item.count}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer — vrai nom admin */}
        <div className="px-2.5 pt-3.5 border-t border-[#e8e8e8]">
          <div className="flex items-center gap-2.5 p-2 rounded-[10px]">
            <div className="w-[30px] h-[30px] rounded-full bg-[#111] text-white text-[11px] font-semibold flex items-center justify-center shrink-0">
              {initiales}
            </div>
            <div className="flex-1 min-w-0">
              <strong className="block text-[12px] font-semibold truncate">{displayName}</strong>
              <small className="text-[11px] text-[#888]">Administrateur</small>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-1 w-full flex items-center gap-2 px-2 py-1.5 rounded-[10px] text-[12px] text-[#888] hover:bg-[#f9f9f9] hover:text-red-500 transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Déconnexion
          </button>
        </div>
      </aside>

      <main className="ml-[220px] flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}