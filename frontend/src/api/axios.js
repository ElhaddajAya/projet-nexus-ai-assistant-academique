import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Injecter le token JWT automatiquement dans chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Si le token est expiré ou invalide → rediriger vers /login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;