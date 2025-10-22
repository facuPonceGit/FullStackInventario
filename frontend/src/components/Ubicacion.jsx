// src/components/Ubicacion.js

import { useEffect, useState } from 'react'
import { listarUbicaciones } from '../api/catalogos'
import { cambiarUbicacion } from '../api/equipos'

export default function Ubicacion({ equipoId, onSaved }) {
    const [ubicaciones, setUbicaciones] = useState([])
    const [sel, setSel] = useState('')

    useEffect(() => { listarUbicaciones().then(setUbicaciones) }, [])
    const save = async () => {
        await cambiarUbicacion(equipoId, sel === '' ? 0 : Number(sel))
        onSaved?.()
    }

    return (
        <div style={{ display: 'flex', gap: 8, alignItems: 'end' }}>
            <div>
                <h4>Ubicación</h4>
                <select value={sel} onChange={(e) => setSel(e.target.value)}>
                    <option value="">(sin ubicación)</option>
                    {ubicaciones.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
                </select>
            </div>
            <button onClick={save}>Guardar</button>
        </div>
    )
}
