// src/pages/Payment.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Payment.css';

const Payment = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardInfo, setCardInfo] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulation de paiement
    alert('Paiement réussi ! Votre réservation est confirmée.');
    navigate('/');
  };

  const handleCardInput = (field, value) => {
    setCardInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="payment-page">
      <div className="container">
        <div className="payment-header">
          <h1>Paiement sécurisé</h1>
          <p>Finalisez votre réservation en toute sécurité</p>
        </div>

        <div className="payment-layout">
          <div className="payment-main">
            <div className="payment-card">
              <h3>Méthode de paiement</h3>
              
              <div className="payment-methods">
                <button
                  className={`method-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  💳 Carte bancaire
                </button>
                <button
                  className={`method-btn ${paymentMethod === 'paypal' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('paypal')}
                >
                  🔵 PayPal
                </button>
              </div>

              {paymentMethod === 'card' && (
                <form onSubmit={handleSubmit} className="card-form">
                  <div className="form-group">
                    <label className="form-label">Numéro de carte</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      value={cardInfo.number}
                      onChange={(e) => handleCardInput('number', e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nom sur la carte</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="JOHN DOE"
                      value={cardInfo.name}
                      onChange={(e) => handleCardInput('name', e.target.value.toUpperCase())}
                    />
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Date d'expiration</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="MM/AA"
                        maxLength="5"
                        value={cardInfo.expiry}
                        onChange={(e) => handleCardInput('expiry', e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2'))}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">CVV</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="123"
                        maxLength="3"
                        value={cardInfo.cvv}
                        onChange={(e) => handleCardInput('cvv', e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                  </div>

                  <div className="security-info">
                    <div className="secure-badge">
                      Paiement sécurisé SSL
                    </div>
                    <p>
                      Vos informations de paiement sont cryptées et transmises 
                      de manière sécurisée.
                    </p>
                  </div>

                  <button type="submit" className="btn btn-primary btn-large btn-full">
                    Payer 475€
                  </button>
                </form>
              )}

              {paymentMethod === 'paypal' && (
                <div className="paypal-section">
                  <p>Vous serez redirigé vers PayPal pour finaliser votre paiement.</p>
                  <button className="btn btn-primary btn-large btn-full">
                    Payer avec PayPal
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="payment-sidebar">
            <div className="order-summary">
              <h3>Résumé de la commande</h3>
              
              <div className="order-details">
                <div className="order-item">
                  <span>Vol Paris - New York</span>
                  <span>450€</span>
                </div>
                <div className="order-item">
                  <span>Frais de service</span>
                  <span>25€</span>
                </div>
                <div className="order-total">
                  <span>Total</span>
                  <span>475€</span>
                </div>
              </div>
            </div>

            <div className="security-features">
              <h4>Garanties de sécurité</h4>
              <ul>
                <li>✅ Paiement 100% sécurisé</li>
                <li>✅ Données cryptées</li>
                <li>✅ Garantie de remboursement</li>
                <li>✅ Support 24h/24</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;