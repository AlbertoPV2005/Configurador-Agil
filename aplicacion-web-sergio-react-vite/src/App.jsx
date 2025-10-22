import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/PaginaVinilos';
import './styles/App.css';  // Importa estilos CSS

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/about">Acerca de</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}
export default App;
