export interface Movimiento {
    id: number
    valor: number
    descripcion: string
    idCategoria: number
    idBolsillo: number
    idCuenta: number
    fecha: string
    tipo: "gasto" | "ingreso"
}
export interface MovimientoNuevo extends Omit<Movimiento, 'id' | 'fecha'> {}

export interface Categoria {
    id: number
    nombre: string
    limite: number
    gastado: number
    sobrante: number
}
export interface Bolsillo {
    id: number
    nombre: string
    valor: number
}
export interface Cuenta {
    id: number
    nombre: string
    valor: number
    tipo: "normal" | "deuda"
}