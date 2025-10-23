// frontend/src/api/equipo.js
import client from "./client";

// Listado y CRUD básicos
export const listarEquipos = () => client.get("/api/Equipos").then((r) => r.data);
export const crearEquipo = (payload) => client.post("/api/Equipos", payload).then((r) => r.data);

// Periféricos
export const agregarPeriferico = (id, payload) =>
    client.post(`/api/Equipos/${id}/perifericos`, payload).then((r) => r.data);
export const listarPerifericos = (id) =>
    client.get(`/api/Equipos/${id}/perifericos`).then((r) => r.data);

// Historial de cambios
export const registrarCambio = (id, payload) =>
    client.post(`/api/Equipos/${id}/historial`, payload).then((r) => r.data);
export const listarHistorial = (id) =>
    client.get(`/api/Equipos/${id}/historial`).then((r) => r.data);

// Compra / Garantía / Proveedor
export const actualizarCompraGarantia = (id, payload) =>
    client.put(`/api/Equipos/${id}/compra-garantia`, payload).then((r) => r.data);

// Ubicación (ID opcional en la URL; si 0/null => limpia)
export const cambiarUbicacion = (id, ubicacionId) => {
    const suf = ubicacionId ? `/${ubicacionId}` : "";
    return client.put(`/api/Equipos/${id}/ubicacion${suf}`).then((r) => r.data);
};

// Asignaciones
export const asignarUsuario = (id, payload) =>
    client.post(`/api/Equipos/${id}/asignar`, payload).then((r) => r.data);

export const obtenerAsignacionVigente = (id) =>
    client.get(`/api/Equipos/${id}/asignacion`).then((r) => r.data ?? null);

export const listarAsignaciones = (id) =>
    client.get(`/api/Equipos/${id}/asignaciones`).then((r) => r.data ?? []);

// Ficha integral
export const obtenerDetalle = (id) =>
    client.get(`/api/Equipos/${id}/detalle`).then((r) => r.data);
