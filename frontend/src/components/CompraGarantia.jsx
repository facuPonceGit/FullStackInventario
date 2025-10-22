// src/components/CompraGarantia.js


import { useEffect, useState } from 'react'
import { actualizarCompraGarantia } from '../api/equipos'
import { listarProveedores } from '../api/catalogos'

export default function CompraGarantia({ equipoId, onSaved }) {
    const [proveedores, setProveedores] = useState([])
    const [f, setF] = useState({ compra: '', garantia: '', proveedorId: '' })
    useEffect(() => { listarProveedores().then(setProveedores) }, [])

    const onChange = (e) => setF({ ...f, [e.target.name]: e.target.value })
    const save = async (e) => {
        e.preventDefault()
        const payload = {
            compra: f.compra ? new Date(f.compra).toISOString() : null,
            garantia: f.garantia ? new Date(f.garantia).toISOString() : null,
            proveedorId: f.proveedorId === '' ? null : Number(f.proveedorId)
        }
        await actualizarCompraGarantia(equipoId, payload)
        onSaved?.()
    }

    return (
        <form onSubmit={save} style={{ display: 'grid', gap: 8 }}>
            <h4>Compra / Garantía / Proveedor</h4>
            <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <label>Compra
                    <input type="date" name="compra" value={f.compra} onChange={onChange} />
                </label>
                <label>Garantía
                    <input type="date" name="garantia" value={f.garantia} onChange={onChange} />
                </label>
                <label>Proveedor
                    <select name="proveedorId" value={f.proveedorId} onChange={onChange}>
                        <option value="">(sin proveedor)</option>
                        {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                    </select>
                </label>
            </div>
            <button>Guardar</button>
        </form>
    )
}
