import { useState } from 'react'
import {useCategorias} from '../../context/CategoriasContext'
import { useBolsillos } from '../../context/BolsillosContext'
import { useCuentas } from '../../context/CuentasContext'

export default function BotonAgregarMovimiento() {

    const [formMovimiento, setFormMovimiento] = useState(false)
    const [descripcion, setDescripcion] = useState<string>("")
    const [valor, setValor] = useState<number>(0)
    const [tipo, setTipo] = useState<"ingreso"| "gasto">("gasto")
    const { categorias } = useCategorias()
    const { bolsillos } = useBolsillos()
    const { cuentas } = useCuentas()
    const [categoriaId, setCategoriaId] = useState<number | "">(0)
    const [bolsilloId, setBolsilloId] = useState<number | "">(0)
    const [cuentaId, setCuentaId] = useState<number | "">(0)

    

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
                    value={categoriaId}
                    onChange={e => setCategoriaId(e.target.value === "" ? "" : Number(e.target.value))}
                >
                    <option value="" hidden>Escoge categoría</option>
                    {categorias.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                </select>

                <label htmlFor="cuenta">Cuenta:</label>
                <select
                    id="cuenta"
                    value={cuentaId}
                    onChange={e => setCuentaId(e.target.value === "" ? "" : Number(e.target.value))}
                >
                    <option value="" hidden>Escoge cuenta</option>
                    {cuentas.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                </select>

                <label htmlFor="bolsillo">Cuenta:</label>
                <select
                    id="bolsillo"
                    value={bolsilloId}
                    onChange={e => setBolsilloId(e.target.value === "" ? "" : Number(e.target.value))}
                >
                    <option value="" hidden>Escoge bolsillo</option>
                    {bolsillos.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                </select>
            </div>
        }
        </>
    )
}

