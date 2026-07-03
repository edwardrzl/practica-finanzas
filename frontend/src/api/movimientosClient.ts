import { type Bolsillo, type Categoria, type Cuenta, type Movimiento, type MovimientoNuevo} from '../types/types'

async function obtenerMovimientos(): Promise<Movimiento[]> {

  const response = await fetch(`http://localhost:3000/api/movimientos`)

  const movimientos = await response.json()
  return movimientos
}


async function actualizarMovimiento(movimiento: Movimiento): Promise<Movimiento> {
  const res = await fetch(`http://localhost:3000/api/movimientos/${movimiento.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      descripcion: movimiento.descripcion,
    })
  })

  if (!res.ok) {
    throw new Error('Error al actualizar el movimiento')
  }

  const movimientoActualizada = await res.json()
  return movimientoActualizada
}

async function crearMovimiento(nuevoMovimiento: MovimientoNuevo): Promise<{"movimiento": Movimiento, "categoria": Categoria, "cuenta": Cuenta, "bolsillo": Bolsillo}> {
  
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

  const datos = await res.json()
  
  return datos
}



export { obtenerMovimientos, crearMovimiento, actualizarMovimiento }
