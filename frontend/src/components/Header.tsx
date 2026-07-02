import { useNavigate } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate();
    
    return (
        <div style={{ backgroundColor: '#282c34', padding: '20px', color: 'white' }}>
            <h2>Julio 2026</h2>
  
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button onClick={() => navigate('/')}>Home</button>
                <button>Historial de movimientos</button>
                <button onClick={() => navigate('/configuracion')}>Configuración</button>
            </div>
        </div>  
    )
}

