// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Search from './pages/Search';
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import './styles/global.css';

function App() {
  return (
    // <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/payment" element={<Payment />} />
          </Routes>
        </main>
        <Footer />
      </div>
    // </Router>
  );
}

export default App;