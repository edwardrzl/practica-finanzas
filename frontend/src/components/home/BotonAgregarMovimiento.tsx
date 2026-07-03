import { useState } from 'react'
import {useCategorias} from '../../context/CategoriasContext'
import { useBolsillos } from '../../context/BolsillosContext'
import { useCuentas } from '../../context/CuentasContext'
import {crearMovimiento} from '../../api/movimientosClient'
import { type MovimientoNuevo} from '../../types/types'



export default function BotonAgregarMovimiento() {

    const [formMovimiento, setFormMovimiento] = useState(false)
    const [descripcion, setDescripcion] = useState<string>("")
    const [valor, setValor] = useState<number>(0)
    const [tipo, setTipo] = useState<"ingreso"| "gasto">("gasto")
    const { categorias, setCategorias } = useCategorias()
    const { bolsillos, setBolsillos } = useBolsillos()
    const { cuentas, setCuentas } = useCuentas()
    const [idCategoria, setIdCategoria] = useState<number | "">("")
    const [idBolsillo, setIdBolsillo] = useState<number | "">("")
    const [idCuenta, setIdCuenta] = useState<number | "">("")


    const formularioIncompleto = (tipo === "gasto" && idCategoria === "") || idBolsillo === "" || idCuenta === "" || descripcion === ""

    async function handleCrear(movimientoNuevo: MovimientoNuevo) {

        const {movimiento, categoria, cuenta, bolsillo} = await crearMovimiento(movimientoNuevo) 
        //el movimiento no le tengo uso aun, no sé si tenga en un futuro
        if (categoria !== null) {
        setCategorias(prev => prev.map(c => c.id === categoria.id ? categoria : c))
        }
        setCuentas(prev => 
        prev.map(c => c.id === cuenta.id ? cuenta : c))
        setBolsillos(prev => 
        prev.map(b => b.id === bolsillo.id ? bolsillo : b))
            setFormMovimiento(false) 
    }

    function handleClickCrear() {
        if (idBolsillo === "" || idCuenta === "") {
            return
        }
        if (tipo === "gasto" && idCategoria === "") {
            return
        }

        handleCrear({
            valor, descripcion, tipo, idCategoria: tipo === "ingreso" ? null : (idCategoria as number), idBolsillo, idCuenta})
    }

    return (
        <>  
        <div>
            <button onClick={()=> setFormMovimiento(true)}>Agregar Movimiento</button>
        </div>

        {formMovimiento && 
            <div className="crear">
                <button onClick={()=> setFormMovimiento(false)}>X</button>
                <h3>Crear Movimiento</h3>


                <label htmlFor="limite">Valor:</label>
                <input
                    id="limite"
                    type="number"
                    value={valor}
                    onChange={e => setValor(Number(e.target.value))}
                />
                <label htmlFor="nombre">descripcion:</label>
                <input id="nombre" value={descripcion} onChange={e => setDescripcion(e.target.value)} />

                <label htmlFor="tipo">Tipo:</label>
                <select 
                    id="tipo" 
                    value={tipo} 
                    onChange={e => {
                        setTipo(e.target.value as "ingreso" | "gasto")
                        const nuevoTipo = e.target.value as "ingreso" | "gasto"
                        setTipo(nuevoTipo)
                        if (nuevoTipo === "ingreso") setIdCategoria("")
                    }}
                >
                    <option value="ingreso">Ingreso</option>
                    <option value="gasto">Gasto</option>
                </select>

                <label htmlFor="categoria">Categoría:</label>
                <select
                    id="categoria"
                    value={idCategoria}
                    onChange={e => setIdCategoria(e.target.value === "" ? "" : Number(e.target.value))}
                    disabled={tipo === "ingreso"}
                >
                    <option value="" hidden>Escoge categoría</option>
                    {categorias.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                </select>

                <label htmlFor="cuenta">Cuenta:</label>
                <select
                    id="cuenta"
                    value={idCuenta}
                    onChange={e => setIdCuenta(e.target.value === "" ? "" : Number(e.target.value))}
                >
                    <option value="" hidden>Escoge cuenta</option>
                    {cuentas.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                </select>

                <label htmlFor="bolsillo">Cuenta:</label>
                <select
                    id="bolsillo"
                    value={idBolsillo}
                    onChange={e => setIdBolsillo(e.target.value === "" ? "" : Number(e.target.value))}
                >
                    <option value="" hidden>Escoge bolsillo</option>
                    {bolsillos.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                </select>

                <button onClick={handleClickCrear} disabled={formularioIncompleto}>Crear movimiento</button>
            </div>
        }
        </>
    )
}

