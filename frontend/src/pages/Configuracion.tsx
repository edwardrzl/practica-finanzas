import Categorias from '../components/configuracion/Categorias'


export default function Configuracion() {

    //const [categorias, setCategorias] = useState<Categoria[]>([])

   /*useEffect(() => {      
        const fetchCategorias = async () => {
            const categorias = await obtenerCategorias()
            setCategorias(categorias)
            }
        fetchCategorias()
    }, [])  */

    return (
        <div>

            {/*<Cuentas />*/}
            <Categorias />
            {/*<Bolsillos />*/}
            {/*<Fondos />*/}
            
        </div>
    )
}