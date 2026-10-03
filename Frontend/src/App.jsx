import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Clients from './pages/Clients.jsx';
import Mesures from './pages/Mesures.jsx';
import Commandes from './pages/Commandes.jsx';
import Paiements from './pages/Paiements.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AppLayout from './layouts/AppLayout.jsx';
import './styles/index.css';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/mesures" replace />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/mesures" element={<Mesures />} />
        <Route path="/commandes" element={<Commandes />} />
        <Route path="/paiements" element={<Paiements />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/mesures" replace />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
