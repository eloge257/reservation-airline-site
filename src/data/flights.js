// src/data/flights.js
export const sampleFlights = [
  {
    id: 1,
    airline: "Air France",
    flightNumber: "AF123",
    departure: {
      city: "Paris",
      airport: "CDG",
      time: "08:00",
      date: "2024-03-15"
    },
    arrival: {
      city: "New York",
      airport: "JFK",
      time: "11:30",
      date: "2024-03-15"
    },
    duration: "8h30",
    price: 450,
    seatsAvailable: 24
  },
  {
    id: 2,
    airline: "Emirates",
    flightNumber: "EK202",
    departure: {
      city: "Dubai",
      airport: "DXB",
      time: "14:20",
      date: "2024-03-15"
    },
    arrival: {
      city: "Singapore",
      airport: "SIN",
      time: "05:45",
      date: "2024-03-16"
    },
    duration: "7h25",
    price: 620,
    seatsAvailable: 12
  },
  {
    id: 3,
    airline: "Lufthansa",
    flightNumber: "LH457",
    departure: {
      city: "Frankfurt",
      airport: "FRA",
      time: "11:15",
      date: "2024-03-15"
    },
    arrival: {
      city: "Tokyo",
      airport: "NRT",
      time: "07:30",
      date: "2024-03-16"
    },
    duration: "12h15",
    price: 780,
    seatsAvailable: 8
  }
];

export const popularDestinations = [
  {
    id: 1,
    city: "New York",
    country: "USA",
    price: 450,
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 2,
    city: "Tokyo",
    country: "Japon",
    price: 780,
    image: "https://images.unsplash.com/photo-1540959733332-0b10c5c066f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 3,
    city: "Dubai",
    country: "Émirats Arabes Unis",
    price: 520,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 4,
    city: "Bali",
    country: "Indonésie",
    price: 690,
    image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 5,
    city: "Paris",
    country: "France",
    price: 120,
    image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 6,
    city: "Londres",
    country: "Royaume-Uni",
    price: 150,
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  }
];

export const airlines = [
  { id: 1, name: "Air France", logo: "✈️", rating: 5 },
  { id: 2, name: "Emirates", logo: "🛫", rating: 5 },
  { id: 3, name: "Lufthansa", logo: "🛩️", rating: 4 },
  { id: 4, name: "British Airways", logo: "🇬🇧", rating: 4 },
  { id: 5, name: "Qatar Airways", logo: "🌍", rating: 5 },
  { id: 6, name: "KLM", logo: "👑", rating: 4 }
];

export const testimonials = [
  {
    id: 1,
    name: "Marie Laurent",
    position: "Voyageuse d'affaires",
    text: "SkyTravel a révolutionné ma façon de voyager. Le service client est exceptionnel et les prix imbattables. Je recommande vivement !",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
  },
  {
    id: 2,
    name: "Thomas Dubois",
    position: "Famille en vacances",
    text: "Notre voyage à Bali était parfait grâce à SkyTravel. Tout était organisé avec précision. Une expérience sans stress !",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
  },
  {
    id: 3,
    name: "Sophie Martin",
    position: "Aventurière",
    text: "La garantie du meilleur prix est réelle ! J'ai économisé 30% sur mon vol pour Tokyo. Service impeccable.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
  }
];

export const services = [
  {
    id: 1,
    icon: "🛎️",
    title: "Service Concierge",
    description: "Un service personnalisé pour tous vos besoins de voyage",
    features: [
      "Réservation d'hôtels et activités",
      "Assistance 24h/24",
      "Conseils personnalisés",
      "Service VIP aéroport"
    ]
  },
  {
    id: 2,
    icon: "🏥",
    title: "Assurance Voyage",
    description: "Voyagez l'esprit tranquille avec notre assurance complète",
    features: [
      "Annulation et interruption",
      "Assistance médicale",
      "Bagages et retard",
      "Responsabilité civile"
    ]
  },
  {
    id: 3,
    icon: "🚗",
    title: "Services Terrestres",
    description: "Tous vos transferts et locations en un seul clic",
    features: [
      "Transferts aéroport",
      "Location de voiture",
      "Navettes privées",
      "Conducteur personnel"
    ]
  }
];