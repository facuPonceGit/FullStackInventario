// frontend/src/components/EquipoForm.js


import { useState } from 'react'
import { crearEquipo } from '../api/equipos'

const initial = { codigoInventario: '', nombre: '', marca: '', modelo: '', tipo: '', numeroSerie: '' }

export default function EquipoForm({ onCreated }) {
    const [f, setF] = useState(initial)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const onChange = (e) => setF({ ...f, [e.target.name]: e.target.value })
    const submit = async (e) => {
        e.preventDefault()
        setLoading(true); setError(null)
        try {
            await crearEquipo({ ...f })
            setF(initial)
            onCreated?.()
        } catch (err) {
            setError(err.response?.data?.message ?? err.message)
        } finally { setLoading(false) }
    }

    return (
        <form onSubmit={submit} style={{ display: 'grid', gap: 8, padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>
            <h3>Crear equipo</h3>
            <input name="codigoInventario" placeholder="Código Inventario" value={f.codigoInventario} onChange={onChange} />
            <input name="nombre" placeholder="Nombre" value={f.nombre} onChange={onChange} />
            <input name="marca" placeholder="Marca" value={f.marca} onChange={onChange} />
            <input name="modelo" placeholder="Modelo" value={f.modelo} onChange={onChange} />
            <input name="tipo" placeholder="Tipo" value={f.tipo} onChange={onChange} />
            <input name="numeroSerie" placeholder="Número de Serie" value={f.numeroSerie} onChange={onChange} />
            <button disabled={loading}>{loading ? 'Creando...' : 'Agregar'}</button>
            {error && <div style={{ color: 'crimson' }}>{error}</div>}
        </form>
    )
}
