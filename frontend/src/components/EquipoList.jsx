// frontend/src/components/EquipoList.js


import { useEffect, useState } from 'react'
import { listarEquipos } from '../api/equipos'

export default function EquipoList({ onSelect }) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    const load = async () => {
        setLoading(true)
        try { setData(await listarEquipos()) } finally { setLoading(false) }
    }
    useEffect(() => { load() }, [])

    return (
        <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3>Equipos</h3>
                <button onClick={load}>↻</button>
            </div>
            {loading ? <p>Cargando...</p> :
                <table width="100%">
                    <thead><tr>
                        <th align="left">ID</th><th align="left">Código</th><th align="left">Nombre</th><th align="left">Marca</th><th align="left">Modelo</th><th align="left">Tipo</th>
                    </tr></thead>
                    <tbody>
                        {data.map(e => (
                            <tr key={e.id} onClick={() => onSelect?.(e)} style={{ cursor: 'pointer' }}>
                                <td>{e.id}</td><td>{e.codigoInventario}</td><td>{e.nombre}</td><td>{e.marca}</td><td>{e.modelo}</td><td>{e.tipo}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>}
        </div>
    )
}
