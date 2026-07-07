import { FiBell, FiLogOut, FiMenu } from 'react-icons/fi';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Clients from './pages/Clients.jsx';
import Mesures from './pages/Mesures.jsx';
import Commandes from './pages/Commandes.jsx';
import Paiements from './pages/Paiements.jsx';
import Dashboard from './pages/Dashboard.jsx';
import './global.css';

const App = () => {
  return (
    <BrowserRouter>
      <div className="app-layout">
        {/* SIDEBAR À GAUCHE */}
        <aside className="sidebar">
          {/* Logo en haut */}
          <div className="sidebar-logo">
            <img src="/logo-sidebar.png" alt="Gen's Couture Logo" className="logo-img" />
          </div>

          {/* Navigation */}
          <nav className="sidebar-nav">
            <NavLink 
              className={({isActive}) => isActive ? "nav-item active" : "nav-item"} 
              to="/clients"
            >
              Clients
            </NavLink>
            <NavLink 
              className={({isActive}) => isActive ? "nav-item active" : "nav-item"} 
              to="/mesures"
            >
              Mesures
            </NavLink>
            <NavLink 
              className={({isActive}) => isActive ? "nav-item active" : "nav-item"} 
              to="/commandes"
            >
              Commande
            </NavLink>
            <NavLink 
              className={({isActive}) => isActive ? "nav-item active" : "nav-item"} 
              to="/paiements"
            >
              Paiements
            </NavLink>
            <NavLink 
              className={({isActive}) => isActive ? "nav-item active" : "nav-item"} 
              to="/"
            >
              Dashboard
            </NavLink>
          </nav>

          {/* Illustration en bas */}
          <div className="sidebar-illustration">
            <img src="/mannequin.png" alt="Mannequin Couture" className="mannequin-img" />
          </div>

          {/* Profil utilisateur en bas */}
          <div className="sidebar-profile">
            <div className="profile-avatar">O</div>
            <div className="profile-info">
              <p className="profile-name">Oloumidé</p>
              <p className="profile-role">Administrateur</p>
            </div>
          </div>
        </aside>

        {/* CONTENU PRINCIPAL (Navbar top + Pages) */}
        <div className="main-content">
          {/* Navbar en haut */}
          {/* Navbar en haut */}
<header className="top-navbar">
  <div className="navbar-left">
    <button className="menu-burger">
      <FiMenu size={24} />
    </button>
  </div>
  <div className="navbar-right">
    <button className="notification-btn">
      <FiBell size={24} />
      <span className="notification-badge">9</span>
    </button>
    <button className="logout-btn">
      Déconnexion
      <FiLogOut size={20} />
    </button>
  </div>
</header>

          {/* Pages */}
          <main className="page-content">
            <Routes>
              <Route path="/clients" element={<Clients />} />
              <Route path="/mesures" element={<Mesures />} />
              <Route path="/commandes" element={<Commandes />} />
              <Route path="/paiements" element={<Paiements />} />
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;