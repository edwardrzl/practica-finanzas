import { type Cuenta} from '../types/types'

async function obtenerCuentas(): Promise<Cuenta[]> {

  const response = await fetch(`http://localhost:3000/api/cuentas`)

  const cuentas = await response.json()
  return cuentas
}


async function actualizarCuenta(cuenta: Cuenta): Promise<Cuenta> {
  const res = await fetch(`http://localhost:3000/api/cuentas/${cuenta.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nombre: cuenta.nombre,
      valor: cuenta.valor,
    })
  })

  if (!res.ok) {
    throw new Error('Error al actualizar la categoría')
  }

  const cuentaActualizada = await res.json()
  return cuentaActualizada
}

async function crearCuenta(params: {nombre: string, valor: number}): Promise<Cuenta> {

  const res = await fetch(`http://localhost:3000/api/cuentas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      nombre: params.nombre,
      valor: params.valor
     })
  }) 
  const cuenta = await res.json()

  return cuenta
}

async function borrarCuenta(id: number): Promise<void> {
  const res = await fetch(`http://localhost:3000/api/cuentas/${id}`, {
    method: 'DELETE'
  })

  if (!res.ok) {
    throw new Error('Error al borrar la cuenta')
  }
}

export { obtenerCuentas, actualizarCuenta, crearCuenta, borrarCuenta }