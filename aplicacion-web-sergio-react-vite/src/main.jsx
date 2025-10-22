import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AddVinylScreen from './pages/AddVinylScreen';
import PaginaVinilos from './pages/PaginaVinilos';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PaginaVinilos />} />
        <Route path="/add" element={<AddVinylScreen />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
