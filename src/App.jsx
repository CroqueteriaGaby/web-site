import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="container">
      {/* Decorative paw prints */}
      <div className="paw-print paw-1">🐾</div>
      <div className="paw-print paw-2">🐾</div>
      <div className="paw-print paw-3">🐾</div>
      <div className="paw-print paw-4">🐾</div>

      <main className={`content ${isVisible ? 'visible' : ''}`}>
        {/* Logo section */}
        <div className="logo-container">
          <img
            src="/logo.png"
            alt="Croquetería Gaby"
            className="logo"
          />
        </div>

        {/* Coming soon message */}
        <div className="message-container">
          <h1 className="title">¡Próximamente!</h1>
          <p className="subtitle">
            Estamos preparando algo especial para tus peluditos
          </p>
          <div className="decorative-line">
            <span className="dot"></span>
            <span className="line"></span>
            <span className="dot"></span>
          </div>
        </div>

        {/* Contact information */}
        <div className="contact-section">
          <h2 className="contact-title">Contáctanos</h2>
          <div className="contact-info">
            <a href="tel:+525512345678" className="contact-item">
              <span className="icon">📞</span>
              <span className="text">55 1234 5678</span>
            </a>
            <a href="mailto:info@croqueteriagaby.com" className="contact-item">
              <span className="icon">✉️</span>
              <span className="text">info@croqueteriagaby.com</span>
            </a>
            <a href="https://www.facebook.com/croqueteriagaby" target="_blank" rel="noopener noreferrer" className="contact-item">
              <span className="icon">📱</span>
              <span className="text">@croqueteriagaby</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer className="footer">
          <p>© 2024 Croquetería Gaby. Amor y cuidado para tus mascotas.</p>
        </footer>
      </main>
    </div>
  )
}

export default App
