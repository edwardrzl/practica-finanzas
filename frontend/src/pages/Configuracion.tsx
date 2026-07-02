import Categorias from '../components/configuracion/Categorias'
import Cuentas from '../components/configuracion/Cuentas'
import Bolsillos from '../components/configuracion/Bolsillos'

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

            <Cuentas />
            <Bolsillos />
            <Categorias />
            {/*<Fondos />*/}
            
        </div>
    )
}