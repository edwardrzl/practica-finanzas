import { useState, useEffect } from 'react'
import { type Cuenta } from '../../types/types'
import { obtenerCuentas, actualizarCuenta, crearCuenta, borrarCuenta } from '../../api/cuentasClient'
import CuentaEditarForm from './CuentaEditarForm'
import CuentaCrearForm from './CuentaCrearForm'


export default function Cuentas() {
    const [cuentaEditando, setCuentaEditando] = useState<Cuenta | null>(null)
    const [cuentaCreando, setCuentaCreando] = useState(false)
    const [cuentaConfirmacionBorrar, setCuentaConfirmacionBorrar] = useState<Cuenta | null>(null)

    const [cuentas, setCuentas] = useState<Cuenta[]>([])
    const patrimonio = cuentas.reduce((total, cuenta) => 
    total + (cuenta.tipo === "normal" ? cuenta.valor : -cuenta.valor), 0);

    useEffect(() => {      
        const fetchCuentas = async () => {
            const cuentas = await obtenerCuentas()
            setCuentas(cuentas)
            }
        fetchCuentas()
    }, []) 
    
    async function handleEditar(datosFormulario: Cuenta) {
        const cuentaActualizada = await actualizarCuenta(datosFormulario) 
        setCuentas(prev => 
            prev.map(c => c.id === cuentaActualizada.id ? cuentaActualizada : c)
        )
        setCuentaEditando(null) 
    }
    
    async function handleCrear(nombre: string, valor: number, tipo: "normal" | "deuda") {
        const cuentaCreada = await crearCuenta({nombre, valor, tipo }) 
        setCuentas(prev => [...prev, cuentaCreada])
        setCuentaCreando(false) 
    }
    
    async function handleBorrar(id: number) {
        await borrarCuenta(id) 
        setCuentas(prev => prev.filter(c => c.id !== id))
        setCuentaConfirmacionBorrar(null) 
    }

    return (
        <div>
            <h2>Cuentas</h2>
            <p>Patrimonio de: {patrimonio}</p>
            <ul>
                {cuentas.map((c) => (
                    <li key={c.id}>
                        {c.nombre}. Valor: {c.valor}. Tipo: {c.tipo}
                        <button onClick={() => setCuentaEditando(c)}>Editar</button>
                        <button onClick={() => setCuentaConfirmacionBorrar(c)}>Eliminar</button>
                    </li>
                ))}
            </ul>
            <button onClick={() => setCuentaCreando(true)}>Crear Cuenta</button>

            {cuentaEditando && (
                <CuentaEditarForm
                    cuenta={cuentaEditando}
                    onGuardar={handleEditar}
                    onCerrar={() => setCuentaEditando(null)}
                />
            )}

            {cuentaCreando && (
                <CuentaCrearForm
                    onCrear={handleCrear}
                    onCerrar={() => setCuentaCreando(false)}
                />
            )}

            {cuentaConfirmacionBorrar && (
                <>               
                <p>¿Seguro que quieres borrar la cuenta {cuentaConfirmacionBorrar.nombre}?</p>
                <button onClick={() => handleBorrar(cuentaConfirmacionBorrar.id)}>Borrar</button>
                <button onClick={() => setCuentaConfirmacionBorrar(null)}>Cancelar</button>
                </>
            )}

        </div>
    )
}