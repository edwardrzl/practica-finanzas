import { useState } from 'react'

interface BolsilloCrearFormProps {
    onCrear: (nombre: string, valor: number, tipo: "normal" | "deuda") => void;
    onCerrar: () => void;
}

export default function BolsilloCrearForm({ onCrear, onCerrar }: BolsilloCrearFormProps) {
    const [nombre, setNombre] = useState("")
    const [valor, setValor] = useState(0)
    const [tipo, setTipo] = useState<"normal"| "deuda">("normal")

    function handleSubmit() {
        onCrear(nombre, valor, tipo)
    }

    return (
        <div className="crear">
            <button onClick={onCerrar}>X</button>
            <h3>Crear bolsillo</h3>

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
                Crear bolsillo
            </button>
        </div>
    )
}