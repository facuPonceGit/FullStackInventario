// src/components/Asignacion.js
import { useEffect, useMemo, useState } from 'react'
import { listarUsuariosAsignados } from '../api/catalogos'
import { asignarUsuario, obtenerAsignacionVigente, listarAsignaciones } from '../api/equipos'
import { parseFromInput, toInputDateTime } from '../utils/dt'
import { fmtDateTime } from '../utils/format'

// Normaliza una fila de asignación que puede venir en PascalCase (C#) o camelCase
const normalizeAsignacion = (r) => ({
    id: r?.id ?? r?.Id ?? null,
    equipoId: r?.equipoId ?? r?.EquipoId ?? null,
    usuarioId: r?.usuarioId ?? r?.UsuarioId ?? null,
    usuarioNombre: r?.usuarioNombre ?? r?.UsuarioNombre ?? r?.Nombre ?? null,
    usuarioEmail: r?.usuarioEmail ?? r?.UsuarioEmail ?? r?.Email ?? null,
    fechaDesde: r?.fechaDesde ?? r?.FechaDesde ?? null,
    fechaHasta: r?.fechaHasta ?? r?.FechaHasta ?? null,
    observacion: r?.observacion ?? r?.Observacion ?? null,
})

export default function Asignacion({ equipoId }) {
    const [usuarios, setUsuarios] = useState([])
    const [vigente, setVigente] = useState(null) // objeto normalizado o null
    const [hist, setHist] = useState([])
    const [f, setF] = useState({ usuarioId: '', fechaDesde: '', observacion: '' })

    // Índice rápido id->usuario
    const usuariosById = useMemo(() => {
        const m = new Map()
        for (const u of usuarios) m.set(u.id, u)
        return m
    }, [usuarios])

    async function refresh() {
        if (!equipoId) return

        // Vigente
        const vRaw = await obtenerAsignacionVigente(equipoId)
        const vNorm = (vRaw && Object.keys(vRaw).length) ? normalizeAsignacion(vRaw) : null
        setVigente(vNorm)

        // Historial
        const hRaw = await listarAsignaciones(equipoId)
        const hNorm = (Array.isArray(hRaw) ? hRaw : []).map(normalizeAsignacion)
        setHist(hNorm)
    }

    useEffect(() => { listarUsuariosAsignados().then(setUsuarios) }, [])
    useEffect(() => { refresh() }, [equipoId])

    const onChange = (e) => setF({ ...f, [e.target.name]: e.target.value })

    const save = async (e) => {
        e.preventDefault()
        if (!f.usuarioId) return

        const payload = {
            usuarioId: Number(f.usuarioId),
            observacion: f.observacion?.trim() || null,
            fechaDesde: f.fechaDesde ? parseFromInput(f.fechaDesde) : null,
        }
        await asignarUsuario(equipoId, payload)
        setF({ usuarioId: '', fechaDesde: '', observacion: '' })
        refresh()
    }

    return (
        <div style={{ display: 'grid', gap: 8 }}>
            <h4>Asignación</h4>

            {/* Vigente */}
            <div>
                <b>Vigente:</b>{' '}
                {vigente
                    ? `${usuariosById.get(vigente.usuarioId)?.nombre ?? vigente.usuarioNombre ?? `id ${vigente.usuarioId}`} (desde ${fmtDateTime(vigente.fechaDesde)})`
                    : '- Sin asignación -'}
            </div>

            {/* Alta de asignación */}
            <form onSubmit={save} style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr 1fr auto' }}>
                <select name="usuarioId" value={f.usuarioId} onChange={onChange} required>
                    <option value="">(elige usuario)</option>
                    {usuarios.map((u) => (
                        <option key={u.id} value={u.id}>{u.nombre}</option>
                    ))}
                </select>

                <input
                    type="datetime-local"
                    name="fechaDesde"
                    value={toInputDateTime(f.fechaDesde)}
                    onChange={onChange}
                />

                <input
                    name="observacion"
                    placeholder="Observación"
                    value={f.observacion}
                    onChange={onChange}
                />

                <button>Asignar</button>
            </form>

            {/* Historial */}
            <div>
                <b>Historial:</b>
                <ul>
                    {hist
                        .filter(a => a && (a.usuarioId || a.usuarioNombre || a.fechaDesde))
                        .map(a => {
                            const nombre = usuariosById.get(a.usuarioId)?.nombre ?? a.usuarioNombre ?? `id ${a.usuarioId ?? '?'}`
                            const desde = a.fechaDesde ? fmtDateTime(a.fechaDesde) : null
                            const hasta = a.fechaHasta ? fmtDateTime(a.fechaHasta) : null
                            const obs = a.observacion && a.observacion.trim() ? a.observacion.trim() : null
                            // key estable aunque no haya id
                            const key = a.id ?? `${a.usuarioId ?? 'u?'}-${a.fechaDesde ?? ''}-${a.fechaHasta ?? ''}`
                            return (
                                <li key={key}>
                                    {nombre}
                                    {desde && ` - ${desde}`}
                                    {hasta && ` -> ${hasta}`}
                                    {obs && ` - ${obs}`}
                                </li>
                            )
                        })}
                </ul>
            </div>
        </div>
    )
}
