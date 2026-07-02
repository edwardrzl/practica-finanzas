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
    const { categorias } = useCategorias()
    const { bolsillos } = useBolsillos()
    const { cuentas } = useCuentas()
    const [idCategoria, setIdCategoria] = useState<number | "">("")
    const [idBolsillo, setIdBolsillo] = useState<number | "">("")
    const [idCuenta, setIdCuenta] = useState<number | "">("")


    const formularioIncompleto = idCategoria === "" || idBolsillo === "" || idCuenta === "" || descripcion === ""

    async function handleCrear(movimientoNuevo: MovimientoNuevo) {

        console.log(movimientoNuevo)
        const movimientoNuevoo = await crearMovimiento(movimientoNuevo) 
        console.log(movimientoNuevoo)
            //setMovimientos(prev => [...prev, cuentaCreada])
            setFormMovimiento(false) 
    }

    function handleClickCrear() {
        if (idCategoria === "" || idBolsillo === "" || idCuenta === "") {
            return // no debería pasar si el botón está disabled, pero es una guarda extra
        }

        handleCrear({valor, descripcion, tipo, idCategoria, idBolsillo, idCuenta})
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
                    onChange={e => setTipo(e.target.value as "ingreso" | "gasto")}
                >
                    <option value="ingreso">Ingreso</option>
                    <option value="gasto">Gasto</option>
                </select>

                <label htmlFor="categoria">Categoría:</label>
                <select
                    id="categoria"
                    value={idCategoria}
                    onChange={e => setIdCategoria(e.target.value === "" ? "" : Number(e.target.value))}
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

