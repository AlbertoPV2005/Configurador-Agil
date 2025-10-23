import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AddVinylScreen from './pages/AddVinylScreen';
import PaginaVinilos from './pages/PaginaVinilos';
import EditVinilo from './pages/EditVinilo';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PaginaVinilos />} />
        <Route path="/add" element={<AddVinylScreen />} />
        <Route path="/edit/:id" element={<EditVinilo />} /> {/* Agrega esta línea si no la tienes */}
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
