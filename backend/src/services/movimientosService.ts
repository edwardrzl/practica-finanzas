import * as repo from "../data/movimientosRepository"
import {crear} from "../data/movimientosRepository"
import {obtenerCategoria, obtenerBolsillo, obtenerCuenta} from "../data/padresRepository"

export async function crearMovimiento(
    valor: number,
    //categoria: string,
    //bolsillo: string,
    //cuenta: string,
    tipo: "gasto" | "ingreso",
    idCategoria: number,
    idBolsillo: number,
    idCuenta: number
){
    const categoria =  await obtenerCategoria(idCategoria)
    const bolsillo = await obtenerBolsillo(idBolsillo)
    const cuenta = await obtenerCuenta(idCuenta)

    if(tipo === "gasto"){

        //Actualizar datos categoria
        categoria.gastado = valor + categoria.gastado
        if(categoria.limite > categoria.gastado && categoria.sobrante!==0){
            categoria.sobrante = categoria.limite-categoria.gastado
        }else{
            categoria.sobrante = 0
        }

        //Actualizar datos bolsillo
        bolsillo.valor -= valor
        
        //Actualizar datos cuenta
        cuenta.valor -= valor
    }

    const id = crear(
        valor,
        categoria.nombre,
        bolsillo.nombre,
        cuenta.nombre,
        tipo,
        idCategoria,
        categoria.gastado,
        categoria.sobrante,
        idBolsillo,
        bolsillo.valor,
        idCuenta,
        cuenta.valor
    )
}