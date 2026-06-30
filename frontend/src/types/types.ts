export interface Movimiento {
    id: number
    valor: number
    categoria: string
    bolsillo: string
    cuenta: string
    tipo: "gasto" | "ingreso"
}

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
}