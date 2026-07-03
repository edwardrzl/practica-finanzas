import { useState } from 'react'
import { type Movimiento } from '../../types/types'

interface MovimientoEditarFormProps {
    movimiento: Movimiento;
    onGuardar: (movimiento: Movimiento) => void;
    onCerrar: () => void;
}

export default function MovimientoEditarForm({ movimiento, onGuardar, onCerrar }: MovimientoEditarFormProps) {
    const [descripcion, setDescripcion] = useState(movimiento.descripcion)

    function handleSubmit() {
        onGuardar({ ...movimiento, descripcion })
    }

    return (
        <div className="modal">
            <button onClick={onCerrar}>X</button>
            <h3>Editar movimiento</h3>
            <input value={descripcion} onChange={e => setDescripcion(e.target.value)} />

            <button onClick={handleSubmit}>Guardar cambio</button>
        </div>
    )
}

