import { type Categoria} from '../types/types'


async function obtenerCategorias(): Promise<Categoria[]> {

  const response = await fetch(`http://localhost:3000/api/categorias`)

  const categorias = await response.json()
  return categorias
}


async function actualizarCategoria(categoria: Categoria): Promise<Categoria> {
  const res = await fetch(`http://localhost:3000/api/categorias/${categoria.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nombre: categoria.nombre,
      limite: categoria.limite,
    })
  })

  if (!res.ok) {
    throw new Error('Error al actualizar la categoría')
  }

  const categoriaActualizada = await res.json()
  return categoriaActualizada
}

async function crearCategoria(params: {nombre: string, limite: number, gastado: number, sobrante:number}): Promise<Categoria> {

  const res = await fetch(`http://localhost:3000/api/categorias`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      nombre: params.nombre,
      limite: params.limite,
      gastado: params.gastado,
      sobrante: params.sobrante
     })
  }) 
  const categoria = await res.json()

  return categoria
}

export { obtenerCategorias, actualizarCategoria, crearCategoria }