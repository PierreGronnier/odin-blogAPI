// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { isAdmin } from "./utils/auth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import "./styles/global.css";

// Composant pour protéger les routes admin
function AdminRoute({ children }) {
  // Vérifie si l'utilisateur est admin
  if (!isAdmin()) {
    // Redirige vers la page de login
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route publique */}
        <Route path="/login" element={<Login />} />

        {/* Routes protégées (admin seulement) */}
        <Route
          path="/"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
