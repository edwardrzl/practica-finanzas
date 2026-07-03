import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { type Movimiento } from '../types/types'
import { obtenerMovimientos } from '../api/movimientosClient'

interface MovimientosContextType {
    movimientos: Movimiento[];
    setMovimientos: React.Dispatch<React.SetStateAction<Movimiento[]>>;
}

const MovimientosContext = createContext<MovimientosContextType | undefined>(undefined)

export function MovimientosProvider({ children }: { children: ReactNode }) {
    const [movimientos, setMovimientos] = useState<Movimiento[]>([])

    useEffect(() => {
        obtenerMovimientos().then(setMovimientos)
    }, [])

    return (
        <MovimientosContext.Provider value={{ movimientos, setMovimientos }}>
            {children}
        </MovimientosContext.Provider>
    )
}

export function useMovimientos() {
    const context = useContext(MovimientosContext)
    if (!context) {
        throw new Error('useMovimientos debe usarse dentro de un MovimientosProvider')
    }
    return context
}