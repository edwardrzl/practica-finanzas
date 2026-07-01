import { useState } from 'react'

interface CategoriaCrearFormProps {
    onCrear: (nombre: string, limite: number, gastado: number, sobrante: number) => void;
    onCerrar: () => void;
}

export default function CategoriaCrearForm({ onCrear, onCerrar }: CategoriaCrearFormProps) {
    const [nombre, setNombre] = useState("")
    const [limite, setLimite] = useState(0)
    const [gastado, setGastado] = useState(0)

    const sobrante = limite - gastado
    const seExcedio = gastado > limite
    const limiteSinDefinir = limite === 0

    function handleSubmit() {
        onCrear(nombre, limite, gastado, sobrante)
    }

    return (
        <div className="crear">
            <button onClick={onCerrar}>X</button>
            <h3>Crear categoría</h3>

            <label htmlFor="nombre">Nombre:</label>
            <input id="nombre" value={nombre} onChange={e => setNombre(e.target.value)} />

            <label htmlFor="limite">Límite:</label>
            <input
                id="limite"
                type="number"
                value={limite}
                onChange={e => setLimite(Number(e.target.value))}
            />

            <label htmlFor="gastado">Gastado:</label>
            <input
                id="gastado"
                type="number"
                value={gastado}
                disabled={limiteSinDefinir}
                onChange={e => setGastado(Number(e.target.value))}
            />
            {limiteSinDefinir && (
                <small className="aviso">Ingresa primero el límite para poder registrar el gastado</small>
            )}

            {!seExcedio && (
            <p className="sobrante">Sobrante: ${sobrante}</p>
            )}
            
            {seExcedio && (
                <small className="aviso-error">El gastado supera el límite establecido</small>
            )}

            <button onClick={handleSubmit} disabled={limiteSinDefinir || seExcedio}>
                Guardar cambios
            </button>
        </div>
    )
}