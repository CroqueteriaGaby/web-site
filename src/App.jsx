import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Catalog from './components/Catalog'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/catalogo" element={<Catalog />} />
    </Routes>
  )
}

export default App
