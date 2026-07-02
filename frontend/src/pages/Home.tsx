import { useEffect, useState } from 'react';
import { obtenerCategorias } from '../api/categoriasClient';
import type { Categoria } from '../types/types';
import Categorias from '../components/home/Categorias'
import BotonAgregarMovimiento from '../components/home/BotonAgregarMovimiento'

export default function Home() {


   useEffect(() => {      
        
    }, [])  

    return (
        <div>
            {/*<SaldoDisponible />*/}
            <Categorias  />
            <BotonAgregarMovimiento />
            
        </div>
    )
}