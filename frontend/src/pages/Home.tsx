import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { obtenerCategorias } from '../api/client';
import type { Categoria } from '../types/types';
import Categorias from '../components/home/Categorias'
export default function Home() {

    const navigate = useNavigate();
    const [categorias, setCategorias] = useState<Categoria[]>([])

    /*function manejarBusqueda(placa: string) {
        navigate(`/vehiculo/${placa}`);
    }*/
   useEffect(() => {      
        const fetchCategorias = async () => {
            const categorias = await obtenerCategorias()
            setCategorias(categorias)
            }
        fetchCategorias()
    }, [])  

    return (
        <div>
            {/*<SaldoDisponible />*/}
            <Categorias categorias={categorias}/>
            {/*<BotonAgregarMovimiento />*/}
            
        </div>
    )
}