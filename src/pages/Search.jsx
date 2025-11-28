// src/pages/Search.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sampleFlights } from '../data/flights';
import '../styles/Search.css';

const Search = () => {
  const [searchParams, setSearchParams] = useState({
    departure: '',
    destination: '',
    date: '',
    passengers: 1,
    priceRange: 1000
  });

  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Simulation de recherche
    setSearchResults(sampleFlights);
  };

  const handleInputChange = (field, value) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="search-page">
      <div className="container">
        <div className="search-header">
          <h1>Trouvez votre vol idéal</h1>
          <p>Comparez les prix et réservez en quelques clics</p>
        </div>

        {/* Search Form */}
        <div className="search-card">
          <form onSubmit={handleSearch} className="search-form">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Départ</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ville de départ"
                  value={searchParams.departure}
                  onChange={(e) => handleInputChange('departure', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Destination</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ville d'arrivée"
                  value={searchParams.destination}
                  onChange={(e) => handleInputChange('destination', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={searchParams.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Passagers</label>
                <select
                  className="form-input"
                  value={searchParams.passengers}
                  onChange={(e) => handleInputChange('passengers', parseInt(e.target.value))}
                >
                  {[1,2,3,4,5,6].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'passager' : 'passagers'}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Prix maximum: {searchParams.priceRange}€
              </label>
              <input
                type="range"
                min="100"
                max="2000"
                step="50"
                value={searchParams.priceRange}
                onChange={(e) => handleInputChange('priceRange', parseInt(e.target.value))}
                className="price-slider"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full">
              Rechercher les vols
            </button>
          </form>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="search-results">
            <h2>Vols disponibles</h2>
            <div className="flights-list">
              {searchResults.map(flight => (
                <div key={flight.id} className="flight-card">
                  <div className="flight-header">
                    <div className="airline-info">
                      <span className="airline-logo">✈️</span>
                      <div>
                        <h3>{flight.airline}</h3>
                        <p className="flight-number">{flight.flightNumber}</p>
                      </div>
                    </div>
                    <div className="flight-price">
                      <span className="price">{flight.price}€</span>
                      <p>par personne</p>
                    </div>
                  </div>

                  <div className="flight-details">
                    <div className="route">
                      <div className="departure">
                        <strong>{flight.departure.time}</strong>
                        <p>{flight.departure.city} ({flight.departure.airport})</p>
                      </div>
                      
                      <div className="duration">
                        <div className="flight-line">
                          <span className="dot"></span>
                          <span className="line"></span>
                          <span className="dot"></span>
                        </div>
                        <p>{flight.duration}</p>
                      </div>

                      <div className="arrival">
                        <strong>{flight.arrival.time}</strong>
                        <p>{flight.arrival.city} ({flight.arrival.airport})</p>
                      </div>
                    </div>
                  </div>

                  <div className="flight-footer">
                    <div className="seats-info">
                      {flight.seatsAvailable} places disponibles
                    </div>
                    <Link 
                      to={`/booking/${flight.id}`}
                      className="btn btn-primary"
                    >
                      Sélectionner
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;