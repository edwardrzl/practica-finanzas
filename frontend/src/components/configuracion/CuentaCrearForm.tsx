import { useState } from 'react'

interface CuentaCrearFormProps {
    onCrear: (nombre: string, valor: number, tipo: "normal" | "deuda") => void;
    onCerrar: () => void;
}

export default function CuentaCrearForm({ onCrear, onCerrar }: CuentaCrearFormProps) {
    const [nombre, setNombre] = useState("")
    const [valor, setValor] = useState(0)
    const [tipo, setTipo] = useState<"normal"| "deuda">("normal")

    function handleSubmit() {
        onCrear(nombre, valor, tipo)
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

            <label htmlFor="tipo">Tipo:</label>
            <select 
                id="tipo" 
                value={tipo} 
                onChange={e => setTipo(e.target.value as "normal" | "deuda")}
            >
                <option value="normal">Normal</option>
                <option value="deuda">Deuda</option>
            </select>

            <button onClick={handleSubmit}>
                Crear cuenta
            </button>
        </div>
    )
}