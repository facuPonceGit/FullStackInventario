// src/api/equipo.js


import api from './client'

export async function listarEquipos() {
    const { data } = await api.get('/api/Equipos')
    return data
}
export async function crearEquipo(payload) {
    const { data } = await api.post('/api/Equipos', payload)
    return data // { id }
}

export async function listarPerifericos(equipoId) {
    const { data } = await api.get(`/api/Equipos/${equipoId}/perifericos`)
    return data
}
export async function agregarPeriferico(equipoId, payload) {
    await api.post(`/api/Equipos/${equipoId}/perifericos`, payload)
}

export async function registrarCambio(equipoId, payload) {
    await api.post(`/api/Equipos/${equipoId}/historial`, payload)
}
export async function listarHistorial(equipoId) {
    const { data } = await api.get(`/api/Equipos/${equipoId}/historial`)
    return data
}

export async function actualizarCompraGarantia(equipoId, payload) {
    // payload: { compra?, garantia?, proveedorId? }
    await api.put(`/api/Equipos/${equipoId}/compra-garantia`, payload)
}

export async function cambiarUbicacion(equipoId, ubicacionId) {
    // 0 o ausencia -> limpia
    await api.put(`/api/Equipos/${equipoId}/ubicacion/${ubicacionId ?? 0}`)
}

export async function asignarUsuario(equipoId, payload) {
    // payload: { usuarioId, fechaDesde?, observacion? }
    await api.post(`/api/Equipos/${equipoId}/asignar`, payload)
}

export async function obtenerAsignacionVigente(equipoId) {
    const { data } = await api.get(`/api/Equipos/${equipoId}/asignacion`)
    return data // o null
}
export async function listarAsignaciones(equipoId) {
    const { data } = await api.get(`/api/Equipos/${equipoId}/asignaciones`)
    return data
}

export async function detalleEquipo(equipoId) {
    const { data } = await api.get(`/api/Equipos/${equipoId}/detalle`)
    return data
}
