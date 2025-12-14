// src/components/Header.jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';
import LoginModal from './LoginModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  const userFront = localStorage.getItem("userfront")

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              <span className="logo-icon"></span>
              SkyTravel
            </Link>
            
            <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
              <Link 
                to="/" 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              >
                Accueil
              </Link>
              <Link 
                to="/search" 
                className={`nav-link ${location.pathname === '/search' ? 'active' : ''}`}
              >
                Rechercher
              </Link>
              <Link 
                to="/booking" 
                className={`nav-link ${location.pathname === '/booking' ? 'active' : ''}`}
              >
                Mes réservations
              </Link>
            </nav>
            <div className="header-actions">
              {userFront ? (
                <div className="user-menu">
                  <button className="user-btn">
                    <span className="user-avatar">👤</span>
                    <span className="user-name">{user?.firstName}</span>
                  </button>
                  <div className="user-dropdown">
                    <div className="user-info">
                      <strong>{user?.firstName} {user?.lastName}</strong>
                      <span>{user?.email}</span>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link to="/profile" className="dropdown-item">
                      📋 Mon profil
                    </Link>
                    <Link to="/bookings" className="dropdown-item">
                      🎫 Mes réservations
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-item logout">
                      🚪 Déconnexion
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  className="btn btn-outline"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  Se connecter
                </button>
              )}
            </div>

            <button 
              className="menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Modal de connexion */}
      {isLoginModalOpen && (
        <LoginModal
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={handleLogin}
        />
      )}
    </>
  );
};

export default Header;