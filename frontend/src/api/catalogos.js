// frontend/src/api/catalogo.js
import api from './client'

export async function listarProveedores() {
    const { data } = await api.get('/api/Proveedores')
    return data
}
export async function listarUbicaciones() {
    const { data } = await api.get('/api/Ubicaciones')
    return data
}
export async function listarUsuariosAsignados() {
    const { data } = await api.get('/api/UsuariosAsignados')
    return data
}
