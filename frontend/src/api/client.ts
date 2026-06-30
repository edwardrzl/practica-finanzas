import { type Categoria} from '../types/types'


async function obtenerCategorias(): Promise<Categoria[]> {

  const response = await fetch(`http://localhost:3000/api/categorias`)

  const categorias = await response.json()
  return categorias
}

/*async function obtenerVehiculo(placa: string): Promise<VehiculoConVigencias> {
  try{

  }catch{
  throw new Error(...)

  }
  const response = await fetch(`http://localhost:3000/api/vehiculo/${placa}`)
  const dato = await response.json()
  return dato*/

export { obtenerCategorias }