import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { type Bolsillo } from '../types/types'
import { obtenerBolsillos } from '../api/bolsillosClient'

interface BolsillosContextType {
    bolsillos: Bolsillo[];
    setBolsillos: React.Dispatch<React.SetStateAction<Bolsillo[]>>;
}

const BolsillosContext = createContext<BolsillosContextType | undefined>(undefined)

export function BolsillosProvider({ children }: { children: ReactNode }) {
    const [bolsillos, setBolsillos] = useState<Bolsillo[]>([])

    useEffect(() => {
        obtenerBolsillos().then(setBolsillos)
    }, [])

    return (
        <BolsillosContext.Provider value={{ bolsillos, setBolsillos }}>
            {children}
        </BolsillosContext.Provider>
    )
}

export function useBolsillos() {
    const context = useContext(BolsillosContext)
    if (!context) {
        throw new Error('useBolsillos debe usarse dentro de un BolsillosProvider')
    }
    return context
}