import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => navigate('/')}>
           Croquetería Gaby 🐾
        </div>

        {/* Menú Desktop y Móvil Toggle */}
        <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
          <a onClick={() => navigate('/')}>Inicio</a>
          <a onClick={() => navigate('/catalogo')} className="active-link">Catálogo</a>
          <a href="https://wa.me/525512345678" target="_blank" rel="noreferrer">Contacto</a>
        </div>

        {/* Icono Pata de Perro (Solo Móvil) */}
        <div className="mobile-paw-icon" onClick={() => setIsOpen(!isOpen)}>
            {/* Usamos un emoji por ahora, o puedes poner una imagen <img> aquí */}
            🐾
        </div>
      </div>
    </nav>
  );
};

export default Navbar;