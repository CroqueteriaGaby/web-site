import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className="container"
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      {/* Decorative paw prints */}
      <div className="paw-print paw-1">🐾</div>
      <div className="paw-print paw-2">🐾</div>
      <div className="paw-print paw-3">🐾</div>
      <div className="paw-print paw-4">🐾</div>

      <main className={`content ${isVisible ? 'visible' : ''}`} style={{ flex: 1 }}>
        {/* Logo section */}
        <div className="logo-container">
          <img src="/logo.png" alt="Croquetería Gaby" className="logo" />
        </div>

        {/* Coming soon message */}
        <div className="message-container">
          <h1 className="title">¡Próximamente!</h1>
          <p className="subtitle">Estamos preparando algo especial para tus peluditos</p>
          <div className="decorative-line">
            <span className="dot"></span>
            <span className="line"></span>
            <span className="dot"></span>
          </div>
        </div>

        {/* Catalog Button */}
        <div className="catalog-cta">
          <button onClick={() => navigate('/catalogo')} className="cta-button">
            Ver Catálogo 🦴
          </button>
        </div>

        {/* Contact information */}
        <div className="contact-section">
          <h2 className="contact-title">Contáctanos</h2>
          <div className="contact-info">
            <a href="tel:+525512345678" className="contact-item">
              <span className="icon">📞</span>
              <span className="text">55 1234 5678</span>
            </a>
            <a href="mailto:croqueteriagaby@gmail.com" className="contact-item">
              <span className="icon">✉️</span>
              <span className="text">croqueteriagaby@gmail.com</span>
            </a>
            <a
              href="https://www.facebook.com/croqueteriagaby"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-item"
            >
              <span className="icon">📱</span>
              <span className="text">@croqueteriagaby</span>
            </a>
            <a
              href="https://www.mercadolibre.com.mx/pagina/baebfdchg45361#from=share_eshop"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-item"
            >
              <span className="icon">🛒</span>
              <span className="text">Tienda Mercado Libre</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer className="footer">
          <p>© {new Date().getFullYear()} Croquetería Gaby. Amor y cuidado para tus mascotas.</p>
        </footer>
      </main>
    </div>
  );
}

export default Home;
