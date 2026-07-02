import { useState, useEffect } from 'react'
import { type Bolsillo } from '../../types/types'
import { obtenerBolsillos, actualizarBolsillo, crearBolsillo, borrarBolsillo } from '../../api/bolsillosClient'
import BolsilloEditarForm from './BolsilloEditarForm'
import BolsilloCrearForm from './BolsilloCrearForm'


export default function Bolsillos() {
    const [bolsilloEditando, setBolsilloEditando] = useState<Bolsillo | null>(null)
    const [bolsilloCreando, setBolsilloCreando] = useState(false)
    const [bolsilloConfirmacionBorrar, setBolsilloConfirmacionBorrar] = useState<Bolsillo | null>(null)

    const [bolsillos, setBolsillos] = useState<Bolsillo[]>([])
    const totalBolsillos = bolsillos.reduce((total, bolsillo) => 
    total + (bolsillo.valor), 0);

    useEffect(() => {      
        const fetchBolsillos = async () => {
            const bolsillos = await obtenerBolsillos()
            setBolsillos(bolsillos)}
            fetchBolsillos()
    }, []) 
    
    async function handleEditar(datosFormulario: Bolsillo) {
        const bolsilloActualizada = await actualizarBolsillo(datosFormulario) 
        setBolsillos(prev => 
            prev.map(c => c.id === bolsilloActualizada.id ? bolsilloActualizada : c)
        )
        setBolsilloEditando(null) 
    }
    
    async function handleCrear(nombre: string, valor: number) {
        const bolsilloCreada = await crearBolsillo({nombre, valor}) 
        setBolsillos(prev => [...prev, bolsilloCreada])
        setBolsilloCreando(false) 
    }
    
    async function handleBorrar(id: number) {
        await borrarBolsillo(id) 
        setBolsillos(prev => prev.filter(c => c.id !== id))
        setBolsilloConfirmacionBorrar(null) 
    }

    return (
        <div>
            <h2>Bolsillos</h2>
            <p>Total: {totalBolsillos}</p>
            <ul>
                {bolsillos.map((c) => (
                    <li key={c.id}>
                        {c.nombre}. Valor: {c.valor}
                        <button onClick={() => setBolsilloEditando(c)}>Editar</button>
                        <button onClick={() => setBolsilloConfirmacionBorrar(c)}>Eliminar</button>
                    </li>
                ))}
            </ul>
            <button onClick={() => setBolsilloCreando(true)}>Crear Bolsillo</button>

            {bolsilloEditando && (
                <BolsilloEditarForm
                    bolsillo={bolsilloEditando}
                    onGuardar={handleEditar}
                    onCerrar={() => setBolsilloEditando(null)}
                />
            )}

            {bolsilloCreando && (
                <BolsilloCrearForm
                    onCrear={handleCrear}
                    onCerrar={() => setBolsilloCreando(false)}
                />
            )}

            {bolsilloConfirmacionBorrar && (
                <>               
                <p>¿Seguro que quieres borrar el bolsillo {bolsilloConfirmacionBorrar.nombre}?</p>
                <button onClick={() => handleBorrar(bolsilloConfirmacionBorrar.id)}>Borrar</button>
                <button onClick={() => setBolsilloConfirmacionBorrar(null)}>Cancelar</button>
                </>
            )}

        </div>
    )
}