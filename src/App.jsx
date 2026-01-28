import React from 'react';
import { Routes, Route } from 'react-router-dom'; // <--- NOTA: Aquí YA NO importamos BrowserRouter
import Home from './components/Home';
import Catalog from './components/Catalog';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/catalogo" element={<Catalog />} />
    </Routes>
  );
}

export default App;