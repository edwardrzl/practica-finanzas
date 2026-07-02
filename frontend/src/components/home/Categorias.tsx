import { useEffect } from 'react'
import { type Categoria} from '../../types/types'

interface CategoriasProps {
    categorias: Categoria[];

}

export default function Categorias({ categorias }: CategoriasProps) {
    
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

