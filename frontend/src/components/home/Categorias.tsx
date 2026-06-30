import { useEffect } from 'react'
import { type Categoria} from '../../types/types'

interface CategoriasProps {
    categorias: Categoria[];

}

export default function Categorias({ categorias }: CategoriasProps) {
    
    useEffect(() => {
        
    }, [])

    /*const handleToggleSelect = (vigenciaId: number) => {
        setSeleccionadas(prev => {
            const newSet = new Set(prev)
            if (newSet.has(vigenciaId)) {
                newSet.delete(vigenciaId)
            } else {
                newSet.add(vigenciaId)
            }
            
            setTotalSeleccionadas(vigencias.filter(v => newSet.has(v.id)).reduce((sum, v) => sum + v.valor, 0) || 0)
            return newSet
        })
    }*/

    return (
        <div>
            <h2>Categorias de Saldo Disponible</h2>

            <ul>
                {categorias.map((c) => (
                    <li key={c.id}>{c.nombre} {" "} {c.limite}  {"/"} {c.gastado} </li>
                ))}
            </ul>
        </div>
    )
}

