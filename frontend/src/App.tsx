import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header'
import Home from './pages/Home'
function App() {

  return (
    <div className="App">

      <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          {/*<Route path="/vehiculo/:placa" element={<VehiculoDetalle />} />
          {/* Cualquier ruta no definida redirige al inicio */}
          <Route path="*" element={<Navigate to="/" replace />} /> 
          
        </Routes>
      
    </div>
  )
}

export default App
