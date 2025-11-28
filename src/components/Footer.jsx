// src/components/Footer.jsx
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>SkyTravel</h3>
            <p>Votre partenaire de confiance pour des voyages inoubliables à travers le monde.</p>
          </div>
          
          <div className="footer-section">
            <h4>Liens rapides</h4>
            <ul>
              <li><a href="/">Accueil</a></li>
              <li><a href="/search">Rechercher un vol</a></li>
              <li><a href="/booking">Mes réservations</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact</h4>
            <ul>
              <li>📞 +33 1 23 45 67 89</li>
              <li>✉️ contact@skytravel.com</li>
              <li>📍 123 Avenue des Champs-Élysées, Paris</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Suivez-nous</h4>
            <div className="social-links">
              <a href="#">Facebook</a>
              <a href="#">Twitter</a>
              <a href="#">Instagram</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 SkyTravel. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;