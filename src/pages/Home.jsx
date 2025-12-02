// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {popularDestinations, airlines, testimonials, services } from '../data/flights';
import '../styles/Home.css';
import fetchApi from '../helpers/fetchApi';
import moment from "moment";
import { Dialog } from 'primereact/dialog';
import LoginModal from '../components/LoginModal';

const Home = () => {
  const [ popularDestinatons,setpopularDestinations] = useState([])
  const [visible,setVisible] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const fetchVol = async() => {
    try {
      const data = await fetchApi("/settings/vol")
      setpopularDestinations(data.result.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
     fetchVol()
  },[])
  const [stats, setStats] = useState([
    { number: '50+', label: 'Destinations' },
    { number: '500K+', label: 'Clients satisfaits' },
    { number: '24/7', label: 'Support client' },
    { number: '98%', label: 'Vols à l\'heure' }
  ]);

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
    const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    setIsLoginModalOpen(false);
  };

  return (
    <>
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background"></div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              ✈️ Leader français des voyages en ligne
            </div>
            <h1 className="hero-title">
              Voyagez avec <span className="text-accent">Élégance</span>, 
              Explorez avec <span className="text-primary">Confiance</span>
            </h1>
            <p className="hero-subtitle">
              Découvrez le monde avec SkyTravel. Des vols confortables, 
              des destinations incroyables, un service premium et des prix imbattables. 
              Votre aventure commence ici.
            </p>
            <div className="hero-actions">
              <Link to="/search" className="btn btn-primary btn-large">
                ✈️ Réserver un vol
              </Link>
              <Link to="/search" className="btn btn-secondary btn-large">
                 Explorer les destinations
              </Link>
            </div>
            <div className="hero-features">
              <div className="feature-item">
                <span className="feature-icon"></span>
                <span>Meilleur prix garanti</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon"></span>
                <span>Annulation gratuite</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon"></span>
                <span>Service 5 étoiles</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Nos Services Exclusifs</h2>
          <p className="section-subtitle">
            Profitez d'une expérience de voyage complète avec nos services premium
          </p>
          <div className="grid grid-3">
            {services.map(service => (
              <div key={service.id} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul className="service-features">
                  {service.features.map((feature, index) => (
                    <li key={index}>✓ {feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="section bg-surface">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Destinations Populaires</h2>
            <p className="section-subtitle">
              Découvrez nos destinations les plus prisées à des prix exceptionnels
            </p>
            <div className="section-actions">
              <Link to="/search" className="btn btn-outline">
                Voir toutes les destinations →
              </Link>
            </div>
          </div>
          <div className="grid grid-3">
            {popularDestinations.map(destination => (
              <div key={destination.id} className="destination-card">
                <div className="destination-image-container">
                  <img 
                    src={destination.image} 
                    alt={destination.city}
                    className="destination-image"
                  />
                  <div className="destination-overlay">
                    <span className="destination-price">
                      À partir de {destination.price}€
                    </span>
                  </div>
                </div>
                <div className="destination-content">
                  <div className="destination-info">
                    <h3>{destination.city}</h3>
                    <p>{destination.country}</p>
                    <div className="destination-meta">
                      <span>✈️ Vols directs</span>
                      <span>🏨 Hôtels inclus</span>
                    </div>
                  </div>
                  <Link to="/search" className="btn btn-primary btn-full">
                    Voir les offres
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flight Schedule */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Prochains Départs</h2>
          <p className="section-subtitle">
            Réservez rapidement parmi nos prochains vols disponibles
          </p>
          <div className="schedule-table">
            <div className="schedule-header">
              <span>Vol</span>
              <span>Destination</span>
              <span>Départ</span>
              <span>Arrivée</span>
              <span>Prix</span>
              {/* <span>Action</span> */}
            </div>
            {/* {JSON.stringify(popularDestinatons)} */}
            {/* {popularDestinations.slice(0, 4).map((flight, index) => (
              <div key={index} className="schedule-row">
                <span className="flight-info">
                  <span className="airline">AF{100 + index}</span>
                  <span className="airline-name">Air France</span>
                </span>
                <span className="destination">
                  <strong>{flight.city}</strong>
                  <span>{flight.country}</span>
                </span>
                <span className="time">
                  <strong>08:00</strong>
                  <span>CDG</span>
                </span>
                <span className="time">
                  <strong>11:30</strong>
                  <span>{flight.city.slice(0, 3).toUpperCase()}</span>
                </span>
                <span className="price">{flight.price}€</span>
                <span className="action">
                  <Link to="/search" className="btn btn-sm btn-primary">
                    Réserver
                  </Link>
                </span>
              </div>
            ))} */}
              {popularDestinatons.map((flight, index) => (
              <div key={index} className="schedule-row">
                <span className="flight-info">
                  <span className="airline">{flight.numero_vol}</span>
                  <span className="airline-name">{flight.compagnie}</span>
                </span>
                <span className="destination">
                  <strong>{flight.airport_dp.nom}</strong>
                  <span>{flight.airport_dp.ville}</span>
                </span>
                <span className="time">
                  <strong>{moment(flight.date_depart).format("HH:mm")}</strong>
                  <span>CDG</span>
                </span>
                <span className="time">
                   <strong>{moment(flight.date_arrive).format("HH:mm")}</strong> 
                  <span>{flight.airport_dp.ville.slice(0, 3).toUpperCase()}</span>
                </span>
                <span className="price">{flight.prix}</span>
{/* to="/booking" */}
                <span className="action">
                  <Link   onClick={() => setIsLoginModalOpen(true)} className="btn btn-sm btn-primary">
                    Réserver
                  </Link>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Airlines Partners */}
      <section className="section bg-light">
        <div className="container">
          <h2 className="section-title">Nos Compagnies Aériennes Partenaires</h2>
          <p className="section-subtitle">
            Voyez avec les meilleures compagnies aériennes mondiales
          </p>
          <div className="airlines-grid">
            {airlines.map(airline => (
              <div key={airline.id} className="airline-card">
                <div className="airline-logo">{airline.logo}</div>
                <h4>{airline.name}</h4>
                <div className="airline-rating">
                  {'★'.repeat(airline.rating)}{'☆'.repeat(5 - airline.rating)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Ils Nous Font Confiance</h2>
          <p className="section-subtitle">
            Découvrez les expériences de nos voyageurs satisfaits
          </p>
          <div className="testimonials">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="testimonial-text">
                  {testimonials[currentTestimonial].text}
                </div>
                <div className="testimonial-author">
                  <img 
                    src={testimonials[currentTestimonial].avatar} 
                    alt={testimonials[currentTestimonial].name}
                    className="author-avatar"
                  />
                  <div className="author-info">
                    <strong>{testimonials[currentTestimonial].name}</strong>
                    <span>{testimonials[currentTestimonial].position}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="testimonial-nav">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`nav-dot ${index === currentTestimonial ? 'active' : ''}`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h2>Ne manquez aucune offre exceptionnelle !</h2>
              <p>
                Inscrivez-vous à notre newsletter et soyez le premier à profiter 
                de nos promotions exclusives et réductions flash.
              </p>
            </div>
            <div className="newsletter-form">
              <div className="input-group">
                <input 
                  type="email" 
                  placeholder="Votre email" 
                  className="form-input"
                />
                <button className="btn btn-primary">S'abonner</button>
              </div>
              <p className="newsletter-note">
                Nous respectons votre vie privée. Désabonnez-vous à tout moment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section bg-surface">
        <div className="container">
          <h2 className="section-title">Questions Fréquentes</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>Comment modifier ma réservation ?</h3>
              <p>
                Vous pouvez modifier votre réservation jusqu'à 24h avant le départ 
                via votre espace client ou en contactant notre service client.
              </p>
            </div>
            <div className="faq-item">
              <h3>Quelle est la politique d'annulation ?</h3>
              <p>
                Annulation gratuite jusqu'à 48h avant le vol pour tous les billets. 
                Certaines conditions peuvent s'appliquer aux tarifs promotionnels.
              </p>
            </div>
            <div className="faq-item">
              <h3>Documents nécessaires pour voyager ?</h3>
              <p>
                Passeport en cours de validité selon la destination. 
                Certains pays requièrent un visa - consultez nos conseils voyage.
              </p>
            </div>
            <div className="faq-item">
              <h3>Puis-je choisir mon siège ?</h3>
              <p>
                Oui, la sélection des sièges est disponible lors de la réservation 
                ou jusqu'à 24h avant le départ selon la compagnie aérienne.
              </p>
            </div>
          </div>
        </div>
      </section>
      
    </div>
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

export default Home;