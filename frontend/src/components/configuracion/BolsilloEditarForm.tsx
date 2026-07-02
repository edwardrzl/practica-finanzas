import { useState } from 'react'
import { type Bolsillo } from '../../types/types'

interface BolsilloEditarFormProps {
    bolsillo: Bolsillo;
    onGuardar: (bolsillo: Bolsillo) => void;
    onCerrar: () => void;
}

export default function BolsilloEditarForm({ bolsillo, onGuardar, onCerrar }: BolsilloEditarFormProps) {
    const [nombre, setNombre] = useState(bolsillo.nombre)
    const [valor, setValor] = useState(bolsillo.valor)

    const id = bolsillo.id

    function handleSubmit() {
        onGuardar({ id, nombre, valor })
    }

    return (
        <div className="modal">
            <button onClick={onCerrar}>X</button>
            <h3>Editar bolsillo</h3>
            <input value={nombre} onChange={e => setNombre(e.target.value)} />
            <input type="number" value={valor} onChange={e => setValor(Number(e.target.value))} />

            <button onClick={handleSubmit}>Guardar cambios</button>
        </div>
    )
}

