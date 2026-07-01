import { useState } from 'react'

interface CuentaCrearFormProps {
    onCrear: (nombre: string, valor: number) => void;
    onCerrar: () => void;
}

export default function CuentaCrearForm({ onCrear, onCerrar }: CuentaCrearFormProps) {
    const [nombre, setNombre] = useState("")
    const [valor, setValor] = useState(0)

    function handleSubmit() {
        onCrear(nombre, valor)
    }

    return (
        <div className="crear">
            <button onClick={onCerrar}>X</button>
            <h3>Crear cuenta</h3>

            <label htmlFor="nombre">Nombre:</label>
            <input id="nombre" value={nombre} onChange={e => setNombre(e.target.value)} />

            <label htmlFor="valor">Valor:</label>
            <input
                id="valor"
                type="number"
                value={valor}
                onChange={e => setValor(Number(e.target.value))}
            />

            <button onClick={handleSubmit}>
                Guardar cambios
            </button>
        </div>
    )
}