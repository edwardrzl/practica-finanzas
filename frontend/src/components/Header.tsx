export default function Header() {
    
    return (
        <div style={{ backgroundColor: '#282c34', padding: '20px', color: 'white', textAlign: 'center' }}>
            <h1>Finanzas</h1>
            
            <form>
                <label>Usuario:</label>
                <input type="text" placeholder="Ingrese su usuario" />
                <label>Contraseña:</label>
                <input type="password" placeholder="Ingrese su contraseña" />
                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
    )
}

