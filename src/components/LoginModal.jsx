// src/components/LoginModal.jsx
import { useState } from 'react';
import '../styles/LoginModal.css';
import { Link } from 'react-router-dom';

const LoginModal = ({ onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLogin) {
      // Simulation de connexion
      onLogin({
        firstName: "Jean",
        lastName: "Dupont",
        email: formData.email
      });
    } else {
      // Simulation d'inscription
      if (formData.password === formData.confirmPassword) {
        onLogin({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email
        });
      } else {
        alert("Les mots de passe ne correspondent pas");
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className="modal-header">
          <h2>{isLogin ? 'Connexion' : 'Créer un compte'}</h2>
          <p>
            {isLogin 
              ? 'Connectez-vous à votre compte SkyTravel' 
              : 'Rejoignez SkyTravel et découvrez le monde'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Prénom *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Nom *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              className="form-input"
              required
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe *</label>
            <input
              type="password"
              className="form-input"
              required
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Confirmer le mot de passe *</label>
              <input
                type="password"
                className="form-input"
                required
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              />
            </div>
          )}

          {isLogin && (
            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                Se souvenir de moi
              </label>
              <a href="#" className="forgot-password">
                Mot de passe oublié ?
              </a>
            </div>
          )}

          <Link type="submit" to="/booking" className="btn btn-primary btn-full">
            {isLogin ? 'Se connecter' : 'Créer un compte'}
          </Link>
        </form>

        <div className="auth-divider">
          <span>ou</span>
        </div>

        <button className="btn btn-google">
          <span className="google-icon"></span>
          Continuer avec Google
        </button>

        <div className="auth-switch">
          <p>
            {isLogin ? "Pas encore de compte ? " : "Déjà un compte ? "}
            <button 
              type="button" 
              className="switch-link"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "S'inscrire" : "Se connecter"}
            </button>
          </p>
        </div>

        <div className="auth-terms">
          <p>
            En continuant, vous acceptez nos{' '}
            <a href="#">Conditions d'utilisation</a> et notre{' '}
            <a href="#">Politique de confidentialité</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;