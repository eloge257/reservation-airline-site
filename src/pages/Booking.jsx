// src/pages/Booking.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sampleFlights } from '../data/flights';
import '../styles/Booking.css';
import { useLocation } from "react-router-dom";

const Booking = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const flight = sampleFlights.find(f => f.id == 1);
  const location = useLocation();
  const { flightt } = location.state.flight || {};
  console.log(location.state.flight, "--------------------------------------");
  
  const [passengerInfo, setPassengerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    passport: '',
    dateOfBirth: ''
  });

  if (!flight) {
    return <div>Vol non trouvé</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/payment');
  };

  const handleInputChange = (field, value) => {
    setPassengerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="booking-page">
      <div className="container">
        <div className="booking-header">
          <h1>Finalisez votre réservation</h1>
          <p>Remplissez vos informations pour confirmer votre vol</p>
        </div>

        <div className="booking-layout">
          {/* Flight Summary */}
          <div className="booking-sidebar">
            <div className="summary-card">
              <h3>Récapitulatif du vol</h3>
              
              <div className="flight-summary">
                <div className="route-summary">
                  <div className="city">
                    <strong>{flightt.departure.city}</strong>
                    <span>{flightt.departure.airport}</span>
                  </div>
                  
                  <div className="flight-line">
                    <span className="dot"></span>
                    <span className="line"></span>
                    <span className="dot"></span>
                  </div>

                  <div className="city">
                    <strong>{flightt.airport_arr.ville}</strong>
                    <span>{flightt.airport_arr.nom}</span>
                  </div>
                </div>

                <div className="flight-details">
                  <div className="detail-row">
                    <span>Date:</span>
                    <span>{flight.departure.date}</span>
                  </div>
                  <div className="detail-row">
                    <span>Heure de départ:</span>
                    <span>{flight.departure.time}</span>
                  </div>
                  <div className="detail-row">
                    <span>Heure d'arrivée:</span>
                    <span>{flight.arrival.time}</span>
                  </div>
                  <div className="detail-row">
                    <span>Durée:</span>
                    <span>{flight.duration}</span>
                  </div>
                  <div className="detail-row">
                    <span>Vol:</span>
                    <span>{flight.flightNumber}</span>
                  </div>
                </div>

                <div className="price-summary">
                  <div className="detail-row">
                    <span>Prix du vol:</span>
                    <span>{flight.price}€</span>
                  </div>
                  <div className="detail-row">
                    <span>Frais de service:</span>
                    <span>25€</span>
                  </div>
                  <div className="detail-row total">
                    <span>Total:</span>
                    <span>{flight.price + 25}€</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Passenger Form */}
          <div className="booking-main">
            <form onSubmit={handleSubmit} className="passenger-form">
              <div className="form-section">
                <h3>Informations du passager</h3>
                
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Prénom *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={passengerInfo.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nom *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={passengerInfo.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-input"
                      required
                      value={passengerInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Téléphone *</label>
                    <input
                      type="tel"
                      className="form-input"
                      required
                      value={passengerInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Numéro de passeport *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={passengerInfo.passport}
                      onChange={(e) => handleInputChange('passport', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Date de naissance *</label>
                    <input
                      type="date"
                      className="form-input"
                      required
                      value={passengerInfo.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary btn-large">
                  Procéder au paiement
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;