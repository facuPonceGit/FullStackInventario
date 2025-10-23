// frontend/src/components/Perifericos.js - AGREGAR onSaved
import { useEffect, useState } from 'react'
import { listarPerifericos, agregarPeriferico } from '../api/equipos'

export default function Perifericos({ equipoId, onSaved }) { // ← Agregar onSaved
    const [list, setList] = useState([])
    const [f, setF] = useState({ tipo: '', marca: '', modelo: '', numeroSerie: '' })

    const load = async () => setList(await listarPerifericos(equipoId))
    useEffect(() => { if (equipoId) load() }, [equipoId])
    const onChange = (e) => setF({ ...f, [e.target.name]: e.target.value })
    const add = async (e) => {
        e.preventDefault()
        await agregarPeriferico(equipoId, f)
        setF({ tipo: '', marca: '', modelo: '', numeroSerie: '' })
        load()
        onSaved?.(); // ← Notificar actualización
    }

    return (
        <div style={{ display: 'grid', gap: 8 }}>
            <h4>Periféricos</h4>
            <table><thead><tr><th>ID</th><th>Tipo</th><th>Marca</th><th>Modelo</th><th>Serie</th></tr></thead>
                <tbody>{list.map(p => <tr key={p.id}><td>{p.id}</td><td>{p.tipo}</td><td>{p.marca}</td><td>{p.modelo}</td><td>{p.numeroSerie}</td></tr>)}</tbody>
            </table>
            <form onSubmit={add} style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8 }}>
                <input name="tipo" placeholder="Tipo" value={f.tipo} onChange={onChange} />
                <input name="marca" placeholder="Marca" value={f.marca} onChange={onChange} />
                <input name="modelo" placeholder="Modelo" value={f.modelo} onChange={onChange} />
                <input name="numeroSerie" placeholder="Serie" value={f.numeroSerie} onChange={onChange} />
                <button>Agregar</button>
            </form>
        </div>
    )
}
