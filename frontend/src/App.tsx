import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header'
import Home from './pages/Home'
import Configuracion from './pages/Configuracion'
import { CategoriasProvider } from './context/CategoriasContext'
import { BolsillosProvider } from './context/BolsillosContext'
import { CuentasProvider } from './context/CuentasContext'

function App() {
  return (
    <CategoriasProvider>
      <BolsillosProvider>
        <CuentasProvider>
          <div className="App">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/configuracion" element={<Configuracion />} />
              <Route path="*" element={<Navigate to="/" replace />} /> 
            </Routes>
          </div>
        </CuentasProvider>
      </BolsillosProvider>
    </CategoriasProvider>
  )
}

export default App