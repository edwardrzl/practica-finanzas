import { useState } from 'react'
import { type Categoria } from '../../types/types'

interface CategoriaFormModalProps {
    categoria: Categoria;
    onGuardar: (categoria: Categoria) => void;
    onCerrar: () => void;
}

export default function CategoriaFormModal({ categoria, onGuardar, onCerrar }: CategoriaFormModalProps) {
    const [nombre, setNombre] = useState(categoria.nombre)
    const [limite, setLimite] = useState(categoria.limite)
    const sobrante = limite - categoria.gastado

    function handleSubmit() {
        onGuardar({ ...categoria, nombre, limite, sobrante })
    }

    return (
        <div className="modal">
            <button onClick={onCerrar}>X</button>
            <h3>Editar categoría</h3>
            <input value={nombre} onChange={e => setNombre(e.target.value)} />
            <input type="number" value={limite} onChange={e => {
                setLimite(Number(e.target.value))
                }} />
            <button onClick={handleSubmit}>Guardar cambios</button>
        </div>
    )
}

