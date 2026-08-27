import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Clients from './pages/Clients.jsx';
import Mesures from './pages/Mesures.jsx';
import Commandes from './pages/Commandes.jsx';
import Paiements from './pages/Paiements.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';
import AppLayout from './layouts/AppLayout.jsx';
import Parametres from './pages/Parametres.jsx';
import Utilisateurs from './pages/Utilisateurs.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import "./styles/index.css";
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));

  return (
    <BrowserRouter>
      <Routes>
        {/* ROUTES PUBLIQUES (AuthLayout) */}
        <Route element={<AuthLayout />}>
  <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/reset-password/:token" element={<ResetPassword />} />
</Route>

        {/* ROUTES PROTÉGÉES (AppLayout) */}
        <Route element={isAuthenticated ? <AppLayout onLogout={() => setIsAuthenticated(false)} /> : <Navigate to="/login" replace />}>
          <Route path="/" element={<AdminRoute> <Dashboard /> </AdminRoute>}/>
          <Route path="/clients" element={<Clients />} />
          <Route path="/mesures" element={<Mesures />} />
          <Route path="/commandes" element={<Commandes />} />
          <Route path="/paiements" element={<AdminRoute> <Paiements /> </AdminRoute>}/>
          <Route path="/parametres" element={<Parametres />} />
          <Route path="/utilisateurs" element={<AdminRoute> <Utilisateurs /> </AdminRoute>}/>
        </Route>

        {/* Redirect par défaut */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
