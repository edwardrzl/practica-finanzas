import { useEffect, useState } from 'react'
import { type Categoria } from '../../types/types'
import { obtenerCategorias, actualizarCategoria, crearCategoria } from '../../api/client'
import CategoriaFormModal from './CategoriaFormModal'
import CategoriaCrearForm from './CategoriaCrearForm'


export default function Categorias() {

    const [categorias, setCategorias] = useState<Categoria[]>([])

    useEffect(() => {      
        const fetchCategorias = async () => {
            const categorias = await obtenerCategorias()
            setCategorias(categorias)
            }
        fetchCategorias()
    }, []) 

    const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(null)
    const [categoriaCreando, setCategoriaCreando] = useState(false)

    async function handleGuardar(datosFormulario: Categoria) {
        const categoriaActualizada = await actualizarCategoria(datosFormulario) 
        setCategorias(prev => 
            prev.map(c => c.id === categoriaActualizada.id ? categoriaActualizada : c)
        )
        setCategoriaEditando(null) 
    }
    
    async function handleCrear(nombre: string, limite: number, gastado: number, sobrante: number) {
        const categoriaCreada = await crearCategoria({nombre, limite, gastado, sobrante }) 
        setCategorias(prev => [...prev, categoriaCreada])
        setCategoriaCreando(false) 
    }

    return (
        <div>
            <h2>Categorias de Saldo Disponible</h2>
            <h4>Al crear una categoria se afectará el bolsillo "Libre", pero el valor de gastado no afectará el valor de las cuentas ni ningún bolsillo</h4>
            <ul>
                {categorias.map((c) => (
                    <li key={c.id}>
                        {c.nombre} {c.limite}/{c.gastado}. Sobrante={c.sobrante}
                        <button onClick={() => setCategoriaEditando(c)}>Editar</button>
                        <button>Eliminar</button>
                    </li>
                ))}
            </ul>
            <button onClick={() => setCategoriaCreando(true)}>Crear Categoria</button>

            {categoriaEditando && (
                <CategoriaFormModal
                    categoria={categoriaEditando}
                    onGuardar={handleGuardar}
                    onCerrar={() => setCategoriaEditando(null)}
                />
            )}

            {categoriaCreando && (
                <CategoriaCrearForm
                    onCrear={handleCrear}
                    onCerrar={() => setCategoriaCreando(false)}
                />
            )}

        </div>
    )
}