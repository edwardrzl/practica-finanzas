import { useState } from 'react'
import { type Cuenta } from '../../types/types'

interface CuentaEditarFormProps {
    cuenta: Cuenta;
    onGuardar: (cuenta: Cuenta) => void;
    onCerrar: () => void;
}

export default function CuentaEditarForm({ cuenta, onGuardar, onCerrar }: CuentaEditarFormProps) {
    const [nombre, setNombre] = useState(cuenta.nombre)
    const [valor, setValor] = useState(cuenta.valor)
    const id = cuenta.id

    function handleSubmit() {
        onGuardar({ id, nombre, valor })
    }

    return (
        <div className="modal">
            <button onClick={onCerrar}>X</button>
            <h3>Editar cuenta</h3>
            <input value={nombre} onChange={e => setNombre(e.target.value)} />
            <input type="number" value={valor} onChange={e => setValor(Number(e.target.value))} />
            <button onClick={handleSubmit}>Guardar cambios</button>
        </div>
    )
}

