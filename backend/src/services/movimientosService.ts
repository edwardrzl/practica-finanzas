import * as repo from "../data/movimientosRepository"

import {obtenerCategoria} from "../data/categoriasRepository"
import {obtenerBolsillo} from "../data/bolsillosRepository"
import {obtenerCuenta} from "../data/cuentasRepository"
import { Movimiento, Categoria } from "../types/types"

//import {obtenerCategoria, obtenerBolsillo, obtenerCuenta} from "../data/padresRepository"

export async function crearMovimiento(
    valor: number,
    descripcion: string,
    tipo: "gasto" | "ingreso",
    idCategoria: number,
    idCuenta: number,
    idBolsillo: number,
): Promise<{"movimiento": Movimiento, "categoria": Categoria}>{
    const categoria =  await obtenerCategoria(idCategoria)
    const bolsillo = await obtenerBolsillo(idBolsillo)
    const cuenta = await obtenerCuenta(idCuenta)

    if(tipo === "gasto"){

        //Actualizar datos categoria
        console.log("entre en service")
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

    const movimiento = repo.crear(
        valor,
        descripcion,
        tipo,
        idCategoria,
        categoria.gastado,
        categoria.sobrante,
        idBolsillo,
        bolsillo.valor,
        idCuenta,
        cuenta.valor
    )
    const categoriaActualizada =  await obtenerCategoria(idCategoria)

    return {"movimiento": await movimiento, "categoria": categoriaActualizada}
}