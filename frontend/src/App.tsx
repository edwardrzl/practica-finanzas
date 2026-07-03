import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header'
import Home from './pages/Home'
import Configuracion from './pages/Configuracion'
import Historial from './pages/Historial'
import { CategoriasProvider } from './context/CategoriasContext'
import { BolsillosProvider } from './context/BolsillosContext'
import { CuentasProvider } from './context/CuentasContext'
import { MovimientosProvider } from './context/MovimientosContext'

function App() {
  return (
    <CategoriasProvider>
      <BolsillosProvider>
        <CuentasProvider>
          <MovimientosProvider>
          <div className="App">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/configuracion" element={<Configuracion />} />
              <Route path="/historial" element={<Historial />} />
              <Route path="*" element={<Navigate to="/" replace />} /> 
            </Routes>
          </div>
          </MovimientosProvider>
        </CuentasProvider>
      </BolsillosProvider>
    </CategoriasProvider>
  )
}

export default App