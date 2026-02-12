import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar'; // Al estar en la misma carpeta, se importa así
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();

  // Si la ruta es exactamente '/', ocultamos el navbar
  const isHomePage = location.pathname === '/';

  return (
    <div className={`app-container ${isHomePage ? 'home-mode' : 'dashboard-mode'}`}>
      {/* Renderizar Navbar solo si NO estamos en Home */}
      {!isHomePage && (
        <aside className="sidebar">
          <Navbar />
        </aside>
      )}

      {/* Contenedor del contenido (Home o Catálogo) */}
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;
