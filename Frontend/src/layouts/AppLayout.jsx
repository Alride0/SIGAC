import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiClipboard, FiCreditCard, FiHome, FiLogOut, FiMenu, FiScissors, FiSettings, FiUsers, FiX } from 'react-icons/fi';
import '../global.css';

const AppLayout = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const managementItems = [
    { to: '/clients', label: 'Clients', icon: FiUsers },
    { to: '/mesures', label: 'Mesures', icon: FiScissors },
    { to: '/commandes', label: 'Commandes', icon: FiClipboard },
  ];
  const administrationItems = [
    ...(user.role === 'admin' ? [
      { to: '/', label: 'Dashboard', icon: FiHome, end: true },
      { to: '/paiements', label: 'Paiements', icon: FiCreditCard },
      { to: '/utilisateurs', label: 'Utilisateurs', icon: FiUsers },
    ] : []),
    { to: '/parametres', label: 'Paramètres', icon: FiSettings },
  ];
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  const renderLinks = (items, className = 'nav-item') => items.map(({ to, label, icon: Icon, end }) => (
    <NavLink className={({ isActive }) => `${className}${isActive ? ' active' : ''}`} end={end} key={to} to={to} onClick={() => setMobileMenuOpen(false)}>
      <Icon size={18} /><span>{label}</span>
    </NavLink>
  ));
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo"><img src="/logo-sidebar.png" alt="Gen's Couture" className="logo-img" /></div>
        <nav className="sidebar-nav" aria-label="Navigation principale">
          <div className="nav-section"><p className="nav-section-title">Gestion</p>{renderLinks(managementItems)}</div>
          <div className="nav-divider" />
          <div className="nav-section"><p className="nav-section-title">Administration</p>{renderLinks(administrationItems)}</div>
        </nav>
        <div className="sidebar-illustration"><img src="/mannequin.png" alt="Mannequin Couture" className="mannequin-img" /></div>
        <div className="sidebar-profile">
          <div className="profile-avatar">{user?.nom?.charAt(0)?.toUpperCase() || 'A'}</div>
          <div className="profile-info"><h4 className="profile-name">{user?.nom || 'Administrateur'}</h4><p className="profile-role">{user?.role || 'Administrateur'}</p><div className="profile-status"><span className="status-dot" />En ligne</div></div>
        </div>
      </aside>
      <div className="main-content">
        <header className="top-navbar">
          <img src="/logo-sidebar.png" alt="Gen's Couture" className="mobile-logo" />
          <button className="menu-burger" type="button" aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}>{mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}</button>
          <button className="logout-btn" type="button" onClick={handleLogout}><span>Déconnexion</span><FiLogOut size={20} /></button>
          {mobileMenuOpen && <nav className="mobile-nav-menu" aria-label="Navigation mobile">{renderLinks([...managementItems, ...administrationItems], 'mobile-nav-item')}</nav>}
        </header>
        <main className="page-content"><Outlet /></main>
      </div>
    </div>
  );
};

export default AppLayout;
