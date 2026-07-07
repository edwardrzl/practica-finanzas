import { useState, useEffect } from 'react'
import { type Movimiento } from '../types/types'
import {  obtenerMovimientos, actualizarMovimiento } from '../api/movimientosClient'
import MovimientoEditarForm from '../components/historial/MovimientoEditarForm'
import { useMovimientos } from '../context/MovimientosContext'
import { useCategorias } from '../context/CategoriasContext'

export default function Historial() {
    const [movimientoEditando, setMovimientoEditando] = useState<Movimiento | null>(null)

    const { movimientos, setMovimientos } = useMovimientos()
    const { categorias, setCategorias } = useCategorias()

    useEffect(() => {      
            const fetchMovimientos = async () => {
                const movimientos = await obtenerMovimientos()
                setMovimientos(movimientos)
                console.log(movimientos)
                }
            fetchMovimientos()
    }, []) 
    
    async function handleEditar(datosFormulario: Movimiento) {
        const movimientoActualizada = await actualizarMovimiento(datosFormulario) 
        setMovimientos(prev => 
            prev.map(c => c.id === movimientoActualizada.id ? movimientoActualizada : c)
        )
        setMovimientoEditando(null) 
    }

    return (
        <div>
            <h2>Movimientos</h2>
            <ul>      
                {movimientos.map((m) => {
                    const categoria = categorias.find(c => c.id === m.idCategoria)
                    
                    return (
                        <li key={m.id}>
                            Tipo: {m.tipo === "gasto" ? "-" : "+"}. {m.descripcion}. Valor: {m.valor}. 
                            Categoria: {m.idCategoria === null ? "Ingreso" : (categoria?.nombre ?? "Sin categoría")}. 
                            {m.fecha}
                            <button onClick={() => setMovimientoEditando(m)}>Editar</button>
                        </li>
                    )
                })}
            </ul>

            {movimientoEditando && (
                <MovimientoEditarForm
                    movimiento={movimientoEditando}
                    onGuardar={handleEditar}
                    onCerrar={() => setMovimientoEditando(null)}
                />
            )}
        </div>
    )
}