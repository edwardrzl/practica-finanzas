// context/CategoriasContext.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { type Categoria } from '../types/types'
import { obtenerCategorias } from '../api/categoriasClient'

interface CategoriasContextType {
    categorias: Categoria[];
    setCategorias: React.Dispatch<React.SetStateAction<Categoria[]>>;
}

const CategoriasContext = createContext<CategoriasContextType | undefined>(undefined)

export function CategoriasProvider({ children }: { children: ReactNode }) {
    const [categorias, setCategorias] = useState<Categoria[]>([])

    useEffect(() => {
        obtenerCategorias().then(setCategorias)
    }, [])

    return (
        <CategoriasContext.Provider value={{ categorias, setCategorias }}>
            {children}
        </CategoriasContext.Provider>
    )
}

export function useCategorias() {
    const context = useContext(CategoriasContext)
    if (!context) {
        throw new Error('useCategorias debe usarse dentro de un CategoriasProvider')
    }
    return context
}