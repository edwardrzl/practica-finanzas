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
    const [tipo, setTipo] = useState<"normal"| "deuda">("normal")

    const id = cuenta.id

    function handleSubmit() {
        onGuardar({ id, nombre, valor, tipo })
    }

    return (
        <div className="modal">
            <button onClick={onCerrar}>X</button>
            <h3>Editar cuenta</h3>
            <input value={nombre} onChange={e => setNombre(e.target.value)} />
            <input type="number" value={valor} onChange={e => setValor(Number(e.target.value))} />
            <label htmlFor="tipo">Tipo:</label>
            <select 
                id="tipo" 
                value={tipo} 
                onChange={e => setTipo(e.target.value as "normal" | "deuda")}
            >
                <option value="normal">Normal</option>
                <option value="gasto">Gasto</option>
            </select>
            <button onClick={handleSubmit}>Guardar cambios</button>
        </div>
    )
}

