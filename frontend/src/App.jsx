import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ── Admin ──────────────────────────────────────────────────────────────────────
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import FilieresPage from "./pages/admin/FilieresPage";
import { ModulesPage, MatieresPage, RessourcesPage, SoumissionsPage } from "./pages/admin/AdminPages";

// ── Student ────────────────────────────────────────────────────────────────────
import StudentLayout from "./layouts/StudentLayout";
import StudentDashboardPage from "./pages/student/StudentDashboardPage";
import QuestionnairePage from "./pages/student/QuestionnairePage";
import { ResultatsListPage, ResultatDetailPage } from "./pages/student/ResultatsPage";
import RessourcesStudentPage from "./pages/student/RessourcesStudentPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Admin ── */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index              element={<AdminDashboardPage />} />
          <Route path="filieres"    element={<FilieresPage />}       />
          <Route path="modules"     element={<ModulesPage />}        />
          <Route path="matieres"    element={<MatieresPage />}       />
          <Route path="ressources"  element={<RessourcesPage />}     />
          <Route path="soumissions" element={<SoumissionsPage />}    />
        </Route>

        {/* ── Student ── */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index              element={<StudentDashboardPage />}   />
          <Route path="questionnaire" element={<QuestionnairePage />}   />
          <Route path="resultats"     element={<ResultatsListPage />}    />
          <Route path="resultats/:id" element={<ResultatDetailPage />}  />
          <Route path="ressources"    element={<RessourcesStudentPage />}/>
        </Route>

        {/* Default */}
        <Route path="*" element={<Navigate to="/student" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
