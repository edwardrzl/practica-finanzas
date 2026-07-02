import { type Bolsillo} from '../types/types'

async function obtenerBolsillos(): Promise<Bolsillo[]> {

  const response = await fetch(`http://localhost:3000/api/bolsillos`)

  const bolsillos = await response.json()
  return bolsillos
}


async function actualizarBolsillo(bolsillo: Bolsillo): Promise<Bolsillo> {
  const res = await fetch(`http://localhost:3000/api/bolsillos/${bolsillo.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nombre: bolsillo.nombre,
      valor: bolsillo.valor,
    })
  })

  if (!res.ok) {
    throw new Error('Error al actualizar el bolsillo')
  }

  const bolsilloActualizada = await res.json()
  return bolsilloActualizada
}

async function crearBolsillo(params: {nombre: string, valor: number}): Promise<Bolsillo> {

  const res = await fetch(`http://localhost:3000/api/bolsillos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      nombre: params.nombre,
      valor: params.valor,
     })
  }) 
  const bolsillo = await res.json()

  return bolsillo
}

async function borrarBolsillo(id: number): Promise<void> {
  const res = await fetch(`http://localhost:3000/api/bolsillos/${id}`, {
    method: 'DELETE'
  })

  if (!res.ok) {
    throw new Error('Error al borrar la bolsillo')
  }
}

export { obtenerBolsillos, actualizarBolsillo, crearBolsillo, borrarBolsillo }