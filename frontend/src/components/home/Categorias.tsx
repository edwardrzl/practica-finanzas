import { useEffect } from 'react'
import { type Categoria} from '../../types/types'
import { useCategorias } from '../../context/CategoriasContext'

export default function Categorias() {
    
    const { categorias, setCategorias } = useCategorias()
    useEffect(() => {
        
    }, [])

    return (
        <div>
            <h2>Categorias de Saldo Disponible</h2>

            <ul>
                {categorias.map((c) => (
                    <li key={c.id}>{c.nombre} {" "} {c.limite}  {"/"} {c.gastado}. Sobrante: {c.sobrante} </li>
                ))}
            </ul>
        </div>
    )
}

