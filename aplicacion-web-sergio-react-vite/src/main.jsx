import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AddVinylScreen from '../src/pages/AddVinylScreen';  
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AddVinylScreen />
  </StrictMode>,
);
