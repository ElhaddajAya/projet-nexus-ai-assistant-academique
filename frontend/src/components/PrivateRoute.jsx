import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ─── PrivateRoute ─────────────────────────────────────────────────────────────
// Usage : <PrivateRoute role="student"><MonComposant /></PrivateRoute>
// - Si pas connecté → redirige vers /login
// - Si rôle incorrect → redirige vers /login
export default function PrivateRoute({ children, role }) {
  const { token, user } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
}