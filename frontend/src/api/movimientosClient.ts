import { type Movimiento, type MovimientoNuevo} from '../types/types'

async function obtenerMovimientos(): Promise<Movimiento[]> {

  const response = await fetch(`http://localhost:3000/api/movimientos`)

  const movimientos = await response.json()
  return movimientos
}


/*async function actualizarMovimiento(movimiento: Movimiento): Promise<Movimiento> {
  const res = await fetch(`http://localhost:3000/api/movimientos/${movimiento.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nombre: movimiento.nombre,
      valor: movimiento.valor,
    })
  })

  if (!res.ok) {
    throw new Error('Error al actualizar el movimiento')
  }

  const movimientoActualizada = await res.json()
  return movimientoActualizada
}*/

async function crearMovimiento(nuevoMovimiento: MovimientoNuevo): Promise<Movimiento> {
  console.log("api")
  const res = await fetch(`http://localhost:3000/api/movimientos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
        valor: nuevoMovimiento.valor,
        descripcion: nuevoMovimiento.descripcion,
        tipo: nuevoMovimiento.tipo,
        idCategoria: nuevoMovimiento.idCategoria,
        idCuenta: nuevoMovimiento.idCuenta,
        idBolsillo: nuevoMovimiento.idBolsillo,
     })
  }) 
  console.log("api2")
  const movimiento = await res.json()

  return movimiento
}

/*async function borrarMovimiento(id: number): Promise<void> {
  const res = await fetch(`http://localhost:3000/api/movimientos/${id}`, {
    method: 'DELETE'
  })

  if (!res.ok) {
    throw new Error('Error al borrar la movimiento')
  }
}
*/
export { crearMovimiento }
//export { obtenerMovimientos, actualizarMovimiento, crearMovimiento, borrarMovimiento }