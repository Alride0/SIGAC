import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FiClipboard, FiCreditCard, FiHome, FiMenu, FiScissors, FiUsers, FiX } from 'react-icons/fi';
import '../global.css';

const managementItems = [
  { to: '/clients', label: 'Clients', icon: FiUsers },
  { to: '/mesures', label: 'Mesures', icon: FiScissors },
  { to: '/commandes', label: 'Commandes', icon: FiClipboard },
];

const administrationItems = [
  { to: '/dashboard', label: 'Dashboard', icon: FiHome },
  { to: '/paiements', label: 'Paiements', icon: FiCreditCard },
];

const AppLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const renderLinks = (items, className = 'nav-item') => items.map(({ to, label, icon: Icon }) => (
    <NavLink className={({ isActive }) => `${className}${isActive ? ' active' : ''}`} key={to} to={to} onClick={() => setMobileMenuOpen(false)}>
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
          <div className="profile-avatar">G</div>
          <div className="profile-info"><h4 className="profile-name">Gen’s Couture</h4><p className="profile-role">Portfolio</p></div>
        </div>
      </aside>
      <div className="main-content">
        <header className="top-navbar">
          <img src="/logo-sidebar.png" alt="Gen's Couture" className="mobile-logo" />
          <button className="menu-burger" type="button" aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}>{mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}</button>
          {mobileMenuOpen && <nav className="mobile-nav-menu" aria-label="Navigation mobile">{renderLinks([...managementItems, ...administrationItems], 'mobile-nav-item')}</nav>}
        </header>
        <main className="page-content"><Outlet /></main>
      </div>
    </div>
  );
};

export default AppLayout;
