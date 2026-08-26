import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { BrowserRouter, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import {FiBell,FiLogOut,FiMenu,FiUsers,FiSettings,FiHome,FiCreditCard,FiShoppingBag,FiScissors,FiClipboard,FiUserCheck } from "react-icons/fi";

import { HiOutlineUsers } from "react-icons/hi2";
import { TbRulerMeasure } from "react-icons/tb";
import { motion } from "framer-motion";
import '../global.css';

const AppLayout = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}'); 
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const AnimatedNavItem = ({ children }) => (
  <motion.div
    whileHover={{ x: 6 }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.2 }}>
    {children}
  </motion.div>
);

const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
};
  return (
    <div className="app-layout">
     <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-logo">

    <img
        src="/logo-sidebar.png"
        alt="Gen's Couture Logo"
        className="logo-img"
    />

</div>

        <nav className="sidebar-nav">

  <div className="nav-section">

    <p className="nav-section-title">
      GESTION
    </p>
  <AnimatedNavItem>
<NavLink
      className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
      to="/clients"
    >
      <FiUsers size={18}/>
      <span>Clients</span>
    </NavLink> 
  </AnimatedNavItem>
  
<AnimatedNavItem>
    <NavLink
      className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
      to="/mesures"
    >
      <FiScissors size={18}/>
      <span>Mesures</span>
    </NavLink>
  </AnimatedNavItem>

<AnimatedNavItem>
    <NavLink
      className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
      to="/commandes"
    >
      <FiClipboard size={18}/>
      <span>Commandes</span>
    </NavLink>
  </AnimatedNavItem>

  </div>

  <div className="nav-divider"></div>

  <div className="nav-section">

    <p className="nav-section-title">
      ADMINISTRATION
    </p>

    {user.role === "admin" && (

    <AnimatedNavItem>

    <NavLink className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} to="/">

        <FiHome size={18}/>

        <span>Dashboard</span>

    </NavLink> 

</AnimatedNavItem>

)}
    {user.role === "admin" && (

    <AnimatedNavItem>

    <NavLink className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} to="/paiements">

        <FiHome size={18}/>

        <span>Paiements</span>

    </NavLink> 

</AnimatedNavItem>

)}
<AnimatedNavItem>
    <NavLink
      className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
      to="/parametres"
    >
      <FiSettings size={18}/>
      <span>Paramètres</span>
    </NavLink>
  </AnimatedNavItem>

   {user.role === "admin" && (

    <AnimatedNavItem>

    <NavLink className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} to="/utilisateurs">

        <FiHome size={18}/>

        <span>Utilisateurs</span>

    </NavLink> 

</AnimatedNavItem>

)}

  </div>

</nav>
        <div className="sidebar-illustration">
          <img src="/mannequin.png" alt="Mannequin Couture" className="mannequin-img" />
        </div>

        <div className="sidebar-profile">

    <div className="profile-avatar">
        {user?.nom?.charAt(0)?.toUpperCase() || "A"}
    </div>

    <div className="profile-info">

        <h4 className="profile-name">
            {user?.nom || "Administrateur"}
        </h4>

        <p className="profile-role">
            {user?.role || "Administrateur"}
        </p>

        <div className="profile-status">

            <span className="status-dot"></span>

            <span>
                En ligne
            </span>

        </div>

    </div>

</div>
      </aside>

      {sidebarCollapsed && (
  <div className="sidebar-backdrop" onClick={() => setSidebarCollapsed(false)}></div>
)}

     <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        
        <header className="top-navbar">
          <div className="navbar-left">
            <button className="menu-burger" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
    <FiMenu size={24} />
</button>
          </div>
          <div className="navbar-right">
            
            <button className="logout-btn" onClick={handleLogout}>
              Déconnexion
              <FiLogOut size={20} />
          </button>
          </div>
        </header>

        
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;