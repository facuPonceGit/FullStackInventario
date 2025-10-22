// src/components/EquipoDetalle.js


import { useEffect, useState } from 'react'
import { detalleEquipo } from '../api/equipos'
import Perifericos from './Perifericos'
import Historial from './Historial'
import CompraGarantia from './CompraGarantia'
import Ubicacion from './Ubicacion'
import Asignacion from './Asignacion'
import { fmtDate } from '../utils/format'

export default function EquipoDetalle({ equipo }) {
    const [detalle, setDetalle] = useState(null)

    async function load() {
        if (!equipo?.id) return;
        setDetalle(await detalleEquipo(equipo.id))
    }

    useEffect(() => { load() }, [equipo?.id])

    if (!equipo)
        return <div style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>Seleccioná un equipo</div>

    return (
        <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
                <h3>Equipo #{equipo.id} — {equipo.nombre}</h3>
                <div>
                    <b>Código:</b> {equipo.codigoInventario} · <b>Marca:</b> {equipo.marca} · <b>Modelo:</b> {equipo.modelo} · <b>Tipo:</b> {equipo.tipo}
                </div>

                {detalle && (
                    <div style={{ marginTop: 8 }}>
                        <b>Proveedor:</b> {detalle.proveedorNombre ?? '—'}
                        {' · '}<b>Compra:</b> {detalle.fechaAdquisicion ? fmtDate(detalle.fechaAdquisicion) : '—'}
                        {' · '}<b>Garantía:</b> {detalle.fechaVencGarantia ? fmtDate(detalle.fechaVencGarantia) : '—'}
                        {' · '}<b>Ubicación:</b> {detalle.ubicacionNombre ?? '—'}
                    </div>
                )}
            </div>

            <CompraGarantia equipoId={equipo.id} onSaved={load} />
            <Ubicacion equipoId={equipo.id} onSaved={load} />
            <Perifericos equipoId={equipo.id} />
            <Historial equipoId={equipo.id} />
            <Asignacion equipoId={equipo.id} />
        </div>
    )
}
