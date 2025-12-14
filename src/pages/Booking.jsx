// src/pages/Booking.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sampleFlights } from '../data/flights';
import '../styles/Booking.css';
import { useLocation } from "react-router-dom";
import moment from 'moment';
import fetchApi from '../helpers/fetchApi';

const Booking = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const flight = sampleFlights.find(f => f.id == 1);
  const location = useLocation();
  const { flightt } = location?.state?.flight || {};

  const user = JSON.parse(localStorage.getItem("userfront"))
  const [type, setType] = useState(null)
//  return console.log(,'===========================-========------------------');

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

  const handleSubmit = async(e) => {
    e.preventDefault();
    // const nom =  formData.email
    // return console.log(passengerInfo,"-------------------------");
    const datat= {
      id_client	: user?.id_client,
      id_vol:location?.state?.flight?.id_vol,
    }
    const data = await fetchApi("/settings/reservations",{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datat)
    })
     console.log('---------------------------');
    
    navigate('/payment');
  };


  const handleInputChange = (field, value) => {
    // return console.log(value,"------------------------",field);
    if (field === "type") {
      setType(value)
    }
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
                    <strong>{location?.state?.flight?.airport_dp?.ville}</strong>
                    <span>{location?.state?.flight?.airport_dp?.nom}</span>
                  </div>
                  
                  <div className="flight-line">
                    <span className="dot"></span>
                    <span className="line"></span>
                    <span className="dot"></span>
                  </div>

                  <div className="city">
                    <strong>{location?.state?.flight?.airport_arr.ville}</strong>
                    <span>{location?.state?.flight?.airport_arr.nom}</span>
                  </div>
                </div>

                <div className="flight-details">
                  <div className="detail-row">
                    <span>Date:</span>
                    <span>{moment(location?.state?.flight?.date_depart).format("YYYY-MM-DD")}</span>
                  </div>
                  <div className="detail-row">
                    <span>Heure de départ:</span>
                    <span>{moment(location?.state?.flight?.date_depart).format("HH:mm")}</span>
                  </div>
                  <div className="detail-row">
                    <span>Heure d'arrivée:</span>
                    <span>{moment(location?.state?.flight?.date_arrive).format("HH:mm")}</span>
                  </div>
                  <div className="detail-row">
                    <span>Durée:</span>
                    <span>{flight.duration}</span>
                  </div>
                  <div className="detail-row">
                    <span>Vol:</span>
                    <span>{location?.state?.flight?.numero_vol}</span>
                  </div>
                </div>

                <div className="price-summary">
                  <div className="detail-row">
                    <span>Prix du vol:</span>
                    <span>{location?.state?.flight?.prix}</span>
                  </div>
                  <div className="detail-row">
                    <span>Frais de service:</span>
                    <span>25</span>
                  </div>
                  <div className="detail-row total">
                    <span>Total:</span>
                    <span>{location?.state?.flight?.prix + 2500}</span>
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
                <div className="form-grid-12">
                    <div className="form-group">
                    <label className="form-label">Payer pour qui ? *</label>
                    <select name=""  onChange={(e) => handleInputChange('type', e.target.value)} id="" className="form-input">
                      <option value="">---</option>
                      <option value="1">Par Moi-meme</option>
                      <option value="2">Par autres</option>
                    </select>
                  </div>
                </div>
                <div className="form-grid-2">
                  
                  <div className="form-group">
                    <label className="form-label">Prénom *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={type == 1 ? `${user.client.nom}` : passengerInfo.firstName} 
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nom *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={type == 1 ? `${user.client.prenom}` : passengerInfo.lastName}
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
                      value={type == 1 ? `${user.client.email}` : passengerInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Téléphone *</label>
                    <input
                      type="tel"
                      className="form-input"
                      required
                      value={type == 1 ? `${user.client.telephone}` : passengerInfo.phone}
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