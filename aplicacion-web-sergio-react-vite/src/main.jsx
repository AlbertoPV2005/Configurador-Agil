import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
//import AddVinylScreen from '../src/pages/AddVinylScreen'; 
import PaginaVinilos from './pages/PaginaVinilos';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PaginaVinilos />
  </StrictMode>,
);
