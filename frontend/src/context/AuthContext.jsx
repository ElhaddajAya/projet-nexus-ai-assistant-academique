import { createContext, useContext, useState, useEffect } from "react";

// ─── Création du contexte ────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─── Provider ────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [token, setToken]   = useState(() => localStorage.getItem("token"));
  const [user,  setUser]    = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // Synchroniser localStorage quand token/user changent
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else       localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else      localStorage.removeItem("user");
  }, [user]);

  // Appelé après login réussi
  function login(data) {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("role", data.user.role);
  }

  // Appelé au logout
  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("lastRecoId");
  }

  // Mettre à jour le profil user (après questionnaire)
  function updateUser(updates) {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook personnalisé ───────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans un AuthProvider");
  return ctx;
}