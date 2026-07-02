import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { type Cuenta } from '../types/types'
import { obtenerCuentas } from '../api/cuentasClient'

interface CuentasContextType {
    cuentas: Cuenta[];
    setCuentas: React.Dispatch<React.SetStateAction<Cuenta[]>>;
}

const CuentasContext = createContext<CuentasContextType | undefined>(undefined)

export function CuentasProvider({ children }: { children: ReactNode }) {
    const [cuentas, setCuentas] = useState<Cuenta[]>([])

    useEffect(() => {
        obtenerCuentas().then(setCuentas)
    }, [])

    return (
        <CuentasContext.Provider value={{ cuentas, setCuentas }}>
            {children}
        </CuentasContext.Provider>
    )
}

export function useCuentas() {
    const context = useContext(CuentasContext)
    if (!context) {
        throw new Error('useCuentas debe usarse dentro de un CuentasProvider')
    }
    return context
}