import { useEffect, useState } from 'react'
import { type Categoria } from '../../types/types'
import { obtenerCategorias, actualizarCategoria, crearCategoria, borrarCategoria } from '../../api/categoriasClient'
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
    const [categoriaConfirmacionBorrar,setCategoriaConfirmacionBorrar] = useState<Categoria | null>(null)

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

    async function handleBorrar(id: number) {
        await borrarCategoria(id) 
        setCategorias(prev => prev.filter(c => c.id !== id))
        setCategoriaConfirmacionBorrar(null)
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
                        <button onClick={() => setCategoriaConfirmacionBorrar(c)}>Eliminar</button>
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

            {categoriaConfirmacionBorrar && (
                <>               
                <p>¿Seguro que quieres borrar la categoria {categoriaConfirmacionBorrar.nombre}?</p>
                <button onClick={() => handleBorrar(categoriaConfirmacionBorrar.id)}>Borrar</button>
                <button onClick={() => setCategoriaConfirmacionBorrar(null)}>Cancelar</button>
                </>
            )}
        </div>
    )
    
}